import React from 'react';
import {connect} from 'react-redux';
import 'react-area-linkage/dist/index.css'; // v2 or higher
import {Col, Divider, Icon, List, message, Row, Tabs, Tag} from 'antd';
import {RouteTable} from '../../route';
import {Genre} from '../../model/show';
import {Api} from '../../api';
import {findAllPublicInfoByShowId, findPublicInfo} from '../../redux/publicInfo/actions';
import {selectTheater} from '../../redux/theater/actions';
import {chooseSeatButtonStyle} from './common'
import {route} from '../../redux/ui/actions';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import axios from 'axios';
import _ from 'lodash';

const moment = extendMoment(Moment);

class ShowInfo extends React.Component {
    state = {
        theaters: null,
        theaterModalShow: false,
        selectedTheater: {}
    };

    componentWillMount = () => {
        console.log(this.props.selectedShow);
        this.props
            .findAllPublicInfoByShowId(this.props.selectedShow.id)
            .then(() =>
                Promise.all(
                    _
                        .uniqBy(this.props.publicInfos, i => i.theaterId)
                        .map(theater =>
                            axios
                                .get(Api.theater.findById, {
                                    params: { id: theater.theaterId },
                                    headers: {
                                        'Content-Type':
                                            'application/json;charset=utf-8'
                                    }
                                })
                                .then(resp => [
                                    theater.theaterId,
                                    resp.data.value
                                ])
                        )
                )
            )
            .then(result => this.setState({ theaters: new Map(result) }));
    };

    onChooseTheaterClick = theaterId => {
        if (this.props.isAuthed) {
            this.props.findTheaterInfo(theaterId).then(() => {
                this.props.route(
                    RouteTable.CUSTOMER.TheaterInfo.path,
                    this.props.isAuthed
                );
            });
        } else {
            message.warning("选座前请先登录");
        }
    };

    showInfo(show) {
        return (
            <Row align="top">
                <Col offset={1} span={6}>
                    <img
                        src={show.poster}
                        style={{
                            width: '100%',
                            borderRadius: '10px',
                            boxShadow: 'darkgrey 18px 18px 18px',
                            margin: '0 18px 18px 0'
                        }}
                    />
                </Col>
                <Col
                    offset={2}
                    span={6}
                    style={{
                        textAlign: 'left',
                        marginLeft: '50px',
                        paddingTop: '10px'
                    }}
                >
                    <h1>{show.name}</h1>
                    <div>
                        <Tag style={{ cursor: 'default' }}>
                            {Genre.get(show.genre)}
                        </Tag>
                    </div>
                    <br />
                    <h3>
                        <Icon type="clock-circle-o" />&nbsp;&nbsp;{(
                            show.duration / 60
                        ).toFixed(0)}&nbsp;&nbsp;分钟
                    </h3>
                </Col>
            </Row>
        );
    }

    playSelector = () => (
        <Tabs defaultActiveKey="1">
            {Array.from(moment.rangeFromInterval('d', 7).by('days')).map(
                (date, index) => (
                    <Tabs.TabPane tab={date.format('MM-DD')} key={index}>
                        <List
                            loading={this.state.theaters === null}
                            itemLayout="horizontal"
                            dataSource={this.goingOnTheater(date)}
                            renderItem={this.playEntry}
                        />
                    </Tabs.TabPane>
                )
            )}
        </Tabs>
    );

    playEntry = item => {
        const theaters = this.state.theaters;
        const theater = theaters === null ? null : theaters.get(item.theaterId);
        return (
            <List.Item style={{ textAlign: 'left', cursor: 'default' }}>
                {theater === null ? (
                    ''
                ) : (
                    <Row type="flex" align="middle" style={{ width: '100%' }}>
                        <Col span={14}>
                            <h2>{theater === null ? '' : theater.name}</h2>
                            <h3 style={{ color: 'gray' }}>
                                地址：{theater.location}
                            </h3>
                        </Col>
                        <Col offset={2} span={3}>
                            <span style={{ color: 'red' }}>
                                ￥<span style={{ fontSize: '1.3em' }}>
                                    {(item.basePrice / 100).toFixed(0)}
                                </span>
                            </span>&nbsp;&nbsp; 起
                        </Col>
                        <Col offset={2} span={3}>
                            <button
                                onClick={() =>
                                    this.onChooseTheaterClick(item.theaterId)
                                }
                                style={chooseSeatButtonStyle}
                            >
                                选座购票
                            </button>
                        </Col>
                    </Row>
                )}
            </List.Item>
        );
    };

    goingOnTheater = date =>
        _.map(
            _.groupBy(
                this.props.publicInfos.filter(info =>
                    date.isSame(info.schedule, 'd')
                ),
                p => p.theaterId
            ),
            arr => _.minBy(arr, 'basePrice')
        );

    render() {
        const show = this.props.selectedShow;
        return (
            <div style={{ width: '80%', margin: '0 auto' }}>
                {this.showInfo(show)}
                <br />
                <div>
                    <Divider orientation="left">
                        <h3>正在上映的影院</h3>
                    </Divider>
                    {this.playSelector()}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        findAllPublicInfoByShowId: showId =>
            dispatch(findAllPublicInfoByShowId(showId)),
        findPublicInfo: id => dispatch(findPublicInfo(id)),
        findTheaterInfo: id => dispatch(selectTheater(id)),
        route: (path, isAuthed) => dispatch(route(path, isAuthed))
    };
};

const mapStateToProps = state => {
    return {
        selectedShow: state.showReducer.selectedShow,
        publicInfos: state.publicInfoReducer.publicInfos,
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowInfo);
