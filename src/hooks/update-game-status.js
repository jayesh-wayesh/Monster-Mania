import axios from 'axios';

// Update time of the latest NFT drop in database
export const updateTimeOfLatestDrop = async (username) => {

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


export const getNewTimerValue = async (username, NFT_DROP_INTERVAL) => {

    var today = new Date()
    var todaysDateInNumber = Number((today.getFullYear() * 10000) + (today.getMonth() + 1) * 100 + today.getDate())
    var currentTimeInSecs = Number((today.getHours() * 3600) + (today.getMinutes() * 60) + today.getSeconds())

    var dateOfLastNFTDrop
    var timeOfLastNFTDropInSecs

    await axios.get('http://localhost:5000/users/' + username + '/timerdetails')
      .then(res => {
        dateOfLastNFTDrop = res.data.date
        timeOfLastNFTDropInSecs = res.data.time
      })

    var differenceInDays = todaysDateInNumber - dateOfLastNFTDrop
    var differenceInTime = currentTimeInSecs - timeOfLastNFTDropInSecs
    var newTimerValue 

    if( differenceInDays > 0 ){
        newTimerValue = NFT_DROP_INTERVAL
    } else if( differenceInTime >= NFT_DROP_INTERVAL ){
        newTimerValue = NFT_DROP_INTERVAL
    }else{
        var secsLeft = NFT_DROP_INTERVAL - differenceInTime
        newTimerValue = secsLeft
    }

    return newTimerValue
}


export const updateWinner = async (username) => {

    await axios.put('http://localhost:5000/users/' + username + '/winner')
        .then(res => {console.log(res)} )
}


export const isWinner = async (username) => {

    return await axios.get('http://localhost:5000/users/' + username + '/winner')
        .then(res => res.data)
}


export const sleep = (ms) => {
    console.log('sleep')
    return new Promise(resolve => setTimeout(resolve, ms));
}