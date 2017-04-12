import * as utils from './layer-utils'

const $layers = $('.c-layer')
const $layerDragIcons = $('.c-layer__icon-drag')

let $draggedLayer = undefined

const safeTransition = ($layer) => {
  $layer.off('mouseleave')
  $layer.off('mouseenter')
  setTimeout(() => {
    $layer.on('mouseleave', mouseLeave)
    $layer.on('mouseenter', mouseEnter)
  }, 100)
}

const mouseLeave = event => {
  if ($draggedLayer && event.buttons === 1) {
    $draggedLayer.finish()
    const enteringElement = event.relatedTarget

    if (utils.isOutOfLayers(enteringElement)) {
      $draggedLayer.insertBefore($draggedLayer.siblings().first())
      $draggedLayer.addClass('c-layer--drop')
    }
  }
}

const mouseEnter = event => {
  if ($draggedLayer && event.buttons === 1) {
    const target = event.delegateTarget
    if (target !== $draggedLayer && utils.isNextSibling($draggedLayer, target)) {
      safeTransition($(target))
      $draggedLayer.insertAfter(target)
      $draggedLayer.addClass('c-layer--drop')
    }
    if (target !== $draggedLayer && utils.isPreviousSibling($draggedLayer.prev(), target)) {
      safeTransition($(target))
      $draggedLayer.insertBefore(target.nextElementSibling)
      $draggedLayer.addClass('c-layer--drop')
    }
  }
}

const dropLayer = () => {
  if ($draggedLayer) {
    const $container = $draggedLayer.parent()
    const $newFrontLayer = $container.children().last()
    const frontHeight = utils.calculateLayerHeight($newFrontLayer)
    const containerHeight = utils.calculateContainerHeight($newFrontLayer)

    $(document.body).removeClass('h-layer--body-grabbing')
    $draggedLayer.removeClass('c-layer--dragging')
    $newFrontLayer.addClass('c-layer--selected')

    $container.animate({
      height: containerHeight + 'px',
    }, {
      duration: 500,
    })
    $newFrontLayer.animate({
      height: frontHeight + 'px',
    }, {
      duration: 500,
      start: function () {
        $(this).addClass('c-layer--selected')
      }
    })

    $draggedLayer.removeClass('c-layer--drop')
    $draggedLayer = undefined
  }
}

const pickLabel = event => {
  event.preventDefault()
  $draggedLayer = $(event.target).parent().parent()
  $($draggedLayer).addClass('c-layer--dragging')
}

const pickLayer = event => {
  $(document.body).addClass('h-layer--body-grabbing')
  event.preventDefault()
  event.stopPropagation()
  $(event.delegateTarget).parent().children().last().animate({
    height: '480px',
  }, {
    duration: 300,
    start: function () {
      $(this).removeClass('c-layer--selected')
      $(this).addClass('c-layer--visited')
    }
  })
}

export default () => {
  $layerDragIcons.on('dragstart', pickLabel)

  $layers.on('dragstart', '.c-layer__icon-drag', pickLayer)
  $layers.on('mouseleave', mouseLeave)
  $layers.on('mouseenter', mouseEnter)

  $(window).on('mouseup', dropLayer)
}
