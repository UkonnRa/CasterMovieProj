import {
    FIND_ALL_PLAYING_NOW_IN_REGION,
    FIND_ALL_SHOWS_BY_GENRE_IN,
    FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME,
    FIND_ALL_WILL_PLAY_IN_REGION,
    SELECT_SHOW
} from "./types";
import axios from "axios";
import {Api} from '../../api'
import qs from 'qs'

export const findAllByGenreInAndStartTime = ({genreList = [], startTime}) => {
    return dispatch => {
        axios.get(Api.show.findAllByGenreInAndStartTime, {
            params: {"genreList": genreList, "startTime": startTime},
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }).then(resp => {
            if (resp.data.value) dispatch({type: FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME, shows: resp.data.value})
        })
    }
};

export const selectShow = (showId) => {
    return dispatch => {
        return axios.get(Api.show.findById, {
            params: {"id": showId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(resp => {
            if (resp.data) dispatch({type: SELECT_SHOW, selectedShow: resp.data.value})
        })
    }
};

export const findAllShowsByGenreIn = ({genreList = []}) => dispatch =>
    axios.get(Api.show.findAllByGenreIn, {
        params: {"genreList": genreList},
        paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
    }).then(resp => {
        if (resp.data.value) dispatch({type: FIND_ALL_SHOWS_BY_GENRE_IN, shows: resp.data.value});
        else console.log(`ERROR: ${resp.data.message}`)
    });

export const findAllPlayingNowInRegion = (regionId) => dispatch =>
    axios.get(Api.show.findAllPlayingNowInRegion, {
        params: {"regionId": regionId},
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    }).then(resp => {
        if (resp.data.value) dispatch({type: FIND_ALL_PLAYING_NOW_IN_REGION, showsPlayingNowInRegion: resp.data.value});
        else console.log(`ERROR: ${resp.data.message}`)
    });

export const findAllWillPlayInRegion = (regionId) => dispatch =>
    axios.get(Api.show.findAllWillPlayInRegion, {
        params: {"regionId": regionId},
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    }).then(resp => {
        if (resp.data.value) dispatch({type: FIND_ALL_WILL_PLAY_IN_REGION, showsWillPlayInRegion: resp.data.value});
        else console.log(`ERROR: ${resp.data.message}`)
    });
