import axios from 'axios';

export const NEW_AWARD_INTERVAL = 60

// Update time of the latest NFT award in database
export const updateTimeOfLatestAward = async (username) => {

    var today = new Date()
    var dateInNumber = Number((today.getFullYear() * 10000) + (today.getMonth() + 1) * 100 + today.getDate())
    var timeInSecs = Number((today.getHours() * 3600) + (today.getMinutes() * 60) + today.getSeconds())

    const req = {
        date: dateInNumber,
        time: timeInSecs
    }

    await axios.put('http://localhost:5000/users/' + username + '/timerdetails', req)
        .then(res => {console.log(res)})
}

// Get time left in next award for old user
export const getNewTimerValue = async (username) => {

    var today = new Date()
    var todaysDateInNumber = Number((today.getFullYear() * 10000) + (today.getMonth() + 1) * 100 + today.getDate())
    var currentTimeInSecs = Number((today.getHours() * 3600) + (today.getMinutes() * 60) + today.getSeconds())

    var dateOfLastNFTAward
    var timeOfLastNFTAwardInSecs

    await axios.get('http://localhost:5000/users/' + username + '/timerdetails')
        .then(res => {
            dateOfLastNFTAward = res.data.date
            timeOfLastNFTAwardInSecs = res.data.time
    })

    var differenceInDays = todaysDateInNumber - dateOfLastNFTAward
    var differenceInTime = currentTimeInSecs - timeOfLastNFTAwardInSecs
    var newTimerValue 

    if( differenceInDays > 0 ){
        newTimerValue = NEW_AWARD_INTERVAL
    } else if( differenceInTime >= NEW_AWARD_INTERVAL ){
        newTimerValue = NEW_AWARD_INTERVAL
    }else{
        var secsLeft = NEW_AWARD_INTERVAL - differenceInTime
        newTimerValue = secsLeft
    }

    return newTimerValue
}

// Update winner in database
export const updateWinner = async (username) => {

    await axios.put('http://localhost:5000/users/' + username + '/winner')
        .then(res => {console.log(res)} )
}

// Check if current user is winner
export const isWinner = async (username) => {

    return await axios.get('http://localhost:5000/users/' + username + '/winner')
        .then(res => res.data.kingMonster)
}


export const getRandomMonster = () => {
    const min = 1;
    const max = 10;
    const mediaID =  min + Math.floor(Math.random() * (max - min));
    return mediaID;
}


export const sleep = (ms) => {
    console.log('sleep')
    return new Promise(resolve => setTimeout(resolve, ms));
}

