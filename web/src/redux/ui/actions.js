import {NOW_ROUTER} from './types'
import {getByJwt} from "../auth/actions";
import {LOGIN} from "../auth/types";
import {Role} from "../../model/user";
import {RouteTable} from "../../route";

export const route = (key, isAuthed, role = Role.CUSTOMER) => (dispatch) => {
    let itemKey = key;
    if (itemKey.indexOf("#") !== -1) {
        itemKey = itemKey.substring(0, itemKey.indexOf("#"))
    }

    if (RouteTable[role][key].needAuthed) {
        if (isAuthed) {
            if (RouteTable[role][itemKey]) {
                dispatch({type: NOW_ROUTER, key: key})
            } else {
                alert("权限不足：你所在的用户组无法访问");
                dispatch({type: NOW_ROUTER, key: RouteTable[role].Main.path})
            }
        } else {
            getByJwt().then(userData => {
                if (userData.data.value) {
                    dispatch({type: LOGIN, user: userData.data.value});
                    dispatch({type: NOW_ROUTER, key: key});
                } else {
                    // 无jwt
                        alert(userData.data.message? userData.data.message: "请登录后重试")
                }
            }).catch(() => {
                // 有jwt但过期
                alert("请登录后重试")
            })
        }
    } else {
        if (!isAuthed) {
            getByJwt().then(userData => {
                if (userData.data.value) {
                    dispatch({type: LOGIN, user: userData.data.value})
                }
            })
        }
        dispatch({type: NOW_ROUTER, key: key});
    }
};