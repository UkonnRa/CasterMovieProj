import {
    FIND_ALL_BY_PLAYING_NOW,
    FIND_ALL_BY_WILL_PLAY,
    FIND_ALL_SHOWS_BY_GENRE_IN,
    FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME,
    SELECT_SHOW
} from './types'

const initState = {
    shows: [],
    playingNowShows: [],
    willPlayShows: [],
    selectedShow: {}
};

export function showReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME:
            return {...state, shows: action.shows};
        case SELECT_SHOW:
            return {...state, selectedShow: action.selectedShow};
        case FIND_ALL_SHOWS_BY_GENRE_IN:
            return {...state, shows: action.shows};
        case FIND_ALL_BY_PLAYING_NOW:
            return {...state, playingNowShows: action.shows};
        case FIND_ALL_BY_WILL_PLAY:
            return {...state, willPlayShows: action.shows};
        default:
            return state
    }
}