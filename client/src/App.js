import React from 'react';
import './App.css';
import { makeStyles, withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';

const searchTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#9ca2b2',
      main: '#919ab1',
      dark: '#4e5066',
      contrastText: '#fff',
    },
    secondary: {
      light: '#bd92aa',
      main: '#92637c',
      dark: '#5d3348',
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
    background: '#919ab1'
  },
  input: {
    align: 'center',
    width: '50%',
  },
  whiteBackground: {
    backgroundColor: theme.palette.common.white,
  }
}));

function TopBar(props) {
  const classes = useStyles();
  var i = 0;
  var searchList = [];
  for(var symbol in props.equitiesList){
    searchList.push(symbol + "\t" + props.equitiesList[symbol]);
  }

  const filterOptions = createFilterOptions({
    limit: 3
  });

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
              freeSolo
              filterOptions={filterOptions}
              autoHighlight={true}
              options={searchList}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.input}
                  color="secondary"
                  id="outlined-full-width"
                  placeholder="Search"
                  margin="normal"
                  variant="outlined"
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

function App(props) {
  return (
    <div className="App">
      <TopBar equitiesList={props.equitiesList}/>
    </div>
  );
}

export default App;
