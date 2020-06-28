const Parser = require("rss-parser")
const { pick } = require("lodash")
const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../utils/link")

const BASE_URL = "https://www.theverge.com"
const rssParser = new Parser()
const fetchTypes = {
  FULL: "full",
  SOFTWARE: "sw",
  CULTURE: "culture",
  MOBILE: "mobile",
  WEB: "web",
  BREAKING: "breaking"
}

const typeToPathMap = {
  [fetchTypes.FULL]: "rss/index.xml",
  [fetchTypes.SOFTWARE]: "apps/rss/index.xml",
  [fetchTypes.CULTURE]: "culture/rss/index.xml",
  [fetchTypes.MOBILE]: "mobile/rss/index.xml",
  [fetchTypes.WEB]: "web/rss/index.xml",
  [fetchTypes.BREAKING]: "rss/breaking/index.xml"
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

function formatStory(item) {
  return `${link(chalk.green.bold(item.title), item.link, {
    fallback: fallbackLinkFormatter
  })} ${chalk.grey(
    `(${item.isoDate}, by ${item.author})`
  )}`
}

module.exports = {
  fetchTypes,
  defaultFetchType: fetchTypes.FULL,
  details: { name: "The Verge", id: "verge" },
  getItems: getStories,
  formatter: formatStory,
  defaultCacheTTL: 10
}
