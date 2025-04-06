import React from 'react';
import {Link} from 'react-router-dom';
import './home.css';
import DropDown from '../Account/account';

const Home = () => {
    return(
        <>
        <div style={{ margin: 0, padding: 0 }}>
            <header>
                <div className='header'>
                    <h1>Ethekwini Municipality</h1>
                </div>
                <DropDown />
            </header>
            <div className='body'>
                <h3>What would you like to report?</h3>
            </div>
            <div className='options'>
                <ul className='options_list'>
                    <li className='cable'><Link to='/form?address=cable theft'>Cable Theft</Link></li>
                    <hr></hr>
                    <li className='power'><Link to="/form?address=power outage">Power</Link></li>
                    <hr></hr>
                    <li className='sewage'><Link to="/form?address=sewage">Sewage</Link></li>
                    <hr></hr>
                    <li className='water-shortage'><Link to="/form?address=water shortage">Water shortage</Link></li>
                    <hr></hr>
                    <li className='illegal-dumping'><Link to="/form?address= illegal dumping">Illegal Dumping</Link></li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default Home