const fs = require('fs')
const CONFIG_FILE = './src/config.json'
console.log("reading config file")
let rawdata = fs.readFileSync(CONFIG_FILE);
let config_data = JSON.parse(rawdata);
config_data["repository_url"] = process.env.REPOSITORY_URL
console.log("repository_url set to:", process.env.REPOSITORY_URL)
console.log(config_data)
let string_data = JSON.stringify(config_data);
fs.writeFileSync(CONFIG_FILE, string_data);
