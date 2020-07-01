const chalk = require("chalk")
const ora = require("ora")

async function printItems({ source, type, numOfItems, config }) {
  const spinner = ora(`Loading ${source.name}`).start()

  try {
    const items = await source.fetchItems({ numOfItems, type, config })
    spinner.stop()

    console.log(
      chalk.black.bgYellow(`${source.name}${type ? ` (${type})` : ""}:`)
    )

    for (const item of items) {
      console.log(chalk.yellow("●"), item)
    }

    console.log("\n")
  } catch (err) {
    spinner.fail(`Failed fetching from ${source.name}`)
    console.error(err.message)
  }
}

module.exports = {
  printItems
}
