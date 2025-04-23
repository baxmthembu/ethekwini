/*import React, { useState, useContext,useEffect } from "react";
import Axios from 'axios'
import { Link } from "react-router-dom";
import "./home2.css";
import { UpdatesContext } from "../updateContext";
import { format } from 'date-fns';

const Home2 = () => {  // Accept updates as a prop
    const { updates } = useContext(UpdatesContext);
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        try {
            const response = await Axios.get('http://localhost:3000/tweets');
            setTweets(response.data);
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    };


    <div>
    {tweets.length === 0 ? (
        <p>No updates available.</p>
    ) : (
        tweets.map((tweet) => {
            const dateObj = new Date(tweet.created_at);
            const time = format(dateObj, 'hh:mm a'); // "12:30 am"
            const date = format(dateObj, 'dd MMM yyyy'); // "04 Apr 2025"

    return (
        <div style={{ margin: 0, padding: 0 }}>
            <header>
                <div className="header">
                    <Link to="/"><h1>Ethekwini Municipality</h1></Link>
                </div>
            </header>

            <div className="statement-container">
                <div className="statement">
                    <h4>Download Statement</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="statement-icon"><path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3L304 256l0-96c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 96-57.7 0C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/></svg>
                </div>
            </div>

            {/* Display submitted updates here *
            <div>
                <div key={tweet.id} className="update-card">
                    <p>{tweet.text}</p>
                    <p>{time}</p>
                    <p>{date}</p>
                </div>
            </div>
        </div>
    );
    })
)}
</div>
};

export default Home2;*/

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { format } from 'date-fns';
import './home2.css';
import PayPal from '../Paypal/paypal';

const Home2 = () => {
    const [tweets, setTweets] = useState([]);
    const [showMessageButton, setShowMessageButton] = useState(true);


    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        try {
            const response = await Axios.get('http://localhost:3000/tweets');
            setTweets(response.data);
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    };

    const handlePayButtonClick = () => {
        setShowMessageButton(false);
    };


    return (
        <div style={{ margin: 0, padding: 0 }}>
            <header style={{backgroundColor: '#00308F'}}>
                <div className="header">
                    <Link to="/"><h1>Ethekwini Municipality</h1></Link>
                </div>
            </header>

            <div className="statement-container">
                <div className="statement">
                    <h4>Download Statement</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="statement-icon" >
                        <path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3L304 256l0-96c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 96-57.7 0C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z" />
                    </svg>
                </div>
            </div>

            {/* Display submitted updates */}
            <div className='card-container'>
                <label><h1>Updates</h1></label>
                {tweets.length === 0 ? (
                    <p>No updates available.</p>
                ) : (
                    tweets.map((tweet) => {
                        const dateObj = new Date(tweet.created_at);
                        const time = format(dateObj, 'hh:mm a'); // "12:30 am"
                        const date = format(dateObj, 'dd MMM yyyy'); // "04 Apr 2025"

                        return (
                            <div key={tweet.id} className="update-card">
                                <p className='tweet-text'>{tweet.text}</p>
                                <p className='tweet-time'>{time} · {date}</p>
                            </div>
                        );
                    })
                )}
            </div>
            <div className='balance-container'>
                <div className='balance'>
                    <h4>Outstanding Balance: R1894</h4>
                    {<PayPal onClick={handlePayButtonClick} />}
                </div>
            </div>
            <div className='muvo-histor'>
                <div className='muvo'>
                    <Link to='/muvo_history'><h4>Muvo Bus History</h4></Link>
                </div>
            </div>
            <div className='track-bus'>
                <div className='bus'>
                    <Link to='/muvo_history'><h4>Track Bus</h4></Link>
                </div>
            </div>
            <div className='message'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='message-icon'><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>
            </div>
        </div>
    );
};

export default Home2;

