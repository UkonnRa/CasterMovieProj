import {POPOVER_FADE, POPOVER_SHOW} from './types'

const popoverInitState = {
    popoverVisible: false
};

export function popoverReducer(state = popoverInitState, action = {}) {
    switch (action.type) {
        case POPOVER_SHOW:
            return {popoverVisible: true};
        case POPOVER_FADE:
            return {popoverVisible: false};
        default:
            return state
    }
}