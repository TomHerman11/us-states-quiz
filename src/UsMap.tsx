import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
    ComposableMap,
    Geographies,
} from 'react-simple-maps';
import UsState from './UsState';
import './UsMap.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const TOTAL_ERRORS_UNTIL_HINT = 3;

function UsMap({ quizOrder }: { quizOrder: ({ stateName: string, showName: boolean, hintUsed: boolean })[] }) {
    const [quiz, setQuiz] = useState(quizOrder);
    const [quizIndex, setQuizIndex] = useState(0);
    const [totalErrors, setTotalErrors] = useState(0);
    const [errorsToHint, setErrorsToHint] = useState(TOTAL_ERRORS_UNTIL_HINT);

    //measure time:
    const [startTime] = useState(new Date());
    const [currTime, setCurrTime] = useState(new Date());
    const [quizEnded, setQuizEnded] = useState(false);

    useEffect(() => {
        let interval = setInterval(() => { }, 0);
        if (!quizEnded) {
            interval = setInterval(() => setCurrTime(new Date()), 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [quizEnded]);

    const moveToNextState = (stateName: string, showName: boolean, hintUsed: boolean) => {
        // update the quiz:
        setQuiz([...quiz.slice(0, quizIndex), {
            stateName,
            showName,
            hintUsed
        },
        ...quiz.slice(quizIndex + 1)
        ]);

        // move to the next state:
        setQuizIndex(quizIndex + 1);

        // check if the quiz has ended:
        if (quizIndex + 1 === quiz.length) {
            setQuizEnded(true);
        }
    }

    const handleStateClick = (stateGeo: any) => {
        // if quiz if over don't do a thing:
        if (quizEnded) return;

        const stateName = stateGeo?.properties?.name as string;
        if (!stateName) return;

        if (stateName === quiz[quizIndex].stateName) {
            moveToNextState(stateName, true, false);

            //reset errors to hint:
            setErrorsToHint(TOTAL_ERRORS_UNTIL_HINT);
        } else {
            setTotalErrors(totalErrors + 1);
            if (errorsToHint === 1) {
                // user clicked 3 times on a wrong state, reveal the current state:
                moveToNextState(quiz[quizIndex].stateName, true, true);

                // fresh start of errors until next hint
                setErrorsToHint(TOTAL_ERRORS_UNTIL_HINT);
            } else {
                setErrorsToHint(errorsToHint - 1);
            }
        }
    }

    const statesPropertiesMap: { [key: string]: { showName: boolean, hintUsed: boolean } } = {};
    _.forEach(quiz, state => {
        statesPropertiesMap[state.stateName] = {
            showName: state.showName,
            hintUsed: state.hintUsed,
        }
    });

    return (
        <div className="UsMap">
            {quizEnded &&
                <div className="UsMapTitle">
                    <h1>WELL DONE!</h1>
                    <h4>Errors: {totalErrors}</h4>
                    <h4>Time: {getTimeCount(startTime, currTime)}</h4>
                </div>
            }
            <div>
                {!quizEnded &&
                    <div className="UsMapTitle">
                        <h3 className="QuizCurrentState">{(quizIndex < quiz.length) && quiz[quizIndex].stateName}</h3>
                        <h4>{(quizIndex < quiz.length) && getTimeCount(startTime, currTime)}</h4>
                    </div>
                }
                <ComposableMap projection="geoAlbersUsa">
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) => (
                            <>
                                {geographies.map(geo => (
                                    <UsState
                                        key={geo?.rsmKey}
                                        geo={geo}
                                        currQuizState={((quizIndex < quiz.length) && quiz[quizIndex].stateName) || ''}
                                        showName={statesPropertiesMap[geo?.properties.name || '']?.showName}
                                        hintUsed={statesPropertiesMap[geo?.properties.name || '']?.hintUsed}
                                        handleStateClick={handleStateClick}
                                    />
                                ))}
                            </>
                        )}
                    </Geographies>
                </ComposableMap>
            </div>
        </div >
    );
}

export default UsMap;

function getTimeCount(start: Date, end: Date): string {
    const diffSeconds = (Math.floor((end.getTime() - start.getTime()) / 1000)) % 60;
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const seconds = diffSeconds < 10 ? `0${diffSeconds}` : `${diffSeconds}`;
    const minutes = diffMinutes < 10 ? `0${diffMinutes}` : `${diffMinutes}`;
    return `${minutes}:${seconds}`;
}
