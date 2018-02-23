import axios from 'axios'
import {setAuthToken} from './util/setAuthToken'
import {GET_CURRENT_USER, LOGIN, LOGOUT} from './types'
import jwt from 'jsonwebtoken'
import {Api} from "../../api";

export const getByJwt = () => {
    if (localStorage.getItem("jwt")) {
        return axios.get(Api.user.getByJwt, {
            params: {jwt: localStorage.getItem("jwt")},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        })
    } else return Promise.reject("jwt不存在")
};

export const getCurrentUser = () => dispatch => {
    getByJwt().then((resp => {
        if (resp.data.value) {
            dispatch({type: GET_CURRENT_USER, user: resp.data.value})
        } else {
            dispatch({type: LOGOUT})
        }
    }))
};

export function login({username, password}) {
    return dispatch =>
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
            if (resp.data.value) {
                const token = resp.data.value;
                setAuthToken(token);
                localStorage.setItem("jwt", token);
                getByJwt().then((resp) => {
                    dispatch({type: LOGIN, user: resp.data.value})
                }).catch(err => console.log(`===》 ${err}`))
            } else return Promise.reject(`登录异常：${resp.data.message}`)
        })

}

export function logout() {
    return dispatch => {
        localStorage.removeItem("jwt");
        dispatch({type: LOGOUT})
    }
}

export const update = (user) =>
    dispatch =>
        axios.post(Api.user.update, user, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(resp => {
            if (resp.data.value) {
                dispatch({type: GET_CURRENT_USER, user: resp.data.value});
                return resp.data.value
            } else {
                return Promise.reject(`${resp.data.message}`)
            }
        });