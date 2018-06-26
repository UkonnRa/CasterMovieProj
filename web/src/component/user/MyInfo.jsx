import React, {Component} from 'react'
import {Button, Divider, Icon, Input, InputNumber, Modal} from 'antd'
import {connect} from "react-redux";
import {getCurrentUser, logout, update} from "../../redux/auth/actions";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";
import {Api} from "../../api";
import axios from 'axios'
import {Level} from "../../model/user";

class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changeName: false,
            changePassword: false,
            name: "",
            money: 0,
        }
    }

    componentWillMount = () => {
        this.props.getCurrentUser()
    };

    emitEmpty = () => {
        this.nameInput.focus();
        this.setState({name: ''});
    };
    onChangeName = (e) => {
        this.setState({name: e.target.value})
    };

    onFinishNewName = (e) => {
        this.props.update({
            ...this.props.user,
            name: e.target.value
        }).then(() => {
            alert("修改成功");
            this.setState({changeName: false})
        }).catch(err => alert(err))
    };

    onFinishNewPassword = (e) => {
        this.props.update({
            ...this.props.user,
            password: e.target.value
        }).then(() => {
            alert("修改成功，请用新密码登陆");
            this.setState({changePassword: false});
            this.props.route(RouteTable.CUSTOMER.Main.path, this.props.isAuthed)
            this.props.logout();
        }).catch(err => alert(err))
    };

    showRecharge = () => Modal.confirm({
        title: "充值",
        content: <div><InputNumber ref={node => this.recharge = node} min={0} step={0.1}
                                 onChange={v => this.setState({money: Number(v) * 100})}/>元</div>,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
            console.log(this.state.money)
            axios.post(Api.user.recharge,
                {id: this.props.user.id, money: this.state.money},
                {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`

                    }
                }
            )
                .then(userData => {
                    if (userData.data.value) {
                        alert("充值成功")
                    } else {
                        alert(`充值失败，${userData.data.message}`)
                    }
                }).catch(err => alert(err))
        },
        onCancel: () => {
        }
    })


    showDeleteConfirm = () => {
        const {id} = this.props.user;
        const {isAuthed, logout, route} = this.props;
        Modal.confirm({
            title: '你确定要删除该用户么，删除后不可恢复',
            content: '删除该用户会删除您所有的财务、订单记录，您确定要删除么？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                axios.post(Api.user.cancelUser,
                    {"id": id},
                    {
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`
                        }
                    })
                    .then(userData => {
                        console.log(userData);
                        if (userData.data.value) {
                            logout();
                            route(RouteTable.CUSTOMER.Main.path, isAuthed);
                            alert("该用户已删除，马上跳转至登录界面")
                        } else {
                            alert(userData.data.message)
                        }
                    }).catch(err => alert(err))

            },
            onCancel() {
            },
        });
    };

    render() {
        const {name} = this.state;
        const suffix = name ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return (
            <div>
                <Divider>用户信息</Divider>
                <p>E-Mail：{this.props.user.id}<Button style={{border: 'none'}}
                                                          onClick={() => this.setState({changePassword: !this.state.changePassword})}>{this.state.changePassword ? "取消修改" : "修改密码"}</Button>
                </p>
                {!this.state.changePassword ? null :
                    <p>
                        <Input
                            placeholder="输入密码"
                            type="password"
                            onPressEnter={this.onFinishNewPassword}
                            onBlur={this.onFinishNewPassword}/>
                    </p>}
                <p>昵称：{
                    !this.state.changeName ? this.props.user.name :
                        <Input
                            placeholder="输入昵称"
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            suffix={suffix}
                            value={name}
                            onChange={this.onChangeName}
                            ref={node => this.nameInput = node}
                            onPressEnter={this.onFinishNewName}
                            onBlur={this.onFinishNewName}
                            style={{width: "200 px"}}
                        />
                } <Button style={{border: 'none'}}
                          onClick={() => this.setState({changeName: !this.state.changeName})}>{this.state.changeName ? "取消修改" : "修改昵称"}</Button>
                </p>
                <p>消费金额：{(this.props.user.paid / 100).toFixed(2)}元<Button onClick={this.showRecharge}>充值</Button></p>
                <p>积分：{this.props.user.point}</p>
                <p>等级：{Level[this.props.user.level].tag}</p>
                <Button type="danger" onClick={this.showDeleteConfirm}>删除用户</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.loginReducer.user,
        isAuthed: state.loginReducer.isAuthed,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getCurrentUser: () => dispatch(getCurrentUser()),
        update: (user) => dispatch(update(user)),
        logout: () => dispatch(logout()),
        route: (key, isAuthed) => dispatch(route(key, isAuthed)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyInfo)
