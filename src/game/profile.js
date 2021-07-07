import React, { useState, useEffect } from "react"
import MonsterCard from '../components/monster-card'
import TransferMonster from '../hooks/transfer-monster'
import RetrieveMonsters from '../hooks/retrieve-monsters'
import DeleteMonster from '../hooks/delete-monster'
import Timer from '../helpers/timer'
import { updateWinner, isWinner, updateTimeOfLatestDrop, getNewTimerValue, getRandomMonster } from '../hooks/update-game-status'

const NFT_DROP_INTERVAL = 60


export default function Profile(props){

    // const [collection, setCollection] = useState(new Array(12).fill(0))
    const [lockedMonsters, setLockedMonsters] = useState()
    const [unlockedMonsters, setUnlockedMonsters] = useState()
    const [delay, setDelay] = useState()
    const [transferStatus, setTransferStatus ] = useState()
    const [newMonster, setNewMonster] = useState()
    const [winner, setWinner] = useState(false)
    // const [monsterPropsArray, setMonsterPropsArray] = useState(
    //     new Array(12).fill({
    //         name: null, 
    //         edition: '0', 
    //         imageUrl: null
    //     }
    // ))

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

    const [timerCount, setTimerCount] = useState()
    const [startGame, setStartGame] = useState(false)
    const [dropOnLogin, setDropOnLogin] = useState(true)
 
    // For testing we are using : current_monster  = current_monster + 1
    //     instead of using : current_monster  = random()
    const [currentMediaID, setCurrentMediaID] = useState(1)

    // useEffect(() => {
    //     console.log('0.0 monsterCollection : ', monsterCollection)

    // }, [monsterCollection])

    useEffect(async () => {

        console.log('0 monsterCollection : ', monsterCollection)

        if(props.oldUser){

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

            var updatedMonsterCollection = []

            // In case user is an existing one and has just entered the game 
            if(dropOnLogin){
                console.log('1')
                // Next NFT drop
                var monsterID = currentMediaID
                setCurrentMediaID(currentMediaID + 1)
                setTransferStatus('Unlocking monster...')
                setNewMonster(monsterID)

                console.log('monsterCollection b: ', monsterCollection)

                // update monster props for transferred monster
                updatedMonsterCollection = await TransferMonster({username: props.username, monsterID: monsterID, setCurrentMonster: setCurrentMonster, monsterCollection: monsterCollection })
                setMonsterCollection(updatedMonsterCollection)

                console.log('monsterCollection a: ', monsterCollection)
                console.log('updatedMonsterCollection: ', updatedMonsterCollection)


                // update database
                await updateTimeOfLatestDrop(props.username)
            }else{
                console.log('2')

                setDropOnLogin(true)
            }
            
            // In case user is an old one, we need to initialise edition array for existing monsters once 
            // along with updated monster collection 
            if( props.oldUser ){
                console.log('3')

                updatedMonsterCollection = await RetrieveMonsters({ username: props.username })
                setMonsterCollection(updatedMonsterCollection)
                props.setOldUser(false)
            }

            // update UI
            updateDisplay(updatedMonsterCollection)

            // King monster transfer complete
            setTransferStatus(null)

            // Start timer
            setDelay(1000)
        }
      }, [delay, startGame]);

    const updateDisplay = (updatedMonsterCollection) => {
        // console.log('4')

        // console.log('updatedMonsterCollection : ', updatedMonsterCollection)
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
    
                                console.log('monsterprops : ', monsterProps)
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
                            name: monster.name,
                            edition: null,
                            imageUrl: monster.imageUrl
                        }

                        lockedMonstersList.push(          
                            <MonsterCard 
                                currentMonster={monsterId}
                                monsterProps={props}
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
        
        console.log('lockedMonsters : ', lockedMonsters)
        console.log('unlockedMonsters : ', unlockedMonsters)

        // User collected all the 10 monsters
        if(lockedMonstersList.length == 0){
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
                            monsterProps={transferStatus ? null : currentMonster}
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