import { Request, Response } from 'express';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
} from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { join } from 'path';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as dotenv from 'dotenv';

// --- Load Environment Variables ---
// This loads the variables from your .env file (e.g., CLOUDINARY_API_KEY)
dotenv.config();

// --- Cloudinary Configuration ---
// This block is essential. It provides the SDK with your credentials.
// It must be run before any other Cloudinary operations are called.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // It's good practice to ensure secure URLs
});


// --- Promisify the pipeline function for async/await syntax ---
const streamPipeline = promisify(pipeline);

// --- Real Cloudinary Upload Function ---
const uploadToCloudinary = (filePath: string): Promise<UploadApiResponse> => {
  console.log(`Uploading ${filePath} to Cloudinary...`);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: 'auto',
        chunk_size: 6 * 1024 * 1024,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed:', error);
          return reject(error);
        }
        if (result) {
            console.log('Cloudinary upload complete.');
            resolve(result);
        } else {
            reject(new Error('Cloudinary upload did not return a result.'));
        }
      }
    );
  });
};


// --- Main Handler Logic ---
const UPLOAD_DIR = join(__dirname, '../../uploads');

export const handleChunkedUpload = async (req: Request, res: Response): Promise<void> => {
  const uniqueUploadId = req.headers['x-unique-upload-id'] as string;
  const contentRange = req.headers['content-range'] as string;

  if (!uniqueUploadId || !contentRange) {
    res.status(400).json({ error: 'Missing required headers.' });
    return;
  }

  const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);
  if (!match) {
    res.status(400).json({ error: 'Invalid Content-Range format.' });
    return;
  }

  const totalSize = parseInt(match[3], 10);

  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const tempFilePath = join(UPLOAD_DIR, `${uniqueUploadId}.tmp`);
  
  const writeStream = createWriteStream(tempFilePath, { flags: 'a' });

  try {
    await streamPipeline(req, writeStream);
    console.log(`Chunk written to ${tempFilePath}`);

    const fileStats = statSync(tempFilePath);
    console.log(`Checking file size: ${fileStats.size} / ${totalSize}`);

    if (fileStats.size === totalSize) {
      console.log('Final chunk received. Uploading to Cloudinary...');
      const result = await uploadToCloudinary(tempFilePath);
      
      unlinkSync(tempFilePath);
      
      console.log('Upload complete. Sending final URL to client.');
      res.status(200).json({ status: 'Upload complete', url: result.secure_url });

    } else if (fileStats.size > totalSize) {
        unlinkSync(tempFilePath);
        res.status(500).json({ error  : 'File size mismatch, upload corrupted.' });
    }
    else {
      res.status(200).json({ status: 'Chunk received' });
    }
  } catch (err) {
    console.error('Failed to process chunk:', err);
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }
    res.status(500).json({ error: 'Error processing file chunk', details: (err as Error).message });
  }
};