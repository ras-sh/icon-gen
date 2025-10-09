import { createServerFn } from "@tanstack/react-start";
import sharp from "sharp";
import sharpicolib from "sharp-ico";
import { z } from "zod";

type IconSize = {
  name: string;
  size: number;
  filename: string;
  format?: "png" | "ico";
};

const ICON_SIZES: IconSize[] = [
  { name: "favicon-16x16", size: 16, filename: "favicon-16x16.png" },
  { name: "favicon-32x32", size: 32, filename: "favicon-32x32.png" },
  { name: "favicon-ico", size: 48, filename: "favicon.ico", format: "ico" },
  { name: "apple-touch-icon", size: 180, filename: "apple-touch-icon.png" },
  {
    name: "android-chrome-192x192",
    size: 192,
    filename: "android-chrome-192x192.png",
  },
  {
    name: "android-chrome-512x512",
    size: 512,
    filename: "android-chrome-512x512.png",
  },
];

export type GeneratedIcon = {
  name: string;
  size: number;
  filename: string;
  dataUrl: string;
};

const GenerateIconsInputSchema = z.object({
  imageBuffer: z.string(),
});

type GenerateIconsResult = {
  icons: GeneratedIcon[];
  originalFilename: string;
};

export const generateIcons = createServerFn({ method: "POST" })
  .inputValidator(GenerateIconsInputSchema)
  .handler(async ({ data }): Promise<GenerateIconsResult> => {
    const { imageBuffer } = data;

    // Convert base64 to buffer
    const buffer = Buffer.from(imageBuffer, "base64");

    // Generate all icon sizes
    const iconPromises = ICON_SIZES.map(async (iconSize) => {
      let resizedBuffer: Buffer;
      let mimeType: string;

      if (iconSize.format === "ico") {
        // Generate ICO file
        const pngBuffer = await sharp(buffer)
          .resize(iconSize.size, iconSize.size, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer();

        resizedBuffer = await sharpicolib.encode([pngBuffer]);
        mimeType = "image/x-icon";
      } else {
        // Generate PNG
        resizedBuffer = await sharp(buffer)
          .resize(iconSize.size, iconSize.size, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer();

        mimeType = "image/png";
      }

      const dataUrl = `data:${mimeType};base64,${resizedBuffer.toString("base64")}`;

      return {
        name: iconSize.name,
        size: iconSize.size,
        filename: iconSize.filename,
        dataUrl,
      };
    });

    const icons = await Promise.all(iconPromises);

    return {
      icons,
      originalFilename: "icon",
    };
  });
