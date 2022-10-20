const fs = require('fs')
const CONFIG_FILE = './src/config.json'
let rawdata = fs.readFileSync(CONFIG_FILE);
let config_data = JSON.parse(rawdata);
config_data["repository_url"] = process.env.REPOSITORY_URL
console.log("==========START CONFIG DATA==========")
console.log(config_data)
console.log("===========END CONFIG DATA===========")
let string_data = JSON.stringify(config_data);
fs.writeFileSync(CONFIG_FILE, string_data);
