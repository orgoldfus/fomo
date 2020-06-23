const { fetchTypes, getProducts } = require("./provider")
const formatter = require("./formatter")
const { take } = require("lodash")
const {
  getFromCache,
  cacheProviderResult,
  isCacheDataValid
} = require("../../utils/cache")

const CACHE_TTL_MINUTES = 10
const providerDetails = { name: "Product Hunt", id: "ph" }

async function fetchItems({
  numOfItems,
  type = fetchTypes.TOP_VOTES,
  options = {},
  config
}) {
  if (!Object.values(fetchTypes).includes(type)) {
    throw new Error(`productHunt item type ${type} is not defined`)
  }

  const cachedData = getFromCache(providerDetails.id, type)
  if (isCacheDataValid(cachedData, numOfItems, CACHE_TTL_MINUTES)) {
    return take(cachedData.data.map(formatter.formatProducts), numOfItems)
  }

  const products = await getProducts(numOfItems, type)
  cacheProviderResult(providerDetails.id, type, products)

  return products.map(formatter.formatProducts)
}

module.exports = {
  fetchItems,
  types: fetchTypes,
  ...providerDetails
}
