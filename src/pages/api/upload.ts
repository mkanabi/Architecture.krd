import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      filename: (name, ext, part) => {
        return `${uuidv4()}${ext}`;
      },
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Upload error:', err);
          res.status(500).json({ error: 'Upload failed' });
          return resolve(undefined);
        }

        const uploadedFiles = Array.isArray(files.images)
          ? files.images
          : [files.images];

        const urls = uploadedFiles.map(
          (file) => `/uploads/${path.basename(file.filepath)}`
        );

        res.status(200).json({ urls });
        resolve(undefined);
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}