import React, {Component} from "react";
import {connect} from "react-redux";
import {List, Pagination} from 'antd'
import _ from "lodash";
import moment from "moment/moment";
import axios from 'axios'
import {Api} from "../../api";
import {Modal} from "antd/lib/index";

class MyTheaterOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            orderList: []
        }
    }

    componentWillMount = async () => {
        const orderListData = await axios.get(Api.order.findAllByTheaterId, {
            params: {
                theaterId: this.props.user.id,
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            }
        });
        if (orderListData.data.value) {
            this.setState({orderList: orderListData.data.value})
        } else {
            alert(orderListData.data.message)
        }
    };

    pagination = {
        pageSize: 3,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.state.orderList.length, page * pageSize])
            })
        },
    };

    info = (item) => {
        console.log(item);
        Modal.info({
            title: '订单详情',
            content: (
                <div>
                    <p>id：{item.id}</p>
                    <p>剧集名称：{item.showName}</p>
                    <p>订单状态：{item.orderState}</p>
                    <p>用户名：{item.username}</p>
                    <p>支付用户名：{item.payUsername}</p>
                    <p>应付价格：{(item.originalCost / 100).toFixed(2)}元</p>
                    <p>实付价格：{(item.actual / 100).toFixed(2)}元</p>
                    <p>订单生成时间：{moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")}</p>
                    <p>预定座位：{JSON.stringify(item.seats, null, 2)}</p>
                    <p>是否完成自动配票：{item.hasBeenDistributed ? "是" : "否"}</p>
                    <p>优惠券名称：{item.couponName ? item.couponName : "[无优惠券信息]"}</p>
                </div>
            ),
            onOk() {
            },
        });
    };


    render() {
        const {orderList} = this.state;
        return <div>
            <List
                dataSource={orderList.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={<a onClick={() => this.info(item)}>{item.id}</a>}
                            description={item.showName}/>
                        用户：{item.username}
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={orderList.length} pageSize={this.pagination.pageSize}
                        onChange={this.pagination.onPageChange}/>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTheaterOrders)


