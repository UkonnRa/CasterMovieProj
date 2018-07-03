import {
    SELECT_THEATER,
    ON_GOING_SHOWS_OF_THEATER,
} from './types';

const initState = {
    selectedTheater: {},
    onGoingShowsOfTheater: {},
    comingSoonShowsOfTheater: {}
};

export function theaterReducer(state = initState, action = {}) {
    switch (action.type) {
        case SELECT_THEATER:
            return { selectedTheater: action.selectedTheater };
        case ON_GOING_SHOWS_OF_THEATER:
            return { onGoingShowsOfTheater: action.payload, selectedTheater: state.selectedTheater };
        default:
            return state;
    }
}