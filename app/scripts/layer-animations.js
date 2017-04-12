import { calculateLayerHeight, calculateContainerHeight } from './layer-utils'

const $layers = $('.c-layer')
const $layerContainers = $('.c-layers')

const staggeredBackwards = $backwardsLayers => {

  const previousLayer = $backwardsLayers.first().prev()
  return previousLayer.length
    ? $.Deferred(deferred => {
      $backwardsLayers.insertBefore(previousLayer)
      setTimeout(() => {
        deferred.resolve(staggeredBackwards($backwardsLayers))
      }, 200)
    })
    : $backwardsLayers.promise()
}

const moveForward = $layer => {
  $layers.off('click')
  $layer.parent().children().last().animate({
    height: '480px',
  }, {
    duration: 300,
    start: function () {
      $(this).removeClass('c-layer--selected')
      $(this).addClass('c-layer--visited')
    },
    complete: function () {

      const $backwardsLayers = $layer.nextAll()
      const blLength = $backwardsLayers.length

      $.Deferred(deferred => {
        $($backwardsLayers.get().reverse()).each((index, layer) => {
          setTimeout(() => {
            $(layer).addClass('c-layer--hide')
            if (index === blLength - 1) {
              setTimeout(() => {
                deferred.resolve($backwardsLayers)
              }, 150)
            }
          }, 150 * index)
        })
      })
        .then(staggeredBackwards)
        .then($bLayers => {
          $($bLayers.get().reverse()).each((index, layer) => {
            setTimeout(() => {
              $(layer).removeClass('c-layer--hide')
            }, 200 * index)
          })

          const $container = $layer.parent()
          const frontHeight = calculateLayerHeight($layer)
          const containerHeight = calculateContainerHeight($layer)

          $layer.addClass('c-layer--selected')

          $container.animate({
            height: containerHeight + 'px',
          }, {
            duration: 500,
          })
          $layer.animate({
            height: frontHeight + 'px',
          }, {
            duration: 500,
            start: function () {
              $(this).addClass('c-layer--selected')
            },
            complete: () => {
              $layers.on('click', moveForwardListener)
            }
          })

        })

    }
  })
}

const moveForwardListener = event => {
  const $layer = $(event.currentTarget)
  if (!$layer.hasClass('c-layer--selected')) {
    moveForward($layer)
  }
}

export default () => {
  $layers.on('click', moveForwardListener)
  $layerContainers.each((index, container) => {
    const $selected = $(container).find('.c-layer--selected')
    $selected.css('height', calculateLayerHeight($selected))
    $(container).css('height', calculateContainerHeight($selected))
  })
}