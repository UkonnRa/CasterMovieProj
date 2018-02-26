import {FIND_ALL_PUBLIC_INFO_BY_SHOW_ID, FIND_PUBLIC_INFO_BY_ID} from "./types";
import axios from "axios";
import {Api} from '../../api'

export const findAllPublicInfoByShowId = (showId) => {
    return dispatch => {
        return axios.get(Api.publicInfo.findAllByShowId, {
            params: {"showId": showId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }).then(resp => {
            if (resp.data) dispatch({type: FIND_ALL_PUBLIC_INFO_BY_SHOW_ID, publicInfos: resp.data.value})
        })
    }
};

export const findById = (id) =>
    dispatch =>
        axios.get(Api.publicInfo.findById, {
            params: {"id": id},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }).then(resp => {
            if (resp.data) dispatch({type: FIND_PUBLIC_INFO_BY_ID, selectedPublicInfo: resp.data.value})
        });
