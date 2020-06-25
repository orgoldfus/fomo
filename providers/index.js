const path = require("path")
const fs = require("fs")
const basename = path.basename(__filename)
const { buildProviderObject } = require("../utils/provider")

const providers = fs
  .readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith('.js'))
  .map((file) => {
    const provider = require(`${__dirname}/${file}`)
    return buildProviderObject(provider)
  })

module.exports = providers
