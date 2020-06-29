const { buildProviderObject } = require("../utils/provider")

const providers = [
  require("./hackerNews"),
  require("./productHunt"),
  require("./techCrunch"),
  require("./theVerge"),
  require("./reddit"),
  require("./wired")
].map(buildProviderObject)

module.exports = providers
