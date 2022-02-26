import React from 'react';
import { Card, makeStyles, createStyles, Grid, Typography, TabProps, Tab, Tabs, withStyles, StyleRules, Theme } from '@material-ui/core';
import SortingButton from '../widgets/SortingWidget';
import TabContent from '../widgets/Tab';
import Selection from '../widgets/SelectionWidget';
import DownloadButton from '../widgets/DownloadButton';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '91vh',
    padding: '3vh',
    position: 'relative',
    overflow: 'hidden',
    width: "100%"
  },
  innergrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1em',
  },
  grid: { width: '100%', height: "90%" },
  centering: {
    paddingLeft: '3vh',
    paddingBottom: '3vh',
    justifyContent: 'center'
  },
  download: {
    display: "flex",
    justifyContent: "center",
  },
  tabs: {
    zIndex: 200,
    position: "relative",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 0 0 4px white, 0 6px 4px black'
  }
}));

export interface FilterProps {
  target: string;
  filterAmount: number;
  viewTypeCallback: (value: any) => void;
  filterActivationCallback: (value: any) => void;
  filterHeatmapCallback: (value: any) => void;
  orderCallback: (value: any) => void;
  experimentsCallback: (value: any) => void;
  methodsCallback: (value: any) => void;
  filterInspectionCallback: (index: number, view: string, currentTab: string) => void;
  filterSamplesCallback: (value: any) => void;
  analysisCallback: (value: any) => void;
  compareCallback: (value: any) => void;
  indexCallback: (value: any, currentTab: string) => void;
  nameCallback: (value: any) => void;
  layerCallback: (value: any) => void;
  viewState: string;
  selectedLayer: string;
  selectedExperiment: string;
  selectedMethod: string;
  layers: string[];
  order: string;
  methods: string[];
  models: string[];
  filters: any;
  compareFilters: {
    filter_indices: { 'max_activation': [], 'max_relevance_target': [] },
    filter_names: { 'max_activation': {}, 'max_relevance_target': {} },
    filter_relevances: { 'max_activation': {}, 'max_relevance_target': {} },
    images: { 'max_activation': {}, 'max_relevance_target': {} },
    heatmaps: { 'max_activation': {}, 'max_relevance_target': {} },
    partial: { 'max_activation': {}, 'max_relevance_target': {} },
    synthetic: { 'max_activation': {}, 'max_relevance_target': {} },
    position: { 'max_activation': {}, 'max_relevance_target': {} },
    cnn_activations: { 'max_activation': {}, 'max_relevance_target': {} }

  },
  filterImgSize: number,
  isSynth: number;
  isCnn: number;
  isMaxActivation: number;
  isMaxRelevanceTarget: number;
  hasRelevanceStats: number;
  hasActivationStats: number;
  actFilters: any;
  relFilters: any
}

const tabStyles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    root: {
      zIndex: 300,
      textTransform: 'none',
      minWidth: 72,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
      },
    },
    selected: {},
  })

interface AlteredTabProps extends TabProps {
  name: string;
  analysis: string;
}

export const AntTab: React.FC<AlteredTabProps> = (props: AlteredTabProps) => {
  return <Tab disableRipple {...props} />
}

export default withStyles(tabStyles)(AntTab);

export const FilterComponent: React.FC<FilterProps> = (props: FilterProps) => {
  const [tabCaption, setTabCaption] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [currentTab, setCurrentTab] = React.useState('');
  const [compare, setToCompare] = React.useState(false);
  const [extraProps, setExtraProps]: any = React.useState({
    "max_activation": {
    },
    "max_relevance_target": {
    }
  });

  var placeholder = async () => {
    return await fetch('/img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
      console.log(response)
    });
  };


  const isObject = (obj: any) => obj != null && obj.constructor.name === "Object";

  function getKeys(obj: any, key: string, keepObjKeys: boolean, skipArrays: boolean, keys: any = {}, scope: any = []) {
    if (Array.isArray(obj)) {
      obj.forEach((o) => getKeys(o, key, keepObjKeys, skipArrays, keys, scope), keys);
    } else if (isObject(obj)) {
      Object.keys(obj).forEach((k) => {
        if ((!Array.isArray(obj[k]) && !isObject(obj[k])) || keepObjKeys) {
          let path = scope.concat(k).join('.').replace(/\.\[/g, '[');
          if (path.includes(key) && !(scope.length > 1)) {
            keys[scope[0]] = obj[key];
          }
        }
        getKeys(obj[k], key, keepObjKeys, skipArrays, keys, scope.concat(k));
      }, keys);
    }
    return keys;
  }

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (tabCaption[newValue].props.analysis === 'comparison') {
      setToCompare(!compare)
      props.compareCallback(true)
    }
    else {
      setToCompare(false)
      setCurrentTab(tabCaption[newValue].props.name)
      props.analysisCallback(tabCaption[newValue].props.analysis)
      //layerCallbackParent(value);
    }

  };
  const classes = useStyles();
  const AntTabs = (Tabs);


  React.useEffect(() => {
    let currData = { ...extraProps };
    for (const [key, _] of Object.entries(props.compareFilters.images)) {
      currData[key] = getKeys(props.compareFilters, key, true, false)
    } setExtraProps(currData)
  }, [props.compareFilters]);

  React.useEffect(() => {
    if (tabCaption.length) {
      setCurrentTab(tabCaption[0].props.name)
    }
  }, [tabCaption]);

  React.useEffect(() => {
    let tabPanelBox = [];
    if (props.isMaxActivation === 1) {
      tabPanelBox.push(<AntTab label={'Show max activations'} key={0} name={'activation'} analysis={'max_activation'} />)
    }
    if (props.isMaxRelevanceTarget === 1) {
      tabPanelBox.push(<AntTab label={'Show max relevances'} key={1} name={'relevance'} analysis={'max_relevance_target'} />)
    } else {
      tabPanelBox.push(<AntTab label={'Show max relevances'} disabled={true} key={1} name={'relevance'} analysis={'max_relevance_target'} />)
    }
    /*     if (isSynth === 1) {
          tabPanelBox.push(<AntTab label={'Show synthetic samples'} key={2} name={'synthetic'} analysis={'synthetic'} />)
        }
        else {
          tabPanelBox.push(<AntTab label={'Show synthetic samples'} disabled={true} key={2} name={'synthetic'} analysis={'synthetic'} />)
        } */
    /*     if (isCnn === 1) {
          tabPanelBox.push(<AntTab label={'Show CNN activations'} key={3} name={'cnn'} analysis={'cnn_activation'} />)
        }
        else {
          tabPanelBox.push(<AntTab label={'Show CNN activations'} disabled={true} key={3} name={'cnn'} analysis={'cnn_activation'} />)
        } */
    tabPanelBox.push(<AntTab label={'Compare activation and relevance'} key={4} name={'compare'} analysis={'comparison'} />)
    setTabCaption(tabPanelBox)
  }, [props.isSynth,
  props.isCnn,
  props.isMaxActivation,
  props.isMaxRelevanceTarget]);
  return (
    <Card className={classes.root} id={'filterCard'}>
      <Grid className={classes.grid} container spacing={5}>
        <Grid item className={classes.innergrid} xs={12}>
          <Selection
            select={'Experiment'}
            selectedParam={props.selectedExperiment}
            parentCallback={props.experimentsCallback}
            params={props.models}
          />
          <Selection
            select={'Layer'}
            selectedParam={props.selectedLayer}
            parentCallback={props.layerCallback}
            params={props.layers}
          />
          <Selection
            select={'Method'}
            selectedParam={props.selectedMethod}
            parentCallback={props.methodsCallback}
            params={props.methods}
          />
          <SortingButton order={props.order} parentCallback={props.orderCallback} />

        </Grid>
        <Grid item xs={12} style={{ height: "inherit" }}>
          <Grid container spacing={5} className={classes.centering} >
            <Typography gutterBottom  >Explanation (Target class: {props.target} ) </Typography>
          </Grid>
          <div className={classes.tabs}>

            <AntTabs value={value} onChange={handleChange} indicatorColor="primary"
              textColor="primary" variant='scrollable' >
              {tabCaption}
            </AntTabs>
          </div>

          {compare ?
            (<Grid container style={{ height: "inherit" }}>
              <Grid item xs={6} style={{ height: "inherit" }}>
                < TabContent
                  viewState={props.viewState}
                  nameCallback={props.nameCallback}
                  placeholder={placeholder}
                  target={props.target}
                  filterInspectionCallback={(index, view) => props.filterInspectionCallback(index, view, currentTab)}
                  currentTab={currentTab}
                  hasRelevanceStats={props.hasRelevanceStats}
                  hasActivationStats={props.hasActivationStats}
                  indexCallback={value => props.indexCallback(value, currentTab)}
                  viewTypeCallback={props.viewTypeCallback}
                  filterSamplesCallback={props.filterSamplesCallback}
                  filterHeatmapCallback={props.filterHeatmapCallback}
                  filterActivationCallback={props.filterActivationCallback}
                  value={value}
                  filterImgSize={props.filterImgSize}
                  layerFilters={extraProps["max_activation"]}
                  name={"Maximum activation"}
                />
              </Grid>
              <Grid item xs={6} style={{ height: "inherit" }}>
                < TabContent
                  viewState={props.viewState}
                  nameCallback={props.nameCallback}
                  placeholder={placeholder}
                  target={props.target}
                  filterInspectionCallback={(index, view) => props.filterInspectionCallback(index, view, currentTab)}
                  currentTab={currentTab}
                  hasRelevanceStats={props.hasRelevanceStats}
                  hasActivationStats={props.hasActivationStats}
                  indexCallback={value => props.indexCallback(value, currentTab)}
                  viewTypeCallback={props.viewTypeCallback}
                  filterSamplesCallback={props.filterSamplesCallback}
                  filterHeatmapCallback={props.filterHeatmapCallback}
                  filterActivationCallback={props.filterActivationCallback}
                  value={value}
                  filterImgSize={props.filterImgSize}
                  layerFilters={extraProps["max_relevance_target"]}
                  name={"Maximum relevance (to target)"} />
              </Grid>
            </Grid>)
            : (<Grid item xs={12} style={{ height: "inherit" }}>
              < TabContent
                nameCallback={props.nameCallback}
                placeholder={placeholder}
                target={props.target}
                viewState={props.viewState}
                filterInspectionCallback={(index, view) => props.filterInspectionCallback(index, view, currentTab)}
                currentTab={currentTab}
                hasRelevanceStats={props.hasRelevanceStats}
                hasActivationStats={props.hasActivationStats}
                indexCallback={value => props.indexCallback(value, currentTab)}
                viewTypeCallback={props.viewTypeCallback}
                filterSamplesCallback={props.filterSamplesCallback}
                filterHeatmapCallback={props.filterHeatmapCallback}
                filterActivationCallback={props.filterActivationCallback}
                value={value}
                filterImgSize={props.filterImgSize}
                layerFilters={props.filters}
                name={""} />
            </Grid>)
          }


        </Grid>
      </Grid>
      <Grid className={classes.download}>
        <DownloadButton name={"Download Settings"} id={"settings"} />
        <DownloadButton name={"Download PDF"} id={"pdf"} />
      </Grid>
    </Card>
  );
};
