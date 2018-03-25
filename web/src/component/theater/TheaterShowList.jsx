import React, {Component} from 'react'
import {Input, List, Pagination, Tag} from 'antd'
import {connect} from 'react-redux'
import {findAllShowsByGenreIn, selectShow} from "../../redux/show/actions";
import {route} from "../../redux/ui/actions";
import {Genre} from "../../model/show";
import _ from "lodash";
import {RouteTable} from "../../route";
import moment from "moment";

class TheaterShowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGenres: [...Genre.keys()],
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            keyword: "",
        }
    }

    componentWillMount = () => {
        this.props.findAllShowsByGenreIn({genreList: this.state.selectedGenres})
    }

    pagination = {
        pageSize: 3,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.props.shows.length, page * pageSize])
            })
        },
    };

    handleTagChecked = (key, checked) => {
        const nextSelectedGenres = checked ?
            [...this.state.selectedGenres, key] :
            this.state.selectedGenres.filter(t => t !== key);
        this.setState({
            selectedGenres: nextSelectedGenres,
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1
        });
        this.props.findAllShowsByGenreIn({genreList: nextSelectedGenres})
    };

    onShowItemClick = (showId) => {
        this.props.selectShow(showId).then(() => this.props.route(`${RouteTable[this.props.user.role].NewPublicInfo.path}#${showId}`, this.props.isAuthed, this.props.user.role))
    };

    render() {
        const {selectedGenres} = this.state;
        const resultShow = this.props.shows.filter(item =>
            _.isEmpty(this.state.keyword) ? true : item.name.indexOf(this.state.keyword) !== -1
        );
        return <div>
            {Array.from(Genre.entries()).map(pair => {
                    return <Tag.CheckableTag
                        key={pair[0]}
                        checked={selectedGenres.indexOf(pair[0]) > -1}
                        onChange={checked => this.handleTagChecked(pair[0], checked)}>
                        {pair[1]}
                    </Tag.CheckableTag>
                }
            )}
            <br/>
            <br/>
            <Input.Search
                placeholder="剧集名称"
                onSearch={value => {
                    this.setState({keyword: value})
                }}
                enterButton
            />
            <br/>
            <List
                dataSource={resultShow.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id} actions={[<a onClick={() => this.onShowItemClick(item.id)}>发布计划</a>]}>
                        <List.Item.Meta
                            title={item.name}
                            description={Genre.get(item.genre)}/>
                        时长：{moment.utc(moment.duration(item.duration, 's').asMilliseconds()).format("HH:mm:ss")}
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={resultShow.length} pageSize={this.pagination.pageSize}
                        onChange={this.pagination.onPageChange}/>
        </div>
    }

}

const mapStateToProps = state => {
    return {
        shows: state.showReducer.shows,
        user: state.loginReducer.user,
        isAuthed: state.loginReducer.isAuthed,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        findAllShowsByGenreIn: (value) => dispatch(findAllShowsByGenreIn(value)),
        selectShow: (showId) => dispatch(selectShow(showId)),
        route: (key, isAuthed, role) => dispatch(route(key, isAuthed, role)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TheaterShowList)
