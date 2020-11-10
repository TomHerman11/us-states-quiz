import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
    ComposableMap,
    Geographies,
} from 'react-simple-maps';
import UsState from './UsState';
import * as Utils from './Utils'
import './UsMap.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const TOTAL_ERRORS_UNTIL_HINT = 3;

function UsMap() {
    const [quiz, setQuiz] = useState<Utils.QuizState[]>(Utils.getNewShuffledQuiz());
    const [quizIndex, setQuizIndex] = useState(0);
    const [totalErrors, setTotalErrors] = useState(0);
    const [errorsToHint, setErrorsToHint] = useState(TOTAL_ERRORS_UNTIL_HINT);
    const [quizEnded, setQuizEnded] = useState(false);

    // timer:
    const [startTime, setStartTime] = useState(new Date());
    const [currTime, setCurrTime] = useState(new Date());

    // update timer:
    useEffect(() => {
        let interval = setInterval(() => { }, 0);
        if (!quizEnded) {
            interval = setInterval(() => setCurrTime(new Date()), 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [quizEnded]);

    // on restart:
    const restartQuiz = () => {
        setQuiz(Utils.getNewShuffledQuiz());
        setQuizIndex(0);
        setTotalErrors(0);
        setErrorsToHint(TOTAL_ERRORS_UNTIL_HINT);
        setQuizEnded(false);

        // restart timer:
        setStartTime(new Date());
        setCurrTime(new Date());
    }

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
        <div className="UsMapQuiz">
            <div className="UsMapStats">
                <div className="UsMapStatsHeader">
                    <h1>US States Quiz</h1>
                    <h3 style={{ fontWeight: 'normal' }}>How quickly can you identify the US states on the map?</h3>
                </div>
                <div className="UsMapStatsInfo">
                    {quizEnded &&
                        <div className="UsMapStatsInfo">
                            <h1 className="QuizCurrentState">WELL DONE!</h1>
                            <p style={{ margin: '0px' }}>Mistakes made: {totalErrors}</p>
                        </div>
                    }
                    {!quizEnded && <div>
                        <h1 className="QuizCurrentState">{quiz[quizIndex].stateName}</h1>
                    </div>}
                    <p style={{ margin: '10px' }}>{Utils.getTimeCount(startTime, currTime)}</p>
                </div>
                <div className="UsMapStatsInfo">
                    <p style={{ margin: '0px', fontSize: 'small' }}>Hint: If you guess the location incorrectly 3 times in a row, the correct state will automatically highlight itself.</p>
                    <div className="RestartQuizButton" onClick={() => restartQuiz()}>
                        Restart Quiz
                    </div>
                    <img src="usa-flag.svg" alt="usa-flag" className="UsaFlagImg" />
                </div>
            </div>

            <ComposableMap className="UsMap" projection="geoAlbersUsa">
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
        </div >
    );
}

export default UsMap;
