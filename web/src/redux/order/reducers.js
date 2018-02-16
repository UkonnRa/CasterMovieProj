import {FIND_ALL_BY_USER_ID} from './types'

const initState = {
    orders: []
};

export function orderReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_BY_USER_ID:
            return {orders: action.orders};
        default:
            return state
    }
}