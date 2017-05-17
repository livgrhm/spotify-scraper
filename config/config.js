var config = {}

// development
var env = process.env.NODE_ENV || 'development'

console.log(`DEBUG: NODE_ENV=${env}`)

if (env === 'development') {
    config = require('./env/development')
} else if (env === 'test') {
    config = require('./env/test')
} else if (env === 'production') {
    config = require('./env/production')
}

module.exports = config;
