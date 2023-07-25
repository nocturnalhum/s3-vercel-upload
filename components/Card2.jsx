import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuLoader2 } from 'react-icons/lu';

export default function Card2({ prediction, error, message }) {
  return (
    <div className='flext flex-col h-full w-full bg-gray-500 text-white rounded-xl flex items-center justify-center'>
      {prediction && (
        <>
          {prediction.output && (
            <div className='image-wrapper mt-5'>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt='output'
                sizes='500px'
                className='rounded-lg'
              />
            </div>
          )}
          {error && (
            <p className='py-3 text-lg text-orange-500'>Status: {error}</p>
          )}
          {message && (
            <p className='py-3 text-lg text-orange-500'>Status: {message}</p>
          )}
          {prediction.status !== 'succeeded' && (
            <div className='flex flex-col items-center justify-center opacity-90  '>
              <LuLoader2 size={30} className='animate-spin' />
              <p className='py-3 text-lg text-orange-500'>
                Status: {prediction.status}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
