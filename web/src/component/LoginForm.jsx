import React, {Component} from 'react';
import {login} from '../redux/auth/actions'
import {connect} from 'react-redux'
import {Form, Icon, Input, InputNumber, Modal, Radio, Tooltip} from 'antd';
import axios from 'axios'
import {Api} from "../api";
import {Role} from "../model/user";
import {AreaCascader, AreaSelect} from 'react-area-linkage';
import _ from "lodash";

const LoginForm = Form.create()(
    class FormInner extends Component {
        constructor(props) {
            super(props);
            this.state = {
                nowRoute: "LOGIN",
                confirmDirty: false,
                seatPerLineDirty: false,
                registerType: Role.CUSTOMER,
            }
        }

        onLoginOk = () => {
            const {onCancel, form, login} = this.props;

            form.validateFields((err, values) => {
                if (err) return;
                login(values).then((res) => {
                    console.log(res);
                    form.resetFields();
                    onCancel()
                }).catch(err => alert(err))
            })
        };

        onCreateUserOk = () => {
            const {onCancel, form} = this.props;

            form.validateFields(async (err, values) => {
                if (err) return;
                if (this.state.registerType === Role.CUSTOMER) {
                    const result = await axios.post(Api.user.register, values, {
                        headers: {'Content-Type': 'application/json;charset=utf-8'}
                    });
                    if (result.data.value) {
                        alert("注册成功，我们将发给你一份激活邮件，请查收");
                        form.resetFields();
                        onCancel();
                        this.setState({nowRoute: "LOGIN"})
                    } else {
                        alert(result.data.message)
                    }
                } else if (this.state.registerType === Role.THEATER) {
                    const result = await axios.post(Api.theater.register,
                        {...values, regionId: Number(_.last(values.regionId))},
                        {headers: {'Content-Type': 'application/json;charset=utf-8'}});
                    if (result.data.value) {
                        alert("注册成功，请等待管理员答复");
                        form.resetFields();
                        onCancel();
                        this.setState({nowRoute: "LOGIN"})
                    } else {
                        alert(result.data.message)
                    }
                }
            })
        };

        onToCreateUser = () => this.setState({nowRoute: "CREATE_USER"});

        onToLogin = () => this.setState({nowRoute: "LOGIN"});

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


        registerComponent = () => {
            const {getFieldDecorator} = this.props.form;

            switch (this.state.registerType) {
                case Role.CUSTOMER:
                    return <Form layout="vertical">
                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: '请输入用户名'}],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [{type: 'email', message: '请输入有效的E-mail',},
                                    {required: true, message: '请输入E-mail',}],
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
                        <Form.Item label={(<span>昵称
                                    <Tooltip title="你想让别人怎么称呼你？">
                                        <Icon type="question-circle-o"/>
                                    </Tooltip></span>)}>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入昵称'}],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                    </Form>;
                case Role.THEATER:
                    return <Form layout="vertical">
                        <Form.Item label="场馆名称">
                            {getFieldDecorator('name', {
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
                                rules: [{type: 'array', required: true, message: '请选择场馆地点'}],
                            })(
                                <AreaCascader placeholder={'请选择场馆地点'} defaultArea={null} level={1}
                                              onChange={this.onRegionCodeChange}/>
                            )}
                        </Form.Item>
                        <Form.Item label="具体地址">
                            {getFieldDecorator('location', {
                                rules: [{required: true, message: '请输入具体地址'}],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="座位总数">
                            {getFieldDecorator('seatNumber', {
                                initialValue: 100,
                                rules: [{required: true, message: '请输入座位总数'},
                                    {validator: this.checkSeatPerLine},]
                            })(<InputNumber min={0}/>)}
                        </Form.Item>
                        <Form.Item label="每行座位数">
                            {getFieldDecorator('seatPerLine', {
                                initialValue: 10,
                                rules: [{required: true, message: '请输入每行座位数'},
                                    {validator: this.checkSeatNumber}]
                            })(<InputNumber min={0} onBlur={this.handleSeatPerLineBlur}/>)}
                        </Form.Item>
                    </Form>
            }
        };

        innerRoute = {
            LOGIN: () => {
                const {visible, onCancel, form} = this.props;
                const {getFieldDecorator} = form;

                return <Modal
                    visible={visible}
                    title="用户登陆"
                    okText="登陆"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={this.onLoginOk}>
                    <Form layout="vertical">
                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: '请输入用户名'}],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码'},
                                    {validator: this.checkConfirm}],

                            })(<Input type="password"/>)}
                        </Form.Item>
                    </Form>
                    <a onClick={this.onToCreateUser}>创建用户</a>
                </Modal>
            },
            CREATE_USER: () => {
                const {visible, onCancel} = this.props;

                return <Modal
                    visible={visible}
                    title="用户注册"
                    okText="注册！"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={this.onCreateUserOk}>
                    <Radio.Group onChange={(e) => {
                        this.setState({registerType: e.target.value})
                    }} value={this.state.registerType}>
                        <Radio value={Role.CUSTOMER}>顾客</Radio>
                        <Radio value={Role.THEATER}>剧院</Radio>
                    </Radio.Group>
                    {this.registerComponent()}
                    <a onClick={this.onToLogin}>已有账号？前去登陆</a>
                </Modal>
            }
        };

        render = () => this.innerRoute[this.state.nowRoute]()
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        login: (values) => dispatch(login(values))
    }
};

export default connect(null, mapDispatchToProps)(LoginForm);