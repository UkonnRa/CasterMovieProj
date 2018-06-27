import React from 'react';
import {connect} from 'react-redux';
import {Button, Form, Icon, Input, message, Tooltip} from 'antd';
import {HIDE_ENTRY_FORM} from '../redux/entry/actions';
import {login} from '../redux/auth/actions';
import {Api} from '../api';
import axios from 'axios';

class CustomerSignUpForm extends React.Component {
    state = {
        confirmDirty: false
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    performSignUp = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('您的注册信息有误，请检查');
                return;
            }

            console.log(values);

            message.loading('正在注册...', 0);

            axios
                .post(Api.user.register, values, {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                })
                .then(resp => {
                    message.destroy();

                    if (resp.data.value) {
                        this.props.hideEntryForm();

                        message.success('注册成功！');
                    } else {
                        message.error(resp.data.message);
                    }
                })
                .catch(err => {
                        console.log(err);
                        message.error('网络连接似乎出了问题，请稍后再试');
                    }
                );
        });
    };

    checkPasswordConfirm = (rule, value, callback) => {
        if (value && value !== this.props.form.getFieldValue('password')) {
            callback('密码不一致，请重新输入');
        } else {
            callback();
        }
    };

    handleConfirmBlur = e => {
        this.setState({
            confirmDirty: this.state.confirmDirty || !!e.target.value
        });
    };

    hasErrors = () => {
        const fieldErrors = this.props.form.getFieldsError();
        return Object.keys(fieldErrors).some(field => fieldErrors[field]);
    };

    render() {
        const {
            getFieldDecorator,
            isFieldTouched,
            getFieldError
        } = this.props.form;

        const itemStatus = fieldName => {
            const err = isFieldTouched(fieldName) && getFieldError(fieldName);
            return {
                validateStatus: err ? 'error' : '',
                help: err || ''
            };
        };

        return (
            <Form layout="vertical" onSubmit={this.performSignUp}>

                <Form.Item label="邮箱" {...itemStatus('email')}>
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: '邮箱地址填写有误，请检查格式'
                            },
                            {
                                required: true,
                                message: '邮箱地址不能为空'
                            }
                        ]
                    })(<Input placeholder="邮箱地址" />)}
                </Form.Item>

                <Form.Item label="密码" {...itemStatus('password')}>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: '密码不能为空'
                            },
                            { validator: this.checkPassword }
                        ]
                    })(<Input type="password" placeholder="密码" />)}
                </Form.Item>

                <Form.Item label="密码确认" {...itemStatus('passwordConfirm')}>
                    {getFieldDecorator('passwordConfirm', {
                        rules: [
                            {
                                required: true,
                                message: '请再次输入密码以确认'
                            },
                            { validator: this.checkPasswordConfirm }
                        ]
                    })(
                        <Input
                            type="password"
                            placeholder="再次输入密码"
                            onBlur={this.handleConfirmBlur}
                        />
                    )}
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            昵称&nbsp;
                            <Tooltip title="您想被怎样称呼？">
                                <Icon
                                    type="question-circle-o"
                                    style={{ color: 'rgba(0,0,0,.6)' }}
                                />
                            </Tooltip>
                        </span>
                    }
                    {...itemStatus('name')}
                >
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '昵称不能为空'
                            }
                        ]
                    })(<Input placeholder="昵称" />)}
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        disabled={this.hasErrors()}
                        style={{ width: '100%' }}
                    >
                        立即注册
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    hideEntryForm: () => dispatch({ type: HIDE_ENTRY_FORM }),
    signIn: values => dispatch(login(values))
});

export default connect(null, mapDispatchToProps)(Form.create()(CustomerSignUpForm))