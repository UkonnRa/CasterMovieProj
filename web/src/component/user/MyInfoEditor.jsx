import React from 'react';
import { Input, Form } from 'antd';

class MyInfoEditor extends React.Component {
    state = {
        confirmDirty: false
    };

    constructor(props) {
        super(props);
    }

    getInfo = () => ({
        password: this.props.form.getFieldValue('modifiedPassword'),
        name: this.props.form.getFieldValue('modifiedName')
    });

    componentDidMount() {
        this.props.form.validateFields();
        this.props.reportError(this.hasErrors());
    }

    componentDidUpdate() {
        this.props.reportError(this.hasErrors());
    }

    checkPassword = (rule, value, callback) => {
        if (value && this.state.confirmDirty) {
            this.props.form.validateFields(['modifiedPasswordConfirm'], {
                force: true
            });
        }
        callback();
    };

    checkPasswordConfirm = (rule, value, callback) => {
        const modifiedPassword = this.props.form.getFieldValue(
            'modifiedPassword'
        );
        if (!!modifiedPassword && value !== modifiedPassword) {
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
        const { getFieldsError, getFieldValue } = this.props.form;

        const fieldErrors = getFieldsError();
        const hasModifiedPassword = getFieldValue('modifiedPassword');
        const hasModifiedPasswordConfirm = getFieldValue(
            'modifiedPasswordConfirm'
        );
        const hasModifiedName = getFieldValue('modifiedName');

        return (
            Object.keys(fieldErrors).some(field => fieldErrors[field]) ||
            ((!hasModifiedName || hasModifiedPassword) &&
                !hasModifiedPasswordConfirm) ||
            (!hasModifiedName && !hasModifiedPassword)
        );
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
                help: err || '',
                style: {
                    marginBottom: '0px'
                }
            };
        };

        return <Form style={{ textAlign: 'left' }}>
                <Form.Item
                    label={<span style={{ fontSize: '12px' }}>新密码</span>}
                    {...itemStatus('modifiedPassword')}
                >
                    {getFieldDecorator('modifiedPassword', {
                        rules: [{ validator: this.checkPassword }]
                    })(
                        <Input
                            style={{ fontSize: '0.85em' }}
                            type="password"
                            placeholder="输入新密码，不填写则不修改"
                        />
                    )}
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: '12px' }}>确认密码</span>}
                    {...itemStatus('modifiedPasswordConfirm')}
                >
                    {getFieldDecorator('modifiedPasswordConfirm', {
                        rules: [{ validator: this.checkPasswordConfirm }]
                    })(
                        <Input
                            style={{ fontSize: '0.85em' }}
                            type="password"
                            placeholder="再次输入密码"
                            onBlur={this.handleConfirmBlur}
                        />
                    )}
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontSize: '12px' }}>新昵称</span>}
                    {...itemStatus('modifiedName')}
                >
                    {getFieldDecorator('modifiedName')(
                        <Input
                            style={{ fontSize: '0.85em' }}
                            placeholder="输入新昵称，不填写则不修改"
                        />
                    )}
                </Form.Item>
            </Form>
;
    }
}

export default Form.create()(MyInfoEditor)
