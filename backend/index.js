var express = require('express');
var Client = require('ftp');
var fs = require('fs');
const dotenv = require('dotenv');
const request = require('request');
const url = require('url');
dotenv.config();

const app = express()
const port = 8080

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,   Authorization, x-id, Content-Length, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.listen(port, function(err) {
    if (err) {
      return console.error(err);
   }
});

var c = new Client(); //init ftp client
var connectionProperties = { 
    host: "ftp.nasdaqtrader.com",
};

// Get the most up to date list of the stocks being traded on the Nasdaq
c.on('ready', function() {
  c.get('SymbolDirectory/nasdaqtraded.txt', function(err, stream) {
    if (err) throw err;
    stream.once('close', function() { c.end(); });
    stream.pipe(fs.createWriteStream('stocks.txt'));
    console.log("Successfully recieved NASDAQ file.");
  });
});
// connect to localhost:21 as anonymous
c.connect(connectionProperties);


/* GET home page. */
app.get('/', function(req, res, next) {
  var data = '';
  var err = '';
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type,   Authorization, x-id, Content-Length, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  err, data = fs.readFileSync("stocks.txt", 'utf8')
  if (err) throw err;
  res.send(data);
  res.end();
  next();
});

/* GET fundamentals of a stock */
app.get('/getFundamentals', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  params = {
    "apikey": process.env.API_KEY,
    "symbol": query["symbol"],
    "projection": "fundamental"
  }
  request({url:"https://api.tdameritrade.com/v1/instruments", qs:params}, function(err, response, body) {
    if(err) { console.log(err); res.send(err); res.end(); next(); }
    res.send(body);
    res.end();
    next();
  });
})

/* GET the 1 minute data for a stock for today */
app.get('/getLatestPrice', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var afterHours = query.afterHours;
  if(!afterHours){
    params = {
      "apikey": process.env.API_KEY,
      "startDate": new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()).getTime(),
      "endDate": Date.now(),
      "frequencyType": "minute",
      "frequency": 1
    }
  } else {
    params = {
      "apikey": process.env.API_KEY,
      "startDate": new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()).getTime(),
      "endDate": Date.now(),
      "frequencyType": "minute",
      "frequency": 1,
      "needExtendedHoursData": true
    }
  }
  checkDateParams = {
    "apikey": process.env.API_KEY,
    "date": new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
  }
  request({url: 'https://api.tdameritrade.com/v1/marketdata/EQUITY/hours', qs:checkDateParams}, function(hError, hResponse, hBody){
    let responseJson = JSON.parse(hBody);
    if(hError) { console.log(hError); res.send(hError); res.end(); next(); }
    if(responseJson.equity.equity){
      if(!responseJson.equity.equity.isOpen){
        if(!afterHours){
          params = {
            "apikey": process.env.API_KEY,
            "periodType": "day",
            "period": 1,
            "frequencyType": "minute",
            "frequency": 1
          }
        } else {
          params = {
            "apikey": process.env.API_KEY,
            "periodType": "day",
            "period": 1,
            "frequencyType": "minute",
            "frequency": 1,
            "needExtendedHoursData": true
          }
        }
      }
    }
    else if(responseJson.equity["EQ"]){
      if(!responseJson.equity["EQ"].isOpen){
        if(!afterHours){
          params = {
            "apikey": process.env.API_KEY,
            "periodType": "day",
            "period": 1,
            "frequencyType": "minute",
            "frequency": 1
          }
        } else {
          params = {
            "apikey": process.env.API_KEY,
            "periodType": "day",
            "period": 1,
            "frequencyType": "minute",
            "frequency": 1,
            "needExtendedHoursData": true
          }
        }
      }
    }
    request({url:`https://api.tdameritrade.com/v1/marketdata/${query["symbol"]}/pricehistory`, qs:params}, function(err, response, body) {
      if(err) { console.log(err); res.send(err); res.end(); next(); }
      res.send(body);
      res.end();
      next();
    });
  })
})