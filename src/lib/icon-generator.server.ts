import { createServerFn } from "@tanstack/react-start";
import sharp from "sharp";
import sharpicolib from "sharp-ico";
import { z } from "zod";
import { ICON_SIZES } from "./constants";
import type { GeneratedIcon, IconSize } from "./types";

const GenerateIconsInputSchema = z.object({
  imageBuffer: z.string(),
});

type GenerateIconsResult = {
  icons: GeneratedIcon[];
  originalFilename: string;
};

/**
 * Resizes an image buffer to the specified size with transparent background
 */
function resizeImageToPNG(buffer: Buffer, size: number): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

/**
 * Generates a single icon from the source buffer
 */
async function generateSingleIcon(
  buffer: Buffer,
  iconSize: IconSize
): Promise<GeneratedIcon> {
  let resizedBuffer: Buffer;
  let mimeType: string;

  if (iconSize.format === "ico") {
    // Generate ICO file
    const pngBuffer = await resizeImageToPNG(buffer, iconSize.size);
    resizedBuffer = await sharpicolib.encode([pngBuffer]);
    mimeType = "image/x-icon";
  } else {
    // Generate PNG
    resizedBuffer = await resizeImageToPNG(buffer, iconSize.size);
    mimeType = "image/png";
  }

  const dataUrl = `data:${mimeType};base64,${resizedBuffer.toString("base64")}`;

  return {
    name: iconSize.name,
    size: iconSize.size,
    filename: iconSize.filename,
    dataUrl,
  };
}

/**
 * Server function to generate all icon sizes from an uploaded image
 */
export const generateIcons = createServerFn({ method: "POST" })
  .inputValidator(GenerateIconsInputSchema)
  .handler(async ({ data }): Promise<GenerateIconsResult> => {
    const { imageBuffer } = data;
    const buffer = Buffer.from(imageBuffer, "base64");

    const icons = await Promise.all(
      ICON_SIZES.map((iconSize) => generateSingleIcon(buffer, iconSize))
    );

    return {
      icons,
      originalFilename: "icon",
    };
  });
