import React from 'react';
import { makeStyles, TextField, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import ImgBox from './ImgBox';
import WatershedButton from './WatershedSwitch';
import ExpansionButton from './ExpansionButton';

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
  }
}));

const ImagesContainer = ({
  viewCallback,
  indexCallback,
  viewState,
  experiment,
  method
}) => {
  const classes = useStyles();
  const [isExpanded, changeLayout] = React.useState(viewState);
  const [isToggled, setToggle] = React.useState(false);

  const [image, setImage] = React.useState('');
  const [heatmap, setHeatmap] = React.useState('');

  const [experimentState, setExperiment] = React.useState('LeNet');
  const [methodState, setMethod] = React.useState('epsilon_plus');

  const [watershed, setWatershed] = React.useState();
  const [index, changeIndex] = React.useState(0);

  async function getImg() {
    await fetch('/api/get_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_index: index, experiment })
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          const obj = JSON.parse(json);
          const img = `data:image/png;base64,${obj.image}`;
          setImage(img);
        });
      }
    });
  }

  async function getHeatmap() {
    await fetch('/api/get_heatmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_index: index,
        experiment,
        method
      })
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          const obj = JSON.parse(json);
          console.log('reached', obj);
          const img = `data:image/png;base64,${obj.image}`;
          setHeatmap(img);
        });
      }
    });
  }

  const expansionCallback = value => {
    changeLayout(value);
  };

  const toggleCallback = value => {
    setToggle(value);
  };

  const maskCallback = value => {
    const watershedMap = JSON.parse(value);
    setWatershed(watershedMap.masks[0]);
  };

  React.useEffect(() => {
    viewCallback(isExpanded);
  }, [isExpanded, viewCallback]);

  React.useEffect(() => {
    indexCallback(index);
  }, [index, indexCallback]);

  function handleTextFieldChange(e) {
    if (e.target.value !== '') {
      changeIndex(Number(e.target.value));
    }
  }

  React.useEffect(() => {
    if (experiment !== '' && method !== '') getHeatmap();
  }, [index, experiment, method]);

  React.useEffect(() => {
    if (experiment !== '') getImg();
  }, [index, experiment]);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <WatershedButton
          isToggledCallback={toggleCallback}
          maskCallback={maskCallback}
          imageIndex={index}
        />{' '}
        <TextField
          name="index"
          label="Selected index"
          type="number"
          InputProps={{
            inputProps: {
              max: 100,
              min: 0
            }
          }}
          style={{ width: '100%' }}
          value={index}
          onChange={handleTextFieldChange}
        />
        <div
          className={
            isExpanded === 'DEFAULTVIEW' ? classes.root : classes.expanded
          }
        >
          <ImgBox
            isToggled={isToggled}
            title={'original'}
            viewType={isExpanded}
            content={image}
          />

          <ImgBox
            isToggled={isToggled}
            title={'heatmap'}
            viewType={isExpanded}
            content={heatmap}
            watershed={watershed}
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

ImagesContainer.propTypes = {
  expansionCallback: PropTypes.func,
  viewCallback: PropTypes.func,
  indexCallback: PropTypes.func,
  viewState: PropTypes.string,
  settings: PropTypes.bool,
  experiment: PropTypes.string,
  method: PropTypes.string
};

export default ImagesContainer;
