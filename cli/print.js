const chalk = require("chalk")
const ora = require("ora")

async function printItems({ provider, type, numOfItems, config }) {
  const spinner = ora(`Loading ${provider.name}`).start()

  try {
    const items = await provider.fetchItems({ numOfItems, type, config })
    spinner.stop()

    console.log(chalk.black.bgYellow(`${provider.name}:`))

    for (const item of items) {
      console.log(chalk.yellow("●"), item)
    }

    console.log("\n")
  } catch (err) {
    spinner.fail(`Failed fetching from ${provider.name}`)
    console.error(err.message)
  }
}

module.exports = {
  printItems
}
