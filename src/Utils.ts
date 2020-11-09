import _ from 'lodash';
import allStatesJson from "./data/allStates.json";

export interface QuizState {
    stateName: string, showName: boolean, hintUsed: boolean
}

export function getNewShuffledQuiz(): QuizState[] {
    return _.map(
        _.shuffle(Object.keys(allStatesJson)), stateName => ({
            stateName,
            showName: false,
            hintUsed: false
        })
    );
}