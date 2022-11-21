import React from "react";
import Filter from "../container/Filter";
import { Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "inherit",
    padding: "3vh",
    position: "relative"
  },
  label: {
    color: "white"
  },
  text: {
    color: "white"
  },
  selected: {
    color: "black"
  },
  flex: {
    display: "flex",
    width: "100%",
    marginTop: "2%"
  },
  centering: {
    paddingTop: "1em",
    paddingLeft: "3vh",
    paddingBottom: "5vh"
  },
  marginTop: {
    marginTop: "0.8em",
    width: "100%",
    textAlign: "center"
  },
  conditional: {
    marginLeft: "10%"
  },
  samples: {
    left: "5%",
    marginLeft: "10%",
    top: "5%"
  }
}));

export interface TabProps {
  value: number,
  layerFilters: {
    conceptIds: any[],
    filterNames: {},
    conceptRelevances: {},
    selectedConceptIds: any[],
    selectedConceptRelevances: Record<string, number>,
    images: Record<string, Array<string>>,
    heatmaps: Record<string, Array<string>>,
    conditionalHeatmap: Record<string, string>
  },
  name: string,
  viewState: string,
  filterImgSize: number,
  filterInspectionCallback: (...args: any[]) => any,
  currentTab: string,
}

const TabContent: React.FC<TabProps> = (props: TabProps) => {
  const classes = useStyles();
  const [filterBoxes, setFilterBoxes] = React.useState([]);

  React.useEffect(
    () => {
      const filterBox = [];
      if (props.layerFilters.selectedConceptIds && props.layerFilters.images) {
        const filterIndices = props.layerFilters.selectedConceptIds;
        for (let i = 0; i < filterIndices.length; i++) {
          const currIndex: string = filterIndices[i];
          filterBox.push(
            <Filter
              viewState={props.viewState}
              conditionalHeatmap={props.layerFilters.conditionalHeatmap[currIndex]}
              activation={props.layerFilters.heatmaps[currIndex]}
              images={props.layerFilters.images[currIndex]}
              conceptId={parseInt(currIndex)}
              key={`filter_index_${i}`}
              relevance={props.layerFilters.selectedConceptRelevances[currIndex]}
              filterImgSize={props.filterImgSize}
              filterInspectionCallback={props.filterInspectionCallback}
              currentTab={props.currentTab}
            />
          );
        }
      }
      setFilterBoxes(filterBox);
    },
    [props.layerFilters]
  );
  return (
    <div className={classes.root} id="scroll">
      <Grid container spacing={5} className={classes.centering}>
        {props.name.length ?
          <Typography className={classes.marginTop} variant="h5" gutterBottom>{props.name}</Typography> : null}
        <div className={classes.flex}>
          <Typography className={classes.conditional} variant="body2" >conditional heatmap</Typography>
          <Typography className={classes.samples} variant="body2" >reference samples</Typography>
        </div>
        {filterBoxes}
      </Grid>
    </div>
  );
};
export default TabContent;
