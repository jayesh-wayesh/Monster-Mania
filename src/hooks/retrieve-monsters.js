import axios from 'axios';

export default async function RetrieveMonsters(props){

    console.log('Inside Retrieve Monsters Function')
    
    var updatedMonsterCollection = new Array(12).fill({
        name: null, 
        editions: null, 
        imageUrl: null
    })

    await axios.get('http://localhost:5000/users/' + props.username + '/monsters') 
        .then(res => res.data)
        .then(monsters => {

            monsters.forEach(monster => {
                
                var updatedEditionsArray = []
                if( updatedMonsterCollection[monster.media_id].editions ){
                    updatedEditionsArray = updatedMonsterCollection[monster.media_id].editions
                }

                updatedEditionsArray.push(monster.edition)
                var monsterInfo = {
                    name: monster.name,
                    editions: updatedEditionsArray, 
                    imageUrl: monster.content_url 
                }
                updatedMonsterCollection[monster.media_id] = monsterInfo
            })
        })
        .catch(err => console.log('⚠️ Error : ' + err))
        
    return updatedMonsterCollection
}