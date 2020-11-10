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

export function getTimeCount(start: Date, end: Date): string {
    const diffSeconds = (Math.floor((end.getTime() - start.getTime()) / 1000)) % 60;
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const seconds = diffSeconds < 10 ? `0${diffSeconds}` : `${diffSeconds}`;
    const minutes = diffMinutes < 10 ? `0${diffMinutes}` : `${diffMinutes}`;
    return `${minutes}:${seconds}`;
}