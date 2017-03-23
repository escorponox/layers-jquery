import slide from './slide'

const labels = Array.from(document.querySelectorAll('.c-layer__label'))
const layerContainers = Array.from(document.querySelectorAll('.c-layers'))

const calculateLayerHeight = layer => Array.from(layer.children)
  .reduce((total, curr) => curr.offsetHeight + total, 2)

const calculateContainerHeight = layer => {
  return Array.from(layer.parentNode.querySelectorAll('.c-layer'))
    .reduce((total, curr) => curr === layer
        ? calculateLayerHeight(curr) + total
        : curr.querySelector('.c-layer__label').offsetHeight + 1 + total
      , 0)
}

const animateFrontLayer = layer => slide(layer, 480, 300)
  .then(layer => new Promise((resolve) => {
    setTimeout(() => {
      layer.classList.add('c-layer--hide', 'c-layer--visited')
      resolve(layer)
    }, 200)
  }))
  .then(layer => new Promise((resolve) => {
    const previousLayer = layer.previousElementSibling
    layer.parentNode.insertBefore(layer, layer.parentNode.firstElementChild)
    resolve(previousLayer)
  }))

const animateMiddleLayers = (newFrontLayer, layer) => {
  if (newFrontLayer === layer) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newFrontLayer)
      }, 500)
    })
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      layer.classList.add('c-layer--hide')
      const previousLayer = layer.previousElementSibling
      layer.parentNode.insertBefore(layer, layer.parentNode.firstElementChild)
      resolve(animateMiddleLayers(newFrontLayer, previousLayer))
    }, 500)
  })
}

const moveForward = layer => {
  Array.from(layer.parentNode.querySelectorAll('.c-layer__label'))
    .forEach(label => label.addEventListener('click', moveForwardListener))

  animateFrontLayer(layer.parentNode.lastElementChild)
    .then(animateMiddleLayers.bind(null, layer))
    .then(layer => {
      const frontHeight = calculateLayerHeight(layer)
      const containerHeight = calculateContainerHeight(layer)
      return Promise.all([slide(layer, frontHeight, 500, true), slide(layer.parentNode, containerHeight, 500, true)])
    })
    .then(layers => {
      Array.from(layers[0].parentNode.querySelectorAll('.c-layer--hide'))
        .forEach(hiddenLayer => hiddenLayer.classList.remove('c-layer--hide'))
      return layer
    })
    .then(layer => {
      Array.from(layer.parentNode.querySelectorAll('.c-layer__label'))
        .forEach(label => label.addEventListener('click', moveForwardListener))
    })
}

const moveForwardListener = event => {
  const layer = event.target.parentNode
  if (!layer.classList.contains('c-layer--selected')) {
    moveForward(layer)
  }
}

export default () => {
  labels.forEach(label => label.addEventListener('click', moveForwardListener))
  layerContainers.forEach(layerContainer => {
    const selected = layerContainer.querySelector('.c-layer--selected')
    selected.style.height = calculateLayerHeight(selected)
    layerContainer.style.height = calculateContainerHeight(selected)
  })
}