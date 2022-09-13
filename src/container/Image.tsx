import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { makeStyles, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    marginTop: "10%"
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
const Image: React.FC<ImageProps> = ({ content, getLocalAnalysisCallback, title }) => {
  const classes = useStyles();
  const [complete, setComplete]: any = React.useState(false)
  const [crop, setCrop]: any = React.useState({
    aspect: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    unit: 'px'
  });

  React.useEffect(() => {
    setComplete(false)
  }, []);

  React.useEffect(() => {
    if (complete && crop.width !== 0) {
      getLocalAnalysisCallback(
        Math.floor(crop.x),
        Math.floor(crop.y),
        crop.width,
        crop.height
      );
    }
  }, [crop, complete]);


  const onImageLoaded = (image: HTMLImageElement) => {
    setCrop({
      x: 0,
      y: 0,
      width: image.clientHeight,
      height: image.clientHeight
    });
  };
  const onCropComplete = (crop: ReactCrop.Crop, percentCrop: ReactCrop.PercentCrop) => {
    setComplete(true)
    setCrop(crop);
  };

  const onCropChange = (crop: ReactCrop.Crop, percentCrop: ReactCrop.PercentCrop) => {
    setComplete(false)
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
