const { buildSourceObject } = require("../utils/source")

const sources = [
  require("./hackerNews"),
  require("./productHunt"),
  require("./techCrunch"),
  require("./theVerge"),
  require("./reddit"),
  require("./wired")
].map(buildSourceObject)

module.exports = sources
