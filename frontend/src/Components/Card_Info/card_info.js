import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./card_info.css"; // Make sure the path is correct based on your project

const image = require('../Images/chip.png')
const wifi = require('../Images/wifi.png')

const CreditCardForm = () => {
  const [card_number, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiration_date, setExpirationDate] = useState("");
  const [cvv, setCVV] = useState("");

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return value;
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  };

  // Format expiration
  const formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      card_number,
      name,
      expiration_date,
      cvv,
    };

    try {
      const response = await fetch("http://localhost/muvo/card_info.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      if (!response.ok || result.includes("error")) {
        alert("Error submitting card info.");
      } else {
        alert("Card info submitted successfully!");
        setCardNumber("");
        setName("");
        setExpirationDate("");
        setCVV("");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <>
        <header>
            <div className='header'>
                <Link to='/home2'><h1>Ethekwini Municipality</h1></Link>
            </div>
        </header>
        <main className="container">
            <section className="ui">
                <div className="container-left">
                    <form onSubmit={handleSubmit} method="post" id="credit-card">
                        <div className="number-container">
                            <label>Card Number</label>
                            <input type="text" name="card-number" id="card-number" maxLength="19" placeholder="1234 5678 9101 1121" required
                            /*onKeyPress="return event.charCode >= 48 && event.charCode <= 57"*/ value={card_number} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}/>
                        </div>
                        <div className="name-container">
                            <label>Card Holder</label>
                            <input type="text" name="name-text" id="name-text" maxLength="30" placeholder="NOAH JACOB" required
                            /*onKeyPress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.key == ''"*/ value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
                        </div>
                        <div className="infos-container">
                            <div className="expiration-container">
                                <label>Expiration</label>
                                <input type="text" name="valid-thru-text" id="valid-thru-text" maxLength="5" placeholder="02/04" required
                                /*onKeyPress="return event.charCode >= 48 && event.charCode <= 57"*/ value={expiration_date} onChange={(e) => setExpirationDate(formatExpiration(e.target.value))} />
                            </div>
                            <div className="cvv-container">
                                <label>CVV</label>
                                <input type="text" name="cvv-text" id="cvv-text" maxLength="3" placeholder="123" required
                                /*onKeyPress="return event.charCode >= 48 && event.charCode <= 57"*/ value={cvv} onChange={(e) => setCVV(e.target.value)} />
                            </div>
                        </div> 
                           <input type="submit" value="ADD" id="add" />                    
                    </form>
                </div>
                <div className="container-right">
                    <div className="card">
                        <div className="intern">
                            <img className="approximation " src={wifi} alt="aproximation" />
                            <div className="card-number">
                                <div className="number-vl">{card_number || "1234 5678 9101 1121"}</div>
                            </div>
                            <div className="card-holder">
                                <label>Holder</label>
                                <div className="name-vl">{name || "NOAH JACOB"}</div>
                            </div>
                            <div className="card-infos">
                                <div className="exp">
                                    <label>valid_through</label>
                                    <div className="expiration-vl">{expiration_date || "02/40"}</div>
                                </div>
                                <div className="cvv">
                                    <label>CVV</label>
                                    <div className="cvv-vl">{cvv || "123"}</div>
                                </div>
                            </div>
                            <img className="chip" src={image} alt="chip"/>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
};

export default CreditCardForm;
