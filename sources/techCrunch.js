const Parser = require("rss-parser")
const { pick } = require("lodash")
const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../utils/link")

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

function formatStory(item) {
  const content = item.contentSnippet 
    ? `${item.contentSnippet.split('.')[0]}.` 
    : "";

  return `${link(chalk.green.bold(item.title), item.link, {
    fallback: fallbackLinkFormatter
  })} ${chalk.white(`- ${content}`)} ${chalk.grey(
    `(${item.isoDate}, by ${item.creator})`
  )}`
}

module.exports = {
  fetchTypes,
  defaultFetchType: fetchTypes.TOP,
  details: { name: "TechCrunch", id: "tc" },
  getItems: getStories,
  formatter: formatStory,
  defaultCacheTTL: 10
}
