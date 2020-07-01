const Parser = require("rss-parser")
const { pick } = require("lodash")
const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../utils/link")

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

function formatStory(item) {
  return `${link(chalk.green.bold(item.title), item.link, {
    fallback: fallbackLinkFormatter
  })} ${chalk.grey(`(${item.isoDate}, by ${item.author})`)}`
}

module.exports = {
  fetchTypes,
  defaultFetchType: fetchTypes.WEBDEV,
  details: { name: "Reddit", id: "reddit" },
  getItems: getStories,
  formatter: formatStory,
  defaultCacheTTL: 10
}