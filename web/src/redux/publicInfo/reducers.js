import {FIND_ALL_PUBLIC_INFO_BY_SHOW_ID, FIND_PUBLIC_INFO_BY_ID, SELECT_PUBLIC_INFO} from './types'

const initState = {
    publicInfos: [],
    selectedPublicInfo: {}
};

export function publicInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_PUBLIC_INFO_BY_SHOW_ID:
            return {...state, publicInfos: action.publicInfos};
        case SELECT_PUBLIC_INFO:
        case FIND_PUBLIC_INFO_BY_ID:
            return {...state, selectedPublicInfo: action.selectedPublicInfo};
        default:
            return state
    }
}