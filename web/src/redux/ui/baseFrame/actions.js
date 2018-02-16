import {MODAL_FADE, MODAL_SHOW} from './types'

export const fadeModal = () => dispatch => dispatch({type: MODAL_FADE});

export const showModal = () => dispatch => dispatch({type: MODAL_SHOW});

