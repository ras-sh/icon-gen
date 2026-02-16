export interface GeneratedIcon {
  name: string;
  size: number;
  filename: string;
  dataUrl: string;
}

export interface ProcessedIconSet {
  original: string;
  icons: GeneratedIcon[];
  filename: string;
  processingTime: number;
}

export interface IconSize {
  name: string;
  size: number;
  filename: string;
  format?: "png" | "ico";
}
