import {NOW_ROUTER} from "./types";
import {RouteTable} from "../../route";
import {Role} from "../../model/user";

const initState = {
    key: RouteTable[Role.CUSTOMER].Main.path
};

export const routeReducer = (state = initState, action = {}) => {
    switch (action.type) {
        case NOW_ROUTER:
            return { key: action.key };
        default:
            return state
    }
};
