import React, { Component } from 'react';
import { DatePicker, Input, List, Pagination, Tag } from 'antd';
import { connect } from 'react-redux';
import {
    findAllByGenreInAndStartTime,
    selectShow
} from '../../redux/show/actions';
import { route } from '../../redux/ui/actions';
import { Genre } from '../../model/show';
import _ from 'lodash';
import { RouteTable } from '../../route';
import { Role } from '../../model/user';
import moment from 'moment';

class ShowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGenres: [...Genre.keys()],
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            keyword: '',
            startTime: Date.now()
        };
    }

    pagination = {
        pageSize: 5,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.props.shows.length, page * pageSize])
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
            end: this.pagination.pageSize,
            currPage: 1
        });
        this.props.findAllByGenreInAndStartTime({
            genreList: nextSelectedGenres,
            startTime: this.state.startTime
        });
    };

    onDateChange = date => {
        this.setState({
            startTime: Number(date),
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1
        });
        this.props.findAllByGenreInAndStartTime({
            genreList: this.state.selectedGenres,
            startTime: Number(date)
        });
    };

    onShowItemClick = showId => {
        this.props
            .selectShow(showId)
            .then(() =>
                this.props.route(
                    `${RouteTable[Role.CUSTOMER].ShowInfo.path}#${showId}`,
                    this.props.isAuthed
                )
            );
    };

    render() {
        const { selectedGenres } = this.state;
        const resultShow = this.props.shows.filter(
            item =>
                _.isEmpty(this.state.keyword)
                    ? true
                    : item.name.indexOf(this.state.keyword) !== -1
        );
        return (
            <div>
                <Input.Search
                    placeholder="剧集名称"
                    style={{ width: '50%', alignSelf: 'center' }}
                    onSearch={value => {
                        this.setState({ keyword: value });
                    }}
                    enterButton
                />
                <br />
                {Array.from(Genre.entries()).map(pair => {
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
                })}
                <List
                    dataSource={resultShow.slice(
                        this.state.start,
                        this.state.end
                    )}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={
                                    <a
                                        onClick={() =>
                                            this.onShowItemClick(item.id)
                                        }
                                    >
                                        {item.name}
                                    </a>
                                }
                                description={Genre.get(item.genre)}
                            />
                            时长：{moment
                                .utc(
                                    moment
                                        .duration(item.duration, 's')
                                        .asMilliseconds()
                                )
                                .format('HH:mm:ss')}
                        </List.Item>
                    )}
                />
                <Pagination
                    current={this.state.currPage}
                    total={resultShow.length}
                    pageSize={this.pagination.pageSize}
                    onChange={this.pagination.onPageChange}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        shows: state.showReducer.shows,
        userId: state.loginReducer.user.id,
        isAuthed: state.loginReducer.isAuthed
    };
};

const mapDispatchToProps = dispatch => {
    return {
        findAllByGenreInAndStartTime: value =>
            dispatch(findAllByGenreInAndStartTime(value)),
        selectShow: showId => dispatch(selectShow(showId)),
        route: (key, isAuthed) => dispatch(route(key, isAuthed))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowList);
