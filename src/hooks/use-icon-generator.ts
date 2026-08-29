import { usePostHog } from "@posthog/react";
import { useCallback, useState } from "react";
import { generateIcons } from "~/lib/icon-generator";
import type { ProcessedIconSet } from "~/lib/types";
import { readFileAsDataURL } from "~/lib/utils/file-reader";

/**
 * Hook for processing uploaded images and generating icon sets
 */
export function useIconGenerator() {
  const posthog = usePostHog();
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedIconSet[]>([]);

  const processImage = useCallback(async (file: File): Promise<ProcessedIconSet> => {
    const startTime = Date.now();

    const [originalDataUrl, icons] = await Promise.all([
      readFileAsDataURL(file),
      generateIcons(file),
    ]);

    return {
      original: originalDataUrl,
      icons,
      filename: file.name,
      processingTime: Date.now() - startTime,
    };
  }, []);

  const processFiles = useCallback(
    async (files: File[]) => {
      setProcessing(true);

      const imageFile = files.find((f) => f.type.startsWith("image/"));

      if (!imageFile) {
        setProcessing(false);
        return;
      }

      try {
        const processed = await processImage(imageFile);
        setProcessedImages([processed]);
        posthog?.capture("icons_generated", {
          icon_count: processed.icons.length,
          processing_time_ms: processed.processingTime,
        });
      } catch (error) {
        console.error(`Error processing ${imageFile.name}:`, error);
      } finally {
        setProcessing(false);
      }
    },
    [posthog, processImage],
  );

  const downloadIcon = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);

  const clearAll = useCallback(() => {
    setProcessedImages([]);
  }, []);

  return {
    processing,
    processedImages,
    processFiles,
    downloadIcon,
    clearAll,
  };
}
