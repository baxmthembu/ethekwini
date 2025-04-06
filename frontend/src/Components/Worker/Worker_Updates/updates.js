import React, { useState, useContext } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { UpdatesContext } from "../../updateContext";
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import MapComponent from "../../Map/map";
import './update.css'

const Updates = () => {
    const [formData, setFormData] = useState({
        tweet: ''
    })
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const submit = async (e) => {
        e.preventDefault();
        const badge_number = sessionStorage.getItem('badge_number')
        console.log("Submitting form...", formData);

            try {
                const { ...dataToSend } = formData;
                const response = await Axios.post("http://localhost:3000/tweet", {
                    badge_number,
                    tweet: formData.tweet
                });
                

                if (response.status === 200) {
                    console.log("Text sent successful");
                    toast.success('Text sent')
                } else {
                    console.error("Text failure");
                }
            } catch (error) {
                console.error("Text Error:", error);
                if (error.response) {
                    console.log("Error Response:", error.response);
                    setErrorMessage(error.response.data.msg || "An error occurred during text upload.");
                } else {
                    setErrorMessage("Network error. Please try again later.");
                }
            }
    };

    return (
        <div style={{margin:0,padding:0}}>
            <header>
                <div className="header">
                    <Link to='/'><h1>Ethekwini Municipality</h1></Link>
                </div>
                <button className="back-button"><Link to='/worker_login'>Logout</Link></button>
            </header>
            <div>
                <div>
                    <form onSubmit={submit} className="update-form">
                        <div className="update-container">
                            <label className="tweet-header">Updates</label><br />
                            <textarea
                                rows="4"
                                cols="50"
                                placeholder="Add update"
                                style={{ fontSize: "15px" }}
                                value={formData.tweet}
                                onChange={handleChange}
                                name="tweet"
                                className="update-text"
                            ></textarea>
                            <div>
                                <button type="submit" className="text-button">Send</button>
                            </div>
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                </div>
                <ToastContainer
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    theme="colored"
                    transition={Bounce}
                />
            </div>
            <MapComponent />
        </div>
    );
};

export default Updates;
