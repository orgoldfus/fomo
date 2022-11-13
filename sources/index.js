const { buildSourceObject } = require("../utils/source")
const { loadExternalSources } = require("../utils/externalSource")

const externalRssSources = loadExternalSources()

const sources = [
  require("./hackerNews"),
  require("./productHunt"),
  require("./techCrunch"),
  require("./theVerge"),
  require("./reddit"),
  require("./wired"),
  ...externalRssSources
].map(buildSourceObject)

module.exports = sources
