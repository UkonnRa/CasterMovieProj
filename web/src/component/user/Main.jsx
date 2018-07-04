import React from 'react';
import {connect} from 'react-redux'
import {Button, Col, Divider, Icon, Row} from 'antd'
import './Main.css'
import {Genre} from "../../model/show";
import {
    findAllByGenreInAndStartTime,
    findAllPlayingNowInRegion,
    findAllWillPlayInRegion,
    selectShow
} from "../../redux/show/actions";
import {Role} from "../../model/user";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import TheaterList from '../tickets/TheaterList'
import MyPublicInfos from '../theater/MyPublicInfos'
import ShowItem from '../show/ShowItem'
import Slider from "react-slick";
import {CHOOSE_PLAYING_NOW, CHOOSE_WILL_PLAY} from "../../redux/show/types";

class Main extends React.Component {
    componentWillMount = async () => {
        await this.props.findAllByGenreInAndStartTime({genreList: Array.from(Genre.keys()), startTime: Date.now()});
        await this.props.findAllPlayingNowInRegion(Object.keys(this.props.location)[0]);
        await this.props.findAllWillPlayInRegion(Object.keys(this.props.location)[0]);
    };

    onPlayingNowListClick = async () => {
        this.props.showListchoosePlayingNow();
        await this.props.route(RouteTable.CUSTOMER.ShowList.path + "#playingNow", this.props.isAuthed, this.props.role)
    }

    onWillPlayListClick = async () => {
        this.props.showListchooseWillPlay();
        await this.props.route(RouteTable.CUSTOMER.ShowList.path + "#willPlay", this.props.isAuthed, this.props.role)
    }
    onShowSelect = async (s) => {
        await this.props.selectShow(s.id);
        await this.props.route(RouteTable.CUSTOMER.ShowInfo.path, this.props.isAuthed);
    };
    render = () => {
        const settings = {
            dots: true,
            autoplay: true,
            autoplaySpeed: 3000,
            className: "slider-header",
            centerMode: true,
            infinite: true,
            centerPadding: "60px",
            slidesToShow: 5,
            speed: 500,
            draggable: false
        };

        switch (this.props.role) {
            case Role.CUSTOMER:
                return <div>
                    <Slider {...settings}>
                        {this.props.showsPlayingNowInRegion.slice(0, 6).map(s => <img onClick={() => this.onShowSelect(s)} style={{width: "160px"}} src={s.poster}/>)}
                    </Slider>

                    <div className="two-shows-panel">
                        <div align="left" className="shows">
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={6}><h1>正在热映（{this.props.showsPlayingNowInRegion.length}部）</h1></Col>
                                <Col span={6} offset={12} align="right"><Button onClick={this.onPlayingNowListClick}>全部<Icon type="right"/></Button></Col>
                            </Row>
                            <Divider/>
                            {<Row type="flex"
                                  justify="start">{this.props.showsPlayingNowInRegion.slice(6, 12).map(show => <Col
                                span={4}><ShowItem show={show}/></Col>)}</Row>}
                        </div>

                        <div align="left" className="shows">
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={6}><h1>即将上映（{this.props.showsWillPlayInRegion.length}部）</h1></Col>
                                <Col span={6} offset={12} align="right"><Button onClick={this.onWillPlayListClick}>全部<Icon type="right"/></Button></Col>
                            </Row>
                            <Divider/>
                            {<Row type="flex" justify="start"> {this.props.showsWillPlayInRegion.slice(0, 6).map(show =>
                                <Col span={4}><ShowItem show={show}/></Col>)}</Row>}
                        </div>
                    </div>

                </div>;

            case Role.TICKETS:
                return <TheaterList/>;
            case Role.THEATER:
                return <MyPublicInfos/>
        }
    }

    onShowItemClick = (showId) => {
        this.props.selectShow(showId).then(() => this.props.route(RouteTable[Role.CUSTOMER].ShowInfo.path + `#${showId}`, this.props.isAuthed))
    };



}

const mapDispatchToProps = (dispatch) => {
    return {
        showListchoosePlayingNow: () => dispatch({type: CHOOSE_PLAYING_NOW}),
        showListchooseWillPlay: ()  => dispatch({type: CHOOSE_WILL_PLAY}),
        findAllPlayingNowInRegion: (regionId) => dispatch(findAllPlayingNowInRegion(regionId)),
        findAllWillPlayInRegion: (regionId) => dispatch(findAllWillPlayInRegion(regionId)),

        findAllByGenreInAndStartTime: (elems) => dispatch(findAllByGenreInAndStartTime(elems)),
        selectShow: (showId) => dispatch(selectShow(showId)),
        route: (key, isAuthed, role = Role.CUSTOMER) => dispatch(route(key, isAuthed, role)),
    }
};

const mapStateToProps = (state) => {
    return {
        location: state.locationReducer.location,
        shows: state.showReducer.shows,
        isAuthed: state.loginReducer.isAuthed,
        role: state.loginReducer.user.role,
        showsPlayingNowInRegion: state.showReducer.showsPlayingNowInRegion,
        showsWillPlayInRegion: state.showReducer.showsWillPlayInRegion,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main)