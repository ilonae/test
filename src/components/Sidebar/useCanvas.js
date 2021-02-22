import { useState, useEffect, useRef } from 'react';

const useCanvas = () => {
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    var myImage = new Image();
    myImage.src = coordinates;
    ctx.drawImage(myImage, 0, 0, 500, 500);
  });

  return [setCoordinates, canvasRef];
};

export default useCanvas;
