import {
    FIND_ALL_PLAYING_NOW_IN_REGION,
    FIND_ALL_SHOWS_BY_GENRE_IN,
    FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME,
    FIND_ALL_WILL_PLAY_IN_REGION,
    SELECT_SHOW
} from './types'

const initState = {
    shows: [],
    selectedShow: {},
    showsPlayingNowInRegion: [],
    showsWillPlayInRegion: [],
};

export function showReducer(state = initState, action = {}) {
    switch (action.type) {
        case FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME:
            return {...state, shows: action.shows};
        case SELECT_SHOW:
            return {...state, selectedShow: action.selectedShow};
        case FIND_ALL_SHOWS_BY_GENRE_IN:
            return {...state, shows: action.shows};
        case FIND_ALL_PLAYING_NOW_IN_REGION:
            return {...state, showsPlayingNowInRegion: action.showsPlayingNowInRegion};
        case FIND_ALL_WILL_PLAY_IN_REGION:
            return {...state, showsWillPlayInRegion: action.showsWillPlayInRegion};
        default:
            return state
    }
}