const provider = require("./provider")
const formatter = require("./formatter")
const { getFromCache, cachedDataIsValid } = require("../../utils/cache")

const providerDetails = { name: "Hacker News", id: "hn" }
const fetchTypes = {
  BEST: "best"
}

async function fetchItems({
  numOfItems,
  type = fetchTypes.BEST,
  options = {},
  config
}) {
  let stories

  switch (type) {
    case fetchTypes.BEST: {
      const cachedData = getFromCache(
        config,
        providerDetails.id,
        fetchTypes.BEST
      )
      stories =
        cachedData && cachedDataIsValid(cachedData)
          ? cachedData.items
          : await provider.getBestStories(numOfItems)
      break
    }
    default:
      throw new Error(`hackerNews item type ${type} is not defined`)
  }

  return stories.map(formatter.formatStory)
}

module.exports = {
  fetchItems,
  types: fetchTypes,
  ...providerDetails
}
