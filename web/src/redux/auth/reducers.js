import {LOGIN, LOGOUT} from './types'
import _ from 'lodash'

const initialState = {
    isAuthed: false,
    username: "",
    userRole: ""
};

export function loginReducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN:
            console.log(`reducer: LOGIN ===> ${JSON.stringify(action)}`);
            return {
                isAuthed: !_.isEmpty(action),
                username: action.username,
                userRole: action.role
            };
        case LOGOUT:
            console.log(`reducer: LOGOUT ===> ${JSON.stringify(action)}`);
            return {
                isAuthed: false,
                username: "",
                userRole: ""
            };
        default:
            return state
    }
}