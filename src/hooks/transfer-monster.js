import axios from 'axios';

export default async function TransferMonster(props){

    console.log('0 Inside transfer monster..')
    
    const transaction = {
        recipient: props.username,
        monsterID: props.monsterID,
    }

    var updatedMonsterCollection = props.monsterCollection  
    await axios.put('http://localhost:5000/monsters/transfer', transaction)
        .then(res => res.data)
        .then(monsterTransferred => {

            console.log('1 monsterTransferred :', monsterTransferred)

            // Update current Award Monster
            var updatedtMonster = {
                name: monsterTransferred.name,
                edition: monsterTransferred.edition, 
                imageUrl: monsterTransferred.content_url 
            }
            props.setCurrentMonster(updatedtMonster) 

            // Update User's monster collection
            if( props.monsterCollection ){

                console.log("2 before updation : ", updatedMonsterCollection)

                var updatedEditionsArray = []
                if( updatedMonsterCollection[props.monsterID].editions ){
                    updatedEditionsArray = updatedMonsterCollection[props.monsterID].editions
                }

                console.log("2.5 updatedEditionsArray : ", updatedEditionsArray)

                updatedEditionsArray.push(monsterTransferred.edition)
                console.log("2.7 updatedEditionsArray : ", updatedEditionsArray)

                var monsterInfo = {
                    name: monsterTransferred.name,
                    editions: updatedEditionsArray, 
                    imageUrl: monsterTransferred.content_url 
                }
                console.log("2.9 monsterInfo : ", monsterInfo)

                updatedMonsterCollection[props.monsterID] = monsterInfo

                console.log("3 after updation : ", updatedMonsterCollection)
            }
        })
        .catch(err => console.log('⚠️ Error : ' + err))
    
    return updatedMonsterCollection
}