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
      // Wait for all fonts to be loaded before capturing
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Additional delay to ensure fonts are fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Dynamic import to avoid SSR issues
      const htmlToImage = await import('html-to-image');

      // Filter function to remove focus outlines and box shadows
      const filterNode = (node: HTMLElement): boolean => {
        if (node.style) {
          node.style.outline = 'none';
          node.style.outlineWidth = '0';
          node.style.boxShadow = 'none';
        }
        return true;
      };

      // Generate the PNG using html-to-image
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        width: width,
        height: height,
        style: {
          transform: 'none',
          overflow: 'visible',
        },
        filter: filterNode,
        cacheBust: true,
      });

      // Create download link and trigger download
      const link = document.createElement('a');
      const sanitizedName = templateName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      link.href = dataUrl;
      link.download = `${sanitizedName}_${width}x${height}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
