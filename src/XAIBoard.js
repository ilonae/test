import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core';

import { Grid, CircularProgress, Typography } from '@material-ui/core';

import FilterComponent from './components/FilterComponent';
import SidebarComponent from './components/SidebarComponent';
import NetworkComponent from './components/NetworkComponent';
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
  const [classIndex, changeClassIndex] = React.useState(0);
  const [filterIndex, changeFilterIndex] = React.useState(0);
  const [queryActivations, setActivations] = React.useState(0);
  const [querySynths, setSynths] = React.useState(0);
  const [currentAnalysis, setCurrentAnalysis] = React.useState('max_activation');
  const [currentTabName, setCurrentTabName] = React.useState('');
  const [maxIndices, setMaxIndices] = React.useState();
  const [maxIndex, setMaxIndex] = React.useState(49999);

  const [experimentLayers, setExperimentsLayers] = React.useState();
  const [experiments, setExperiments] = React.useState();
  const [experiment, changeExperiment] = React.useState('');

  const [methods, setMethods] = React.useState();
  const [method, changeMethod] = React.useState('');

  const [heatmapClasses, changeHeatmapClasses] = React.useState([]);

  const [heatmapConfidences, changeHeatmapConfidences] = React.useState([]);
  const [layer, changeLayer] = React.useState([]);
  const [singleLayer, setSingleLayer] = React.useState('');

  const [classIndices, setClassIndices] = React.useState([]);
  const [currentClassIndices, changeCurrentClassIndices] = React.useState([]);

  const [layerModes, setLayerModes] = React.useState([]);
  const [currentLayerModes, changeCurrentLayerModes] = React.useState({});

  const [cnnLayers, setCnnLayers] = React.useState();


  const [masks, setMasks] = React.useState();
  const [mask, setMask] = React.useState(0);

  //Analysis possibilities
  const [synthLayer, setSynthLayers] = React.useState();
  const [isSynth, setSynth] = React.useState(0);
  const [isCnn, setCnn] = React.useState(0);
  const [isMaxActivation, setMaxActivation] = React.useState(0);
  const [isMaxRelevanceTarget, setMaxRelevanceTarget] = React.useState(0);
  const [hasRelevanceStats, changeRelevanceStats] = React.useState(0);
  const [hasActivationStats, changeActivationStats] = React.useState(0);

  const [image, setImage] = React.useState('');
  const [heatmap, setHeatmap] = React.useState('');
  const [target, setTarget] = React.useState('');

  const [filterData, setFilterData] = React.useState();
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
        console.log(data.layerModes)
        setLayerModes(data.layerModes);
        changeCurrentLayerModes(data.layerModes[data.experiments[0]][data.layers[data.experiments[0]][0]]);
        setClassIndices(data.classIndices);
        changeCurrentClassIndices(data.classIndices[data.experiments[0]]);
        setMaxIndices(data.maxIndices);
        setMaxIndex(data.maxIndices[0]);
        setExperimentsLayers(data.layers);
        setExperiments(data.experiments);
        changeExperiment(data.experiments[0]);
        setMethods(data.methods);
        changeMethod(data.methods[0])
        changeLayer(data.layers[data.experiments[0]]);
        setSingleLayer(data.layers[data.experiments[0]][0]);
        //setCnnLayers(data.cnnLayers);
        //setCnn(Object.values(data.cnnLayers[data.experiments[0]])[0]);
        //setSynthLayers(data.synthetics);
        //setSynth(Object.values(data.synthetics[data.experiments[0]]));
        if (Object.keys(values).length == 0) {
          history.push(`/dashboard?experiment=${data.experiments[0]}&method=${data.methods[0]}&index=${index}&order=${order}&view=${viewType}&selectedLayer=${data.layers[data.experiments[0]][0]}`);
        }
      });

      setImgSize(Math.round(helper.defineImgs()));
    };
    if (Object.keys(values).length == 0) {
      fetchSettings();
    }
  }, []);


  /*  //loading results from query params
   React.useEffect(() => {
     let values = queryString.parse(window.location.search)
     setPrevParams(values);
     const fetchSettings = async (experiment, layer, method) => {
       await queueries.getSettings().then(data => {
 
 
         changeCurrentLayerModes(data.layerModes[experiment]);
         changeCurrentClassIndices(data.classIndices[experiment]);
         console.log(data.classIndices[experiment])
         setMaxIndex(data.maxIndices[experiment]);
         changeExperiment(experiment);
         changeMethod(method);
 
 
         setSingleLayer(layer);
         setLayerModes(data.layerModes);
         setClassIndices(data.classIndices);
         setMaxIndices(data.maxIndices);
         setExperimentsLayers(data.layers);
         setExperiments(data.experiments);
         setMethods(data.methods);
         const index = data.layers[experiment].indexOf(layer);
         changeLayer(data.layers[experiment]);
         //setCnnLayers(data.cnnLayers);
         //setCnn(Object.values(data.cnnLayers[experiment])[index]);
         //setSynthLayers(data.synthetics);
         //setSynth(Object.values(data.synthetics[experiment]));
       });
     };
     if (Object.keys(values).length !== 0 && values.experiment && values.selectedLayer && prevParams !== values && isChangedFromState === false) {
       fetchSettings(values.experiment, values.selectedLayer, values.method);
       console.log('fetching from url');
       changeIndex(values.index);
       setOrder(values.order);
       changeViewType(values.view);
 
       setImgSize(Math.round(helper.defineImgs()));
       if (values.filterIndex) {
         changeFilterIndex(Number(values.filterIndex))
       }
       if (maxIndices) {
         setMaxIndex(maxIndices[values.experiment]);
       }
     }
     else if (Object.keys(values).length !== 0 && isChangedFromState === true) {
       console.log('reached ehre!')
       changeFromState(false)
     }
   }, [window.location.search]); */


  //changing analysis params according to current layer
  React.useEffect(() => {
    if (Object.keys(currentLayerModes).length !== 0) {
      setSynth(currentLayerModes.synthetic);
      setMaxActivation(currentLayerModes.max_activation)
      setMaxRelevanceTarget(currentLayerModes.max_relevance_target)
      setCnn(currentLayerModes.cnn_activation)
      changeRelevanceStats(currentLayerModes.relevance_stats)
      changeActivationStats(currentLayerModes.activation_stats)
    }
  }, [currentLayerModes]);


  React.useEffect(() => {
    const fetchTarget = async () => {
      if (viewType === 'DASHBOARDVIEW') {
        setPrevView(viewType);
        //changeViewType('LOADINGVIEW');
        changeModus(0);
        setActivations(0);
        const image = queueries.getImg(index, experiment, imgSize);
        const data = await Promise.resolve(image);
        changeViewType(prevView);
        if (data) {
          setTarget(data.target);
          setImage(data.img);
          changeViewType(prevView);
        }
      }
    };
    if (
      experiment &&
      imgSize != 28 &&
      modus === 0
    ) {
      changeCurrentClassIndices(classIndices[experiment])
      fetchTarget();
    }
  }, [index, experiment, imgSize]);


  //hook listening on changes of layer, experiment, method, index and filter amount, will equally update filter in dashboard
  React.useEffect(() => {
    const fetchActivations = async () => {
      setPrevView(viewType)
      //changeViewType('LOADINGVIEW')
      setTimeout(() => {
        changeViewType(prevView);
      }, 5000);

      let filter = queueries.getFilter(
        samplesAmount,
        singleLayer,
        target,
        filterAmount,
        order,
        experiment,
        index,
        method, 200, currentAnalysis
      );


      const data = await Promise.resolve(filter);
      console.log('filter set')
      changeViewType(prevView);
      if (data) {
        console.log(data)
        setFilterData(data);


      }
    }
    if (experiment && method && target) {
      changeCurrentLayerModes(layerModes[experiment][singleLayer])
      fetchActivations()
    }
  }, [order, filterAmount, samplesAmount, singleLayer]);


  React.useEffect(() => {
    const fetchSegments = async () => {
      await queueries.getLocalSegments(index, experiment, imgSize, method, target).then(data => {
        console.log(data)
      });
    };
    if (target) {
      fetchSegments()
    };

  }, [target]);


  //hook listening for changes in method, experiment and image index, updating image, heatmap and filters accordingly
  React.useEffect(() => {
    const fetchImages = async (layer) => {


      setPrevView(viewType);
      //changeViewType('LOADINGVIEW');
      changeModus(0);
      setActivations(0);
      const heatmapQuery = queueries.getHeatmap(index, experiment, method, imgSize, target);
      let filterImageSize = helper.defineFilterImageSize(filterAmount);
      if (!filterImageSize) {
        filterImageSize = 200;
      }
      setFilterImgSize(filterImageSize)
      setFilterActivationsSize(filterImageSize * 3)
      const contents = [heatmapQuery];

      const filters = queueries.getFilter(
        samplesAmount,
        singleLayer,
        target,
        filterAmount,
        order,
        experiment,
        index,
        method,
        filterImageSize,
        currentAnalysis

      );
      contents.push(filters);
      const data = await Promise.all(contents);
      changeViewType(prevView);
      if (data) {
        setHeatmap(data[0].heatmap);
        changeHeatmapClasses(data[0].classes);
        changeHeatmapConfidences(data[0].confidences);

        //console.log(data);
        setFilterData(data[1]);
      }

    };
    if (
      experiment &&
      imgSize != 28 &&
      target &&
      method &&
      order &&
      filterAmount &&
      modus === 0
    ) {
      fetchImages(layer);
    }
  }, [method, target, imgSize]);


  //local selection crop function, visualizing and updating relevances for parts of the image/heatmap
  const localAnalysis = async (x, y, width, height, maskId = -1) => {
    const normedValues = helper.normLocalSelection(x, y, width, height, imgSize);
    const filters = queueries.getLocalAnalysis(
      normedValues.newX,
      normedValues.newY,
      target,
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
      //changeViewType('LOADINGVIEW');

      const filters = queueries.getAttributionGraph(
        index,
        experiment,
        target,
        method,
        filterImgSize,
        singleLayer,
        filterIndex,
        currentLayerModes
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
      //changeViewType('LOADINGVIEW');
      let statisticsMode;
      if (hasActivationStats === 1) {

        statisticsMode = 'activation_stats'
      }
      else { statisticsMode = "relevance_stats" }
      let filters;
      if (viewType === 'STATISTICSVIEW') {
        const filters = queueries.getStatistics(
          index, experiment, singleLayer, filterIndex, order, statisticsMode
        );
        const data = await Promise.resolve(filters);
        if (Object.keys(data).length === 0) {
          console.log('error')

        }
        else {
          changeViewType("STATISTICSVIEW");
          setStatisticsData(data);
          console.log(data)
        }
      }
      else if (viewType === 'GRAPHVIEW') {
        const filters = queueries.getStatistics(
          index, experiment, singleLayer, filterIndex, order, statisticsMode
        );
        const data = await Promise.resolve(filters);
        if (Object.keys(data).length === 0) {
          console.log('error')

        }
        else {
          changeViewType("STATISTICSVIEW");
          setStatisticsData(data);
          console.log(data)
        }
      }

    };

  }, [filterIndex, singleLayer, viewType]);

  //hook to visualize activations of filter
  React.useEffect(() => {

    setFilterImgSize(filterActivationsSize * 3)
    const fetchActivations = async () => {
      //changeViewType('LOADINGVIEW');
      console.log(singleLayer)
      const filter = queueries.getFilter(
        samplesAmount,
        singleLayer,
        filterAmount,
        order,
        experiment,
        index,
        method,
        filterActivationsSize,
        queryActivations
      );


      const data = await Promise.resolve(filter);

      changeViewType(prevView);
      if (data) {
        console.log(data)
        setFilterData(data);
      }
    };

    const fetchSynths = async () => {
      const filter = queueries.getFilter(
        samplesAmount,
        singleLayer,
        target,
        filterAmount,
        order,
        experiment,
        index,
        method,
        filterActivationsSize,
        undefined,
        querySynths
      );

      const data = await Promise.resolve(filter);

      changeViewType(prevView);
      if (data) {
        setFilterData(data);
      }
    }

    if (queryActivations === 1) {
      fetchActivations(layer);
    } else if (querySynths === 1) {
      fetchSynths();
    }
  }, [queryActivations, querySynths, filterAmount, method, order, filterImgSize]);


  //visualizing heatmap according to selected filter
  const getFilterHeatmap = (value) => {
    changeFilterIndex(value);
    const filterHeatmap = queueries.getSingleHeatmap(experiment, index, target, method, value, singleLayer, imgSize);
    Promise.resolve(filterHeatmap).then(results => {
      setHeatmap('data:image/png;base64,' + results.image)
    })
  }
  const getFilterActivation = (value) => {
    changeFilterIndex(value);
    const filterActivation = queueries.getSingleActivation(experiment, index, target, method, value, singleLayer, imgSize);
    Promise.resolve(filterActivation).then(results => {
      setHeatmap('data:image/png;base64,' + results.image)
    })
  }


  //calback functions, called from child components
  const addSamples = value => {
    changeFilterIndex(Number(value));
    changeSamplesAmount(samplesAmount + 2)
  }

  const inspectFilter = async (value, view, currentTab) => {
    changeFilterIndex(Number(value));
    changeViewType(view);
    setCurrentTabName(currentTab);

    let statisticsMode
    if (currentTab === 'activation') {

      statisticsMode = 'activation_stats'
    }
    else { statisticsMode = "relevance_stats" }

    if (view === 'STATISTICSVIEW') {
      const filters = queueries.getStatistics(
        index, experiment, singleLayer, filterIndex, order, statisticsMode
      );
      const data = await Promise.resolve(filters);
      console.log(data)
      if (Object.keys(data).length === 0) {
        console.log('error')

      }
      else {
        setStatisticsData(data);
        console.log(data)
      }
    }
    else if (view === 'GRAPHVIEW') {
      const filters = queueries.getAttributionGraph(
        index,
        experiment,
        target,
        method,
        filterImgSize,
        singleLayer,
        filterIndex,
        currentAnalysis
      );
      const data = await Promise.resolve(filters);
      if (Object.keys(data).length === 0) {
        console.log('filter set')
      }
      else {
        setGraphData(data);
      }
    }
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
  const classIndexState = value => {
    console.log(value)
    changeClassIndex(value);
  };
  const selectedExperiment = value => {
    changeExperiment(value);
    changeLayer(experimentLayers[value])
    setSingleLayer(experimentLayers[value][0])
  };

  const checkAnalysisCallback = async value => {
    setCurrentAnalysis(value)

    const filter = queueries.getFilter(
      samplesAmount,
      singleLayer,
      target,
      filterAmount,
      order,
      experiment,
      index,
      method,
      filterActivationsSize,
      value
    );

    const data = await Promise.resolve(filter);
    if (data) {
      setFilterData(data);
    }

  }
  const selectedMethod = value => {
    if (value) {
      changeMethod(value);
    }
  };
  const selectedFilterName = value => {
    if (value) {
      queueries.setFilterName(experiment, singleLayer, index, value)
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
    if (method && values.method && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, method: method };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [method]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (index && values.index && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, index: index };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [index]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (order && values.order && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, order: order };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [order]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (viewType && values.view && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, view: viewType };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [viewType]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (isWatershed && values.watershed && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, watershed: isWatershed };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [isWatershed]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (singleLayer && values.selectedLayer && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, selectedLayer: singleLayer };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [singleLayer]);


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
        <SidebarComponent
          target={target}
          maxIndex={maxIndex}
          expansionCallback={viewState}
          indexCallback={indexState}
          image={image}
          heatmap={heatmap}
          parentLACallback={localAnalysis}
          index={index}
          targetCallback={newTarget => setTarget(newTarget)}
        />
      </Grid>
      <Grid item xl={10} lg={9} md={8} xs={8}>
        <FilterComponent
          target={target}
          filterAmount={filterAmount}
          viewTypeCallback={viewState}
          filterActivationCallback={getFilterActivation}
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
          filterInspectionCallback={values => console.log(values)}

          isSynth={isSynth}
          isCnn={isCnn}
          isMaxActivation={isMaxActivation}
          isMaxRelevanceTarget={isMaxRelevanceTarget}
          hasRelevanceStats={hasRelevanceStats}
          hasActivationStats={hasActivationStats}
        />
      </Grid>
    </Grid>
  );


  const defaultGrid = (
    <div id='expansioncontainer' className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expansionContainer : classes.defaultContainer}>
      <div className={classes.default}>
        <Grid item xl={2} lg={3} md={4} xs={4}>
          <SidebarComponent
            target={target}
            maxIndex={maxIndex}
            expansionCallback={viewState}
            indexCallback={indexState}
            classIndexCallback={classIndexState}
            image={image}
            heatmap={heatmap}
            parentLACallback={localAnalysis}
            index={index}
            classIndices={currentClassIndices}
            heatmapClasses={heatmapClasses}
            heatmapConfidences={heatmapConfidences}
            targetCallback={newTarget => setTarget(newTarget)}
          />
        </Grid>

        <FilterComponent
          target={target}
          filterAmount={filterAmount}
          viewTypeCallback={viewState}
          filterActivationCallback={getFilterActivation}
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
          filterInspectionCallback={inspectFilter}
          filterSamplesCallback={addSamples}
          nameCallback={selectedFilterName}
          isSynth={isSynth}
          isCnn={isCnn}
          isMaxActivation={isMaxActivation}
          isMaxRelevanceTarget={isMaxRelevanceTarget}
          hasRelevanceStats={hasRelevanceStats}
          hasActivationStats={hasActivationStats}
          analysisCallback={checkAnalysisCallback}
        />

      </div>

      <div className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expandedStatistics : classes.hiddenStatistics}>
        {viewType === 'STATISTICSVIEW' ?
          < StatisticsComponent
            viewState={viewType}
            viewCallback={viewState}
            statistics={statisticsData}
            statisticName={currentTabName}
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
          //case 'LOADINGVIEW':
          //  return loadingGrid;
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
