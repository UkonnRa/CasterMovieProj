import axios from 'axios'
import {setAuthToken} from './util/setAuthToken'
import {LOGIN, LOGOUT} from './types'
import jwt from 'jsonwebtoken'
import {Api} from "../../api";

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
                axios.get(Api.user.getByJwt, {
                    params: {jwt: localStorage.getItem("jwt")},
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    }
                })
                    .then((resp) => {
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