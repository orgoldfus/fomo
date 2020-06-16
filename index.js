#!/usr/bin/env node
const { Command } = require("commander")
const packageDetails = require("./package.json")
const providers = require("./providers")
const chalk = require("chalk")
const ora = require("ora")

const availableSources = providers.map(provider => `${provider.id} (${provider.name})`).join(', ')

const program = new Command()
program.version(packageDetails.version)

program
  .option("-i, --interactive", "show the news interactively")
  .option("-c, --configure", "configure fomo")
  .option("-s, --source <id>", `choose a specific news source. Available sources are: ${availableSources}`)

program.parse(process.argv)

if(program.source) {

} else {
  showData()
}

async function showData() {
  for (const provider of providers) {
    const spinner = ora(`Loading ${provider.name}`).start()
    const items = await provider.fetchItems()
    spinner.stop()

    console.log(chalk.black.bgYellow(`${provider.name}:`))

    for (const item of items) {
      console.log(chalk.yellow("●"), item)
    }

    console.log("\n")
  }
}
