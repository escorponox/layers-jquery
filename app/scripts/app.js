import documentReady from './document-ready'
import layerAnimations from './layer-animations'
import layerDragAndDrop from './layer-drag-and-drop'

documentReady(layerAnimations)
documentReady(layerDragAndDrop)

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept()
}
