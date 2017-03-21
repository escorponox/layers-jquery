import moveForward from './layer-animations'

const labels = Array.from(document.querySelectorAll('.c-layer__label'));

labels.forEach(label => {
  label.addEventListener('click', event => {
    const layer = event.target.parentNode;
    if (!layer.classList.contains('c-layer--selected')) {
      moveForward(layer);
    }
  })
});

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
