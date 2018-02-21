import {FIND_ALL_BY_GENRE_IN_AND_START_TIME, SELECT_SHOW} from './types'

const initState = {
    shows: [],
    selectedShow: {}
};

export function showReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_BY_GENRE_IN_AND_START_TIME:
            return {...state, shows: action.shows};
        case SELECT_SHOW:
            return {...state, selectedShow: action.selectedShow};
        default:
            return state
    }
}