import React, { useState, useEffect } from "react"
import MonsterCard from '../components/monster-card'
import TransferMonster from '../hooks/transfer-monster'
import RetrieveMonster from '../hooks/retrieve-monster'
import DeleteMonster from '../hooks/delete-monster'
import Timer from '../helpers/timer';

const getRandomMonster = () => {
    const min = 1;
    const max = 10;
    const mediaID =  min + Math.floor(Math.random() * (max - min));
    return mediaID;
}

function sleep(ms) {
    console.log('dlwledwedlweml')
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Profile(props){

    const [collection, setCollection] = useState(new Array(12).fill(0))
    const [lockedMonsters, setLockedMonsters] = useState()
    const [unlockedMonsters, setUnlockedMonsters] = useState()
    const [delay, setDelay] = useState(null);
    const [transferStatus, setTransferStatus ] = useState()
    const [newMonster, setNewMonster] = useState()
    const [winner, setWinner] = useState(false)
    
    // For testing we are using : current_monster  = current_monster + 1
    //     instead of using : current_monster  = random()
    const [currentMediaID, setCurrentMediaID] = useState(1)
    

    useEffect(async () => {
        
        if(!delay && !winner){

            //var monsterMediaID = getRandomMonster()
            var monsterMediaID = currentMediaID
            setCurrentMediaID(currentMediaID + 1)

            setTransferStatus('Unlocking monster...')
            console.log(monsterMediaID)
            setNewMonster(monsterMediaID)

            //await sleep(8000)
            await TransferMonster({username: props.username, media_id: monsterMediaID })
                    
            const updatedCollection = await RetrieveMonster({ username: props.username })
            setCollection(updatedCollection)
            updateDisplay(updatedCollection)
                    
            setTransferStatus(null)
            setDelay(1000)
        }
      }, [delay]);

      
    const updateDisplay = (monsterList) => {
        
        var unlockedMonstersList = []
        var lockedMonstersList = []

        monsterList.forEach(
            function(value,key,map){
              if(value > 0){
                unlockedMonstersList.push(          
                  <MonsterCard 
                    currentMonster={key}
                    monsterCount={value}
                  />
                )
              }else if(key !== 0 && key !== 11){
                lockedMonstersList.push(          
                  <MonsterCard 
                    currentMonster={key}
                    monsterCount={value}
                  />
                )
              }
            }
        )

        setUnlockedMonsters(unlockedMonstersList)
        setLockedMonsters(lockedMonstersList)
        checkWinner(lockedMonstersList)
    }


    const checkWinner = async (lockedMonstersList) => {
        if(lockedMonstersList.length == 0){

            setWinner(true)

            // call delete-monster
            await DeleteMonster({username: props.username })

            // transfer King monster
            await TransferMonster({username: props.username, media_id: 11 })
        }
    }


    return (
        <>
            {winner &&
                <section className="section-nft-drop">
                    <h4>Congrats, You Won King Monster! 🎉</h4>
                    <div className="container">
                        <MonsterCard 
                            currentMonster={11}
                            monsterCount={1}
                        />
                    </div>
                </section>
            } 
            {!winner &&
                <>
                    {newMonster &&
                        <section className="section-nft-drop">
                            {transferStatus
                                ? <h4>Unlocking today's Monster..</h4>
                                : <h4>New Monster Unlocked 🎉</h4>
                            }
                            <div className="container">
                                <MonsterCard 
                                    currentMonster={newMonster}
                                    monsterCount={transferStatus ? 0 : collection[newMonster]}
                                />
                            </div>
                        </section>
                    }
                    <section className="section">
                        <h2>Monsters Collected</h2>
                        {collection &&
                            <div className="container">
                                <>{unlockedMonsters}</>
                            </div>
                        }
                    </section>
                    <Timer
                        delay={delay}
                        setDelay={setDelay}
                    />
                    <section className="section">
                        <h2>Missing Monsters</h2>
                        {collection &&
                            <div className="container">
                                <>{lockedMonsters}</>
                            </div>
                        }
                    </section>
                </>
            }
        </>
    );
}