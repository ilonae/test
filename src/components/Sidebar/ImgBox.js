import React from 'react';
import PropTypes from 'prop-types';

import useCanvas from './useCanvas';
import { Card, makeStyles } from '@material-ui/core';

export const canvasWidth = 500;
export const canvasHeight = 500;

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  side: {
    width: '50%'
  },
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    flex: 1
  }
}));

const ImgBox = ({ viewType, content, isToggled, watershed, title }) => {
  const classes = useStyles();
  const [setCoordinates, canvasRef] = useCanvas();

  const handleCanvasClick = () => {
    const canvas = canvasRef.current;
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
    if (isToggled === false) {
      setCoordinates([content]);
    }
  }, [content, isToggled]);
  return (
    <Card className={viewType === 'DEFAULTVIEW' ? classes.root : classes.side}>
      <canvas
        id={title}
        className={classes.img}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
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
