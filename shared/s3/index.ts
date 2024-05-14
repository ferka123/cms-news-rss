import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { s3Config } from "./config";
import * as crypto from "crypto";

const s3Client = new S3({
  endpoint: s3Config.S3_ENDPOINT,
  region: s3Config.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: s3Config.S3_ACCESS_KEY,
    secretAccessKey: s3Config.S3_SECRET_KEY,
  },
});

export const generateRandomKey = () => crypto.randomBytes(16).toString("hex");

export const generateHashKey = (buffer: Buffer) =>
  crypto.createHash("sha1").update(buffer).digest("hex");

const getAbsoulteUrl = (keyName: string) =>
  `${s3Config.S3_ENDPOINT}/${s3Config.S3_BUCKET_NAME}/${keyName}`;

export async function putFile(
  buffer: Buffer,
  keyName: string,
  ContentType?: string
) {
  const command = new PutObjectCommand({
    Bucket: s3Config.S3_BUCKET_NAME,
    Key: keyName,
    Body: buffer,
    ContentType,
  });

  try {
    const response = await s3Client.send(command);
    console.log(`Successfully uploaded file. ETag: ${response.ETag}`);
    return getAbsoulteUrl(keyName);
  } catch (error) {
    console.error("Error uploading file: ", error);
    return null;
  }
}
