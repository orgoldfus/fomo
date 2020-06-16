function getFromCache(config, providerId, type) {
  const key = `cache.${providerId}.${type}`
  return config.get(key)
}

function cachedDataIsValid(data) {
  return true
}

module.exports = {
  getFromCache,
  cachedDataIsValid
}