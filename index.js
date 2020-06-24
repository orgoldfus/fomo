#!/usr/bin/env node
const { Command } = require("commander")
const Configstore = require("configstore")
const packageJson = require("./package.json")
const availableProviders = require("./providers")
const { printItems, clearCache } = require("./cli")

const config = new Configstore(packageJson.name, { default_items_limit: 5 })
const program = new Command()

program.version(packageJson.version)

program
  // .option("-i, --interactive", "show the news interactively")
  // .option("-c, --configure", "configure fomo")
  .option("-l, --limit <number>", "limit the number of responses per source")
  .option("-s, --source <source id>", "choose a specific news source")
  .option(
    "-t, --type <source type>",
    "choose a specific type for the selected source"
  )
  .option("-cc, --clear-cache", "clear provider cache")

program.parse(process.argv)

const numOfItems = parseInt(program.limit) || config.get("default_items_limit")

if (program.clearCache) {
  const provider =
    program.source &&
    availableProviders.find((provider) => provider.id === program.source)
  clearCache(provider, program.type)
} else if (program.source) {
  const requiredProvider = availableProviders.find(
    (provider) => provider.id === program.source
  )
  printItems({
    provider: requiredProvider,
    type: program.type,
    numOfItems,
    config
  })
} else {
  for (const provider of availableProviders) {
    printItems({ provider, numOfItems, config })
  }
}
