import {
    FIND_ALL_BY_PLAYING_NOW,
    FIND_ALL_BY_WILL_PLAY,
    FIND_ALL_SHOWS_BY_GENRE_IN,
    FIND_ALL_SHOWS_BY_GENRE_IN_AND_START_TIME,
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

export const findAllPlayingNow = () => dispatch =>
    axios.get(Api.show.findAllPlayingNow).then(resp => {
        if (resp.data.value) dispatch({type: FIND_ALL_BY_PLAYING_NOW, shows: resp.data.value});
        else console.log(`ERROR in findAllPlayingNow: ${resp.data.message}`)
    });

export const findAllWillPlay = () => dispatch =>
    axios.get(Api.show.findAllWillPlay).then(resp => {
        if (resp.data.value) dispatch({type: FIND_ALL_BY_WILL_PLAY, shows: resp.data.value});
        else console.log(`ERROR in findAllWillPlay: ${resp.data.message}`)
    });