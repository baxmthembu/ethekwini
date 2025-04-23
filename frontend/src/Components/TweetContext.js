// src/context/TweetContext.js
import React, { createContext, useState, useContext } from 'react';

const TweetContext = createContext();

export const useTweet = () => useContext(TweetContext);

export const TweetProvider = ({ children }) => {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    try {
      const response = await fetch('http://localhost:3000/tweets');
      const data = await response.json();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  const addTweet = (tweet) => {
    setTweets((prev) => [tweet, ...prev]);
  };

  return (
    <TweetContext.Provider value={{ tweets, setTweets, fetchTweets, addTweet }}>
      {children}
    </TweetContext.Provider>
  );
};
