const Configstore = require("configstore")

const cache = new Configstore("fomoapp_cache")

function cacheProviderResult(config, providerId, type, data) {
  const key = `${providerId}.${type}`
  const cachedData = { cachedAt: Date.now(), data }
  return cache.set(key, cachedData)
}

function getFromCache(config, providerId, type) {
  const key = `${providerId}.${type}`
  return cache.get(key)
}

module.exports = {
  cacheProviderResult,
  getFromCache
}
