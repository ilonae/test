import 'react-perfect-scrollbar/dist/css/styles.css';
import 'regenerator-runtime/runtime';
import React from 'react';
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { ArrowSvg, LineOrientation } from 'react-simple-arrows';

//import { CTX } from './index';

import { FilterComponent } from './components/FilterComponent';
import SidebarComponent from './components/SidebarComponent';
import NetworkComponent from './components/NetworkComponent';
import StatisticsComponent from './components/StatisticsComponent';
import queueries from './util/queries';
import helper from './util/helper';

const useStyles = makeStyles(() => ({
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
    display: 'flex', width: '98vw',
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

export interface IItem extends Record<string, any> {
  itemId: string;
  price: number;
}

export interface XAIBoardProps {
  socket: any
}

export const XAIBoard: React.FC<XAIBoardProps> = (props: XAIBoardProps) => {
  const classes = useStyles();

  const indicesFlag = React.useRef(true);
  const xaiFlag = React.useRef(true);


  const [viewType, changeViewType] = React.useState('DASHBOARDVIEW');
  const [filterAmount,] = React.useState(6);
  const [samplesAmount, changeSamplesAmount] = React.useState(9);

  const [imgSize, setImgSize] = React.useState(28);
  const [filterImgSize, setFilterImgSize] = React.useState(28);
  const [order, setOrder] = React.useState('max');

  const [filterIndex, changeFilterIndex] = React.useState(0);
  const [currentAnalysis, setCurrentAnalysis] = React.useState('max_activation');
  const [currentTabName, setCurrentTabName] = React.useState('');
  const [maxIndices, setMaxIndices]: any[] = React.useState([]);
  const [maxIndex, setMaxIndex] = React.useState(49999);

  const [experimentLayers, setExperimentsLayers]: any = React.useState({});
  const [experiments, setExperiments] = React.useState();
  const [experiment, changeExperiment] = React.useState('');

  const [methods, setMethods] = React.useState();
  const [method, changeMethod] = React.useState('');

  const [layer, changeLayer]: any[] = React.useState([]);
  const [singleLayer, setSingleLayer] = React.useState('');

  const [filterIndices, setFilterIndices] = React.useState([]);
  const [filterRelevances, setFilterRelevances]: any = React.useState({});
  const [, setFilterNames] = React.useState([]);

  const [classIndices, setClassIndices]: any[] = React.useState([]);
  const [currentClassIndices, changeCurrentClassIndices] = React.useState([]);

  const [layerModes, setLayerModes]: any = React.useState({});
  const [currentLayerModes, changeCurrentLayerModes] = React.useState({
    synthetic: 0,
    max_activation: 0,
    max_relevance_target: 0,
    cnn_activation: 0,
    relevance_stats: 0,
    activation_stats: 0
  });

  const [arrows, setArrows]: any[] = React.useState([]);

  //Analysis possibilities
  const [isSynth, setSynth] = React.useState(0);
  const [isCnn, setCnn] = React.useState(0);
  const [isMaxActivation, setMaxActivation] = React.useState(0);
  const [isMaxRelevanceTarget, setMaxRelevanceTarget] = React.useState(0);
  const [hasRelevanceStats, changeRelevanceStats] = React.useState(0);
  const [hasActivationStats, changeActivationStats] = React.useState(0);

  const [target, setTarget] = React.useState('');


  const [filterData, setFilterData]: any = React.useState({
    filter_indices: [],
    filter_names: {},
    filter_relevances: {},
    images: {},
    heatmaps: {},
    partial: {},
    synthetic: {},
    cnn_activations: {},
    position: {}
  });
  interface graphProps {
    images?: {
      [key: string]: any[]
    };
    nodes?: any[];
    links?: any[];
    properties?: {
      [key: string]:
      {
        layer: string,
        filter_index: number
      }
    }
  }

  const [graphData, setGraphData] = React.useState<graphProps>({
    nodes: [],
    properties: {},
    links: [],
    images: {}
  });



  const [statisticsData, setStatisticsData] = React.useState({
    images: {},
    classNames: {},
    classRelevances: {}
  });
  const [, setPrevView] = React.useState('');
  const [prevParams, setPrevParams] = React.useState({});


  const [currentlyUpdated, setCurrentyUpdated] = React.useState(false);
  const [comparing, changeComparing] = React.useState(false);
  const [comparingEmit, changeComparingEmit] = React.useState(true);

  const [comparingData, setComparingData]: any = React.useState({
    filter_indices: { 'max_activation': [], 'max_relevance_target': [] },
    filter_names: { 'max_activation': {}, 'max_relevance_target': {} },
    filter_relevances: { 'max_activation': {}, 'max_relevance_target': {} },
    images: { 'max_activation': {}, 'max_relevance_target': {} },
    heatmaps: { 'max_activation': {}, 'max_relevance_target': {} },
    partial: { 'max_activation': {}, 'max_relevance_target': {} },
    synthetic: { 'max_activation': {}, 'max_relevance_target': {} },
    position: { 'max_activation': {}, 'max_relevance_target': {} },
    modes: ['max_activation', 'max_relevance_target'],
    cnn_activations: { 'max_activation': {}, 'max_relevance_target': {} }
  });
  const [layerInfo, setLayerInfo]: any = React.useState({
    experimentUpdate: false,
    updateAfterAnalysis: false,
    glocalAnalysisUpdate: false,
    experiment: "",
    method: "",
    layer: [],
    index: 0,
    target: "",
    singleLayer: "",
    currentImage: '',
    currentHeatmap: "",
    currentHeatmapClasses: [],
    currentHeatmapConfidences: [],
    currentLayerModes: [],
    currentClassIndices: [],
    maxIndex: 0,
    filters: {
      filter_indices: [],
      filter_names: {},
      filter_relevances: {},
    },
    order: 'max',
    currentAnalysis: "max_activation"
  });
  const [filterDataUpdate, setFilterDataUpdate] = React.useState(false);
  const [targetUpdate, setTargetUpdate] = React.useState(false);

  const [isWatershed,] = React.useState(false);
  const [, changeFromState] = React.useState(false);

  const history = useHistory();

  const createImgs = (nr: number) => {
    let imgArr = [];
    for (let i = 0; i < nr; i++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = 200;
      canvas.width = 200;
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      dataURL = canvas.toDataURL();
      dataURL = dataURL.replace(/^data:image\/[a-z]+;base64,/, "");
      imgArr[i] = dataURL

    }
    return imgArr;
  }

  React.useEffect(() => {
    let currPosition: any;
    if (comparing) {
      const currData = { ...comparingData };
      currPosition = currData.position["max_activation"]
    }
    else {
      const currData = { ...filterData };
      currPosition = currData.position
    }

    const handleScroll = () => {
      setInterval(replace, 1000 / 60);
    }

    if (currPosition && !comparing && viewType !== "GRAPHVIEW") {
      let scroller = document.getElementById("scroll")
      scroller.addEventListener('scroll', handleScroll);
    }

    function replace() {
      let arrowArr: any = []
      let currArrow;
      let filters = document.getElementsByClassName('filters');
      let scrollField = document.getElementById("scroll")
      let scrollTop = scrollField.getBoundingClientRect().top;
      let scrollBottom = scrollTop + scrollField.getBoundingClientRect().height - 10
      let img = document.getElementsByClassName('img')[0];
      var imgPos = img.getBoundingClientRect();
      var imgX = imgPos.left;
      var imgY = imgPos.top;
      const imgWidth = imgPos.width;
      for (let i = 0; i < filters.length; i++) {
        var position = filters[i].getBoundingClientRect();
        var x = position.left;
        var y = position.top + (position.height / 2);
        //console.log(Object.values(currPosition)[i])
        let currPos: any = Object.values(currPosition)[i];
        currPos = currPos.replace(/[\[\]']+/g, '');
        currPos = currPos.split(",");
        if (currPos) {
          if (y < scrollTop) {
            y = scrollTop
          }
          else if (y > scrollBottom) {
            y = scrollBottom
          }
          currArrow = <ArrowSvg start={{ x: x, y: y }} end={{ x: imgX + (imgWidth * currPos[0]), y: imgY + (imgWidth * currPos[1]) }} key={i} orientation={LineOrientation.HORIZONTAL} />
          arrowArr.push(currArrow)
        }
      }
      setArrows(arrowArr)
    }
  }, [filterData, imgSize, viewType]);


  React.useEffect(() => {
    if (props.socket) {
      props.socket.on('receive_synthetic', (dict: any[], data: any[]) => {
        const currData = { ...filterData };
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          currData.synthetic[item] = window.btoa(binary)
        }

        setFilterData(currData);
        setFilterDataUpdate(true);
      });

      props.socket.on('receive_partial_heatmap', (dict: any, data: any) => {

        if (comparing) {
          const currData = { ...comparingData };
          let item: any;
          for (item in dict) {
            var binary = '';
            var bytes = new Uint8Array(dict[item]);
            var len = bytes.byteLength;
            Object.keys(currData.partial).forEach((k) => {
              for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              currData.partial[k][item] = window.btoa(binary)
              currData.position[k][item] = data.pos_filter[item]
            })
          }
        } else {
          const currData = { ...filterData };
          Object.getOwnPropertyNames(currData.position).forEach(function (prop) {
            delete currData.position[prop];
          })
          for (let item in dict) {
            var binary = '';
            var bytes = new Uint8Array(dict[item]);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);

            }
            currData.partial[item] = window.btoa(binary)
            currData.position[item] = data.pos_filter[item];
          }
          setFilterData(currData);
          setFilterDataUpdate(true);
        }
      });
      props.socket.once('receive_data', (data: any) => {

        var arrayBufferView = new Uint8Array(data['image']);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          currentImage: img_url,
          target: data.ground_truth[0]

        }));
        setTargetUpdate(true)
        /*  if (layerInfo.singleLayer && layerInfo.experiment && layerInfo.method) {
           props.socket.emit('get_global_analysis',
             {
               "layer": layerInfo.singleLayer,
               "experiment": layerInfo.experiment,
               "filter_indices": "0:5",
               "sorting": layerInfo.order,
               "image_index": data.image_index,
               "method": layerInfo.method,
               "zero_list_filter": [],
               "zero_layer": layerInfo.singleLayer,
               "target_class": data.ground_truth[0]
             },
             layerInfo.currentAnalysis,
             {
               "size": filterImgSize + 100,
               "sample_indices": "0:9"
             });
         } */

      });
      props.socket.once('receive_heatmap', (data: any) => {
        var arrayBufferView = new Uint8Array(data['image']);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          currentHeatmap: img_url,
          currentHeatmapClasses: data.pred_classes,
          currentHeatmapConfidences: data.pred_confidences

        }));
        /* changeHeatmapClasses(data.pred_classes);
        changeHeatmapConfidences(data.pred_confidences);
        setHeatmap(img_url); */
        //setArrows();
      });
      props.socket.once('receive_XAI_available', (data: any) => {

        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          layer: data.layers[data.experiments[0]],
          index: 0,
          method: data.methods[0],
          experiment: data.experiments[0],
          singleLayer: data.layers[data.experiments[0]][0],
          currentLayerModes: data.layer_modes[data.experiments[0]][data.layers[data.experiments[0]][0]],
          currentClassIndices: data.class_to_indices[data.experiments[0]],
          maxIndex: data.max_index[data.experiments[0]]

        }));

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
        setMaxIndex(data.max_index[data.experiments[0]]);
      })

      props.socket.on('receive_attribution_graph', (graph: any) => {
        if (graph !== "empty") {
          setGraphData((data: any) => ({
            ...data,
            nodes: graph.nodes,
            properties: graph.properties,
            links: graph.links
          }));
        }
      });

      props.socket.on('receive_realistic_graph', (images: any, info: any) => {
        const currImgs: any[] = [...(graphData.images[info.filter_index] || [])];

        for (let item in images) {
          var binary = '';
          var bytes = new Uint8Array(images[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          currImgs.push(window.btoa(binary))
          setGraphData((data: any) => ({
            ...data,
            images: {
              ...data.images,
              [info.filter_index]: currImgs
            }
          }));
        }

      });

      props.socket.once('receive_global_analysis', (globaldata: any) => {
        if (comparing) {
          const currData = { ...comparingData };
          const currMode = globaldata.mode;
          currData.filter_indices[currMode] = (globaldata.filter_indices)
          currData.filter_relevances[currMode] = (globaldata.relevance)
          setComparingData(currData);
        } else {

          setFilterData({
            filter_indices: [],
            filter_names: {},
            filter_relevances: {},
            images: {},
            heatmaps: {},
            partial: {},
            synthetic: {},
            cnn_activations: {},
            position: {}
          });

          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            experimentUpdate: false,
            glocalAnalysisUpdate: true,
            filters: {
              filter_indices: globaldata.filter_indices,
              filter_names: globaldata.filter_names,
              filter_relevances: globaldata.relevance
            }

          }));
        }
      });

      props.socket.on('receive_example_heatmaps', (dict: any, data: any) => {
        let index = data.filter_index;
        let mode = data.mode;
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
        if (comparing && mode) {
          const currData = { ...comparingData };
          currData.heatmaps[mode][index] = (imgArr)
          setComparingData(currData);
        }
        else {
          const currData = { ...filterData };
          currData.heatmaps[index] = imgArr
          setFilterData(currData);
          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            glocalAnalysisUpdate: false
          }));
        }
        setFilterDataUpdate(true);
      })

      props.socket.on('receive_realistic', (dict: any, data: any) => {
        if (Object.keys(layerInfo.filters.filter_relevances).length && layerInfo.glocalAnalysisUpdate) {
          const index = data.filter_index;
          let imgArr: any[] = []
          for (let item in dict) {
            var binary = '';
            var bytes = new Uint8Array(dict[item]);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            imgArr.push(window.btoa(binary));
          }
          if (comparing) {
            console.log("comparingrealistic")
            const currData = { ...comparingData };
            const mode = data.mode;
            console.log(currData)
            console.log(mode)
            for (const [key, value] of Object.entries(currData.filter_indices)) {
              console.log(`${key}: ${value}`);

            }
            currData.images[mode][index] = imgArr;
            console.log(currData)
            setComparingData(currData);

          }
          else {
            const currData = { ...filterData };
            if (!currData.filter_indices.includes(index)) {
              currData.filter_indices.push(index);
            }
            currData.filter_relevances[index] = layerInfo.filters.filter_relevances[index]
            currData.images[index] = imgArr;
            setFilterData(currData)

          }
          setFilterDataUpdate(true);
        }
      });

      props.socket.on('receive_synthetic', (dict: any, data: any) => {
        const fData = { ...filterData };
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          fData.synthetic[item] = window.btoa(binary)
        }
        setFilterData(fData);
        setFilterDataUpdate(true);
        console.log("synth")
      });


      let ind = 0;
      props.socket.on('receive_statistics', (dict: any, data: any) => {
        let imgArr: any = []
        for (let item in dict) {
          var binary = '';
          var bytes = new Uint8Array(dict[item]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr.push(window.btoa(binary));
        }
        if (ind <= 3 && !Object.values(statisticsData.classNames).includes(data.class_name)) {
          setStatisticsData(inputs => ({
            ...inputs,
            images: {
              ...inputs.images,
              [ind]: imgArr
            },
            classNames: {
              ...inputs.classNames,
              [ind]: data.class_name
            },
            classRelevances: {
              ...inputs.classRelevances,
              [ind]: data.class_rel
            }
          }));
          ind++;
        }

      });

      props.socket.on('disconnect', () => {
        props.socket.removeAllListeners();
      });

      props.socket.on('receive_local_analysis', (json_data: any) => {
        if (singleLayer && experiment && target && imgSize) {

          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            experimentUpdate: false,
            glocalAnalysisUpdate: true
          }));

          setFilterIndices(json_data.filter_indices)
          setFilterNames(json_data.filter_names)
          setFilterRelevances(json_data.relevance)
          console.log("localupdateupdate")
          const currData = { ...filterData };
          currData.filter_indices = json_data.filter_indices;
          currData.filter_names = json_data.filter_names;
          currData.filter_relevances = json_data.relevance;
          setFilterData(currData);
        }
      })
    }
  }, [props.socket, layerInfo.singleLayer, layerInfo.experiment, layerInfo.method, layerInfo.index, comparing, layerInfo.filters, currentAnalysis, filterImgSize, imgSize, order]);


  React.useEffect(() => {
    if (currentlyUpdated) {
      createPlaceholder();
    }
  }, [currentlyUpdated]);




  React.useEffect(() => {
    if (Object.keys(statisticsData.classNames).length === 4) {
      console.log("reache")
      const flavoursContainer = document.getElementById('root');
      const flavoursScrollWidth = flavoursContainer.scrollWidth;

      if (flavoursContainer.scrollLeft !== flavoursScrollWidth) {
        document.getElementById('root').scrollTo({
          left: flavoursScrollWidth,
          behavior: 'smooth',
        })
      }
    }
  }, [statisticsData]);




  const createPlaceholder = () => {
  }


  React.useEffect(() => {
    if (layerInfo.singleLayer && layerInfo.method && layerInfo.target) {

      props.socket.emit('get_global_analysis',
        {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "filter_indices": "0:5",
          "sorting": layerInfo.order,
          "image_index": layerInfo.index,
          "method": layerInfo.method,
          "zero_list_filter": [],
          "zero_layer": layerInfo.singleLayer,
          "target_class": layerInfo.target
        },
        layerInfo.currentAnalysis,
        {
          "size": filterImgSize + 100,
          "sample_indices": "0:9"
        });
    }


  }, [layerInfo.target, layerInfo.experiment, layerInfo.currentAnalysis, layerInfo.index, layerInfo.singleLayer, layerInfo.order, layerInfo.method, layerInfo.currentAnalysis]);

  React.useEffect(() => {
    if (experiment && layer.length && layerModes && classIndices && maxIndices && experimentLayers) {
      console.log("experiment changed")
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        experimentUpdate: true,
        layer: experimentLayers[experiment],
        index: 0,
        singleLayer: experimentLayers[experiment][0],
        currentLayerModes: layerModes[experiment][experimentLayers[experiment][0]],
        currentClassIndices: classIndices[experiment],
        maxIndex: maxIndices[experiment]
      }));
      ///////////

      /* changeLayer(experimentLayers[experiment]);
      setSingleLayer(experimentLayers[experiment][0]);
      changeCurrentLayerModes(layerModes[experiment][experimentLayers[experiment][0]]);
      changeCurrentClassIndices(classIndices[experiment]);
      setMaxIndex(maxIndices[experiment]);
      changeIndex(0); */

    }
  }, [experiment])

  React.useEffect(() => {
    if (props.socket && imgSize && layerInfo.experiment) {
      props.socket.emit('get_data', {
        'image_index': layerInfo.index,
        "experiment": layerInfo.experiment,
        "size": imgSize
      });
    }
  }, [layerInfo.index, layerInfo.experiment, imgSize, props.socket])



  React.useEffect(() => {
    if (props.socket && imgSize && layerInfo.experiment && layerInfo.method) {
      props.socket.emit("get_heatmap", {
        'image_index': layerInfo.index,
        "experiment": layerInfo.experiment,
        "method": layerInfo.method,
        "N_pred": 0,
        "size": imgSize
      })
    }
  }, [layerInfo.index, layerInfo.experiment, layerInfo.method, imgSize, props.socket])

  React.useEffect(() => {
    if (comparingEmit && comparing && Object.values(comparingData.filter_indices).flat().length === 10) {
      for (const [key, value] of Object.entries(comparingData.filter_indices)) {
        let sampleIndices = 9;
        if (comparing) {
          sampleIndices = 3;
        }
        props.socket.emit('vis_partial_heatmap', {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "list_filter": comparingData.filter_indices[key],
          "image_index": layerInfo.index,
          "method": layerInfo.method,
          "size": filterImgSize + 100,
          "weight_activation": 0,
          "target_class": layerInfo.target
        }
        );
        props.socket.emit("vis_realistic", {
          "layer": singleLayer,
          "experiment": layerInfo.experiment,
          "list_filter": comparingData.filter_indices[key],
          "size": filterImgSize + 100,
          "sample_indices": "0:" + sampleIndices,
          "mode": comparingData.modes[comparingData.modes.findIndex((mode: any) => mode === key)]
        })
        for (let j = 0; j < comparingData.filter_indices[key].length; j++) {
          props.socket.emit('vis_realistic_heatmaps', {
            "layer": layerInfo.singleLayer,
            "experiment": layerInfo.experiment,
            "filter_index": comparingData.filter_indices[key][j],
            "size": imgSize,
            "sample_indices": "0:" + sampleIndices,
            "mode": comparingData.modes[comparingData.modes.findIndex((mode: any) => mode === key)],
            "method": layerInfo.method,
            "target_class": layerInfo.target
          }
          );
        }
      }
      changeComparingEmit(false)
    }
  }, [comparingData]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    let filterImageSize = helper.defineFilterImageSize(filterAmount);
    if (!filterImageSize) {
      filterImageSize = 200;
    }
    setFilterImgSize(filterImageSize)
    setImgSize(Math.round(helper.defineImgs()));
    if (Object.keys(values).length === 0 && xaiFlag && props.socket) {
      props.socket.emit('get_XAI_available');
      xaiFlag.current = false;
    }
  }, [props.socket, filterAmount]);
  React.useEffect(() => {
    if (props.socket && layerInfo.glocalAnalysisUpdate && layerInfo.method && layerInfo.experiment && layerInfo.filters.filter_indices.length && layerInfo.target && layerInfo.singleLayer) {
      props.socket.emit('vis_partial_heatmap', {
        "layer": layerInfo.singleLayer,
        "experiment": layerInfo.experiment,
        "list_filter": layerInfo.filters.filter_indices,
        "image_index": layerInfo.index,
        "method": layerInfo.method,
        "size": filterImgSize + 100,
        "weight_activation": 0,
        "target_class": layerInfo.target
      }
      );
    }
  }, [props.socket, layerInfo.glocalAnalysisUpdate, layerInfo.index, layerInfo.filters.filter_indices, layerInfo.method, layerInfo.experiment, layerInfo.target, layerInfo.singleLayer])


  React.useEffect(() => {
    if (props.socket && layerInfo.glocalAnalysisUpdate && !layerInfo.experimentUpdate && layerInfo.experiment && layerInfo.filters.filter_indices.length && layerInfo.singleLayer) {
      props.socket.emit("vis_realistic", {
        "layer": layerInfo.singleLayer,
        "experiment": layerInfo.experiment,
        "list_filter": layerInfo.filters.filter_indices,
        "size": filterImgSize + 100,
        "sample_indices": "0:9",
        "mode": layerInfo.currentAnalysis
      })

      //indicesFlag.current = false;
    }
  }, [layerInfo.singleLayer, layerInfo.glocalAnalysisUpdate, layerInfo.experiment, layerInfo.experimentUpdate, layerInfo.filters.filter_indices, layerInfo.currentAnalysis, filterImgSize, props.socket])


  React.useEffect(() => {
    if (props.socket && layerInfo.glocalAnalysisUpdate && layerInfo.method && layerInfo.experiment && layerInfo.filters.filter_indices.length && layerInfo.target && layerInfo.singleLayer) {

      for (let i = 0; i < layerInfo.filters.filter_indices.length; i++) {
        props.socket.emit('vis_realistic_heatmaps', {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "filter_index": layerInfo.filters.filter_indices[i],
          "size": imgSize,
          "sample_indices": "0:9",
          "mode": layerInfo.currentAnalysis,
          "method": layerInfo.method,
          "target_class": layerInfo.target
        }
        );
      }
    }
  }, [props.socket, layerInfo.glocalAnalysisUpdate, layerInfo.experiment, layerInfo.method, layerInfo.currentAnalysis, layerInfo.filters.filter_indices, layerInfo.target, layerInfo.singleLayer])


  //React.useEffect(() => () => props.socket.disconnect(), []);
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

  /*   React.useEffect(() => {
      if (isSynth && singleLayer && experiment && filterIndices) {
        props.socket.emit("vis_synthetic", {
          "layer": singleLayer,
          "experiment": experiment,
          "list_filter": filterIndices,
          "size": filterImgSize + 100,
        })
      }
    }, [isSynth, singleLayer, filterIndices]); */


  /*  React.useEffect(() => {
   
     if (props.socket && layerInfo.method && order && layerInfo.experiment && imgSize && layerInfo.singleLayer && layerInfo.currentLayerModes && filterDataUpdate) {
       console.log("filterupdate")
       setFilterData({
         filter_indices: [],
         filter_names: {},
         filter_relevances: {},
         images: {},
         heatmaps: {},
         partial: {},
         synthetic: {},
         cnn_activations: {},
         position: {}
       })
   
   
       props.socket.emit('get_global_analysis',
         {
           "layer": layerInfo.singleLayer,
           "experiment": layerInfo.experiment,
           "filter_indices": "0:5",
           "sorting": order,
           "image_index": layerInfo.index,
           "method": layerInfo.method
         },
         currentAnalysis,
         {
           "size": filterImgSize + 100,
           "sample_indices": "0:9"
         });
   
       setCurrentyUpdated(true);
   
       setFilterDataUpdate(false)
     }
   }, [layerInfo.method, layerInfo.experiment, order, layerInfo.singleLayer, currentAnalysis, layerInfo.index, filterImgSize]);
  */

  React.useEffect(() => {
    if (layerInfo.target) {
      props.socket.emit("get_heatmap", {
        'image_index': layerInfo.index,
        "experiment": layerInfo.experiment,
        "method": layerInfo.method,
        "N_pred": 0,
        "size": imgSize,
        "target_class": layerInfo.target
      })
    }
  }, [layerInfo.target])




  /*   React.useEffect(() => {
      if (!flag &&
        experiment &&
        imgSize !== 28 &&
        modus === 0 && singleLayer && layerModes[parseInt(experiment)]) {
        console.log("modes", layerModes)
        changeCurrentLayerModes(layerModes[parseInt(experiment)][singleLayer])
        //changeCurrentClassIndices(classIndices[experiment])
        props.socket.emit('get_data', {
          'image_index': index,
          "experiment": experiment,
          "size": imgSize
        });
   
      }
    }, [index, experiment, flag, imgSize, layerModes, modus, props.socket]); */

  /*   React.useEffect(() => {
      if (props.socket && !indicesFlag) {
        if (currentAnalysis === "synthetic") {
          props.socket.emit("vis_synthetic", {
            "layer": singleLayer,
            "experiment": experiment,
            "list_filter": filterIndices,
            "size": filterImgSize + 100,
          })
        } else {
          console.log("vis")
          props.socket.emit("vis_realistic", {
            "layer": singleLayer,
            "experiment": experiment,
            "list_filter": filterIndices,
            "size": filterImgSize + 100,
            "sample_indices": "0:9",
            "mode": currentAnalysis
          })
        }
      }
    }, [currentAnalysis]) */


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
  const localAnalysis = async (x: number, y: number, width: number, height: number, maskId = -1) => {
    const normedValues = helper.normLocalSelection(x, y, width, height, imgSize);
    props.socket.emit("get_local_analysis", {
      "layer": layerInfo.singleLayer,
      "experiment": layerInfo.experiment,
      "filter_indices": "0:5",
      "sorting": layerInfo.order,
      "image_index": layerInfo.index,
      "method": layerInfo.method,
      "x": normedValues.newX,
      "y": normedValues.newY,
      "width": normedValues.newWidth,
      "height": normedValues.newHeight
    }, "", ""
    )
    setFilterData({
      filter_indices: [],
      filter_names: {},
      filter_relevances: {},
      images: {},
      heatmaps: {},
      partial: {},
      synthetic: {},
      cnn_activations: {},
      position: {}
    });

    setArrows([])
    /*   const filters = queueries.getLocalAnalysis(
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
       } */
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
  const getFilterHeatmap = (value: any) => {
    changeFilterIndex(value);

    /*     const filterHeatmap = queueries.getSingleHeatmap(experiment, index, target, method, value, singleLayer, imgSize);
        Promise.resolve(filterHeatmap).then(results => {
          setHeatmap('data:image/png;base64,' + results.image)
        }) */
  }
  const getFilterActivation = (value: any) => {
    changeFilterIndex(value);
    /*   const filterActivation = queueries.getSingleActivation(experiment, index, target, method, value, singleLayer, imgSize);
      Promise.resolve(filterActivation).then(results => {
        setHeatmap('data:image/png;base64,' + results.image)
      }) */
  }


  //calback functions, called from child components
  const addSamples = (value: any) => {
    changeFilterIndex(Number(value));
    changeSamplesAmount(samplesAmount + 9)
  }

  const inspectFilter = async (value: any, view: string, currentTab: string) => {
    /* changeFilterIndex(Number(value));
    changeViewType(view);
    setCurrentTabName(currentTab); */
    console.log(value, view, currentTab)
    changeViewType(view)

    let statisticsMode
    if (currentTab === 'activation') {

      statisticsMode = 'activation_stats'
    }
    else { statisticsMode = "relevance_stats" }

    if (view === 'STATISTICSVIEW') {
      props.socket.emit("vis_statistics", {
        "layer": layerInfo.singleLayer,
        "experiment": layerInfo.experiment,
        "filter_index": Number(value),
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

      props.socket.emit("get_attribution_graph",
        {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "image_index": layerInfo.index,
          "method": layerInfo.method,
          "size": imgSize,
          "view_prev": 1,
          "mode": layerInfo.currentAnalysis,
          "filter_index": value,
          //target_class in cookie for test only
        }
        , layerInfo.currentAnalysis, {
        "size": imgSize,
        "sample_indices": "0:9",
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
       } 
       */
    }

  }
  const selectedOrder = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      order: value
    }))
  };
  const viewState = (value: any) => {
    setStatisticsData(() => ({
      images: {},
      classNames: {},
      classRelevances: {}
    }))
    console.log(value)
    changeViewType(value);
    setPrevView(value);
  };
  const indexState = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      index: value
    }))
  };
  /*  const classIndexState = value => {
     console.log(value)
     changeClassIndex(value);
   }; */
  const selectedExperiment = (value: string) => {
    changeExperiment(value);
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      experiment: value
    }))
    changeLayer(experimentLayers[value as keyof typeof experimentLayers])
    setSingleLayer(experimentLayers[value as keyof typeof experimentLayers][0])
  };


  const checkAnalysisCallback = async (value: any) => {
    console.log(value)
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      currentAnalysis: value
    }))
  }

  const compareCallback = () => {
    changeComparing(true);
    console.log("com")
    props.socket.emit('get_global_analysis',
      {
        "layer": singleLayer,
        "experiment": experiment,
        "filter_indices": "0:5",
        "sorting": order,
        "image_index": layerInfo.index,
        "method": method
      },
      "max_activation",
      {
        "size": filterImgSize + 100,
        "sample_indices": "0:9"
      });
    props.socket.emit('get_global_analysis',
      {
        "layer": singleLayer,
        "experiment": experiment,
        "filter_indices": "0:5",
        "sorting": order,
        "image_index": layerInfo.index,
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

  const selectedMethod = (value: any) => {
    if (value) {
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        method: value
      }))
    }
  };
  const selectedFilterName = (value: any) => {
    if (value) {
      queueries.setFilterName(experiment, singleLayer, layerInfo.index, value)
    }
  };
  const selectedLayer = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      singleLayer: value
    }))
  };
  /*   const filterAmountCallback = value => {
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
    }; */
  /*   const queryTarget = async value => {
      console.log(value);
    } */
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
  }, [experiment, history, prevParams, layer, maxIndices]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (method && values.method && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, method: method };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [method, history, prevParams]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (layerInfo.index && values.index && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, index: layerInfo.index };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [layerInfo.index, history, prevParams]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (order && values.order && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, order: order };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [order, history, prevParams]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (viewType && values.view && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, view: viewType };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [viewType, history, prevParams]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (isWatershed && values.watershed && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, watershed: isWatershed };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [isWatershed, history, prevParams]);

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (singleLayer && values.selectedLayer && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, selectedLayer: singleLayer };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [singleLayer, history, prevParams]);

  const defaultGrid = (
    <div id='expansioncontainer' className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expansionContainer : classes.defaultContainer}>
      <div style={{ zIndex: 100 }}>
        {arrows}
      </div>
      <div className={classes.default}>
        <Grid item xl={2} lg={3} md={4} xs={4}>
          <SidebarComponent
            target={layerInfo.target}
            maxIndex={layerInfo.maxIndex}
            indexCallback={indexState}
            image={layerInfo.currentImage}
            heatmap={layerInfo.currentHeatmap}
            localAnalysisCallback={localAnalysis}
            index={layerInfo.index}
            classIndices={layerInfo.currentClassIndices}
            heatmapClasses={layerInfo.currentHeatmapClasses}
            heatmapConfidences={layerInfo.currentHeatmapConfidences}
            targetCallback={newTarget => setLayerInfo((layerInfo: any) => ({
              ...layerInfo,
              target: newTarget
            }))
            }
          />
        </Grid>

        <FilterComponent
          target={layerInfo.target}
          filterAmount={filterAmount}
          viewTypeCallback={viewState}
          filterActivationCallback={getFilterActivation}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={"DASHBOARDVIEW"}
          selectedLayer={layerInfo.singleLayer}
          selectedExperiment={layerInfo.experiment}
          selectedMethod={layerInfo.method}
          layers={layer}
          order={layerInfo.order}
          methods={methods}
          models={experiments}
          experimentsCallback={selectedExperiment}
          methodsCallback={selectedMethod}
          layerCallback={selectedLayer}
          filters={filterData}
          compareFilters={comparingData}
          filterImgSize={filterImgSize}
          indexCallback={() => console.log("")}
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
          actFilters={""}
          relFilters={""}
        />
      </div>


      <div className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expandedStatistics : classes.hiddenStatistics}>
        {viewType === 'STATISTICSVIEW' ?
          < StatisticsComponent
            viewState={viewType}
            viewCallback={viewState}
            statistics={statisticsData}
            statisticName={currentAnalysis}
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
