import styles from '../styles/app.scss'
import documentReady from './document-ready'
import layerAnimations from './layer-animations'
import layerDragAndDrop from './layer-drag-and-drop'
import jQuery from 'jquery'

window.jQuery = window.$ = jQuery

documentReady(layerAnimations, layerDragAndDrop)

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept()
}
