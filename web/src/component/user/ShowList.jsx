import React, {Component} from 'react';
import {Tabs} from 'antd';
import {connect} from 'react-redux';
import {Genre} from '../../model/show';
import _ from 'lodash';

class SearchPanel extends Component {

}

class ShowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGenres: [...Genre.keys()],
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            keyword: '',
            startTime: Date.now(),
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

    render() {
        return (
            <Tabs className="search-panel" defaultActiveKey="1">
                <Tabs.TabPane tab="正在热映" key="1">
                    <div color="red">Content of Tab Pane 1</div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="即将上映" key="2">Content of Tab Pane 2</Tabs.TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowList);
