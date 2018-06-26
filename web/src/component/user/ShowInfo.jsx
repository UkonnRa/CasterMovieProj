import React, {Component} from 'react'
import {Card, Divider, List, Modal, Select, Tabs} from 'antd'
import {connect} from 'react-redux'

import 'react-area-linkage/dist/index.css'; // v2 or higher
import {pcaa} from "area-data";

import {AreaCascader} from 'react-area-linkage';
import {Genre} from "../../model/show";
import {findAllPublicInfoByShowId, findById} from "../../redux/publicInfo/actions";
import {route} from "../../redux/ui/actions";
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import axios from 'axios'
import {Api} from "../../api";
import _ from 'lodash'
import {RouteTable} from "../../route";
import {ExpiredType} from "../../model/coupon";

const moment = extendMoment(Moment);

class TheaterInfo extends Component {
    componentWillMount = () => {
        const {theater} = this.props

        axios.get(Api.coupon.findAllByTheaterId, {
            data: {theaterId: theater.id},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(couponsData => {
            if (couponsData.data.value) {
                this.setState({coupons: couponsData.data.value})
            } else {
                console.log(couponsData.data.message)
            }
        }).catch(err => console.log(err))
    }
    render = () => Modal.info({
        title: this.props.theater.name,
        content: (
            <div>
                <p>地点：{this.props.theater.location}</p>
                <p>座位总数：{this.props.theater.seatNumber}</p>
                <p><Select>
                    {this.state.coupons.map(coupon => {
                        return <Select.Option value={coupon.id}>
                            <Card>
                                <p>名称：{coupon.name}</p>
                                <p>折扣：{coupon.discount}</p>
                                <p>失效类型：{ExpiredType[coupon.expiredType].text}</p>
                                <p>失效时间：{
                                    coupon.expiredType === ExpiredType.TIME_PERIOD.name ?
                                        moment.utc(moment.duration(coupon.expiredTime, 's').asMilliseconds()).format("HH:mm:ss") :
                                        moment(coupon.expiredTime).format("YYYY-MM-DD")
                                }</p>
                            </Card>
                        </Select.Option>
                    })}
                </Select>
                </p>
            </div>
        ),
        onOk() {
        },
    });

    constructor(props) {
        super(props)
        this.state = {
            coupons: []
        }
    }
}


class ShowInfo extends Component {
    selectCoupon = (couponId) => {

    }

    componentWillMount = () => {
        this.props.findAllPublicInfoByShowId(this.props.selectedShow.id)
            .then(() => {
                Promise.all(Array.from(new Set(this.props.publicInfos.map(info => info.theaterId)))
                    .map(theaterId =>
                        axios.get(Api.theater.findById, {
                            params: {"id": theaterId},
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            }
                        }).then(resp => {
                            return [theaterId, resp.data.value]
                        })
                    )).then(result => {
                    this.setState({theaters: new Map(result)})
                })
            })
    };

    onRegionIdChange = (code) => {
        this.setState({regionId: !_.isEmpty(code) ? Number(_.last(code)) : -1})
    };

    onChooseTheaterClick = (publicInfoId) => {
        this.props.findById(publicInfoId).then(() => {
            this.props.route(RouteTable.CUSTOMER.ChooseSeat.path + `#${publicInfoId}`, this.props.isAuthed)
        })
    };
    info = (theaterId) => {
        const self = this
        console.log(theaterId)
        axios.get(Api.theater.findById, {
            params: {id: theaterId},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(theaterData => {
            if (theaterData.data.value) {
                this.setState({selectedTheater: theaterData.data.value})
            } else {
                console.log(theaterData.data.message)
            }
        }).then(() => axios.get(Api.coupon.findAllByTheaterId, {
            params: {theaterId: this.state.selectedTheater.id},
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(couponsData => {
            if (couponsData.data.value) {
                const coupons = couponsData.data.value
                Modal.info({
                    title: this.state.selectedTheater.name,
                    content: (
                        <div>
                            <p>地点：{this.state.selectedTheater.location}</p>
                            <p>座位总数：{this.state.selectedTheater.seatNumber}</p>
                            <div><Select style={{width: 250}}
                                         onChange={(value) => this.setState({selectedCoupon: value})}
                                         optionLabelProp={"title"}>
                                {coupons.map(coupon => {
                                    return <Select.Option value={coupon.id} title={coupon.name}>
                                        <Card>
                                            <p>名称：{coupon.name}</p>
                                            <p>折扣：{coupon.discount}</p>
                                            <p>失效类型：{ExpiredType[coupon.expiredType].text}</p>
                                            <p>失效时间：{
                                                coupon.expiredType === ExpiredType.TIME_PERIOD.name ?
                                                    moment.utc(moment.duration(coupon.expiredTime, 's').asMilliseconds()).format("HH:mm:ss") :
                                                    moment(coupon.expiredTime).format("YYYY-MM-DD")
                                            }</p>
                                        </Card>
                                    </Select.Option>
                                })}
                            </Select>
                            </div>
                        </div>
                    ),
                    onOk() {
                        if (!_.isEmpty(self.state.selectedCoupon)) {
                            console.log(self.props)
                            axios.post(Api.couponInfo.getCoupon,
                                {
                                    userId: self.props.user.id,
                                    couponId: self.state.selectedCoupon,
                                }, {
                                    headers: {
                                        'Content-Type': 'application/json;charset=utf-8',
                                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                                    }
                                }).then(couponInfoData => {
                                if (couponInfoData.data.value) {
                                    alert(`优惠券获取成功`)
                                } else {
                                    alert(`优惠券获取失败，${couponInfoData.data.message}`)
                                }
                            })
                        }
                    },
                });
            } else {
                console.log(couponsData.data.message)
            }
        }).catch(err => console.log(err)))

    }

    constructor(props) {
        super(props);
        this.state = {
            regionId: 440305,
            theaters: new Map(),
            theaterModalShow: false,
            selectedTheater: {},
            selectedCoupon: "",
        }
    }

    render() {
        return <div>
            <Divider>{this.props.selectedShow.name}</Divider>
            类型：{Genre.get(this.props.selectedShow.genre)}
            <br/>
            时长：{this.props.selectedShow.duration}
            <br/>
            <Divider dashed>抢票</Divider>
            <AreaCascader data={pcaa} placeholder={'选择区域，默认全选'} defaultArea={null} level={1} onChange={this.onRegionIdChange}/>
            <Tabs defaultActiveKey="1">
                {Array.from(moment.rangeFromInterval('d', 80).by('days')).map((date, index) =>
                    <Tabs.TabPane tab={date.format("YYYY-MM-DD")} key={index}>
                        <List itemLayout="horizontal"
                              dataSource={this.props.publicInfos.filter(info => moment(info.schedule).isSame(date, 'd') && (this.state.regionId === -1 || (!_.isEmpty(this.state.theaters.get(info.theaterId)) && this.state.theaters.get(info.theaterId).regionId === this.state.regionId)))}
                              renderItem={item => (
                                  <List.Item actions={[<a onClick={() => this.onChooseTheaterClick(item.id)}>选择</a>]}>
                                      <List.Item.Meta
                                          title={<a
                                              onClick={() => this.info(item.theaterId)}>{this.state.theaters.get(item.theaterId).name}</a>}
                                          description={`从${(item.basePrice / 100).toFixed(2)}元起`}/>
                                      时间：{moment(item.schedule).format("HH:mm:ss")}
                                  </List.Item>)}/>
                    </Tabs.TabPane>)}
            </Tabs>
        </div>
    }
}

const
    mapDispatchToProps = (dispatch) => {
        return {
            findAllPublicInfoByShowId: (showId) => dispatch(findAllPublicInfoByShowId(showId)),
            findById: (id) => dispatch(findById(id)),
            route: (path, isAuthed) => dispatch(route(path, isAuthed))
        }
    };

const
    mapStateToProps = (state) => {
        return {
            selectedShow: state.showReducer.selectedShow,
            publicInfos: state.publicInfoReducer.publicInfos,
            isAuthed: state.loginReducer.isAuthed,
            user: state.loginReducer.user,
        }
    };

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfo)

