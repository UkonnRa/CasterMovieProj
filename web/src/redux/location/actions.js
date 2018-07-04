import {LOCATION_CHANGE} from './types'
import axios from 'axios'
import {FIND_ALL_PLAYING_NOW_IN_REGION, FIND_ALL_WILL_PLAY_IN_REGION} from "../show/types";
import {Api} from "../../api";

export function changeLocation(location) {
    return dispatch => {
        axios.get(Api.show.findAllPlayingNowInRegion, {
            params: {"regionId": Object.keys(location)[0]},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }).then(resp => {
            if (resp.data.value) dispatch({type: FIND_ALL_PLAYING_NOW_IN_REGION, showsPlayingNowInRegion: resp.data.value});
            else console.log(`ERROR: ${resp.data.message}`)
        }).then(() => axios.get(Api.show.findAllWillPlayInRegion, {
            params: {"regionId": Object.keys(location)[0]},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        })).then(resp => {
            if (resp.data.value) dispatch({type: FIND_ALL_WILL_PLAY_IN_REGION, showsWillPlayInRegion: resp.data.value});
            else console.log(`ERROR: ${resp.data.message}`)
        }).then(() => dispatch({type: LOCATION_CHANGE, location: location}))
    }
}