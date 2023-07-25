import React, { useEffect, useRef, useState } from 'react';

export default function Canvas({ canvasRef, contextRef, myRef }) {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = myRef.current.clientWidth;
    canvas.height = myRef.current.clientHeight;
    const ctx = canvas.getContext('2d');
    // Set the background color to white
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    contextRef.current = ctx;
    const savedDrawing = localStorage.getItem('drawing');
    if (savedDrawing) {
      const image = new Image();
      image.src = savedDrawing;
      image.onload = () => {
        const scale =
          image.naturalWidth > image.naturalHeight
            ? canvas.height / image.naturalHeight
            : canvas.width / image.naturalWidth;
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        const startX = (canvas.width - imageWidth) / 2;
        const startY = (canvas.height - imageHeight) / 2;
        ctx.drawImage(image, startX, startY, imageWidth, imageHeight);
      };
    }

    const resize = () => {
      ctx.canvas.width = myRef.current.clientWidth;
      ctx.canvas.height = myRef.current.clientHeight;
      ctx.canvas.style.width = `${myRef.current.clientWidth}px`;
      ctx.canvas.style.height = `${myRef.current.clientHeight}px`;
      ctx.lineWidth = 10;
      const savedDrawing = localStorage.getItem('drawing');
      if (savedDrawing) {
        const image = new Image();
        image.src = savedDrawing;
        image.onload = () => {
          // const scale =
          //   image.naturalWidth > image.naturalHeight
          //     ? canvas.height / image.naturalHeight
          //     : canvas.width / image.naturalWidth;
          const imageWidth = image.naturalWidth;
          const imageHeight = image.naturalHeight;
          const startX = (canvas.width - imageWidth) / 2;
          const startY = (canvas.height - imageHeight) / 2;
          ctx.drawImage(image, startX, startY, imageWidth, imageHeight);
        };
      }
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef, contextRef, myRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ============================================================================
    // =============<<< Touch Events >>>===========================================
    // ============================================================================
    const handleTouchStart = (e) => {
      e.preventDefault(); // Prevent iOS magnifying glass from popping up while drawing
      const { touches } = e;
      const { pageX, pageY } = touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = pageX - rect.left;
      const y = pageY - rect.top;

      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    };

    const handleTouchMove = (e) => {
      if (!isDrawing) return;

      const { touches } = e;
      const { pageX, pageY } = touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = pageX - rect.left;
      const y = pageY - rect.top;

      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    };

    const handleTouchEnd = () => {
      const drawing = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('drawing', drawing);
      contextRef.current.closePath();
      setIsDrawing(false);
    };

    // ============================================================================
    // =============<<< Mouse Events >>>===========================================
    // ============================================================================
    const handleMouseDown = (e) => {
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    };

    const handleMouseUp = () => {
      const drawing = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('drawing', drawing);
      contextRef.current.closePath();
      setIsDrawing(false);
    };

    const handleMouseOut = () => {
      if (isDrawing) {
        const drawing = canvasRef.current.toDataURL('image/png');
        localStorage.setItem('drawing', drawing);
        contextRef.current.closePath();
        setIsDrawing(false);
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isDrawing, contextRef, canvasRef]);

  return (
    <canvas ref={canvasRef} className='bg-white select-none w-full h-full' />
  );
}
