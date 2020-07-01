const Configstore = require("configstore")
const { get } = require("lodash")

const cache = new Configstore("fomoapp_cache")

function cacheResult(sourceId, type, data) {
  const key = `${sourceId}.${type}`
  const cachedData = { cachedAt: Date.now(), data }
  return cache.set(key, cachedData)
}

function getFromCache(sourceId, type) {
  const key = `${sourceId}.${type}`
  return cache.get(key)
}

function clearCache(sourceId, type) {
  let key = '';
  if (sourceId) {
    key = sourceId

    if (type) {
      key += `.${type}`
    }
  }

  return key ? cache.delete(key) : cache.clear()
}

function isCacheDataValid(
  cacheResult,
  minItemsCount = 1,
  cacheTTLMinutes = 15
) {
  if (!cacheResult) return false

  const cachedAt = new Date(cacheResult.cachedAt)
  const latestValidDate = new Date()
  latestValidDate.setMinutes(latestValidDate.getMinutes() - cacheTTLMinutes)

  return (
    get(cacheResult, "data.length", 0) >= minItemsCount &&
    cachedAt > latestValidDate
  )
}

module.exports = {
  cacheResult,
  getFromCache,
  isCacheDataValid,
  clearCache
}
