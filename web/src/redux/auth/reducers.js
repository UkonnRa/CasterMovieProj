import {LOGIN, LOGOUT, GET_CURRENT_USER} from './types'
import {Role} from "../../model/user";
import _ from 'lodash'

const initialState = {
    isAuthed: false,
    user: {
        role: Role.CUSTOMER
    },
};

export function loginReducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN:
            return {
                isAuthed: !_.isEmpty(action),
                user: action.user
            };
        case LOGOUT:
            return {
                isAuthed: false,
                user: {
                    role: Role.CUSTOMER
                }
            };
        case GET_CURRENT_USER:
            return {
                isAuthed: !_.isEmpty(action),
                user: action.user
            };

        default:
            return state
    }
}