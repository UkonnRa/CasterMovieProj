import { PREPARE_SIGN_IN, PREPARE_SIGN_UP, HIDE_ENTRY_FORM } from './actions';

const entryFormInitState = {
    intention: 'SIGN_IN',
    visible: false
};

export default function entryFormReducer(
    state = entryFormInitState,
    action = {}
) {
    switch (action.type) {
        case PREPARE_SIGN_IN:
            return { intention: 'SIGN_IN', visible: true };
        case PREPARE_SIGN_UP:
            return { intention: 'SIGN_UP', visible: true };
        case HIDE_ENTRY_FORM:
            return {
                intention: state.intention || entryFormInitState.intention,
                visible: false
            };
        default:
            return state;
    }
}