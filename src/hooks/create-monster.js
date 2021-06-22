import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import {getMonsterName, getmonsterImage, monsterNames} from "../helpers/content"


export default function CreateMonster() {

  const inputRef = useRef(null);
  const [monsterDropDown, setMonsterDropDown] = useState([])
  const [monster, setMonster] = useState('')
  const [monsterProperties, setMonsterProperties] = useState('')
  const [editions, setEditions] = useState(0)


  // initialzing monster list
  useEffect(() => {    
    setMonsterDropDown(monsterNames)
  }, []);
  

  // current selected monster
  const onChangeMonster = (e) => {
    var selectedMonster = e.target.value
    setMonster(selectedMonster)

    monsterNames.map((monsterName,index) => {
      if(monsterName === selectedMonster){
        var name = getMonsterName(index)
        var imageUrl = getmonsterImage(index)
        var monsterID = index + 1
        setMonsterProperties({name: name, imageUrl: imageUrl, monsterID: monsterID})
      }
    })
  }


  // update number of editions to be minted
  const onChangeEditions = (e) => {
    setEditions(e.target.value)
  }
   

  const onSubmit = (e) => {
    e.preventDefault();

    const newMonsters = {
      last_nft_id: 220, // temp variable till demo app is not attached to api
      editions: editions,
      monsterProperties: monsterProperties
    }

    axios.post('http://localhost:5000/monsters/create', newMonsters)
         .then(res => console.log(res.data));
  }


  return (
    <section className="section">
      <h3>Mint NFTs : </h3>
      <form onSubmit={onSubmit}>
        <div className="form-group"> 
          <label>Username: </label>
          <select ref={inputRef}
              required
              className="form-control"
              value={monster}
              onChange={onChangeMonster}>
              {
                monsterDropDown.map(function(monster,index) {
                  return <option 
                    key={index}
                    value={monster}>{monster}
                    </option>;
                })
              }
          </select>
        </div>
        <div className="form-group">
          <label>Editions : </label>
          <input 
              type="text" 
              className="form-control"
              value={editions}
              onChange={onChangeEditions}
              />
        </div>

        <div className="form-group">
          <input type="submit" value="Mint NFTs" className="btn btn-primary" />
        </div>
      </form>
    </section>
  )
}