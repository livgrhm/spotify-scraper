var express = require('express')
var router = express.Router()

var config = require('../config/config')

/* GET home page. */
router.get('/', function(req, res, next) {
  // Render pug view  
  res.render('index', { title: config.title })
})

module.exports = router;
