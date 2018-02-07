import {POPOVER_FADE, POPOVER_SHOW} from './types'

export function fadePopover() {
    return dispatch => {
        dispatch({type: POPOVER_FADE})
    }
}

export function showPopover() {
    return dispatch => {
        dispatch({type: POPOVER_SHOW})
    }
}