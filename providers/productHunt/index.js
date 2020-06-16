const provider = require("./provider")
const formatter = require("./formatter")
const { getFromCache, cachedDataIsValid } = require("../../utils/cache")

const providerDetails = { name: "Product Hunt", id: "ph" }
const fetchTypes = {
  TOP: "top"
}

async function fetchItems({
  numOfItems,
  type = fetchTypes.TOP,
  options = {},
  config
}) {
  let items

  switch (type) {
    case fetchTypes.TOP: {
      const cachedData = getFromCache(
        config,
        providerDetails.id,
        fetchTypes.TOP
      )

      if (cachedData && cachedDataIsValid(cachedData)) {
        stories = cachedData.items
      } else {
        const { data } = await provider.getTop(numOfItems)
        items = data
      }
      break
    }
    default:
      throw new Error(`productHunt item type ${type} is not defined`)
  }

  return items.map(formatter.formatItems)
}

module.exports = {
  fetchItems,
  types: fetchTypes,
  ...providerDetails
}
