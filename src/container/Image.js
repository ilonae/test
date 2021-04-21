import React from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  side: {
    width: '50%'
  },
  crop: {
    display: 'block'
  },
  canvas: {
    position: 'relative',
    width: '800%',
    height: '500%',
    overflow: 'hidden',
    display: 'block'
  }
}));

const Image = ({ viewType, content, getLocalAnalysisCallback, title }) => {
  const classes = useStyles();

  const [crop, setCrop] = React.useState({
    x: 0,
    y: 0,
    unit: 'px',
    width: 0,
    height: 0
  });

  /*   React.useEffect(() => {
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
 */

  const onImageLoaded = image => {
    setCrop({
      x: 0,
      y: 0,
      width: image.clientHeight,
      height: image.clientHeight
    });
  };

  async function pngArray() {
    await fetch('/api/png_array', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          const res = json.split('\x89PNG');
          function isempty(x) {
            if (x !== '') return true;
          }
          const filtered = res.filter(isempty);
          filtered.forEach(function(e, i, a) {
            a[i] = '\x89PNG' + a[i];
          });

          var binary = '';
          for (var i = 0; i < filtered[0].length; i++) {
            binary += String.fromCharCode(filtered[0].charCodeAt(i) & 0xff);
          }

          const content = 'data:image/png;base64,' + btoa(binary);
        });
      }
    });
  }

  const onCropComplete = async crop => {

    if ((crop.width && crop.height) !== 0) {
      getLocalAnalysisCallback(Math.floor(crop.x), Math.floor(crop.y), crop.width, crop.height);
    }
  };

  const onCropChange = crop => {
    setCrop(crop);
  };

  return (
    <div
      className={
        ['LOADINGVIEW', 'DEFAULTVIEW'].includes(viewType)
          ? classes.root
          : classes.side
      }
    >
      <ReactCrop
        className={classes.crop}
        
        imageStyle={{
          imageRendering: 'crisp-edges',
          height: '100%',
          width: '100%'
        }}
        src={content}
        crop={crop}
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={onCropChange}
      />
      
    </div>
  );
};
Image.propTypes = {
  isToggled: PropTypes.bool,
  viewType: PropTypes.string,
  content: PropTypes.string,
  watershed: PropTypes.array,
  title: PropTypes.string,
  getLocalAnalysisCallback: PropTypes.func
};
export default Image;
