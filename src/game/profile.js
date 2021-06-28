import React, { useState, useEffect } from "react"
import MonsterCard from '../components/monster-card'
import TransferMonster from '../hooks/transfer-monster'
import RetrieveMonsters from '../hooks/retrieve-monsters'
import DeleteMonster from '../hooks/delete-monster'
import Timer from '../helpers/timer'
import { updateWinner, isWinner, updateTimeOfLatestDrop, getNewTimerValue, getRandomMonster } from '../hooks/update-game-status'

const NFT_DROP_INTERVAL = 60


export default function Profile(props){

    const [collection, setCollection] = useState(new Array(12).fill(0))
    const [lockedMonsters, setLockedMonsters] = useState()
    const [unlockedMonsters, setUnlockedMonsters] = useState()
    const [delay, setDelay] = useState()
    const [transferStatus, setTransferStatus ] = useState()
    const [newMonster, setNewMonster] = useState()
    const [winner, setWinner] = useState(false)
    const [monsterPropsArray, setMonsterPropsArray] = useState(
        new Array(12).fill({
            name: null, 
            edition: '0', 
            imageUrl: null
        }
    ))
    const [timerCount, setTimerCount] = useState()
    const [startGame, setStartGame] = useState(false)
    const [dropOnLogin, setDropOnLogin] = useState(true)
 
    // For testing we are using : current_monster  = current_monster + 1
    //     instead of using : current_monster  = random()
    const [currentMediaID, setCurrentMediaID] = useState(1)

    useEffect(async () => {

        if(props.oldUser){

            const kingMonster = await isWinner( props.username )
            if(kingMonster){
                setTransferStatus(1)
                setWinner(true)

                // update collection
                setCollection(() => {
                    var updatedCollection = collection
                    updatedCollection[11] = 1
                    return updatedCollection
                })

                // update king monster props
                setMonsterPropsArray(() => {
                    var updatedMonsterPropsArray = monsterPropsArray
                    updatedMonsterPropsArray[11] = {
                        name: kingMonster.name,
                        edition: kingMonster.edition,
                        imageUrl: kingMonster.content_url
                    }
                    return updatedMonsterPropsArray
                })

                setTransferStatus(null)
            }else{
                const newTimerValue = await getNewTimerValue( props.username, NFT_DROP_INTERVAL )
                if( newTimerValue !== NFT_DROP_INTERVAL ){
                    setDropOnLogin(false)
                }
                setTimerCount( newTimerValue )  
                setStartGame(true) 
            } 
        }else{
            setTimerCount( NFT_DROP_INTERVAL )
            setStartGame(true)
        }

    }, []);
    

    useEffect(async () => {

        if(startGame && !delay && !winner){
            
            var updatedMonsterPropsArray = [] 
            // var updatedMonsterEditionArray = [] 
            var updatedCollection = []
            var response = []

            // In case user is an existing one and has just entered the game 
            if(dropOnLogin){
                
                // Next NFT drop
                var monsterID = currentMediaID
                setCurrentMediaID(currentMediaID + 1)
                setTransferStatus('Unlocking monster...')
                setNewMonster(monsterID)

                // update monster props for transferred monster
                updatedMonsterPropsArray = await TransferMonster({username: props.username, monsterID: monsterID, monsterPropsArray: monsterPropsArray })
                setMonsterPropsArray(updatedMonsterPropsArray) 

                // update database
                await updateTimeOfLatestDrop(props.username)
            }else{
                setDropOnLogin(true)
            }
            
            // In case user is an old one, we need to initialise edition array for existing monsters once 
            // along with updated monster collection   
            if( props.oldUser ){

                response = await RetrieveMonsters({ username: props.username, monsterPropsArray: monsterPropsArray })
                updatedMonsterPropsArray = response[1]
                setMonsterPropsArray(updatedMonsterPropsArray) 

                props.setOldUser(false)
            }else{
                response = await RetrieveMonsters({ username: props.username })
            }
            updatedCollection = response[0]
            setCollection(updatedCollection)

            // update UI
            updateDisplay(updatedCollection, updatedMonsterPropsArray)

            // King monster transfer complete
            setTransferStatus(null)

            // Start timer
            setDelay(1000)
        }
      }, [delay, startGame]);

    const updateDisplay = (monsterList, updatedMonsterPropsArray) => {
        
        var unlockedMonstersList = []
        var lockedMonstersList = []

        monsterList.forEach(
            (monsterCount,monsterId,map) => {

                var monsterProps = updatedMonsterPropsArray[ monsterId ]
                
                if(monsterCount > 0){
                    unlockedMonstersList.push(          
                        <MonsterCard 
                            currentMonster={monsterId}
                            monsterCount={monsterCount}
                            monsterProps={monsterProps}
                        />
                    )
                }else if(monsterId !== 0 && monsterId !== 11){
                    lockedMonstersList.push(          
                        <MonsterCard 
                            currentMonster={monsterId}
                            monsterCount={monsterCount}
                            monsterProps={monsterProps}
                        />
                    )
                }
            }
        )
        
        // Update UI
        setUnlockedMonsters(unlockedMonstersList)
        setLockedMonsters(lockedMonstersList)
        
        // Check if user has collected all the 10 monsters
        checkWinner(lockedMonstersList)
    }


    const checkWinner = async (lockedMonstersList) => {
        
        // User collected all the 10 monsters
        if(lockedMonstersList.length == 0){

            // King monster transfer starts
            setTransferStatus('Unlocking monster...')

            // call delete-monster
            await DeleteMonster({username: props.username })

            // transfer King monster
            const updatedMonsterPropsArray = await TransferMonster({username: props.username, monsterID: 11, monsterPropsArray: monsterPropsArray })
            setMonsterPropsArray( updatedMonsterPropsArray ) 

            // King monster transfer complete
            setTransferStatus(null)
            
            // update state
            setWinner(true)
            
            // update database
            await updateTimeOfLatestDrop( props.username )
            await updateWinner( props.username )
        }
    }


    return (
        <>
            {winner &&
                <section className="section-nft-drop">
                    {transferStatus
                        ? <h4>Unlocking King Monster..</h4>
                        : <h4>Congrats, You Won King Monster! 👑</h4>
                    }
                    <div className="container">
                        <MonsterCard 
                            currentMonster={11}
                            monsterCount={transferStatus ? 0 : 1}
                            monsterProps={transferStatus ? null : monsterPropsArray[11]}
                        />
                    </div>
                </section>
            } 
            {startGame && !winner &&
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
                                    monsterProps={transferStatus ? null : monsterPropsArray[newMonster]}
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
                        timerCount={timerCount} 
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