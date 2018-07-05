import {
    SELECT_THEATER,
    ON_GOING_SHOWS_OF_THEATER,
} from './types';

const initState = {
    selectedTheater: {},
    onGoingShowsOfTheater: []
};

export function theaterReducer(state = initState, action = {}) {
    switch (action.type) {
        case SELECT_THEATER:
            return { ...state, selectedTheater: action.selectedTheater };
        case ON_GOING_SHOWS_OF_THEATER:
            return { ...state, onGoingShowsOfTheater: action.payload };
        default:
            return state;
    }
}