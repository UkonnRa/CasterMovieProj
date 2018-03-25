import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Button, Checkbox, InputNumber, Radio, Select} from 'antd'
import moment from 'moment'
import {Api} from "../../api";
import _ from 'lodash'
import {findById} from "../../redux/order/actions";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import {State} from "../../model/couponInfo";
import {findAllByUserId} from "../../redux/couponInfo/actions";


class ChooseSeat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedShow: {},
            selectedTheater: {},
            selectedSeats: [],
            selectedMode: 'AUTO',
            autoNumber: 0,
            selectedCouponInfo: {discount: 1.0},
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
                this.props.route(`${RouteTable.CUSTOMER.PayOrder.path}#${orderData.data.value.id}`, this.props.isAuthed)
            } else {
                alert(`Order error: ${orderData.data.message}`)
            }
        } else alert("Some thing is empty!!!")
    };

    createCouponInfoSelect = () =>
        <Select defaultValue="no" onChange={(id) => this.setState({selectedCouponInfo: this.findFromArray(id)})}>
            <Select.Option value="no">[不选择优惠]</Select.Option>
            {this.props.couponInfos.filter(info => info.state === State.READY)
                .map(info => <Select.Option value={info.id}>{info.name}</Select.Option>)}
        </Select>;

    component = () => {
        if (this.state.selectedMode === 'AUTO') {
            this.props.findAllByUserId(this.props.user.id);
            return <div>
                <InputNumber min={1} max={20} defaultValue={1}
                             onChange={(e) => this.setState({autoNumber: e})}>座位数</InputNumber>
                <br/>
                <span>优惠券：{this.createCouponInfoSelect()}</span>
                <br/>
                <Button onClick={this.autoOrder}>自动配票</Button>
            </div>
        } else if (this.state.selectedMode === 'MANUAL') {
            return <div>
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
        } else {
            return <p>HOW CAN YOU GET THIS!!!</p>
        }
    };

    autoOrder = () => {
        axios.post(Api.order.newOrder,
            {
                userId: this.props.user.id,
                publicInfoId: this.props.selectedPublicInfo.id,
                seats: [...new Array(this.state.autoNumber)].map(() => null)
            },
            {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`
                }
            }).then(resp => {
            if (resp.data.value) {
                alert("预定完成，该订单将于开演前两周配票并自动扣款，请保持账户余额充足");
                this.props.route(RouteTable.CUSTOMER.ShowList.path, this.props.isAuthed)
            } else {
                alert(resp.data.message)
            }
        }).catch(err => alert(err))
    };

    render = () => <div>
        剧集名称：{this.state.selectedShow.name}
        <br/>
        剧院：{this.state.selectedTheater.name}
        <br/>
        放映时间：{moment(this.props.selectedPublicInfo.schedule).format("YYYY-MM-DD HH:mm:ss")}
        <br/>
        <Radio.Group onChange={(e) => this.setState({selectedMode: e.target.value})} value={this.state.selectedMode}>
            <Radio value={'AUTO'}>自动配票</Radio>
            <Radio value={'MANUAL'}>手动选座</Radio>
        </Radio.Group>
        <br/>
        {this.component()}
    </div>
}

const mapStateToProps = state => {
    return {
        selectedPublicInfo: state.publicInfoReducer.selectedPublicInfo,
        user: state.loginReducer.user,
        couponInfos: state.couponInfoReducer.couponInfos,
        isAuthed: state.loginReducer.isAuthed,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        findById: (id) => dispatch(findById(id)),
        route: (key, isAuthed) => dispatch(route(key, isAuthed)),
        findAllByUserId: (userId) => dispatch(findAllByUserId(userId)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSeat)