import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB

export const uploadToCloudinary = async (filePath: string, tags: string[] = ['nodejs-chunked']) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        tags,
        resource_type: 'auto',
        chunk_size: CHUNK_SIZE,
      },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result);
      }
    );
  });
};
