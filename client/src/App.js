import React from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

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
    width: '50%'
  }
}));

function TopBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar >
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <HomeIcon />
          </IconButton>
          <form className={classes.root} noValidate autoComplete="off">
          <TextField
            className={classes.input}
            color="secondary"
            id="outlined-full-width"
            placeholder="Search"
            margin="normal"
            variant="outlined"
          />
        </form>
        </Toolbar>
      </AppBar>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <TopBar />
    </div>
  );
}

export default App;
