import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default async function RetrieveMonster(props){
    
    console.log('props')
    console.log(props)

    const user = {
        username: props.username
    }

    console.log('user')
    console.log(user)
    
    const ans =  await axios.get('http://localhost:5000/users/' + props.username) 
                            .then(res => res.data)
                            .then(monsters => {
                                var tempCollection = new Array(12).fill(0) 
                                monsters.map(monster => {
                                    tempCollection[monster.media_id]++
                                })
                                console.log(tempCollection)
                                return tempCollection
                            })
    
    return ans
}