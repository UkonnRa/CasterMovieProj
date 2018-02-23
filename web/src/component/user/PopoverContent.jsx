import React, {Component} from 'react';
import {connect} from "react-redux";
import {Role} from "../../model/user"
import {OrderState} from "../../model/order"
import {logout} from "../../redux/auth/actions";
import {fadePopover} from "../../redux/ui/avatarAffix/actions";


class PopoverContent extends Component {

    onLogoutClick = () => {
        this.props.logout();
        this.props.fadePopover();
        alert("成功退出")
    };

    content = () => {
        if (this.props.user.role === Role.CUSTOMER) {
            return <div>
                <p>已经消费： {(this.props.user.paid / 100).toFixed(2)}元</p>
                <p>获取积分： {this.props.user.point}</p>
                <p>已经就绪的订单数：{this.props.orders.filter(o => o.orderState === OrderState.READY).length}</p>
                <a onClick={this.onLogoutClick}>退出登录</a>
            </div>
        }
    };

    render() {
        return this.content()
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.loginReducer.user,
        orders: state.orderReducer.orders
    }
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        fadePopover: () => dispatch(fadePopover()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopoverContent)
