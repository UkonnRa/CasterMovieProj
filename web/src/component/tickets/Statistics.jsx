import React, {Component} from "react";
import {connect} from "react-redux";
import {Api} from "../../api";
import moment from "moment/moment";
import qs from "query-string";
import axios from "axios/index";
import ReactEcharts from 'echarts-for-react';
import _ from "lodash";

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRegister: {},
            userCancel: {},
            grossIncome: {},
            userCount: 0,
        }
    }

    componentWillMount = async () => {
        let userRegisterData = await axios.get(Api.ticketsManager.userRegisterNumberMonthly, {
            params: {
                range: [moment().subtract(4, 'months').format("YYYY-MM"), moment().add(1, 'months').format("YYYY-MM")]
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        if (userRegisterData.data.value) {
            this.setState({userRegister: _(userRegisterData.data.value).toPairs().sortBy(0).fromPairs().value()})
        } else {
            console.log(userRegisterData.data.message)
        }

        let userCancelData = await axios.get(Api.ticketsManager.userCancelNumberMonthly, {
            params: {
                range: [moment().subtract(4, 'months').format("YYYY-MM"), moment().add(1, 'months').format("YYYY-MM")]
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        if (userCancelData.data.value) {
            this.setState({userCancel: _(userCancelData.data.value).toPairs().sortBy(0).fromPairs().value()})
        } else {
            console.log(userCancelData.data.message)
        }

        let grossIncomeData = await axios.get(Api.ticketsManager.ticketsGrossIncomeMonthly, {
            params: {
                range: [moment().subtract(4, 'months').format("YYYY-MM"), moment().add(1, 'months').format("YYYY-MM")]
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        if (grossIncomeData.data.value) {
            console.log(grossIncomeData.data.value);
            this.setState({grossIncome: _(grossIncomeData.data.value).toPairs().sortBy(0).fromPairs().value()})
        } else {
            console.log(grossIncomeData.data.message)
        }

        let userCountData = await axios.get(Api.ticketsManager.userExistingNumber, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        if (userCountData.data.value) {
            console.log(userCountData.data.value);
            this.setState({userCount: userCountData.data.value})
        } else {
            console.log(userCountData.data.message)
        }
    };

    userRegisterChart = () => {
        const {userRegister} = this.state;
        const option = {
            title: {
                text: '用户月注册量折线图'
            },
            xAxis: {
                data: Object.keys(userRegister)
            },
            yAxis: {},
            series: [{
                name: '用户注册数',
                type: 'line',
                data: Object.values(userRegister)
            }]
        };
        return <ReactEcharts option={option}/>
    };

    userCancelChart = () => {
        const {userCancel} = this.state;
        const option = {
            title: {
                text: '用户月注销量折线图'
            },
            xAxis: {
                data: Object.keys(userCancel)
            },
            yAxis: {},
            series: [{
                name: '用户注销数',
                type: 'line',
                data: Object.values(userCancel)
            }]
        };
        return <ReactEcharts option={option}/>
    };

    grossIncomeChart = () => {
        const {grossIncome} = this.state;
        const option = {
            title: {
                text: '网站现金流量折线图'
            },
            xAxis: {
                data: Object.keys(grossIncome)
            },
            yAxis: {},
            series: [{
                name: '元',
                type: 'line',
                data: Object.values(grossIncome).map(i => (i / 100).toFixed(2))
            }]
        };
        return <ReactEcharts option={option}/>
    };


    render = () => <div>
        <p>CasterMovie总用户数：{this.state.userCount}</p>
        {this.userRegisterChart()}
        {this.userCancelChart()}
        {this.grossIncomeChart()}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)


