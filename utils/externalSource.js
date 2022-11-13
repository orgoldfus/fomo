const fs = require("fs")
const path = require("path")
const Parser = require("rss-parser")
const { pick } = require("lodash")
const chalk = require("chalk")
const link = require("terminal-link")
const Configstore = require("configstore")
const packageJson = require("../package.json")
const { fallbackLinkFormatter } = require("../utils/link")

const config = new Configstore(packageJson.name)
const rssParser = new Parser()

function buildSourceFunctions(rssSourceDetails) {
  const getItems = async (numOfStories, type) => {
    const path = rssSourceDetails.fetchTypes[type]
    const feed = await rssParser.parseURL(`${rssSourceDetails.baseUrl}/${path}`)
    const stories = feed.items
      .slice(0, numOfStories)
      .map((item) => pick(item, Object.values(rssSourceDetails.fieldsMapping)))

    return stories
  }

  const formatter = (item) => {
    const { fieldsMapping } = rssSourceDetails

    const summary = item[fieldsMapping.summary]
      ? chalk.white(` - ${item[fieldsMapping.summary]}`)
      : ""
    const metadata =
      item[fieldsMapping.date] || item[fieldsMapping.author]
        ? ` ${chalk.grey(
            `(${
              item[fieldsMapping.date] ? `${item[fieldsMapping.date]}, ` : ""
            }${item[fieldsMapping.author] ? `by ${item.creator}` : ""})`
          )}`
        : ""

    return `${link(
      chalk.green.bold(item[fieldsMapping.title]),
      item[fieldsMapping.link],
      {
        fallback: fallbackLinkFormatter
      }
    )}${summary}${metadata}`
  }

  return {
    getItems,
    formatter
  }
}

function loadExternalSources() {
  const externalRssFolderPath = config.get("userDefinedRSSDir")

  if (!externalRssFolderPath) return []

  const jsonsInDir = fs
    .readdirSync(externalRssFolderPath)
    .filter((file) => path.extname(file) === ".json")

  return jsonsInDir.map((file) => {
    const fileData = fs.readFileSync(path.join(externalRssFolderPath, file))
    const sourceDefinition = JSON.parse(fileData.toString())

    const fetchTypesList = Object.keys(sourceDefinition.fetchTypes)
    const fetchTypes = fetchTypesList.reduce(
      (acc, currType) => ({ ...acc, [currType.toUpperCase()]: currType }),
      {}
    )

    return {
      ...buildSourceFunctions(sourceDefinition),
      fetchTypes,
      defaultFetchType: sourceDefinition.defaultFetchType || fetchTypesList[0],
      details: sourceDefinition.details,
      defaultCacheTTL: sourceDefinition.defaultCacheTTL || 10
    }
  })
}

module.exports = {
  loadExternalSources
}
