export default (layer, endHeight, duration) => new Promise((resolve, reject) => {
  let start = null;
  const initHeight = layer.offsetHeight;
  layer.classList.remove('c-layer--selected');


  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    layer.style.height = easing(progress, initHeight, endHeight - initHeight, duration);
    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      endAnimation();
    }
  }

  // easeOutCubic - George McGinley Smith - https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
  function easing(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }

  function endAnimation() {
    layer.classList.remove('c-layer--expanded');
    layer.removeAttribute('style');
    resolve(layer);
  }

  window.requestAnimationFrame(step);
});