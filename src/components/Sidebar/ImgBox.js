import React from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import useCanvas from './useCanvas';
import { Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  side: {
    width: '50%'
  },
  crop: {
    display: 'block'
  }
}));

const ImgBox = ({ viewType, content, isToggled, watershed, title }) => {
  const classes = useStyles();

  const [setCoordinates] = useCanvas();
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
    setCoordinates([dataURL]);
  };

  React.useEffect(() => {
    if (isToggled === true && title === 'heatmap' && watershed) {
      console.log(title);
      handleCanvasClick();
    }
  }, [isToggled]);

  React.useEffect(() => {
    if (title === 'heatmap') {
      setCoordinates([content]);
    }
  }, [content]);

  const onImageLoaded = image => {
    setRatio(image.clientHeight / 28);
    setCrop({
      x: 0,
      y: 0,
      width: image.clientHeight,
      height: image.clientHeight
    });
  };

  const onCropComplete = crop => {
    setX(crop.x / ratio);
    setY(crop.y / ratio);
    setWidth(crop.width / ratio);
    setHeight(crop.height / ratio);
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
          imageStyle={{ height: '100%', width: '100%', objectFit: 'cover' }}
          src={content}
          crop={crop}
          ruleOfThirds
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
        />
      ) : (
        <canvas
          id={title}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
      )}
    </Card>
  );
};
ImgBox.propTypes = {
  isToggled: PropTypes.bool,
  viewType: PropTypes.string,
  content: PropTypes.string,
  watershed: PropTypes.array,
  title: PropTypes.string
};
export default ImgBox;
