import { Button } from "@ras-sh/ui";
import { Download, RotateCcw } from "lucide-react";
import { IconInstructions } from "~/components/icon-instructions";
import type { GeneratedIcon, ProcessedIconSet } from "~/lib/types";

type ResultsViewProps = {
  processedImage: ProcessedIconSet;
  onDownloadImage: (dataUrl: string, filename: string) => void;
  onProcessMore: () => void;
};

export function ResultsView({
  processedImage,
  onDownloadImage,
  onProcessMore,
}: ResultsViewProps) {
  function downloadIcon(icon: GeneratedIcon) {
    window.umami?.track("icon_downloaded", {
      icon_name: icon.name,
      icon_size: icon.size,
    });
    onDownloadImage(icon.dataUrl, icon.filename);
  }

  function downloadAll() {
    window.umami?.track("download_all_icons_clicked", {
      icon_count: processedImage.icons.length,
    });
    // Download each icon
    for (const icon of processedImage.icons) {
      onDownloadImage(icon.dataUrl, icon.filename);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-between">
        <Button
          data-umami-event="process_new_image_clicked"
          onClick={onProcessMore}
          variant="default"
        >
          <RotateCcw className="size-4" />
          Process New Image
        </Button>

        <Button
          data-umami-event="download_all_icons_clicked"
          onClick={downloadAll}
          variant="outline"
        >
          <Download className="size-4" />
          Download All Icons
        </Button>
      </div>

      <div className="space-y-6">
        {/* Original image preview */}
        <div className="space-y-2">
          <h3 className="font-semibold text-zinc-100">Original Image</h3>
          <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-[conic-gradient(#e5e5e5_90deg,#ffffff_90deg_180deg,#e5e5e5_180deg_270deg,#ffffff_270deg)] bg-[length:20px_20px] p-8">
            <img
              alt="Original"
              className="mx-auto max-h-64 object-contain"
              height="256"
              src={processedImage.original}
              width="auto"
            />
          </div>
        </div>

        {/* Generated icons grid */}
        <div className="space-y-2">
          <h3 className="font-semibold text-zinc-100">
            Generated Icons ({processedImage.icons.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {processedImage.icons.map((icon) => (
              <div
                className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
                key={icon.name}
              >
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-[conic-gradient(#e5e5e5_90deg,#ffffff_90deg_180deg,#e5e5e5_180deg_270deg,#ffffff_270deg)] bg-[length:20px_20px]">
                  <img
                    alt={icon.name}
                    className="image-rendering-pixelated"
                    height={icon.size}
                    src={icon.dataUrl}
                    style={{ imageRendering: "pixelated" }}
                    width={icon.size}
                  />
                </div>
                <div className="space-y-1">
                  <p className="truncate font-mono text-xs text-zinc-300">
                    {icon.filename}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {icon.size}×{icon.size}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => downloadIcon(icon)}
                  size="sm"
                  variant="outline"
                >
                  <Download className="size-3" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage instructions */}
        <IconInstructions />
      </div>
    </div>
  );
}
