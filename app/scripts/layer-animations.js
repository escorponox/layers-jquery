import slideUp from './slide-up'

const slideAndmoveBackwards = layer => {
  const container = layer.parentNode;

  slideUp(layer, 480, 200);
  setTimeout(() => {
    layer.classList.add('c-layer--hide');
  }, 200);
  setTimeout(() => {
    container.insertBefore(layer, container.firstElementChild);
  }, 400);
  setTimeout(() => {
    layer.classList.remove('c-layer--hide');
  }, 500);
  return layer;
};

const moveBackwards = layer => {
  const container = layer.parentNode;
  layer.classList.add('c-layer--hide');
  setTimeout(() => {
    container.insertBefore(layer, container.firstElementChild);
  }, 200);
  setTimeout(() => {
    layer.classList.remove('c-layer--hide');
  }, 300);
  return layer;
};

export default layer => {

  const layersToHide = [];

  let nextLayer = layer.nextElementSibling;
  while (nextLayer !== null) {
    layersToHide.push(nextLayer);
    nextLayer = nextLayer.nextElementSibling;
  }

  layersToHide.reverse().forEach((layerToHide, index) => {
    setTimeout(() => {
      console.log(layerToHide);
      index === 0 ? slideAndmoveBackwards(layerToHide) : moveBackwards(layerToHide);
    }, index * 300);
  });

  setTimeout(() => {
    layer.classList.add('c-layer--expanded', 'c-layer--selected');
  }, 400 * layersToHide.length);

};