import React, { useState } from "react"
import axios from 'axios'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'


export default function CreateUser(props) {

    const [accountUsername, setAccountUsername] = useState('')
    const [accountPassword, setAccountPassword] = useState('')
    const [accountCreationStatus, setAccountCreationStatus] = useState()
    
    const onChangeUser = (e) => {
        setAccountUsername(e.target.value)
    }
        
    const onChangePassword = (e) => {
        setAccountPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
                
        const username = accountUsername;
        const newUser = {
            username: username, 
            password: accountPassword,
        }

        await axios.put('http://localhost:5000/users/' + username + '/authenticate', {password: accountPassword})
            .then(res => {  
                var authenticate = res.data.authenticate
                return authenticate
            })
            .then(async (authenticate) => {

                console.log('authenticate : ', authenticate)
                if(authenticate === false){
                    alert('⚠️ Password Incorrect')
                }else{
                    // Create new user
                    if(authenticate === undefined){
                        setAccountCreationStatus('⌛ Creating new account on Flow...')
                        await axios.post('http://localhost:5000/users/add', newUser)
                            .then(res => console.log(res.data))
                        setAccountCreationStatus('✅ Account created! ')
                    }else{
                        // old user
                        props.setOldUser(true)
                    }
                    props.setUsername(username)
                    localStorage.setItem("username", username)
                    console.log('username : ', username)
                }
            })
            .catch(err => console.log('⚠️ Error : ' + err))
    }

    return (
        <section className="section">
            <h2>Sign Up or Log In :</h2>
            <div><p>{accountCreationStatus}</p></div>
            <form className="form-group" noValidate autoComplete="off">
                <div className="form-input">
                    <TextField 
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        className="form-control"
                        value={accountUsername}
                        onChange={onChangeUser}
                    />
                </div>
                <div className="form-input"> 
                    <TextField 
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        className="form-control"
                        value={accountPassword}
                        onChange={onChangePassword}
                    />
                </div>
                <div>
                    <Button 
                        className="login" 
                        type="submit" 
                        size="small" 
                        variant="outlined" 
                        onClick={handleSubmit}
                    >
                        Start game
                    </Button>
                </div>
			</form>
		</section>
	)
}