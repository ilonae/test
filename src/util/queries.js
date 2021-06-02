const getLocalAnalysis = async (
  x,
  y,
  width,
  height,
  order,
  selectedLayer,
  experiment,
  index,
  method,
  filterAmount,
  imageSize,
  maskId

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
      layer: selectedLayer,
      filter_indices: `${0}:${filterAmount}`,
      sorting: order,
      sample_indices: '0:9',
      experiment: experiment,
      image_index: index,
      method: method,
      mask_id: -1,
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
    const img = `data:image/png;base64,${obj.image}`;
    return img;
  });
};

const getHeatmap = async (index, experiment, method, size) => {
  return await fetch('/api/get_heatmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      experiment,
      image_index: index,
      method,
      size
    })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    const heatmap = `data:image/png;base64,${obj.image}`;
    return heatmap;
  });
};

const getAttributionGraph = async (imageIndex, experiment, method, size, layer, filterIndex) => {
  return await fetch('/api/attribution_graph', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      experiment,
      image_index: imageIndex,
      method,
      layer,
      filter_index: filterIndex,
      size,
      view_prev: 1
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
    const cnnLayers = obj.cnn_layers;
    const values = {
      experiments,
      methods,
      layers,
      cnnLayers
    };
    return values;
  });
};

const getFilter = async (
  layer,
  filterAmount,
  order,
  experiment,
  index,
  method,
  size,
  isCnn = undefined
) => {
  const cnnQuery = JSON.stringify({
    layer: layer,
    filter_indices: `${0}:${filterAmount}`,
    sorting: order,
    sample_indices: '0:9',
    experiment: experiment,
    image_index: index,
    method: method,
    size,
    cnn_activation: isCnn
  });
  const defQuery = JSON.stringify({
    layer: layer,
    filter_indices: `${0}:${filterAmount}`,
    sorting: order,
    sample_indices: '0:9',
    experiment: experiment,
    image_index: index,
    method: method,
    size
  });
  return await fetch('/api/global_analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: isCnn !== undefined ? cnnQuery : defQuery
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    return obj;
  });
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

const getSingleHeatmap = async (experiment, index, method, filterIndex, layer) => {
  return await fetch('/api/heatmap_single_filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_index: index,
      experiment: experiment,
      size: 20,
      image_index: index,
      method: method,
      layer: layer,
      filter_index: filterIndex,

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
  getSingleHeatmap
};

export default queries;
