export const isOutOfLayers = (element) => element.classList.contains('c-layers')
|| !Array.from(element.classList).some(elementClass => elementClass.match(/^c-layer/))

export const isNextSibling = ($element, sibling) => $element.nextAll().is(sibling)

export const isPreviousSibling = ($element, sibling) => $element.prevAll().is(sibling)

export const calculateLayerHeight = $layer => {
  const contentHeight = $layer.children().toArray()
    .reduce((total, curr) => curr.offsetHeight + total, 2)
  return contentHeight < 480 ? 480 : contentHeight
}

export const calculateContainerHeight = $layer => $layer.siblings().toArray()
  .reduce((total, curr) => curr.querySelector('.c-layer__header').offsetHeight + total
    , calculateLayerHeight($layer))