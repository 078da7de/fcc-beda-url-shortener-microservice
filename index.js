require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// additional module imports
let bodyParser = require('body-parser');
const dns = require('node:dns');

let urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use('/api/shorturl', bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl', (req, res) => {
  // get hostname by removing https?:// from input url
  let hostname = req.body.url.match(/(?:https?:\/\/)?([^\/]*)/)[1] || "";
  dns.lookup(hostname, (err, addr) => {
    if (err) {
      res.json({error: 'invalid url'});
    } else {
      res.json({
        original_url: req.body.url,
        short_url: urls.push(req.body.url) - 1
      })
    }
  })
})

app.get('/api/shorturl/:url', (req, res) => {
  if (req.params.url >= urls.length) {
    res.json({error: "No short URL found for the given input"});
  } else {
    res.redirect(urls[req.params.url]);
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
