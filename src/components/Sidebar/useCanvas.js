import { useState, useEffect } from 'react';

function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

const useCanvas = () => {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    console.log(coordinates);
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    var myImage = new Image();
    myImage.src = coordinates;
    ctx.drawImage(
      myImage,
      0,
      0,
      myImage.width,
      myImage.height, // source rectangle
      0,
      0,
      canvas.width,
      canvas.height
    );
  });

  return [setCoordinates];
};

export default useCanvas;
