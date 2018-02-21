import React, {Component} from 'react'
import {List, Divider, Pagination} from 'antd'
import {connect} from 'react-redux'
import {findAllByUserId} from "../../redux/couponInfo/actions";
import _ from 'lodash'

class MyCouponInfo extends Component {
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
        defaultCurrent: 1,
        onChange: (page, pageSize) => {
            this.setState({currPage: page,start: (page - 1) * pageSize, end: _.min([this.props.couponInfos.length, page * pageSize])})
        },
    };

    render() {
        return (
            <div>
                <Divider>优惠券</Divider>
                <List
                    dataSource={this.props.couponInfos.slice(this.state.start, this.state.end)}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={item.name}
                                description={item.description}/>
                            领取时间：{new Date(item.createTime).toLocaleString()}
                            <br/>
                            状态：{item.state}
                            <br/>
                            可用剧院代码：{item.theaterId}
                            <br/>
                            折扣额度：{item.discount}
                            <br/>
                            到期时间：{item.expiredType === "TIME_POINT"? new Date(item.expiredTime).toLocaleString(): new Date(item.expiredTime + item.createTime).toLocaleString()}
                        </List.Item>
                    )}/>
                <Pagination current={this.state.currPage} total={this.props.couponInfos.length} pageSize={this.pagination.pageSize} onChange={this.pagination.onChange} />
            </div>
        )
    }

}


const mapStateToProps = state => {
    return {
        couponInfos: state.couponInfoReducer.couponInfos,
        userId: state.loginReducer.user.id,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        findAllByUserId: (userId) => dispatch(findAllByUserId(userId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCouponInfo)
