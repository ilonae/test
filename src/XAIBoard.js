import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core';

import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { ArrowAnchorPlacement, ArrowSvg, ArrowsBetweenDivsContextProvider, ArrowBetweenDivs, LineOrientation } from 'react-simple-arrows';


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

const XAIBoard = ({ socket }) => {
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

  const [filterIndices, setFilterIndices] = React.useState([]);
  const [filterRelevances, setFilterRelevances] = React.useState([]);
  const [classIndices, setClassIndices] = React.useState([]);
  const [currentClassIndices, changeCurrentClassIndices] = React.useState([]);

  const [layerModes, setLayerModes] = React.useState([]);
  const [currentLayerModes, changeCurrentLayerModes] = React.useState({});

  const [cnnLayers, setCnnLayers] = React.useState();
  const [arrows, setArrows] = React.useState();


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

  const [flag, setFlag] = React.useState(true);
  const [comparing, changeComparing] = React.useState(false);



  const history = useHistory();
  let convertedImgs = {};
  let stats = {};
  let cNames = [];
  let cRel = [];
  let cImg = [];
  var xaiflag = true;



  React.useEffect(() => {
    if (socket) {
      let arrowArr = []
      let currArrow;
      let filters = document.getElementsByClassName('filters');
      for (let i = 0; i < filters.length; i++) {
        var position = filters[i].getBoundingClientRect();
        var x = position.left;
        var y = position.top;
        console.log(x, y)
        currArrow = <ArrowSvg start={{ x: x, y: y }} end={{ x: 100, y: 600 }} orientation={LineOrientation.HORIZONTAL} />
        arrowArr.push(currArrow)

      }
      setArrows(arrowArr)

      socket.on('receive_partial_heatmap', (dict, data) => {
        const fData = { ...filterData };
        for (let item in dict) {
          console.log(item)
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          fData.position[item] = data.pos_filter[item]
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
            fData.images[item] = window.btoa(binary)
          }
        }
        setFilterData(fData);
      });
      socket.on('receive_data', (data) => {
        changeIndex(data.image_index);
        setTarget(data.ground_truth);
        var arrayBufferView = new Uint8Array(data['image']);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        setImage(img_url);
      });
      socket.on('receive_heatmap', (data) => {
        var arrayBufferView = new Uint8Array(data['image']);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        changeHeatmapClasses(data.pred_classes);
        changeHeatmapConfidences(data.pred_confidences);
        setHeatmap(img_url);
      });
      socket.on('receive_XAI_available', (data) => {
        setExperiments(data.experiments);
        changeExperiment(data.experiments[0]);
        setMethods(data.methods);
        changeMethod(data.methods[0])
        setExperimentsLayers(data.layers);
        changeLayer(data.layers[data.experiments[0]]);
        setSingleLayer(data.layers[data.experiments[0]][0]);
        setLayerModes(data.layer_modes);
        changeCurrentLayerModes(data.layer_modes[data.experiments[0]][data.layers[data.experiments[0]][0]]);
        setClassIndices(data.class_to_indices);
        changeCurrentClassIndices(data.class_to_indices[data.experiments[0]]);
        setMaxIndices(data.max_index);
        setMaxIndex(data.max_index[0]);
      })
      socket.on('receive_attribution_graph', (graph) => {
        console.log(graph)
      });

      let filterData = {};

      socket.on('receive_global_analysis', (globaldata) => {
        convertedImgs = {};
        filterData = globaldata;
        setFilterIndices(globaldata.filter_indices)
        setFilterRelevances(globaldata.relevance)
      });
      socket.on('receive_realistic', (dict, data) => {
        let imgArr = []
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr.push(window.btoa(binary));
        }
        convertedImgs[data.filter_index] = imgArr;
        if (Object.keys(convertedImgs).map(Number).sort().join(',') === filterData.filter_indices.sort().join(',')) {

          if (!comparing) {
            filterData.images = convertedImgs;
            filterData.position = []
            setFilterData(filterData)
          }
        }
      });

      socket.on('receive_example_heatmaps', (dict, data) => {
        let index = data.filter_index;
        let imgArr = []
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr.push(window.btoa(binary));
        }
        console.log(filterData.images[index])
        const fData = { ...filterData };
        fData.images[index] = imgArr
        fData.position = [];
        setFilterData(fData);
      })

      socket.on('receive_synthetic', (dict, data) => {
        console.log("synth")
        let imgArr = []
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr.push(window.btoa(binary));
        }
        convertedImgs[data.filter_index] = imgArr;
        if (Object.keys(convertedImgs).map(Number).sort().join(',') === filterData.filter_indices.sort().join(',')) {
          filterData.images = convertedImgs;
          filterData.position = [];
          setFilterData(filterData)
        }
      });

      socket.on('receive_statistics', (dict, data) => {
        stats = data;
        let imgArr = []
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr.push(window.btoa(binary));
        }
        stats.image = imgArr;
        while (cRel.length !== 4) {
          cNames.push(data.class_name);
          cRel.push(data.class_rel);
          cImg.push(imgArr)
        }
        stats.class_name = cNames;
        stats.class_rel = cRel;
        stats.image = cImg;
        setStatisticsData(stats)
        cNames = [];
        cRel = [];
        cImg = [];
        stats = {}

        const flavoursContainer = document.getElementById('root');
        console.log(flavoursContainer);
        const flavoursScrollWidth = flavoursContainer.scrollWidth;


        if (flavoursContainer.scrollLeft !== flavoursScrollWidth) {

          document.getElementById('root').scrollTo({
            left: flavoursScrollWidth,
            behavior: 'smooth',
          })
        }


      });

      socket.on('receive_example_heatmaps', (dict, data) => {

        let imgArr = []
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr.push(window.btoa(binary));
        }
        let currFilterData = { ...filterData };
        currFilterData.images[data.filterIndex] = imgArr;
        currFilterData.position = []
        setFilterData(currFilterData)
      })
      socket.on('disconnect', () => {
        socket.removeAllListeners();
      });
    }
  }, [socket, comparing]);

  /*   React.useEffect(() => {
      if (socket && filterIndices) {
        console.log(filterIndices);
        socket.emit("vis_realistic", {
          "layer": singleLayer,
          "experiment": experiment,
          "list_filter": filterIndices,
          "size": filterImgSize + 100,
          "sample_indices": "0:9",
          "mode": 'max_activation'
        })
      }
    }, [filterIndices]) */

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    let filterImageSize = helper.defineFilterImageSize(filterAmount);
    if (!filterImageSize) {
      filterImageSize = 200;
    }
    setFilterImgSize(filterImageSize)
    setImgSize(Math.round(helper.defineImgs()));
    if (Object.keys(values).length == 0 && xaiflag && socket) {
      socket.emit('get_XAI_available');
      xaiflag = false;
    }
  }, [socket]);

  React.useEffect(() => {
    if (flag === true && layerModes[experiment] && socket && imgSize && singleLayer && experiment && method && filterIndices) {

      console.log(layerModes)
      changeCurrentLayerModes(layerModes[experiment][singleLayer])
      socket.emit('get_data', {
        'image_index': index,
        "experiment": experiment,
        "size": imgSize
      });
      socket.emit("get_heatmap", {
        'image_index': index,
        "experiment": experiment,
        "method": method,
        "N_pred": 0,
        "size": imgSize
      })
      socket.emit('get_global_analysis',
        {
          "layer": singleLayer,
          "experiment": experiment,
          "filter_indices": "0:5",
          "sorting": order,
          "image_index": 0,
          "method": method

        },
        currentAnalysis,
        {
          "size": filterImgSize + 100,
          "sample_indices": "0:9"
        });
      /*       socket.emit("vis_realistic", {
              "layer": singleLayer,
              "experiment": experiment,
              "list_filter": filterIndices,
              "size": filterImgSize + 100,
              "sample_indices": "0:9",
              "mode": 'max_activation'
            }) */
      setFlag(false)
    }
  }, [imgSize, experiment, layerModes, method])

  //React.useEffect(() => () => socket.disconnect(), []);
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
    if (socket && method && experiment && imgSize && singleLayer && currentLayerModes) {
      socket.emit("get_heatmap", {
        'image_index': index,
        "experiment": experiment,
        "method": method,
        "N_pred": 0,
        "size": imgSize
      })
      socket.emit('get_global_analysis',
        {
          "layer": singleLayer,
          "experiment": experiment,
          "filter_indices": "0:5",
          "sorting": order,
          "image_index": index,
          "method": method
        },
        currentAnalysis,
        {
          "size": filterImgSize + 100,
          "sample_indices": "0:9"
        });
    }
  }, [method, order]);


  React.useEffect(() => {
    if (target) {
      socket.emit("get_heatmap", {
        'image_index': index,
        "experiment": experiment,
        "method": method,
        "N_pred": 0,
        "size": imgSize,
        "target_class": target
      })
      socket.emit('get_global_analysis',
        {
          "layer": singleLayer,
          "experiment": experiment,
          "filter_indices": "0:5",
          "sorting": order,
          "image_index": index,
          "method": method,
          "target_class": target
        },
        currentAnalysis,
        {
          "size": filterImgSize + 100,
          "sample_indices": "0:9"
        });
    }
  }, [target])
  React.useEffect(() => {
    if (
      experiment &&
      imgSize !== 28 &&
      modus === 0 && layerModes[experiment]) {
      console.log(layerModes)
      changeCurrentLayerModes(layerModes[experiment][singleLayer])
      //changeCurrentClassIndices(classIndices[experiment])
      socket.emit('get_data', {
        'image_index': index,
        "experiment": experiment,
        "size": imgSize
      });
      socket.emit("get_heatmap", {
        'image_index': index,
        "experiment": experiment,
        "method": method,
        "N_pred": 0,
        "size": imgSize
      })
      socket.emit('get_global_analysis',
        {
          "layer": singleLayer,
          "experiment": experiment,
          "filter_indices": "0:5",
          "sorting": order,
          "image_index": index,
          "method": method

        },
        currentAnalysis,
        {
          "size": filterImgSize + 100,
          "sample_indices": "0:9"
        });

    }
  }, [index, experiment, singleLayer, layerModes]);

  React.useEffect(() => {
    if (socket && order) {
      if (currentAnalysis === "synthetic") {
        socket.emit("vis_synthetic", {
          "layer": singleLayer,
          "experiment": experiment,
          "list_filter": filterIndices,
          "size": filterImgSize + 100,
        })
      } else {
        console.log("vis")
        socket.emit("vis_realistic", {
          "layer": singleLayer,
          "experiment": experiment,
          "list_filter": filterIndices,
          "size": filterImgSize + 100,
          "sample_indices": "0:9",
          "mode": currentAnalysis
        })
      }
    }
  }, [currentAnalysis])


  //hook listening on changes of layer, experiment, method, index and filter amount, will equally update filter in dashboard
  /*  React.useEffect(() => {
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
   }, [order, filterAmount, samplesAmount]);
   
   
   React.useEffect(() => {
     const fetchSegments = async () => {
       /*    await queueries.getLocalSegments(index, experiment, imgSize, method, target).then(data => {
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
       imgSize != 28 &&
       target &&
       method &&
       order &&
       filterAmount &&
       modus === 0
     ) {
       //
     }
   }, [method, target, imgSize]);
   
  */
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
  /* React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    const newQueries = { ...values, filterIndex: filterIndex };
    //history.push({ search: queryString.stringify(newQueries) });
  
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
  */

  //visualizing heatmap according to selected filter
  const getFilterHeatmap = (value) => {
    changeFilterIndex(value);
    socket.emit('vis_partial_heatmap', {
      "layer": singleLayer,
      "experiment": experiment,
      "list_filter": filterIndices,
      "image_index": index,
      "method": method,
      "size": filterImgSize + 100,
      "weight_activation": 0,
      "target_class": target
    }
    );
    /*     const filterHeatmap = queueries.getSingleHeatmap(experiment, index, target, method, value, singleLayer, imgSize);
        Promise.resolve(filterHeatmap).then(results => {
          setHeatmap('data:image/png;base64,' + results.image)
        }) */
  }
  const getFilterActivation = (value) => {
    changeFilterIndex(value);

    socket.emit('vis_realistic_heatmaps', {
      "layer": singleLayer,
      "experiment": experiment,
      "filter_index": value,
      "size": imgSize,
      "sample_indices": "0:9",
      "mode": currentAnalysis,
      "method": method,
      "target_class": target
    }
    );

    /*   const filterActivation = queueries.getSingleActivation(experiment, index, target, method, value, singleLayer, imgSize);
      Promise.resolve(filterActivation).then(results => {
        setHeatmap('data:image/png;base64,' + results.image)
      }) */
  }


  //calback functions, called from child components
  const addSamples = value => {
    changeFilterIndex(Number(value));
    changeSamplesAmount(samplesAmount + 9)
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
      socket.emit("vis_statistics", {
        "layer": singleLayer,
        "experiment": experiment,
        "filter_index": filterIndex,
        "sample_indices": "0:9",
        "size": imgSize,
        "stats_mode": statisticsMode,
        "n_classes": 4
      })

      /*    const filters = queueries.getStatistics(
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
         } */
    }
    else if (view === 'GRAPHVIEW') {

      socket.emit("get_attribution_graph",
        {
          "layer": singleLayer,
          "experiment": experiment,
          "image_index": index,
          "method": method,
          "size": -1,
          "view_prev": 1,
          "mode": currentAnalysis,
          "filter_index": filterIndex,
          //target_class in cookie for test only
        }
        , currentAnalysis, {
        "size": -1,
        "sample_indices": "0:8",
      }
      )
      /*  const filters = queueries.getAttributionGraph(
         index,
         experiment,
         target,
         method,
         filterImgSize,
         singleLayer,
         Number(value),
         currentAnalysis
       );
       const data = await Promise.resolve(filters);
       if (Object.keys(data).length === 0) {
         console.log('filter set')
       }
       else {
         setGraphData(data);
       } */
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
    /*     socket.emit("vis_realistic", {
          "layer": singleLayer,
          "experiment": experiment,
          "list_filter": filterIndices,
          "size": 120,
          "sample_indices": "0:9",
          "mode": value
        }) */
  }

  const compareCallback = async value => {
    changeComparing(false);
    console.log("com")
    socket.emit('get_global_analysis',
      {
        "layer": singleLayer,
        "experiment": experiment,
        "filter_indices": "0:5",
        "sorting": order,
        "image_index": index,
        "method": method
      },
      "max_activation",
      {
        "size": filterImgSize + 100,
        "sample_indices": "0:9"
      });
    socket.emit('get_global_analysis',
      {
        "layer": singleLayer,
        "experiment": experiment,
        "filter_indices": "0:5",
        "sorting": order,
        "image_index": index,
        "method": method
      },
      "max_relevance_target",
      {
        "size": filterImgSize + 100,
        "sample_indices": "0:9"
      });

  }
  /* 
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
      ); */

  /*    const data = await Promise.resolve(filter); */



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
  const queryTarget = async value => {
    console.log(value);
    /*     socket.emit('get_data', {
          'image_index': value,
          "experiment": experiment,
          "size": imgSize
        }); */
    /* const image = queueries.getImg(value, experiment, imgSize);
    const data = await Promise.resolve(image);
    if (data) {
      console.log(data.target)
      setTarget(data.target);
    } */
  }




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







  const defaultGrid = (
    <div id='expansioncontainer' className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expansionContainer : classes.defaultContainer}>
      {arrows}
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
            localAnalysisCallback={localAnalysis}
            index={index}
            classIndices={currentClassIndices}
            heatmapClasses={heatmapClasses}
            heatmapConfidences={heatmapConfidences}
            targetCallback={newTarget => setTarget(newTarget)}
            processTargetCallback={queryTarget}
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
          experimentsCallback={selectedExperiment}
          methodsCallback={selectedMethod}
          layerCallback={selectedLayer}
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
          compareCallback={compareCallback}
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
          default:
            return defaultGrid;
        }
      })()}

    </div>
  );
};

export default XAIBoard;
