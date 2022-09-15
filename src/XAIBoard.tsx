import 'react-perfect-scrollbar/dist/css/styles.css';
import 'regenerator-runtime/runtime';
import React from 'react';
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { DotLoader } from 'react-spinners'

import { FilterComponent } from './components/FilterComponent';
import SidebarComponent from './components/SidebarComponent';
import NetworkComponent, { graphProps } from './components/NetworkComponent';
import StatisticsComponent from './components/StatisticsComponent';
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
  },
  zIndex: {
    zIndex: 100
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.7)',
    zIndex: 100
  }
}));

export interface XAIBoardProps {
  socket: any
}
export const XAIBoard: React.FC<XAIBoardProps> = (props: XAIBoardProps) => {
  const classes = useStyles();
  const xaiFlag = React.useRef(true);
  const history = useHistory();
  const methods = ["epsilon_plus_flat", "epsilon_plus"];

  //UI state settings
  const [viewType, changeViewType] = React.useState('DASHBOARDVIEW');
  const [imgSize, setImgSize] = React.useState(28);
  const [filterImgSize, setFilterImgSize] = React.useState(28);
  const [loadedPercentage, setLoadedPercentage] = React.useState(0);

  //Meta states of all components
  const [jobIds, setJobIds] = React.useState(new Set());
  const [prevParams, setPrevParams] = React.useState({});
  const [jobIdsToLook, setJobIdsToLook] = React.useState(new Set());
  const [tempData, setTempData]: any = React.useState({
    heatmap: {
      heatmapImg: "",
      heatmapClasses: [],
      heatmapConfidence: [],
      heatmapRelevances: {},
    },
    currentImage: '',
    images: {},
    heatmaps: {},
    conditionalHeatmap: {}
  });
  const [tempComparingData, setTempComparingData]: any = React.useState({
    selectedConceptIds: { 'activation': [], 'relevance': [] },
    conceptNames: { 'activation': {}, 'relevance': {} },
    selectedConceptRelevances: { 'activation': {}, 'relevance': {} },
    images: { 'activation': {}, 'relevance': {} },
    heatmaps: { 'activation': {}, 'relevance': {} },
    conditionalHeatmap: { 'activation': {}, 'relevance': {} },
    modes: ['activation', 'relevance']
  });
  const [filterData, setFilterData]: any = React.useState({
    currentId: 0,
    conceptIds: [],
    filterNames: {},
    conceptRelevances: {},
    selectedConceptIds: [],
    selectedConceptRelevances: {},
    images: {},
    heatmaps: {},
    conditionalHeatmap: {},
    synthetic: {},
    cnnActivations: {},
    position: {}
  });
  const [layerInfo, setLayerInfo]: any = React.useState({
    experimentUpdate: false,
    graphUpdate: false,
    tabChange: false,
    changeView: false,
    updateAfterAnalysis: false,
    glocalAnalysisUpdate: false,
    filterDataUpdate: false,
    comparing: false,
    experiment: "",
    experiments: [],
    method: "epsilon_plus_flat",
    index: 0,
    conceptId: 0,
    targetId: 0,
    target: "",
    targets: [],
    singleLayer: "",
    layer: [],
    currentImage: '',
    descending: true,
    maxIndex: 49999,
    currentAnalysis: "relevance",
    heatmap: {
      heatmapImg: "",
      heatmapClasses: [],
      heatmapConfidence: [],
      heatmapRelevances: {},
    },
  });

  const [graphData, setGraphData] = React.useState<graphProps>({
    nodes: [],
    links: [],
    images: {},
    heatmaps: {}
  });
  const [statisticsData, setStatisticsData] = React.useState({
    images: {},
    classNames: {},
    classRelevances: {}
  });
  const [comparingData, setComparingData]: any = React.useState({
    selectedConceptIds: { 'activation': [], 'relevance': [] },
    conceptNames: { 'activation': {}, 'relevance': {} },
    selectedConceptRelevances: { 'activation': {}, 'relevance': {} },
    images: { 'activation': {}, 'relevance': {} },
    heatmaps: { 'activation': {}, 'relevance': {} },
    conditionalHeatmap: { 'activation': {}, 'relevance': {} },
    modes: ['activation', 'relevance']
  });

  //Analysis possibilities
  const [, changeFromState] = React.useState(false);

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


  React.useEffect(() => {
    if (props.socket) {
      props.socket.once('receive_sample', (img: any, data: any) => {
        setJobIdsToLook(prevState => new Set(prevState).add(String(data.job_id).trim()));

        var arrayBufferView = new Uint8Array(img);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: true,
          targetId: data.target[0],
          target: layerInfo.targets[data.target]
        }));

        setTempData((tempData: any) => ({
          ...tempData,
          currentImage: img_url
        }))
      });
      props.socket.once('receive_global_analysis', (globaldata: any) => {
        setJobIdsToLook(prevState => new Set(prevState).add(String(globaldata.job_id).trim()));
        let sorted = {}
        if (layerInfo.descending) {
          sorted = Object.entries(globaldata.relevance).sort((a: any, b: any) => b[1] - a[1])
        }
        else {
          sorted = Object.entries(globaldata.relevance).sort((a: any, b: any) => a[1] - b[1])

        }
        let highestRelObject: any = Object.fromEntries(
          Object.entries(sorted).slice(0, 5)
        );
        let conceptObject = Object.fromEntries(globaldata.concept_ids.map((key: any, i: any) => [i, key]));
        Object.keys(highestRelObject).forEach(function (key) {
          var newkey: string = "" + conceptObject[key];
          highestRelObject[newkey] = highestRelObject[key][1];
          delete highestRelObject[key];
        });

        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: true
        }));

        let imgObj: any = {}
        let singleImg: any = {}
        let comparingImgObj: any = {}

        for (let i in Object.keys(highestRelObject)) {
          imgObj[Object.keys(highestRelObject)[i]] = helper.createPlaceholderImgs(9, 200)
          comparingImgObj[Object.keys(highestRelObject)[i]] = helper.createPlaceholderImgs(3, 100)
          singleImg[Object.keys(highestRelObject)[i]] = helper.createPlaceholderImgs(1, 400)
        }
        setComparingData({
          ...comparingData,
          selectedConceptIds: {
            "relevance": Object.keys(highestRelObject),
            "activation": Object.keys(highestRelObject),
          },
          selectedConceptRelevances: {
            "relevance": highestRelObject,
            "activation": highestRelObject
          },
          images: {
            'activation': comparingImgObj,
            'relevance': comparingImgObj
          },
          heatmaps: {
            'activation': comparingImgObj,
            'relevance': comparingImgObj
          },
          conditionalHeatmap: {
            'activation': singleImg,
            'relevance': singleImg
          }
        })

        setFilterData({
          ...filterData,
          images: imgObj,
          heatmaps: imgObj,
          conditionalHeatmap: singleImg,
          conceptIds: globaldata.concept_ids,
          conceptRelevances: globaldata.relevance,
          selectedConceptIds: Object.keys(highestRelObject),
          selectedConceptRelevances: highestRelObject
        })
      });

      props.socket.once('receive_heatmap', (img: any, data: any) => {
        setJobIdsToLook(prevState => new Set(prevState).add(String(data.job_id).trim()));

        var arrayBufferView = new Uint8Array(img);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: true
        }));

        setTempData((tempData: any) => ({
          ...tempData,
          heatmap: {
            ...tempData.heatmap,
            heatmapImg: img_url,
            heatmapClasses: data.pred_names,
            heatmapConfidence: data.pred_confidences,
            heatmapRelevances: data.rel_layer
          }
        }))
      });

      props.socket.once('receive_available', (data: any) => {
        console.log(data[Object.keys(data)[0]].target_map[0])
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          index: 0,
          experiment: Object.keys(data)[0],
          experiments: Object.keys(data),
          singleLayer: data[Object.keys(data)[0]].layer_names[0],
          layer: data[Object.keys(data)[0]].layer_names,
          target: 0,
          targets: data[Object.keys(data)[0]].target_map
        }));
      })

      props.socket.on('receive_attribution_graph', (graph: any) => {
        if (graph !== "empty") {
          setJobIdsToLook(prevState => new Set(prevState).add(String(graph.job_id).trim()));

          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            graphUpdate: true,
            glocalAnalysisUpdate: false
          }))
          setGraphData((data: any) => ({
            ...data,
            nodes: graph.nodes,
            links: graph.links
          }));
          //queueFilters(graph)
          //changeViewType("GRAPHVIEW")
        }
      });
      props.socket.once('receive_conditional_heatmaps', (dict: any, data: any) => {
        setJobIdsToLook(prevState => new Set(prevState).add(String(data.job_id).trim()));
        let condImgs: any = {}
        for (let ind in dict) {
          let imgArr: string = ''
          var binary = '';
          var bytes = new Uint8Array(dict[ind]);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imgArr = window.btoa(binary);
          condImgs[ind] = imgArr
        }
        if (layerInfo.comparing) {
          setTempComparingData((tempCompData: any) => ({
            ...tempCompData,
            conditionalHeatmap: {
              ...tempCompData.conditionalHeatmap,
              [data.init_rel]: condImgs
            }
          }))
        } else {
          setTempData((tempData: any) => ({
            ...tempData,
            conditionalHeatmap: condImgs
          }))

        }
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          glocalAnalysisUpdate: true
        }))
      });

      props.socket.once('receive_maximization_heatmaps', (dict: any, data: any) => {
        setJobIdsToLook(prevState => new Set(prevState).add(String(data.job_id).trim()));
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
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          glocalAnalysisUpdate: true
        }))
        if (layerInfo.graphUpdate) {
          console.log("got max heatmaps")
          setGraphData({
            ...graphData,
            heatmaps: {
              ...graphData.heatmaps,
              [data.concept_id]: imgArr
            }
          })
        }
        else if (layerInfo.comparing) {
          setTempComparingData((tempCompData: any) => ({
            ...tempCompData,
            heatmaps: {
              ...tempCompData.heatmaps,
              [data.mode]: {
                ...tempCompData.heatmaps[data.mode],
                [data.concept_id]: imgArr
              }
            }
          }))
        }
        else {
          setTempData((tempData: any) => ({
            ...tempData,
            heatmaps: {
              ...tempData.heatmaps,
              [data.concept_id]: imgArr
            }
          }))
        }

      });

      props.socket.once('receive_maximization_realistic', (dict: any, data: any) => {
        setJobIdsToLook(prevState => new Set(prevState).add(String(data.job_id).trim()));
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
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          glocalAnalysisUpdate: true
        }))
        if (layerInfo.graphUpdate) {
          console.log("reached max real")
          setGraphData({
            ...graphData,
            images: {
              ...graphData.images,
              [data.concept_id]: imgArr
            }
          })
        }
        else if (layerInfo.comparing) {
          setTempComparingData((tempCompData: any) => ({
            ...tempCompData,
            images: {
              ...tempCompData.images,
              [data.mode]: {
                ...tempCompData.images[data.mode],
                [data.concept_id]: imgArr
              }
            }
          }))
        } else {
          setTempData((tempData: any) => ({
            ...tempData,
            images: {
              ...tempData.images,
              [data.concept_id]: imgArr
            }
          }))
        }

      });

      props.socket.on('receive_statistics', (data: any) => {

        let relevances: any = {}
        for (let i = 0; i < data.targets.length; i++) {
          relevances[data.targets[i]] = data.values[i]
        }
        setStatisticsData({
          ...statisticsData,
          classRelevances: relevances
        });
        setJobIdsToLook(() => new Set().add(String(data.job_id).trim()));

      });

      props.socket.on('receive_stats_heatmaps', (dict: any, data: any) => {
        const index = data.concept_id;
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
      });

      props.socket.on('disconnect', () => {
        props.socket.removeAllListeners();
      });

      props.socket.on('receive_local_analysis', (data: any) => {
        let sorted = {}
        if (layerInfo.descending) {
          sorted = Object.entries(data.relevance).sort((a: any, b: any) => b[1] - a[1])
        }
        else {
          sorted = Object.entries(data.relevance).sort((a: any, b: any) => a[1] - b[1])
        }
        let highestRelObject: any = Object.fromEntries(
          Object.entries(sorted).slice(0, 5)
        );

        let conceptObject = Object.fromEntries(data.concept_ids.map((key: any, i: any) => [i, key]));
        Object.keys(highestRelObject).forEach(function (key) {
          var newkey: string = "" + conceptObject[key];
          highestRelObject[newkey] = highestRelObject[key][1];
          delete highestRelObject[key];
        });
        let imgObj: any = {}
        let singleImg: any = {}
        for (let i = 0; i < Object.keys(highestRelObject).length; i++) {
          highestRelObject[data.concept_ids[i]] = data.relevance[data.concept_ids[i]]
        }
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: true,
          glocalAnalysisUpdate: false
        }));
        for (let i in Object.keys(highestRelObject)) {
          imgObj[Object.keys(highestRelObject)[i]] = helper.createPlaceholderImgs(9, 200)
          singleImg[Object.keys(highestRelObject)[i]] = helper.createPlaceholderImgs(1, 400)
        }
        setFilterData({
          ...filterData,
          images: imgObj,
          heatmaps: imgObj,
          conditionalHeatmap: singleImg,
          conceptIds: data.concept_ids,
          conceptRelevances: data.relevance,
          selectedConceptIds: Object.keys(highestRelObject),
          selectedConceptRelevances: highestRelObject
        })
        setJobIdsToLook(() => new Set().add(String(data.job_id).trim()));
      })
    }
  }, [props.socket, layerInfo.singleLayer, jobIdsToLook.size, layerInfo.descending, layerInfo.experiment, layerInfo.method, layerInfo.index, layerInfo.filters, filterImgSize, imgSize]);

  React.useEffect(() => {
    console.log(jobIds)
  }, [jobIds.size])

  React.useEffect(() => {
    console.log(jobIdsToLook)
  }, [jobIdsToLook.size])

  React.useEffect(() => {
    console.log(layerInfo.graphUpdate)
  }, [layerInfo.graphUpdate])


  React.useEffect(() => {
    if (viewType == 'DASHBOARDVIEW') {
      setJobIdsToLook(new Set())
    }
  }, [viewType])

  const updateFilters = (setGraph: boolean = false) => {
    if (setGraph) {
      changeViewType('GRAPHVIEW')
      console.log("graph loaded")
    }
    else {
      if (layerInfo.comparing) {
        setComparingData({
          ...comparingData,
          conditionalHeatmap: tempComparingData.conditionalHeatmap,
          images: tempComparingData.images,
          heatmaps: tempComparingData.heatmaps
        });
      } else {
        setFilterData((filterData: any) => ({
          ...filterData,
          conditionalHeatmap: tempData.conditionalHeatmap,
          images: tempData.images,
          heatmaps: tempData.heatmaps
        }));
      }
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        changeView: true,
        comparing: false,
        graphUpdate: false,
        glocalAnalysisUpdate: false
      }));
      changeViewType('DASHBOARDVIEW')
    }

    setJobIds(new Set())


  }


  const queueFilters = (graph: any = null) => {
    let samplesHash, heatmapsHash, condHash
    let newJobIds = new Set()
    let listOfIds = filterData.selectedConceptIds.map(Number);
    console.log(graph)

    if (!graph) {
      condHash = Math.random().toString(36).slice(2)
      props.socket.emit("vis_conditional_heatmaps", {
        "experiment": layerInfo.experiment,
        "list_concept_ids": listOfIds,
        "sample_indices": "0:1",
        "index": layerInfo.index,
        "method": layerInfo.method,
        "target": layerInfo.targetId,
        "init_rel": layerInfo.currentAnalysis,
        "size": 224,
        "layer": layerInfo.singleLayer,
        "job_id": condHash
      })
      newJobIds.add(condHash)
    }

    let selectedConceptIds = graph ? graph.nodes.map((item: any) => item.concept_id) : filterData.selectedConceptIds
    let listOfLayer = graph ? graph.nodes.map((item: any) => item.layer_name) : Array(filterData.selectedConceptIds.length).fill(layerInfo.singleLayer)
    let numSamples = graph ? 1 : 9

    for (let i = 0; i < selectedConceptIds.length; i++) {
      samplesHash = Math.random().toString(36).slice(2)
      heatmapsHash = Math.random().toString(36).slice(2)
      props.socket.emit("vis_realistic", {
        "experiment": layerInfo.experiment,
        "concept_id": selectedConceptIds[i],
        "range": "0:" + numSamples,
        "mode": layerInfo.currentAnalysis,
        "size": filterImgSize + 100,
        "layer": listOfLayer[i],
        "method": layerInfo.method,
        "job_id": samplesHash
      })
      props.socket.emit("vis_realistic_heatmaps", {
        "experiment": layerInfo.experiment,
        "concept_id": selectedConceptIds[i],
        "range": "0:" + numSamples,
        "mode": layerInfo.currentAnalysis,
        "size": filterImgSize + 100,
        "layer": listOfLayer[i],
        "method": layerInfo.method,
        "job_id": heatmapsHash
      })
      newJobIds.add(samplesHash)
      newJobIds.add(heatmapsHash)
    }
    setJobIds(newJobIds)
    changeViewType('DASHBOARDVIEW')

  }

  React.useEffect(() => {
    if (layerInfo.currentAnalysis == "comparison" && layerInfo.tabChange) {
      console.log("com")
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        comparing: true,
        tabChange: false
      }));
    }
    else if (jobIds.size) {
      let intersect: any = new Set([...jobIdsToLook].filter(i => jobIds.has(i)));
      let percentage = (((intersect.size / jobIds.size) + Number.EPSILON) * 100).toFixed(2)
      setLoadedPercentage(Number(percentage))

      if (percentage == '100.00' && layerInfo.graphUpdate && graphData.nodes.length &&
        !Object.keys(graphData.images).length && !Object.keys(graphData.heatmaps).length &&
        !layerInfo.glocalAnalysisUpdate) {
        setJobIdsToLook(new Set())
        console.log("queueing")
        queueFilters(graphData)
      }
      else if (percentage == '100.00' && layerInfo.graphUpdate &&
        Object.keys(graphData.images).length && Object.keys(graphData.heatmaps).length && layerInfo.glocalAnalysisUpdate) {
        let updateGraph = true
        updateFilters(updateGraph)
      }

      else if (percentage == '100.00' && !layerInfo.graphUpdate && layerInfo.experimentUpdate &&
        tempData.heatmap.heatmapClasses.length && tempData.currentImage &&
        filterData.selectedConceptIds.length && layerInfo.experiment && layerInfo.singleLayer &&
        layerInfo.currentAnalysis && layerInfo.method) {
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: false,
          currentImage: tempData.currentImage,
          heatmap: tempData.heatmap
        }));
        queueFilters()

      }
      else if (percentage == '100.00' &&
        !layerInfo.graphUpdate &&
        layerInfo.glocalAnalysisUpdate &&
        Object.keys(tempData.conditionalHeatmap).length &&
        Object.keys(tempData.images).length && Object.keys(tempData.heatmaps).length &&
        filterData.selectedConceptIds.length && layerInfo.experiment && layerInfo.singleLayer &&
        layerInfo.currentAnalysis && layerInfo.method) {
        updateFilters()
      }

      else if (percentage != '100.00') {
        changeViewType('LOADINGVIEW')
      }
    }
    else if (layerInfo.tabChange) {
      queueFilters()
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        tabChange: false
      }));
    }
  }, [layerInfo.glocalAnalysisUpdate, layerInfo.singleLayer, layerInfo.tabChange, layerInfo.graphUpdate,
  Object.keys(graphData.heatmaps).length, Object.keys(graphData.images).length, graphData.nodes.length, Object.keys(tempData.heatmaps).length,
    graphData, props.socket, filterData.selectedConceptIds, layerInfo.targetId,
  layerInfo.index, layerInfo.method, layerInfo.currentAnalysis, layerInfo.experiment,
  tempData.heatmap, tempData.conditionalHeatmap, tempData.currentImage, jobIdsToLook.size, jobIds.size]);

  React.useEffect(() => {
    if (graphData.nodes.length && viewType == "GRAPHVIEW") {
      const flavoursContainer = document.getElementById('root');
      const flavoursScrollWidth = flavoursContainer.scrollWidth;

      if (flavoursContainer.scrollLeft !== flavoursScrollWidth) {
        document.getElementById('root').scrollTo({
          left: flavoursScrollWidth,
          behavior: 'smooth',
        })
      }
    }
  }, [graphData, viewType]);
  React.useEffect(() => {
    if (layerInfo.experiment) {
      let currHash = Math.random().toString(36).slice(2)
      if (layerInfo.glocalAnalysisUpdate) {
        setJobIds(new Set().add(currHash))
      } else {
        setJobIds(prevState => new Set(prevState).add(currHash.trim()))
      }
      props.socket.emit('get_global_analysis',
        {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "index": layerInfo.index,
          "method": layerInfo.method,
          "target": layerInfo.targetId,
          "descending": layerInfo.descending,
          "abs_norm": true,
          "job_id": currHash
        });
    }
  }, [layerInfo.descending, layerInfo.singleLayer, layerInfo.experiment, layerInfo.index, layerInfo.method]);
  React.useEffect(() => {
    if (layerInfo.experiment && layerInfo.layer.length) {
      console.log("experiment changed")
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        experimentUpdate: true,
      }));
    }
  }, [layerInfo.experiment])

  React.useEffect(() => {
    console.log(layerInfo.targetId)
  }, [layerInfo.targetId])

  React.useEffect(() => {
    if (props.socket && imgSize && layerInfo.experiment) {
      let currHash = Math.random().toString(36).slice(2)
      setJobIds(prevState => new Set(prevState).add(currHash.trim()))
      props.socket.emit('vis_sample', {
        "experiment": layerInfo.experiment,
        "index": layerInfo.index,
        "size": imgSize,
        "job_id": currHash
      });
    }
  }, [layerInfo.index, layerInfo.experiment, imgSize, props.socket])
  React.useEffect(() => {
    if (props.socket && imgSize && layerInfo.experiment) {
      let currHash = Math.random().toString(36).slice(2)
      let currIds = [...jobIds]
      currIds.push(currHash)
      setJobIds(prevState => new Set(prevState).add(currHash.trim()))
      props.socket.emit("vis_heatmap", {
        'index': layerInfo.index,
        "experiment": layerInfo.experiment,
        "target": layerInfo.targetId,
        "method": layerInfo.method,
        "size": imgSize,
        "job_id": currHash
      })
    }
  }, [layerInfo.index, layerInfo.targetId, layerInfo.experiment, layerInfo.method, imgSize, props.socket])
  React.useEffect(() => {
    if (props.socket && layerInfo.experiment && layerInfo.currentAnalysis && filterData.selectedConceptIds.length === 5 && layerInfo.singleLayer && layerInfo.glocalAnalysisUpdate) {
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        glocalAnalysisUpdate: false
      }));
    }
  }, [layerInfo.glocalAnalysisUpdate, layerInfo.experiment, filterData.selectedConceptIds, filterImgSize, props.socket, layerInfo.singleLayer, layerInfo.currentAnalysis])

  React.useEffect(() => {
    if (layerInfo.comparing) {
      let currHash, heatmapsHash, conditionalHash
      let newJobIds = new Set()
      let listOfIds = filterData.selectedConceptIds.map(Number);

      for (const [key, value] of Object.entries(comparingData.selectedConceptIds)) {
        conditionalHash = Math.random().toString(36).slice(2)
        props.socket.emit("vis_conditional_heatmaps", {
          "experiment": layerInfo.experiment,
          "list_concept_ids": listOfIds,
          "sample_indices": "0:1",
          "index": layerInfo.index,
          "method": layerInfo.method,
          "target": layerInfo.targetId,
          "init_rel": comparingData.modes[comparingData.modes.findIndex((mode: any) => mode === key)],
          "size": 224,
          "layer": layerInfo.singleLayer,
          "job_id": conditionalHash
        })
        for (let i = 0; i < filterData.selectedConceptIds.length; i++) {
          currHash = Math.random().toString(36).slice(2)
          heatmapsHash = Math.random().toString(36).slice(2)

          props.socket.emit("vis_realistic", {
            "experiment": layerInfo.experiment,
            "concept_id": filterData.selectedConceptIds[i],
            "range": "0:3",
            "mode": comparingData.modes[comparingData.modes.findIndex((mode: any) => mode === key)],
            "size": filterImgSize + 100,
            "layer": layerInfo.singleLayer,
            "method": layerInfo.method,
            "job_id": currHash
          })
          props.socket.emit("vis_realistic_heatmaps", {
            "experiment": layerInfo.experiment,
            "concept_id": filterData.selectedConceptIds[i],
            "range": "0:3",
            "mode": comparingData.modes[comparingData.modes.findIndex((mode: any) => mode === key)],
            "size": filterImgSize + 100,
            "layer": layerInfo.singleLayer,
            "method": layerInfo.method,
            "job_id": heatmapsHash
          })
          newJobIds.add(currHash)
          newJobIds.add(heatmapsHash)
        }
        newJobIds.add(conditionalHash)
      }
      setJobIds(newJobIds)
    }
  }, [layerInfo.comparing])

  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    let filterImageSize = helper.defineFilterImageSize(10);
    if (!filterImageSize) {
      filterImageSize = 200;
    }
    setFilterImgSize(filterImageSize)
    setImgSize(Math.round(helper.defineImgs()));
    if (Object.keys(values).length === 0 && xaiFlag && props.socket) {

      props.socket.emit('get_available', {});
      xaiFlag.current = false;
    }
  }, [props.socket]);

  //local selection crop function, visualizing and updating relevances for parts of the image/heatmap
  const localAnalysis = async (x: number, y: number, width: number, height: number) => {
    const normedValues = helper.normLocalSelection(x, y, width, height, imgSize);
    let currHash = Math.random().toString(36).slice(2)
    setJobIds(() => new Set().add(currHash))
    props.socket.emit("get_local_analysis", {
      "layer": layerInfo.singleLayer,
      "experiment": layerInfo.experiment,
      "index": layerInfo.index,
      "target": layerInfo.targetId,
      "abs_norm": true,
      "descending": layerInfo.descending,
      "method": layerInfo.method,
      "x": normedValues.newX,
      "y": normedValues.newY,
      "width": normedValues.newWidth,
      "height": normedValues.newHeight,
      "job_id": currHash
    }
    )

    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      filters: {
        filter_indices: [],
        filter_names: {},
        filter_relevances: {},
        images: {},
        heatmaps: {},
        conditionalHeatmap: {},
        synthetic: {},
        cnn_activations: {},
        position: {}
      }
    }))
  };
  //visualizing heatmap according to selected filter
  const getFilterHeatmap = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      filters: {
        ...layerInfo,
        current_id: Number(value)
      }
    })
    )
  }
  const getFilterActivation = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      filters: {
        ...layerInfo,
        current_id: Number(value)
      }
    })
    )
  }
  //calback functions, called from child components
  const inspectFilter = async (value: any, view: string, currentTab: string) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      concept_id: Number(value),
      filters: {
        ...layerInfo,
        current_id: Number(value)
      }
    })
    )

    changeViewType(view)

    let statisticsMode
    if (currentTab === 'activation') {

      statisticsMode = 'activation_stats'
    }
    else { statisticsMode = "relevance_stats" }

    if (view === 'STATISTICSVIEW') {
      console.log(layerInfo.curentAnalysis)
      let currHash = Math.random().toString(36).slice(2)
      setJobIds(() => new Set().add(currHash))
      props.socket.emit("get_statistics", {
        "experiment": layerInfo.experiment,
        "layer": layerInfo.singleLayer,
        "concept_id": Number(value),
        "top_N": 5,
        "mode": 'relevance',
        "job_id": currHash
      })
    }
    else if (view === 'GRAPHVIEW') {
      let currHash = Math.random().toString(36).slice(2)
      setJobIds(() => new Set().add(currHash))

      props.socket.emit("get_attribution_graph",
        {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "index": layerInfo.index,
          "method": layerInfo.method,
          "concept_id": value,
          "target": layerInfo.targetId,
          "abs_norm": true,
          "parent_c_id": 10,
          "parent_layer": "features.40",
          "job_id": currHash,
        }
      )
    }

  }
  const selectedOrder = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      descending: value
    }))
  };
  const viewState = (value: any) => {
    setStatisticsData(() => ({
      images: {},
      classNames: {},
      classRelevances: {}
    }))
    changeViewType(value);
  };
  const indexState = (value: any) => {

    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      index: value
    }))
  };

  const presetChange = (layer: string, index: string, sampleTag: string) => {

    let targetId = (Object.keys(layerInfo.targets).find(key => layerInfo.targets[key] === sampleTag))
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      index: parseInt(index),
      targetId: parseInt(targetId),
      singleLayer: layer
    }))
  }
  const selectedExperiment = (value: string) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      experiment: value,
      layer: layerInfo.layer[value as keyof typeof layerInfo.layer],
      singleLayer: layerInfo.layer[value as keyof typeof layerInfo.layer][0]
    }))
  };
  const checkAnalysisCallback = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      tabChange: true,
      currentAnalysis: value
    }))
  }
  const compareCallback = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      comparing: true
    }));
  }

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
      ///
    }
  };
  const selectedLayer = (value: any) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      glocalAnalysisUpdate: true,
      singleLayer: value
    }))
  };

  //dependencies, updating query params
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (layerInfo.experiment && layerInfo.layer && values.experiment && values.selectedLayer && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, experiment: layerInfo.experiment, selectedLayer: 'l1' };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [layerInfo.experiment, history, prevParams, layerInfo.layer]);
  React.useEffect(() => {
    let values = queryString.parse(window.location.search)
    if (layerInfo.method && values.method && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, method: layerInfo.method };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [layerInfo.method, history, prevParams]);
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
    if (values.order && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, order: layerInfo.descending };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [layerInfo.descending, history, prevParams]);
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
    if (layerInfo.singleLayer && values.selectedLayer && values !== prevParams) {
      setPrevParams(values)
      const newQueries = { ...values, selectedLayer: layerInfo.singleLayer };
      history.push({ search: queryString.stringify(newQueries) });
      changeFromState(true);
    }
  }, [layerInfo.singleLayer, history, prevParams]);

  const defaultGrid = (
    <div id='expansioncontainer' className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expansionContainer : classes.defaultContainer}>
      <div className={classes.default}>
        <Grid item xl={2} lg={3} md={4} xs={4}>
          <SidebarComponent
            target={layerInfo.target}
            maxIndex={layerInfo.maxIndex}
            indexCallback={indexState}
            image={layerInfo.currentImage}
            heatmap={layerInfo.heatmap.heatmapImg}
            localAnalysisCallback={localAnalysis}
            index={layerInfo.index}
            presetCallback={presetChange}
            classIndices={layerInfo.targets}
            heatmapClasses={layerInfo.heatmap.heatmapClasses}
            currLayer={layerInfo.singleLayer}
            heatmapConfidence={layerInfo.heatmap.heatmapConfidence}
            heatmapRelevances={layerInfo.heatmap.heatmapRelevances}
            targetCallback={newTarget => setLayerInfo((layerInfo: any) => ({
              ...layerInfo,
              target: newTarget
            }))} />
        </Grid>
        <FilterComponent
          target={layerInfo.target}
          orderCallback={selectedOrder}
          viewState={"DASHBOARDVIEW"}
          selectedLayer={layerInfo.singleLayer}
          selectedExperiment={layerInfo.experiment}
          selectedMethod={layerInfo.method}
          layers={layerInfo.layer}
          descending={layerInfo.descending}
          methods={methods}
          selectedTab={layerInfo.currentAnalysis}
          models={layerInfo.experiments}
          experimentsCallback={selectedExperiment}
          methodsCallback={selectedMethod}
          layerCallback={selectedLayer}
          filters={filterData}
          compareFilters={comparingData}
          filterImgSize={filterImgSize}
          filterInspectionCallback={inspectFilter}
          analysisCallback={checkAnalysisCallback}
        />
      </div>
      <div className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expandedStatistics : classes.hiddenStatistics}>
        {viewType === 'STATISTICSVIEW' ?
          < StatisticsComponent
            viewState={viewType}
            viewCallback={viewState}
            statistics={statisticsData}
            statisticName={layerInfo.currentAnalysis}
            currentLayer={layerInfo.singleLayer}
            conceptId={layerInfo.filters.current_id} /> : viewType === 'GRAPHVIEW' ?
            <NetworkComponent
              viewState={viewType}
              viewCallback={viewState}
              graph={graphData}
              conceptId={layerInfo.filters.current_id} /> : null}
      </div>
    </div >
  );

  const loadingGrid = (
    <div id='expansioncontainer' className={classes.loading}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        wrap="nowrap"
        className={classes.overlay}
      >
        <DotLoader
          size={100}
          color={"#333333"}
          loading={true}
        />
        <h3> Loading... {loadedPercentage} %</h3>
      </Grid>
      {defaultGrid}
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
          default:
            return defaultGrid
        }
      })()}
    </div>
  );
};

export default XAIBoard;
