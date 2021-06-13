import React, { useState, useEffect, useRef } from "react";

export default function Timer(props) {

    const [t, setT] = useState({});
    const [count, setCount] = useState(10);

    const convertSecondsToTime = (secs) => {
        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
        h: hours,
        m: minutes,
        s: seconds
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
               setCount(10)
            }
    }, props.delay);

    return (
      <section className="section-dark">
        <h2>Time left until next Drop</h2>
        {t.s
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
    if (delay !== null) {
      let id = setInterval(tick, delay);
      console.log(id);
      return () => clearInterval(id);
    }
  }, [delay]);
}