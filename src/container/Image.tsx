import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { makeStyles, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative"
  },
  crop: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "10em",
    height: "10em",
    backgroundImage:
      "linear-gradient(45deg, #000000 12.50%, #ffffff 12.50%, #ffffff 50%, #000000 50%, #000000 62.50%, #ffffff 62.50%, #ffffff 100%)",
    backgroundSize: "5.66px 5.66px",
    position: "absolute"
  },
  top: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "10em",
    height: "10em"
  }
}));
type ImageProps = {
  isToggled?: boolean,
  content?: string,
  watershed?: any[],
  title?: string,
  getLocalAnalysisCallback?: (...args: any[]) => any
};
const Image: React.FC<ImageProps> = ({
  content,
  getLocalAnalysisCallback,
  title
}) => {
  const isMounted = React.useRef(true);
  const classes = useStyles();
  const [crop, setCrop]: any = React.useState({
    aspect: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    unit: 'px'
  });
  React.useEffect(() => {
    if (isMounted.current) {
      // fetch data
      // setData (fetch result)

      return () => {
        isMounted.current = false;
      };
    }
  }, [])
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
  const onImageLoaded = (image: HTMLImageElement) => {
    setCrop({
      ...crop,
      x: 0,
      y: 0,
      width: image.clientHeight,
      height: image.clientHeight
    });
  };
  /*   async function pngArray() {
      await fetch("/api/png_array", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            const res = json.split("\x89PNG");
            function isempty(x) {
              if (x !== "") return true;
            }
            const filtered = res.filter(isempty);
            filtered.forEach(function (e, i, a) {
              a[i] = "\x89PNG" + a[i];
            });
            var binary = "";
            for (var i = 0; i < filtered[0].length; i++) {
              binary += String.fromCharCode(filtered[0].charCodeAt(i) & 0xff);
            }
            const content = "data:image/png;base64," + btoa(binary);
          });
        }
      });
    } */
  const onCropComplete = async (crop: ReactCrop.Crop, percentCrop: ReactCrop.PercentCrop) => {
    console.log("trigger")
    if ((crop.width && crop.height) !== 0) {
      getLocalAnalysisCallback(
        Math.floor(crop.x),
        Math.floor(crop.y),
        crop.width,
        crop.height
      );
    }
  };
  const onCropChange = (crop: ReactCrop.Crop, percentCrop: ReactCrop.PercentCrop) => {
    setCrop(crop);
  };
  return (
    <Grid item lg={12} md={12} xl={12} xs={12} className={classes.root}>
      {" "}
      <Typography gutterBottom>{title}</Typography>
      <img alt=" " className={classes.crop + " img"} src={content} />
      <ReactCrop
        crop={crop}
        src={content}
        className={classes.top}
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={onCropChange}
      />
    </Grid>
  );
};
export default Image;
