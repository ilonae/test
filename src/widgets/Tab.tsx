import React from "react";
import Filter from "../container/Filter";
import { Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "inherit",
    padding: "3vh",
    position: "relative",
    overflow: "scroll",
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
  centering: {
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
    marginTop: "2em"
  }
}));

export interface TabProps {
  value: number,
  layerFilters: {
    position: any[],
    partial: any[],
    synthetic: any[],
    heatmaps: any[],
    cnn_activations: any[],
    filter_names: any[],
    images: {},
    filter_relevances: any[],
    filter_indices: any[]
  },
  name: string,
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
  const [filters, setFilters]: any = React.useState({
    position: [],
    partial: [],
    synthetic: [],
    heatmaps: [],
    cnn_activations: [],
    filter_names: [],
    images: {},
    filter_relevances: [],
    filter_indices: []
  });
  const [filterBoxes, setFilterBoxes] = React.useState([]);

  React.useEffect(
    () => {
      setFilters(props.layerFilters);
    },
    [props.layerFilters]
  );

  const isObject = (obj: any) => obj != null && obj.constructor.name === "Object";


  React.useEffect(
    () => {
      const filterBox = [];
      if (isObject(filters.images)) {
        if (filters && Object.keys(filters.images).length !== 0) {

          const filterIndices = filters.filter_indices;
          for (let i = 0; i < filterIndices.length; i++) {
            const currIndex: number = filterIndices[i];
            filterBox.push(
              <Filter
                target={props.target}
                view={""}
                position={filters.position[currIndex]}
                partial={filters.partial[currIndex]}
                synthetic={filters.synthetic[currIndex]}
                activation={filters.heatmaps[currIndex]}
                cnnActivation={filters.cnn_activations[currIndex]}
                filterPosition={filters.position[currIndex]}
                filterName={filters.filter_names[i]}
                filterAmount={filterIndices.length}
                images={filters.images[currIndex]}
                placeholder={props.placeholder}
                filterIndex={currIndex}
                filterActivationCallback={props.filterActivationCallback}
                filterHeatmapCallback={props.filterHeatmapCallback}
                key={`filter_index_${i}`}
                relevance={filters.filter_relevances[currIndex]}
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
      }

      setFilterBoxes(filterBox);
    },
    [filters,
      props.value,
      props.target,
      props.currentTab,
      props.filterActivationCallback,
      props.filterHeatmapCallback,
      props.filterImgSize,
      props.filterInspectionCallback,
      props.filterSamplesCallback,
      props.hasActivationStats,
      props.hasRelevanceStats,
      props.nameCallback,
      props.placeholder]
  );
  return (
    <div className={classes.root} id="scroll">
      <Grid container spacing={5} className={classes.centering}>
        {props.name.length ?
          <Typography className={classes.marginTop} gutterBottom>{props.name}</Typography> : null}
        {filterBoxes}
      </Grid>
    </div>
  );
};
export default TabContent;
