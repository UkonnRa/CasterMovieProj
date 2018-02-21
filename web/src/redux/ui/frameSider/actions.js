import {SIDE_COLLAPSE, SIDE_EXPAND} from './types'

export const expandSide = () => dispatch => dispatch({type: SIDE_EXPAND});

export const collapseSide = () => dispatch => dispatch({type: SIDE_COLLAPSE});
