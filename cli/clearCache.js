const cacheUtil = require("../utils/cache")

function clearCache(source, type) {
  let sourceId, sourceType

  if (source) {
    sourceId = source.id

    if (type && Object.values(source.types).includes(type)) {
      sourceType = type
    }
  }

  cacheUtil.clearCache(sourceId, type)
  console.log(
    `Cleared cache ${
      sourceId
        ? `for source '${source.name}' ${type ? `and type '${type}'` : ""}`
        : ""
    }`
  )
}

module.exports = {
  clearCache
}
