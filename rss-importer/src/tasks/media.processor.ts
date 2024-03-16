import { RssItem } from "../parser/schemas";
import { convertImage } from "../../../shared/sharp";
import { generateHashKey, putFile } from "../../../shared/s3";

const CONVERT_EXT = "webp";

export const processMedia = async <T extends Pick<RssItem, "media">>(
  item: T
): Promise<
  Omit<T, "media"> & {
    media: null | { src: string; height: number; width: number };
  }
> => {
  try {
    if (!item.media) return { ...item, media: null };

    const file = await fetch(item.media).then((res) => res.arrayBuffer());
    const { data, info } = await convertImage(file, CONVERT_EXT);
    const uploadResult = await putFile(
      data,
      `${generateHashKey(Buffer.from(file))}.${CONVERT_EXT}`,
      `image/${CONVERT_EXT}`
    );

    return {
      ...item,
      media: uploadResult
        ? { src: uploadResult, width: info.width, height: info.height }
        : null,
    };
  } catch (e) {
    console.error("Failed to upload image.", e);
    return { ...item, media: null };
  }
};
