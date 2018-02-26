import {SELECT_THEATER} from './types'

const initState = {
    selectedTheater: {}
};

export function theaterReducer(state = initState, action = {}) {
    switch (action.type) {
        case SELECT_THEATER:
            return {selectedTheater: action.selectedTheater};
        default:
            return state
    }
}