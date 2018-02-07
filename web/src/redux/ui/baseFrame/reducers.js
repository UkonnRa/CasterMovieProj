import { MODAL_FADE, MODAL_SHOW } from './types'

const modalInitState = {
    modalVisible: false
};

export function modalReducer(state = modalInitState, action = {}) {
    switch (action.type) {
        case MODAL_SHOW:
            return { modalVisible: true };
        case MODAL_FADE:
            return { modalVisible: false };
        default:
            return state
    }
}