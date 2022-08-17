import React from "react";
import Filter from "../container/Filter";
import { Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "inherit",
    padding: "3vh",
    position: "relative",
    overflow: "hidden",
    marginBottom: "10vh"
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
    display: "flex"
  },
  centering: {
    paddingTop: "1em",
    paddingLeft: "3vh",
    paddingBottom: "5vh",
    justifyContent: "center"
  },
  innergrid: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "1em"
  },
  marginTop: {
    marginTop: "5em"
  },
  conditional: {
    marginLeft: "10%",
    top: "5%"
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
    partial: Record<string, string>,
    synthetic: Record<string, Array<string>>,
    cnnActivations: Record<string, Array<string>>,
    position: Record<string, Array<string>>
  },
  name: string,
  viewState: string,
  filterImgSize: number,
  indexCallback: (...args: any[]) => any,
  target: string,
  placeholder: any,
  filterInspectionCallback: (...args: any[]) => any,
  filterSamplesCallback: (...args: any[]) => any,
  filterActivationCallback: (...args: any[]) => any,
  filterHeatmapCallback: (...args: any[]) => any,
  nameCallback: (...args: any[]) => any,
  hasActivationStats: number,
  hasRelevanceStats: number,
  currentTab: string,
  viewTypeCallback: (...args: any[]) => any
}

const TabContent: React.FC<TabProps> = (props: TabProps) => {
  const classes = useStyles();

  const [filterBoxes, setFilterBoxes] = React.useState([]);



  const isObject = (obj: any) => obj != null && obj.constructor.name === "Object";


  React.useEffect(
    () => {
      const filterBox = [];
      if (props.layerFilters.selectedConceptIds) {
        const filterIndices = props.layerFilters.selectedConceptIds;
        for (let i = 0; i < filterIndices.length; i++) {
          const currIndex: string = filterIndices[i];
          //console.log(props.layerFilters.heatmaps[currIndex])
          filterBox.push(
            <Filter
              target={props.target}
              viewState={props.viewState}
              position={props.layerFilters.position[currIndex]}
              partial={props.layerFilters.partial[currIndex]}
              synthetic={props.layerFilters.synthetic[currIndex]}
              activation={props.layerFilters.heatmaps[currIndex]}
              cnnActivation={props.layerFilters.cnnActivations[currIndex]}
              filterPosition={props.layerFilters.position[currIndex]}
              filterAmount={filterIndices.length}
              images={props.layerFilters.images[currIndex]}
              placeholder={props.placeholder}
              conceptId={parseInt(currIndex)}
              filterActivationCallback={props.filterActivationCallback}
              filterHeatmapCallback={props.filterHeatmapCallback}
              key={`filter_index_${i}`}
              relevance={props.layerFilters.selectedConceptRelevances[currIndex]}
              filterImgSize={props.filterImgSize}
              filterInspectionCallback={props.filterInspectionCallback}
              filterSamplesCallback={props.filterSamplesCallback}
              nameCallback={props.nameCallback}
              currentTab={props.currentTab}
              hasRelevanceStats={props.hasRelevanceStats}
              hasActivationStats={props.hasActivationStats}
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
      <div className={classes.flex}>
        <Typography className={classes.conditional} >conditional heatmap</Typography>
        <Typography className={classes.samples}  >reference samples</Typography>
      </div>
      <Grid container spacing={5} className={classes.centering}>
        {props.name.length ?
          <Typography className={classes.marginTop} gutterBottom>{props.name}</Typography> : null}
        {filterBoxes}
      </Grid>
    </div>
  );
};
export default TabContent;
