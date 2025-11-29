import { usePostHog } from "@posthog/react";
import { useCallback, useState } from "react";
import { generateIcons } from "~/lib/icon-generator.server";
import type { ProcessedIconSet } from "~/lib/types";
import { fileToBase64, readFileAsDataURL } from "~/lib/utils/file-reader";

/**
 * Hook for processing uploaded images and generating icon sets
 */
export function useIconGenerator() {
  const posthog = usePostHog();
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedIconSet[]>(
    []
  );

  const processImage = useCallback(
    async (file: File): Promise<ProcessedIconSet> => {
      const startTime = Date.now();

      // Read file for preview and server processing
      const [originalDataUrl, base64] = await Promise.all([
        readFileAsDataURL(file),
        fileToBase64(file),
      ]);

      // Generate icons on server
      const result = await generateIcons({
        data: { imageBuffer: base64 },
      });

      return {
        original: originalDataUrl,
        icons: result.icons,
        filename: file.name,
        processingTime: Date.now() - startTime,
      };
    },
    []
  );

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
    [posthog, processImage]
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
