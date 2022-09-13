import React from "react";
import { Grid, Typography, makeStyles, Container } from "@material-ui/core";
const useStyles = makeStyles(() => ({
  image: () => ({
    border: "1px solid #555",
    verticalAlign: "middle",
    width: "100%",
    height: "100%",
    display: "block",
    filter: "blur(0)",
    imageRendering: "crisp-edges",
    transform: "translateZ(0)"
  }),
  typography: {
    wordWrap: "break-word",
    height: "10%",
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
    gridGap: '10px',
    gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
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
    marginTop: "2em",
    textAlign: "center"
  },
  flex: {
    display: "grid",
    width: "80%",
    margin: "0 auto",
    gridTemplateColumns: "40fr 60fr",
    gap: "10px",
    padding: "2em",
    paddingBottom: "0"
  }
}));

type StatisticBoxProps = {
  statistic: string,
  relevance: string,
  name: string,
  images: any[],
  amount?: number
};
const StatisticBox: React.FC<StatisticBoxProps> = (props: StatisticBoxProps) => {
  const classes = useStyles();
  const [imgState, setImages] = React.useState([]);

  const makeImages = (imageStyle: string, name: string, containerStyle: string) => {
    let statisticsImages = Array();
    for (let i = 0; i < props.images.length; i++) {
      const img = `data:image/png;base64,${props.images[i]}`;
      statisticsImages.push(
        <Container
          className={containerStyle}
          key={`${name}_image_index${i}`}
        >
          <img src={img} className={imageStyle} id={"image"} alt="" />
        </Container>
      );
    }
    return statisticsImages;
  };
  React.useEffect(
    () => {
      if (props.images) {
        let statsImages = makeImages(classes.image, props.name, classes.test);
        setImages(statsImages);
      }
    },
    [props.images,]
  );
  const statisticWidth = props.amount === 2 ? 6 : props.amount === 4 ? 6 : 4;
  const statistics = (
    <div id={"statistic"} className={classes.box}>
      <div className={classes.flex}>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={classes.typography}
        > Class name:
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {props.name}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={classes.typography}
        > Class relevance:
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {props.relevance}
        </Typography>
      </div>
      <div className={classes.height}>{imgState}</div>
    </div>
  );
  return (
    <Grid item xl={statisticWidth} lg={statisticWidth} md={12} sm={12}>
      {statistics}
    </Grid>
  );
};
export default StatisticBox;
