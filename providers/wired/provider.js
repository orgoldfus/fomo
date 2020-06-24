const Parser = require("rss-parser")
const { pick } = require("lodash")

const BASE_URL = "https://www.wired.com/feed"
const rssParser = new Parser()
const fetchTypes = {
  TOP: "top",
  SCIENCE: "science",
  BUSINESS: "business",
  GEAR: "gear"
}

const typeToPathMap = {
  [fetchTypes.TOP]: "rss",
  [fetchTypes.SCIENCE]: "category/science/latest/rss",
  [fetchTypes.BUSINESS]: "category/business/latest/rss",
  [fetchTypes.GEAR]: "category/gear/latest/rss"
}

async function getStories(numOfStories, type) {
  const path = typeToPathMap[type]
  const feed = await rssParser.parseURL(`${BASE_URL}/${path}`)
  const stories = feed.items
    .slice(0, numOfStories)
    .map((item) =>
      pick(item, [
        "title",
        "link",
        "isoDate",
        "creator",
        "contentSnippet",
        "categories"
      ])
    )

  return stories
}

module.exports = {
  getStories,
  fetchTypes
}
