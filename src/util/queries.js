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
  size,
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
      size,
      mask_id: maskId
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

/* const getSingleHeatmap = React.useCallback(async () => {
  await fetch('/api/get_heatmap_filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      experiment: experiment,
      image_index: index,
      method: method,
      filter_index: 1
    })
  }).then(response => {
    if (response.ok) {
      response.json().then(json => {
        console.log(json);
      });
    }
  });
}, [index, method, experiment]); */

export default {
  getLocalAnalysis,
  getImg,
  getHeatmap,
  getSettings,
  getFilter,
  getWatershed
};
