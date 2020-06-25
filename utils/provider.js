const { take } = require("lodash")
const {
  getFromCache,
  cacheProviderResult,
  isCacheDataValid
} = require("./cache")

function buildProviderObject({
  fetchTypes,
  defaultFetchType,
  details,
  getItems,
  formatter,
  defaultCacheTTL
}) {
  const fetchItems = async ({
    numOfItems,
    type = defaultFetchType,
    options = {},
    config
  }) => {
    if (!Object.values(fetchTypes).includes(type)) {
      throw new Error(`${details.name} item type '${type}' is not defined`)
    }

    const cachedData = getFromCache(details.id, type)
    if (isCacheDataValid(cachedData, numOfItems, defaultCacheTTL)) {
      return take(cachedData.data.map(formatter), numOfItems)
    }

    const items = await getItems(numOfItems, type)
    cacheProviderResult(details.id, type, items)

    return items.map(formatter)
  }

  return {
    fetchItems,
    types: fetchTypes,
    ...details
  }
}

module.exports = {
  buildProviderObject
}
