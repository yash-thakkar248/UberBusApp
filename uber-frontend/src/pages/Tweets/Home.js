import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import TweetList from "./TweetList";
//import axios from 'axios';

const THome = () => {
  const [tweets, setTweets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);   
  
  useEffect(() => {
    const fetchData = async () => {
	  const res = await fetch("http://0.0.0.0:5000/tweets-results");
      const { results } = await res.json();
      console.log(results);
      setTweets([...results]);
	  setLoading(false);
    };
 
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
	    <TweetList tweets={tweets} />
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

export default THome;
