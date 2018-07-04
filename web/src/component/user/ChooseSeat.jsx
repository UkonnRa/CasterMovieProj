import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Button, Col, Divider, message, Row} from 'antd'
import Seatmap from '../seatmap/build';
import {Api} from "../../api";
import _ from 'lodash'
import {findById} from "../../redux/order/actions";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import {findAllByUserId} from "../../redux/couponInfo/actions";
import './ChooseSeat.css'
import {Genre} from '../../model/show'
import moment from 'moment'

class ChooseSeat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedShow: {},
            selectedTheater: {},
            selectedSeats: [],
            autoNumber: 0,
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
                message.info("已成功预定座位，即将跳转至付款页面...");
                this.props.route(`${RouteTable.CUSTOMER.PayOrder.path}#${orderData.data.value.id}`, this.props.isAuthed)
            } else {
                message.info(`发生错误：${orderData.data.message}`);
            }
        } else {
            message.warning("请至少选择一个座位");
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

    onAddSeat = (row, number) => {
        this.setState({selectedSeats: [...this.state.selectedSeats, (row.charCodeAt(0) - 'A'.charCodeAt(0)) * this.state.selectedTheater.seatPerLine + (number - 1)]})
    };

    onRemoveSeat = (row, number) => {
        this.setState({selectedSeats: _.without(this.state.selectedSeats, (row.charCodeAt(0) - 'A'.charCodeAt(0)) * this.state.selectedTheater.seatPerLine + (number - 1))})

    };

    mapRowFromSeatDistribution = () => {
        let seatPerLine = this.state.selectedTheater.seatPerLine;
        let {seatDistribution} = this.props.selectedPublicInfo;
        let mapToSeats = seatDistribution
            .map((elem, index) => {
                return {number: index % seatPerLine + 1, isReserved: !elem}
            });
        return _.chunk(mapToSeats, seatPerLine);
    };

    render = () => {
        let {genre, duration} = this.state.selectedShow;
        let showName = this.state.selectedShow.name;
        let theaterName = this.state.selectedTheater.name;
        let basePrice = this.props.selectedPublicInfo.basePrice;

        return <div align="center" className="choose-seat">
            <Row>
                <Col span={15} style={{padding: '20px'}}>
                    <Divider>银幕</Divider>
                    {this.state.selectedTheater.seatPerLine ?
                        <Seatmap addSeatCallback={this.onAddSeat} removeSeatCallback={this.onRemoveSeat}
                                 maxSeatCallback={() => {
                                     message.warning('一次最多可购买6张票');
                                 }} rows={this.mapRowFromSeatDistribution()} maxReservableSeats={6} alpha/> : null}
                </Col>
                <Col span={9} className="   choose-seat-side">
                    <Row type="flex" justify="start">
                        <Col span={13}>
                            <img className="choose-seat-side-img"
                                 src="https://castermovie.oss-cn-beijing.aliyuncs.com/show/crzdy.jpg"
                                 style={{width: '160px'}}/>
                        </Col>
                        <Col span={11} className="show-info">
                            <h2 className="show-info-show-name">{showName}</h2>
                            <br/>
                            <span className="show-info-info">类型：</span>{Genre.get(genre)}
                            <br/>
                            <span className="show-info-info">时长：</span>{duration / 60 | 0} 分钟
                        </Col>
                    </Row>
                    <div className="show-info">
                        <span className="show-info-info">剧院：</span>{theaterName}
                        <br/>
                        <span className="show-info-info">场次：</span><span
                        className="show-info-info-time">{moment(this.props.selectedPublicInfo.schedule).format("YYYY-MM-DD HH:mm")}</span>
                        <br/>
                        <span className="show-info-info">票价：</span>{basePrice / 100} 元/人
                        <Divider/>
                        <span className="show-info-info">总价：</span><span
                        className="show-info-info-total">{basePrice / 100 * this.state.selectedSeats.length} 元</span>
                    </div>
                    <Button onClick={this.submit}>提交订单</Button>

                </Col>
            </Row>
        </div>
    }
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