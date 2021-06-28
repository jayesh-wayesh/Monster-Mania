import axios from 'axios';

export default async function TransferMonster(props){
    
    const transaction = {
        recipient: props.username,
        monsterID: props.monsterID,
    }
    
    var updatedMonsterPropsArray = props.monsterPropsArray
    await axios.put('http://localhost:5000/monsters/transfer', transaction)
        .then(res => res.data)
        .then(monsterTransferred => {
             
            // update the name, edition, imageUrl of latest Monster 
            updatedMonsterPropsArray[props.monsterID] = {
                name: monsterTransferred.name, 
                edition: monsterTransferred.edition, 
                imageUrl: monsterTransferred.content_url
            }
        })
        .catch(err => console.log('⚠️ Error : ' + err))
    
    return updatedMonsterPropsArray
}