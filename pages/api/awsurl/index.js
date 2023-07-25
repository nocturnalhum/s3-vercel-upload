import { S3Client } from '@aws-sdk/client-s3';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
  signatureVersion: 'v4',
});

export default async function handler(req, res, next) {
  const fileId = uuidv4();
  const imageName = `canvas-image-${fileId}`;

  const params = {
    Bucket: process.env.S3_BUCKET_REGION,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  console.log('uploadURL', uploadURL);
  res.status(200).json({ url: uploadURL });
}
