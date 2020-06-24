const Parser = require("rss-parser")
const { pick } = require("lodash")

const BASE_URL = "https://www.reddit.com/r"
const rssParser = new Parser()
const fetchTypes = {
  WEBDEV: "webdev",
  TECH: "tech",
  PROGRAMMING: "prog",
  FRONTEND: "fed",
  JAVASCRIPT: "js"
}

const typeToPathMap = {
  [fetchTypes.WEBDEV]: "webdev/.rss",
  [fetchTypes.TECH]: "technology/.rss",
  [fetchTypes.PROGRAMMING]: "programming/.rss",
  [fetchTypes.FRONTEND]: "Frontend/.rss",
  [fetchTypes.JAVASCRIPT]: "javascript/.rss"
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
        "author",
        "contentSnippet"
      ])
    )

  return stories
}

module.exports = {
  getStories,
  fetchTypes
}
