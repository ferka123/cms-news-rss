"use server";

import { convertImage } from "@shared/sharp";
import { ActionError } from "../action-client";
import { generateHashKey, putFile } from "@shared/s3";
import { db } from "../db";

const CONVERT_EXT = "webp";
export const uploadMedia = async (formdata: FormData) => {
  try {
    const image: File | null = formdata.get("file") as unknown as File;
    if (!image) {
      throw new ActionError("No file uploaded");
    }

    if (image.type.split("/")[0] !== "image") {
      throw new ActionError("File is not an image");
    }

    if (image.size > 2 * 1024 * 1024) {
      throw new ActionError("File is too large");
    }

    const arrayBuffer = await image.arrayBuffer();

    const { data, info } = await convertImage(arrayBuffer, CONVERT_EXT);
    const uploadResult = await putFile(
      data,
      `${generateHashKey(Buffer.from(arrayBuffer))}.${CONVERT_EXT}`,
      `image/${CONVERT_EXT}`
    );

    if (!uploadResult) {
      throw new Error();
    }

    const result = db.media.create({
      data: { src: uploadResult, width: info.width, height: info.height },
    });

    return result;
  } catch (e) {
    console.log(e);
    if (e instanceof ActionError) {
      throw e;
    } else throw new ActionError("Failed to upload image");
  }
};
