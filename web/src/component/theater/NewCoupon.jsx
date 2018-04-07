import React, {Component} from 'react'
import {Input, List, Pagination, Tag} from 'antd'
import {connect} from 'react-redux'
import {findAllShowsByGenreIn, selectShow} from "../../redux/show/actions";
import {route} from "../../redux/ui/actions";
import {Genre} from "../../model/show";
import _ from "lodash";
import {RouteTable} from "../../route";
import moment from "moment";
import axios from 'axios';
import {ORDER_FIND_ALL_BY_USER_ID} from "../../redux/order/types";

class NewCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            coupons: []
        }
    }

    componentWillMount = () => {
        axios.post(Api.coupon.findAllByTheaterId, null, {
            param: {
                theaterId: user.id,
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(couponData => {
            if (couponData.data) {
                let coupon = couponData.data
                if (coupon.value) {
                    this.setState({coupons: coupon.value})
                } else {
                    alert(`Coupon Error: ${coupon.message}`)
                }
            }
        })
    }

    pagination = {
        pageSize: 5,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.props.shows.length, page * pageSize])
            })
        },
    };

    render() {
        return <Input.Search
                placeholder="剧集名称"
                onSearch={value => {
                    this.setState({keyword: value})
                }}
                enterButton
            />
            <br/>
            <List
                dataSource={resultShow.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id} actions={[<a onClick={() => this.onShowItemClick(item.id)}>发布计划</a>]}>
                        <List.Item.Meta
                            title={item.name}
                            description={Genre.get(item.genre)}/>
                        时长：{moment.utc(moment.duration(item.duration, 's').asMilliseconds()).format("HH:mm:ss")}
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={resultShow.length} pageSize={this.pagination.pageSize}
                        onChange={this.pagination.onPageChange}/>
        </div>
    }

}

const mapStateToProps = state => {
    return {
        user: state.loginReducer.user,
        isAuthed: state.loginReducer.isAuthed,
    }
};

export default connect(mapStateToProps)(NewCoupon)
