import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Checkbox, Divider, Button} from 'antd'
import moment from 'moment'
import {Api} from "../../api";
import _ from 'lodash'

class ChooseSeat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedShow: {},
            selectedTheater: {},
            selectedSeats: []
        }
    }

    componentWillMount = () => {
        (async () => {
            const show = await axios.get(Api.show.findById, {
                params: {"id": this.props.selectedPublicInfo.showId},
            });
            const theater = await axios.get(Api.theater.findById, {
                params: {"id": this.props.selectedPublicInfo.theaterId},
            });
            this.setState({selectedShow: show.data.value, selectedTheater: theater.data.value})
        })()
    };

    onSeatClick = (selectedSeats) => {
        this.setState({selectedSeats: selectedSeats})
    };

    submit = () => {

    };

    render() {
        return <div>
            剧集名称：{this.state.selectedShow.name}
            <br/>
            剧院：{this.state.selectedTheater.name}
            <br/>
            放映时间：{moment(this.props.selectedPublicInfo.schedule).format("YYYY-MM-DD HH:mm:ss")}
            <Divider>选座</Divider>
            <Checkbox.Group onChange={this.onSeatClick}>
                {_.chunk(this.props.selectedPublicInfo.seatDistribution, this.state.selectedTheater.seatPerLine).map((seatLine, outerIndex) =>
                    <div>
                        {seatLine.map((item, innerIndex) =><Checkbox value={outerIndex * this.state.selectedTheater.seatPerLine + innerIndex} disabled={!item}/>)}
                        <br/>
                        <br/>
                    </div>
                )}
            </Checkbox.Group>
            <Button onClick={this.submit}>提交订单</Button>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        selectedPublicInfo: state.publicInfoReducer.selectedPublicInfo,
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSeat)