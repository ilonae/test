import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import queryString from 'query-string'
import { useLocation, useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core';

import { Container, Grid, CircularProgress, Typography } from '@material-ui/core';

import FilterComponent from './components/FilterComponent';
import ImagesComponent from './components/SidebarComponent';
import NetworkComponent from './components/NetworkComponent';
import BottomComponent from './components/BottomComponent';
import StatisticsComponent from './components/StatisticsComponent';
import TextFader from './widgets/TextFader';

import queueries from './util/queries';
import helper from './util/helper';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  errorText: {
    fontStyle: 'bold',
  },
  loading: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    marginTop: '-10vh'
  },
  expansionContainer: {
    display: 'flex', width: '196vw'
  },
  defaultContainer: {
    display: 'flex', width: '98vw'
  },
  default: {
    display: 'flex', flexGrow: 1, width: '98vw', visibility: "visible"
  },
  hiddenStatistics: {
    visibility: 'hidden',
    width: 0,
  },
  expandedStatistics: {
    display: 'flex',
    flexGrow: 1,
    width: '98vw',
    visibility: "visible"
  }
}));

const XAIBoard = () => {
  const classes = useStyles();
  const [viewType, changeViewType] = React.useState('DASHBOARDVIEW');
  const [isWatershed, changeWatershed] = React.useState(false);
  const [isChangedFromState, changeFromState] = React.useState(false);
  const [filterAmount, changeFilterAmount] = React.useState(6);
  const [samplesAmount, changeSamplesAmount] = React.useState(9);

  const [imgSize, setImgSize] = React.useState(28);
  const [filterImgSize, setFilterImgSize] = React.useState(28);
  const [filterActivationsSize, setFilterActivationsSize] = React.useState(28);
  const [order, setOrder] = React.useState('max');


  const [modus, changeModus] = React.useState(0);
  const [index, changeIndex] = React.useState(0);
  const [filterIndex, changeFilterIndex] = React.useState(0);
  const [queryActivations, setActivations] = React.useState(0);
  const [querySynths, setSynths] = React.useState(0);

  const [maxIndices, setMaxIndices] = React.useState();
  const [maxIndex, setMaxIndex] = React.useState(49999);

  const [experimentLayers, setExperimentsLayers] = React.useState();
  const [experiments, setExperiments] = React.useState();
  const [experiment, changeExperiment] = React.useState('');

  const [methods, setMethods] = React.useState();
  const [method, changeMethod] = React.useState('');

  const [layer, changeLayer] = React.useState([]);
  const [singleLayer, setSingleLayer] = React.useState('');

  const [cnnLayers, setCnnLayers] = React.useState();
  const [isCnn, setCnn] = React.useState(0);

  const [masks, setMasks] = React.useState();
  const [mask, setMask] = React.useState(0);

  const [synthLayer, setSynthLayers] = React.useState();
  const [isSynth, setSynth] = React.useState(0);

  const [image, setImage] = React.useState('');
  const [heatmap, setHeatmap] = React.useState('');

  const [filterData, setFilterData] = React.useState([]);
  const [graphData, setGraphData] = React.useState();
  const [statisticsData, setStatisticsData] = React.useState();
  const [prevView, setPrevView] = React.useState('');
  const [prevParams, setPrevParams] = React.useState({});

  let element = document.getElementsByClassName('ReactCrop__image')[1];
  const history = useHistory();



  //initial default settings
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    const fetchSettings = async () => {
      await queueries.getSettings().then(data => {
        console.log(data)
        setMaxIndices(data.maxIndices);
        setMaxIndex(data.maxIndices[0]);
        setExperimentsLayers(data.layers);
        setExperiments(data.experiments);
        changeExperiment(data.experiments[0]);
        setMethods(data.methods);
        changeMethod(data.methods[0])
        changeLayer(data.layers[data.experiments[0]]);
        //setSingleLayer(data.layers[data.experiments[0]][0]);
        setCnnLayers(data.cnnLayers);
        setCnn(Object.values(data.cnnLayers[data.experiments[0]])[0]);
        setSynthLayers(data.synthetics);
        setSynth(Object.values(data.synthetics[data.experiments[0]]));
        if (Object.keys(values).length == 0) {
          history.push(`/dashboard?experiment=${data.experiments[0]}&method=${data.methods[0]}&index=${index}&order=${order}&view=${viewType}&selectedLayer=${data.layers[data.experiments[0]][0]}&watershed=${isWatershed}`);
        }
      });

      await queueries.getLocalSegments().then(data => {
        console.log(data)
      });
      setImgSize(Math.round(helper.defineImgs()));
    };
    if (Object.keys(values).length == 0) {
      fetchSettings();
    }
  }, []);


  //loading results from query params
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    setPrevParams(values);
    const fetchSettings = async (experiment, layer) => {
      await queueries.getSettings().then(data => {
        console.log(data)
        setMaxIndices(data.maxIndices);
        setExperimentsLayers(data.layers);
        setExperiments(data.experiments);
        setMethods(data.methods);
        const index = data.layers[experiment].indexOf(layer);
        changeLayer(data.layers[experiment]);
        setCnnLayers(data.cnnLayers);
        setCnn(Object.values(data.cnnLayers[experiment])[index]);
        setSynthLayers(data.synthetics);
        setSynth(Object.values(data.synthetics[experiment]));

      });
      await queueries.getLocalSegments().then(data => {
        console.log(data)
      });
    };
    if (Object.keys(values).length !== 0 && values.experiment && values.selectedLayer && prevParams !== values && isChangedFromState === false) {
      fetchSettings(values.experiment, values.selectedLayer);
      changeExperiment(values.experiment);
      changeMethod(values.method);
      changeIndex(values.index);
      setOrder(values.order);
      changeViewType(values.view);

      //setSingleLayer(values.selectedLayer);
      setWatershed(values.isWatershed);
      setImgSize(Math.round(helper.defineImgs()));
      if (values.filterIndex) {
        changeFilterIndex(values.filterIndex)
      }
      if (maxIndices) {
        setMaxIndex(maxIndices[values.experiment]);
      }
    }
    else if (Object.keys(values).length !== 0 && isChangedFromState === true) {
      console.log('reached ehre!')
      changeFromState(false)
    }
  }, [window.location.search]);

  //hook listening on changes of layer, experiment, method, index and filter amount, will equally update filter in dashboard
  React.useEffect(() => {
    const fetchActivations = async (layer) => {
      setPrevView(viewType)
      changeViewType('LOADINGVIEW')
      setTimeout(() => {
        changeViewType(prevView);
      }, 5000);
      let filters = [];
      for (let singleLayer in layer) {
        let filter = queueries.getFilter(
          samplesAmount,
          layer[singleLayer],
          filterAmount,
          order,
          experiment,
          index,
          method, 200, 0,
        );

        filters.push(filter)
      }

      const data = await Promise.all(filters);
      console.log('filter set')
      changeViewType(prevView);
      if (data) {
        console.log(data)
        setFilterData(data);


      }
    }
    if (experiment && method && index && filterAmount && viewType === 'DASHBOARDVIEW' && samplesAmount) {
      fetchActivations(layer)
    }
  }, [experiment, method, index, order, filterAmount, samplesAmount]);


  //hook listening for changes in method, experiment and image index, updating image, heatmap and filters accordingly
  React.useEffect(() => {
    if (
      experiment &&
      imgSize != 28 &&
      //singleLayer &&
      method &&
      order &&
      filterAmount &&
      modus === 0
    ) {
      const fetchImages = async (layer) => {
        if (viewType === 'DASHBOARDVIEW') {
          setPrevView(viewType);
          changeViewType('LOADINGVIEW');
          changeModus(0);
          setActivations(0);
          const image = queueries.getImg(index, experiment, imgSize);
          const heatmap = queueries.getHeatmap(index, experiment, method, imgSize);
          let imageSize = helper.defineFilterImageSize(filterAmount);
          if (!imageSize) {
            imageSize = 200;
          }
          setFilterImgSize(imageSize)
          setFilterActivationsSize(imageSize * 3)
          const contents = [image, heatmap];
          for (let singleLayer in layer) {
            const filters = queueries.getFilter(
              samplesAmount,
              layer[singleLayer],
              filterAmount,
              order,
              experiment,
              index,
              method,
              imageSize
            );
            contents.push(filters);
          }


          const data = await Promise.all(contents);
          changeViewType(prevView);
          if (data) {
            console.log(data);
            console.log('fetching imgs')
            setImage(data[0]);
            setHeatmap(data[1]);
            setFilterData(data[2]);
          }
        }
      };
      fetchImages(layer);
    }
  }, [index, experiment, method, imgSize]);

  //watershed method, shall visualize different masks, TO BE UPDATED
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

  //local selection crop function, visualizing and updating relevances for parts of the image/heatmap
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

  //hook to set a graph of filter relevances
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    const newQueries = { ...values, filterIndex: filterIndex };
    history.push({ search: queryString.stringify(newQueries) });

    const fetchGraph = async () => {
      setPrevView(viewType);
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
      console.log(data)
      if (Object.keys(data).length === 0) {
        //console.log('filter set')
        changeViewType('ERRORVIEW');
        setTimeout(() => {
          changeViewType('DASHBOARDVIEW');
        }, 5000);
      }
      else {
        changeViewType(prevView);
        setGraphData(data);
      }

    };
    const fetchStatistics = async () => {
      setPrevView(viewType);
      changeViewType('LOADINGVIEW');

      const filters = queueries.getStatistics(
        index, experiment, 'l1', filterIndex, order
      );
      const data = await Promise.resolve(filters);
      console.log(data)
      if (Object.keys(data).length === 0) {
        //console.log('filter set')
        changeViewType('ERRORVIEW');
        setTimeout(() => {
          changeViewType('DASHBOARDVIEW');
        }, 5000);
      }
      else {
        changeViewType(prevView);
        setStatisticsData(data);
        console.log(data)
      }

    };
    if (viewType === "GRAPHVIEW" && filterIndex && singleLayer) {
      fetchGraph();
    }
    else if (viewType === "STATISTICSVIEW" && filterIndex && singleLayer) {
      fetchStatistics();
    }
  }, [filterIndex, singleLayer]);


  //hook to recalculate correct image size for image/heatmap view
  React.useEffect(() => {
    if (viewType === 'IMAGEVIEW') {
      setImgSize(Math.round(helper.defineImgs()));
    }
  }, [viewType]);


  //hook to visualize activations of filter
  React.useEffect(() => {

    setFilterImgSize(filterActivationsSize * 3)
    const fetchActivations = async (layer) => {
      changeViewType('LOADINGVIEW');
      let filters = [];
      for (let singleLayer in layer) {
        console.log(singleLayer)
        const filter = queueries.getFilter(
          samplesAmount,
          layer[singleLayer],
          filterAmount,
          order,
          experiment,
          index,
          method,
          filterActivationsSize,
          queryActivations
        );
        filters.push(filter)
      }

      const data = await Promise.all(filters);

      changeViewType(prevView);
      if (data) {
        console.log(data)
        setFilterData(data);
      }
    };

    const fetchSynths = async (layer) => {
      changeViewType('LOADINGVIEW');
      let filters = [];
      for (let singleLayer in layer) {
        const filter = queueries.getFilter(
          samplesAmount,
          layer[singleLayer],
          filterAmount,
          order,
          experiment,
          index,
          method,
          filterActivationsSize,
          undefined,
          querySynths
        );
        filters.push(filter)
      }
      const data = await Promise.all(filters);

      changeViewType(prevView);
      if (data) {
        setFilterData(data);
      }
    };
    if (queryActivations === 1) {
      fetchActivations(layer);
    } else if (querySynths === 1) {
      fetchSynths();
    }
  }, [queryActivations, querySynths, filterAmount, index, method, order, filterImgSize]);


  //visualizing heatmap according to selected filter
  const getFilterHeatmap = (value) => {
    changeFilterIndex(value);
    const filterHeatmap = queueries.getSingleHeatmap(experiment, index, method, value, imgSize);
    Promise.resolve(filterHeatmap).then(results => {
      setHeatmap('data:image/png;base64,' + results.image)
    })
  }
  const getFilterActivation = (value) => {
    changeFilterIndex(value);
    const filterActivation = queueries.getSingleActivation(experiment, index, method, value, layer[0], imgSize);
    Promise.resolve(filterActivation).then(results => {
      setHeatmap('data:image/png;base64,' + results.image)
    })
  }

  //hook to update bool isCnn according to user's selection
  React.useEffect(() => {
    if (cnnLayers && experiment && synthLayer) {
      setCnn(cnnLayers[experiment]['l1']);
      const isSynth = synthLayer[experiment];
      setSynth(isSynth);
    }
  }, [cnnLayers, synthLayer, experiment, setCnn]);


  //calback functions, called from child components
  const addSamples = value => {
    changeFilterIndex(value);
    console.log(samplesAmount)
    changeSamplesAmount(samplesAmount + 2)
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
    //setSingleLayer(experimentLayers[value][0])
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
  const isSynthCallback = value => {
    console.log(value);
    setSynths(value);
  };


  //dependencies, updating query params

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (maxIndices) {

      setMaxIndex(maxIndices[experiment]);
    }
    if (experiment && layer && values.experiment && values.selectedLayer && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, experiment: experiment, selectedLayer: 'l1' };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [experiment]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    console.log(values)
    if (method && values.method && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, method: method };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [method]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    console.log(values)
    if (index && values.index && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, index: index };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [index]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    console.log(values)
    if (order && values.order && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, order: order };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [order]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    console.log(values)
    if (viewType && values.view && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, view: viewType };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [viewType]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    console.log(values)
    if (isWatershed && values.watershed && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, watershed: isWatershed };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [isWatershed]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    console.log(values)
    if (singleLayer && values.selectedLayer && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, selectedLayer: singleLayer };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [singleLayer]);

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
          maxIndex={maxIndex}
          parentToggleCallback={setWatershed}
        />
      </Grid>
      <Grid item xl={10} lg={9} md={8} xs={8}>
        <FilterComponent
          filterAmount={filterAmount}
          parentCallback={viewState}
          filterActivationCallback={getFilterActivation}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={viewType}
          selectedLayer={layer[0]}
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
          maxIndex={maxIndex}
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
          filterActivationCallback={getFilterActivation}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={viewType}
          selectedLayer={layer[0]}
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
      </Grid>
    </Grid>
  );


  const defaultGrid = (
    <div className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expansionContainer : classes.defaultContainer}>
      <div className={classes.default}>
        <ImagesComponent
          maxIndex={maxIndex}
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
        <FilterComponent
          filterAmount={filterAmount}
          parentCallback={viewState}
          filterActivationCallback={getFilterActivation}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={viewType}
          selectedLayer={layer[0]}
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
          filterSamplesCallback={addSamples}
        />

      </div>

      <div className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expandedStatistics : classes.hiddenStatistics}>
        {viewType === 'STATISTICSVIEW' ?
          < StatisticsComponent
            viewState={viewType}
            viewCallback={viewState}
            statistics={statisticsData}
            filterIndex={filterIndex} /> : viewType === 'GRAPHVIEW' ?
            <NetworkComponent
              viewState={viewType}
              viewCallback={viewState}
              graph={graphData}
              filterIndex={filterIndex} /> : null
        }
      </div>




    </div >
  );



  return (
    <div >

      {(function () {
        switch (viewType) {
          case 'DASHBOARDVIEW' || 'STATISTICSVIEW' || 'GRAPHVIEW':
            return defaultGrid;
          case 'LOADINGVIEW':
            return loadingGrid;
          case 'ERRORVIEW':
            return errorGrid;
          default:
            return defaultGrid;
        }
      })()}

    </div>
  );
};

export default XAIBoard;
