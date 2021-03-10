import { useState, useEffect } from 'react';

const getLocalAnalysis = async (x, y, width, height) => {
  await fetch('/api/local_analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      x,
      y,
      width,
      height,
      layer: 'l1',
      filter_indices: `${0}:${2}`,
      sorting: 'max',
      sample_indices: '0:9',
      experiment: 'LeNet',
      image_index: 0,
      method: 'epsilon_plus'
    })
  }).then(response => {
    if (response.ok) {
      response.json().then(json => {
        console.log(json);
      });
    }
  });
};

const getImg = async (index, experiment) => {
  return await fetch('/api/get_image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_index: index, experiment })
  }).then(async response => {
    const json = await response.json();
    const obj = JSON.parse(json);
    const img = `data:image/png;base64,${obj.image}`;
    return img;
  });
};

const getHeatmap = async (index, experiment, method) => {
  return await fetch('/api/get_heatmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_index: index,
      experiment,
      method
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
    const values = {
      experiments,
      methods,
      layers
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
  method
) => {
  return await fetch('/api/get_filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      layer: layer,
      filter_indices: `${0}:${filterAmount}`,
      sorting: order,
      sample_indices: '0:9',
      experiment: experiment,
      image_index: index,
      method: method
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

export default { getLocalAnalysis, getImg, getHeatmap, getSettings, getFilter };
