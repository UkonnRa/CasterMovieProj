import React from 'react'
import Main from '../component/user/Main'
import MyInfo from '../component/user/MyInfo'
import MyCouponInfo from '../component/user/MyCouponInfo'
import MyOrder from '../component/user/MyOrder'
import ShowList from "../component/user/ShowList"
import ShowInfo from "../component/user/ShowInfo"

export const route = (props) => {
    if (RouteTable[props.role][props.itemKey].needAuthed){
        return !props.isAuthed? <Main/>: RouteTable[props.role][props.itemKey].component
    } else {
        return RouteTable[props.role][props.itemKey].component
    }
};

export const RouteTable = {
    CUSTOMER: {
        Main: {
            path: "Main",
            text: "主页",
            component: <Main/>
        },
        MyInfo: {
            path: "MyInfo",
            text: " 我的信息",
            component: <MyInfo/>,
            needAuthed: true
        },
        MyCouponInfo: {
            path: "MyCouponInfo",
            text: " 我的优惠券",
            component: <MyCouponInfo/>,
            needAuthed: true
        },
        MyOrder: {
            path: "MyOrder",
            text: " 我的订单",
            component: <MyOrder/>,
            needAuthed: true
        },
        ShowList: {
            path: "ShowList",
            text: "剧集列表",
            component: <ShowList/>,
        },
        ShowInfo: {
            path: "ShowInfo",
            text: "剧集信息",
            component: <ShowInfo/>
        }
    }
};

