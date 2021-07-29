import React, { useState } from "react"
import axios from 'axios'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
const monsterDropDown = [
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

    const [monsterID, setMonsterID] = useState(1)
    const [monster, setMonster] = useState("Monster 1: Birdy Boss")
    const [editions, setEditions] = useState(0)
    const [mintingStatus, setMintingStatus] = useState()
        
    // current selected monster
    const onChangeMonster = (e) => {
        var selectedMonster = e.target.value
        setMonster(selectedMonster)

        var monsterID 
        monsterDropDown.forEach((monsterName,index) => {
            if(monsterName === selectedMonster){
                monsterID = index + 1
            }
        })
        setMonsterID(monsterID)
    }

    // update number of editions to be minted
    const onChangeEditions = (e) => {
        setEditions(e.target.value)
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()
        setMintingStatus('Minting...')

        if(editions > 0){
            const newMonsters = {
                editions: editions,
                monsterID: monsterID,
            }
    
            console.log('newMonster : ', newMonsters)
            await axios.post(process.env.REACT_APP_BACKEND_URL + '/monsters/create', newMonsters)
                .then(res => console.log(res.data));

            setMintingStatus('✅ NFTs Minted')
        }else{
            alert('⚠️ Number of editions should be greater than 0')
        }
    }


    return (
        <section className="section">
            <h3>Mint NFTs : </h3>
            <div><p>{mintingStatus}</p></div>
            <form className="form-group" noValidate autoComplete="off">
                <div className="form-input">
                    <TextField
                        id="outlined-select-currency-native"
                        select
                        label="Monster"
                        value={monster}
                        onChange={onChangeMonster}
                        SelectProps={{
                            native: true,
                        }}
                        helperText="Please select monster to be minted"
                        variant="outlined"
                    >
                    {monsterDropDown.map((option) => (
                        <option key={option} value={option}>
                        {option}
                        </option>
                    ))}
                    </TextField>
                </div>
                <div className="form-input">
                    <TextField 
                        id="outlined-basic"
                        label="Editions"
                        variant="outlined"
                        className="form-control"
                        value={editions}
                        onChange={onChangeEditions}
                    />
                </div>
                <div>
                    <Button 
                        className="login" 
                        type="submit" 
                        size="small" 
                        variant="outlined" 
                        onClick={onSubmit}
                    >
                        Mint NFTs
                    </Button>
                </div>
            </form>
		</section>
    )
}