const { fetchTypes, getStories } = require("./provider")
const formatter = require("./formatter")
const { take } = require("lodash")
const {
  getFromCache,
  cacheProviderResult,
  isCacheDataValid
} = require("../../utils/cache")

const CACHE_TTL_MINUTES = 10
const providerDetails = { name: "Hacker News", id: "hn" }

async function fetchItems({
  numOfItems,
  type = fetchTypes.BEST,
  options = {},
  config
}) {
  if (!Object.values(fetchTypes).includes(type)) {
    throw new Error(`hackerNews item type ${type} is not defined`)
  }

  const cachedData = getFromCache(providerDetails.id, type)
  if (isCacheDataValid(cachedData, numOfItems, CACHE_TTL_MINUTES)) {
    return take(cachedData.data.map(formatter.formatStory), numOfItems)
  }

  const stories = await getStories(numOfItems, type)
  cacheProviderResult(providerDetails.id, type, stories)

  return stories.map(formatter.formatStory)
}

module.exports = {
  fetchItems,
  types: fetchTypes,
  ...providerDetails
}
