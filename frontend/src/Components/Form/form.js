/*import React, { useState, useRef } from "react";
import Axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import './form.css'

const image = require('.././Images/masipala.jpg')
const Form = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: ''

    });
    const [file, setFile] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null); 
    const autocompleteRef = useRef(null);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        for (let file of files) {
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please upload an image.');
                return;
            }
            if (file.size > maxFileSize) {
                setError('File size too large. Please upload files under 5MB.');
                return;
            }
        }

        setFile(files);
        setError('');
    };


    const Submit = async(e) => {
        e.preventDefault();

        const formDataWithFile = new FormData();
        formDataWithFile.append('name', formData.name);
        formDataWithFile.append('address', formData.address);
        formDataWithFile.append('description', formData.description);    

        file.forEach((file) => {
            formDataWithFile.append('images', file);
        });

        try {
            const response = await Axios.post('http://localhost:3000/user', formDataWithFile);

            if (response.status === 200) {
                toast.success("Form Submitted Successfully");
            } else {
                toast.error("Form Not Submitted");
            }
        } catch (error) {
            toast.error('An error occurred while submitting the form.');
        } finally {
            setLoading(false); // Stop spinner
        }


    }

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          setFormData({ ...formData, address: place.formatted_address });
        }
      };
    
    return(
        <>
        <div style={{margin:0, padding:0}}>
            <header>
            <div className='header'>
                <Link to='/'><h1>Ethekwini Municipality</h1></Link>
            </div>
            </header>
            <h2>Fill in form</h2>
            <form onSubmit={Submit}>
                <div className="form-container">
                    <div className="input-container">
                        <div className="input">
                            <label>Name / Igama lakho</label>
                            <input type="text" name="name" onChange={handleChange} required/>
                        </div>
                        <div className="input">
                            <label>Address / Ikheli lakho</label>
                            <input type="text" name="address" placeholder="e.g. 123 Smith St, Berea, Durban, KwaZulu-Natal, 4001" onChange={handleChange} required
                            ref={(ref) => {
                                if (ref && !autocompleteRef.current) {
                                  const autocomplete = new window.google.maps.places.Autocomplete(ref, {
                                    types: ['geocode'],
                                    componentRestrictions: { country: 'za' }
                                  });
                                  autocomplete.addListener('place_changed', () => {
                                    autocompleteRef.current = autocomplete;
                                    handlePlaceSelect();
                                  });
                                }
                              }}
                            />
                        </div>
                        <div className="input">
                            <label>Additional information / Chaza ngabanzi inkinga</label>
                            <textarea rows="4" cols="50" placeholder="Describe your problem further/ Chaza ngabanzi inkinga" style={{ fontSize: '16px' }} name="description" onChange={handleChange}></textarea>
                        </div>
                        <label>Upload images / faka izithombe mawunazo</label>
                        <input type="file" multiple onChange={handleImageChange} name='images' />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="button-container">
                            <button type='submit' disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                            {loading && <div className="spinner">Loading...</div>}
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            theme="colored"
            transition={Bounce}
            />
        </div>
        </>
    )
}

export default Form*/

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoadScript } from '@react-google-maps/api';
import './form.css'

const libraries = ['places'];

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: ''
  });

  const [file, setFile] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC9jEINsXbkly2I3jIyNH8eHJ6J19De-2w', // <-- Replace with your actual key
    libraries
  });

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setFormData((prevData) => ({ ...prevData, address: place.formatted_address }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (let file of files) {
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload an image.');
        return;
      }
      if (file.size > maxFileSize) {
        setError('File size too large. Please upload files under 5MB.');
        return;
      }
    }

    setFile(files);
    setError('');
  };

  const Submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataWithFile = new FormData();
    formDataWithFile.append('name', formData.name);
    formDataWithFile.append('address', formData.address);
    formDataWithFile.append('description', formData.description);

    file.forEach((f) => {
      formDataWithFile.append('images', f);
    });

    try {
      const response = await Axios.post('http://localhost:3000/user', formDataWithFile);

      if (response.status === 200) {
        toast.success("Form Submitted Successfully");
      } else {
        toast.error("Form Not Submitted");
      }
    } catch (error) {
      toast.error('An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  const initializeAutocomplete = () => {
    if (!autocompleteRef.current && inputRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'za' }
      });
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <header>
        <div className='header'>
          <Link to='/'><h1>Ethekwini Municipality</h1></Link>
        </div>
      </header>
      <h2>Fill in form</h2>
      <form onSubmit={Submit}>
        <div className="form-container">
          <div className="input-container">
            <div className="input">
              <label>Name / Igama lakho</label>
              <input type="text" name="name" onChange={handleChange} required />
            </div>
            <div className="input">
              <label>Address / Ikheli lakho</label>
              <input
                type="text"
                name="address"
                placeholder="e.g. 123 Smith St, Berea, Durban, KwaZulu-Natal, 4001"
                ref={inputRef}
                onFocus={initializeAutocomplete}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input">
              <label>Additional information / Chaza ngabanzi inkinga</label>
              <textarea
                rows="4"
                cols="50"
                name="description"
                onChange={handleChange}
                placeholder="Describe your problem further / Chaza ngabanzi inkinga"
                style={{ fontSize: '16px' }}
              ></textarea>
            </div>
            <label>Upload images / faka izithombe mawunazo</label>
            <input type="file" multiple onChange={handleImageChange} name='images' />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="button-container">
              <button type='submit' disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              {loading && <div className="spinner">Loading...</div>}
            </div>
          </div>
        </div>
      </form>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default Form;
