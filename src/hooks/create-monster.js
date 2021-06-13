import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default function CreateMonster() {

  const inputRef = useRef(null);
  const monsterNames = ["Monster 1","Monster 2","Monster 3","Monster 4","Monster 5","Monster 6","Monster 7","Monster 8","Monster 9","Monster 10","King Monster"]
  const [monsterList, setMonsterList] = useState([])
  const [monster, setMonster] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [editions, setEditions] = useState(0)
  const [monsterMediaID, setMonsterMediaID] = useState()

  // initialzing monster list
  useEffect(() => {
    setMonsterList(monsterNames)
  }, []);
  
  // current selected monster
  const onChangeMonster = (e) => {
    setMonster(e.target.value)

    monsterNames.map((monsterName,index) => {
      if(monsterName == e.target.value){
        var mediaID = index + 1
        var url = "https://storage.googleapis.com/opensea-prod.appspot.com/creature/" + mediaID + ".png"
        setImageUrl(url)
        setMonsterMediaID(mediaID)
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
      last_nft_id: 150, // temp variable till demo app is not attached to api
      editions: editions,
      media_id: monsterMediaID,
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
                monsterList.map(function(monster,index) {
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