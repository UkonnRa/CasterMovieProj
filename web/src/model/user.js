import {RouteTable} from "../route";

export const Role = {CUSTOMER: "CUSTOMER", THEATER: "THEATER", TICKETS: "TICKETS"};

export const SiderMap = {
    [Role.CUSTOMER]: [
        {type: "item", icon: "desktop", key: RouteTable[Role.CUSTOMER].Main.path,text: RouteTable[Role.CUSTOMER].Main.text},
        {type: "item", icon: "bars", key: RouteTable[Role.CUSTOMER].ShowList.path, text: RouteTable[Role.CUSTOMER].ShowList.text},
        {
            type: "subMenu", icon: "idcard", text: "我的", item: [
                {type: "item", key: RouteTable[Role.CUSTOMER].MyInfo.path, text: RouteTable[Role.CUSTOMER].MyInfo.text},
                {type: "item", key: RouteTable[Role.CUSTOMER].MyOrder.path, text: RouteTable[Role.CUSTOMER].MyOrder.text},
                {type: "item", key: RouteTable[Role.CUSTOMER].MyCouponInfo.path, text: RouteTable[Role.CUSTOMER].MyCouponInfo.text}
            ]
        }
    ],
};