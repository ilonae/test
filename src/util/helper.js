
const defineFilterImageSize =  (filterAmount) => {
let box = document.getElementsByName('filterCard');
let smallerSide;
if (box[0] !== undefined) {
  let width = box[0].clientWidth;
  let height = box[0].clientHeight;
  if (width < height) {
    smallerSide = width;
  } else {
    smallerSide = height;
  }
}

var filterSize = filterAmount === 2 ? smallerSide : smallerSide / 2;
const imageSize = Math.floor(filterSize / 3);
return imageSize
};

const defineImgs =  () => {

let box = document.getElementsByName('imgCard');
if (box[0] !== undefined) {
var computedStyle = getComputedStyle(box[0]);
let imgWidth = box[0].clientWidth;   // width with padding
imgWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
return imgWidth;
}
  };


var helper = {defineFilterImageSize, defineImgs}
export default helper;