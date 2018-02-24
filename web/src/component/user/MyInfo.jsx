import React, {Component} from 'react'
import {Button, Divider, Icon, Input} from 'antd'
import {connect} from "react-redux";
import {getCurrentUser, logout, update} from "../../redux/auth/actions";
import {RouteTable} from "../../route";
import {route} from "../../redux/ui/actions";

class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changeName: false,
            changePassword: false,
            name: "",
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
            this.props.logout();
            this.props.route(RouteTable.CUSTOMER.Main.path, this.props.isAuthed)
        }).catch(err => alert(err))
    };


    render() {
        const {name} = this.state;
        const suffix = name ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return (
            <div>
                <Divider>用户信息</Divider>
                用户名： {this.props.user.username}
                <Button style={{border: 'none'}}
                        onClick={() => this.setState({changePassword: true})}>修改密码</Button>
                <br/>
                {!this.state.changePassword ? null :
                    <div>
                        <Input
                            placeholder="输入密码"
                            onPressEnter={this.onFinishNewPassword}/>
                        <br/>
                    </div>}
                昵称：{
                !this.state.changeName ? this.props.user.name :
                    <Input
                        placeholder="输入昵称"
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        suffix={suffix}
                        value={name}
                        onChange={this.onChangeName}
                        ref={node => this.nameInput = node}
                        onPressEnter={this.onFinishNewName}/>
            } <Button style={{border: 'none'}}
                      onClick={() => this.setState({changeName: true})}>修改昵称</Button>
                <br/>
                E-Mail：{this.props.user.email}
                <br/>
                消费金额：{this.props.user.paid}
                <br/>
                积分：{this.props.user.point}
                <br/>
                等级：{this.props.user.level}
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
