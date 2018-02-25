import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Form, Icon, Input, InputNumber, Modal, Tooltip} from 'antd'
import {AreaCascader} from 'react-area-linkage';
import {Level} from "../../model/user";
import _ from "lodash";
import axios from 'axios'
import {Api} from "../../api";
import {route} from "../../redux/ui/actions";
import {RouteTable} from "../../route";

const UpdateForm = Form.create()(
    class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                confirmDirty: false,
                seatPerLineDirty: false,
            }
        }

        onSubmit = () => {
            const {onCancel, form} = this.props;

            form.validateFields(async (err, values) => {
                if (err) return;
                let discounts = {};
                Object.keys(Level).forEach((level, index) => discounts[level] = values.discounts[index]);
                let reqInfoData = await axios.post(Api.theater.update, {
                    id: this.props.user.id,
                    userTheater: {...values, regionId: Number(_.last(values.regionId)), discounts: discounts},

                }, {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    }
                });
                if (reqInfoData.data.value) {
                    alert("提交更新信息成功");
                    form.resetFields();
                    onCancel();
                    this.props.route(RouteTable[this.props.user.role].Main.path, this.props.isAuthed, this.props.user.role)
                } else {
                    alert(`发现错误：${reqInfoData.data.message}`)
                }
            })
        };

        handleConfirmBlur = (e) => {
            const value = e.target.value;
            this.setState({confirmDirty: this.state.confirmDirty || !!value});
        };

        checkPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('两个密码需要完全一致，请检查输入');
            } else {
                callback();
            }
        };

        checkConfirm = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['passwordConfirm'], {force: true});
            }
            callback();
        };

        onRegionCodeChange = (code) => {
            this.setState({regionCode: !_.isEmpty(code) ? Number(_.last(code)) : -1})
        };

        handleSeatPerLineBlur = (e) => {
            const value = e.target.value;
            this.setState({seatPerLineDirty: this.state.seatPerLineDirty || !!value});
        };

        checkSeatNumber = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value > form.getFieldValue('seatNumber')) {
                callback('每行座位数不得大于座位总数');
            } else {
                callback();
            }
        };
        checkSeatPerLine = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.seatPerLineDirty) {
                form.validateFields(['seatPerLine'], {force: true});
            }
            callback();
        };

        render = () => {
            const {visible, onCancel, form, user} = this.props;
            const {getFieldDecorator} = form;

            return <Modal
                visible={visible}
                title="修改剧院信息"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.onSubmit}>
                <Form layout="vertical">
                    <Form.Item label="场馆名称">
                        {getFieldDecorator('name', {
                            initialValue: user.name,
                            rules: [{required: true, message: '请输入场馆名称'}],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码'},
                                {validator: this.checkConfirm}],
                        })(<Input type="password"/>)}
                    </Form.Item>
                    <Form.Item label="密码确认">
                        {getFieldDecorator('passwordConfirm', {
                            rules: [{required: true, message: '请确认密码'},
                                {validator: this.checkPassword}],
                        })(<Input type="password" onBlur={this.handleConfirmBlur}/>)}
                    </Form.Item>
                    <Form.Item label="场馆区域">
                        {getFieldDecorator('regionId', {
                            defaultArea: ['440000', '440300', '440305'],
                            rules: [{type: 'array', required: true, message: '请选择场馆地点'}],
                        })(<AreaCascader placeholder={'请选择场馆地点'} level={1}
                                         onChange={this.onRegionCodeChange}/>)}
                    </Form.Item>
                    <Form.Item label="具体地址">
                        {getFieldDecorator('location', {
                            initialValue: user.location,
                            rules: [{required: true, message: '请输入具体地址'}],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item label="座位总数">
                        {getFieldDecorator('seatNumber', {
                            initialValue: user.seatNumber,
                            rules: [{required: true, message: '请输入座位总数'},
                                {validator: this.checkSeatPerLine},]
                        })(<InputNumber min={0}/>)}
                    </Form.Item>
                    <Form.Item label="每行座位数">
                        {getFieldDecorator('seatPerLine', {
                            initialValue: user.seatPerLine,
                            rules: [{required: true, message: '请输入每行座位数'},
                                {validator: this.checkSeatNumber}]
                        })(<InputNumber min={0} onBlur={this.handleSeatPerLineBlur}/>)}
                    </Form.Item>
                    {Object.keys(Level).map((level, index) => {
                        return (<Form.Item key={index} label={index === 0 ? (<span>顾客等级折扣
                                    <Tooltip title="顾客不同等级可获得的相应折扣">
                                        <Icon type="question-circle-o"/>
                                    </Tooltip></span>) : null}>
                            {level}：{getFieldDecorator(`discounts[${index}]`, {
                            initialValue: user.discounts[level],
                            rules: [{required: true, message: '请输入该等级对应的折扣'}]
                        })(<InputNumber min={0} step={0.01}/>)}
                        </Form.Item>)
                    })}
                </Form>
            </Modal>
        }
    }
);

class MyTheaterInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    render = () => <div>
        <UpdateForm user={this.props.user} onCancel={() => this.setState({visible: false})}
                    visible={this.state.visible} isAuthed={this.props.isAuthed} route={this.props.route}/>
        <p>剧院id：{this.props.user.id}</p>
        <p>剧院名称：{this.props.user.name}</p>
        <p>剧院区域：{this.props.user.regionId}</p>
        <p>剧院地址：{this.props.user.location}</p>
        <p>座位总数：{this.props.user.seatNumber}</p>
        <p>每行座位数:{this.props.user.seatPerLine}</p>
        <div>顾客等级折扣：{Object.keys(Level).map((level, index) => <p key={index}>
            {level}：{this.props.user.discounts[level] ? this.props.user.discounts[level] : 1.0}<br/>
        </p>)}</div>
        <Button onClick={() => this.setState({visible: true})}>修改剧院信息</Button>
    </div>
}


const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        route: (key, isAuthed, role) => dispatch(route(key, isAuthed, role))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTheaterInfo)


