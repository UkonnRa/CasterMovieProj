import React, {Component} from 'react'
import {Divider, List, Tabs} from 'antd'
import {connect} from 'react-redux'
import {AreaCascader, AreaSelect} from 'react-area-linkage';
import {Genre} from "../../model/show";
import {findAllPublicInfoByShowId, findById} from "../../redux/publicInfo/actions";
import {route} from "../../redux/ui/actions";
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import axios from 'axios'
import {Api} from "../../api";
import _ from 'lodash'
import {RouteTable} from "../../route";

const moment = extendMoment(Moment);

class ShowInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regionCode: 440305,
            theaters: new Map()
        }
    }

    componentWillMount = () => {
        this.props.findAllPublicInfoByShowId(this.props.selectedShow.id)
            .then(() => {
                Promise.all(Array.from(new Set(this.props.publicInfos.map(info => info.theaterId)))
                    .map(theaterId =>
                        axios.get(Api.theater.findById, {
                            params: {"id": theaterId},
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            }
                        }).then(resp => {
                            return [theaterId, resp.data.value]
                        })
                    )).then(result => {
                    this.setState({theaters: new Map(result)})
                })
            })
    };

    onRegionCodeChange = (code) => {
        this.setState({regionCode: !_.isEmpty(code) ? Number(_.last(code)) : -1})
    };

    onChooseTheaterClick = (publicInfoId) => {
        this.props.findById(publicInfoId).then(() => {
            this.props.route(RouteTable.CUSTOMER.ChooseSeat.path + `#${publicInfoId}`, this.props.isAuthed)
        })
    };

    render() {
        return <div>
            <Divider>{this.props.selectedShow.name}</Divider>
            类型：{Genre.get(this.props.selectedShow.genre)}
            <br/>
            时长：{this.props.selectedShow.duration}
            <br/>
            <Divider dashed>抢票</Divider>
            <AreaCascader placeholder={'选择区域，默认全选'} defaultArea={null} level={1} onChange={this.onRegionCodeChange}/>
            <Tabs defaultActiveKey="1">
                {Array.from(moment.rangeFromInterval('d', 80).by('days')).map((date, index) =>
                    <Tabs.TabPane tab={date.format("YYYY-MM-DD")} key={index}>
                        <List itemLayout="horizontal"
                              dataSource={this.props.publicInfos.filter(info => moment(info.schedule).isSame(date, 'd') && (this.state.regionCode === -1 || (!_.isEmpty(this.state.theaters.get(info.theaterId)) && this.state.theaters.get(info.theaterId).regionId === this.state.regionCode)))}
                              renderItem={item => (
                                  <List.Item actions={[<a onClick={() => this.onChooseTheaterClick(item.id)}>选择</a>]}>
                                      <List.Item.Meta
                                          title={<a>{this.state.theaters.get(item.theaterId).name}</a>}
                                          description={`从${(item.basePrice / 100).toFixed(2)}元起`}/>
                                  </List.Item>)}/>
                    </Tabs.TabPane>)}
            </Tabs>
        </div>
    }
}

const
    mapDispatchToProps = (dispatch) => {
        return {
            findAllPublicInfoByShowId: (showId) => dispatch(findAllPublicInfoByShowId(showId)),
            findById: (id) => dispatch(findById(id)),
            route: (path, isAuthed) => dispatch(route(path, isAuthed))
        }
    };

const
    mapStateToProps = (state) => {
        return {
            selectedShow: state.showReducer.selectedShow,
            publicInfos: state.publicInfoReducer.publicInfos,
            isAuthed: state.loginReducer.isAuthed,
        }
    };

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfo)

