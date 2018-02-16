import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Card, Col, Row} from 'antd'
import {Genre} from "../../model/show";
import {findAllByGenreInAndStartTime} from "../../redux/show/actions";
import _ from 'lodash'

class Main extends Component {

    componentWillMount = () => {
        this.props.findAllByGenreInAndStartTime({startTime: Date.now()})
    };

    render() {

        return (
            _.chunk(this.props.shows, 3).map((showRow, index) => {
                return (
                    <Row key={index} gutter={16}>
                        {showRow.map((show, innerIndex) => {
                            return (
                                <Col key={innerIndex} span={8}>
                                    <Card key={innerIndex} title={show.name}>
                                        <p>种类：{Genre.get(show.genre)}</p>
                                        <p>时长：{show.duration}</p>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                )
            })
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        findAllByGenreInAndStartTime: (elems) => dispatch(findAllByGenreInAndStartTime(elems))
    }
};

const mapStateToProps = (state) => {
    return {
        shows: state.showReducer.shows
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main)