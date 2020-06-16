const provider = require("./provider")
const formatter = require("./formatter")
const fetchTypes = {
  TOP: "top"
}

async function fetchItems(
  numOfItems = 10,
  type = fetchTypes.TOP,
  options = {}
) {
  let items

  switch (type) {
    case fetchTypes.TOP: {
      const { data } = await provider.getTop(numOfItems)
      items = data
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
  name: 'Product Hunt',
  id: 'ph'
}
