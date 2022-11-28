import React from "react";
import { Grid, Typography, makeStyles, Container } from "@material-ui/core";
const useStyles = makeStyles(() => ({

  image: {
    border: "1px solid #555",
    verticalAlign: "middle",
    width: "100%",
    height: "100%",
    display: "block",
    filter: "blur(0)",
    imageRendering: "crisp-edges",
    transform: "translateZ(0)",
    backgroundImage: "linear-gradient(45deg, #ffffff 40%, #000000 40%, #000000 50%, #ffffff 50%, #ffffff 90%, #000000 90%, #000000 100%)"
  },
  row: {
    display: "inherit",
    minWidth: "50%",
    justifyContent: "center",
    gap: "10%"
  },
  typography: {
    wordWrap: "break-word",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column"
  },
  centering: {
    textAlign: "center",
    maxHeight: "100%"
  },
  height: {
    height: "80%",
    width: "80%",
    display: "grid",
    gridGap: '5px',
    gridTemplateColumns: "repeat(6,1fr)",  /* 3 columns */
    //gridTemplate: "repeat(6, 1fr) / repeat(6, 1fr)",
    margin: "0 auto"
  },
  test: {
    aspectRatio: ' 1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: "10px",
    overflow: "hidden",
    minWidth: "0"
  },
  box: {
    margin: "2em",
    padding: "2em",
    textAlign: "center",
    marginBottom: "2em",
    backgroundColor: "#CCEAE3"
  },
  flex: {
    display: "flex",
    flexFlow: "row",
    padding: "2em",
    paddingBottom: "0"
  }
}));

type StatisticProps = {
  statistic: string,
  relevance: string,
  name: string,
  images: any[],
  heatmaps: any[]
};
const Statistic: React.FC<StatisticProps> = (props: StatisticProps) => {
  const classes = useStyles();
  const [imgState, setImages] = React.useState([]);
  const [heatmapState, setHeatmaps] = React.useState([]);

  const makeImages = (name: string, imgs: any) => {
    let imgArray = Array();
    for (let i = 0; i < imgs.length; i++) {
      const img = `data:image/png;base64,${imgs[i]}`;
      imgArray.push(
        <Container
          className={classes.test}
          key={`${name}_image_index${i}`}
        >
          <img src={img} className={classes.image} id={"image"} alt="" />
        </Container>
      );
    }
    return imgArray;
  };
  React.useEffect(
    () => {
      if (props.images) {
        console.log("stat!")
        let statsImages = makeImages(props.name, props.images);
        setImages(statsImages);
      }
    },
    [props.images]);
  React.useEffect(
    () => {
      if (props.heatmaps) {
        let statsHeatmaps = makeImages(props.name, props.heatmaps);
        setHeatmaps(statsHeatmaps);
      }
    },
    [props.heatmaps]);
  const statisticWidth = 6;
  const statistics = (
    <div id={"statistic"} className={classes.box}>
      <div className={classes.flex}>
        <div className={classes.row}>
          <Typography variant="subtitle1" gutterBottom className={classes.typography} > Class name:
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {props.name}
          </Typography>
        </div>
        <div className={classes.row}>
          <Typography variant="subtitle1" gutterBottom className={classes.typography} > Class relevance:
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {Math.round(parseFloat(props.relevance) * 100 + Number.EPSILON)} %
          </Typography>
        </div>
      </div>
      <div className={classes.height}>{imgState}</div>
      <div className={classes.height}>{heatmapState}</div>
    </div>
  );
  return (
    <Grid item xl={statisticWidth} lg={statisticWidth} md={12} sm={12}>
      {statistics}
    </Grid>
  );
};
export default Statistic;
