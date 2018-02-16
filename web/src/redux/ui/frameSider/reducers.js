import {SIDE_COLLAPSE, SIDE_EXPAND} from './types'
import {SIDER_MENU_CHOOSE} from "./types";

const sideInitState = {
    sideCollapsed: true,
    key: "1"
};

export const siderReducer = (state = sideInitState, action = {}) => {
    switch (action.type) {
        case SIDE_COLLAPSE:
            return {...state, sideCollapsed: true};
        case SIDE_EXPAND:
            return {...state, sideCollapsed: false};
        case SIDER_MENU_CHOOSE:
            return {...state, key: action.key};
        default:
            return state
    }
};
