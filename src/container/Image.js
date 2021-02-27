import React from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import useCanvas from '../util/useCanvas';
import { Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    height: '30vh'
  },
  side: {
    width: '50%'
  },
  crop: {
    display: 'block'
  },
  canvas: {
    height: '100%',
    width: '100%'
  }
}));

const Image = ({ viewType, content, isToggled, watershed, title }) => {
  const classes = useStyles();

  const setCoordinates = useCanvas();
  const [ratio, setRatio] = React.useState(0);
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const [crop, setCrop] = React.useState({
    x: 0,
    y: 0,
    unit: 'px',
    width: 0,
    height: 0
  });

  React.useEffect(() => {
    const handleCanvasClick = () => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      for (var i = 0; i < watershed.length; i++) {
        for (var j = 0; j < watershed[i].length; j++) {
          const imageData = ctx.getImageData(i, j, 1, 1);
          const data = imageData.data;
          console.log(data.length);
          let iterator = i * 4 * j;
          data[iterator] = data[iterator] * watershed[i][j]; // red
          data[iterator + 1] = data[iterator + 1] * watershed[i][j]; // green
          data[iterator + 2] = data[iterator + 2] * watershed[i][j]; // blue
          data[iterator + 3] = 1;
          ctx.putImageData(imageData, i, j);
        }
      }

      const dataURL = canvas.toDataURL();
      setCoordinates(dataURL);
    };
    if (isToggled === true && title === 'heatmap' && watershed) {
      console.log(title);
      handleCanvasClick();
    }
  }, [isToggled, title, watershed, setCoordinates]);

  React.useEffect(() => {
    if (title === 'heatmap') {
      setCoordinates(content);
    }
  }, [content, setCoordinates, title]);

  const onImageLoaded = image => {
    setRatio(image.clientHeight / 28);
    setCrop({
      x: 0,
      y: 0,
      width: image.clientHeight,
      height: image.clientHeight
    });
  };

  async function getLocalAnalysis() {
    if ((x && y && width && height) !== null) {
      await fetch('/api/local_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x, y, width, height })
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json);
          });
        }
      });
    }
  }

  const onCropComplete = crop => {
    setX(parseInt(crop.x / ratio));
    setY(parseInt(crop.y / ratio));
    setWidth(parseInt(crop.width / ratio));
    setHeight(parseInt(crop.height / ratio));
  };

  const onCropChange = crop => {
    setCrop(crop);
  };

  function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    console.log(canvas.width);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  return (
    <Card className={viewType === 'DEFAULTVIEW' ? classes.root : classes.side}>
      {title === 'original' ? (
        <ReactCrop
          className={classes.crop}
          imageStyle={{
            imageRendering: 'crisp-edges',
            height: '100%',
            width: '100%'
          }}
          src={content}
          crop={crop}
          ruleOfThirds
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
        />
      ) : (
        <canvas id={title} className={classes.canvas} />
      )}
    </Card>
  );
};
Image.propTypes = {
  isToggled: PropTypes.bool,
  viewType: PropTypes.string,
  content: PropTypes.string,
  watershed: PropTypes.array,
  title: PropTypes.string
};
export default Image;
