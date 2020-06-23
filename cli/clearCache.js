const cacheUtil = require("../utils/cache")

function clearCache(provider, type) {
  let providerId, providerType

  if (provider) {
    providerId = provider.id

    if (type && Object.values(provider.types).includes(type)) {
      providerType = type
    }
  }

  cacheUtil.clearCache(providerId, type)
  console.log(
    `Cleared cache ${
      providerId
        ? `for provider '${provider.name}' ${type ? `and type '${type}'` : ""}`
        : ""
    }`
  )
}

module.exports = {
  clearCache
}
