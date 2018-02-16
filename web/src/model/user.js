export const Role = {CUSTOMER: "CUSTOMER", THEATER: "THEATER", TICKETS: "TICKETS"};

export const SiderMap = {
    customer: [
        {type: "item", key: "1", icon: "desktop", text: "主页"},
        {type: "item", key: "2", icon: "bars", text: '剧集列表'},
        {
            type: "subMenu", key: "sub1", icon: "idcard", text: "我的", item: [
                {type: "item", key: "3", text: "我的信息"},
                {type: "item", key: "4", text: "我的订单"},
                {type: "item", key: "5", text: "我的动态"}
            ]
        }
    ],
};