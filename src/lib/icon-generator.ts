import { ICON_SIZES } from "./constants";
import type { GeneratedIcon, IconSize } from "./types";

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to encode image"));
      }
    }, "image/png");
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function resizeImage(image: ImageBitmap, size: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is unavailable");
  }

  const scale = Math.min(size / image.width, size / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);

  return canvasToBlob(canvas);
}

async function pngToIco(png: Blob, size: number): Promise<Blob> {
  const pngBytes = new Uint8Array(await png.arrayBuffer());
  const header = new ArrayBuffer(22);
  const view = new DataView(header);

  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  view.setUint8(6, size === 256 ? 0 : size);
  view.setUint8(7, size === 256 ? 0 : size);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngBytes.byteLength, true);
  view.setUint32(18, header.byteLength, true);

  return new Blob([header, pngBytes], { type: "image/x-icon" });
}

async function generateIcon(image: ImageBitmap, iconSize: IconSize): Promise<GeneratedIcon> {
  const png = await resizeImage(image, iconSize.size);
  const output = iconSize.format === "ico" ? await pngToIco(png, iconSize.size) : png;

  return {
    name: iconSize.name,
    size: iconSize.size,
    filename: iconSize.filename,
    dataUrl: await blobToDataUrl(output),
  };
}

export async function generateIcons(file: File): Promise<GeneratedIcon[]> {
  const image = await createImageBitmap(file);

  try {
    return await Promise.all(ICON_SIZES.map((iconSize) => generateIcon(image, iconSize)));
  } finally {
    image.close();
  }
}
