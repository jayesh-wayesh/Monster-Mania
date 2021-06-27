import axios from 'axios';

export default async function DeleteMonster(props){
    await axios.delete('http://localhost:5000/users/' +  props.username + '/monsters')
        .then(response => { console.log(response.data) })
        .catch(err => console.log('⚠️ Error : ' + err))  
}