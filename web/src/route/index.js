import React from 'react'
import Main from '../component/user/Main'
import MyInfo from '../component/user/MyInfo'
import ShowList from "../component/user/ShowList"
import ShowInfo from "../component/user/ShowInfo"
import ChooseSeat from "../component/user/ChooseSeat"
import PayOrder from '../component/user/PayOrder'
import _ from "lodash";
import CheckIn from '../component/theater/CheckIn'
import MyPublicInfos from '../component/theater/MyPublicInfos'
import MyTheaterFinance from '../component/theater/MyTheaterFinance'
import MyTheaterInfo from '../component/theater/MyTheaterInfo'
import MyTheaterOrders from '../component/theater/MyTheaterOrders'
import NewPublicInfo from '../component/theater/NewPublicInfo'
import NewCoupon from '../component/theater/NewCoupon'
import SellTicket from '../component/theater/SellTicket'
import TheaterShowList from '../component/theater/TheaterShowList'
import Examination from '../component/tickets/Examination'
import Statistics from '../component/tickets/Statistics'
import TheaterList from '../component/tickets/TheaterList'


export const mainComponent = (props) => {
    let itemKey = _.isEmpty(props.itemKey) ? 'Main' : props.itemKey;
    if (itemKey.indexOf("#") !== -1) {
        itemKey = props.itemKey.substring(0, props.itemKey.indexOf("#"))
    }
    return RouteTable[props.role][itemKey].component
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
        ShowList: {
            path: "ShowList",
            text: "剧集列表",
            component: <ShowList/>,
        },
        ShowInfo: {
            path: "ShowInfo",
            text: "剧集信息",
            component: <ShowInfo/>
        },
        ChooseSeat: {
            path: "ChooseSeat",
            text: "选择座位",
            needAuthed: true,
            component: <ChooseSeat/>
        },
        PayOrder: {
            path: "PayOrder",
            text: "支付订单",
            needAuthed: true,
            component: <PayOrder/>
        }
    },
    THEATER: {
        Main: {
            path: "Main",
            text: "主页",
            needAuthed: true,
            component: <Main/>,
        },
        NewPublicInfo: {
            path: "NewPublicInfo",
            text: "发布计划",
            needAuthed: true,
            component: <NewPublicInfo/>,
        },
        NewCoupon: {
            path: "NewCoupon",
            text: "发布优惠券",
            needAuthed: true,
            component: <NewCoupon/>,
        },
        SellTicket: {
            path: "SellTicket",
            text: "售票",
            needAuthed: true,
            component: <SellTicket/>,
        },
        CheckIn: {
            path: "CheckIn",
            text: "检票",
            needAuthed: true,
            component: <CheckIn/>,
        },
        MyPublicInfos: {
            path: "MyPublicInfos",
            text: "剧院计划",
            needAuthed: true,
            component: <MyPublicInfos/>,
        },
        MyTheaterInfo: {
            path: "MyTheaterInfo",
            text: "剧院信息",
            needAuthed: true,
            component: <MyTheaterInfo/>,
        },
        MyTheaterOrders: {
            path: "MyTheaterOrders",
            text: "剧院订单",
            needAuthed: true,
            component: <MyTheaterOrders/>,
        },
        MyTheaterFinance: {
            path: "MyTheaterFinance",
            text: "剧院财务",
            needAuthed: true,
            component: <MyTheaterFinance/>,
        },
        TheaterShowList: {
            path: "TheaterShowList",
            text: "剧集信息",
            needAuthed: true,
            component: <TheaterShowList/>
        }
    },
    TICKETS: {
        Main: {
            path: "Main",
            text: "主页",
            needAuthed: true,
            component: <Main/>,
        },
        MyTheaterFinance: {
            path: "MyTheaterFinance",
            text: "剧院财务",
            needAuthed: true,
            component: <MyTheaterFinance/>,
        },
        Examination: {
            path: "Examination",
            text: "审批请求",
            needAuthed: true,
            component: <Examination/>
        },
        Statistics: {
            path: "Statistics",
            text: "统计信息",
            needAuthed: true,
            component: <Statistics/>
        },
        TheaterList: {
            path: "TheaterList",
            text: "剧院列表",
            needAuthed: true,
            component: <TheaterList/>
        }
    }
};

