const fs = require('fs')
const path = require('path')

const walk = (
  dir,
  done
) => {
  let results = []
  fs.readdir(dir, (err, list) => {
    if (err) return done(err, [])
    let pending = list.length
    if (!pending) return done(null, results)
    list.forEach((file) => {
      file = path.resolve(dir, file)
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          results.push(file)
          if (!--pending) done(null, results)
        }
      })
    })
  })
}

const copyImages = () => {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
    if (!fs.existsSync('public/sketches')) {
      fs.mkdirSync('public/sketches');
    }
  }

  walk('sketches', async (err, files) => {
    if (err) return console.error(err)

    const imageFiles = files.filter((file) => file.match(/\.(jpg|png|svg)$/))

    imageFiles.forEach(file => {
      const fileName = file.split('\\').pop()
      fs.copyFileSync(file, path.resolve('public/sketches', fileName))
    })

    console.info(`Copied ${imageFiles.length} images to public/sketches`)
  })
}

copyImages()
