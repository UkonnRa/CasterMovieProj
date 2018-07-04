import {LOCATION_CHANGE} from './types'

const initState = {
    location: {110101: "东城区"}
};

export function locationReducer(state = initState, action = {}) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return {...state, location: action.location};
        default:
            return state
    }
}