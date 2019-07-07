export const formatVersion = (version) => version.toString().padStart(3, '0')

export const getDesignExportFilename = (store) =>
  `${store.settings.sketch}_${formatVersion(
    store.designVersion
  )}_${store.designNoiseSeeds.join('-')}.png`

export const getCutExportFilename = (store) =>
  `${store.settings.sketch}_${formatVersion(
    store.cutVersion
  )}_${store.cutNoiseSeeds.join('-')}.svg`
