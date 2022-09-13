import React from "react";
import { Container } from "@material-ui/core";

const defineFilterImageSize = (filterAmount: number) => {
  let box = document.getElementById("filterCard");
  let smallerSide;
  if (box !== undefined) {
    let width = box.clientWidth;
    let height = box.clientHeight;
    if (width < height) {
      smallerSide = width;
    } else {
      smallerSide = height;
    }
  }
  var filterSize = filterAmount === 2 ? smallerSide : smallerSide / 2;
  const imageSize = Math.floor(filterSize / 3);
  return imageSize;
};
const createPlaceholderImgs = (nr: number, size: number) => {
  let imgArr = [];
  let dataURL;
  for (let i = 0; i < nr; i++) {
    const canvas = document.createElement('canvas');
    canvas.height = size;
    canvas.width = size;
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

const areSetsEqual = (a: Set<any>, b: Set<any>) => {
  return a.size === b.size && [...a].every(value => b.has(value))
}

const arraysEqual = (array1: any, array2: any) => {
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

const createStatsImgs = (images: any[], imageStyle: string, name: string, containerStyle: string) => {
  let statisticsImages = Array();
  for (let i = 0; i < images.length; i++) {
    const img = `data:image/png;base64,${images[i]}`;
    statisticsImages.push(
      <Container
        className={containerStyle}
        key={`${name}_image_index${i}`}
      >
        <img src={img} className={imageStyle} id={"image"} alt="" />
      </Container>
    );
  }
  return statisticsImages;
};
const normLocalSelection = (x: number, y: number, width: number, height: number, imgSize: number) => {
  const newX = x / imgSize;
  const newY = y / imgSize;
  const newWidth = width / imgSize;
  const newHeight = height / imgSize;
  console.log(newX, newY, newWidth, newHeight);
  return { newX, newY, newWidth, newHeight };
};
const defineImgs = () => {
  let imgBox = document.getElementById("inputsCard");
  if (imgBox !== undefined) {
    var computedStyle = getComputedStyle(imgBox);
    let imgWidth = imgBox.clientWidth;
    imgWidth -=
      parseFloat(computedStyle.paddingLeft) +
      parseFloat(computedStyle.paddingRight);
    return imgWidth;
  }
};
var helper = { areSetsEqual, createStatsImgs, createPlaceholderImgs, defineFilterImageSize, defineImgs, normLocalSelection };
export default helper;
