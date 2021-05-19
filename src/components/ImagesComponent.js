import React from 'react';
import { makeStyles, Grid, Card, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Image from '../container/Image';
import WatershedButton from '../widgets/WatershedSwitch';
import ExpansionButton from '../widgets/ExpansionButton';
const useStyles = makeStyles(theme => ({
  images: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
  },
  root:{
    height:'92vh',
    padding:'3vh',
    paddingLeft:'6vh',
    paddingRight:'6vh'
  },
  expanded: {
    height: '70vh',
    margin: '2vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  centering:{
    justifyContent:'center'
  },
  textfield: { width: '95%',
height:'5vh' }
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
    <Grid container spacing={5} className={classes.centering} >
        <Grid item
          className={
            ['LOADINGVIEW', 'DEFAULTVIEW'].includes(viewState)
              ? classes.images
              : classes.expanded
          }
        >
          <Image
            viewType={viewState}
            content={image}
            title={'image'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />

          <Image
            viewType={viewState}
            content={heatmap}
            title={'heatmap'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
        </Grid>

        <Grid item lg={12} md={12} xl={12} xs={12} >
        <WatershedButton isToggledCallback={toggleCallback} />{' '}
        <div>


        <Typography gutterBottom>Image Index:</Typography>
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
        <ExpansionButton
          expansionCallback={expansionCallback}
          viewState={isExpanded}
          
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
