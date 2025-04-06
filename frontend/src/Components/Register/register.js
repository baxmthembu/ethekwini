import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Validate from "../Validate/validate";
import Axios from "axios";  // Fix Axios import
import "./register.css";
import {toast, ToastContainer, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const image = require('../Images/masipala2.png')
const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        id_number: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const submit = async (e) => {
        e.preventDefault();
        const validationResponse = Validate(formData);
        console.log("Submitting form...", formData);

        if (validationResponse.isValid) {
            try {
                const { ...dataToSend } = formData;
                const response = await Axios.post("http://localhost:3000/register", dataToSend); // Fix Axios usage

                if (response.status === 200) {
                    console.log("Registration successful");
                    toast.success('Registered successfully')
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    console.error("Registration failure");
                }
            } catch (error) {
                console.error("Register Error:", error);
                if (error.response) {
                    console.log("Error Response:", error.response);
                    setErrorMessage(error.response.data.msg || "An error occurred during registration.");
                } else {
                    setErrorMessage("Network error. Please try again later.");
                }
            }
        } else {
            setErrorMessage(validationResponse.errorMessage);
        }
    };

    return (
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
                        <h1 className="head">Register</h1>
                        <div className="forms-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                            <input value={formData.name} onChange={handleChange} type="text" name="name" placeholder="Enter name" required />
                        </div>

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
                            <p>Already have an account? <Link to="/login" className="register-link">Sign in</Link></p>
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
    );
};

export default Register;
