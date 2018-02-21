import React, {Component} from 'react'
import {List, Divider, Pagination} from 'antd'
import {connect} from 'react-redux'
import {findAllByUserId} from "../../redux/order/actions";
import _ from 'lodash'

class MyOrder extends Component {
    constructor (props) {
        super(props);
        this.state = {
            start: 0,
            end : this.pagination.pageSize,
            currPage: 1
        }
    }

    componentWillMount = () => {
        this.props.findAllByUserId(this.props.userId)
    };

    pagination = {
        pageSize: 3,
        onChange: (page, pageSize) => {
            this.setState({currPage: page,start: (page - 1) * pageSize, end: _.min([this.props.orders.length, page * pageSize])})
        },
    };

    render() {
        return (
            <div>
                <Divider>订单</Divider>
                <List
                    dataSource={this.props.orders.slice(this.state.start, this.state.end)}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={item.showName}
                                description={new Date(item.startTime).toLocaleString()}/>
                            剧院名称：{item.theaterName}
                            <br/>
                            付款用户：{item.payUsername}
                            <br/>
                            实际金额：{(item.actualCost / 100.0).toFixed(2)}
                            <br/>
                            创建时间：{new Date(item.createTime).toLocaleString()}
                            <br/>
                            订单状态：{item.orderState}
                            <br/>
                            使用优惠券：{item.couponName == null? "[未使用优惠券]": item.couponName}
                        </List.Item>
                    )}/>
                <Pagination current={this.state.currPage} total={this.props.orders.length} pageSize={this.pagination.pageSize} onChange={this.pagination.onChange} />
            </div>
        )
    }

}


const mapStateToProps = state => {
    return {
        orders: state.orderReducer.orders,
        userId: state.loginReducer.user.id,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        findAllByUserId: (userId) => dispatch(findAllByUserId(userId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrder)
