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

        return (
            <Modal
                visible={visible}
                title="LOGIN"
                okText="Login"
                onCancel={onCancel}
                onOk={formToValues}
            >
                <Form layout="vertical">
                    <Form.Item label="Username">
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please input username'}],
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                    <Form.Item label="Password">
                        {getFieldDecorator('password')(<Input type="password"/>)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        login: (values) => dispatch(login(values))
    }
};

export default connect(null, mapDispatchToProps)(LoginForm);