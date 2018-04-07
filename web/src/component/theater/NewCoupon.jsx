import React, {Component} from 'react'
import {Button, DatePicker, Form, Input, InputNumber, List, Modal, Pagination, Radio, TimePicker} from 'antd'
import {connect} from 'react-redux'
import _ from "lodash";
import axios from 'axios';
import {Api} from "../../api"
import {ExpiredType} from "../../model/coupon";
import moment from 'moment'
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import {Role} from "../../model/user";

const NewCouponForm = Form.create()(
    class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                expiredType: ExpiredType.TIME_POINT.name
            }
        }

        onCancel = () => {
            this.props.form.resetFields()
            this.props.onCancel()
        }


        onSubmit = () => {
            const { form } = this.props;
            form.validateFields(async (err, values) => {
                if (err) return;

                let couponData = await axios.post(Api.coupon.newCoupon, {
                    ...values,
                    theaterId: this.props.user.id,
                    expiredTime: this.state.expiredType === ExpiredType.TIME_POINT.name? values.expiredTime.valueOf(): moment.utc(moment.duration(values.expiredTime.format("HH:mm:ss")).asMilliseconds()).valueOf()
                }, {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    }
                });
                if (couponData.data.value) {
                    alert("新增优惠券成功");
                    this.onCancel()
                    this.props.route(RouteTable.THEATER.NewCoupon.path, this.props.isAuthed, this.props.user.role)
                } else {
                    alert(`发现错误：${couponData.data.message}`)
                }
            })
        };

        render = () => {
            const {visible, onCancel, form} = this.props;
            const {getFieldDecorator} = form;
            return <Modal
                visible={visible}
                title="新增优惠券"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.onSubmit}>
                <Form layout="vertical">
                    <Form.Item label="优惠券名称">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入优惠券名称'}],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item label="优惠券描述">
                        {getFieldDecorator('description', {
                            rules: [{required: true, message: '请输入优惠券描述'},],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item label="折扣">
                        {getFieldDecorator('discount', {
                            rules: [{required: true, message: '请输入折扣'},],
                        })(<InputNumber min={0} max={1} step={0.01}/>)}
                    </Form.Item>
                    <Form.Item label="过期类型">
                        {getFieldDecorator('expiredType', {
                            initialValue: this.state.expiredType,
                            rules: [{required: true, message: '请输入过期类型'},]
                        })(
                            <Radio.Group onChange={e => this.setState({expiredType: e.target.value})}>
                                {Object.keys(ExpiredType).map(u => ExpiredType[u]).map(u => <Radio value={u.name}>{u.text}</Radio>)}
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label="过期时间">
                        {getFieldDecorator('expiredTime', {
                            rules: [{required: true, message: '请输入过期时间'},]
                        })(
                            this.state.expiredType === ExpiredType.TIME_POINT.name?
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />:
                                <TimePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="最大获取数">
                        {getFieldDecorator('limitPerUser', {
                            rules: [{required: true, message: '请输入最大获取数'},],
                        })(<InputNumber min={0}/>)}
                    </Form.Item>
                    <Form.Item label="总数">
                        {getFieldDecorator('limitNumber', {
                            rules: [{required: true, message: '请输入总数'},],
                        })(<InputNumber min={0}/>)}
                    </Form.Item>
                    <Form.Item label="点券消费">
                        {getFieldDecorator('consumingPoint', {
                            rules: [{required: true, message: '请输入点券消费'},],
                        })(<InputNumber min={0}/>)}
                    </Form.Item>
                </Form>
            </Modal>
        }
    }
);

class NewCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1,
            coupons: [],
            visible: false,
        }
    }

    componentWillMount = () => {
        axios.get(Api.coupon.findAllByTheaterId, {
            params: {
                theaterId: this.props.user.id,
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(couponData => {
            if (couponData.data) {
                let coupon = couponData.data
                if (coupon.value) {
                    this.setState({coupons: coupon.value})
                } else {
                    alert(`Coupon Error: ${coupon.message}`)
                }
            }
        })
    }

    pagination = {
        pageSize: 5,
        onPageChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.props.shows.length, page * pageSize])
            })
        },
    };

    addCoupon = () => {
        this.setState({visible: true})
    }

    render() {
        return <div>
            <Button onClick={this.addCoupon}>添加优惠券</Button>
            <NewCouponForm isAuthed={this.props.isAuthed} route={this.props.route} onCancel={() => this.setState({visible: false})} visible={this.state.visible} user={this.props.user}/>
            <List
                dataSource={this.state.coupons.slice(this.state.start, this.state.end)}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={item.id}
                            description={item.description}/>
                        <p>名称：{item.name}</p>
                        <p>折扣：{item.discount}</p>
                        <p>过期类型：{ExpiredType[item.expiredType].text}</p>
                        <p>过期时间：{item.expiredType === ExpiredType.TIME_POINT.name? moment(item.expiredTime).format("YYYY-MM-DD HH:mm:ss"): moment.utc(item.expriedTime).format("HH:mm:ss")}</p>
                        <p>最大获取数：{item.limitPerUser}</p>
                        <p>总数：{item.limitNumber}</p>
                        <p>点券消费：{item.consumingPoint}</p>
                    </List.Item>
                )}/>
            <Pagination current={this.state.currPage} total={this.state.coupons.length}
                        pageSize={this.pagination.pageSize}
                        onChange={this.pagination.onPageChange}/>
        </div>
    }

}

const mapStateToProps = state => {
    return {
        user: state.loginReducer.user,
        isAuthed: state.loginReducer.isAuthed,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        route: (key, isAuthed) => dispatch(route(key, isAuthed, Role.THEATER)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCoupon)
