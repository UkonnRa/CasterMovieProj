import {RouteTable} from "../route";
import {Tag} from 'antd'
import React from 'react'

export const Role = {CUSTOMER: "CUSTOMER", THEATER: "THEATER", TICKETS: "TICKETS"};

export const Level = {
    LEVEL1: {
        text: "LEVEL1",
        tag: <Tag color="blue">LEVEL1</Tag>,
    }, LEVEL2: {
        text: "LEVEL2",
        tag: <Tag color="green">LEVEL2</Tag>,
    }, LEVEL3: {
        text: "LEVEL3",
        tag: <Tag color="red">LEVEL3</Tag>,
    }, LEVEL4: {
        text: "LEVEL4",
        tag: <Tag color="purple">LEVEL4</Tag>,
    }, LEVEL5: {
        text: "LEVEL5",
        tag: <Tag color="gold">LEVEL5</Tag>,
    }
};

export const SiderMap = {
    [Role.TICKETS]: [
        {
            type: "item",
            icon: "desktop",
            key: RouteTable[Role.TICKETS].Main.path,
            text: RouteTable[Role.TICKETS].Main.text,
        },
        {
            type: "item",
            icon: "check",
            key: RouteTable[Role.TICKETS].Examination.path,
            text: RouteTable[Role.TICKETS].Examination.text,
        },
        {
            type: "item",
            icon: "line-chart",
            key: RouteTable[Role.TICKETS].Statistics.path,
            text: RouteTable[Role.TICKETS].Statistics.text,
        },
    ],
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
            type: "item", 
            icon: "idcard", 
            text: RouteTable[Role.CUSTOMER].MyInfo.text,
            key: RouteTable[Role.CUSTOMER].MyInfo.path
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
            type: 'item',
            icon: "pay-circle-o",
            key: RouteTable[Role.THEATER].NewCoupon.path,
            text: RouteTable[Role.THEATER].NewCoupon.text,
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