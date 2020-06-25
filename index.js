#!/usr/bin/env node
const { Command } = require("commander")
const Configstore = require("configstore")
const packageJson = require("./package.json")
const availableProviders = require("./providers")
const { printItems, clearCache, showInteractiveConfig } = require("./cli")

const config = new Configstore(packageJson.name, {
  defaultItemsCount: 5,
  defaultProviders: availableProviders.map((provider) => provider.id)
})
const program = new Command()
program.version(packageJson.version)

program
  .option("-c, --config", "open configuration menu (interactive)")
  .option("--clear-cache", "clear source cache")
  .option("-l, --limit <number>", "limit the number of responses per source")
  .option("-s, --source <source id>", "choose a specific news source")
  .option(
    "-t, --type <source type>",
    "choose a specific type for the selected source"
  )

program.parse(process.argv)

const numOfItems = parseInt(program.limit) || config.get("defaultItemsCount")

if (program.clearCache) handleClearCache()
else if (program.config) showInteractiveConfig(config)
else if (program.source) handleSpecificSource()
else handleDefault()

function handleDefault() {
  const defaultProviders = config.get("defaultProviders")
  const requiredProviders = availableProviders.filter((provider) =>
    defaultProviders.includes(provider.id)
  )

  for (const provider of requiredProviders) {
    printItems({ provider, numOfItems, config })
  }
}

function handleSpecificSource() {
  const requiredProvider = availableProviders.find(
    (provider) => provider.id === program.source
  )
  printItems({
    provider: requiredProvider,
    type: program.type,
    numOfItems,
    config
  })
}

function handleClearCache() {
  const provider =
    program.source &&
    availableProviders.find((provider) => provider.id === program.source)
  clearCache(provider, program.type)
}
