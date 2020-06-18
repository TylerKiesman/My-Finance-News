import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

var http = require('http');

const equities = {};

http.get('http://localhost:8080', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    const splitString = data.split(/\r?\n/);
    var i = 0;
    for(i = 0; i < splitString.length; i++){
      var info = splitString[i].split(/\|/).slice(1,3);
      equities[info[0]] = info[1];
    }
    ReactDOM.render(
      <React.StrictMode>
        <App equitiesList={equities}/>
      </React.StrictMode>,
      document.getElementById('root')
    );
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
