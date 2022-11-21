import React from 'react';
import { Card, makeStyles, createStyles, Grid, Typography, TabProps, Tab, Tabs, withStyles, StyleRules, Theme } from '@material-ui/core';
import SortingButton from '../widgets/SortingWidget';
import TabContent from '../widgets/Tab';
import DownloadButton from '../widgets/DownloadButton';
import SettingsBar from '../widgets/SettingsBar';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '91vh',
    padding: '3vh',
    position: 'relative',
    overflow: 'scroll',
    width: "100%"
  },
  grid: {
    width: '100%'
  },
  demoLogo: {
    height: '8vh',
    width: '18vh',
    overflow: "hidden",
    justifyContent: 'end',
    flex: 'wrap',
    display: 'flex',
    position: 'absolute',
    zIndex: 9000,
    right: 0,
    marginRight: "12vh"
  },
  demoImg: {

    marginTop: "-2vh",
    height: '10vh',
    width: '18vh'
  },
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
    zIndex: 80,
    position: "relative",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 0 0 4px white, 0 3px 4px black'
  },
  tab: {
    maxWidth: "40em"
  }
}));

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

export interface FilterProps {
  target: string;
  orderCallback: (value: any) => void;
  experimentsCallback: (value: any) => void;
  methodsCallback: (value: any) => void;
  filterInspectionCallback: (index: number, view: string, currentTab: string) => void;
  analysisCallback: (value: any) => void;
  layerCallback: (value: any) => void;
  viewState: string;
  selectedLayer: string;
  selectedExperiment: string;
  selectedMethod: string;
  layers: string[];
  descending: boolean;
  methods: string[];
  models: string[];
  filters: any;
  selectedTab: any;
  compareFilters: {
    selectedConceptIds: { 'activation': [], 'relevance': [] },
    conceptNames: { 'activation': {}, 'relevance': {} },
    selectedConceptRelevances: { 'activation': {}, 'relevance': {} },
    images: { 'activation': {}, 'relevance': {} },
    heatmaps: { 'activation': {}, 'relevance': {} },
    conditionalHeatmap: { 'activation': {}, 'relevance': {} },
    modes: ['activation', 'relevance']

  },
  filterImgSize: number
}

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
  const [extraProps, setExtraProps]: any = React.useState({
    "activation": {
    },
    "relevance": {
    }
  });

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
    props.analysisCallback(tabCaption[newValue].props.analysis)
  };

  const classes = useStyles();
  const AntTabs = (Tabs);


  React.useEffect(() => {
    if (tabCaption.length) {
      let tab = tabCaption.find((tab: any) => tab.props.analysis === props.selectedTab)
      setValue(Number(tab.key))
    }
  }, [tabCaption, props.selectedTab]);

  React.useEffect(() => {
    let currData = { ...extraProps };
    if (Object.keys(props.compareFilters.images["activation"]).length) {
      for (let key in props.compareFilters.images) {
        currData[key] = getKeys(props.compareFilters, key, true, false)
      } setExtraProps(currData)
    }
  }, [props.compareFilters]);

  React.useEffect(() => {
    let tabPanelBox = [];
    tabPanelBox.push(<AntTab label={'Show max relevances'} className={classes.tab} key={0} name={'relevance'} analysis={'relevance'} />)
    tabPanelBox.push(<AntTab label={'Show max activations'} className={classes.tab} key={1} name={'activation'} analysis={'activation'} />)
    tabPanelBox.push(<AntTab label={'Compare activation and relevance'} className={classes.tab} key={2} name={'compare'} analysis={'comparison'} />)
    setTabCaption(tabPanelBox)
  }, [classes.tab]);

  return (
    <Card className={classes.root} id={'filterCard'}>
      <Grid className={classes.grid} container spacing={5}>
        <SettingsBar
          models={props.models}
          selectedExperiment={props.selectedExperiment}
          experimentsCallback={props.experimentsCallback}
          selectedLayer={props.selectedLayer}
          layerCallback={props.layerCallback}
          layers={props.layers}
          selectedMethod={props.selectedMethod}
          methodsCallback={props.methodsCallback}
          methods={props.methods}
          descending={props.descending}
          orderCallback={props.orderCallback}
        />
        <Grid item xs={12} >
          <Grid container spacing={5} className={classes.centering} >
            <Typography gutterBottom  >Explanation (Target class: {props.target} ) </Typography>
          </Grid>
          <AntTabs className={classes.tabs} value={value} onChange={handleChange} indicatorColor="primary"
            textColor="primary" variant='scrollable' >
            {tabCaption}
          </AntTabs>
          {props.selectedTab == "comparison" ?
            (<Grid container style={{ height: "inherit" }}>
              <Grid item xs={6} style={{ height: "inherit" }}>
                < TabContent
                  viewState={props.viewState}
                  filterInspectionCallback={(index, view) => props.filterInspectionCallback(index, view, props.selectedTab)}
                  currentTab={props.selectedTab}
                  value={value}
                  filterImgSize={props.filterImgSize}
                  layerFilters={extraProps["activation"]}
                  name={"Maximum activation"}
                />
              </Grid>
              <Grid item xs={6} style={{ height: "inherit" }}>
                < TabContent
                  viewState={props.viewState}
                  filterInspectionCallback={(index, view) => props.filterInspectionCallback(index, view, props.selectedTab)}
                  currentTab={props.selectedTab}
                  value={value}
                  filterImgSize={props.filterImgSize}
                  layerFilters={extraProps["relevance"]}
                  name={"Maximum relevance (to target)"} />
              </Grid>
            </Grid>)
            : (<Grid item xs={12}>
              < TabContent
                viewState={props.viewState}
                filterInspectionCallback={(index, view) => props.filterInspectionCallback(index, view, props.selectedTab)}
                currentTab={props.selectedTab}
                value={value}
                filterImgSize={props.filterImgSize}
                layerFilters={props.filters}
                name={""} />
            </Grid>)
          }
        </Grid>
      </Grid>
      {/*   <Grid className={classes.download}>
        <DownloadButton name={"Download Settings"} id={"settings"} />
        <DownloadButton name={"Download PDF"} id={"pdf"} />
      </Grid> */}
    </Card>
  );
};
