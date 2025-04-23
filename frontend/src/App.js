import './App.css';
import Home from './Components/Home/home';
import Cable from './Components/Cable/cable';
import Power from './Components/Power/power';
import Form from './Components/Form/form';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import DropDown from './Components/Account/account';
import Login from './Components/Login/login';
import Register from './Components/Register/register';
import Home2 from './Components/Home2/home2';
import Updates from './Components/Worker/Worker_Updates/updates';
import React, {useState} from 'react';
import Worker_Register from './Components/Worker/Worker_Register/worker_register';
import Worker_Login from './Components/Worker/worker_Login/worker_login';
import { TweetProvider } from './Components/TweetContext';
import CreditCardForm from './Components/Card_Info/card_info';
import Muvo_History from './Components/Muvo_history/muvo_history';

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
      <TweetProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='cable' element={<Cable />} />
          <Route path='power' element={<Power />} />
          <Route path='form' element={<Form />} />
          <Route path='/account' element={<DropDown />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home2' element={<Home2 />} />
          <Route path='/update' element={<Updates />} />
          <Route path='/worker_register' element={<Worker_Register />} />
          <Route path='/worker_login' element={<Worker_Login />} />
          <Route path='/card_info' element={<CreditCardForm />} />
          <Route path='/muvo_history' element={<Muvo_History />} />
        </Routes>
        </TweetProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
