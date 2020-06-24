const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../../utils/link")

function formatStories(item) {
  return `${link(chalk.green.bold(item.title), item.link, {
    fallback: fallbackLinkFormatter
  })} ${chalk.grey(`(${item.isoDate}, by ${item.author})`)}`
}

module.exports = {
  formatStories
}
