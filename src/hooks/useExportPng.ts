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

    // The export element lives inside a wrapper div that is positioned
    // offscreen (position: fixed; left: -99999px). html2canvas cannot
    // capture elements at extreme offscreen positions — it produces a
    // blank canvas. Rather than cloning (which loses computed layout and
    // styles), we temporarily reposition the actual wrapper on-screen
    // behind all page content, capture it, then restore it.
    const wrapper = element.parentElement;

    try {
      // Dynamic import avoids SSR/build failures on Vercel.
      // Handle both ESM default export and CJS module.exports, since
      // Turbopack's CJS→ESM interop may or may not wrap html2canvas.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2canvasMod = await import('html2canvas') as any;
      const html2canvas = html2canvasMod.default || html2canvasMod;

      if (typeof html2canvas !== 'function') {
        throw new Error('html2canvas failed to load');
      }

      // Wait for Google Fonts to finish loading. html2canvas v1.4.1 does
      // NOT do this internally — without it, text renders with fallback
      // fonts or invisible glyphs.
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Temporarily move the wrapper on-screen behind all content.
      // z-index: -1 keeps it invisible to the user.
      let canvas: HTMLCanvasElement;
      try {
        if (wrapper) {
          wrapper.style.left = '0px';
          wrapper.style.top = '0px';
          wrapper.style.zIndex = '-1';
        }

        // Wait one animation frame so the browser computes layout at
        // the new position. Without this, getComputedStyle() returns
        // stale values and html2canvas renders a blank canvas.
        await new Promise((resolve) => requestAnimationFrame(resolve));

        canvas = await html2canvas(element, {
          width,
          height,
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          logging: false,
        });
      } finally {
        // ALWAYS restore offscreen position, even if capture throws
        if (wrapper) {
          wrapper.style.left = '-99999px';
          wrapper.style.top = '-99999px';
          wrapper.style.zIndex = '';
        }
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (!blob) {
        throw new Error('Failed to create PNG blob');
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
      console.error('Export failed:', error);
      throw error;
    } finally {
      isExportingRef.current = false;
      setIsExporting(false);
    }
  }, []);

  return { exportPng, isExporting };
}
