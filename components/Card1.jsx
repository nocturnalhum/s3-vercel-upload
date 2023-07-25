import React, { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';

export default function Card1({ canvasRef, contextRef }) {
  const myRef = useRef(null);

  return (
    <div className='h-full w-full bg-gray-300/10 backdrop-blur-sm text-white rounded-xl flex items-center justify-center p-3'>
      <div ref={myRef} className='w-full h-full'>
        <Canvas canvasRef={canvasRef} contextRef={contextRef} myRef={myRef} />
      </div>
    </div>
  );
}
