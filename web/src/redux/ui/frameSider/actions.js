import {SIDE_COLLAPSE, SIDE_EXPAND, SIDER_MENU_CHOOSE} from './types'

export const expandSide = () => dispatch => dispatch({type: SIDE_EXPAND});

export const collapseSide = () => dispatch => dispatch({type: SIDE_COLLAPSE});

export const chooseSiderMenu = (key) => dispatch => dispatch({type: SIDER_MENU_CHOOSE, key: key});