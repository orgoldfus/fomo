#!/usr/bin/env node
const { Command } = require("commander")
const Configstore = require("configstore")
const packageJson = require("./package.json")
const availableSources = require("./sources")
const {
  printItems,
  clearCache,
  showInteractiveConfig,
  listAllSources
} = require("./cli")

const config = new Configstore(packageJson.name, {
  defaultItemsCount: 5,
  defaultSources: availableSources.map((source) => source.id)
})
const program = new Command()
program.version(packageJson.version)

program
  .option("-c, --config", "open configuration menu (interactive)")
  .option("-d, --clear-cache", "clear source cache")
  .option("-l, --limit <number>", "limit the number of responses per source")
  .option("-s, --source <source id>", "choose a specific news source")
  .option(
    "-p, --list-all",
    "Print the list of all existing sources and their available types"
  )
  .option(
    "-t, --type <source type>",
    "choose a specific type for the selected source"
  )

program.parse(process.argv)
const options = program.opts();

const numOfItems = parseInt(options.limit) || config.get("defaultItemsCount")

if (options.clearCache) handleClearCache()
else if (options.listAll) handleListSources()
else if (options.config) showInteractiveConfig(config)
else if (options.source) handleSpecificSource()
else if (options.type) handleTypeWithoutSource()
else handleDefault()

function handleDefault() {
  const defaultSources = config.get("defaultSources")
  const requiredSources = availableSources.filter((source) =>
    defaultSources.includes(source.id)
  )

  for (const source of requiredSources) {
    printItems({ source, numOfItems, config })
  }
}

function handleSpecificSource() {
  const requiredSource = availableSources.find(
    (source) => source.id === options.source
  )
  printItems({
    source: requiredSource,
    type: options.type,
    numOfItems,
    config
  })
}

function handleClearCache() {
  const source =
  options.source &&
    availableSources.find((source) => source.id === options.source)
  clearCache(source, options.type)
}

function handleTypeWithoutSource() {
  console.log(`
  You must provide a source in order to select a type.
  Try using the '-s' flag to select a specific source.
  `)
}

function handleListSources() {
  if(options.source && !sourceIsValid(options.source)) {
    console.log(`Source '${options.source}' does not exist`)
  } else {
    listAllSources(options.source)
  }
}

function sourceIsValid(sourceId) {
  const requiredSource = availableSources.find(
    (source) => source.id === sourceId
  )

  return !!requiredSource
}