import React, { Component } from 'react';
import { Icon, InputNumber, Modal, Card, Row, Col, message } from 'antd';
import MyInfoEditor from './MyInfoEditor';
import { connect } from 'react-redux';
import { getCurrentUser, logout, update } from '../../redux/auth/actions';
import { route } from '../../redux/ui/actions';
import { Api } from '../../api';
import axios from 'axios';
import { Level } from '../../model/user';

class MyInfoCard extends Component {
    state = {
        editor: null,
        editorRef: null,
        canSubmitModification: false
    };

    componentWillMount = () => {
        this.props.getCurrentUser();
    };

    emitEmpty = () => {
        this.nameInput.focus();
        this.setState({ name: '' });
    };

    onChangeName = e => {
        this.setState({ name: e.target.value });
    };

    performModify = () => {
        const { hasErrors, getInfo } = this.state.editorRef;

        message.destroy();

        if (hasErrors()) {
            message.error('信息输入有误');
        }

        const modification = getInfo();

        if (!modification.password && !modification.name) {
            return;
        }

        modification.email = this.props.user.id;

        this.props
            .update(modification)
            .then(() => {
                message.destroy();
                message.success('个人信息修改成功');
                this.setState({ editor: null, canSubmitModification: false });
            })
            .catch(err => message.error('网络连接出了问题，请稍后重试'));
    };

    showRecharge = () =>
        Modal.confirm({
            title: '充值',
            content: (
                <Row align="middle">
                    <Col offset={4} span={12}>
                        <InputNumber
                            style={{ width: '100%' }}
                            ref={node => (this.recharge = node)}
                            min={0}
                            step={0.1}
                            onChange={v =>
                                this.setState({ money: Number(v) * 100 })
                            }
                            placeholder="充值金额"
                        />
                    </Col>
                    <Col offset={2} span={4}>
                        元
                    </Col>
                </Row>
            ),
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                console.log(this.state.money);
                axios
                    .post(
                        Api.user.recharge,
                        { id: this.props.user.id, money: this.state.money },
                        {
                            headers: {
                                'Content-Type':
                                    'application/json;charset=utf-8',
                                Authorization: `Bearer ${localStorage.getItem(
                                    'jwt'
                                )}`
                            }
                        }
                    )
                    .then(userData => {
                        if (userData.data.value) {
                            alert('充值成功');
                        } else {
                            alert(`充值失败，${userData.data.message}`);
                        }
                    })
                    .catch(err => alert(err));
            },
            onCancel: () => {}
        });

    avatar = (avatar) => (
        <img
            src={avatar}
            style={{
                width: '95%',
                height: '95%',
                margin: '2.5%'
            }}
        />
    );

    editor = () => (
        <MyInfoEditor
            reportError={hasErrors =>
                this.setState({ canSubmitModification: !hasErrors })
            }
            registerRef={ref => {
                this.state.editorRef = ref;
            }}
        />
    );

    actions = () =>
        this.state.editor === null
            ? [
                  <span style={{ color: 'black' }} onClick={this.showRecharge}>
                      <Icon type="bank" />&nbsp;余额充值
                  </span>,
                  <span
                      style={{ color: 'black' }}
                      onClick={() => this.setState({ editor: this.editor() })}
                  >
                      <Icon type="edit" />&nbsp;编辑信息
                  </span>
              ]
            : [
                  <span onClick={this.performModify}>
                      <Icon
                          type="check"
                          style={{
                              color: this.state.canSubmitModification
                                  ? 'black'
                                  : 'lightgrey',
                              fontSize: '1.5em'
                          }}
                      />
                  </span>,
                  <span
                      onClick={() =>
                          this.setState({
                              editor: null,
                              canSubmitModification: false
                          })
                      }
                  >
                      <Icon
                          type="close"
                          style={{ color: 'black', fontSize: '1.5em' }}
                      />
                  </span>
              ];

    cardTitle = () =>
        this.state.editor === null ? (
            <Row type="flex" justify="space-between" align="middle">
                <Col>
                    <h2 style={{ display: 'inline' }}>
                        {this.props.user.name}
                    </h2>
                </Col>
                <Col>{Level[this.props.user.level].tag}</Col>
            </Row>
        ) : (
            '修改个人信息'
        );

    cardDesc = () =>
        this.state.editor === null ? (
            <div style={{ textAlign: 'left' }}>
                <div style={{ wordBreak: 'break-word' }}>
                    <Icon type="mail" style={{ marginRight: '8px' }} />
                    {this.props.user.id}
                </div>
                <br />
                <div>
                    <div>
                        {'积分：'}&nbsp;&nbsp;&nbsp;&nbsp;{
                            this.props.user.point
                        }
                    </div>
                    <div>
                        {'已消费：'}
                        {(this.props.user.paid / 100).toFixed(2)}
                    </div>
                </div>
            </div>
        ) : (
            this.state.editor
        );

    render() {
        return (
            <Card
                hoverable={true}
                cover={this.avatar(this.props.user.avatar)}
                style={{ width: this.props.width, cursor: 'auto', color: 'whitesmoke' }}
                actions={this.actions()}
            >
                <Card.Meta
                    title={this.cardTitle()}
                    description={this.cardDesc()}
                />
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.loginReducer.user,
        isAuthed: state.loginReducer.isAuthed
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCurrentUser: () => dispatch(getCurrentUser()),
        update: user => dispatch(update(user)),
        logout: () => dispatch(logout()),
        route: (key, isAuthed) => dispatch(route(key, isAuthed))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyInfoCard);
