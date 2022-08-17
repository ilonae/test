import 'react-perfect-scrollbar/dist/css/styles.css';
import 'regenerator-runtime/runtime';
import React from 'react';
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { ArrowSvg, LineOrientation } from 'react-simple-arrows';
import { DotLoader } from 'react-spinners'

import { FilterComponent } from './components/FilterComponent';
import SidebarComponent from './components/SidebarComponent';
import NetworkComponent, { graphProps } from './components/NetworkComponent';
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

export interface XAIBoardProps {
  socket: any
}

export const XAIBoard: React.FC<XAIBoardProps> = (props: XAIBoardProps) => {
  const classes = useStyles();
  const xaiFlag = React.useRef(true);

  const history = useHistory();
  const methods = ["epsilon_plus_flat", "epsilon_plus"];

  const [viewType, changeViewType] = React.useState('DASHBOARDVIEW');
  const [samplesAmount, changeSamplesAmount] = React.useState(9);

  const [imgSize, setImgSize] = React.useState(28);
  const [filterImgSize, setFilterImgSize] = React.useState(28);

  const [arrows, setArrows]: any[] = React.useState([]);

  const [jobIds, setJobIds] = React.useState<string[]>([]);
  const [jobIdsToLook, setJobIdsToLook] = React.useState<string[]>([]);

  const [, setPrevView] = React.useState('');
  const [prevParams, setPrevParams] = React.useState({});


  //Analysis possibilities
  const [currentLayerModes, changeCurrentLayerModes] = React.useState({
    synthetic: 0,
    max_activation: 0,
    max_relevance_target: 0,
    cnn_activation: 0,
    relevance_stats: 0,
    activation_stats: 0
  });

  const [tempData, setTempData]: any = React.useState({
    heatmap: {
      heatmapImg: "",
      heatmapClasses: [],
      heatmapConfidences: [],
      heatmapRelevances: {},
    },
    currentImage: '',
    images: {},
    heatmaps: {},
    partial: {}
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
    partial: {},
    synthetic: {},
    cnnActivations: {},
    position: {}
  });

  const [layerInfo, setLayerInfo]: any = React.useState({
    experimentUpdate: false,
    updateAfterAnalysis: false,
    glocalAnalysisUpdate: false,
    filterDataUpdate: false,
    experiment: "",
    experiments: [],
    method: "epsilon_plus_flat",
    index: 0,
    conceptId: 0,
    target: "",
    targets: [],
    singleLayer: "",
    layer: [],
    currentImage: '',
    descending: true,
    maxIndex: 4999,
    currentAnalysis: "relevance",
    heatmap: {
      heatmapImg: "",
      heatmapClasses: [],
      heatmapConfidences: [],
      heatmapRelevances: {},
    },
  });

  const [graphData, setGraphData] = React.useState<graphProps>({
    nodes: [],
    links: [],
    images: {},
    jobId: ""
  });

  const [statisticsData, setStatisticsData] = React.useState({
    images: {},
    classNames: {},
    classRelevances: {}
  });

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

  const [currentlyUpdated, setCurrentyUpdated] = React.useState(false);
  const [comparing, changeComparing] = React.useState(false);
  const [comparingEmit, changeComparingEmit] = React.useState(true);

  const [filterDataUpdate, setFilterDataUpdate] = React.useState(false);
  const [targetUpdate, setTargetUpdate] = React.useState(false);
  const [loadedPercentage, setLoadedPercentage] = React.useState(0);

  const [, changeFromState] = React.useState(false);

  const createImgs = (nr: number, size: number) => {
    let imgArr = [];
    let dataURL;
    for (let i = 0; i < nr; i++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = size;
      canvas.width = size;

      //ctx.fillRect(0, 0, canvas.width, canvas.height);
      dataURL = canvas.toDataURL();
      dataURL = dataURL.replace(/^data:image\/[a-z]+;base64,/, "");
      imgArr[i] = dataURL
    }
    if (nr > 1) {
      return imgArr;
    }
    else {
      return dataURL
    }
  }

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
      //scroller.addEventListener('scroll', handleScroll);
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
      /* props.socket.on('receive_synthetic', (dict: any[], data: any[]) => {
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
        setFilterData(currData)
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
          setFilterData(currData)
          setFilterDataUpdate(true);
        }
      }); */
      props.socket.once('receive_sample', (img: any, data: any) => {
        if (!jobIdsToLook.length) {
          setJobIdsToLook([String(data.job_id)])
        }
        else if (!jobIdsToLook.includes(data.job_id)) {
          setJobIdsToLook(jobIdsToLook.concat(String(data.job_id)))
        }
        var arrayBufferView = new Uint8Array(img);
        var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        var img_url = URL.createObjectURL(blob);
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: true
        }));

        setTempData((tempData: any) => ({
          ...tempData,
          currentImage: img_url,
          target: data.target[0]
        }))

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
      props.socket.once('receive_global_analysis', (globaldata: any) => {
        if (!jobIdsToLook.length) {
          setJobIdsToLook([String(globaldata.job_id)])
        }
        else if (!jobIdsToLook.includes(globaldata.job_id)) {
          setJobIdsToLook(jobIdsToLook.concat(String(globaldata.job_id)))
        }
        if (comparing) {
          changeSamplesAmount(3)
          const currData = { ...comparingData };
          const currMode = globaldata.mode;
          currData.filter_indices[currMode] = (globaldata.filter_indices)
          currData.filter_relevances[currMode] = (globaldata.relevance)
          setComparingData(currData);
        }
        else {
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
          for (let i in Object.keys(highestRelObject)) {
            imgObj[Object.keys(highestRelObject)[i]] = createImgs(9, 200)
            singleImg[Object.keys(highestRelObject)[i]] = createImgs(1, 400)
          }
          setFilterData({
            ...filterData,
            images: imgObj,
            heatmaps: imgObj,
            partial: singleImg,
            conceptIds: globaldata.concept_ids,
            conceptRelevances: globaldata.relevance,
            selectedConceptIds: Object.keys(highestRelObject),
            selectedConceptRelevances: highestRelObject
          })
        }
      });
      props.socket.once('receive_heatmap', (img: any, data: any) => {
        if (!jobIdsToLook.length) {
          setJobIdsToLook([String(data.job_id)])
        }
        else if (!jobIdsToLook.includes(data.job_id)) {
          setJobIdsToLook(jobIdsToLook.concat(String(data.job_id)))
        }
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
            heatmapConfidences: data.pred_confidences,
            heatmapRelevances: data.rel_layer
          }
        }))
      });

      props.socket.once('receive_available', (data: any) => {
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          index: 0,
          experiment: Object.keys(data)[0],
          experiments: Object.keys(data),
          singleLayer: data[Object.keys(data)[0]].layer_names[0],
          layer: data[Object.keys(data)[0]].layer_names,
          target: data[Object.keys(data)[0]].target_map[0],
          targets: data[Object.keys(data)[0]].target_map
        }));
      })

      props.socket.on('receive_attribution_graph', (graph: any) => {
        if (graph !== "empty") {
          setGraphData((data: any) => ({
            ...data,
            nodes: graph.nodes,
            links: graph.links,
            jobId: graph.job_id
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

      props.socket.once('receive_maximization_heatmaps', (dict: any, data: any) => {
        if (!jobIdsToLook.length) {
          setJobIdsToLook([String(data.job_id)])
        }
        else if (!jobIdsToLook.includes(data.job_id)) {
          setJobIdsToLook(jobIdsToLook.concat(String(data.job_id)))
        }
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
        setTempData((tempData: any) => ({
          ...tempData,
          heatmaps: {
            ...tempData.heatmaps,
            [data.concept_id]: imgArr
          }
        }))
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          glocalAnalysisUpdate: true
        }))
      });

      props.socket.once('receive_maximization_realistic', (dict: any, data: any) => {
        if (!jobIdsToLook.length) {
          setJobIdsToLook([String(data.job_id)])
        }
        else if (!jobIdsToLook.includes(data.job_id)) {
          setJobIdsToLook(jobIdsToLook.concat(String(data.job_id)))
        }
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
        if (comparing) {
          console.log("comparingrealistic")
          const currData = { ...comparingData };
          const mode = data.mode;
          for (const [key, value] of Object.entries(currData.filter_indices)) {
            console.log(`${key}: ${value}`);
          }
          currData.images[mode][index] = imgArr;
          setComparingData(currData);

        }
        else {
          setTempData((tempData: any) => ({
            ...tempData,
            images: {
              ...tempData.images,
              [data.concept_id]: imgArr
            }
          }))

          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            glocalAnalysisUpdate: true
          }))
        }
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

      /*       props.socket.on('receive_statistics', (dict: any, data: any) => {
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
       
            }); */

      props.socket.on('disconnect', () => {
        props.socket.removeAllListeners();
      });

      props.socket.on('receive_local_analysis', (data: any) => {
        if (layerInfo.singleLayer && layerInfo.experiment && layerInfo.target && imgSize) {

          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            experimentUpdate: false,
            glocalAnalysisUpdate: true,
            filters: {
              ...layerInfo.filters,
              concept_ids: data.concept_ids,
              concept_relevances: data.relevance
            }
          }));

          console.log("localupdateupdate")
          setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            filters: {
              ...layerInfo.filters,
              concept_ids: data.concept_ids,
              concept_relevances: data.relevance
            }
          })
          )
        }
      })
    }
  }, [props.socket, layerInfo.singleLayer, jobIdsToLook.length, layerInfo.descending, layerInfo.experiment, layerInfo.method, layerInfo.index, comparing, layerInfo.filters, filterImgSize, imgSize]);


  React.useEffect(() => {
    if (currentlyUpdated) {
      createPlaceholder();
    }
  }, [currentlyUpdated]);

  function areEqual(array1: any, array2: any) {
    if (array1.length === array2.length) {
      return array1.every((element: any) => {
        if (array2.includes(element)) {
          return true;
        }
        return false;
      });
    }
    return false;
  }

  React.useEffect(() => {
    console.log(jobIdsToLook)
  }, [jobIdsToLook.length])

  React.useEffect(() => {
    if (jobIdsToLook.length && jobIds.length) {
      let percentage = (((jobIdsToLook.length / jobIds.length) + Number.EPSILON) * 100).toFixed(2)
      setLoadedPercentage(Number(percentage))

      if (areEqual(jobIds, jobIdsToLook) && layerInfo.experimentUpdate &&
        tempData.heatmap.heatmapClasses.length && tempData.currentImage &&
        filterData.selectedConceptIds.length && layerInfo.experiment && layerInfo.singleLayer &&
        layerInfo.currentAnalysis && layerInfo.method) {

        setJobIdsToLook([])

        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          experimentUpdate: false,
          target: tempData.target,
          currentImage: tempData.currentImage,
          heatmap: tempData.heatmap
        }));
        let currHash, otherHash

        let newJobIds = []
        for (let i = 0; i < filterData.selectedConceptIds.length; i++) {

          currHash = Math.random().toString(36).slice(2)
          otherHash = Math.random().toString(36).slice(2)

          props.socket.emit("vis_realistic", {
            "experiment": layerInfo.experiment,
            "concept_id": filterData.selectedConceptIds[i],
            "range": "0:9",
            "mode": layerInfo.currentAnalysis,
            "size": filterImgSize + 100,
            "layer": layerInfo.singleLayer,
            "method": layerInfo.method,
            "job_id": currHash
          })

          props.socket.emit("vis_realistic_heatmaps", {
            "experiment": layerInfo.experiment,
            "concept_id": filterData.selectedConceptIds[i],
            "range": "0:9",
            "mode": layerInfo.currentAnalysis,
            "size": filterImgSize + 100,
            "layer": layerInfo.singleLayer,
            "method": layerInfo.method,
            "job_id": otherHash
          })
          newJobIds.push(currHash, otherHash)
        }
        setJobIds(newJobIds)
        changeViewType('DEFAULTVIEW')
      }
      else if (areEqual(jobIds, jobIdsToLook) &&
        layerInfo.glocalAnalysisUpdate &&
        Object.keys(tempData.images).length && Object.keys(tempData.heatmaps).length &&
        filterData.selectedConceptIds.length && layerInfo.experiment && layerInfo.singleLayer &&
        layerInfo.currentAnalysis && layerInfo.method) {

        setJobIdsToLook([])
        setJobIds([])

        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          glocalAnalysisUpdate: false
        }));

        setFilterData((filterData: any) => ({
          ...filterData,
          images: tempData.images,
          heatmaps: tempData.heatmaps
        }));

        changeViewType('DEFAULTVIEW')
      }
      else if (!areEqual(jobIds, jobIdsToLook)) {
        changeViewType('LOADINGVIEW')
      }
    }
  }, [layerInfo, props.socket, filterData.selectedConceptIds, Object.keys(tempData.heatmaps).length, tempData.heatmap, tempData.currentImage, jobIdsToLook.length, jobIds.length, layerInfo.glocalAnalysisUpdate]);


  React.useEffect(() => {
    if (graphData.jobId) {
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
  }, [graphData]);

  const createPlaceholder = () => {
  }


  React.useEffect(() => {
    if (layerInfo.experiment) {
      let currHash = Math.random().toString(36).slice(2)
      setJobIds(jobIds.push(String(currHash)))
      props.socket.emit('get_global_analysis',
        {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "index": layerInfo.index,
          "method": layerInfo.method,
          "target": 0,
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
        /*  layer: experimentLayers[experiment],
         index: 0,
         singleLayer: experimentLayers[experiment][0],
         currentLayerModes: layerModes[experiment][experimentLayers[experiment][0]],
         currentClassIndices: classIndices[experiment],
         maxIndex: maxIndices[experiment] */
      }));
      ///////////

      /* changeLayer(experimentLayers[experiment]);
      setSingleLayer(experimentLayers[experiment][0]);
      changeCurrentLayerModes(layerModes[experiment][experimentLayers[experiment][0]]);
      changeCurrentClassIndices(classIndices[experiment]);
      setMaxIndex(maxIndices[experiment]);
      changeIndex(0); */

    }
  }, [layerInfo.experiment])

  React.useEffect(() => {
    if (props.socket && imgSize && layerInfo.experiment) {
      let currHash = Math.random().toString(36).slice(2)
      setJobIds(jobIds.push(currHash))
      //setJobIds([...jobIds, currHash])
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
      setJobIds(currIds)
      props.socket.emit("vis_heatmap", {
        'index': layerInfo.index,
        "experiment": layerInfo.experiment,
        "target": layerInfo.index,
        "method": layerInfo.method,
        "size": imgSize,
        "job_id": currHash
      })
    }
  }, [layerInfo.index, layerInfo.experiment, layerInfo.method, imgSize, props.socket])

  React.useEffect(() => {
    if (comparingEmit && comparing && Object.values(comparingData.filter_indices).flat().length === 10) {
      for (const [key, value] of Object.entries(comparingData.filter_indices)) {

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
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "list_filter": comparingData.filter_indices[key],
          "size": filterImgSize + 100,
          "sample_indices": "0:" + samplesAmount,
          "mode": comparingData.modes[comparingData.modes.findIndex((mode: any) => mode === key)]
        })
        for (let j = 0; j < comparingData.filter_indices[key].length; j++) {
          props.socket.emit('vis_realistic_heatmaps', {
            "layer": layerInfo.singleLayer,
            "experiment": layerInfo.experiment,
            "filter_index": comparingData.filter_indices[key][j],
            "size": imgSize,
            "sample_indices": "0:" + samplesAmount,
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

  /*   React.useEffect(() => {
      if (props.socket && layerInfo.glocalAnalysisUpdate && layerInfo.method && layerInfo.experiment && layerInfo.target && layerInfo.singleLayer) {
        props.socket.emit('vis_partial_heatmap', {
          "layer": layerInfo.singleLayer,
          "experiment": layerInfo.experiment,
          "image_index": layerInfo.index,
          "method": layerInfo.method,
          "size": filterImgSize + 100,
          "weight_activation": 0,
          "target_class": layerInfo.target
        }
        );
      }
    }, [props.socket, layerInfo.glocalAnalysisUpdate, layerInfo.index, layerInfo.method, layerInfo.experiment, layerInfo.target, layerInfo.singleLayer])
   */

  React.useEffect(() => {
    if (props.socket && layerInfo.experiment && layerInfo.currentAnalysis && filterData.selectedConceptIds.length === 5 && layerInfo.singleLayer && layerInfo.glocalAnalysisUpdate) {
      setLayerInfo((layerInfo: any) => ({
        ...layerInfo,
        glocalAnalysisUpdate: false
      }));


    }
  }, [layerInfo.glocalAnalysisUpdate, layerInfo.experiment, filterData.selectedConceptIds, filterImgSize, props.socket, layerInfo.singleLayer, layerInfo.currentAnalysis])



  /*   React.useEffect(() => {
      if (props.socket && layerInfo.glocalAnalysisUpdate && layerInfo.method && layerInfo.experiment && layerInfo.target && layerInfo.singleLayer) {
        setLayerInfo((layerInfo: any) => ({
          ...layerInfo,
          glocalAnalysisUpdate: false
        }));
   
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
    }, [props.socket, layerInfo.glocalAnalysisUpdate, layerInfo.experiment, layerInfo.method, layerInfo.currentAnalysis, layerInfo.target, layerInfo.singleLayer])
   */

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
    let currHash = Math.random().toString(36).slice(2)
    setJobIds(jobIds.concat(currHash))
    props.socket.emit("get_local_analysis", {
      "layer": layerInfo.singleLayer,
      "experiment": layerInfo.experiment,
      "index": layerInfo.index,
      "target": 0,
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
        partial: {},
        synthetic: {},
        cnn_activations: {},
        position: {}
      }
    }))

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
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      filters: {
        ...layerInfo,
        current_id: Number(value)
      }
    })
    )
    /*     const filterHeatmap = queueries.getSingleHeatmap(experiment, index, target, method, value, singleLayer, imgSize);
        Promise.resolve(filterHeatmap).then(results => {
          setHeatmap('data:image/png;base64,' + results.image)
        }) */
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
    /*   const filterActivation = queueries.getSingleActivation(experiment, index, target, method, value, singleLayer, imgSize);
      Promise.resolve(filterActivation).then(results => {
        setHeatmap('data:image/png;base64,' + results.image)
      }) */
  }


  //calback functions, called from child components
  const addSamples = (value: any) => {
    changeSamplesAmount(samplesAmount + 9)
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      filters: {
        ...layerInfo,
        current_id: Number(value)
      }
    }))
  }

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
          "index": layerInfo.index,
          "method": layerInfo.method,
          "concept_id": value,
          "target": 0,
          "abs_norm": true,
          "parent_c_id": 10,
          "parent_layer": "features.40",
          "job_id": "something funny",
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
      descending: value
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

  const selectedExperiment = (value: string) => {
    setLayerInfo((layerInfo: any) => ({
      ...layerInfo,
      experiment: value,
      layer: layerInfo.layer[value as keyof typeof layerInfo.layer],
      singleLayer: layerInfo.layer[value as keyof typeof layerInfo.layer][0]
    }))
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
        "layer": layerInfo.singleLayer,
        "experiment": layerInfo.experiment,
        "filter_indices": "0:5",
        "descending": layerInfo.descending,
        "image_index": layerInfo.index,
        "method": layerInfo.method,
      },
      "max_activation",
      {
        "size": filterImgSize + 100,
        "sample_indices": "0:9"
      });
    props.socket.emit('get_global_analysis',
      {
        "layer": layerInfo.singleLayer,
        "experiment": layerInfo.experiment,
        "filter_indices": "0:5",
        "descending": layerInfo.descending,
        "image_index": layerInfo.index,
        "method": layerInfo.method,
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
      queueries.setFilterName(layerInfo.experiment, layerInfo.singleLayer, layerInfo.index, value)
    }
  };
  const selectedLayer = (value: any) => {
    console.log(value)
    changeViewType("LOADINGVIEW")
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
            heatmap={layerInfo.heatmap.heatmapImg}
            localAnalysisCallback={localAnalysis}
            index={layerInfo.index}
            classIndices={layerInfo.targets}
            heatmapClasses={layerInfo.heatmap.heatmapClasses}
            heatmapConfidences={layerInfo.heatmap.heatmapConfidences}
            targetCallback={newTarget => setLayerInfo((layerInfo: any) => ({
              ...layerInfo,
              target: newTarget
            }))
            }
          />
        </Grid>

        <FilterComponent
          target={layerInfo.target}
          filterAmount={10}
          viewTypeCallback={viewState}
          filterActivationCallback={getFilterActivation}
          filterHeatmapCallback={getFilterHeatmap}
          orderCallback={selectedOrder}
          viewState={"DASHBOARDVIEW"}
          selectedLayer={layerInfo.singleLayer}
          selectedExperiment={layerInfo.experiment}
          selectedMethod={layerInfo.method}
          layers={layerInfo.layer}
          descending={layerInfo.descending}
          methods={methods}
          models={layerInfo.experiments}
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
          isSynth={currentLayerModes.synthetic}
          isCnn={currentLayerModes.cnn_activation}
          isMaxActivation={currentLayerModes.max_activation}
          isMaxRelevanceTarget={currentLayerModes.max_relevance_target}
          hasRelevanceStats={currentLayerModes.relevance_stats}
          hasActivationStats={currentLayerModes.relevance_stats}
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
            statisticName={layerInfo.currentAnalysis}
            conceptId={layerInfo.filters.current_id} /> : viewType === 'GRAPHVIEW' ?
            <NetworkComponent
              target={layerInfo.target}
              viewState={viewType}
              viewCallback={viewState}
              graph={graphData}
              conceptId={layerInfo.filters.current_id} /> : null
        }
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}
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
            return defaultGrid;
        }
      })()}
    </div>
  );
};

export default XAIBoard;
