import slideUp from './slide-up';

const labels = Array.from(document.querySelectorAll('.c-layer__label'));
const layerContainers = Array.from(document.querySelectorAll('.c-layers'));

const calculateLayerHeight = layer => Array.from(layer.children)
  .reduce((total, curr) => curr.offsetHeight + total, 2);

const calculateContainerHeight = container => Array.from(container.querySelectorAll('.c-layer'))
  .reduce((total, curr) => curr.classList.contains('c-layer--selected')
      ? calculateLayerHeight(curr) + total
      : curr.querySelector('.c-layer__label').offsetHeight + 1 + total
    , 0);

const animateFrontLayer = layer => slideUp(layer, 480, 300)
  .then(layer => new Promise((resolve) => {
    layer.classList.add('c-layer--hide');
    setTimeout(() => resolve(layer), 200)
  }))
  .then(layer => new Promise((resolve) => {
    const previousLayer = layer.previousElementSibling;
    layer.parentNode.insertBefore(layer, layer.parentNode.firstElementChild);
    resolve(previousLayer);
  }));

const animateMiddleLayers = (newFrontLayer, layer) => {
  if (newFrontLayer === layer) {
    return newFrontLayer;
  }

  return new Promise((resolve) => {
    layer.classList.add('c-layer--hide');
    setTimeout(() => {
      const previousLayer = layer.previousElementSibling;
      layer.parentNode.insertBefore(layer, layer.parentNode.firstElementChild);
      resolve(animateMiddleLayers(newFrontLayer, previousLayer));
    }, 200);
  });
};

const showFrontLayer = layer => {

};

const moveForward = layer => {
  Array.from(layer.parentNode.querySelectorAll('.c-layer__label'))
    .forEach(label => label.addEventListener('click', moveForwardListener));

  animateFrontLayer(layer.parentNode.lastElementChild)
    .then(animateMiddleLayers.bind(null, layer))
    .then(layer => {
      layer.classList.add('c-layer--selected');
      layer.style.height = calculateLayerHeight(layer);
      layer.parentNode.style.height = calculateContainerHeight(layer.parentNode);
      return layer
    })
    .then(layer => {
      Array.from(layer.parentNode.querySelectorAll('.c-layer--hide'))
        .forEach(hiddenLayer => hiddenLayer.classList.remove('c-layer--hide'));
      return layer;
    })
    .then(layer => {
      Array.from(layer.parentNode.querySelectorAll('.c-layer__label'))
        .forEach(label => label.addEventListener('click', moveForwardListener));
    });
};

const moveForwardListener = event => {
  const layer = event.target.parentNode;
  if (!layer.classList.contains('c-layer--selected')) {
    moveForward(layer);
  }
};

export default () => {
  labels.forEach(label => label.addEventListener('click', moveForwardListener));
  layerContainers.forEach( layerContainer => {
    layerContainer.style.height = calculateContainerHeight(layerContainer);
    const selected = layerContainer.querySelector('.c-layer--selected');
    selected.style.height = calculateLayerHeight(selected);
  })
}