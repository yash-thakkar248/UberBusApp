import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'


//import axios from 'axios';

const THistory = () => {
  const [tickets, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {

        if(typeof(loggedInUser) == 'undefined' || loggedInUser == null){
          console.log('Type found is null')
          setBookings([]);
          return;
        }
        const paramdict = {
          "username":loggedInUser
        }

      const paramdict = {
        "username": loggedInUser
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
        const response = await fetch("http://34.231.3.26:5000/showBookedTickets", config);
        //const json = await response.json()

        try {
          const data = await response.json();
          console.log("on reply:")
          console.log(data);
          setBookings([...data]);
        } catch (err) {
          console.log(err);
          alert("exception on reply!");
        }

      } catch (error) {
        console.log(error);
        alert("exception on send");
      }
    }
    fetchData();

  }, []);

  return (
    <ScrollView noSpacer={true} noScroll={true} style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={[styles.centering]}
          color="#ff8179"
          size="large"
        />
      ) : (
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Journey Date</TableCell>
                <TableCell>Booking Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((item, i) => {
                return (
                  <TableRow key={`row-${i}`}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.ticketFrom}</TableCell>
                    <TableCell>{item.ticketTo}</TableCell>
                    <TableCell>{item.bookeddate}</TableCell>
                    <TableCell>{item.creationdate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "whitesmoke",
    marginTop: '60px'
  },
  centering: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    height: "100vh"
  }
});

export default THistory;
