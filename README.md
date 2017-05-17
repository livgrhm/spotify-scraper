# Spotify Scraper

## Installation

1. Clone/download repo
2. Run `npm install`
3. Add Spotify client key &amp; secret in new json file in `config/env/env.json`
```json
{
    "client_id": "YOUR_KEY_HERE",
    "client_secret": "YOUR_SECRET_HERE",
    "url": "http://localhost:3000"
}
```
4. Setup environment {development/production/test}
```
$ export NODE_ENV="development"
```
(defaults to development)

## Running the app

1. Run `DEBUG=spotify-scraper:* npm start`
2. Then load `http://localhost:3000/` in your browser to access the app.

## Endpoints


## Links

1. [Express Generator](https://expressjs.com/en/starter/generator.html)
