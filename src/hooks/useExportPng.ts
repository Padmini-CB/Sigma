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

/**
 * Fetches Google Fonts CSS and converts all font files to base64 @font-face rules.
 * This ensures fonts render correctly in the exported PNG since dom-to-image
 * serializes to SVG which can't load external font URLs.
 */
async function fetchGoogleFontsAsBase64(): Promise<string> {
  // Find all Google Fonts stylesheet links
  const fontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .filter(link => link.getAttribute('href')?.includes('fonts.googleapis.com'));

  if (fontLinks.length === 0) {
    return '';
  }

  const fontFaceRules: string[] = [];

  for (const link of fontLinks) {
    const href = link.getAttribute('href');
    if (!href) continue;

    try {
      // Fetch the CSS from Google Fonts
      // Use a User-Agent that returns woff2 format for smaller file sizes
      const cssResponse = await fetch(href, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!cssResponse.ok) continue;

      const cssText = await cssResponse.text();

      // Parse @font-face rules and extract font URLs
      const fontFaceRegex = /@font-face\s*\{[^}]+\}/g;
      const urlRegex = /url\(([^)]+)\)/g;

      const fontFaces = cssText.match(fontFaceRegex) || [];

      for (const fontFace of fontFaces) {
        let modifiedFontFace = fontFace;
        const urls = fontFace.match(urlRegex) || [];

        for (const urlMatch of urls) {
          // Extract the actual URL (remove url() wrapper and quotes)
          const fontUrl = urlMatch
            .replace(/^url\(/, '')
            .replace(/\)$/, '')
            .replace(/['"]/g, '');

          try {
            // Fetch the font file and convert to base64
            const fontResponse = await fetch(fontUrl);
            if (!fontResponse.ok) continue;

            const fontBlob = await fontResponse.blob();
            const base64 = await blobToBase64(fontBlob);

            // Determine the font format from the URL
            let format = 'woff2';
            if (fontUrl.includes('.woff2')) format = 'woff2';
            else if (fontUrl.includes('.woff')) format = 'woff';
            else if (fontUrl.includes('.ttf')) format = 'truetype';
            else if (fontUrl.includes('.otf')) format = 'opentype';

            // Replace the URL with the base64 data URI
            modifiedFontFace = modifiedFontFace.replace(
              urlMatch,
              `url(${base64}) format('${format}')`
            );
          } catch (fontError) {
            console.warn('Failed to fetch font file:', fontUrl, fontError);
          }
        }

        fontFaceRules.push(modifiedFontFace);
      }
    } catch (cssError) {
      console.warn('Failed to fetch Google Fonts CSS:', href, cssError);
    }
  }

  return fontFaceRules.join('\n');
}

/**
 * Converts a Blob to a base64 data URI
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Creates CSS reset styles to fix export artifacts
 */
function getResetStyles(): string {
  return `
    * {
      outline: none !important;
      outline-width: 0 !important;
    }
    *:focus,
    *:focus-visible,
    *:focus-within {
      outline: none !important;
      outline-width: 0 !important;
      box-shadow: none !important;
    }
  `;
}

export function useExportPng(): UseExportPngReturn {
  const [isExporting, setIsExporting] = useState(false);
  const isExportingRef = useRef(false);

  const exportPng = useCallback(async (element: HTMLElement | null, options: ExportOptions) => {
    if (!element || isExportingRef.current) return;

    const { templateName, width, height } = options;

    isExportingRef.current = true;
    setIsExporting(true);

    let offscreenContainer: HTMLDivElement | null = null;

    try {
      // Wait for all fonts (Google Fonts loaded via <link>) to finish
      // loading before we capture. Without this, text can render with
      // fallback fonts or invisible glyphs.
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Fetch Google Fonts and convert to base64 @font-face rules
      const fontFaceCSS = await fetchGoogleFontsAsBase64();

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

      // Create a hidden offscreen container at full native resolution.
      // This fixes:
      //   - CTA clipping: no overflow:hidden, full resolution capture
      //   - Layout shift: position:fixed off-screen, no transforms
      offscreenContainer = document.createElement('div');
      offscreenContainer.style.cssText = `
        position: fixed;
        left: -99999px;
        top: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: visible;
        transform: none;
        pointer-events: none;
        z-index: -1;
      `;

      // Clone the template content into the offscreen container
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Reset the cloned element's styles for full-resolution capture
      clonedElement.style.cssText = `
        width: ${width}px;
        height: ${height}px;
        transform: none;
        position: relative;
        overflow: visible;
      `;

      // Create and inject the style reset element to fix blue focus outlines
      const resetStyleElement = document.createElement('style');
      resetStyleElement.textContent = getResetStyles();
      clonedElement.insertBefore(resetStyleElement, clonedElement.firstChild);

      // Inject base64 @font-face rules if we have them
      if (fontFaceCSS) {
        const fontStyleElement = document.createElement('style');
        fontStyleElement.textContent = fontFaceCSS;
        clonedElement.insertBefore(fontStyleElement, clonedElement.firstChild);
      }

      offscreenContainer.appendChild(clonedElement);
      document.body.appendChild(offscreenContainer);

      // Give the browser a moment to apply styles and layout
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the offscreen container which has the cloned content
      // at full native resolution without any scaling or clipping
      const blob: Blob = await domtoimage.toBlob(clonedElement, {
        width,
        height,
        cacheBust: true,
        style: {
          transform: 'none',
          overflow: 'visible',
        },
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
      // Clean up the offscreen container
      if (offscreenContainer && offscreenContainer.parentNode) {
        offscreenContainer.parentNode.removeChild(offscreenContainer);
      }
      isExportingRef.current = false;
      setIsExporting(false);
    }
  }, []);

  return { exportPng, isExporting };
}
