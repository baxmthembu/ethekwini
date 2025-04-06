import React from "react";
import { Link } from "react-router-dom";
import './sidebar.css'
import {elastic as Menu} from 'react-burger-menu';

const SideBar = () => {
    return(
        <>
        <div>
            <div className="bm-burger-button"></div>
            <div className="bm-burger-bars"></div>
            <Menu left>
                <div className="menu">
                    <ul style={{listStyle: 'none', padding: 0}} className="menu">
                        <li>
                            <Link to='/account' className="menu-items">Sign In</Link>
                        </li>
                    </ul>
                </div>
            </Menu>
        </div>
        </>
    )
}

export default SideBar