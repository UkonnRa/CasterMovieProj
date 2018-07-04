import React from 'react';
import {Card} from 'antd'
import {connect} from 'react-redux';
import {route} from "../../redux/ui/actions";
import {selectShow} from "../../redux/show/actions";
import {RouteTable} from "../../route";
import moment from 'moment'
import './ShowItem.css'
import {Role} from "../../model/user";

class ShowItem extends React.Component {
    onShowSelect = async () => {
        await this.props.selectShow(this.props.show.id);
        await this.props.route(RouteTable.CUSTOMER.ShowInfo.path, this.props.isAuthed);
    };

    render = () => this.props.show ? <Card
        hoverable
        style={{width: 160}}
        cover={<img alt="Waiting..." src={this.props.show.poster}/>}
        actions={[<div onClick={this.onShowSelect}>{this.props.show.startDate ? "预览": "购票"}</div>]}
    >
        <Card.Meta
            title={<div>{this.props.show.name}</div>}
            description={this.props.show.startDate ?
                <div>{moment(this.props.show.startDate).format("YYYY-MM-DD")} 起</div> :
                <div>{this.props.show.duration / 60 | 0} 分钟</div>}
        />
    </Card> : null;
}

const mapDispatchToProps = (dispatch) => {
    return {
        route: (key, isAuthed, role=Role.CUSTOMER) => dispatch(route(key, isAuthed, role)),
        selectShow: (showId) => dispatch(selectShow(showId)),
    }
};

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)