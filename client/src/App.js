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

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Z_BLOCK } from 'zlib';

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

// $DJI $COMPX $SPX.X $RUT.X
function HomePage(){
  const [state, setState] = useState({
    loaded: false
  });

  let data = '';
  http.get('http://localhost:8080/getLatestPrice?symbol=$DJI', (resp) => {
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(data);
    });
  })

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