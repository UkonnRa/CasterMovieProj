import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, DatePicker, Form, Icon, InputNumber, TimePicker, Tooltip} from 'antd'
import {Genre} from "../../model/show";
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import _ from 'lodash'
import axios from 'axios'
import {Api} from "../../api";
import {route} from "../../redux/ui/actions";
import {RouteTable} from "../../route";

const moment = extendMoment(Moment);

const ComponentTimeRangeForm = Form.create()(class extends Component {
    uuid = 0;

    dateTimeRemove = (k) => {
        const {form} = this.props;
        const dateTimeKeys = form.getFieldValue('dateTimeKeys');
        if (dateTimeKeys.length === 1) {
            return;
        }
        form.setFieldsValue({
            dateTimeKeys: dateTimeKeys.filter(key => key !== k),
        });
    };

    dateTimeAdd = () => {
        const {form} = this.props;
        const dateTimeKeys = form.getFieldValue('dateTimeKeys');
        const nextKeys = dateTimeKeys.concat(this.uuid);
        this.uuid++;
        form.setFieldsValue({
            dateTimeKeys: nextKeys,
        });
    };

    seatPriceRemove = (k) => {
        const {form} = this.props;
        const seatPriceKeys = form.getFieldValue('seatPriceKeys');
        if (seatPriceKeys.length === 1) {
            return;
        }
        form.setFieldsValue({
            seatPriceKeys: seatPriceKeys.filter(key => key !== k),
        });
    };

    seatPriceAdd = () => {
        const {form} = this.props;
        const seatPriceKeys = form.getFieldValue('seatPriceKeys');
        const nextKeys = seatPriceKeys.concat(this.uuid);
        this.uuid++;
        form.setFieldsValue({
            seatPriceKeys: nextKeys,
        });
    };

    onSubmitClick =  (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {basePrice, dateRange, timePicker, price, seat} = values;
                if (!dateRange || !timePicker || !price || !seat) {
                    alert("请完成信息输入后重试");
                    return
                }
                let schedules = _.flattenDeep(dateRange.map((dateArray, index) =>
                    Array.from(moment.range(moment(`${dateArray[0].format('YYYY-MM-DD')}T${timePicker[index].format('HH:mm:ss')}`, moment.ISO_8601), moment(`${dateArray[1].format('YYYY-MM-DD')}T${timePicker[index].format('HH:mm:ss')}`, moment.ISO_8601)).by('days'))
                )).map(d => d.valueOf());
                console.log(this.props.user);
                let priceTable = {};
                price.forEach((price, index) => priceTable[seat[index]] = price);
                let newPublicInfoData = await axios.post(Api.theater.newPublicInfo, {
                        theaterId: this.props.user.id,
                        showId: this.props.selectedShow.id,
                        schedules,
                        priceTable,
                        basePrice: Number(basePrice * 100)
                    }, {
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`
                        }});
                if (newPublicInfoData.data.value) {
                    alert("发布剧集信息成功");
                    this.props.route(RouteTable.THEATER.TheaterShowList.path, this.props.isAuthed, this.props.user.role)
                } else {
                    alert(`${newPublicInfoData.data.message}`)
                }
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 20, offset: 4},
            },
        };
        const config = {
            rules: [{type: 'object', required: true, message: '请选择时间'}],
        };
        const rangeConfig = {
            rules: [{type: 'array', required: true, message: '请选择日期区间'}],
        };
        getFieldDecorator('dateTimeKeys', {initialValue: []});
        const dateTimeKeys = getFieldValue('dateTimeKeys');
        const dateTimeFormItems = dateTimeKeys.map((k, index) => {
            return (
                <div key={`dateTime${k}`}>
                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? '选择日期区间' : ''}
                        key={`dateRange${k}`}>
                        {getFieldDecorator(`dateRange[${k}]`, rangeConfig)(
                            <DatePicker.RangePicker disabledDate={current => current < moment().endOf('day')}/>
                        )}
                    </Form.Item>
                    <br/>
                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? '选择出演时间' : ''}
                        key={`timePicker${k}`}>
                        {getFieldDecorator(`timePicker[${k}]`, config)(
                            <TimePicker format={"HH:mm"}/>
                        )}
                    </Form.Item>
                    <br/>
                    {dateTimeKeys.length > 1 ? (<Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={dateTimeKeys.length === 1}
                        onClick={() => this.dateTimeRemove(k)}/>) : null}
                </div>
            );
        });

        getFieldDecorator('seatPriceKeys', {initialValue: []});
        const seatPriceKeys = getFieldValue('seatPriceKeys');
        const seatPriceFormItems = seatPriceKeys.map((k, index) => {
            return (
                <div key={`seatPrice${k}`}>
                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? <span>输入座位
                                <Tooltip title="该数值表示实行相应折扣的最小座位号">
                                    <Icon type="question-circle-o"/>
                                </Tooltip>
                            </span> : ''}
                        key={`seat${k}`}>
                        {getFieldDecorator(`seat[${k}]`,
                            {rules: [{required: true, message: '请输入座位或者删除该项'}]},
                        )(
                            <InputNumber min={0}/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? <span>输入比率
                                <Tooltip title="该数值表示相对于基础价格，该区间座位的价格的比率">
                                    <Icon type="question-circle-o"/>
                                </Tooltip>
                            </span> : ''}
                        key={`price${k}`}>
                        {getFieldDecorator(`price[${k}]`,
                            {rules: [{required: true, message: '请输入价格或者删除该项'}]},
                        )(
                            <InputNumber min={0} step={0.01}/>
                        )}
                    </Form.Item>
                    {seatPriceKeys.length > 1 ? (<Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={seatPriceKeys.length === 1}
                        onClick={() => this.seatPriceRemove(k)}/>) : null}
                </div>
            );
        });

        return (
            <Form onSubmit={this.onSubmitClick}>
                {dateTimeFormItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.dateTimeAdd} style={{width: '60%'}}>
                        <Icon type="plus"/> 添加区间
                    </Button>
                </Form.Item>
                {seatPriceFormItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.seatPriceAdd} style={{width: '60%'}}>
                        <Icon type="plus"/> 添加座位表项
                    </Button>
                </Form.Item>
                <Form.Item label={"基础价格"}>
                    {getFieldDecorator('basePrice', {
                        rules: [{type: 'number', required: true, message: '请输入基础价格'}],
                    })(<InputNumber min={0} step={0.01}/>)}
                    元
                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        );
    }
});

class NewPublicInfo extends Component {

    render = () => <div>
        <p>剧集名称：{this.props.selectedShow.name}</p>
        <p>剧集类型：{Genre.get(this.props.selectedShow.genre)}</p>
        <p>剧集时长：{moment.utc(moment.duration(this.props.selectedShow.duration, 's').asMilliseconds()).format("HH:mm:ss")}</p>
        <ComponentTimeRangeForm isAuthed={this.props.isAuthed} user={this.props.user} selectedShow={this.props.selectedShow} route={this.props.route}/>
    </div>
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
        selectedShow: state.showReducer.selectedShow,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        route: (path, isAuthed, role) => dispatch(route(path, isAuthed, role))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPublicInfo)


