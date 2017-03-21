export default (layer, endHeight, duration) => {
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
    const ts =(t/=d)*t;
    const tc =ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }

  function endAnimation() {
    layer.classList.remove('c-layer--expanded');
    layer.removeAttribute('style');
  }

  window.requestAnimationFrame(step);
};