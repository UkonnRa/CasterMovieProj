import { MODAL_FADE, MODAL_SHOW } from './types'

export function fadeModal() {
    return dispatch => {
        dispatch({ type: MODAL_FADE })
    }
}

export function showModal() {
    return dispatch => {
        dispatch({ type: MODAL_SHOW })
    }
}