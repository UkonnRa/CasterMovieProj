import React, {Component} from "react";
import {connect} from "react-redux";
import {List, Modal, Pagination} from 'antd'
import _ from "lodash";
import axios from 'axios'
import {Api} from "../../api";
import moment from 'moment'
import {route} from "../../redux/ui/actions";
import {SELECT_PUBLIC_INFO} from "../../redux/publicInfo/types";
import {RouteTable} from "../../route";

class MyPublicInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            publicInfos: [],
        }
    }

    componentWillMount = async () => {
        const publicInfos = await axios.get(Api.publicInfo.findAllByTheaterId, {
            params: {theaterId: this.props.user.id},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        if (publicInfos.data.value) {
            this.setState({publicInfos: publicInfos.data.value})
        } else {
            alert(publicInfos.data.message)
        }
    };

    pagination = {
        pageSize: 5,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.state.publicInfos.length, page * pageSize])
            })
        },
    };

    info = (item) => {
        console.log(item);
        Modal.info({
            title: '剧集信息',
            content: (
                <div>
                    <p>发布日期：{moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p>剧集id：{item.showId}</p>
                    <p>上映时间：{moment(item.schedule).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p>基础价格：{(item.basePrice / 100).toFixed(2)}元</p>
                    <p>价格座位表：{JSON.stringify(item.priceTable, null, 2)}</p>
                    <p>销售情况：{`已销售：${item.seatDistribution.filter(i => !i).length}，销售比：${item.seatDistribution.filter(i => !i).length / item.seatDistribution.length}`}</p>
                    <p>是否完成自动配票：{item.hasBeenDistributed ? "是" : "否"}</p>
                </div>
            ),
            onOk() {
            },
        });
    };

    actions = (item) => {
        if (item.schedule > new Date()) {
            return [<a onClick={() => {
                this.props.selectPublicInfo(item);
                this.props.route(`${RouteTable.THEATER.SellTicket.path}#${item.id}`, this.props.isAuthed, this.props.user.role)
            }}>售票</a>]
        }
    };

    render() {
        return <div>

            <List
                dataSource={this.state.publicInfos.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id} actions={this.actions(item)}>
                        <List.Item.Meta
                            title={<a onClick={() => this.info(item)}>{item.id}</a>}/>
                        <p>发布日期：{moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</p>
                        <p>剧集id：{item.showId}</p>
                        <p>上映时间：{moment(item.schedule).format('YYYY-MM-DD HH:mm:ss')}</p>
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={this.state.publicInfos.length}
                        pageSize={this.pagination.pageSize}
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
    return {
        selectPublicInfo: (publicInfo) => dispatch({type: SELECT_PUBLIC_INFO, selectedPublicInfo: publicInfo}),
        route: (key, isAuthed, role) => dispatch(route(key, isAuthed, role)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPublicInfos)


