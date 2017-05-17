var envFile = __dirname + '/env.json'
var jsonfile = require('jsonfile')

var envVars = jsonfile.readFileSync(envFile)

module.exports = {
    client_id: envVars["client_id"],
    client_secret: envVars["client_secret"],
    url: envVars["url"],
    title: "Spotify Scraper"
}
