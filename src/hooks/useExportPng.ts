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
      // Dynamic import to avoid SSR/build failures on Vercel
      const html2canvas = (await import('html2canvas')).default;

      // Clone element and position on-screen for reliable html2canvas capture.
      // html2canvas cannot render elements at extreme offscreen positions
      // (e.g. position: fixed; left: -99999px) — it produces a blank canvas.
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '0px';
      clone.style.top = '0px';
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      clone.style.zIndex = '-9999';
      clone.style.pointerEvents = 'none';
      clone.style.overflow = 'hidden';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        width,
        height,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      // Remove clone immediately after capture
      document.body.removeChild(clone);

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

      // Delay revokeObjectURL so the browser has time to start the download.
      // Revoking immediately after click() kills the download silently.
      setTimeout(() => URL.revokeObjectURL(url), 5000);
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
