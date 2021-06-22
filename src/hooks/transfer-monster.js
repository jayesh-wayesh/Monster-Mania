import axios from 'axios';

export default async function TransferMonster(props){
    
    const transaction = {
        recipient: props.username,
        monsterID: props.monsterID,
    }
    
    const monsterTransferred = await axios.put('http://localhost:5000/monsters/transfer', transaction)
        .then(res => res.data)
    
    var updatedMonsterEditionArray = props.monsterEditionArray
    updatedMonsterEditionArray[ props.monsterID ] = monsterTransferred.edition
    return updatedMonsterEditionArray
}