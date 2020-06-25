const Parser = require("rss-parser")
const { pick } = require("lodash")
const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../utils/link")

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

function formatStory(item) {
  return `${link(chalk.green.bold(item.title), item.link, {
    fallback: fallbackLinkFormatter
  })} ${chalk.white(`- ${item.contentSnippet}`)} ${chalk.grey(
    `(${item.isoDate}, by ${item.creator})`
  )}`
}

module.exports = {
  fetchTypes,
  defaultFetchType: fetchTypes.TOP,
  details: { name: "Wired", id: "wired" },
  getItems: getStories,
  formatter: formatStory,
  defaultCacheTTL: 10
}
