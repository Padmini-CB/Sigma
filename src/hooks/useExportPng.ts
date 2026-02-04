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

// The exact Google Fonts URL from layout.tsx <link>
const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Saira+Condensed:wght@400;600;700;800&display=swap';

/**
 * Fetches the Google Fonts CSS, downloads every referenced .woff2 file,
 * converts each to a base64 data URI, and returns a <style> element with
 * fully self-contained @font-face rules. This guarantees fonts render
 * correctly inside an SVG foreignObject data URI (which cannot load
 * external resources).
 */
async function buildInlineFontStyle(): Promise<HTMLStyleElement | null> {
  try {
    const res = await fetch(GOOGLE_FONTS_CSS_URL);
    if (!res.ok) return null;
    let css = await res.text();

    // Find every font-file URL in the CSS
    const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
    const urls = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = urlRegex.exec(css)) !== null) urls.add(m[1]);

    // Fetch each font file and replace URL with base64 data URI
    await Promise.all(
      [...urls].map(async (url) => {
        try {
          const fontRes = await fetch(url);
          if (!fontRes.ok) return;
          const blob = await fontRes.blob();
          const dataUri = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          css = css.replaceAll(url, dataUri);
        } catch {
          // Skip individual font files that fail — better to export
          // with partial fonts than to fail entirely.
        }
      }),
    );

    const style = document.createElement('style');
    style.textContent = css;
    return style;
  } catch {
    // Non-fatal: export will proceed with system fonts
    console.warn('Failed to embed Google Fonts — export will use fallback fonts');
    return null;
  }
}

export function useExportPng(): UseExportPngReturn {
  const [isExporting, setIsExporting] = useState(false);
  const isExportingRef = useRef(false);

  const exportPng = useCallback(async (element: HTMLElement | null, options: ExportOptions) => {
    if (!element || isExportingRef.current) return;

    const { templateName, width, height } = options;

    isExportingRef.current = true;
    setIsExporting(true);

    // We build a fresh, clean container at export time rather than
    // capturing the hidden offscreen div directly. This avoids:
    //   - overflow:hidden clipping the CTA button
    //   - CSS transforms from the scaled preview leaking in
    //   - Layout quirks from position:fixed at -99999px
    //   - Inherited outlines / focus styles
    const container = document.createElement('div');

    try {
      // 1. Wait for the browser to finish loading all Google Fonts
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // 2. Fetch Google Fonts and embed as inline base64 @font-face
      //    rules so they survive the SVG foreignObject data-URI context
      const fontStyle = await buildInlineFontStyle();

      // 3. Dynamic import dom-to-image-more (avoid SSR failures)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import('dom-to-image-more') as any;
      const domtoimage = mod.default || mod;
      if (typeof domtoimage.toBlob !== 'function') {
        throw new Error(
          `dom-to-image-more loaded but toBlob is not a function. ` +
          `Keys: [${Object.keys(mod).join(', ')}]`,
        );
      }

      // 4. Build a clean capture container at full native resolution
      container.style.position = 'fixed';
      container.style.left = '0px';
      container.style.top = '0px';
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      container.style.zIndex = '-9999';
      container.style.pointerEvents = 'none';
      // NO overflow:hidden — prevents CTA clipping
      // NO transform     — prevents scaling artifacts

      // Inject inline fonts so they are available in the SVG context
      if (fontStyle) {
        container.appendChild(fontStyle);
      }

      // Reset outlines/borders that bleed in from :focus-visible and
      // other interactive styles in the global stylesheet
      const resetStyle = document.createElement('style');
      resetStyle.textContent = '* { outline: none !important; outline-offset: 0 !important; }';
      container.appendChild(resetStyle);

      // 5. Clone the template content from the hidden export div.
      //    The source element is rendered by React at full native
      //    resolution with no transforms — we just need to strip the
      //    overflow:hidden that was on it.
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      clone.style.overflow = 'visible';
      clone.style.position = 'relative';
      container.appendChild(clone);

      // 6. Attach to DOM and wait for browser to compute layout + fonts
      document.body.appendChild(container);
      await new Promise((r) => requestAnimationFrame(r));
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // 7. Capture the container at exact native resolution
      const blob: Blob = await domtoimage.toBlob(container, {
        width,
        height,
        cacheBust: true,
      });

      if (!blob || blob.size === 0) {
        throw new Error(`Export produced empty image (blob size: ${blob?.size ?? 'null'})`);
      }

      // 8. Trigger file download
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

      // Delay cleanup so the browser can start the download
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('PNG export failed:', error);
      throw error;
    } finally {
      // Always clean up the capture container
      if (container.parentNode) {
        document.body.removeChild(container);
      }
      isExportingRef.current = false;
      setIsExporting(false);
    }
  }, []);

  return { exportPng, isExporting };
}
