import React, { useEffect, useState } from "react";
import "./muvo_history.css"; // Create this if you want to style it
import { Link } from "react-router-dom";
import Axios from "axios";

const Muvo_History = () => {
  const [busData, setBusData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from your backend API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get("http://localhost:3000/muvo_history"); // Make sure this returns JSON
        if(res.status === 200){
            console.log('etched data')
            setBusData(res.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Filter the data based on search term
  const filteredData = busData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
    (item.bus_route && item.bus_route.toLowerCase().includes(search)) ||
    (item.bus_driver && item.bus_driver.toLowerCase().includes(search))
  );
});

  return (
    <div className="muvo-history">
        <header>
            <div className="header">
                <Link to='/home2'><h1>Ethekwini Municipality</h1></Link>
            </div>
        </header>
        <div className="searchbar-container">
      <h2>Bus History</h2>
      <div className="search-bar">
        <hr />
        <input
          type="search"
          id="search"
          placeholder="Search by Bus Route"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
      </div>
      </div>

      {filteredData.length > 0 ? (
        <table id="myTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Bus Route</th>
              <th>Bus Number</th>
              <th>Bus Driver</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bus, index) => (
              <tr key={index}>
                <td>{new Date(bus.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || "—"}</td>
                <td>{bus.bus_route}</td>
                <td>{bus.bus_number}</td>
                <td>{bus.bus_driver}</td>
                <td>{/*new Date(bus.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })*/bus.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Muvo_History;
