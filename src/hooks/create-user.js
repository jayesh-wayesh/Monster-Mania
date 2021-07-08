import React, { useState } from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
        Text: 'center'
      },
    },
  }));

export default function CreateUser(props) {

    const [accountUsername, setAccountUsername] = useState('')
    const [accountPassword, setAccountPassword] = useState('')
    const classes = useStyles()
        
    const onChangeUser = (e) => {
        setAccountUsername(e.target.value)
    }
        
    const onChangePassword = (e) => {
        setAccountPassword(e.target.value)
    }

    const onSubmit = async (e) => {
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

                // if(authenticate === false){
                //     alert('⚠️ Password Incorrect')
                // }else{
                //     // Create new user
                //     if(authenticate === undefined){
                //         await axios.post('http://localhost:5000/users/add', newUser)
                //             .then(res => console.log(res.data))
                //     }else{
                //         // old user
                //         props.setOldUser(true)
                //     }
                //     props.setUsername(username)
                //     localStorage.setItem("username", username)
                // }
            })
            .catch(err => console.log('⚠️ Error : ' + err))
    }

    return (
        <section className="section">
            <h2>Sign up : </h2>
            <br/>
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField 
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        className="form-control x"
                        value={accountUsername}
                        onChange={onChangeUser}
                    />
                </div>
                <div>
                    <TextField 
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        className="form-control x"
                        value={accountPassword}
                        onChange={onChangePassword}
                    />
                </div>
                <div>
                    <Button className="login" type="submit" size="small" variant="outlined">
                        Start game
                    </Button>
                </div>
			</form>
		</section>
	)
}