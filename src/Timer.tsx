import React, { useState, useEffect } from 'react';

function Timer({ shouldStopCounting }: { shouldStopCounting: boolean }) {
    const [startTime] = useState(new Date());
    const [currTime, setCurrTime] = useState(new Date());

    useEffect(() => {
        let interval = setInterval(() => { }, 0);
        if (!shouldStopCounting) {
            interval = setInterval(() => setCurrTime(new Date()), 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [shouldStopCounting]);

    return (
        <p style={{ margin: '10px' }}>{getTimeCount(startTime, currTime)}</p>
    );
}

export default Timer;

function getTimeCount(start: Date, end: Date): string {
    const diffSeconds = (Math.floor((end.getTime() - start.getTime()) / 1000)) % 60;
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const seconds = diffSeconds < 10 ? `0${diffSeconds}` : `${diffSeconds}`;
    const minutes = diffMinutes < 10 ? `0${diffMinutes}` : `${diffMinutes}`;
    return `${minutes}:${seconds}`;
}