export const formatVersion = (version) => version.toString().padStart(3, '0')

const formatDesignMeta = (store) =>
  `${formatVersion(store.designVersion)}_${store.designNoiseSeeds.join('-')}`

const formatCutMeta = (store) =>
  `${formatVersion(store.cutVersion)}_${store.cutNoiseSeeds.join('-')}`

export const getDesignExportFilename = (store) =>
  `${store.settings.sketch}_${formatDesignMeta(store)}.png`

export const getCutExportFilename = (store) =>
  `${store.settings.sketch}_${formatCutMeta(store)}.svg`

export const getCanvasExportFilename = (store) =>
  `${store.settings.sketch}_${formatDesignMeta(store)}_${formatCutMeta(
    store
  )}.png`
