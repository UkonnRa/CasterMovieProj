import React from 'react';
import { Icon, List, Tabs, Row, Col } from 'antd';
import { connect } from 'react-redux';

import 'react-area-linkage/dist/index.css'; // v2 or higher
import { Genre } from '../../model/show';
import { findAllPublicInfoByShowId } from '../../redux/publicInfo/actions';
import { SELECT_PUBLIC_INFO } from '../../redux/publicInfo/types';
import { selectShow } from '../../redux/show/actions';
import { findOnGoingShowsByTheater } from '../../redux/theater/actions';
import { chooseSeatButtonStyle } from './common';
import { route } from '../../redux/ui/actions';
import moment from 'moment';
import _ from 'lodash';
import { RouteTable } from '../../route';
import Slider from 'react-slick';
import './slick.css';

function getStartOfDay(stamp) {
    return stamp - (stamp % 86400000) - 28800000;
}

function filterOwnPublicInfo(props) {
    const timeEndBound = moment().add(8, 'd');
    const timeStartBound = moment();
    return _.mapValues(
        _.groupBy(
            props.publicInfo.filter(
                x =>
                    x.theaterId === props.theater.id &&
                    timeStartBound.isBefore(x.schedule) &&
                    timeEndBound.isAfter(x.schedule, 'day')
            ),
            x => getStartOfDay(x.schedule)
        ),
        xs => xs.sort((x, y) => x.schedule - y.schedule)
    );
}

class TheaterInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicInfo: filterOwnPublicInfo(props)
        };
        this.state.timeRange = _
            .keys(this.state.publicInfo)
            .map(x => Number(x))
            .sort((x, y) => x - y);
    }

    goToSeatChoose = publicInfo => {
        this.props.selectPublicInfo(publicInfo);
        this.props.route(
            RouteTable.CUSTOMER.ChooseSeat.path,
            this.props.isAuthed
        );
    };

    updateShowInfo = show => {
        this.props.selectShow(show.id);
        this.props.findPublicInfo(show.id);
    };

    componentWillMount() {
        this.props.findOnGoingShows(this.props.theater.id).then(() => {
            if (this.slider) {
                this.slider.slickGoTo(
                    _.findIndex(
                        this.props.onGoingShows,
                        show => show.id === this.props.show.id
                    ),
                    true
                );
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setState({ publicInfo: filterOwnPublicInfo(props) });
    }

    theaterInfo = () => {
        const theater = this.props.theater;
        return (
            <Row align="top">
                <Col offset={1} span={6}>
                    <img
                        alt="影院照片"
                        src={theater.avatar}
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
                    <h1>{theater.name}</h1>
                    <br />
                    <h3>
                        <Icon type="environment-o" />&nbsp;&nbsp;{
                            theater.location
                        }&nbsp;&nbsp;
                    </h3>
                </Col>
            </Row>
        );
    };

    allShow = () => {
        const arrowSideStyle = {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '5%'
        };
        const arrowIconStyle = {
            fontSize: '3.4em',
            zIndex: '1',
            color: 'white'
        };
        const cursorDivStyle = {
            bottom: '0px',
            position: 'absolute',
            zIndex: 1,
            marginBottom: '-2%',
            left: '46%'
        };

        return (
            <div style={{ position: 'relative' }}>
                <div style={{ ...arrowSideStyle, left: '0' }}>
                    <Icon
                        type="left"
                        style={{ ...arrowIconStyle, marginLeft: '-20%' }}
                        onClick={() => this.slider.slickPrev()}
                    />
                </div>
                <div style={{ ...arrowSideStyle, right: '0' }}>
                    <Icon
                        type="right"
                        style={{ ...arrowIconStyle, marginRight: '-20%' }}
                        onClick={() => this.slider.slickNext()}
                    />
                </div>
                <div style={cursorDivStyle}>
                    <Icon type="caret-up" style={arrowIconStyle} />
                </div>
                <Slider
                    draggable={true}
                    arrows={false}
                    swipeToSlide={true}
                    accessibility={true}
                    className="slider-poster"
                    centerMode={true}
                    infinite={this.props.onGoingShows.length > 5}
                    speed={500}
                    slidesToShow={5}
                    slidesToScroll={1}
                    ref={s => (this.slider = s)}
                    initialSlide={_.findIndex(
                        this.props.onGoingShows,
                        show => show.id === this.props.show.id
                    )}
                    afterChange={i => {
                        if (
                            this.props.onGoingShows[i].id !== this.props.show.id
                        ) {
                            this.updateShowInfo(this.props.onGoingShows[i]);
                        }
                    }}
                >
                    {this.props.onGoingShows.map((show, index) => (
                        <div>
                            <img
                                alt={show.name}
                                onClick={() => this.slider.slickGoTo(index)}
                                src={show.poster}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        );
    };

    showInfo = () => (
        <div style={{ textAlign: 'left' }}>
            <h2>{this.props.show.name}</h2>
            <div>
                <span>
                    <Icon type="clock-circle-o" />&nbsp;&nbsp;{(
                        this.props.show.duration / 100
                    ).toFixed(0)}分钟
                </span>
                <span style={{ marginLeft: '40px' }}>
                    <Icon type="tag-o" />
                    {Genre.get(this.props.show.genre)}
                </span>
            </div>
        </div>
    );

    playSelector = () => (
        <Tabs defaultActiveKey="0">
            {this.state.timeRange.map((date, index) => (
                <Tabs.TabPane
                    tab={moment(Number(date)).format('MM-DD')}
                    key={index}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.publicInfo[date]}
                        renderItem={this.playEntry}
                    />
                </Tabs.TabPane>
            ))}
        </Tabs>
    );

    playEntry = item => {
        return (
            <List.Item style={{ textAlign: 'left', cursor: 'default' }}>
                <Row type="flex" align="middle" style={{ width: '100%' }}>
                    <Col span={14}>
                        <h3 style={{ color: 'gray' }}>
                            <Icon type="circle-clock-o" />
                            {moment(item.schedule).format('A hh:mm')}
                        </h3>
                    </Col>
                    <Col offset={2} span={3}>
                        <span style={{ color: 'red' }}>
                            ￥<span style={{ fontSize: '1.3em' }}>
                                {(item.basePrice / 100).toFixed(0)}
                            </span>
                        </span>&nbsp;&nbsp;
                    </Col>
                    <Col offset={2} span={3}>
                        <button
                            onClick={() => this.goToSeatChoose(item)}
                            style={chooseSeatButtonStyle}
                        >
                            选座购票
                        </button>
                    </Col>
                </Row>
            </List.Item>
        );
    };

    render() {
        return (
            <div style={{ width: '80%', margin: '0 auto' }}>
                {this.theaterInfo()}
                <br />
                <br />
                {this.allShow()}
                <br />
                {this.showInfo()}
                {this.playSelector()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    theater: state.theaterReducer.selectedTheater,
    onGoingShows: state.theaterReducer.onGoingShowsOfTheater,
    show: state.showReducer.selectedShow,
    publicInfo: state.publicInfoReducer.publicInfos,
    isAuthed: state.loginReducer.isAuthed
});

const mapDispatchToProps = dispatch => ({
    selectShow: showId => dispatch(selectShow(showId)),
    selectPublicInfo: publicInfo =>
        dispatch({ type: SELECT_PUBLIC_INFO, selectedPublicInfo: publicInfo }),
    findPublicInfo: showId => dispatch(findAllPublicInfoByShowId(showId)),
    findOnGoingShows: theaterId =>
        dispatch(findOnGoingShowsByTheater(theaterId)),
    route: (path, isAuthed) => dispatch(route(path, isAuthed))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TheaterInfo);
