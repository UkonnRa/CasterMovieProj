import {RouteTable} from "../route";

export const Role = {CUSTOMER: "CUSTOMER", THEATER: "THEATER", TICKETS: "TICKETS"};

export const SiderMap = {
    [Role.CUSTOMER]: [
        {
            type: "item",
            icon: "desktop",
            key: RouteTable[Role.CUSTOMER].Main.path,
            text: RouteTable[Role.CUSTOMER].Main.text
        },
        {
            type: "item",
            icon: "bars",
            key: RouteTable[Role.CUSTOMER].ShowList.path,
            text: RouteTable[Role.CUSTOMER].ShowList.text
        },
        {
            type: "subMenu", icon: "idcard", text: "我的", item: [
                {
                    type: "item",
                    key: RouteTable[Role.CUSTOMER].MyInfo.path,
                    text: RouteTable[Role.CUSTOMER].MyInfo.text
                },
                {
                    type: "item",
                    key: RouteTable[Role.CUSTOMER].MyOrder.path,
                    text: RouteTable[Role.CUSTOMER].MyOrder.text
                },
                {
                    type: "item",
                    key: RouteTable[Role.CUSTOMER].MyCouponInfo.path,
                    text: RouteTable[Role.CUSTOMER].MyCouponInfo.text
                }
            ]
        }
    ],
    [Role.THEATER]: [
        {
            type: "item",
            icon: "desktop",
            key: RouteTable[Role.THEATER].Main.path,
            text: RouteTable[Role.THEATER].Main.text
        },
        {
            type: "item",
            icon: "bars",
            key: RouteTable[Role.THEATER].TheaterShowList.path,
            text: RouteTable[Role.THEATER].TheaterShowList.text
        },
        {
            type: "item",
            icon: "pay-circle-o",
            key: RouteTable[Role.THEATER].SellTicket.path,
            text: RouteTable[Role.THEATER].SellTicket.text
        },
        {
            type: "item",
            icon: "notification",
            key: RouteTable[Role.THEATER].CheckIn.path,
            text: RouteTable[Role.THEATER].CheckIn.text
        },
        {
            type: "subMenu", icon: "tags-o", text: "剧院", item: [
                {
                    type: "item",
                    key: RouteTable[Role.THEATER].MyPublicInfos.path,
                    text: RouteTable[Role.THEATER].MyPublicInfos.text
                },
                {
                    type: "item",
                    key: RouteTable[Role.THEATER].MyTheaterInfo.path,
                    text: RouteTable[Role.THEATER].MyTheaterInfo.text
                },
                {
                    type: "item",
                    key: RouteTable[Role.THEATER].MyTheaterOrders.path,
                    text: RouteTable[Role.THEATER].MyTheaterOrders.text
                },
                {
                    type: "item",
                    key: RouteTable[Role.THEATER].MyTheaterFinance.path,
                    text: RouteTable[Role.THEATER].MyTheaterFinance.text
                }
            ]
        }
    ]
};