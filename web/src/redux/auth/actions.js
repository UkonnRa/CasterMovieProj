import axios from 'axios';
import { setAuthToken } from './util/setAuthToken';
import { GET_CURRENT_USER, LOGIN, LOGOUT } from './types';
import _jwt from 'jsonwebtoken';
import { Api } from '../../api';
import { Role } from '../../model/user';

export const getByJwt = () => {
    if (localStorage.getItem('jwt')) {
        const res = _jwt.decode(localStorage.getItem('jwt'));
        if (res.role === Role.CUSTOMER) {
            return axios.get(Api.user.getByJwt, {
                params: { jwt: localStorage.getItem('jwt') },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
        } else if (res.role === Role.THEATER) {
            return axios.get(Api.theater.findById, {
                params: { id: res.username },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            });
        }
    } else
        return Promise.resolve({
            data: { message: 'jwt不存在，请登录后重试' }
        });
};

export const getCurrentUser = () => dispatch => {
    getByJwt().then(resp => {
        if (resp.data.value) {
            dispatch({ type: GET_CURRENT_USER, user: resp.data.value });
        } else {
            dispatch({ type: LOGOUT });
        }
    });
};

export function login({ username, password, role = Role.CUSTOMER }) {
    return dispatch =>
        axios({
            method: 'post',
            url: Api.user.login,
            data: {
                username: username,
                password: password,
                role: role
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(resp => {
            if (resp.data.value) {
                const token = resp.data.value;
                setAuthToken(token);
                localStorage.setItem('jwt', token);
                return getByJwt()
                    .then(resp => {
                        dispatch({ type: LOGIN, user: resp.data.value });
                        return resp;
                    })
                    .catch(err => console.log(`===》 ${err}`));
            } else {
                return Promise.reject(`登录失败：${resp.data.message}`);
            }
        });
}

export function logout() {
    return dispatch => {
        localStorage.removeItem('jwt');
        dispatch({ type: LOGOUT });
    };
}

export const update = user => dispatch =>
    axios
        .post(Api.user.update, user, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(resp => {
            if (resp.data.value) {
                dispatch({ type: GET_CURRENT_USER, user: resp.data.value });
                return resp.data.value;
            } else {
                return Promise.reject(`${resp.data.message}`);
            }
        });