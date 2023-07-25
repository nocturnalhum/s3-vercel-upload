import React from 'react';

export default function Tools({ canvasRef, contextRef }) {
  const clearCanvas = () => {
    let canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.fillStyle = '#FFF'; // Set the background color to white
    context.fillRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('drawing');
  };

  return (
    <div className='w-full h-20 my-2 bg-gray-400/50 rounded-full'>
      <div className='flex justify-end items-center w-full h-full p-3 '>
        <button onClick={clearCanvas} className='bg-black p-3 rounded-full'>
          Clear
        </button>
      </div>
    </div>
  );
}
