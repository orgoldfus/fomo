#!/usr/bin/env node
const { Command } = require("commander")
const Configstore = require("configstore")
const packageJson = require("./package.json")
const availableProviders = require("./providers")
const chalk = require("chalk")
const ora = require("ora")

const DEFAULT_LIMIT = 10

const config = new Configstore(packageJson.name)
const program = new Command()

const availableSources = availableProviders
  .map((provider) => `${provider.id} (${provider.name})`)
  .join(", ")

program.version(packageJson.version)

program
  // .option("-i, --interactive", "show the news interactively")
  // .option("-c, --configure", "configure fomo")
  .option("-l, --limit <number>", "limit the number of responses per source")
  .option(
    "-s, --source <source id>",
    `choose a specific news source. Available sources are: ${availableSources}`
  )

program.parse(process.argv)

const numOfItems = parseInt(program.limit) || DEFAULT_LIMIT

if (program.source) {
  const requiredProviders = availableProviders.filter(
    (provider) => provider.id === program.source
  )
  showData(requiredProviders, numOfItems, config)
} else {
  showData(availableProviders, numOfItems, config)
}

async function showData(providers, numOfItems, config) {
  for (const provider of providers) {
    const spinner = ora(`Loading ${provider.name}`).start()

    try {
      const items = await provider.fetchItems({ numOfItems, config })
      spinner.stop()

      console.log(chalk.black.bgYellow(`${provider.name}:`))

      for (const item of items) {
        console.log(chalk.yellow("●"), item)
      }

      console.log("\n")
    } catch (err) {
      spinner.fail(`Failed fetching from ${provider.name}`)
    }
  }
}
