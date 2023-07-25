import dataURLtoFile from '@/utils/dataURLtoFile';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

export default async function handler(req, res) {
  console.log('Entering S3 Handler');
  try {
    const fileId = uuidv4();
    const file = dataURLtoFile(req.body, `canvas-${fileId}.png`);
    const fileParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.name,
      Expires: 600,
      ContentType: file.type,
    };
    const url = await s3.getSignedUrlPromise('putObject', fileParams);

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-type': String(file.type),
      },
      body: file,
    });

    const uploadedImageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${file.name}`;
    res.status(201).json({ url: uploadedImageUrl });
  } catch (error) {
    console.log('error:', error);
    res.status(500).json({ error });
  }
}
