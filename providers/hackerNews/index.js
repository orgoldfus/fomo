const { fetchTypes, getStories } = require("./provider")
const formatter = require("./formatter")
const { getFromCache, cacheProviderResult } = require("../../utils/cache")

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

  const cachedData = getFromCache(config, providerDetails.id, type)
  if (_isCacheDataValid(cachedData)) {
    return cachedData.data.map(formatter.formatStory)
  }

  const stories = await getStories(numOfItems, type)
  cacheProviderResult(config, providerDetails.id, type, stories)

  return stories.map(formatter.formatStory)
}

function _isCacheDataValid(cacheResult) {
  if (!cacheResult) return false

  const cachedAt = new Date(cacheResult.cachedAt)
  const latestValidDate = new Date()
  latestValidDate.setMinutes(latestValidDate.getMinutes() - CACHE_TTL_MINUTES)

  return cachedAt > latestValidDate
}

module.exports = {
  fetchItems,
  types: fetchTypes,
  ...providerDetails
}
