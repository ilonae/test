import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import queryString from 'query-string'
import { useLocation, useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core';

import { Container, Grid, CircularProgress, Typography } from '@material-ui/core';

import FilterComponent from './components/FilterComponent';
import ImagesComponent from './components/ImagesComponent';
import NetworkComponent from './components/NetworkComponent';
import BottomComponent from './components/BottomComponent';
import TextFader from './widgets/TextFader';

import queueries from './util/queries';
import helper from './util/helper';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  errorText: {
    fontStyle: 'bold',
  },
  loading: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    marginTop: '-10vh'
  }
}));

const XAIBoard = () => {
  const classes = useStyles();
  const [viewType, changeViewType] = React.useState('DEFAULTVIEW');
  const [isWatershed, changeWatershed] = React.useState(false);
  const [filterAmount, changeFilterAmount] = React.useState(6);
  const [imgSize, setImgSize] = React.useState(28);
  const [filterImgSize, setFilterImgSize] = React.useState(28);
  const [filterActivationsSize, setFilterActivationsSize] = React.useState(28);
  const [order, setOrder] = React.useState('max');

  const [modus, changeModus] = React.useState(0);
  const [index, changeIndex] = React.useState(0);
  const [filterIndex, changeFilterIndex] = React.useState(0);
  const [queryActivations, setActivations] = React.useState(0);

  const [experimentLayers, setExperimentsLayers] = React.useState();
  const [experiments, setExperiments] = React.useState();
  const [experiment, changeExperiment] = React.useState('');

  const [methods, setMethods] = React.useState();
  const [method, changeMethod] = React.useState('');

  const [layer, changeLayer] = React.useState([]);
  const [singleLayer, setSingleLayer] = React.useState('');

  const [cnnLayers, setCnnLayers] = React.useState();
  const [isCnn, setCnn] = React.useState(0);

  const [image, setImage] = React.useState('');
  const [heatmap, setHeatmap] = React.useState('');

  const [filterData, setFilterData] = React.useState();
  const [graphData, setGraphData] = React.useState();
  const [prevView, setPrevView] = React.useState('');
  const [prevParams, setPrevParams] = React.useState({});

  let element = document.getElementsByClassName('ReactCrop__image')[1];
  const history = useHistory();

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    const fetchSettings = async () => {
      await queueries.getSettings().then(data => {
        setExperimentsLayers(data.layers);
        setExperiments(data.experiments);
        changeExperiment(data.experiments[0]);
        setMethods(data.methods);
        changeMethod(data.methods[0])
        changeLayer(data.layers[data.experiments[0]]);
        setSingleLayer(data.layers[data.experiments[0]][0]);
        setCnnLayers(data.cnnLayers);
        setCnn(Object.values(data.cnnLayers[data.experiments[0]])[0]);
        if (Object.keys(values).length == 0) {
          history.push(`/dashboard?experiment=${data.experiments[0]}&method=${data.methods[0]}&index=${index}&order=${order}&view=${viewType}&selectedLayer=${data.layers[data.experiments[0]][0]}&watershed=${isWatershed}`);
        }
      });
      setImgSize(helper.defineImgs());
    };
    if (Object.keys(values).length == 0) {
      fetchSettings();
    }
  }, []);


  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    setPrevParams(values);
    const fetchSettings = async (experiment, layer) => {
      await queueries.getSettings().then(data => {
        setExperimentsLayers(data.layers);
        setExperiments(data.experiments);
        setMethods(data.methods);
        const index = data.layers[experiment].indexOf(layer);
        changeLayer(data.layers[experiment]);
        setCnnLayers(data.cnnLayers);
        setCnn(Object.values(data.cnnLayers[experiment])[index]);
      });
    };
    if (Object.keys(values).length !== 0 && prevParams !== values) {
      fetchSettings(values.experiment, values.selectedLayer);
      changeExperiment(values.experiment);
      changeMethod(values.method);
      changeIndex(values.index);
      setOrder(values.order);
      changeViewType(values.view);
      setSingleLayer(values.selectedLayer);
      setWatershed(values.isWatershed);
      setImgSize(helper.defineImgs());
    }
  }, [window.location.search]);

  React.useEffect(() => {
    const fetchActivations = async () => {
      changeViewType('LOADINGVIEW')
      setTimeout(() => {
        changeViewType('DEFAULTVIEW');
      }, 5000);
      const filters = queueries.getFilter(
        singleLayer,
        filterAmount,
        order,
        experiment,
        index,
        method, 200, 0
      );
      const data = await Promise.resolve(filters);
      changeViewType(prevView);
      if (data) {
        setFilterData(data);
        console.log(data)
        console.log('filter set')
      }
    }
    if (singleLayer && experiment && method && index && filterAmount) {
      fetchActivations()
    }
  }, [singleLayer, experiment, method, index, order, filterAmount]);


  React.useEffect(() => {
    if (
      experiment &&
      imgSize != 28 &&
      singleLayer &&
      method &&
      order &&
      filterAmount &&
      modus === 0
    ) {
      const fetchImages = async () => {
        changeViewType('LOADINGVIEW');
        changeModus(0);
        setActivations(0);
        const image = queueries.getImg(index, experiment, imgSize);
        const heatmap = queueries.getHeatmap(index, experiment, method, imgSize);
        const imageSize = helper.defineFilterImageSize(filterAmount);
        setFilterImgSize(imageSize)
        setFilterActivationsSize(imageSize * 3)
        const filters = queueries.getFilter(
          singleLayer,
          filterAmount,
          order,
          experiment,
          index,
          method,
          imageSize
        );
        const contents = [image, heatmap, filters];
        const data = await Promise.all(contents);
        changeViewType(prevView);
        if (data) {
          console.log('fetching imgs')
          setImage(data[0]);
          setHeatmap(data[1]);
          setFilterData(data[2]);
        }
      };
      fetchImages();
    }
  }, [index, experiment, method, imgSize]);


  const setWatershed = bool => {
    changeWatershed(bool);
    if (element) {
      let width = element.clientWidth;
      let height = element.clientHeight;
      var canvas = document.createElement('canvas');
      canvas.height = height; //get original canvas height
      canvas.width = width; // get original canvas width
      var context = canvas.getContext('2d');
      if (bool === true) {
        const watershed = queueries.getWatershed(index, method, experiment, imgSize);
        Promise.resolve(watershed).then(results => {

          var img1 = new Image();
          img1.onload = function () {
            for (let i = 1; i < results.masks.length; i++) {
              var img2 = new Image();
              img2.src = 'data:image/png;base64,' + results.masks[i];
              img2.onload = function () {
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
          canvas.setAttribute("id", "canvas");
          element.parentNode.appendChild(canvas)
          element.parentNode.removeChild(element);

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
        const canvas = document.getElementById('canvas');
        if (canvas) {
          canvas.parentNode.appendChild(element)
          canvas.parentNode.removeChild(canvas);
        }
      }
    }
  };

  const localAnalysis = async (x, y, width, height, maskId = -1) => {
    const normedValues = helper.normLocalSelection(x, y, width, height, imgSize);
    /* console.log(filterImgSize)
    console.log(normedValues.newX, normedValues.newY, normedValues.newWidth, normedValues.newHeight);
      */ changeViewType('LOADINGVIEW');
    const filters = queueries.getLocalAnalysis(
      normedValues.newX,
      normedValues.newY,
      normedValues.newWidth,
      normedValues.newHeight,
      order,
      singleLayer,
      experiment,
      index,
      method,
      filterAmount,
      filterImgSize,
      maskId
    );

    const data = await Promise.resolve(filters);
    changeViewType(prevView);
    if (data) {
      setFilterData(data);
    }
  };

  const getFilterHeatmap = (value) => {
    changeFilterIndex(value);
    const filterHeatmap = queueries.getSingleHeatmap(experiment, index, method, value, singleLayer);
    Promise.resolve(filterHeatmap).then(results => {
      setHeatmap('data:image/png;base64,' + results.image)
    })
  }

  const currentFilterIndex = value => {
    changeFilterIndex(value);

  }
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
    changeLayer(experimentLayers[value])
    setSingleLayer(experimentLayers[value][0])
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
    console.log(value)
  };

  const buttonClickedCallback = value => {
    console.log(value);
    changeModus(value);
  };

  const isCnnCallback = value => {
    console.log(value);
    setActivations(value);
  };




  React.useEffect(() => {
    if (queryActivations === 1) {
      setFilterImgSize(filterActivationsSize * 3)
      const fetchActivations = async () => {
        changeViewType('LOADINGVIEW');
        console.log(singleLayer)
        const filters = queueries.getFilter(
          singleLayer,
          filterAmount,
          order,
          experiment,
          index,
          method,
          filterActivationsSize,
          queryActivations
        );

        const data = await Promise.resolve(filters);
        changeViewType(prevView);

        if (data) {
          setFilterData(data);
        }

      };

      fetchActivations();


    }
  }, [queryActivations, filterAmount, index, method, order, singleLayer, filterImgSize]);


  React.useEffect(() => {
    if (singleLayer && cnnLayers && experiment) {
      setCnn(cnnLayers[experiment][singleLayer]);
    }
  }, [singleLayer, cnnLayers, experiment, setCnn]);

  React.useEffect(() => {
    if (viewType === 'IMAGEVIEW') {
      setImgSize(helper.defineImgs());

    }
  }, [viewType]);









  React.useEffect(() => {
    if (viewType === "GRAPHVIEW" && filterIndex) {
      let currentUrlParams = new URLSearchParams(window.location.search)
      console.log(currentUrlParams) // "?filter=top&origin=im"
      currentUrlParams.set('view', viewType);
      history.push(window.location.pathname + "?" + currentUrlParams.toString());
      const fetchGraph = async () => {
        changeViewType('LOADINGVIEW');

        const filters = queueries.getAttributionGraph(
          index,
          experiment,
          method,
          filterImgSize,
          singleLayer,
          filterIndex
        );
        const data = await Promise.resolve(filters);
        changeViewType(prevView);
        if (Object.keys(data).length === 0) {
          setPrevView(viewType);
          changeViewType('ERRORVIEW');
          setTimeout(() => {
            changeViewType('DEFAULTVIEW');
          }, 5000);
        }
        else {
          setGraphData(data);
        }

      };
      fetchGraph();
    }
  }, [filterIndex]);


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
          background: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}
      ><div className={classes.loading}>
          <CircularProgress size='10vh' />
          <TextFader />
        </div>
      </Grid>
      <Grid item xl={2} lg={3} md={4} xs={4}>
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
      <Grid item xl={10} lg={9} md={8} xs={8}>
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
          models={experiments}
          experimentsCallbackParent={selectedExperiment}
          methodsCallbackParent={selectedMethod}
          layerCallbackParent={selectedLayer}
          filters={filterData}
          filterImgSize={filterImgSize}
          indexCallback={currentFilterIndex}
        />
        <BottomComponent
          modus={modus}
          isCnnLayer={isCnn}
          filterAmount={filterAmount}
          isCnnCallback={isCnnCallback}
          bottomCallback={filterAmountCallback}
          selectedButtonCallback={buttonClickedCallback}
        />
      </Grid>
    </Grid>
  );

  const errorGrid = (
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
          background: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}
      >
        <div className={classes.loading}>
          <Typography gutterBottom variant="h2" className={classes.errorText}>No Graph available!</Typography>
        </div>
      </Grid>
      <Grid item xl={2} lg={3} md={4} xs={4}>
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
      <Grid item xl={10} lg={9} md={8} xs={8}>
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
          models={experiments}
          experimentsCallbackParent={selectedExperiment}
          methodsCallbackParent={selectedMethod}
          layerCallbackParent={selectedLayer}
          filters={filterData}
          filterImgSize={filterImgSize}
          indexCallback={currentFilterIndex}
        />
        <BottomComponent
          modus={modus}
          isCnnLayer={isCnn}
          filterAmount={filterAmount}
          isCnnCallback={isCnnCallback}
          bottomCallback={filterAmountCallback}
          selectedButtonCallback={buttonClickedCallback}
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
      </Grid>
    </Grid>
  );

  const defaultGrid = (
    <Grid container spacing={3}>
      <Grid item xl={2} lg={3} md={4} xs={4} >
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

      <Grid item xl={10} lg={9} md={8} xs={8}>
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
          models={experiments}
          experimentsCallbackParent={selectedExperiment}
          methodsCallbackParent={selectedMethod}
          layerCallbackParent={selectedLayer}
          filters={filterData}
          filterImgSize={filterImgSize}
          indexCallback={currentFilterIndex}
        />
        <BottomComponent
          modus={modus}
          isCnnLayer={isCnn}
          filterAmount={filterAmount}
          isCnnCallback={isCnnCallback}
          bottomCallback={filterAmountCallback}
          selectedButtonCallback={buttonClickedCallback}
        />
      </Grid>
    </Grid>
  );

  const graphGrid = (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <NetworkComponent
          viewState={viewType}
          viewCallback={viewState}
          graph={graphData}
          filterIndex={filterIndex} />

      </Grid>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <BottomComponent
          modus={modus}
          isCnnLayer={isCnn}
          filterAmount={filterAmount}
          isCnnCallback={isCnnCallback}
          bottomCallback={filterAmountCallback}
          selectedButtonCallback={buttonClickedCallback}
        />
      </Grid>
    </Grid>
  );

  return (
    <div>
      <Container maxWidth="xl">
        {(function () {
          switch (viewType) {
            case 'IMAGEVIEW':
              return imageGrid;
            case 'DEFAULTVIEW':
              return defaultGrid;
            case 'GRAPHVIEW':
              return graphGrid;
            case 'LOADINGVIEW':
              return loadingGrid;
            case 'ERRORVIEW':
              return errorGrid;
            default:
              return defaultGrid;
          }
        })()}
      </Container>
    </div>
  );
};

export default XAIBoard;
