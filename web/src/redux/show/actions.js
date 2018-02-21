import {FIND_ALL_BY_GENRE_IN_AND_START_TIME, SELECT_SHOW} from "./types";
import axios from "axios";
import {Api} from '../../api'
import qs from 'query-string'

export const findAllByGenreInAndStartTime = ({genreList = [], startTime}) => {
    return dispatch => {
        axios.get(Api.show.findAllByGenreInAndStartTime, {
            params: {"genreList": genreList, "startTime": startTime},
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }).then(resp => {
            if (resp.data) dispatch({type: FIND_ALL_BY_GENRE_IN_AND_START_TIME, shows: resp.data.value})
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