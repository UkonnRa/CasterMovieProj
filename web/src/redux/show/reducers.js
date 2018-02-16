import {FIND_ALL_BY_GENRE_IN_AND_START_TIME} from './types'

const initState = {
    shows: []
};

export function showReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_BY_GENRE_IN_AND_START_TIME:
            return {shows: action.shows};
        default:
            return state
    }
}