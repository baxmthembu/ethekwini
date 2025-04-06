import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
//import Validate from "../Validate/validate";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const image = require('../../Images/masipala2.png')
function Worker_Login(){
    const [formData, setFormData] = useState({
        badge_number: '',
        password: ''
    })
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        
        // Allow numbers only for id_number field
        if (name === "badge_number") {
            sanitizedValue = value.replace(/\D/g, '');
        }

        setFormData({ ...formData, [name]: sanitizedValue });
    };

        
    const submit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Frontend validation
        if (formData.badge_number.length > 7) {
            setErrorMessage("Badge number must be less than 7 numbers.");
            return;
        }
        if (formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        /*try {
                // Save location in sessionStorage (or localStorage)
                sessionStorage.setItem('workerLocation', JSON.stringify({ lat: latitude, lng: longitude }));    
            const response = await Axios.post("http://localhost:3000/worker_login", {
                badge_number: formData.badge_number.trim(),
                password: formData.password.trim(),
            }, { headers: { "Content-Type": "application/json" }, withCredentials: true });
        
            console.log("Response Data:", response.data); // Log response
        
            if (response.status === 200) {
                console.log('logged in')
                toast.success('Logged in')
                sessionStorage.setItem('badge_number', formData.badge_number.trim());
                setTimeout(() => {
                    navigate('/update')
                }, 2000)         
            }
        } catch (error) {
            console.error("Login Error:", error); // Log error properly
            if (error.response) {
                console.log("Error Response:", error.response); // Log response error
                setErrorMessage(error.response.data.msg || "Invalid credentials.");
            } else {
                console.log("Network Error:", error.message);
                setErrorMessage("Network error. Please try again later.");
            }
        }*/
            try {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
        
                    // Save location in sessionStorage (or localStorage)
                    sessionStorage.setItem('workerLocation', JSON.stringify({ lat: latitude, lng: longitude }));
        
                    // You could also send it to your backend here if needed
        
                    const response = await Axios.post("http://localhost:3000/worker_login", {
                        badge_number: formData.badge_number.trim(),
                        password: formData.password.trim(),
                    }, {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    });
        
                    if (response.status === 200) {
                        toast.success('Logged in');
                        sessionStorage.setItem('badge_number', formData.badge_number.trim());
                        setTimeout(() => {
                            navigate('/update');
                        }, 2000);
                    }
                }, (error) => {
                    console.error("Geolocation error:", error);
                    setErrorMessage("Location access is required.");
                    setLoading(false);
                });
            } catch (error) {
                console.error("Login Error:", error);
                if (error.response) {
                    setErrorMessage(error.response.data.msg || "Invalid credentials.");
                } else {
                    setErrorMessage("Network error. Please try again later.");
                }
                setLoading(false);
            }        
    };


    return(
        <>
        <div style={{ margin: 0, padding: 0 }}>
            <header>
                <div className="header">
                    <Link to='/'><h1>Ethekwini Municipality</h1></Link>
                </div>
            </header>
            <div className="register-container"> 
                <div className="register-form">
                    <form onSubmit={submit} className="form">
                        <div className="register-logo">
                            <img src={image} alt="municipality" />
                        </div>
                        <h1 className="head">Login</h1>
                        <div className="forms-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="icon1"><path d="M256 48l0 16c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-16L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-384c0-8.8-7.2-16-16-16l-64 0zM0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM160 320l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L96 416c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>
                            <input value={formData.badge_number} onChange={handleChange} type="text" name="badge_number" placeholder="Enter Badge number" required />
                        </div>
                        <div className="forms-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
                            <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter password" required autoComplete="off" />
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <div className="button">
                            <button type="submit" className="submit">Submit</button>
                            <p>Don't have an account? <Link to="/worker_register" className="register-link">Register</Link></p>
                        </div>
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
        </div>
        </>
    )

}

export default Worker_Login
