import React, { useEffect } from "react";
import Button from '@material-ui/core/Button'


const logout = () => {
    localStorage.removeItem('username')
    window.location = '/';
}


export default function Account(props) {

    useEffect(() => {
        if(localStorage.getItem('username')){
            var currentUser = localStorage.getItem('username')
            props.setUsername(currentUser)
            props.setOldUser(true)
        }
    }, []);


    return (
        <>
        {props.username && 
            <>
                <div className="account">
                    <div className="username">👤 {props.username}</div>
                    <Button  className="logout" onClick={logout} size="small" variant="outlined" color="secondary">
                        Log Out
                    </Button>
                </div>
            </> 
        }
        </>  
    )
}