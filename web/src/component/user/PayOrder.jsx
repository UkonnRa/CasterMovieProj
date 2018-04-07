import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button, Select} from 'antd'
import {route} from "../../redux/ui/actions";
import {findAllByUserId} from "../../redux/couponInfo/actions";
import _ from 'lodash'
import {State} from "../../model/couponInfo";
import Countdown from 'react-countdown-now';
import {OrderState} from "../../model/order";
import axios from "axios/index";
import {Api} from "../../api";
import {RouteTable} from "../../route";
import {getCurrentUser} from "../../redux/auth/actions";

class PayOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCouponInfo: {discount: 1.0},
            levelDiscount: 1.0
        }
    }

    componentWillMount = async () => {
        await this.props.findAllByUserId(this.props.user.id);
        let theater = await axios(Api.theater.findById, {
            params: {"id": this.props.selectedOrder.theaterId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        theater = theater.data.value;
        console.log(theater);

        if (theater) {
            let disc = theater.discounts[this.props.user.level];
            this.setState({levelDiscount: (_.isEmpty(disc)? 1.0: disc)})
        }
        else alert('cannot find theater')
    };

    renderer = ({hours, minutes, seconds, completed}) => {
        if (completed) {
            return <p>超时</p>;
        } else {
            return <p>{hours}:{minutes}:{seconds}</p>;
        }
    };

    findFromArray = (id) => {
        const result = this.props.couponInfos.find(i => i.id === id);
        return _.isEmpty(result) ? {discount: 1.0} : result
    };

    createCouponInfoSelect = () =>
        <Select defaultValue="no" onChange={(id) => this.setState({selectedCouponInfo: this.findFromArray(id)})}>
            <Select.Option value="no">[不选择优惠]</Select.Option>
            {this.props.couponInfos.filter(info => info.state === State.READY)
                .map(info => <Select.Option value={info.id}>{info.name}</Select.Option>)}
        </Select>;

    onPayOrderClick = async () => {
        const order = await axios.post(Api.order.payOrder, {
            orderId: this.props.selectedOrder.id,
            userId: this.props.user.id,
            couponInfoId: this.state.selectedCouponInfo.id ? this.state.selectedCouponInfo.id : null
        }, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        if (order.data.value && order.data.value.orderState === OrderState.READY) {
            alert("ok");
            this.props.route(`${RouteTable.CUSTOMER.ShowList.path}`, this.props.isAuthed);
            this.props.getCurrentUser()
        } else {
            alert(`订单支付失败：${order.data.message}`)
        }
    };

    render() {
        const {id, originalCost, createTime} = this.props.selectedOrder;
        return <div>
            <p>订单编号：{id}</p>
            <p>订单金额：{(originalCost / 100.0).toFixed(2)}元</p>
            <p>等级优惠：{this.state.levelDiscount}</p>
            <span>优惠券：{this.createCouponInfoSelect()}</span>
            <p>实际应付：{(originalCost * this.state.selectedCouponInfo.discount * this.state.levelDiscount / 100.0).toFixed(2)}元</p>
            <p>座位将为您保持15分钟，超时将自动取消</p>
            <Countdown date={createTime + 15 * 60 * 1000}
                       renderer={this.renderer}/>
            <Button onClick={this.onPayOrderClick}>支付</Button>
        </div>
    }

}

const mapDispatchToProps = dispatch => {
    return {
        route: (key, isAuthed) => dispatch(route(key, isAuthed)),
        findAllByUserId: (userId) => dispatch(findAllByUserId(userId)),
        getCurrentUser: () => dispatch(getCurrentUser()),
    }
};

const mapStateToProps = state => {
    return {
        selectedOrder: state.orderReducer.selectedOrder,
        user: state.loginReducer.user,
        couponInfos: state.couponInfoReducer.couponInfos,
        isAuthed: state.loginReducer.isAuthed,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PayOrder)