  
import React,{ useState } from 'react'
import './App.css'
import CreateMonster from './hooks/create-monster'
import CreateUser from './hooks/create-user'
import Profile from './game/profile'
import Header from './components/header'
import Footer from './components/footer'
import Account from './components/account'


function App() {

    const [username,setUsername] = useState()
    const [oldUser, setOldUser] = useState(false)


  return (
    <div className="App">
        <div className="Container">
            <Account
                username={username}
                setUsername={setUsername}
                setOldUser={setOldUser}
            />
            <Header/>
            {/* <CreateMonster/> // Use this component to create Monsters */}
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