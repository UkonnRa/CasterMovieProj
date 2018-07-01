import React from 'react';
import {connect} from 'react-redux'
import {Button, Carousel, Col, Divider, Icon, Row} from 'antd'
import './Main.css'
import {Genre} from "../../model/show";
import {findAllByGenreInAndStartTime, findAllPlayingNow, findAllWillPlay, selectShow} from "../../redux/show/actions";
import {Role} from "../../model/user";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import TheaterList from '../tickets/TheaterList'
import MyPublicInfos from '../theater/MyPublicInfos'
import ShowItem from '../show/ShowItem'
import {Api} from "../../api";
import axios from "axios/index";

class Main extends React.Component {

    componentWillMount = async () => {
        this.props.findAllByGenreInAndStartTime({genreList: Array.from(Genre.keys()), startTime: Date.now()});
        await axios.get(Api.show.findAllPlayingNow).then(resp => {
            if (resp.data.value) this.setState({playingNowShows: resp.data.value});
            else console.log(`ERROR in findAllPlayingNow: ${resp.data.message}`)
        }).then(() => axios.get(Api.show.findAllWillPlay).then(resp => {
            if (resp.data.value) this.setState({willPlayShows: resp.data.value});
            else console.log(`ERROR in findAllWillPlay: ${resp.data.message}`)
        }));
    };
    render = () => {
        switch (this.props.role) {
            case Role.CUSTOMER:
                return <div>
                    <Carousel autoplay>
                        {this.props.shows.map(s => <img
                            src={s.poster}
                        />)}
                    </Carousel>
                    <div className="two-shows-panel">
                        <div align="left" className="shows">
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={6}><h1>正在热映（{this.state.playingNowShows.length}部）</h1></Col>
                                <Col span={6} offset={12} align="right"><Button>全部<Icon type="right"/></Button></Col>
                            </Row>
                            <Divider/>
                            {<Row type="flex"
                                  justify="space-between">{this.state.playingNowShows.slice(0, 6).map(show => <Col
                                span={4}><ShowItem show={show}/></Col>)}</Row>}
                        </div>

                        <div align="left" className="shows">
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={6}><h1>即将上映（{this.state.willPlayShows.length}部）</h1></Col>
                                <Col span={6} offset={12} align="right"><Button>全部<Icon type="right"/></Button></Col>
                            </Row>
                            <Divider/>
                            {<Row type="flex" justify="space-between"> {this.state.willPlayShows.slice(0, 6).map(show =>
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

    constructor(props) {
        super(props);
        this.state = {
            playingNowShows: [],
            willPlayShows: [],
        }
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        findAllByGenreInAndStartTime: (elems) => dispatch(findAllByGenreInAndStartTime(elems)),
        selectShow: (showId) => dispatch(selectShow(showId)),
        route: (key, isAuthed, role = Role.CUSTOMER) => dispatch(route(key, isAuthed, role)),
    }
};

const mapStateToProps = (state) => {
    return {
        shows: state.showReducer.shows,
        isAuthed: state.loginReducer.isAuthed,
        role: state.loginReducer.user.role,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main)