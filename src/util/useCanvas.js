import { useState, useEffect } from 'react';

const useCanvas = () => {
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    if (coordinates) {
      console.log(coordinates);
      const canvas = document.querySelector('canvas');
      canvas.imageSmoothingEnabled = false;
      const ctx = canvas.getContext('2d');
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;

      var myImage = new Image();
      myImage.src = coordinates;
      ctx.drawImage(
        myImage,
        0,
        0,
        myImage.width,
        myImage.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  });

  return setCoordinates;
};

export default useCanvas;
