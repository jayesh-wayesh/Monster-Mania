import React, { useState } from "react";
import axios from 'axios';



export default function CreateUser(props) {

  const [userInput, setUserInput] = useState('')
  
  const onChangeUser = (e) => {
    setUserInput(e.target.value)
  }
   
  const onSubmit = (e) => {
    e.preventDefault();
    
    const username = userInput;
    const newUser = {
      username: username, //<string>
    }

    axios.post('http://localhost:5000/users/add', newUser)
         .then(res => console.log(res.data))
         .then(() => props.setUsername(username))

    console.log('here')
  }

  return (
    <section className="section">
    <h2>Sign up : </h2>
    <br/>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username : </label>
          <input 
              type="text" 
              className="form-control"
              value={userInput}
              onChange={onChangeUser}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Start game" className="btn btn-primary" />
        </div>
      </form>
      </section>
  )
}