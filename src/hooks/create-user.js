import React, { useState } from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button'


export default function CreateUser(props) {

	const [userInput, setUserInput] = useState('')
	
	const onChangeUser = (e) => {
		setUserInput(e.target.value)
	}
	
	const onSubmit = async (e) => {
		e.preventDefault();
		
		const username = userInput;
		const newUser = {
			username: username, //<string>
		}

		await axios.get('http://localhost:5000/users/')
		.then(res => {  
			var userExist = res.data.find(user => user === username)
			return userExist
		})
		.then(userExist => {
			if(userExist === undefined) {
				axios.post('http://localhost:5000/users/add', newUser)
					.then(res => console.log(res.data))
			}else{
				props.setOldUser(true)
			}
			props.setUsername(username)
		})
		
		localStorage.setItem("username", username)
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
				<br/>
				<div className="form-group">
				<Button className="login" type="submit" size="small" variant="outlined">
					Start game
				</Button>
				</div>
			</form>
		</section>
	)
}