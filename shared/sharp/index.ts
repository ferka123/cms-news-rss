import sharp, { FormatEnum } from "sharp";

export const convertImage = (
  buffer: ArrayBuffer,
  convertTo: keyof FormatEnum = "webp",
  width = 1800
) => {
  return sharp(buffer, { density: 300 })
    .rotate()
    .resize({ withoutEnlargement: true, width })
    .toFormat(convertTo)
    .toBuffer({ resolveWithObject: true });
};

export const getMetaData = (buffer: ArrayBuffer) => sharp(buffer).metadata();
