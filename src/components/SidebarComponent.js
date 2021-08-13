import React from 'react';
import { makeStyles, Grid, Card, Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import Image from '../container/Image';
const useStyles = makeStyles({
  images: {
    maxHeight: '90%',
    display: 'inherit',
    flexDirection: 'row'

  },
  tools: {
    justifyContent: 'center'
  },
  root: {
    textAlign: 'center',
    height: '91vh',
    padding: '3vh',
    display: 'flex',
    flexDirection: 'column',
  },
  expanded: {
    height: '70vh',
    margin: '2vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  centering: {
    justifyContent: 'center',
    height: 'inherit'
  },
  textfield: {
    width: '95%',
  }
});

const ImagesComponent = ({
  maxIndex,
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

  const [index, setIndex] = React.useState(0);

  const min = 0;
  const max = 10;

  function handleEnter(e) {
    if (e.key === 'Enter') {
      indexCallback(index);
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

  React.useEffect(() => {
    if (parentIndex) {
      setIndex(parentIndex);
    }
  }, [parentIndex]);

  React.useEffect(() => {
    viewCallback(isExpanded);
  }, [isExpanded, viewCallback]);

  return (
    <Card className={classes.root} name={'imgCard'} >
      <Grid container className={classes.centering} >
        <Grid container lg={12} md={12} xl={12} xs={12} className={classes.tools} >
          {/* <Grid item lg={6} md={6} xl={6} xs={12} className={classes.tools}>
            <WatershedButton isToggledCallback={toggleCallback} />{' '}
          </Grid> */}
          <Grid item lg={6} md={6} xl={6} xs={12} >
            <Typography gutterBottom>Image Index:</Typography>

            <TextField
              type="number"
              inputProps={{ min, max }}
              value={index}
              onChange={(e) => {
                var value = parseInt(e.target.value);

                if (value > maxIndex) value = maxIndex;
                if (value < 0) value = 0;

                setIndex(value);
              }}
              onKeyDown={handleEnter}
            />
          </Grid>
        </Grid>
        <Grid container lg={12} md={12} xl={12} xs={12}
          className={
            ['LOADINGVIEW', 'DASHBOARDVIEW', 'ERRORVIEW'].includes(viewState)
              ? classes.images
              : classes.expanded
          }
        >
          <Image
            viewType={viewState}
            content={image}
            title={'Image'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />

          <Image
            viewType={viewState}
            content={heatmap}
            title={'Heatmap'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
        </Grid>



      </Grid>
    </Card>
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
