
import socketIOClient from "socket.io-client";
var headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

const getLocalAnalysis = async (
  x,
  y,
  target,
  width,
  height,
  order,
  selectedLayer,
  experiment,
  index,
  method,
  filterAmount,
  imageSize,
  maskId = -1

) => {
  return await fetch('/api/local_analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      x,
      y,
      width,
      height,
      target_class: target,
      layer: selectedLayer,
      filter_indices: `${0}:${filterAmount}`,
      sorting: order,
      sample_indices: '0:9',
      experiment: experiment,
      image_index: index,
      method: method,
      mask_id: maskId,
      size: imageSize
    })
  }).then(async response => {
    const json = await response.json();
    const localAnalysisObj = JSON.parse(json);
    return localAnalysisObj;
  });
};

const getImg = async (index, experiment, size) => {
  return await fetch('/api/get_image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_index: index, experiment, size })
  }).then(async response => {

    const json = await response.json();
    const obj = JSON.parse(json);
    console.log(obj);
    const img = `data:image/png;base64,${obj.image}`;
    const target = obj.ground_truth;
    return { img, target };
  });
};


const checkJWT = async () => {
  const { token } = sessionStorage;
  const socket = socketIOClient('http://localhost:5000');

  socket.on('connect', function () {
    console.log("client")
    socket.emit('authenticate', { token }); //send the jwt
  });
  /*   return await fetch('/', {
      method: 'GET',
      mode: 'same-origin',
      redirect: 'follow',
      credentials: 'include', // Don't forget to specify this if you need cookies
    }).then(async response => {
      console.log(response)
      return response.status
    }) */
};

const getHeatmap = async (index, experiment, method, size, target) => {
  return await fetch('/api/get_heatmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      experiment,
      image_index: index,
      method,
      size,
      target_class: target,
      N_pred: 0
    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    const heatmap = `data:image/png;base64,${obj.image}`;
    const imgIndex = obj.image_index;
    const classes = obj.pred_classes;
    const confidences = obj.pred_confidences;
    const values = {
      heatmap,
      imgIndex,
      classes,
      confidences
    };
    return values;
  });
};

const getAttributionGraph = async (imageIndex, experiment, target, method, size, layer, filterIndex, mode) => {
  return await fetch('/api/get_attribution_graph', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      experiment,
      image_index: imageIndex,
      target_class: target,
      method,
      layer,
      filter_index: filterIndex,
      size,
      view_prev: 1,
      mode
    })
  }).then(async response => {
    console.log(response)
    const json = await response.json();
    const obj = JSON.parse(json);
    return (obj);
  });
};

const getStatistics = async (imageIndex, experiment, layer, filterIndex, sorting, mode) => {
  return await fetch('/api/statistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      layer,
      experiment,
      filter_index: filterIndex,
      sorting,
      image_index: imageIndex,
      sample_indices: "0:9",
      stats_mode: mode
    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    return (obj);
  });
};

const getSettings = async () => {
  return await fetch('/api/get_XAI_available', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    const experiments = obj.experiments;
    const methods = obj.methods;
    const layers = obj.layers;
    const classIndices = obj.class_to_indices;
    const maxIndices = obj.max_index;
    const layerModes = obj.layer_modes;

    const values = {
      experiments,
      methods,
      layers,
      maxIndices,
      classIndices,
      layerModes
    };
    return values;
  });
};

const getLocalSegments = async (index, experiment, size, method, target) => {
  return await fetch('/api/get_local_segments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_index: index,
      experiment,
      size,
      method,
      target_class: target
    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    return obj;
  });
};

const getFilter = async (
  samples,
  layer,
  target,
  filterAmount,
  order,
  experiment,
  index,
  method,
  size,
  mode = undefined

) => {

  const defQuery = JSON.stringify({
    layer: layer,
    filter_indices: `${0}:${filterAmount}`,
    sorting: order,
    target_class: target,
    sample_indices: `${0}:${samples}`,
    experiment: experiment,
    image_index: index,
    method: method,
    size,
    mode
  });
  return await fetch('/api/global_analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: defQuery
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    console.log(obj)
    return obj;
  });
};

const setFilterName = async (experiment, layer, index, name) => {
  return await fetch('/api/edit_filter_name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      experiment,
      layer,
      filter_index: index,
      concept_name: name
    })
  })
};

const getWatershed = async (imageIndex, method, experiment, size) => {
  return await fetch('/api/watershed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_index: imageIndex,
      method: method,
      experiment: experiment,
      size
    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    return obj;
  });
};

const getSingleHeatmap = async (experiment, index, target, method, filterIndex, layer, imageSize) => {
  return await fetch('/api/heatmap_single_filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_index: index,
      experiment: experiment,
      target_class: target,
      size: imageSize,
      method: method,
      layer: layer,
      filter_index: filterIndex,
      weight_activations: 0

    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    return obj;
  });
};

const getSingleActivation = async (experiment, index, target, method, filterIndex, layer, imageSize) => {
  return await fetch('/api/heatmap_single_filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_index: index,
      experiment: experiment,
      target_class: target,
      size: imageSize,
      method: method,
      layer: layer,
      filter_index: filterIndex,
      weight_activations: 1

    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    return obj;
  });
};

const queries = {
  getLocalAnalysis,
  getImg,
  getHeatmap,
  getSettings,
  getFilter,
  getWatershed,
  getAttributionGraph,
  getStatistics,
  getSingleActivation,
  getSingleHeatmap,
  checkJWT,
  getLocalSegments,
  setFilterName
};

export default queries;
