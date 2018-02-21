import axios from 'axios'
import {setAuthToken} from './util/setAuthToken'
import {LOGIN, LOGOUT, GET_CURRENT_USER} from './types'
import jwt from 'jsonwebtoken'
import {Api} from "../../api";

export const getByJwt = () =>
        axios.get(Api.user.getByJwt, {
            params: {jwt: localStorage.getItem("jwt")},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

export const getCurrentUser = () => dispatch => {
    getByJwt().then((resp => dispatch({type: GET_CURRENT_USER, user: resp.data.value})))
};

export function login({username, password}) {
    return dispatch => {
        axios({
            method: 'post',
            url: Api.user.login,
            data: {
                username: username,
                password: password
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then((resp) => {
            if (resp.data.value !== null) {
                const token = resp.data.value;
                setAuthToken(token);
                localStorage.setItem("jwt", token);
                getByJwt().then((resp) => {
                    dispatch({type: LOGIN, user: resp.data.value})
                })
            }
        })
    }
}

export function logout() {
    return dispatch => {
        localStorage.removeItem("jwt");
        dispatch({type: LOGOUT})
    }
}