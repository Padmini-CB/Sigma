'use client';

import { useCallback, useRef, useState } from 'react';

interface ExportOptions {
  templateName: string;
  width: number;
  height: number;
}

interface UseExportPngReturn {
  exportPng: (element: HTMLElement | null, options: ExportOptions) => Promise<void>;
  isExporting: boolean;
}

export function useExportPng(): UseExportPngReturn {
  const [isExporting, setIsExporting] = useState(false);
  const isExportingRef = useRef(false);

  const exportPng = useCallback(async (element: HTMLElement | null, options: ExportOptions) => {
    if (!element || isExportingRef.current) return;

    const { templateName, width, height } = options;

    isExportingRef.current = true;
    setIsExporting(true);

    try {
      // Wait for all fonts (Google Fonts loaded via <link>) to finish
      // loading before we capture. Without this, text can render with
      // fallback fonts or invisible glyphs.
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Dynamic import to avoid SSR/build failures on Vercel.
      // Handle both ESM default export and CJS module.exports since
      // Turbopack's interop behavior varies between dev and production.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import('dom-to-image-more') as any;
      const domtoimage = mod.default || mod;

      if (typeof domtoimage.toBlob !== 'function') {
        throw new Error(
          `dom-to-image-more loaded but toBlob is not a function. ` +
          `Module keys: [${Object.keys(mod).join(', ')}]`
        );
      }

      // dom-to-image-more works by:
      //   1. Cloning the target element
      //   2. Inlining every computed style (already resolved by the
      //      browser — CSS custom properties, Tailwind utilities, etc.
      //      are all collapsed to final values)
      //   3. Embedding fonts by fetching cross-origin @font-face rules
      //      and converting font files to base64 data URIs
      //   4. Serializing the clone to an SVG foreignObject
      //   5. Drawing the SVG to a canvas
      //   6. Exporting the canvas as a PNG blob
      //
      // This bypasses every issue html2canvas had:
      //   - CSS custom property chains  → resolved by getComputedStyle
      //   - backdrop-filter             → serialized into SVG correctly
      //   - Offscreen elements          → computed styles are valid
      //   - Cross-origin Google Fonts   → fetched and embedded as base64

      const blob: Blob = await domtoimage.toBlob(element, {
        width,
        height,
        cacheBust: true,
      });

      if (!blob || blob.size === 0) {
        throw new Error(`Export produced empty image (blob size: ${blob?.size ?? 'null'})`);
      }

      // Trigger file download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const sanitizedName = templateName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      link.href = url;
      link.download = `${sanitizedName}_${width}x${height}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Delay revokeObjectURL so the browser has time to start the
      // download. Revoking immediately after click() silently kills it.
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('PNG export failed:', error);
      throw error;
    } finally {
      isExportingRef.current = false;
      setIsExporting(false);
    }
  }, []);

  return { exportPng, isExporting };
}
