import React, { Component } from 'react';
import {
    message,
    Popover,
    List,
    Pagination,
    Row,
    Col,
    Card,
    Tag,
    Button
} from 'antd';
import { connect } from 'react-redux';
import { findAllByUserId, findById } from '../../redux/order/actions';
import _ from 'lodash';
import { OrderState } from '../../model/order';
import { route } from '../../redux/ui/actions';
import { RouteTable } from '../../route';
import axios from 'axios';
import { Api } from '../../api';
import moment from 'moment';

class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: this.pagination.pageSize,
            currPage: 1
        };
    }

    componentWillMount() {
        this.props.findAllByUserId(this.props.userId);
    }

    info = item => (
        <div
            style={{
                textAlign: 'left',
                paddingLeft: '1em',
                width: 'calc(100% - 160px)',
                height: '200px',
                float: 'left',
                position: 'relative'
            }}
        >
            <div>
                <Row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style={{ marginBottom: '.5em' }}
                >
                    <Col>
                        <h2 style={{ display: 'inline' }}>
                            {item.showName}&nbsp;&nbsp;
                        </h2>
                        <h3 style={{ display: 'inline' }}>
                            {item.seats.length}张
                        </h3>
                    </Col>
                    <Col>{this.tag(item)}</Col>
                </Row>
                <br />
                <h3>
                    {moment(item.startTime).calendar(null, {
                        sameElse: 'YY/MM/DD Ah点mm分'
                    })}
                </h3>
                <h3>{item.theaterName}</h3>
            </div>
            <Button.Group
                style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '10px',
                    fontSize: '10px'
                }}
            >
                {this.actionButton(item)}
                <Popover content={this.orderDetails(item)}>
                    <Button icon="ellipsis" style={{ color: 'black' }} />
                </Popover>
            </Button.Group>
        </div>
    );

    tagCursor = { cursor: 'default' };
    tag = item => {
        switch (item.orderState) {
            case OrderState.CANCELLED:
                return (
                    <Tag style={{ ...this.tagCursor, color: 'red' }}>
                        已取消
                    </Tag>
                );
            case OrderState.FINISHED:
                return (
                    <Tag style={{ ...this.tagCursor, color: 'blue' }}>
                        已使用
                    </Tag>
                );
            case OrderState.UNPAID:
                return <Tag style={this.tagCursor}>等待付款</Tag>;
            case OrderState.READY:
                return (
                    <Tag style={{ ...this.tagCursor, color: 'green' }}>
                        可使用
                    </Tag>
                );
            default:
                return (
                    <Tag style={this.tagCursor} color="lightgrey">
                        未知
                    </Tag>
                );
        }
    };

    orderDetails = item => (
        <div>
            <div>
                创建时间：{moment(item.createTime).calendar(null, {
                    sameElse: 'YY/MM/DD Ah点mm分'
                })}
            </div>
            <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;票价：{(
                    item.originalCost / 100
                ).toFixed(2)}{' '}
                元
            </div>
        </div>
    );

    onPayOrderClick = async (orderInfo) => {
        const order = await axios.post(Api.order.payOrder, {
            orderId: orderInfo.id,
            userId: this.props.user.id
        }, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        if (order.data.value && order.data.value.orderState === OrderState.READY) {
            message.info("付款成功");
            await this.props.findAllByUserId(this.props.userId);
        } else {
            message.error(`订单支付失败：${order.data.message}`)
        }
    };

    actionButton = item => {
        switch (item.orderState) {
            case 'UNPAID':
                return (
                    <Button
                        type="primary"
                        onClick={() => this.onPayOrderClick(item)}
                    >
                        付款
                    </Button>
                );
            case 'READY':
            case 'PAID':
                return (
                    <Popover
                        content={this.refundConfirm(item)}
                        style={{ clear: 'both' }}
                    >
                        <Button type="danger">退票</Button>
                    </Popover>
                );
            default:
                return null;
        }
    };

    refundConfirm = item => (
        <div>
            <div>
                您真的要退票吗？<span style={{ color: 'red' }}>
                    此操作不可撤销！
                </span>
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <Button.Group>
                    <Button
                        size="small"
                        type="danger"
                        style={{ fontSize: '12px', lineHeight: '24px' }}
                        onClick={() => this.performRefund(item)}
                    >
                        确认
                    </Button>
                </Button.Group>
            </div>
        </div>
    );

    performRefund = item => {
        message.destroy();
        message.loading('正在退票...');

        axios
            .post(
                Api.order.retrieveOrder,
                { orderId: item.id },
                {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                }
            )
            .then(resp => {
                if (resp.data.value) {
                    message.destroy();
                    message.success('退票成功');
                    this.props.findAllByUserId(this.props.userId);
                }
            })
            .catch(err => {
                message.destroy();
                message.error('网络连接似乎出了问题，请稍后重试');
            });
    };

    routeToPay = item => {
        this.props.route(
            `${RouteTable.CUSTOMER.PayOrder.path}#${item.id}`,
            this.props.isAuthed
        );
    };

    image = item => (
        <img
            src={item.poster}
            style={{
                float: 'right',
                width: '150px',
                height: '200px',
                boxShadow: 'darkgrey 10px 10px 20px 1px',
                borderRadius: '6px'
            }}
        />
    );

    render() {
        return (
            <div>
                <List
                    grid={{ column: 2, gutter: 24 }}
                    dataSource={this.props.orders
                        .sort((a, b) => -a.createTime + b.createTime)
                        .slice(this.state.start, this.state.end)}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable={true}
                                style={{
                                    cursor: 'auto',
                                    borderRadius: '10px'
                                }}
                            >
                                {this.info(item)}
                                {this.image(item)}
                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination
                    current={this.state.currPage}
                    total={this.props.orders.length}
                    pageSize={this.pagination.pageSize}
                    onChange={this.pagination.onChange}
                />
            </div>
        );
    }

    pagination = {
        pageSize: 10,
        onChange: (page, pageSize) => {
            this.setState({
                currPage: page,
                start: (page - 1) * pageSize,
                end: _.min([this.props.orders.length, page * pageSize])
            });
        }
    };
}

const mapStateToProps = state => {
    return {
        orders: state.orderReducer.orders,
        userId: state.loginReducer.user.id,
        isAuthed: state.loginReducer.isAuthed
    };
};

const mapDispatchToProps = dispatch => {
    return {
        findAllByUserId: userId => dispatch(findAllByUserId(userId)),
        route: (key, isAuthed) => dispatch(route(key, isAuthed)),
        findOrderById: orderId => dispatch(findById(orderId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyOrder);
