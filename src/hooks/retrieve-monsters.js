import axios from 'axios';

export default async function RetrieveMonsters(props){

    //const []
    
    console.log('Inside Retrieve Monsters Function')

    var updatedMonsterCollection = new Array(12).fill({
        name: null, 
        editions: null, 
        imageUrl: null
    })

    console.log("---0----- : ", updatedMonsterCollection)

    await axios.get('http://localhost:5000/users/' + props.username + '/monsters') 
        .then(res => res.data)
        .then(monsters => {
            console.log("monsters : ", monsters)

            monsters.map(monster => {
                console.log("2 before retrieval : ", updatedMonsterCollection)
                
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

                console.log("3 after retrieval : ", updatedMonsterCollection)
            })

        })
        .catch(err => console.log('⚠️ Error : ' + err))
        
    return updatedMonsterCollection
}