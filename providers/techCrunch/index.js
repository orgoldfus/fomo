const { fetchTypes, getStories } = require("./provider")
const formatter = require("./formatter")
const { take } = require("lodash")
const {
  getFromCache,
  cacheProviderResult,
  isCacheDataValid
} = require("../../utils/cache")

const CACHE_TTL_MINUTES = 10
const providerDetails = { name: "TechCrunch", id: "tc" }

async function fetchItems({
  numOfItems,
  type = fetchTypes.TOP,
  options = {},
  config
}) {
  if (!Object.values(fetchTypes).includes(type)) {
    throw new Error(`TechCrunch item type ${type} is not defined`)
  }

  const cachedData = getFromCache(providerDetails.id, type)
  if (isCacheDataValid(cachedData, numOfItems, CACHE_TTL_MINUTES)) {
    return take(cachedData.data.map(formatter.formatStories), numOfItems)
  }

  const stories = await getStories(numOfItems, type)
  cacheProviderResult(providerDetails.id, type, stories)

  return stories.map(formatter.formatStories)
}

module.exports = {
  fetchItems,
  types: fetchTypes,
  ...providerDetails
}
