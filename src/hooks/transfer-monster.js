import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default async function TransferMonster(props){
    
    const transaction = {
        recipient: props.username,
        media_id: props.media_id,
    }

    console.log('transaction')
    console.log(transaction)
    
    return await axios.put('http://localhost:5000/monsters/transfer', transaction)
           .then(res => res)

}