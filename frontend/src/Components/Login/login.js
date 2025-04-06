import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
//import Validate from "../Validate/validate";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const image = require('../Images/masipala2.png')
function Login(){
    const [formData, setFormData] = useState({
        id_number: '',
        password: ''
    })
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        
        // Allow numbers only for id_number field
        if (name === "id_number") {
            sanitizedValue = value.replace(/\D/g, '');
        }

        setFormData({ ...formData, [name]: sanitizedValue });
    };

    useEffect(() => {
        const existingLocation = sessionStorage.getItem('userLocation');
        if (existingLocation) {
            setUserLocation(JSON.parse(existingLocation));
        } else if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(userCoords);
                    sessionStorage.setItem('userLocation', JSON.stringify(userCoords));
                },
                (error) => console.error("Error getting location:", error)
            );
        }
    }, []);
        
    const submit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Frontend validation
        if (formData.id_number.length !== 13) {
            setErrorMessage("ID number must be exactly 13 characters.");
            return;
        }
        if (formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const response = await Axios.post("http://localhost:3000/login", {
                id_number: formData.id_number.trim(),
                password: formData.password.trim(),
            }, { headers: { "Content-Type": "application/json" }, withCredentials: true });
        
            console.log("Response Data:", response.data); // Log response
        
            if (response.status === 200) {
                console.log('logged in')
                toast.success('Logged in')
                setTimeout(() => {
                    navigate('/home2')
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="icon1"><path d="M528 160l0 256c0 8.8-7.2 16-16 16l-192 0c0-44.2-35.8-80-80-80l-64 0c-44.2 0-80 35.8-80 80l-32 0c-8.8 0-16-7.2-16-16l0-256 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM272 256a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm104-48c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0z"/></svg>
                            <input value={formData.id_number} onChange={handleChange} type="text" name="id_number" placeholder="Enter ID number" required />
                        </div>
                        <div className="forms-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
                            <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter password" required autoComplete="off" />
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <div className="button">
                            <button type="submit" className="submit">Submit</button>
                            <p>Don't have an account? <Link to="/register" className="register-link">Register</Link></p>
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

export default Login

    /*const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        if (name === "id_number") {
            sanitizedValue = value.replace(/\D/g, '');
        }

        setFormData({ ...formData, [name]: sanitizedValue });
    };*/


    /*const submit = async (e) => {
        e.preventDefault();
        //const validationResponse = Validate(formData);
        console.log("Submitting form...", formData);

        
            try {
                const { ...dataToSend } = formData;
                const response = await axios.post("http://localhost:3000/login", dataToSend); // Fix Axios usage

                if (response.status === 200) {
                    console.log("Login successful");
                    toast.success('Logged in successfully', {
                        position: toast.POSITION.TOP_CENTER
                      });            
                    
                } else {
                    console.error("Login failure");
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.msg || "An error occurred during log in.");
                } else {
                    setErrorMessage("Network error. Please try again later.");
                }
            }
        }*/
            /*const submit = async (e) => {
                e.preventDefault();
                
                // Validate input fields
                
                
                try {
                    const { ...dataToSend } = formData;
                    const response = await axios.post("http://localhost:3000/login", dataToSend);
        
                    if (response.status === 200) {
                        toast.success("Logged in successfully", {
                            position: toast.POSITION.TOP_CENTER
                        });
        
                   }
                } catch (error) {
                    if (error.response) {
                        setErrorMessage(error.response.data.msg || "An error occurred during login.");
                    } else {
                        setErrorMessage("Network error. Please try again later.");
                    }
                }
            };*/

