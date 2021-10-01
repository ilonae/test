import React from 'react';
import PropTypes from 'prop-types';
import { Card, makeStyles, Grid, Typography, Tab, Tabs, withStyles } from '@material-ui/core';

import SortingButton from '../widgets/SortingWidget';
import TabContent from '../widgets/Tab';
import Selection from '../widgets/SelectionWidget';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '91vh',
    padding: '3vh',
    position: 'relative',
    overflow: 'hidden',
    width: "100%",
  },

  innergrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1em',

  },


  grid: { width: '100%' },
  centering: {
    paddingLeft: '3vh',
    paddingBottom: '5vh',
    justifyContent: 'center'
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  }
}));

const FilterComponent = ({
  target,
  selectedExperiment,
  selectedMethod,
  selectedLayer,
  viewTypeCallback,
  filterActivationCallback,
  filterHeatmapCallback,
  orderCallback,
  order,
  layers,
  methods,
  models,
  experimentsCallback,
  methodsCallback,
  layerCallback,
  filters,
  filterImgSize,
  indexCallback,
  filterInspectionCallback,
  filterSamplesCallback,
  nameCallback,
  isSynth,
  isCnn,
  isMaxActivation,
  isMaxRelevanceTarget,
  hasRelevanceStats,
  hasActivationStats,
  analysisCallback,
  compareCallback
}) => {
  const [tabCaption, setTabCaption] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [currentTab, setCurrentTab] = React.useState('');
  const [compare, setToCompare] = React.useState(false)

  const handleChange = (_, newValue) => {
    setValue(newValue);
    if (tabCaption[newValue].props.analysis === 'comparison') {
      setToCompare(!compare)
      compareCallback(true)
    }
    else {
      setToCompare(false)
      setCurrentTab(tabCaption[newValue].props.name)
      analysisCallback(tabCaption[newValue].props.analysis)
      //layerCallbackParent(value);
    }

  };
  const classes = useStyles();

  const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#1890ff',
    },
  })(Tabs);

  const AntTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
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
  }))((props) => <Tab disableRipple {...props} />);


  React.useEffect(() => {
    if (tabCaption.length) {
      setCurrentTab(tabCaption[0].props.name)
    }
  }, [tabCaption]);

  React.useEffect(() => {

    console.log(filters)
    let tabPanelBox = [];
    if (isMaxActivation === 1) {
      tabPanelBox.push(<AntTab label={'Show max activations'} key={0} name={'activation'} analysis={'max_activation'} />)
    }
    if (isMaxRelevanceTarget === 1) {
      tabPanelBox.push(<AntTab label={'Show max relevances'} key={1} name={'relevance'} analysis={'max_relevance_target'} />)
    } else {
      tabPanelBox.push(<AntTab label={'Show max relevances'} disabled={true} key={1} name={'relevance'} analysis={'max_relevance_target'} />)

    }
    if (isSynth === 1) {
      tabPanelBox.push(<AntTab label={'Show synthetic samples'} key={2} name={'synthetic'} analysis={'synthetic'} />)
    }
    else {
      tabPanelBox.push(<AntTab label={'Show synthetic samples'} disabled={true} key={2} name={'synthetic'} analysis={'synthetic'} />)

    }
    if (isCnn === 1) {
      tabPanelBox.push(<AntTab label={'Show CNN activations'} key={3} name={'cnn'} analysis={'cnn_activation'} />)
    }
    else {
      tabPanelBox.push(<AntTab label={'Show CNN activations'} disabled={true} key={3} name={'cnn'} analysis={'cnn_activation'} />)

    }
    tabPanelBox.push(<AntTab label={'Compare activation and relevance'} key={4} name={'compare'} analysis={'comparison'} />)

    setTabCaption(tabPanelBox)

  }, [isSynth,
    isCnn,
    isMaxActivation,
    isMaxRelevanceTarget]);
  return (
    <Card className={classes.root} name={'filterCard'}>
      <Grid className={classes.grid} container spacing={5}>
        <Grid item className={classes.innergrid} xs={12}>
          <Selection
            select={'Experiment'}
            selectedParam={selectedExperiment}
            parentCallback={experimentsCallback}
            params={models}
          />
          <Selection
            select={'Layer'}
            selectedParam={selectedLayer}
            parentCallback={layerCallback}
            params={layers}
          />
          <Selection
            select={'Method'}
            selectedParam={selectedMethod}
            parentCallback={methodsCallback}
            params={methods}
          />
          <SortingButton parentOrder={order} parentCallback={orderCallback} />

        </Grid>
        <Grid item xs={12}>

          <Grid container spacing={5} className={classes.centering} >
            <Typography gutterBottom  >Explanation (Target class: {target} ) </Typography>
          </Grid>
          <div className={classes.tabs}>

            <AntTabs value={value} onChange={handleChange} indicatorColor="primary"
              textColor="primary" variant='scrollable' >
              {tabCaption}
            </AntTabs>
          </div>

          {compare ?
            (<Grid container>
              <Grid item xs={6}>
                < TabContent currentTab={currentTab} value={value} filterImgSize={filterImgSize} layerFilters={filters} />
              </Grid>
              <Grid item xs={6}>
                < TabContent currentTab={currentTab} value={value} filterImgSize={filterImgSize} layerFilters={filters} />
              </Grid>
            </Grid>)
            : (<Grid item xs={12}>
              < TabContent nameCallback={nameCallback} filterInspectionCallback={(index, view) => filterInspectionCallback(index, view, currentTab)} currentTab={currentTab} hasRelevanceStats={hasRelevanceStats} hasActivationStats={hasActivationStats} indexCallback={value => indexCallback(value, currentTab)} viewTypeCallback={viewTypeCallback} filterSamplesCallback={filterSamplesCallback} filterHeatmapCallback={filterHeatmapCallback} filterActivationCallback={filterActivationCallback} value={value} filterImgSize={filterImgSize} layerFilters={filters} />
            </Grid>)
          }


        </Grid>
      </Grid>
    </Card>
  );
};

FilterComponent.propTypes = {
  selectedLayer: PropTypes.string,
  selectedExperiment: PropTypes.string,
  selectedMethod: PropTypes.string,
  order: PropTypes.string,
  viewTypeCallback: PropTypes.func,
  experimentsCallbackParent: PropTypes.func,
  methodsCallbackParent: PropTypes.func,
  indexState: PropTypes.number,
  viewState: PropTypes.string,
  filterAmount: PropTypes.number,
  layers: PropTypes.array,
  methods: PropTypes.array,
  models: PropTypes.array,
  filterImgSize: PropTypes.number
};

export default FilterComponent;
