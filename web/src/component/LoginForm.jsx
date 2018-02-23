import React from 'react';
import {login} from '../redux/auth/actions'
import {connect} from 'react-redux'
import {Form, Input, Modal} from 'antd';

const LoginForm = Form.create()(
    (props) => {
        const {visible, onCancel, form, login} = props;
        const {getFieldDecorator} = form;

        const formToValues = () => {
            form.validateFields((err, values) => {
                if (err) return;
                form.resetFields();
                onCancel();
                login(values)
            })
        };

        const onCreateUser = () => {

        };

        return <Modal
            visible={visible}
            title="用户登陆"
            okText="登陆"
            cancelText="取消"
            onCancel={onCancel}
            onOk={formToValues}>
            <Form layout="vertical">
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入用户名'}],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}],
                    })(<Input type="password"/>)}
                </Form.Item>
            </Form>
            <a onClick={onCreateUser}>创建用户</a>
        </Modal>
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        login: (values) => dispatch(login(values))
    }
};

export default connect(null, mapDispatchToProps)(LoginForm);