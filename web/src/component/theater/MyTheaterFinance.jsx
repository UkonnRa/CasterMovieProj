import React, {Component} from "react";
import {connect} from "react-redux";
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'
import {Api} from "../../api";
import moment from "moment"
import qs from "qs";
import {Role} from "../../model/user";
import _ from 'lodash'

class MyTheaterFinance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bigFive: {},
            orderStates: {},
            grossIncome: {},
        }
    }

    componentWillMount = async () => {
        const {user} = this.props;
        let bigFiveData = await axios.get(Api.theater.bigFiveTotal, {
            params: {
                theaterId: user.id
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        if (bigFiveData.data.value) {
            this.setState({bigFive: _(bigFiveData.data.value).toPairs().sortBy(1).fromPairs().value()})
        } else {
            console.log(bigFiveData.data.message)
        }

        let orderStatesData = await axios.get(Api.theater.orderStatesTotal, {
            params: {
                theaterId: user.id
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });

        if (orderStatesData.data.value) {
            this.setState({orderStates: _(orderStatesData.data.value).toPairs().sortBy(0).fromPairs().value()})
        } else {
            console.log(orderStatesData.data.message)
        }

        let grossIncomeData = await axios.get(Api.theater.grossIncomeMonthlyRange, {
            params: {
                theaterId: user.id,
                yearMonths: [moment().subtract(4, 'months').format("YYYY-MM"), moment().add(1, 'months').format("YYYY-MM")]
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

    };

    bigFiveChart = () => {
        const {bigFive} = this.state;
        const option = {
            title: {
                text: '订单数前五用户图'
            },
            tooltip: {},
            legend: {
                data: ['订单数']
            },
            xAxis: {
                data: Object.keys(bigFive)
            },
            yAxis: {},
            series: [{
                name: '订单数',
                type: 'bar',
                data: Object.values(bigFive)
            }]
        };
        return <ReactEcharts option={option}/>
    };

    orderStatesTotalChart = () => {
        const {orderStates} = this.state;

        const option = {
            title: {
                text: '剧院订单状态图',
                x: 'center'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: Object.keys(orderStates)
            },
            series: [{
                name: '订单数',
                type: 'pie',
                data: Object.keys(orderStates).map(state => {
                    return {value: orderStates[state], name: state}
                })
            }]
        };
        return <ReactEcharts option={option}/>

    };

    grossIncomeMonthlyChart = () => {
        const {grossIncome} = this.state;

        const option = {
            title: {
                text: '每月总收入折线图',
                x: 'center'
            },
            xAxis: {
                type: 'category',
                data: Object.keys(grossIncome)
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: Object.values(grossIncome).map(i => (i / 100).toFixed(2)),
                type: 'line'
            }]
        };
        return <ReactEcharts option={option}/>
    };

    render = () => <div>
        {this.bigFiveChart()}
        {this.orderStatesTotalChart()}
        {this.grossIncomeMonthlyChart()}
    </div>
}

const mapStateToProps = (state) => {
    let user = state.loginReducer.user;
    if (user.role === Role.TICKETS) {
        user = state.theaterReducer.selectedTheater
    }
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTheaterFinance)


