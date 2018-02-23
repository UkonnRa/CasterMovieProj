import {FIND_ORDER_BY_ID, ORDER_FIND_ALL_BY_USER_ID} from './types'
import axios from "axios";
import {Api} from '../../api'

export function findAllByUserId(userId) {
    return dispatch => {
        axios.get(Api.order.findAllByUserId, {
            params: {"userId": userId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(resp => {
            if (resp.data) dispatch({type: ORDER_FIND_ALL_BY_USER_ID, orders: resp.data.value})
        })
    }
}

export const findById = (id) =>
    dispatch =>
        axios.get(Api.order.findById, {
            params: {"id": id},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(resp => {
            if (resp.data) dispatch({type: FIND_ORDER_BY_ID, selectedOrder: resp.data.value})
        });
