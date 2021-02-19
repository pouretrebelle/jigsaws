import fs from 'fs'

export const getSketchIds = () =>
  fs
    .readdirSync('sketches', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
