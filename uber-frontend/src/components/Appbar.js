import React from 'react';
import clsx from 'clsx';
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LayersIcon from '@material-ui/icons/Layers';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import HistoryIcon from '@material-ui/icons/History';

import config from '../config/config'

// import your components:
import Home from "../pages/Home";
import SignUp from "../pages/SignUp/SignUp";
import SignIn from "../pages/SignIn/SignIn";
import PasswordReset from "../pages/PasswordReset/PasswordReset";
import PasswordChange from "../pages/PasswordChange/PasswordChange";
import THome from "../pages/Tweets/Home";
import Compose from "../pages/Compose/Compose";

import TBook from "../pages/Book/TBook"
import THistory from "../pages/Book/THistory"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const drawerWidth = 240;
const history = createBrowserHistory();

// css
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  drawerPaperCollapsed: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'grey',
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}));

//~dk
const isAuthorised = config.auth.isAuthenticated()

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
  const [title, setTitle] = React.useState('Home');
  const [loggedUser, setUserLogged] = React.useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
    setCollapsed(false);
  };
  const handleDrawerClose = () => {
    setOpen(false);
    setCollapsed(false);
  };
  const handleDrawerCollapsed = () => {
    setCollapsed(true);
    setOpen(false);
  };
  const onItemClick = title => () => {
    setTitle(title);
  };

  useEffect(() => {
    // Update the document title using the browser API
    const loggedInUser = localStorage.getItem("role");
    if(loggedInUser == null){
      setUserLogged("");
    }else{
      setUserLogged(loggedInUser);
    }
  });

  const handleLogOut = async () => {
    const loggedInUser = localStorage.getItem("role");
    console.log('User : ' + loggedInUser);

    const paramdict = {
      'username': loggedInUser
    }

    try {
      const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(paramdict)
      }
      const response = await fetch("http://34.231.3.26:5000/userLogOut", config);
      //const json = await response.json()
      if (response.ok) {
          console.log("success on send."); 
          
      } else {
          alert("launch: failure on send!");
      }
      try {
          const data = await response.json();
          console.log("on reply:")
          console.log(data);
          if(data == "User Already Logged Out"){
            alert('Already Logged Out')
            return "<h1>Already Logged Out</h1>";
          }else{
          localStorage.removeItem("role");  
          console.log(data.username);
          alert('Logout Successful');
          return "<h1>Logout Successful</h1>"
          }

      } catch (err) {
          console.log(err);
          alert("exception on reply!");
      }

    } catch (error) {

    }
  
  }

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* This is the header AppBar */}
      <AppBar position="absolute" className={clsx(classes.appBar, 
          open && classes.appBarShift, collapsed && classes.appBar)}>
        <Toolbar title={"Logout"} className={classes.toolbar}>

          {/* The Menu icon exposes the left pane menu bar */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          {/* The title is set by the components */}
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          <Typography component="h3" variant="h6" color="inherit" noWrap>{loggedUser}</Typography>
          {/* For kicks */}
          <IconButton color="inherit" onClick={handleLogOut}>
              <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* The Router component routes URLs to your components */}
      <Router history={history} title={title} >

        {/* Drawers are left pane menu items in React-speak */}
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, 
              !open && classes.drawerPaperClose,
              collapsed && classes.drawerPaperCollapsed)
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>

            {/* This icon collapses the left pane enough to show menu item icons */}
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />

          {/* Left pane menu items */}
          <List>

            {/* Tweets menu item}
            <ListItem button component={Link} to="/tweets" onClick={onItemClick('Tweets')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Tweets" />
              { title === 'Tweets' && 
                <ListItemIcon>
                  <IconButton onClick={handleDrawerCollapsed}>
                    <ChevronLeftIcon />
                  </IconButton>
                </ListItemIcon>
              }
            </ListItem> */}

            {/* Compose menu item
            <ListItem button component={Link} to="/compose" onClick={onItemClick('Compose')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Compose" />
              { title === 'Compose' && 
                <ListItemIcon>
                  <IconButton onClick={handleDrawerCollapsed}>
                    <ChevronLeftIcon />
                  </IconButton>
                </ListItemIcon>
              }
            </ListItem> */}

            {/* SignUp menu item */}
            <ListItem button component={Link} to="/signin" onClick={onItemClick('Sign In')}>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
              { title === 'Sign In' && 
                <ListItemIcon>
                  <IconButton onClick={handleDrawerCollapsed}>
                    <ChevronLeftIcon />
                  </IconButton>
                </ListItemIcon>
              }
            </ListItem>
            {/* Book Train */}  
            <ListItem button component={Link} to="/book" onClick={onItemClick('Book Ticket')}>
              <ListItemIcon>
              <EventBusyIcon />
              </ListItemIcon>
              <ListItemText primary="Book Ticket" />
              { title === 'Book Ticket' && 
                <ListItemIcon>
                  <IconButton onClick={handleDrawerCollapsed}>
                  <ChevronLeftIcon />
                  </IconButton>
                </ListItemIcon>
              }
            </ListItem>

            <ListItem button component={Link} to="/bookHistory" onClick={onItemClick('History')}>
              <ListItemIcon>
              <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
              { title === 'History' && 
                <ListItemIcon>
                  <IconButton onClick={handleDrawerCollapsed}>
                  <ChevronLeftIcon />
                  </IconButton>
                </ListItemIcon>
              }
            </ListItem>  
          </List>
        </Drawer>

        {/* This is your mission control: Matches URLs above to your components */}
        <main className={classes.content}>

          {/* menu paths */}
          <Route exact path="/" component={Home} />
          <Route path="/book" component={TBook} />
          <Route path="/bookHistory" component={THistory} />
          <Route path="/compose" component={Compose} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/password_reset" component={PasswordReset} />
          <Route path="/password_change" component={PasswordChange} />
          {/* <Route path="/activity"><ActivityHome /></Route> */}
        </main>
      </Router>
      
      {/* Whatever you put here will appear on all your pages, style appropriately! */}
    </div>
  );
}
