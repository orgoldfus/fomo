const Configstore = require("configstore")

const cache = new Configstore("fomoapp_cache")

function cacheProviderResult(providerId, type, data) {
  const key = `${providerId}.${type}`
  const cachedData = { cachedAt: Date.now(), data }
  return cache.set(key, cachedData)
}

function getFromCache(providerId, type) {
  const key = `${providerId}.${type}`
  return cache.get(key)
}

function isCacheDataValid(cacheResult, cacheTTLMinutes = 15) {
  if (!cacheResult) return false

  const cachedAt = new Date(cacheResult.cachedAt)
  const latestValidDate = new Date()
  latestValidDate.setMinutes(latestValidDate.getMinutes() - cacheTTLMinutes)

  return cachedAt > latestValidDate
}

module.exports = {
  cacheProviderResult,
  getFromCache,
  isCacheDataValid
}
