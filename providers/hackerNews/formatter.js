const chalk = require("chalk")
const link = require("terminal-link")
const { fallbackLinkFormatter } = require("../../utils/link")

function formatStory(story) {
  return `${link(chalk.green.bold(story.title), story.url, {
    fallback: fallbackLinkFormatter
  })} ${chalk.grey(`(${story.date}, score: ${story.score})`)}`
}

module.exports = {
  formatStory
}
