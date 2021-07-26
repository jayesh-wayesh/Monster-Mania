  
import React, { useState } from 'react'
import CreateMonster from './hooks/create-monster'
import CreateUser from './hooks/create-user'
import Game from './game/game'
import Header from './components/header'
import Footer from './components/footer'
import Account from './components/account'
import './App.css'
const DEVELOPER_ACCOUNT=process.env.REACT_APP_DEVELOPER_ACCOUNT


function App() {

    const [username,setUsername] = useState()
    const [oldUser, setOldUser] = useState(false)

    return (
        <div className="App">
            <div className="Container">
                <Header/>
                    <Account
                        username={username}
                        setUsername={setUsername}
                        setOldUser={setOldUser}
                    />
                    {username
                        ?
                        <>
                            {(username === DEVELOPER_ACCOUNT)
                                ?
                                <CreateMonster/>
                                :
                                <Game
                                    username={username}
                                    oldUser={oldUser}
                                    setOldUser={setOldUser}
                                />
                            }
                        </>
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