const Parser = require("rss-parser")
const { pick } = require("lodash")

const BASE_URL = "http://feeds.feedburner.com"
const rssParser = new Parser()
const fetchTypes = {
  TOP: "top",
  STARTUPS: "startups",
  FUNDINGS: "funding",
  MOBILE: "mobile",
  SOCIAL: "social",
  GADGETS: "gear",
  EUROPE: "euro"
}

const typeToPathMap = {
  [fetchTypes.TOP]: "TechCrunch",
  [fetchTypes.STARTUPS]: "TechCrunch/startups",
  [fetchTypes.FUNDINGS]: "TechCrunch/fundings-exits",
  [fetchTypes.MOBILE]: "Mobilecrunch",
  [fetchTypes.SOCIAL]: "TechCrunch/social",
  [fetchTypes.GADGETS]: "crunchgear",
  [fetchTypes.EUROPE]: "Techcrunch/europe"
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
