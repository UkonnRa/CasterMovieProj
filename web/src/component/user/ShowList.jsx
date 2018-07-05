import React, {Component} from 'react';
import {Col, Input, Pagination, Row, Tabs, Tag} from 'antd';
import {connect} from 'react-redux';
import {Genre} from '../../model/show';
import _ from 'lodash';
import './ShowList.css'
import {findAllByGenreInAndStartTime} from "../../redux/show/actions";
import ShowItem from '../show/ShowItem'

class ShowList extends Component {

    pagination = {
        rowNumber: 6,
        rowSpan: 4,
        colPerRow: 6,
        onPageChange: (page, pageSize, isNowPlaying) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([isNowPlaying? this.props.showsPlayingNowInRegion.length:  this.props.showsWillPlayInRegion.length, page * pageSize])
            });
        }
    };
    handleTagChecked = (key, checked) => {
        const nextSelectedGenres = checked
            ? [...this.state.selectedGenres, key]
            : this.state.selectedGenres.filter(t => t !== key);
        this.setState({
            selectedGenres: nextSelectedGenres,
            start: 0,
            end: this.pagination.rowNumber * this.pagination.colPerRow,
            currPage: 1
        });
    };

    tabContent = (isNowPlaying) => {
        const {selectedGenres} = this.state;

        const shows = isNowPlaying ? this.props.showsPlayingNowInRegion : this.props.showsWillPlayInRegion;

        const resultShows = shows.filter(
            item =>
                _.isEmpty(this.state.keyword)
                    ? true
                    : item.name.indexOf(this.state.keyword) !== -1
        ).filter(item => this.state.selectedGenres.some(genre => genre === item.genre));

        console.log("is playing now: ", isNowPlaying, shows);

        return <div className="show-list-panel">
            <Row className="show-filter">
                <Col span={8} align="right" className="show-label">
                    <div style={{fontWeight: "bold"}}>关键词：</div>
                </Col>
                <Col span={16} align="left" className="show-keyword-input"><Input.Search
                    placeholder="剧集名称"
                    style={{width: '50%', alignSelf: 'center'}}
                    onSearch={value => {
                        this.setState({keyword: value});
                    }}
                    enterButton
                /></Col>
            </Row>

            <Row className="show-filter" type="flex" align="middle">
                <Col span={8} align="right" className="show-label">
                    <div style={{fontWeight: "bold"}}>类型：</div>
                </Col>
                <Col span={16} align="left" className="show-type-tags">{Array.from(Genre.entries()).map(pair => {
                    return (
                        <Tag.CheckableTag
                            key={pair[0]}
                            checked={selectedGenres.indexOf(pair[0]) > -1}
                            onChange={checked =>
                                this.handleTagChecked(pair[0], checked)
                            }
                        >
                            {pair[1]}
                        </Tag.CheckableTag>
                    );
                })}</Col>
            </Row>

            {_.range(this.pagination.rowNumber).map(row => <Row type="flex" justify="start">
                {_.range(this.pagination.colPerRow).map(index => <Col span={this.pagination.rowSpan}>
                    <ShowItem
                        show={resultShows[(this.state.currPage - 1) * this.pagination.rowNumber * this.pagination.colPerRow + row * this.pagination.colPerRow + index]}/>
                </Col>)}
            </Row>)}

            <Pagination
                current={this.state.currPage}
                total={resultShows.length}
                pageSize={this.pagination.rowNumber * this.pagination.colPerRow}
                onChange={(page, pageSize) => this.pagination.onPageChange(page, pageSize, isNowPlaying)}
            />
        </div>
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedGenres: [...Genre.keys()],
            start: 0,
            end: this.pagination.rowNumber * this.pagination.colPerRow,
            currPage: 1,
            keyword: '',
            startTime: Date.now(),
        };
    }

    render() {
        return (
            <div>
                <Tabs className="search-panel" onChange={() => this.setState({currPage: 1})} defaultActiveKey={this.props.showListIsPlayingNow? "playingNow": "willPlay"}>
                    <Tabs.TabPane tab="正在热映" key="playingNow">
                        {this.tabContent(true)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="即将上映" key="willPlay">
                        {this.tabContent(false)}
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        showListIsPlayingNow: state.showReducer.showListIsPlayingNow,
        showsPlayingNowInRegion: state.showReducer.showsPlayingNowInRegion,
        showsWillPlayInRegion: state.showReducer.showsWillPlayInRegion,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        findAllByGenreInAndStartTime: value =>
            dispatch(findAllByGenreInAndStartTime(value)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowList);
