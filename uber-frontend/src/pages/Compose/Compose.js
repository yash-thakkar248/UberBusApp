import { useHistory } from 'react-router-dom'
//import Page from 'material-ui-shell/lib/containers/Page/Page'
import React, { useState, useContext } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
//import Button from '@material-ui/Button'
import Paper from '@material-ui/core/Paper'
//import MenuContext from 'material-ui-shell/lib/providers/Menu/Context'


const useStyles = makeStyles((theme) => ({
  paper: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(720 + theme.spacing(6))]: {
      width: 900,
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

const Compose = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tweet, setTweet] = useState('');
  const [username, setUsername] = useState('');

  // async launch POST
  const postTweet = async (user, description, priv, pic) => {
    const paramdict = {
      'user': user,
      'description': description,
      'private': priv,
      'pic': pic
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
      const response = await fetch("http://0.0.0.0:5000/tweet", config);
      //const json = await response.json()
      if (response.ok) {
        //return json
        //return response
        console.log("success on send.");

      } else {
        alert("launch: failure on send!");
      }

      try {
        const data = await response.json();
        console.log("on reply:")
        console.log(data);
      } catch (err) {
        console.log(err);
        alert("exception on reply!");
      }

    } catch (error) {
      console.log(error);
      alert("exception on send");
    }
  };

  function handleSubmit(event) {
    event.preventDefault()

    const priv = true;
    //const username = 'Elon Musk';
    const myArray = [
      "women",
      "men"
    ];
    const img_gender = myArray[Math.floor(Math.random() * myArray.length)];
    const img_index = Math.floor(Math.random() * 100) + 1;
    const img_url = 'https://randomuser.me/api/portraits/' + img_gender + '/' + img_index.toString() + '.jpg';

    postTweet(username, tweet, priv, img_url);
    alert('tweet posted!');
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {'Compose Tweet'}
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
              label={'User Name'}
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              value={tweet}
              onInput={(e) => setTweet(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="tweet"
              label={'Tweet'}
              name="tweet"
              autoComplete="tweet"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {'Submit'}
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
          </div>
        </div>
      </Paper>
    </React.Fragment>
  )
}

export default Compose
