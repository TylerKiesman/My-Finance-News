var express = require('express');
var Client = require('ftp');
var fs = require('fs');

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

// var c = new Client(); //init ftp client
// var connectionProperties = { 
//     host: "ftp.nasdaqtrader.com",
// };

// c.on('ready', function() {
//   c.get('SymbolDirectory/nasdaqtraded.txt', function(err, stream) {
//     if (err) throw err;
//     stream.once('close', function() { c.end(); });
//     stream.pipe(fs.createWriteStream('stocks.txt'));
//   });
// });
// // connect to localhost:21 as anonymous
// c.connect(connectionProperties);


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

