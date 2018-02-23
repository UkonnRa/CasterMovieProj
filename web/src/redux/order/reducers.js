import {FIND_ORDER_BY_ID, ORDER_FIND_ALL_BY_USER_ID} from './types'

const initState = {
    orders: [],
    selectedOrder: {}
};

export function orderReducer(state = initState, action = {}) {
    switch (action.type) {
        case ORDER_FIND_ALL_BY_USER_ID:
            return {...state, orders: action.orders};
        case FIND_ORDER_BY_ID:
            return{...state, selectedOrder: action.selectedOrder};
        default:
            return state
    }
}