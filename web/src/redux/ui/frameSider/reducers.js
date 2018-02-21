import {SIDE_COLLAPSE, SIDE_EXPAND} from './types'

const sideInitState = {
    sideCollapsed: true,
};

export const siderReducer = (state = sideInitState, action = {}) => {
    switch (action.type) {
        case SIDE_COLLAPSE:
            return { sideCollapsed: true};
        case SIDE_EXPAND:
            return { sideCollapsed: false};
        default:
            return state
    }
};
