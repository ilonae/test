import React from 'react';
import { makeStyles, TextField, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import Image from '../container/Image';
import WatershedButton from '../widgets/WatershedSwitch';
import ExpansionButton from '../widgets/ExpansionButton';
const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    marginBottom: theme.spacing(3)
  },
  expanded: {
    height: '70vh',
    margin: '2vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  textfield: { width: '95%' }
}));

const ImagesComponent = ({
  viewCallback,
  indexCallback,
  viewState,
  image,
  heatmap,
  parentLACallback,
  index: parentIndex,
  parentToggleCallback
}) => {
  const classes = useStyles();
  const [isExpanded, changeLayout] = React.useState(viewState);
  const [watershed, setWatershed] = React.useState();

  const [index, setIndex] = React.useState(0);

  function handleEnter(e) {
    if (e.key === 'Enter') {
      indexCallback(index);
    }
  }

  function handleIndexChange(e) {
    if (e.target.value !== '') {
      setIndex(Number(e.target.value));
    }
  }

  const expansionCallback = value => {
    changeLayout(value);
  };

  const toggleCallback = value => {
    parentToggleCallback(value);
  };

  const localAnalysisCallback = (x, y, width, height) => {
    parentLACallback(x, y, width, height);
  };

  const maskCallback = value => {
    const watershedMap = JSON.parse(value);
    setWatershed(watershedMap.masks[0]);
  };

  React.useEffect(() => {
    if (parentIndex) {
      setIndex(parentIndex);
    }
  }, [parentIndex]);

  React.useEffect(() => {
    viewCallback(isExpanded);
  }, [isExpanded, viewCallback]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <WatershedButton isToggledCallback={toggleCallback} />{' '}
        <div>
          <input
            type="number"
            name="index"
            label="Selected index"
            onKeyDown={handleEnter}
            onChange={handleIndexChange}
            className={classes.textfield}
            value={index}
          />
        </div>
        <div
          className={
            isExpanded === 'DEFAULTVIEW' ? classes.root : classes.expanded
          }
        >
          <Image
            viewType={isExpanded}
            content={image}
            title={'image'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />

          <Image
            viewType={isExpanded}
            content={heatmap}
            title={'heatmap'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
        </div>
        <ExpansionButton
          expansionCallback={expansionCallback}
          viewState={isExpanded}
        />
      </Grid>
    </Grid>
  );
};

ImagesComponent.propTypes = {
  expansionCallback: PropTypes.func,
  viewCallback: PropTypes.func,
  indexCallback: PropTypes.func,
  viewState: PropTypes.string,
  experiment: PropTypes.string,
  method: PropTypes.string,
  parentLACallback: PropTypes.func,
  parentToggleCallback: PropTypes.func
};

export default ImagesComponent;
