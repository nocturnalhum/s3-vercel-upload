import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  console.log('REq', req.body);
  const s3 = new S3({
    signatureVersion: 'v4',
    region: process.env.S3_BUCKET_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const preSignedUrl = await s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.query.file,
    ContentType: req.query.fileType,
    Expires: 5 * 60,
  });
  res.status(200).json({
    url: preSignedUrl,
  });
}
// import { S3Client } from '@aws-sdk/client-s3';
// import aws from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid';

// aws.config.update({
//   region: process.env.S3_BUCKET_REGION,
//   credentials: new aws.Credentials({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   }),
// });

// const s3 = new aws.S3();

// export default async function handler(req, res, next) {
//   const { filename, filetype } = req.body;

//   const fileId = uuidv4();
//   const imageName = `canvas-image-${fileId}`;

//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: filename,
//     ContentType: filetype,
//     Expires: 60,
//   };

//   try {
//     const signedUrl = await s3.getSignedUrlPromise('putObject', params);
//     res.status(200).json({ signedUrl });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate the signed URL' });
//   }
// }
