import { type GeneratedIcon, generateIcons } from "./icon-generator.server";

export type { GeneratedIcon } from "./icon-generator.server";

export type IconGeneratorOptions = {
  progress?: (percent: number) => void;
};

export async function processImageForIcons(
  file: File,
  options?: IconGeneratorOptions
): Promise<GeneratedIcon[]> {
  // Read file as base64 using FileReader
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = result.split(",")[1];
      if (!base64Data) {
        reject(new Error("Failed to convert image to base64"));
        return;
      }
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Update progress
  options?.progress?.(10);

  // Call server function to generate icons
  const result = await generateIcons({
    data: {
      imageBuffer: base64,
    },
  });

  // Update progress
  options?.progress?.(90);

  return result.icons;
}
