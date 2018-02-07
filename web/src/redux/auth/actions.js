import axios from 'axios'
import {setAuthToken} from './util/setAuthToken'
import {LOGIN, LOGOUT} from './types'
import jwt from 'jsonwebtoken'

export function login({username, password}) {
    return dispatch => {
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/castermovie/user/login',
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
                axios.get('http://localhost:8080/api/castermovie/user/getbyjwt', {
                    params: {jwt: localStorage.getItem("jwt")},
                    headers: {'Content-Type': 'application/json;charset=utf-8', Authorization: `Bearer ${token}`}
                })
                    .then((resp) => {
                        dispatch({type: LOGIN, username: resp.data.value.username, role: resp.data.value.role})
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