import layerAnimations from './layer-animations'
import layerDragAndDrop from './layer-drag-and-drop'

layerAnimations()
layerDragAndDrop()

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept()
}
