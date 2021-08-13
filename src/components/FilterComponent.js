import React from 'react';
import PropTypes from 'prop-types';
import { Card, makeStyles, Grid, Typography, Tab, Tabs, withStyles } from '@material-ui/core';

import SortingButton from '../widgets/SortingButton';
import TabContent from '../widgets/Tab';
import Selection from '../widgets/Selection';

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
  selectedLayer,
  selectedExperiment,
  selectedMethod,
  parentCallback,
  filterActivationCallback,
  filterHeatmapCallback,
  orderCallback,
  order,
  viewState,
  layers,
  methods,
  models,
  experimentsCallbackParent,
  methodsCallbackParent,
  layerCallbackParent,
  filters,
  filterImgSize,
  indexCallback,
  filterSamplesCallback
}) => {
  const [tabCaption, setTabCaption] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    layerCallbackParent(tabCaption[newValue].props.label)
    //layerCallbackParent(value);
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

  const experimentsCallback = value => {
    experimentsCallbackParent(value);
  };

  const methodsCallback = value => {
    methodsCallbackParent(value);
  };

  const sortingCallback = value => {
    orderCallback(value);
  };





  React.useEffect(() => {
    if (filters && filters.length) {
      console.log(filters)
      let tabPanelBox = [];
      for (let layer in layers) {
        tabPanelBox.push(<AntTab label={layers[layer]} />)
      }
      setTabCaption(tabPanelBox)
    }
  }, [filters, filterActivationCallback, value]);
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
            select={'Method'}
            selectedParam={selectedMethod}
            parentCallback={methodsCallback}
            params={methods}
          />
          <SortingButton parentOrder={order} parentCallback={sortingCallback} />

        </Grid>
        <Grid item xs={12}>

          <Grid container spacing={5} className={classes.centering} >
            <Typography gutterBottom  >Explanation ({selectedExperiment} Perception for predicted class ) </Typography>
          </Grid>
          <div className={classes.tabs}>

            <AntTabs value={value} onChange={handleChange} indicatorColor="primary"
              textColor="primary" variant='scrollable' centered>
              {tabCaption}
            </AntTabs>
          </div>
          <Grid item xs={12}>
            < TabContent indexCallback={indexCallback} parentCallback={parentCallback} filterSamplesCallback={filterSamplesCallback} filterHeatmapCallback={filterHeatmapCallback} filterActivationCallback={filterActivationCallback} value={value} filterImgSize={filterImgSize} layerFilters={filters} />
          </Grid>

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
  parentCallback: PropTypes.func,
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
