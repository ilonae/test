import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';

import { Container, Grid, CircularProgress } from '@material-ui/core';

import FilterComponent from './components/FilterComponent';
import ImagesComponent from './components/ImagesComponent';
import NetworkComponent from './components/NetworkComponent';
import BottomComponent from './components/BottomComponent';

import queueries from './util/queries';

const XAIBoard = () => {
  const [viewType, changeViewType] = React.useState('DEFAULTVIEW');
  const [filterAmount, changeFilterAmount] = React.useState(6);
  const [index, changeIndex] = React.useState(0);
  const [experiment, changeExperiment] = React.useState('');
  const [method, changeMethod] = React.useState('');
  const [layer, changeLayer] = React.useState([]);

  const [experimentLayers, setExperimentsLayers] = React.useState();
  const [methods, setMethods] = React.useState();
  const [models, setExperiments] = React.useState();

  const [singleLayer, setSingleLayer] = React.useState('');
  const [image, setImage] = React.useState('');
  const [heatmap, setHeatmap] = React.useState('');
  const [order, setOrder] = React.useState('max');

  const [filterData, setFilterData] = React.useState();

  const [prevView, setPrevView] = React.useState('');

  let context;

  const setWatershed = bool => {
    if (bool === true) {
      var element = document.getElementsByClassName('ReactCrop__image')[1];
      var canvas = document.getElementById('canvas');
      const watershed = queueries.getWatershed(index, method, experiment);
      Promise.resolve(watershed).then(results => {
        context = canvas.getContext('2d');
        element.parentNode.removeChild(element);
        console.log(results.masks.length);

        var img1 = new Image();

        img1.onload = function() {
          for (let i = 1; i < results.masks.length; i++) {
            var img2 = new Image();

            img2.src = 'data:image/png;base64,' + results.masks[i];
            img2.onload = function() {
              context.globalAlpha = 1.0;
              context.drawImage(img1, 0, 0);
              /*               var imgd = context.getImageData(0, 0, 135, 135),
                pix = imgd.data,
                newColor = { r: 0, g: 0, b: 0, a: 0 };

              for (var i = 0, n = pix.length; i < n; i += 4) {
                var r = pix[i],
                  g = pix[i + 1],
                  b = pix[i + 2];

                if (r == 0 && g == 0 && b == 0) {
                  // Change the white to the new color.
                  pix[i] = newColor.r;
                  pix[i + 1] = newColor.g;
                  pix[i + 2] = newColor.b;
                  pix[i + 3] = newColor.a;
                }
              }

              context.putImageData(imgd, 0, 0); */
              context.globalAlpha = 1 / results.masks.length; //Remove if pngs have alpha
              context.drawImage(img2, 0, 0);
              /*               var imgd = context.getImageData(0, 0, 135, 135),
                pix = imgd.data,
                newColor = { r: 0, g: 0, b: 0, a: 0 };

              for (var i = 0, n = pix.length; i < n; i += 4) {
                var r = pix[i],
                  g = pix[i + 1],
                  b = pix[i + 2];

                if (r == 0 && g == 0 && b == 0) {
                  // Change the white to the new color.
                  pix[i] = newColor.r;
                  pix[i + 1] = newColor.g;
                  pix[i + 2] = newColor.b;
                  pix[i + 3] = newColor.a;
                }
              }

              context.putImageData(imgd, 0, 0); */
            };
          }
        };

        img1.src = 'data:image/png;base64,' + results.masks[0];

        /* for (let i = 0; i < results.masks.length; i++) {
          const currImg = loadImage(
            'data:image/png;base64,' + results.masks[i]
          );
          imgArray.push(currImg);
        }
        context.globalAlpha = 1;
        const firstImg = imgArray[0];
        firstImg.onload = context.drawImage(firstImg, 0, 0);

        context.globalAlpha = 1 / results.masks.length;
        for (let i = 1; i < imgArray.length; i++) {
          let currImg = imgArray[i];
          currImg.onload = context.drawImage(currImg, 0, 0);
        } */
      });
    } else {
      var canvas = document.getElementById('canvas');

      var element = document.getElementsByClassName('ReactCrop__image')[1];

      canvas.insertAdjacentHTML('beforebegin', element.innerHTML);
    }
  };

  const localAnalysis = (x, y, width, height) => {
    const filters = queueries.getLocalAnalysis(
      x,
      y,
      width,
      height,
      order,
      singleLayer,
      experiment,
      index,
      method,
      filterAmount
    );

    Promise.resolve(filters).then(results => {
      setFilterData(results);
    });
  };

  const getFilterHeatmap = () => {
    console.log('test');
  };

  const selectedOrder = value => {
    setOrder(value);
  };

  const viewState = value => {
    changeViewType(value);
    setPrevView(value);
  };

  const indexState = value => {
    changeIndex(value);
  };

  const selectedExperiment = value => {
    changeExperiment(value);
  };

  const selectedMethod = value => {
    if (value) {
      changeMethod(value);
    }
  };
  const selectedLayer = value => {
    setSingleLayer(value);
  };

  const filterAmountCallback = value => {
    changeFilterAmount(value);
  };

  React.useEffect(() => {
    const fetchSettings = async () => {
      await queueries.getSettings().then(data => {
        setExperimentsLayers(data.layers);
        setMethods(data.methods);
        setExperiments(data.experiments);
        console.log(data.cnnLayers);
      });
    };
    fetchSettings();
  }, []);

  React.useEffect(() => {
    if (methods && models) {
      changeMethod(methods[0]);
      changeExperiment(models[0]);
    }
  }, [methods, models]);

  React.useEffect(() => {
    if (prevView) {
      console.log(prevView);
    }
  }, [prevView]);

  React.useEffect(() => {
    if (experiment) {
      setPrevView(viewType);
      changeViewType('LOADINGVIEW');
      changeLayer(experimentLayers[experiment]);
      setSingleLayer(experimentLayers[experiment][0]);
    }
  }, [experimentLayers, experiment]);

  React.useEffect(() => {
    if (experiment && singleLayer && method && order && filterAmount) {
      const fetchImages = async () => {
        changeViewType('LOADINGVIEW');
        const image = queueries.getImg(index, experiment);
        const heatmap = queueries.getHeatmap(index, experiment, method);
        const filters = queueries.getFilter(
          singleLayer,
          filterAmount,
          order,
          experiment,
          index,
          method
        );
        const contents = [image, heatmap, filters];
        Promise.allSettled(contents).then(results => {
          setImage(results[0].value);
          console.log(results[1].value);
          setHeatmap(results[1].value);
          setFilterData(results[2].value);
        });
      };
      fetchImages();
      setTimeout(() => {
        changeViewType(prevView);
      }, 3000);
    }
  }, [index, method, singleLayer, order, filterAmount]);

  const loadingGrid = (
    <Grid container spacing={3}>
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="stretch"
        style={{
          paddingTop: '50vh',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.5)',
          zIndex: 1
        }}
      >
        <CircularProgress />
      </Grid>
      <Grid item lg={2} md={2} xl={2} xs={2}>
        <ImagesComponent
          expansionCallback={viewState}
          indexCallback={indexState}
          viewCallback={viewState}
          viewState={viewType}
          image={image}
          heatmap={heatmap}
          parentLACallback={localAnalysis}
          index={index}
          parentToggleCallback={setWatershed}
        />
      </Grid>
      <Grid item lg={10} md={10} xl={10} xs={10}>
        <FilterComponent
          filterAmount={filterAmount}
          parentCallback={viewState}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={viewType}
          selectedLayer={singleLayer}
          selectedExperiment={experiment}
          selectedMethod={method}
          layers={layer}
          order={order}
          methods={methods}
          models={models}
          experimentsCallbackParent={selectedExperiment}
          methodsCallbackParent={selectedMethod}
          layerCallbackParent={selectedLayer}
          filters={filterData}
        />
        <BottomComponent
          filterAmount={filterAmount}
          bottomCallback={filterAmountCallback}
        />
      </Grid>
    </Grid>
  );

  const imageGrid = (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <ImagesComponent
          expansionCallback={viewState}
          indexCallback={indexState}
          viewCallback={viewState}
          viewState={viewType}
          image={image}
          heatmap={heatmap}
          parentLACallback={localAnalysis}
          index={index}
          parentToggleCallback={setWatershed}
        />
        <BottomComponent
          filterAmount={filterAmount}
          bottomCallback={filterAmountCallback}
        />
      </Grid>
    </Grid>
  );

  const defaultGrid = (
    <Grid container spacing={3}>
      <Grid item lg={2} md={2} xl={2} xs={2}>
        <ImagesComponent
          expansionCallback={viewState}
          indexCallback={indexState}
          viewCallback={viewState}
          viewState={viewType}
          image={image}
          heatmap={heatmap}
          parentLACallback={localAnalysis}
          index={index}
          parentToggleCallback={setWatershed}
        />
      </Grid>
      <Grid item lg={10} md={10} xl={10} xs={10}>
        <FilterComponent
          filterAmount={filterAmount}
          parentCallback={viewState}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={viewType}
          selectedLayer={singleLayer}
          selectedExperiment={experiment}
          selectedMethod={method}
          layers={layer}
          order={order}
          methods={methods}
          models={models}
          experimentsCallbackParent={selectedExperiment}
          methodsCallbackParent={selectedMethod}
          layerCallbackParent={selectedLayer}
          filters={filterData}
        />
        <BottomComponent
          filterAmount={filterAmount}
          bottomCallback={filterAmountCallback}
        />
      </Grid>
    </Grid>
  );

  const filterGrid = (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <NetworkComponent />
        <BottomComponent
          bottomCallback={filterAmountCallback}
          filterAmount={filterAmount}
        />
      </Grid>
    </Grid>
  );

  return (
    <div>
      <Container maxWidth="xl">
        {(function() {
          switch (viewType) {
            case 'IMAGEVIEW':
              return imageGrid;
            case 'DEFAULTVIEW':
              return defaultGrid;
            case 'FILTERVIEW':
              return filterGrid;
            case 'LOADINGVIEW':
              return loadingGrid;
            default:
              return defaultGrid;
          }
        })()}
      </Container>
    </div>
  );
};

export default XAIBoard;
