import {NOW_ROUTER} from './types'

export const route = (key) => dispatch => dispatch({type: NOW_ROUTER, key: key});