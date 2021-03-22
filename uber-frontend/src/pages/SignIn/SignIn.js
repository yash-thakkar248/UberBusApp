import { useHistory } from 'react-router-dom'
import { saveAuthorisation, isAuthorised } from '../../utils/auth'
//import Page from 'material-ui-shell/lib/containers/Page/Page'
import React, { useState, useContext } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
//import Button from '@material-ui/Button'
import Paper from '@material-ui/core/Paper'
//import MenuContext from 'material-ui-shell/lib/providers/Menu/Context'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(620 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    width: 192,
    height: 192,
    color: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: `100%`,
  },
}))

const SignIn = () => {
  const classes = useStyles()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const { setAuthMenuOpen } = useContext(MenuContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const storedUser = localStorage.getItem('role');
    console.log("Before User" + storedUser);
    // verify user/pwd
    if (storedUser != null) {
      alert('Already logged in by user : ' + storedUser)
      return;
    }

    if (typeof (username) === 'undefined' || typeof (password) === 'undefined' || username == '' || password == '') {
      alert('Please enter valid details');
      return;
    }
    //.. return userid
    const paramdict = {
      'username': username,
      'password': password
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
      const response = await fetch("http://34.231.3.26:5000/userSignIn", config);
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
          if(data == "User Already Sign In"){
            alert('Already Logged In')
            return "Already Logged In";
          }else if(data == "Invalid Login"){
            alert('Invalid Login');
            return;
          }else{
          localStorage.setItem('role', data.username)
          console.log(data.username)
          alert('Login Successful');
          return "<h1>Login Successful</h1>";
        }


      } catch (err) {
        console.log(err);
        alert("exception on reply!");
      }

    } catch (error) {

    }


    // save more: name, group, userid
    /* authenticate({
       displayName: 'User',
       email: username,
     })*/
  }

  const authenticate = (user) => {
    saveAuthorisation(user)
    let _location = history.location
    let isAuth = isAuthorised()
    //setAuthMenuOpen(false)
    if (isAuth) {
      let _route = '/home'
      if (_location.state && _location.state.from) {
        _route = _location.state.from.pathname
        history.push(_route)
      } else {
        history.push(_route)
      }
    }
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {'Sign In'}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              value={username}
              onInput={(e) => setUsername(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label={'Username'}
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={'Password'}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              {'Sign in'}
            </Button>
          </form>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            {/*<Link to="/password_reset">Forgot Password?</Link>*/}
            <Link to="/signup">Create New User</Link>
          </div>
        </div>
      </Paper>
    </React.Fragment>
  )
}

export default SignIn
