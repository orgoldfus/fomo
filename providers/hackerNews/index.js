const provider = require("./provider")
const formatter = require("./formatter")
const fetchTypes = {
  BEST: "best"
}

async function fetchItems(
  numOfItems = 10,
  type = fetchTypes.BEST,
  options = {}
) {
  let stories

  switch (type) {
    case fetchTypes.BEST: {
      stories = await provider.getBestStories(numOfItems)
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
  name: 'Hacker News',
  id: 'hn'
}
