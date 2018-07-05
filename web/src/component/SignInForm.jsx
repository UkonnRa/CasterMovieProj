import React from 'react';
import {login} from '../redux/auth/actions';
import {connect} from 'react-redux';
import {HIDE_ENTRY_FORM} from '../redux/entry/actions';
import {Button, Form, Icon, Input, message} from 'antd';

class Login extends React.Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    hasErrors = () => {
        const fieldErrors = this.props.form.getFieldsError();
        return Object.keys(fieldErrors).some(field => fieldErrors[field]);
    };

    performSignin = e => {
        e.preventDefault();

        const { role, form, login } = this.props;

        form.validateFields((err, values) => {
            if (err) {
                message.error('请完整填写您的登录信息');
                return;
            }

            login({ ...values, role })
                .then(res => {
                    form.resetFields();
                    message.success(`登录成功! 您好, ${res.data.value.name}。`);
                    this.props.hideEntryForm();
                })
                .catch(err => {
                    message.error(err.toString());
                });
        });
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
            <Form
                layout="vertical"
                onSubmit={this.performSignin}
                hideRequiredMark={true}
            >
                <Form.Item label="邮箱" {...itemStatus('email')}>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '邮箱不能为空' }]
                    })(
                        <Input
                            prefix={
                                <Icon
                                    type="idcard"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            placeholder="请输入邮箱"
                        />
                    )}
                </Form.Item>
                <Form.Item label="密码" {...itemStatus('password')}>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码不能为空' }]
                    })(
                        <Input
                            type="password"
                            prefix={
                                <Icon
                                    type="lock"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            placeholder="请输入密码"
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={this.hasErrors()}
                        style={{ width: '100%' }}
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    login: values => dispatch(login(values)),
    hideEntryForm: () => dispatch({ type: HIDE_ENTRY_FORM })
});

export default connect(null, mapDispatchToProps)(Form.create()(Login))