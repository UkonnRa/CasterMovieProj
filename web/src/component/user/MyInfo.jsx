import React, {Component} from 'react'
import {Button, Divider} from 'antd'
import {connect} from "react-redux";
import {getCurrentUser} from "../../redux/auth/actions";

class MyInfo extends Component {
    componentWillMount = () => {
        this.props.getCurrentUser()
    };

    render() {
        return (
            <div>
                <Divider>用户信息</Divider>
                用户名：{this.props.user.username} <Button style={{border: 'none'}}
                                                       onClick={() => console.log("change password")}>修改密码</Button>
                <br/>
                昵称：{this.props.user.name} <Button style={{border: 'none'}}
                                                  onClick={() => console.log("change name")}>修改昵称</Button>
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getCurrentUser: () => dispatch(getCurrentUser())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyInfo)
