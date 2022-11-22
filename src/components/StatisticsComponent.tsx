import React from "react";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { makeStyles, Box, Card, Grid, Typography } from "@material-ui/core";
import Statistic from "../container/Statistic";
const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    height: "91vh",
    padding: "3vh",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxHeight: "91vh !important",
    overflow: "auto"
  },
  nodes: {
    fill: "darkgray"
  },
  nodestext: {
    fill: "white"
  },
  path: {
    stroke: "black",
    fill: "black",
    strokeWidth: "1.5px"
  },
  buttonback: {
    whiteSpace: "nowrap",
    color: "white",
    background: "#66BFAC!important",
    marginTop: "2em",
    width: "10%"
  },
  imagecontainer: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
    gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
    height: "20vh",
    width: "20vh",
    cursor: "pointer"
  },
  infocontainer: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
    height: "15vh",
    width: "15vh",
    whiteSpace: "pre-line",
    fontSize: "0.8em",
    cursor: "pointer"
  },
  hide: {
    display: "none"
  },
  show: {
    display: "flex"
  },
  images: {
    border: "1px solid #555",
    width: "5vh",
    height: "5vh",
    display: "block"
  },
  statistics: {
    padding: "3em"
  }
}));

interface statisticsProps {
  images: {
    [key: string]: any[]
  },
  heatmaps: {
    [key: string]: any[]
  },
  classNames: {
    [key: string]: string
  },
  classRelevances: {
    [key: string]: string
  },
  properties?: object
}

type StatisticsComponentProps = {
  statistics?: statisticsProps,
  conceptId?: number,
  statisticName?: string;
  viewState: string;
  currentLayer: string,
  viewCallback: (value: any) => void;
};
const StatisticsComponent: React.FC<StatisticsComponentProps> = (props: StatisticsComponentProps) => {
  const classes = useStyles();
  const [statisticsBox, setStatisticsBox] = React.useState([]);
  React.useEffect(
    () => {
      console.log(props.statistics)
      if (Object.keys(props.statistics.images).length) {
        console.log("stats available")
        const statisticsArr: any[] = [];
        Object.keys(props.statistics.classNames).forEach(key => {
          statisticsArr.push(
            <Statistic
              statistic={props.statisticName}
              name={props.statistics.classNames[key]}
              relevance={props.statistics.classRelevances[key]}
              images={props.statistics.images[key]}
              key={`statistic_${key}`}
              amount={Object.keys(props.statistics.classRelevances).length}
            />
          );
        })
        setStatisticsBox(statisticsArr);
      }
    },
    [Object.keys(props.statistics.classRelevances).length, props.statisticName]);

  return (
    <Card className={classes.root} id="statistics">
      <Button startIcon={<ArrowBackIosIcon />} onClick={() => props.viewCallback("DASHBOARDVIEW")} variant="contained" className={classes.buttonback}>
        {" "}Return back{" "}
      </Button>
      <Box display="flex" flexDirection="column" width="100%" position="relative">
        <Box flexGrow={1}>
          <Typography gutterBottom variant="h4" align="center">
            Similarities with respect of {props.statisticName} in other classes
          </Typography>
          <Typography gutterBottom variant="h6" align="center">
            Selected Concept ID: {props.conceptId}
          </Typography>
        </Box>
        <Grid container className={classes.statistics}>
          {statisticsBox}
        </Grid>
      </Box>
    </Card>
  );
};
export { StatisticsComponent, type statisticsProps }
