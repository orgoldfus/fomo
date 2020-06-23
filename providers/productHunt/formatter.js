const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../../utils/link")

function formatProducts(item) {
  return `${link(chalk.green.bold(item.name), item.website, {
    fallback: fallbackLinkFormatter
  })} ${chalk.white(`- ${item.description}`)} ${chalk.grey(
    `(votes: ${item.votesCount})`
  )}`
}

module.exports = {
  formatProducts
}
