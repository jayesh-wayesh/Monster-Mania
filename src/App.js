  
import React,{ useState } from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";
import CreateMonster from "./hooks/create-monster";
import CreateUser from "./hooks/create-user";
import Profile from "./game/profile"; 

import Header from "./components/header";
import Footer from './components/footer'

function App() {

  const [username,setUsername] = useState()
  
  return (
    <div className="App">
      <div className="Container">
        <Header/>
        {/* <CreateMonster/>  // Use this component to mint new monsters */}
        {username
          ?
            <Profile username={username}/>
          :
            <CreateUser setUsername={setUsername}/>
        }
        <Footer/>
      </div>
    </div>
  );
}

export default App;