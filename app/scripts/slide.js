export default (layer, endHeight, duration, down = false) => new Promise((resolve, reject) => {
  let start = null
  const initHeight = layer.offsetHeight
  if (layer.classList.contains('c-layer')) {
    down ? layer.classList.add('c-layer--selected') : layer.classList.remove('c-layer--selected')
  }

  function step (timestamp) {
    if (!start) start = timestamp
    const progress = timestamp - start
    layer.style.height = down
      ? easingDown(progress, initHeight, endHeight - initHeight, duration)
      : easing(progress, initHeight, endHeight - initHeight, duration)
    // const contentHeight = Array.from(layer.children)
    //   .reduce((total, curr) => curr.offsetHeight + total, 2)
    // console.log(layer, layer.offsetHeight, contentHeight)
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
    layer.style.height = endHeight;
    resolve(layer)
  }

  window.requestAnimationFrame(step)
})