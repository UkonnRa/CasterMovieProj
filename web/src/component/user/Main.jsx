import React from 'react';
import {connect} from 'react-redux'
import {Carousel} from 'antd'
import './Main.css'
import {Genre} from "../../model/show";
import {findAllByGenreInAndStartTime, findAllPlayingNow, findAllWillPlay, selectShow} from "../../redux/show/actions";
import {Role} from "../../model/user";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import TheaterList from '../tickets/TheaterList'
import MyPublicInfos from '../theater/MyPublicInfos'

class Main extends React.Component {

    componentWillMount = () => {
        this.props.findAllByGenreInAndStartTime({genreList: Array.from(Genre.keys()), startTime: Date.now()})
        this.props.findAllPlayingNow();
        this.props.findAllWillPlay();
    };

    onShowItemClick = (showId) => {
        this.props.selectShow(showId).then(() => this.props.route(RouteTable[Role.CUSTOMER].ShowInfo.path + `#${showId}`, this.props.isAuthed))
    };

    component = () => {
        switch (this.props.role) {
            case Role.CUSTOMER:
                return <div>
                    <Carousel autoplay>
                        {this.props.shows.map(s => <img
                            src={s.poster}
                        />)}
                    </Carousel>
                    <div>
                        <h1>正在热映（{this.props.playingNowShows.length}）</h1>
                    </div>
                </div>;
            // return _.chunk(this.props.shows, 4).map((showRow, index) => {
            //     return <div>
            //         <Row style={{margin: "0 0 16px"}} key={index} gutter={16}>
            //             {showRow.map((show, innerIndex) => {
            //                 return <Col key={innerIndex} span={6}>
            //                     <Card key={innerIndex} title={<a
            //                         onClick={() => this.onShowItemClick(show.id)}>{show.name}</a>}>
            //                         <p>种类：{Genre.get(show.genre)}</p>
            //                         <p>时长：{moment.utc(moment.duration(show.duration, 's').asMilliseconds()).format("HH:mm:ss")}</p>
            //                     </Card>
            //                 </Col>})}
            //         </Row>
            //     </div>
            //
            // });
            case Role.TICKETS:
                return <TheaterList/>;
            case Role.THEATER:
                return <MyPublicInfos/>
        }
    };

    render = () => this.component()

}

const mapDispatchToProps = (dispatch) => {
    return {
        findAllPlayingNow: () => dispatch(findAllPlayingNow()),
        findAllWillPlay: () => dispatch(findAllWillPlay()),
        findAllByGenreInAndStartTime: (elems) => dispatch(findAllByGenreInAndStartTime(elems)),
        selectShow: (showId) => dispatch(selectShow(showId)),
        route: (key, isAuthed, role = Role.CUSTOMER) => dispatch(route(key, isAuthed, role)),
    }
};

const mapStateToProps = (state) => {
    return {
        playingNowShows: state.showReducer.playingNowShows,
        willPlayShows: state.showReducer.willPlayShows,
        shows: state.showReducer.shows,
        isAuthed: state.loginReducer.isAuthed,
        role: state.loginReducer.user.role,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main)