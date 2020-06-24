const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../../utils/link")

function formatStories(item) {
  return `${link(chalk.green.bold(item.title), item.link, {
    fallback: fallbackLinkFormatter
  })} ${chalk.white(`- ${item.contentSnippet}`)} ${chalk.grey(
    `(${item.isoDate}, by ${item.creator})`
  )}`
}

module.exports = {
  formatStories
}
