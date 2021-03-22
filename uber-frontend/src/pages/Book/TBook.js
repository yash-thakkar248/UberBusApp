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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//import MenuContext from 'material-ui-shell/lib/providers/Menu/Context'
import { Link } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

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

const TBook = () => {
  const classes = useStyles();
  const history = useHistory();
  const [avail, setAvail] = useState([]);
  const [source, setSource] = useState('s');
  const [jdate, setJDate] = useState(new Date());
  const [destination, setDestination] = useState('d');
  const [journeyDate, setJourneyDate] = useState('');
  const [tweet, setTweet] = useState('');
  const [username, setUsername] = useState(localStorage.getItem("role"));

/*
  const toggleButtonOne = () => {
    console.log("Input search data");
    console.log("Source" + source)
    console.log("Destination" + destination)
    console.log("Date" + journeyDate)
    const dateSplit = journeyDate.split("-");
    console.log(dateSplit)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "ticketFrom":source,
          "ticketTo":destination,
          "ticketDay": 13,
          "ticketMonth": 12
      })
    };
    fetch('http://localhost:5000/search', requestOptions).then((resp)=>{ return resp.json() })
    .then((text)=>{ 
      console.log(text);
      setAvail([...text]);
     })
  };
*/
 

  const searchTicket = async () => {

    const loggedInUser = localStorage.getItem("role");
    console.log('User : ' + loggedInUser);

    console.log("Input search data");
    console.log("Source" + source)
    console.log("Destination" + destination)
    console.log("Date" + journeyDate)
    const dateSplit = journeyDate.split("-");
    console.log(dateSplit[2])
    const paramdict = {
      "ticketFrom":source,
      "ticketTo":destination,
      "ticketDay": parseInt(dateSplit[2]),
      "ticketMonth": parseInt(dateSplit[1])
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
      const response = await fetch("http://34.231.3.26:5000/search", config);
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
        setAvail([...data]);
      } catch (err) {
        console.log(err);
        alert("exception on reply!");
      }

    } catch (error) {
      console.log(error);
      alert("exception on send");
    }
  };
  

  const onItemClick = async (item) => {

      const loggedInUser = localStorage.getItem("role");
      console.log('User state value is ' + username);
      const paramdict = {
        'username': loggedInUser,
        'ticketFrom': item.source,
        'ticketTo': item.destination,
        'ticketDate': item.datetime
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
        const response = await fetch("http://34.231.3.26:5000/insertBook", config);
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
            alert(data);
        } catch (err) {
            console.log(err);
            alert("exception on reply!");
        }

      } catch (error) {

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
    const img_gender = myArray[Math.floor(Math.random()*myArray.length)];
    const img_index = Math.floor(Math.random() * 100) + 1 ;
    const img_url = 'https://randomuser.me/api/portraits/' + img_gender + '/' + img_index.toString() + '.jpg';
    searchTicket();
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={6}>
        <div className={classes.container}>
          <Typography component="h1" variant="h5">
            {'Enter travel details'}
          </Typography>
          
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            {/*
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
            /> */}
            <FormControl className={classes.formControl}
            style={{minWidth: '50%',align: 'left'}}
            variant="outlined"
            margin="normal"
            >
            <InputLabel required id="from-label">From</InputLabel>
                <Select
                value={source}
                labelId="select-from"
                label={'From'}
                onChange={(e) => setSource(e.target.value)}
                required
                >
              <MenuItem value={'Haymarket Square'}>Haymarket Square</MenuItem>
              <MenuItem value={'Back Bay'}>Back Bay</MenuItem>
              <MenuItem value={'North End'}>North End</MenuItem>
              <MenuItem value={'North Station'}>North Station</MenuItem>
              <MenuItem value={'Beacon Hill'}>Beacon Hill</MenuItem>
              <MenuItem value={'Boston University'}>Boston University</MenuItem>
              <MenuItem value={'Fenway'}>Fenway</MenuItem>
              <MenuItem value={'South Station'}>South Station</MenuItem>
              <MenuItem value={'Theatre District'}>Theatre District</MenuItem>
              <MenuItem value={'West End'}>West End</MenuItem>
              <MenuItem value={'Financial District'}>Financial District</MenuItem>
              <MenuItem value={'Northeastern University'}>Northeastern University</MenuItem>

              </Select>

            </FormControl>

            <FormControl className={classes.formControl}
            style={{minWidth: '50%',align: 'right'}}
            variant="outlined"
            margin="normal"
            >
            <InputLabel required id="to-label">To</InputLabel>
                <Select
                value={destination}
                labelId="select-to"
                label={''}
                onChange={(e) => setDestination(e.target.value)}
                required
                style={{minWidth: '50%', align: 'right'}}
                >
              <MenuItem value={'Haymarket Square'}>Haymarket Square</MenuItem>
              <MenuItem value={'Back Bay'}>Back Bay</MenuItem>
              <MenuItem value={'North End'}>North End</MenuItem>
              <MenuItem value={'North Station'}>North Station</MenuItem>
              <MenuItem value={'Beacon Hill'}>Beacon Hill</MenuItem>
              <MenuItem value={'Boston University'}>Boston University</MenuItem>
              <MenuItem value={'Fenway'}>Fenway</MenuItem>
              <MenuItem value={'South Station'}>South Station</MenuItem>
              <MenuItem value={'Theatre District'}>Theatre District</MenuItem>
              <MenuItem value={'West End'}>West End</MenuItem>
              <MenuItem value={'Financial District'}>Financial District</MenuItem>
              <MenuItem value={'Northeastern University'}>Northeastern University</MenuItem>

                </Select>
            </FormControl>
            <TextField
                id="date"
                label="Date of Journey"
                type="date"
                className={classes.textField}
                defaultValue=''
                InputProps={{ inputProps: { min: jdate }}}
                InputLabelProps={{
                shrink: true,
                }}
                onInput={(e) => setJourneyDate(e.target.value)}
                variant="outlined"
                margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={searchTicket}
            >
              {'Search'}
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
      <div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Book</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {avail.map((item, i) => {
              return (
                <TableRow key={`row-${i}`}>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.destination}</TableCell>
                  <TableCell>{item.datetime}</TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() => onItemClick(item)}
                    >
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>      
            
    </React.Fragment>
    
  )
}

export default TBook
