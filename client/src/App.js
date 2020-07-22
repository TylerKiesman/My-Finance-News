import React, {useState} from 'react';
import './App.css';
import { makeStyles, withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import matchSorter from 'match-sorter';
import Loader from 'react-loader-spinner';
import createPlotlyComponent from "react-plotly.js/factory";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

var Plotly = require('plotly.js-basic-dist');

var http = require('http');

const searchTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#274472',
      main: '#274472',
      dark: '#274472',
      contrastText: '#fff',
    },
    secondary: {
      light: '#5885af',
      main: '#5885af',
      dark: '#5885af',
      contrastText: '#000',
    },
  },
});


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    background: '#274472'
  },
  input: {
    align: 'center',
    width: '50%',
  },
  whiteBackground: {
    backgroundColor: theme.palette.common.white,
  }
}));

// Get random values from an array
function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function TopBar(props) {
  const classes = useStyles();
  var searchList = [];
  for(var symbol in props.equitiesList){
    searchList.push(symbol + " " + props.equitiesList[symbol]);
  }
  const filterEquities = (options, { inputValue }) => {
    if(inputValue == ""){
      return getRandom(options, 4);
    }
    return matchSorter(options, inputValue).slice(0, 4);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar >
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <HomeIcon />
          </IconButton>
          <form className={classes.root} noValidate autoComplete="off">
            <ThemeProvider theme={searchTheme}>
            <Autocomplete
              disableClearable
              filterOptions={filterEquities}
              autoHighlight={true}
              options={searchList}
              renderOption={(option, { inputValue }) => {
                var symbolAndName = option.split(/ (.+)/);
        
                return (
                  <div>
                    <b>{symbolAndName[0]}</b><span> {symbolAndName[1]}</span>
                  </div>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.input}
                  color="secondary"
                  id="outlined-full-width"
                  placeholder="Search"
                  margin="normal"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps, 
                    type: 'search',
                    className: classes.whiteBackground
                  }}
                />
              )}
            />
            </ThemeProvider>
        </form>
        </Toolbar>
      </AppBar>
    </div>
  )
}

class HomePage extends React.Component { 
  constructor(props){
    super(props);
    this.state = {};
    this.symbols = {"$DJI": null, "$COMPX": null, "$SPX.X": null, "$RUT.X": null};
  }

  addSymbol(symbol, symData){
    if(!(symbol in this.symbols)){
      return;
    } else {
      // If this is the last symbol loaded in say we're loaded.
      this.symbols[symbol] = symData;
      for(const index in this.symbols){
        if(!this.symbols[index]){
          return;
        }
      }
      this.setState({...this.state, indexData: this.symbols});
    }
  }

  // Get data for $DJI $COMPX $SPX.X $RUT.X
  componentDidMount() {
    http.get('http://localhost:8080/getLatestPrice?symbol=$DJI', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.addSymbol("$DJI", JSON.parse(data));
      });
    });

    http.get('http://localhost:8080/getLatestPrice?symbol=$COMPX', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.addSymbol("$COMPX", JSON.parse(data));
      });
    });

    http.get('http://localhost:8080/getLatestPrice?symbol=$SPX.X', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.addSymbol("$SPX.X", JSON.parse(data));
      });
    });

    http.get('http://localhost:8080/getLatestPrice?symbol=$RUT.X', (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.addSymbol("$RUT.X", JSON.parse(data));
      });
    });
  }

  convertEpochToHourMinute(time){
    const dt = new Date(time);
    const hr = dt.getHours();
    const m = "0" + dt.getMinutes();
    
    //return hr + ':' + m.substr(-2);
    return dt;
  }

  getPricePoints(candles){
    var prices = [];
    for(var i = 0; i < candles.length; i++){
      prices.push(candles[i].close);
    }
    return prices;
  }

  getTimePoints(candles){
    var times = [];
    for(var i = 0; i < candles.length; i++){
      times.push(this.convertEpochToHourMinute(candles[i].datetime));
    }
    return times;
  }

  getOpeningPeriodPrice(candles){
    return candles[0].open;
  }

  generateLineDiagram(candles, symbol){
    console.log(candles)
    const Plot = createPlotlyComponent(Plotly);
    const lineColor = 'green';
    const timePoints = this.getTimePoints(candles);
    const pricePoints = this.getPricePoints(candles);
    const openPrice = this.getOpeningPeriodPrice(candles);
    const closePrice = candles[candles.length - 1].close;
    const closeTime = timePoints[timePoints.length - 1];
    const openTime = timePoints[0];
    if(closePrice < openPrice){
      lineColor = 'red';
    }
    return (
      <Plot
        data={[
          {
            x: timePoints,
            y: pricePoints,
            type: 'scatter',
            mode: 'lines',
            marker: {color: lineColor},
          },
          {
            type: 'scatter',
            x: [timePoints[timePoints.length - 1]], 
            y: [pricePoints[pricePoints.length - 1]], 
            mode: "markers", 
            marker: {color: lineColor, size: 5}
          },
          {
            type: 'scatter',
            x: [openTime, closeTime], 
            y: [openPrice, openPrice], 
            mode: "lines", 
            marker: {color: 'black', width: 10},
            line: {width: 1}
          },
        ]}
        layout={ {width: 500,
          height: 300, 
          title: symbol, 
          showlegend: false,
          xaxis: {
            type: 'date',
            tick0: openTime,
            showgrid: false,
            tickformat: '%-I%p'
          },
          yaxis: {
            showgrid: false,
          }
        } }
        config={{staticPlot: true}}
      />
    );
  }

  render() {
    if(this.state.indexData){
      return(<div>
        <AppBar/>
        {Object.keys(this.state.indexData).map((symbol) => {
          const indexObj = this.state.indexData[symbol];
          return this.generateLineDiagram(indexObj.candles, symbol)
          })}
      </div>);
    }
    return (<div>
      <AppBar/>
      <Loader
      type="Audio"
      color="#5885af"
      height={100}
      width={100}
      style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/>
      </div>);
  }
}

function App(props) {
  const [state, setState] = useState({
    currentPage: <HomePage/>
  });

  const changePage = page => {
    setState({currentPage: page});
  }

  return (
    <div className="App">
      <TopBar equitiesList={props.equitiesList}/>
      {state.currentPage}
    </div>
  );
}

export default App;