export const isOutOfLayers = (element) => element.classList.contains('c-layers')
|| !Array.from(element.classList).some(elementClass => elementClass.match(/^c-layer/))

export const isNextSibling = (element, sibling) => {
  let nextElement = element.nextElementSibling
  while (nextElement !== null && nextElement !== sibling) {
    nextElement = nextElement.nextElementSibling
  }
  return nextElement !== null
}

export const isPreviousSibling = (element, sibling) => {
  let previousElement = element.previousElementSibling
  while (previousElement !== null && previousElement !== sibling) {
    previousElement = previousElement.previousElementSibling
  }
  return previousElement !== null
}

export const calculateLayerHeight = $layer => {
  const contentHeight = $layer.children().toArray()
    .reduce((total, curr) => curr.offsetHeight + total, 2)
  return contentHeight < 480 ? 480 : contentHeight
}

export const calculateContainerHeight = $layer => $layer.siblings().toArray()
  .reduce((total, curr) => curr.querySelector('.c-layer__header').offsetHeight + total
    , calculateLayerHeight($layer))

export const slide = ($layer, endHeight, duration, down = false) => new Promise((resolve, reject) => {
  let start = null
  const initHeight = $layer.css('height')

  function step (timestamp) {
    if (!start) start = timestamp
    const progress = timestamp - start
    const newHeight = down
      ? easingDown(progress, initHeight, endHeight - initHeight, duration)
      : easing(progress, initHeight, endHeight - initHeight, duration)
    $layer.css('height', newHeight)
    if (progress < duration) {
      window.requestAnimationFrame(step)
    } else {
      endAnimation()
    }
  }

  // easeOutCubic - George McGinley Smith - https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
  function easing (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b
  }

  function easingDown (t, b, c, d) {
    return c * (t /= d) * t * t + b
  }

  function endAnimation () {
    $layer.css('height', endHeight)
    resolve($layer)
  }

  window.requestAnimationFrame(step)
})