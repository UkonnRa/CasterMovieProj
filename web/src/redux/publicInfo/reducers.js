import {FIND_ALL_PUBLIC_INFO_BY_SHOW_ID} from './types'

const initState = {
    publicInfos: [],
};

export function publicInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_PUBLIC_INFO_BY_SHOW_ID:
            return {publicInfos: action.publicInfos};
        default:
            return state
    }
}