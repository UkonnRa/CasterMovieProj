import React from 'react';
import {connect} from 'react-redux';
import {Level, Role} from '../model/user';
import {Button, Collapse, Form, Input, InputNumber, message, Table} from 'antd';
import 'react-area-linkage/dist/index.css'; // v2 or higher
import {pcaa} from "area-data";
import {AreaCascader} from 'react-area-linkage';
import _ from 'lodash';
import {Api} from '../api';
import axios from 'axios';
import {HIDE_ENTRY_FORM} from '../redux/entry/actions';

class TheaterSignUpForm extends React.Component {
    state = {
        confirmDirty: false,
        seatPerLineDirty: false,
        activeSection: 'basic'
    };

    performSignUp = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('您的注册信息有误，请检查');
                return;
            }

            const args = {
                role: Role.Theater,
                email: values.theaterEmail,
                password: values.theaterPassword,
                name: values.theaterName,
                regionId: Number(_.last(values.region)),
                location: values.location,
                seatNumber: values.seats,
                seatPerLine: values.seatsInLine,
                discounts: [
                    values.discounts0,
                    values.discounts1,
                    values.discounts2,
                    values.discounts3,
                    values.discounts4
                ]
            };

            message.loading('正在注册...', 0);
            axios
                .post(Api.theater.register, args, {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                })
                .then(resp => {
                    message.destroy();

                    if (resp.data.value) {
                        this.props.hideEntryForm();
                        message.success('注册成功！请等待管理员审核您的申请');
                    } else {
                        message.error(resp.data.message);
                    }
                })
                .catch(err => {
                    message.error('网络连接似乎出了问题，请稍后再试');
                });
        });
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    checkSeats = (rule, value, callback) => {
        if (value && this.state.seatPerLineDirty) {
            this.props.form.validateFields(['seatsInLine'], { force: true });
        }
        callback();
    };

    checkSeatsInLine = (rule, value, callback) => {
        if (value && value > this.props.form.getFieldValue('seats')) {
            callback('每行座位数不得大于座位总数');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (value && this.state.confirmDirty) {
            this.props.form.validateFields(['theaterPasswordConfirm'], {
                force: true
            });
        }
        callback();
    };

    checkPasswordConfirm = (rule, value, callback) => {
        if (
            value &&
            value !== this.props.form.getFieldValue('theaterPassword')
        ) {
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

    handleSeatPerLineBlur = e => {
        this.setState({
            seatPerLineDirty: this.state.seatPerLineDirty || !!e.target.value
        });
    };

    onRegionCodeChange = code => {
        this.setState({
            regionCode: !_.isEmpty(code) ? Number(_.last(code)) : -1
        });
    };

    itemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    itemStatus = fieldName => {
        const err =
            this.props.form.isFieldTouched(fieldName) &&
            this.props.form.getFieldError(fieldName);
        return {
            validateStatus: err ? 'error' : '',
            help: err || ''
        };
    };

    basicSection() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Collapse.Panel header="基本信息" key="basic" forceRender={true}>
                <Form.Item
                    label="场馆名称"
                    {...this.itemStatus('theaterName')}
                    {...this.itemLayout}>
                    {getFieldDecorator('theaterName', {
                        rules: [
                            {
                                required: true,
                                message: '场馆名称不能为空'
                            }
                        ]
                    })(<Input placeholder="场馆名称" />)}
                </Form.Item>

                <Form.Item
                    label="场馆邮箱"
                    {...this.itemStatus('theaterEmail')}
                    {...this.itemLayout}>
                    {getFieldDecorator('theaterEmail', {
                        rules: [
                            {
                                type: 'email',
                                message: '场馆邮箱填写有误，请检查格式'
                            },
                            {
                                required: true,
                                message: '场馆邮箱不能为空'
                            }
                        ]
                    })(<Input placeholder="场馆邮箱" />)}
                </Form.Item>

                <Form.Item
                    label="密码"
                    {...this.itemStatus('theaterPassword')}
                    {...this.itemLayout}
                >
                    {getFieldDecorator('theaterPassword', {
                        rules: [
                            {
                                required: true,
                                message: '密码不能为空'
                            },
                            { validator: this.checkPassword }
                        ]
                    })(<Input type="password" placeholder="密码" />)}
                </Form.Item>

                <Form.Item
                    label="密码确认"
                    {...this.itemStatus('theaterPasswordConfirm')}
                    {...this.itemLayout}
                >
                    {getFieldDecorator('theaterPasswordConfirm', {
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
            </Collapse.Panel>
        );
    }

    locationSection() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Collapse.Panel header="位置信息" key="location" forceRender={true}>
                <Form.Item
                    label="场馆区域"
                    {...this.itemStatus('region')}
                    {...this.itemLayout}
                >
                    {getFieldDecorator('region', {
                        rules: [
                            {
                                type: 'array',
                                required: true,
                                message: '请选择场馆地点'
                            }
                        ]
                    })(
                        <AreaCascader
                            data={pcaa}
                            id="region"
                            defaultArea={['440000', '440300', '440305']}
                            placeholder={'场馆地点'}
                            level={1}
                            onChange={this.onRegionCodeChange}
                        />
                    )}
                </Form.Item>

                <Form.Item
                    label="具体地址"
                    {...this.itemStatus('location')}
                    {...this.itemLayout}
                >
                    {getFieldDecorator('location', {
                        rules: [
                            {
                                required: true,
                                message: '具体地址不能为空'
                            }
                        ]
                    })(<Input placeholder="具体地址" />)}
                </Form.Item>
            </Collapse.Panel>
        );
    }

    facilitySection() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Collapse.Panel header="场馆设施" key="facility" forceRender={true}>
                <Form.Item
                    label="座位总数"
                    {...this.itemStatus('seats')}
                    {...this.itemLayout}
                >
                    {getFieldDecorator('seats', {
                        initialValue: 100,
                        rules: [
                            {
                                required: true,
                                message: '座位总数不能为空'
                            },
                            { validator: this.checkSeats }
                        ]
                    })(<InputNumber min={0} placeholder="座位总数" />)}
                </Form.Item>

                <Form.Item
                    label="每行座位数"
                    {...this.itemStatus('seatsInLine')}
                    {...this.itemLayout}
                >
                    {getFieldDecorator('seatsInLine', {
                        initialValue: 10,
                        rules: [
                            {
                                required: true,
                                message: '请输入每行座位数'
                            },
                            { validator: this.checkSeatsInLine }
                        ]
                    })(
                        <InputNumber
                            min={0}
                            onBlur={this.handleSeatPerLineBlur}
                            placeholder="每行座位数"
                        />
                    )}
                </Form.Item>
            </Collapse.Panel>
        );
    }

    memberSection() {
        const { getFieldDecorator } = this.props.form;

        const renderInput = (text, record, index) => (
            <Form.Item
                style={{ display: 'inline' }}
                {...this.itemStatus(`discounts${index}`)}
            >
                <em>–&nbsp;</em>
                {getFieldDecorator(`discounts${index}`, {
                    rules: [
                        {
                            required: true,
                            message: '请输入对应的折扣'
                        }
                    ]
                })(<InputNumber min={0} max={100} step={1} size="small" />)}
                <em>&nbsp;%</em>
            </Form.Item>
        );

        return (
            <Collapse.Panel header="会员折扣" key="member" forceRender={true}>
                <Table
                    size="small"
                    pagination={false}
                    dataSource={Object.keys(Level).map((level, key) => ({
                        level,
                        key
                    }))}
                >
                    <Table.Column
                        title="会员等级"
                        dataIndex="level"
                        key="level"
                        align="center"
                        render={(text, record, index) => <b>{text}</b>}
                    />
                    <Table.Column
                        title="对应折扣"
                        render={renderInput}
                        align="center"
                    />
                </Table>
            </Collapse.Panel>
        );
    }

    hasErrors = () => {
        const fieldErrors = this.props.form.getFieldsError();
        const result = Object.keys(fieldErrors).some(
            field => fieldErrors[field]
        );
        console.log(fieldErrors);
        return result;
    };

    render() {
        return (
            <Form onSubmit={this.performSignUp}>
                <Collapse
                    bordered={false}
                    defaultActiveKey={['basic']}
                    style={{ marginBottom: '6px' }}
                    accordion
                >
                    {this.basicSection()}
                    {this.locationSection()}
                    {this.facilitySection()}
                    {this.memberSection()}
                </Collapse>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        disabled={this.hasErrors()}
                        style={{ width: '100%' }}
                    >
                        现在注册
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    hideEntryForm: () => dispatch({ type: HIDE_ENTRY_FORM })
});

export default connect(null, mapDispatchToProps)(Form.create()(TheaterSignUpForm))