import { useCallback } from "react";

export function useImageDownloader() {
  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);

  const formatProcessingTime = useCallback((time: number) => {
    const ONE_SECOND = 1000;
    return time < ONE_SECOND
      ? `${time}ms`
      : `${(time / ONE_SECOND).toFixed(1)}s`;
  }, []);

  return {
    downloadImage,
    formatProcessingTime,
  };
}
