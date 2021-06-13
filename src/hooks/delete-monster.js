import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default async function DeleteMonster(props){
    
    const transaction = {
        owner_account_id: props.username,
    }
    console.log(transaction)

    return await axios.delete('http://localhost:5000/users/' +  props.username)
                    .then(response => { console.log(response.data)}); 
    
}