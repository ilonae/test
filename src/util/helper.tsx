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
    let imgWidth = imgBox.clientWidth; // width with padding
    imgWidth -=
      parseFloat(computedStyle.paddingLeft) +
      parseFloat(computedStyle.paddingRight);
    return imgWidth;
  }
};
var helper = { defineFilterImageSize, defineImgs, normLocalSelection };
export default helper;
