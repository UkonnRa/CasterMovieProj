import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {List, Pagination} from 'antd'
import {RouteTable} from "../../route";
import axios from 'axios'
import {Api} from "../../api";
import {selectTheater} from "../../redux/theater/actions";
import {AreaCascader} from 'react-area-linkage';
import {route} from "../../redux/ui/actions";


class TheaterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            theaterList: [],
            regionId: 440305,
        }
    }

    componentWillMount = () => {
        axios.get(Api.theater.findAllTheater, {
            params: {
                regionId: this.state.regionId,
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(theaters => {
            if (theaters.data.value) {
                this.setState({theaterList: theaters.data.value})
            } else {
                console.log(theaters.data.message)
            }
        }).catch(err => console.log(err))
    };

    pagination = {
        pageSize: 5,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.state.theaterList.length, page * pageSize])
            })
        },
    };

    onTheaterItemClick = (theaterId) => {
        this.props.selectTheater(theaterId).then(() => this.props.route(`${RouteTable[this.props.user.role].MyTheaterFinance.path}#${theaterId}`, this.props.isAuthed, this.props.user.role))
    };

    onRegionIdChange = (code) => {
        this.setState({regionId: !_.isEmpty(code) ? Number(_.last(code)) : -1});
        console.log(_.last(code));
        axios.get(Api.theater.findAllTheater, {
            params: {
                regionId: _.last(code),
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(theaters => {
            if (theaters.data.value) {
                this.setState({theaterList: theaters.data.value})
            } else {
                console.log(theaters.data.message)
            }
        }).catch(err => console.log(err))
    };

    giveMoneyToTheater = (theaterId) => {
        axios.post(Api.ticketsManager.giveMoneyToTheater, {
            theaterId: theaterId
        }, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            }
        }).then(moneyData => {
            if (moneyData.data.value)
                alert(`款项结算完毕，共${(moneyData.data.value / 100).toFixed(2)}元`)
            else alert(moneyData.data.message)
        })
    }

    render() {
        const {theaterList} = this.state;
        return <div>
            <AreaCascader placeholder={'选择区域，默认全选'} level={1} onChange={this.onRegionIdChange}/>

            <List
                dataSource={theaterList.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id} actions={[<a onClick={() => this.giveMoneyToTheater(item.id)}>分配票款</a>]}>
                        <List.Item.Meta
                            title={<a onClick={() => this.onTheaterItemClick(item.id)}>{item.name}</a>}
                            description={item.location}/>
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={theaterList.length} pageSize={this.pagination.pageSize}
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
        selectTheater: (theaterId) => dispatch(selectTheater(theaterId)),
        route: (key, isAuthed, role) => dispatch(route(key, isAuthed, role))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TheaterList)


