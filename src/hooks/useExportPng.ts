'use client';

import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';

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

  const exportPng = useCallback(async (element: HTMLElement | null, options: ExportOptions) => {
    if (!element || isExporting) return;

    const { templateName, width, height } = options;

    setIsExporting(true);

    try {
      // Capture the element using html2canvas
      const canvas = await html2canvas(element, {
        width,
        height,
        scale: 1, // Render at exact pixel dimensions
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (!blob) {
        throw new Error('Failed to create PNG blob');
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Generate filename: template-name_widthxheight.png
      const sanitizedName = templateName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const filename = `${sanitizedName}_${width}x${height}.png`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  return { exportPng, isExporting };
}
