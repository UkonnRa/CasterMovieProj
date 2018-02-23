import React, {Component} from 'react';
import {login} from '../redux/auth/actions'
import {connect} from 'react-redux'
import {Form, Icon, Input, Modal, Tooltip} from 'antd';
import axios from 'axios'
import {Api} from "../api";

const LoginForm = Form.create()(
    class FormInner extends Component {
        constructor(props) {
            super(props);
            this.state = {
                nowRoute: "LOGIN",
                confirmDirty: false,
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
                form.validateFields(['confirm'], {force: true});
            }
            callback();
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
                const {visible, onCancel, form} = this.props;
                const {getFieldDecorator} = form;

                return <Modal
                    visible={visible}
                    title="用户注册"
                    okText="注册！"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={this.onCreateUserOk}>
                    <Form layout="vertical">
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
                            {getFieldDecorator('password_confirm', {
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
                    </Form>
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