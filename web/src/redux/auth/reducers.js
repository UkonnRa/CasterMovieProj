import {LOGIN, LOGOUT} from './types'
import _ from 'lodash'

const initialState = {
    isAuthed: false,
    user: {}
};

export function loginReducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN:
            console.log(`reducer: LOGIN ===> ${JSON.stringify(action)}`);
            return {
                isAuthed: !_.isEmpty(action),
                user: action.user
            };
        case LOGOUT:
            console.log(`reducer: LOGOUT ===> ${JSON.stringify(action)}`);
            return {
                isAuthed: false,
                user: {}
            };
        default:
            return state
    }
}