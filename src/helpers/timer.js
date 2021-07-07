import React, { useState, useEffect, useRef } from "react"
const NFT_DROP_INTERVAL = 60


export default function Timer(props) {

    const [t, setT] = useState({});
    const [count, setCount] = useState();

    useEffect(() => {
      setCount( props.timerCount )
    }, []);

    const convertSecondsToTime = (secs) => {
        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        var h,m,s
        if(hours < 10){
            h = '0' + hours.toString()
        }else{
            h = hours.toString() 
        }

        if(minutes < 10){
            m = '0' + minutes.toString()
        }else{
            m = minutes.toString()
        }
        
        if(seconds < 10){
            s = '0' + seconds.toString()
        }else{
            s = seconds.toString()
        }

        let obj = {
			h: h,
			m: m,
			s: s
        };
        return obj;
    };

    useInterval(() => {

            setCount(count - 1);
            var secondsToTime = convertSecondsToTime(count);
            setT(secondsToTime);
             
            console.log('inside timer')

            if (count === 0) {
               props.setDelay(null);
               setCount(NFT_DROP_INTERVAL)
            }
    }, props.delay);

    return (
        <section className="section-dark">
			<h2>Time Left until Next Award</h2>
			{t
				? <h1>{t.h}:{t.m}:{t.s}</h1>
				: <h1>00:00:00</h1>
			}
        </section>
    );
}

function useInterval(callback, delay) {
	const savedCallback = useRef();

	// Remember the latest function.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null && delay !== undefined) {
			let id = setInterval(tick, delay);
			console.log(id);
			return () => clearInterval(id);
		}
	}, [delay]);
}