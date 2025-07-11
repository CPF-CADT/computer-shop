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

import { uploadToCloudinary } from '../service/FileUpload';




/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Chunked file upload and Cloudinary integration
 */

/**
 * @swagger
 * /api/service/upload:
 *   post:
 *     summary: Upload a file chunk (resumable upload)
 *     tags: [Service]
 *     description: Uploads a chuznk of a file. When all chunks are received, the file is uploaded to Cloudinary.
 *     consumes:
 *       - application/octet-stream
 *     parameters:
 *       - in: header
 *         name: x-unique-upload-id
 *         required: true
 *         schema:
 *           type: string
 *         description: A unique identifier for the file upload session.
 *       - in: header
 *         name: content-range
 *         required: true
 *         schema:
 *           type: string
 *         description: Byte range of the current chunk (e.g., bytes 0-999/4000).
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *             description: Raw binary file chunk. This endpoint is not testable via Swagger UI.frontend app for actual uploads.
 *     responses:
 *       200:
 *         description: Chunk received or upload completed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: Chunk received
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: Upload complete
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *       400:
 *         description: Missing required headers or invalid format
 *       500:
 *         description: Error processing file chunk
 */

const streamPipeline = promisify(pipeline);

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
      console.log(`Temporary file deleted: ${tempFilePath}`);

      console.log('Upload complete. Sending final URL to client.');
      res.status(200).json({ status: 'Upload complete', url: result.secure_url });

    } else if (fileStats.size > totalSize) {
      unlinkSync(tempFilePath);
      console.error(`Temporary file deleted due to size mismatch: ${tempFilePath}`);
      res.status(500).json({ error: 'File size mismatch, upload corrupted.' });
    } else {
      res.status(200).json({ status: 'Chunk received' });
    }
  } catch (err) {
    console.error('Failed to process chunk:', err);
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
      console.error(`Temporary file deleted due to error: ${tempFilePath}`);
    }
    res.status(500).json({ error: 'Error processing file chunk', details: (err as Error).message });
  }
};