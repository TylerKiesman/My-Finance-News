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
      if(i == 0){
        continue;
      }
      const fields = splitString[i].split(/\|/);
      const symbol = fields[1];
      const name = fields[2];
      if(name && symbol){
        if(fields[7] != 'Y' && !symbol.includes('$') && !name.toLowerCase().includes('- warrant') && !name.toLowerCase().includes('- unit')
         && !name.toLowerCase().includes('- right') && !name.toLowerCase().includes('preferred') && !name.toLowerCase().includes('series') 
         && !name.toLowerCase().includes('%')){
          equities[symbol] = name.replace(/ - .*/, "");
        }
      }
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

serviceWorker.unregister();
