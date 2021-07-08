import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
const monsterArray = [
    "Select Monster",
    "Monster 1: Birdy Boss",
    "Monster 2: Casper Spray",
    "Monster 3: Hit Woman",
    "Monster 4: Aqua Coach",
    "Monster 5: Thunder Kid",
    "Monster 6: Mad Sauce",
    "Monster 7: Octo Crush",
    "Monster 8: Shady Stick",
    "Monster 9: Sawft Ball",
    "Monster 10: Hippie Puns",
    "King Monster: King Cyborg"
]

export default function CreateMonster() {

    const inputRef = useRef(null);
    const [monsterDropDown, setMonsterDropDown] = useState([])
    const [monster, setMonster] = useState()
    const [editions, setEditions] = useState(0)

    // initialzing monster list
    useEffect(() => {    
        setMonsterDropDown(monsterArray)
    }, []);
        
    // current selected monster
    const onChangeMonster = (e) => {
        var selectedMonster = e.target.value
        var monsterID 

        monsterArray.map((monsterName,index) => {
            if(monsterName === selectedMonster){
                monsterID = index
            }
        })
        setMonster(monsterID)
    }

    // update number of editions to be minted
    const onChangeEditions = (e) => {
        setEditions(e.target.value)
    }
    
    const onSubmit = async (e) => {
        e.preventDefault();
        const newMonsters = {
            last_nft_id: 280, // temp variable till demo app is not attached to api
            editions: editions,
            monsterID: monster,
        }

        await axios.post('http://localhost:5000/monsters/create', newMonsters)
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