import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dataURLtoFile from '@/utils/dataURLtoFile';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function StableDiffusion({
  canvasRef,
  setFlip,
  message,
  setMessage,
  loading,
  setLoading,
  error,
  setError,
  setPrediction,
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [drawState, setDrawState] = useState({ drawing: '', url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading image to S3...');
    setLoading(true);
    setFlip(true);
    const canvas = canvasRef.current;
    const drawingDataUrl = canvas.toDataURL('image/png');
    const convertedUrlToFile = dataURLtoFile(
      drawingDataUrl,
      'canvas-image.png'
    );
    try {
      // Upload the image to S3
      setLoading(true);
      console.log('Enter S3 fetch:');
      const { url } = await fetch('/api/awsurl').then((res) => res.json());

      console.log('Signed URL:', url);

      const formData = new FormData();

      formData.append('canvas-image', convertedUrlToFile);

      const s3response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const imageUrl = url.split('?')[0];
      console.log(imageUrl);

      if (s3response.status === 201) {
        console.log('Enter S3 Success Block');
        const data = await s3response.json();
        setMessage('Image uploaded to S3');
        console.log('Url', data.url);
        const response = await fetch('/api/predictions1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: inputPrompt,
            img: data?.url, // Use the S3 URL from the response
          }),
        });
        let prediction = await response.json();
        if (response.status !== 201) {
          setMessage(prediction.detail);
          console.log('RES1', response);
          return;
        } else {
          console.log('RES2', response);
        }
        setPrediction(prediction);

        while (
          prediction.status !== 'succeeded' &&
          prediction.status !== 'failed'
        ) {
          setLoading(true);
          await sleep(1000);
          const response = await fetch('/api/predictions/' + prediction.id);
          prediction = await response.json();
          if (response.status !== 200) {
            setError(prediction.detail);
            return;
          }
          console.log({ prediction });
          setPrediction(prediction);
          setLoading(false);
        }
      } else {
        console.error('Error Fetch S3:', s3response.url, s3response.statusText);
        setMessage('Error uploading');
        setError(error.toString());
        setLoading(false);
        setFlip(false);
      }
    } catch (error) {
      console.error('Error processing image prediction:', error.toString());
      setMessage('Error processing image prediction');
      setError(error.toString());
      setFlip(false);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center w-full h-20 my-2 bg-gray-500/40 rounded-full'>
        <div className='w-full p-4'>
          <form onSubmit={handleSubmit} className='flex'>
            <input
              type='text'
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className='w-full px-7 py-3 text-gray-700 bg-gray-200 rounded-l-full focus:outline-none'
              placeholder='Enter a prompt...'
            />
            <button
              type='submit'
              className='flex justify-center w-32 px-3 py-4 text-white bg-blue-500 rounded-r-full disabled:cursor-not-allowed'
              disabled={loading || error || !inputPrompt}
            >
              Go!
            </button>
          </form>
        </div>
      </div>
      {message && (
        <p className='flex justify-center text-red-500 text-lg font-semibold'>
          Status: {message}
        </p>
      )}
    </>
  );
}
