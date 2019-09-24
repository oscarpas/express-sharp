const sharp = require('sharp')

const cropDimensions = (width, height, maxSize) => {
  if (width <= maxSize && height <= maxSize) return {width: width, height: height}
  const aspectRatio = width / height
  if (width > height) return {width: maxSize, height: Math.round(maxSize / aspectRatio)}
  return {width: maxSize * aspectRatio, height: maxSize}
}

module.exports = (image, {
  width,
  height,
  crop = false,
  cropMaxSize,
  gravity = sharp.gravity.center,
  format = sharp.format.jpeg.id,
  progressive = true,
  quality = 80,
} = {}) => {
  const transformer = sharp(image)

  // Make sure the format is supported, fall back to jpeg
  const outputFormat = sharp.format[format] ? sharp.format[format].id : sharp.format.jpeg.id;

  if (crop) {
    transformer.resize({...cropDimensions(width, height, cropMaxSize), ...{position: gravity}})
  } else {
    transformer.resize({width: width, height: height, withoutEnlargement: true})
  }

  return transformer[outputFormat]({quality, progressive}).toBuffer()
}
