  
import React,{ useState, useEffect } from 'react'
import './App.css'
import CreateMonster from './hooks/create-monster'
import CreateUser from './hooks/create-user'
import Profile from './game/profile'
import Header from './components/header'
import Footer from './components/footer'


const logout = () => {
  localStorage.removeItem('username')
  window.location = '/';
}


function App() {

  const [username,setUsername] = useState()
  const [oldUser, setOldUser] = useState(false)


  useEffect(() => {
    if(localStorage.getItem('username')){
      var currentUser = localStorage.getItem('username')
      setUsername(currentUser)
    }
  }, []);
  

  return (
    <div className="App">
      <div className="Container">
        {username && 
          <div className="container-x">
            <div>👤 {username}</div>
            <button onClick={logout}>Log Out</button> 
          </div>
        }
        <Header/>
        {/* <CreateMonster/>  // Use this component to mint new monsters */}
        {username
          ?
            <Profile
              username={username}
              oldUser={oldUser}
              setOldUser={setOldUser}
            />
          :
            <CreateUser 
              setUsername={setUsername}
              setOldUser={setOldUser}
            />
        }
        <Footer/>
      </div>
    </div>
  );
}

export default App;