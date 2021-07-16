import React, { useState, useEffect } from "react"
import MonsterCard from '../components/monster-card'
import TransferMonster from '../hooks/transfer-monster'
import RetrieveMonsters from '../hooks/retrieve-monsters'
import DeleteMonster from '../hooks/delete-monster'
import Timer from '../helpers/timer'
import { updateWinner, isWinner, updateTimeOfLatestAward, getNewTimerValue, getRandomMonster, NEW_AWARD_INTERVAL } from '../hooks/update-game-status'


export default function Game(props){

    const [lockedMonsters, setLockedMonsters] = useState()
    const [unlockedMonsters, setUnlockedMonsters] = useState()
    const [delay, setDelay] = useState()
    const [transferStatus, setTransferStatus ] = useState()
    const [newMonster, setNewMonster] = useState()
    const [winner, setWinner] = useState(false)
    const [timerCount, setTimerCount] = useState()
    const [startGame, setStartGame] = useState(false)
    const [transferAwardOnLogin, setTransferAwardOnLogin] = useState(true)
 
    // For testing we are using : current_monster  = current_monster + 1
    //     instead of using : current_monster  = random()
    const [currentMediaID, setCurrentMediaID] = useState(1)

    const [monsterCollection, setMonsterCollection]  = useState(
        new Array(12).fill({
            name: null, 
            editions: null, 
            imageUrl: null
        })
    )

    const [currentMonster, setCurrentMonster] = useState({
        name: null, 
        edition: 0, 
        imageUrl: null
    })

    useEffect(() => {
        async function checkWinnerFunc() {
            if(props.oldUser){

                // Check if user is already a winner
                const kingMonster = await isWinner( props.username )
                if(kingMonster){
                    setTransferStatus('Loading monster...')
                    setWinner(true)
    
                    // update king monster props
                    setCurrentMonster({
                        name: kingMonster.name,
                        edition: kingMonster.edition,
                        imageUrl: kingMonster.content_url
                    })
    
                    setTransferStatus(null)
                }else{
                    const newTimerValue = await getNewTimerValue( props.username )
                    if( newTimerValue !== NEW_AWARD_INTERVAL ){
                        setTransferAwardOnLogin(false)
                    }
                    setTimerCount( newTimerValue )  
                    setStartGame(true) 
                } 
            }else{
                setTimerCount( NEW_AWARD_INTERVAL )
                setStartGame(true)
            }
        } 
        checkWinnerFunc()
    },[]); // eslint-disable-line
    

    useEffect(() => {
        async function startGameFunc() {
            
            if(startGame && !delay && !winner){

                var updatedMonsterCollection = monsterCollection

                // In case current user is an old user, fetch user's monster collection from database 
                if( props.oldUser ){
                    updatedMonsterCollection = await RetrieveMonsters({ username: props.username })
                    setMonsterCollection(updatedMonsterCollection)
                    
                    props.setOldUser(false)
                    updateDisplay(updatedMonsterCollection)
                }
    
                /**
                 * 
                 *  In case current user is a new user 
                 *       OR
                 *  In case current user is an old user and logins after `NEW_AWARD_INTERVAL` 
                 * 
                 */
                if(transferAwardOnLogin){
                    // Next NFT award
                    var monsterID = currentMediaID
                    setCurrentMediaID(currentMediaID + 1)
                    setTransferStatus('Unlocking monster...')
                    setNewMonster(monsterID)
        
                    // update monster collection for transferred monster
                    updatedMonsterCollection = await TransferMonster({username: props.username, monsterID: monsterID, setCurrentMonster: setCurrentMonster, monsterCollection: updatedMonsterCollection })
                    setMonsterCollection(updatedMonsterCollection)
    
                    // update database
                    await updateTimeOfLatestAward(props.username)
                }else{
                    setTransferAwardOnLogin(true)
                }
    
                // update UI
                updateDisplay(updatedMonsterCollection)
    
                // King monster transfer complete
                setTransferStatus(null)
    
                // Start timer
                setDelay(1000)
            }
        }
        startGameFunc()
      }, [delay, startGame]); // eslint-disable-line

    const updateDisplay = (updatedMonsterCollection) => {

        var unlockedMonstersList = []
        var lockedMonstersList = []

        updatedMonsterCollection.forEach(
            (monster,monsterId,map) => {

                if( monsterId > 0 && monsterId < 11 ){
                    if( monster.editions ){

                        monster.editions.forEach(
                            edition => {

                                var monsterProps = {
                                    name: monster.name,
                                    edition: edition,
                                    imageUrl: monster.imageUrl
                                }
    
                                unlockedMonstersList.push(          
                                    <MonsterCard 
                                        currentMonster={monsterId}
                                        monsterProps={monsterProps}
                                    />
                                )
                            }
                        )
                    }else{
                        var monsterProps = {
                            name: null,
                            edition: null,
                            imageUrl: null
                        }

                        lockedMonstersList.push(          
                            <MonsterCard 
                                currentMonster={monsterId}
                                monsterProps={monsterProps}
                            />
                        )
                    }
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
        if(lockedMonstersList.length === 0){
            // kill timer
            setDelay(null)

            // King monster transfer starts
            setTransferStatus('Unlocking monster...')

            // call delete-monster
            await DeleteMonster({username: props.username })

            // transfer King monster
            await TransferMonster({username: props.username, monsterID: 11, setCurrentMonster: setCurrentMonster })

            // King monster transfer complete
            setTransferStatus(null)
            
            // update state
            setWinner(true)
            
            // update database
            await updateTimeOfLatestAward( props.username )
            await updateWinner( props.username )
        }
    }


    return (
        <>
            {winner &&
                <section className="section-nft-award">
                    {transferStatus
                        ? <h4>Unlocking King Monster..</h4>
                        : <h4>Congrats, You Won King Monster! 👑</h4>
                    }
                    <div className="container">
                        <MonsterCard 
                            currentMonster={11}
                            monsterProps={transferStatus ? null : currentMonster}
                        />
                    </div>
                </section>
            } 
            {startGame && !winner &&
                <>
                    {newMonster &&
                        <section className="section-nft-award">
                            {transferStatus
                                ? <h4>Unlocking today's Monster..</h4>
                                : <h4>New Monster Unlocked 🎉</h4>
                            }
                            <div className="container">
                                <MonsterCard 
                                    currentMonster={newMonster}
                                    monsterProps={transferStatus ? null : currentMonster}
                                />
                            </div>
                        </section>
                    }
                    <section className="section">
                        <h2>Monsters Collected</h2>
                        {monsterCollection &&
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
                        {monsterCollection &&
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