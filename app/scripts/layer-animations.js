import slide from './slide'

const layers = Array.from(document.querySelectorAll('.c-layer'))
const layerContainers = Array.from(document.querySelectorAll('.c-layers'))

const calculateLayerHeight = layer => {
  const contentHeight = Array.from(layer.children)
    .reduce((total, curr) => curr.offsetHeight + total, 2)
  return contentHeight < 480 ? 480 : contentHeight
}

const calculateContainerHeight = layer => Array.from(layer.parentNode.querySelectorAll('.c-layer'))
  .reduce((total, curr) => curr === layer
      ? calculateLayerHeight(curr) + total
      : curr.querySelector('.c-layer__label').offsetHeight + 1 + total
    , 0)

const staggeredBackwards = (backwardsLayers, previousLayer) => {

  previousLayer = previousLayer || backwardsLayers[backwardsLayers.length - 1].previousElementSibling
  return previousLayer !== null
    ? new Promise((resolve) => {
      backwardsLayers.forEach((bLayer, index) => {
        index === 0
          ? bLayer.parentNode.insertBefore(bLayer, previousLayer)
          : bLayer.parentNode.insertBefore(bLayer, backwardsLayers[index - 1])
      })
      setTimeout(() => {
        resolve(staggeredBackwards(backwardsLayers, backwardsLayers[backwardsLayers.length - 1].previousElementSibling))
      }, 300)
    })
    : Promise.resolve(backwardsLayers)
}

const animateFrontLayers = layer => slide(layer.parentNode.lastElementChild, 480, 300)
  .then(oldFrontLayer => new Promise((resolve) => {
    oldFrontLayer.classList.add('c-layer--visited')
    oldFrontLayer.classList.remove('c-layer--selected')
    const backwardsLayers = [oldFrontLayer]
    let previousLayer = oldFrontLayer.previousElementSibling
    while (previousLayer !== layer) {
      backwardsLayers.push(previousLayer)
      previousLayer = previousLayer.previousElementSibling
    }
    setTimeout(() => {
      resolve(backwardsLayers)
    }, 150)
  }))
  .then(backwardsLayers => Promise.all(backwardsLayers.map((blayer, index) => {
    return new Promise(resolve => {
      setTimeout(() => {
        blayer.classList.add('c-layer--hide')
        resolve(blayer)
      }, 150 * index)
    })
  })))
  .then(data => new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, 150)
  }))
  .then(backwardsLayers => new Promise((resolve) => {
    layer.classList.add('c-layer--selected')
    resolve(layer)
    staggeredBackwards(backwardsLayers, layer)
      .then(backwardsLayers => backwardsLayers.forEach((blayer, index) => {
        setTimeout(() => {
          blayer.classList.remove('c-layer--hide')
        }, 200 * (index + 1))
      }))
  }))

const animateNewFrontLayer = layer => {
  const frontHeight = calculateLayerHeight(layer)
  const containerHeight = calculateContainerHeight(layer)
  return Promise.all([slide(layer, frontHeight, 500, true), slide(layer.parentNode, containerHeight, 500, true)])
}

const moveForward = layer => {
  Array.from(layer.parentNode.querySelectorAll('.c-layer__label'))
    .forEach(label => label.removeEventListener('click', moveForwardListener))

  animateFrontLayers(layer)
    .then(animateNewFrontLayer)
    .then(layers => {
      Array.from(layers[1].querySelectorAll('.c-layer'))
        .forEach(label => label.addEventListener('click', moveForwardListener))
    })
}

const moveForwardListener = event => {
  const layer = event.currentTarget
  if (!layer.classList.contains('c-layer--selected')) {
    moveForward(layer)
  }
}

export default () => {
  layers.forEach(layer => layer.addEventListener('click', moveForwardListener))
  layerContainers.forEach(layerContainer => {
    const selected = layerContainer.querySelector('.c-layer--selected')
    selected.style.height = calculateLayerHeight(selected)
    layerContainer.style.height = calculateContainerHeight(selected)
  })
}