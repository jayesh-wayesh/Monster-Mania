import axios from 'axios';

export default async function RetrieveMonsters(props){
    
    console.log('Inside Retrieve Monsters Function')

    var updatedCollection = new Array(12).fill(0) 
    var response = []

    var monsterPropsFlag = false
    var updatedMonsterPropsArray = []
    if( props.monsterPropsArray ){
        monsterPropsFlag = true
        updatedMonsterPropsArray = new Array(12).fill({
            name: null, 
            edition: '0', 
            imageUrl: null
        })
    }

    await axios.get('http://localhost:5000/users/' + props.username + '/monsters') 
        .then(res => res.data)
        .then(monsters => {

            monsters.map(monster => {
                updatedCollection[ monster.media_id ]++
                if(monsterPropsFlag){ 
                    updatedMonsterPropsArray[ monster.media_id ] = {
                        name: monster.name, 
                        edition: monster.edition, 
                        imageUrl: monster.content_url
                    }
                }
            })
             
            response.push(updatedCollection)
            if(monsterPropsFlag) response.push(updatedMonsterPropsArray)
        })
        .catch(err => console.log('⚠️ Error : ' + err))
        
    return response
}