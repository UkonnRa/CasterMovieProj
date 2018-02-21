import {COUPON_INFO_FIND_ALL_BY_USER_ID} from './types'

const initState = {
    couponInfos: []
};

export function couponInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case COUPON_INFO_FIND_ALL_BY_USER_ID:
            return {couponInfos: action.couponInfos};
        default:
            return state
    }
}