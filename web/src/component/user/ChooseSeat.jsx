import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Button, Checkbox, Divider} from 'antd'
import moment from 'moment'
import {Api} from "../../api";
import _ from 'lodash'
import {findById} from "../../redux/order/actions";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";


class ChooseSeat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedShow: {},
            selectedTheater: {},
            selectedSeats: []
        }
    }

    componentWillMount = async () => {
        const show = await axios.get(Api.show.findById, {
            params: {"id": this.props.selectedPublicInfo.showId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const theater = await axios.get(Api.theater.findById, {
            params: {"id": this.props.selectedPublicInfo.theaterId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        this.setState({selectedShow: show.data.value, selectedTheater: theater.data.value})
    };

    onSeatClick = (selectedSeats) => {
        this.setState({selectedSeats: selectedSeats})
    };

    submit = async () => {
        if (!_.isEmpty(this.state.selectedSeats) && !_.isEmpty(this.props.user.id) && !_.isEmpty(this.props.selectedPublicInfo.id)) {
            const orderData = await axios.post(Api.order.newOrder,
                {
                    userId: this.props.user.id,
                    publicInfoId: this.props.selectedPublicInfo.id,
                    seats: this.state.selectedSeats
                },
                {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            if (orderData.data.value) {
                await this.props.findById(orderData.data.value.id);
                this.props.route(`${RouteTable.CUSTOMER.PayOrder.path}#${orderData.data.value.id}`)
            } else {
                alert(`Order error: ${orderData.data.message}`)
            }
        } else alert("Some thing is empty!!!")
    };

    render() {
        return <div>
            剧集名称：{this.state.selectedShow.name}
            <br/>
            剧院：{this.state.selectedTheater.name}
            <br/>
            放映时间：{moment(this.props.selectedPublicInfo.schedule).format("YYYY-MM-DD HH:mm:ss")}
            <Divider>选座</Divider>
            <Checkbox.Group onChange={this.onSeatClick}>
                {_.chunk(this.props.selectedPublicInfo.seatDistribution, this.state.selectedTheater.seatPerLine).map((seatLine, outerIndex) =>
                    <div>
                        {seatLine.map((item, innerIndex) => <Checkbox
                            value={outerIndex * this.state.selectedTheater.seatPerLine + innerIndex}
                            disabled={!item}/>)}
                        <br/>
                        <br/>
                    </div>
                )}
            </Checkbox.Group>
            <Button onClick={this.submit}>提交订单</Button>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        selectedPublicInfo: state.publicInfoReducer.selectedPublicInfo,
        user: state.loginReducer.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        findById: (id) => dispatch(findById(id)),
        route: (key) => dispatch(route(key))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSeat)