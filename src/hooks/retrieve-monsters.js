import axios from 'axios';

export default async function RetrieveMonsters(props){
    
    console.log('Inside Retrieve Monsters Function')

    var updatedCollection = new Array(12).fill(0) 
    var response = []

    var editionFlag = false
    var updatedMonsterEditionArray = []
    if( props.monsterEditionArray ){
        editionFlag = true
        updatedMonsterEditionArray = new Array(12).fill(0)
    }

    await axios.get('http://localhost:5000/users/' + props.username + '/monsters') 
        .then(res => res.data)
        .then(monsters => {

            monsters.map(monster => {
                updatedCollection[ monster.media_id ]++
                if(editionFlag) updatedMonsterEditionArray[ monster.media_id ] = monster.edition
            })
             
            response.push(updatedCollection)
            if(editionFlag) response.push(updatedMonsterEditionArray)
        })
        
    return response
}