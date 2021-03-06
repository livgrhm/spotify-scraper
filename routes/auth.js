// Requires
var express = require('express')
var querystring = require('querystring')
var request = require('request')

// Config Vars
var config = require('../config/config')

// Express Router
var router = express.Router()

// Global Variables
var client_id = config.client_id // Your client id
var client_secret = config.client_secret // Your secret
var redirect_uri = config.url + '/auth/callback' // Redirect URI
var stateKey = 'spotify_auth_state'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text;
};

/* GET /auth (authorise the user for Spotify) */
router.get('/', function(req, res, next) {
    var state = generateRandomString(16)
    res.cookie(stateKey, state)

    // Request Spotify authorisation
    var scope = 'playlist-read-private playlist-read-collaborative user-top-read'
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }))
})

/* GET /auth/callback (what to do with Spotify response) */
router.get('/callback', function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null
    var state = req.query.state || null
    var storedState = req.cookies
        ? req.cookies[stateKey]
        : null

    if (state === null || state !== storedState) {
        res.redirect('/#' + querystring.stringify({error: 'state_mismatch'}))
    } else {
        res.clearCookie(stateKey)
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        }

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                }

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body)
                })

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' + querystring.stringify({access_token: access_token, refresh_token: refresh_token}))
            } else {
                res.redirect('/#' + querystring.stringify({error: 'invalid_token'}))
            }
        })
    }
})

/* GET /auth/refresh_token */
router.get('/refresh_token', function(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    }

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token
            res.send({'access_token': access_token})
        }
    })
})

module.exports = router
