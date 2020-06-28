const packageJson = require("../package.json")
const Configstore = require("configstore")
const fs = require('fs')

const config = new Configstore(packageJson.name)
if(fs.existsSync(config.path)) {
  fs.unlinkSync(config.path)
}

const cache = new Configstore("fomoapp_cache")
if(fs.existsSync(cache.path)) {
  fs.unlinkSync(cache.path)
}

console.log('Deleted all config files')