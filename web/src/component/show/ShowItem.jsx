import React from 'react';
import {Card} from 'antd'
import {connect} from 'react-redux';
import moment from 'moment'
import './ShowItem.css'

class ShowItem extends React.Component {


    render = () => this.props.show ? <Card
        hoverable
        style={{width: 160}}
        cover={<img alt="Waiting..." src={this.props.show.poster}/>}
        actions={[<div>购票</div>]}
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
    return {}
};

const mapStateToProps = (state) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)