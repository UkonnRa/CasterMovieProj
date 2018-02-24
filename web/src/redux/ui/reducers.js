import {NOW_ROUTER} from "./types";

const initState = {
    key: ""
};

export const routeReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case NOW_ROUTER:
            return { key: action.key };
        default:
            return state
    }
};
