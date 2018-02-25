import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Checkbox, Input} from 'antd'
import axios from "axios/index";
import {Api} from "../../api";
import _ from "lodash";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";

class SellTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedShow: {},
            selectedSeats: [],
            userId: "",
            money: 0
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
        this.setState({selectedShow: show.data.value,})
    };

    onSeatClick = (selectedSeats) => {
        const {selectedPublicInfo} = this.props;
        const money = _.sum(selectedSeats.map(seat =>
            selectedPublicInfo.priceTable[_.max(Object.keys(selectedPublicInfo.priceTable).filter(key => key <= seat))])) * selectedPublicInfo.basePrice;
        console.log(money);
        this.setState({selectedSeats: selectedSeats, money: money})
    };

    submit = async () => {
        const {user, selectedPublicInfo, route, isAuthed} = this.props;
        const {userId, selectedSeats} = this.state;
        if (_.isEmpty(selectedSeats)) {
            alert("请选择座位")
        } else {
            const result = await axios.post(Api.order.orderOffline, {
                userId: _.isEmpty(userId.trim()) ? null : userId,
                publicInfoId: selectedPublicInfo.id,
                seats: selectedSeats
            }, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            if (result.data.value) {
                alert('订单生成成功');
                route(RouteTable.THEATER.TheaterShowList.path, isAuthed, user.role)
            } else {
                alert(result.data.message)
            }
        }
    };

    render = () => <div>
        <p>剧集编号：{this.props.selectedPublicInfo.id}</p>
        <p>剧集名称：{this.state.selectedShow.name}</p>
        <p>用户Id：<Input onKeyUp={(e) => this.setState({userId: e.target.value})}/></p>
        <Checkbox.Group onChange={this.onSeatClick}>
            {_.chunk(this.props.selectedPublicInfo.seatDistribution, this.props.user.seatPerLine).map((seatLine, outerIndex) =>
                <div key={outerIndex}>
                    {seatLine.map((item, innerIndex) => <Checkbox
                        key={innerIndex}
                        value={outerIndex * this.props.user.seatPerLine + innerIndex}
                        disabled={!item}/>)}
                    <br/>
                    <br/>
                </div>
            )}
        </Checkbox.Group>
        <p>价格：{(this.state.money / 100).toFixed(2)}元</p>
        <Button onClick={this.submit}>提交订单</Button>
    </div>
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
        selectedPublicInfo: state.publicInfoReducer.selectedPublicInfo,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        route: (key, isAuthed, role) => dispatch(route(key, isAuthed, role))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SellTicket)


