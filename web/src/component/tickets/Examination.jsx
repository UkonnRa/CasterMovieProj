import React, {Component} from "react";
import {connect} from "react-redux";
import {Divider, List, Pagination} from 'antd'
import _ from "lodash";
import axios from 'axios'
import {Api} from "../../api";
import moment from "moment/moment";
import {Modal} from "antd/lib/index";
import {RequestInfoState} from "../../model/requestInfo";

class Examination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            requestInfos: [],
        }
    }

    getRequestInfos = async () => {
        const requestInfosData = await axios.get(Api.requestInfo.findAllRequestInfo, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        console.log(requestInfosData);
        if (requestInfosData.data.value) {
            this.setState({requestInfos: requestInfosData.data.value.sort((a, b) => b.timestamp - a.timestamp)})
        } else {
            console.log(requestInfosData.data.message)
        }
    };

    componentWillMount = async () => {
        await this.getRequestInfos()
    };

    pagination = {
        pageSize: 5,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.state.requestInfos.length, page * pageSize])
            })
        },
    };

    info = (item) => {
        Modal.info({
            title: '剧集信息',
            content: (
                <div>
                    <p>id：{item.id}</p>
                    <p>状态：{item.state}</p>
                    <p>剧院id：{item.theaterId}</p>
                    <p>发布日期：{moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <Divider>修改后</Divider>
                    <p>名称：{item.theaterInfo.name}</p>
                    <p>区域编号：{item.theaterInfo.regionId}</p>
                    <p>地址：{item.theaterInfo.location}</p>
                    <p>座位总数：{item.theaterInfo.seatNumber}</p>
                    <p>每行座位数：{item.theaterInfo.seatPerLine}</p>
                    <p>等级折扣表：{JSON.stringify(item.theaterInfo.discounts, null, 2)}</p>
                </div>
            ),
            onOk() {
            },
        });
    };

    actions = (item) => {
        if (item.state === RequestInfoState.CREATING || item.state === RequestInfoState.UPDATING) {
            return [<a onClick={() => this.handle(item.id, true)}>通过</a>,
                <a onClick={() => this.handle(item.id, false)}>否决</a>]
        }
    };

    handle = async (id, isPositive) => {
        const infoData = await axios.post(Api.requestInfo.handle, {
            requestInfoId: id,
            isPositive: isPositive,
        }, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        if (!infoData.data.value) {
            alert(infoData.data.message)
        }
        await this.getRequestInfos()
    };

    render = () => {
        const {requestInfos} = this.state;
        return <div>
            <List
                dataSource={requestInfos.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id} actions={this.actions(item)}>
                        <List.Item.Meta
                            title={<a onClick={() => this.info(item)}>{item.theaterId}</a>}
                            description={moment(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}/>
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={requestInfos.length} pageSize={this.pagination.pageSize}
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

export default connect(mapStateToProps, mapDispatchToProps)(Examination)


