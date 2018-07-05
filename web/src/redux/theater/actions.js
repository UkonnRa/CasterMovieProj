import {
    SELECT_THEATER,
    ON_GOING_SHOWS_OF_THEATER
} from './types';
import axios from 'axios';
import { Api } from '../../api';

export const selectTheater = id => dispatch =>
    axios
        .get(Api.theater.findById, {
            params: { id: id },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(resp => {
            if (resp.data)
                dispatch({
                    type: SELECT_THEATER,
                    selectedTheater: resp.data.value
                });
        });

export const findOnGoingShowsByTheater = id => dispatch =>
    axios
        .get(Api.theater.findAllShowPlayingNow, {
            params: { id },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(resp => {
            if (resp.data.value)
                dispatch({
                    type: ON_GOING_SHOWS_OF_THEATER,
                    payload: resp.data.value
                });
        });