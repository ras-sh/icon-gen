import { ResultsView } from "~/components/results-view";
import { UploadZone } from "~/components/upload-zone";
import { useIconGenerator } from "~/hooks/use-icon-generator";

export function IconGenerator() {
  const { processing, processedImages, processFiles, downloadIcon, clearAll } =
    useIconGenerator();

  const showResults = processedImages.length > 0;

  return (
    <div className="w-full">
      {showResults && processedImages[0] ? (
        <ResultsView
          onDownloadImage={downloadIcon}
          onProcessMore={clearAll}
          processedImage={processedImages[0]}
        />
      ) : (
        <UploadZone onDrop={processFiles} processing={processing} />
      )}
    </div>
  );
}
