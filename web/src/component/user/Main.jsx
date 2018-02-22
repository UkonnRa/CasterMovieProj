import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Card, Col, Row} from 'antd'
import {Genre} from "../../model/show";
import {findAllByGenreInAndStartTime, selectShow} from "../../redux/show/actions";
import _ from 'lodash'
import {Role} from "../../model/user";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";

class Main extends Component {

    componentWillMount = () => {
        this.props.findAllByGenreInAndStartTime({genreList: Array.from(Genre.keys()),startTime: Date.now()})
    };

    onShowItemClick = (showId) => {
        this.props.selectShow(showId).then(() => this.props.route(RouteTable[Role.CUSTOMER].ShowInfo.path + `#${showId}`))
    };

    render() {

        return (
            _.chunk(this.props.shows, 4).map((showRow, index) => {
                return (
                    <div>
                    <Row style={{margin: "0 0 16px"}} key={index} gutter={16}>
                        {showRow.map((show, innerIndex) => {
                            return (
                                <Col key={innerIndex} span={6}>
                                    <Card key={innerIndex} title={<a onClick={() => this.onShowItemClick(show.id)}>{show.name}</a>}>
                                        <p>种类：{Genre.get(show.genre)}</p>
                                        <p>时长：{show.duration}</p>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                    </div>
                )
            })
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        findAllByGenreInAndStartTime: (elems) => dispatch(findAllByGenreInAndStartTime(elems)),
        selectShow: (showId) => dispatch(selectShow(showId)),
        route: (key) => dispatch(route(key)),
    }
};

const mapStateToProps = (state) => {
    return {
        shows: state.showReducer.shows
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main)