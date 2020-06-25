const prompts = require("prompts")
const providers = require("../providers")

const MAIN_OPTIONS = [
  {
    description: "The number of items that will be displayed for each source",
    title: "Change the default number of items",
    value: "defaultItemsCount"
  },
  {
    title: "Change the default sources",
    description: "The sources that would be displayed by default",
    value: "defaultProviders"
  },
  {
    title: "Reset configuration",
    description: "Reset configuration to the default values",
    value: "resetConfig"
  },
  {
    title: "Exit",
    value: "exit"
  }
]

async function showInteractiveConfig(config) {
  let shouldExit = false

  do {
    const response = await prompts(
      {
        type: "select",
        name: "value",
        message: "What would you like to do?",
        choices: MAIN_OPTIONS,
        initial: 0
      },
      { onCancel: () => (shouldExit = true) }
    )

    switch (response.value) {
      case "defaultItemsCount": {
        await handleItemsCountConfig(config)
        break
      }
      case "defaultProviders": {
        await handleDefaultProvidersConfig(config)
        break
      }
      case "resetConfig": {
        await handleResetConfig(config)
        shouldExit = true
        break
      }
      case "exit": {
        shouldExit = true
        break
      }
      default:
        break
    }
  } while (!shouldExit)
}

async function handleItemsCountConfig(config) {
  let isCanceled = false
  const response = await prompts(
    {
      type: "number",
      name: "value",
      message: "How many items would you like to see for each source?",
      initial: config.get("defaultItemsCount"),
      min: 1,
      max: 50
    },
    { onCancel: () => (isCanceled = true) }
  )

  if (!isCanceled) {
    config.set("defaultItemsCount", response.value)
  }
}

async function handleDefaultProvidersConfig(config) {
  const selectedSources = config.get("defaultProviders") || []
  const sources = providers.map((provider) => ({
    title: provider.name,
    value: provider.id,
    selected: selectedSources.includes(provider.id)
  }))

  let isCanceled = false
  const response = await prompts(
    {
      type: "autocompleteMultiselect",
      name: "value",
      message: "Default providers",
      choices: sources,
      min: 1
    },
    { onCancel: () => (isCanceled = true) }
  )

  if (!isCanceled) {
    config.set("defaultProviders", response.value)
  }
}

async function handleResetConfig(config) {
  let isCanceled = false

  const response = await prompts(
    {
      type: "confirm",
      name: "value",
      message: "Are you sure you want to reset the configuration?",
      initial: false
    },
    { onCancel: () => (isCanceled = true) }
  )

  if (!isCanceled && response.value === true) {
    config.clear()
  }
}

module.exports = {
  showInteractiveConfig
}
