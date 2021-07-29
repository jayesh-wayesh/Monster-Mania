import axios from 'axios';

export default async function DeleteMonster(props){
    
    await axios.delete(process.env.REACT_APP_BACKEND_URL + '/users/' +  props.username + '/monsters')
        .then(response => { console.log(response.data) })
        .catch(err => console.log('⚠️ Error : ' + err))  
}