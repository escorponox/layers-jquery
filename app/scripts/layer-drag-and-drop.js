import * as utils from './layer-utils'

const layers = Array.from(document.querySelectorAll('.c-layer'))
const layerLabels = Array.from(document.querySelectorAll('.c-layer__label'))
const layerContainers = Array.from(document.querySelectorAll('.c-layers'))

let draggedLayer = undefined

const safeTransition = (layer) => {
  layer.removeEventListener('mouseleave', mouseLeave)
  layer.removeEventListener('mouseenter', mouseEnter)
  setTimeout(() => {
    layer.addEventListener('mouseleave', mouseLeave)
    layer.addEventListener('mouseenter', mouseEnter)
  }, 200)
}

const mouseLeave = event => {
  if (draggedLayer && event.buttons === 1) {
    const leavingLayer = event.target
    const enteringElement = event.relatedTarget

    if (utils.isAncestor(leavingLayer, enteringElement)) {
      console.log('arriba', event.target, event.relatedTarget)
      leavingLayer.parentNode.insertBefore(draggedLayer, draggedLayer.parentNode.firstElementChild)
      draggedLayer.classList.add('c-layer--drop')
    }
  }
}

const mouseEnter = event => {
  if (draggedLayer && event.buttons === 1) {
    const target = event.target
    console.log('enter', event.target, event.relatedTarget)
    if (target !== draggedLayer && utils.isNextSibling(draggedLayer, target)) {
      safeTransition(target)
      target.parentNode.insertBefore(draggedLayer, target.nextElementSibling)
      draggedLayer.classList.add('c-layer--drop')
    }
    if (target !== draggedLayer && utils.isPreviousSibling(draggedLayer.previousElementSibling, target)) {
      safeTransition(target)
      target.parentNode.insertBefore(draggedLayer, target.nextElementSibling)
      draggedLayer.classList.add('c-layer--drop')
    }
  }
}

const dropLayer = () => {
  if (draggedLayer) {
    const container = draggedLayer.parentNode
    const newFrontLayer = container.lastElementChild
    const frontHeight = utils.calculateLayerHeight(newFrontLayer)
    const containerHeight = utils.calculateContainerHeight(newFrontLayer)

    document.body.classList.remove('grabbing')
    draggedLayer.classList.remove('c-layer--dragging')
    newFrontLayer.classList.add('c-layer--selected')
    utils.slide(newFrontLayer, frontHeight, 500, true)
    utils.slide(container, containerHeight, 500, true)

    draggedLayer.draggable = false
    draggedLayer.classList.remove('c-layer--drop')
    draggedLayer = undefined
  }
}

const pickLabel = event => {
  event.preventDefault()
  draggedLayer = event.target.parentNode
  draggedLayer.draggable = true
  draggedLayer.classList.add('c-layer--dragging')
}

const pickLayer = event => {
  event.preventDefault()
  event.stopPropagation()
  document.body.classList.add('grabbing')
  utils.slide(event.currentTarget.parentNode.lastElementChild, 480, 300)
    .then(layer => {
      layer.classList.remove('c-layer--selected')
      layer.classList.add('c-layer--visited')
    })
  event.dataTransfer.dropEffect = 'move'
}

export default () => {
  layerLabels.forEach(label => label.addEventListener('dragstart', pickLabel))
  layers.forEach(layer => {
    layer.addEventListener('dragstart', pickLayer)
    layer.addEventListener('mouseleave', mouseLeave)
    layer.addEventListener('mouseenter', mouseEnter)
  })

  window.addEventListener('mouseup', dropLayer)
}
