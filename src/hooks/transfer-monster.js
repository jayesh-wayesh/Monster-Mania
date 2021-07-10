import axios from 'axios';

export default async function TransferMonster(props){

    console.log('Inside transfer monster function')
    
    const transaction = {
        recipient: props.username,
        monsterID: props.monsterID,
    }

    var updatedMonsterCollection = props.monsterCollection  
    await axios.put('http://localhost:5000/monsters/transfer', transaction)
        .then(res => res.data)
        .then(monsterTransferred => {

            // Update current Award Monster
            var updatedtMonster = {
                name: monsterTransferred.name,
                edition: monsterTransferred.edition, 
                imageUrl: monsterTransferred.content_url 
            }
            props.setCurrentMonster(updatedtMonster) 

            // Update User's monster collection
            if( props.monsterCollection ){

                var updatedEditionsArray = []
                if( updatedMonsterCollection[props.monsterID].editions ){
                    updatedEditionsArray = updatedMonsterCollection[props.monsterID].editions
                }

                updatedEditionsArray.push(monsterTransferred.edition)
                var monsterInfo = {
                    name: monsterTransferred.name,
                    editions: updatedEditionsArray, 
                    imageUrl: monsterTransferred.content_url 
                }
                updatedMonsterCollection[props.monsterID] = monsterInfo
            }
        })
        .catch(err => console.log('⚠️ Error : ' + err))
    
    return updatedMonsterCollection
}