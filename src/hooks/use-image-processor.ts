import { useCallback, useState } from "react";
import {
  type GeneratedIcon,
  type IconGeneratorOptions,
  processImageForIcons,
} from "~/lib/icon-generator";

type ProcessedIconSet = {
  original: string;
  icons: GeneratedIcon[];
  filename: string;
  processingTime: number;
};

export function useImageProcessor() {
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedIconSet[]>(
    []
  );
  const [progress, setProgress] = useState(0);

  const processImage = useCallback(
    async (file: File): Promise<ProcessedIconSet> => {
      const startTime = Date.now();

      const reader = new FileReader();
      const originalDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const options: IconGeneratorOptions = {
        progress: (progressPercent) => {
          setProgress(progressPercent);
        },
      };

      const icons = await processImageForIcons(file, options);
      const processingTime = Date.now() - startTime;

      return {
        original: originalDataUrl,
        icons,
        filename: file.name,
        processingTime,
      };
    },
    []
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      setProcessing(true);
      setProgress(0);

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      const file = imageFiles[0]; // Only process first image

      if (!file) {
        setProcessing(false);
        return;
      }

      try {
        const processed = await processImage(file);
        setProcessedImages([processed]); // Replace with single image
        setProgress(100);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      } finally {
        setProcessing(false);
        setProgress(0);
      }
    },
    [processImage]
  );

  const clearAll = useCallback(() => {
    setProcessedImages([]);
  }, []);

  return {
    processing,
    processedImages,
    progress,
    processFiles,
    clearAll,
  };
}
