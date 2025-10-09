export type GeneratedIcon = {
  name: string;
  size: number;
  filename: string;
  dataUrl: string;
};

export type ProcessedIconSet = {
  original: string;
  icons: GeneratedIcon[];
  filename: string;
  processingTime: number;
};

export type IconSize = {
  name: string;
  size: number;
  filename: string;
  format?: "png" | "ico";
};
