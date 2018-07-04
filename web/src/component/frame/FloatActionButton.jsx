import React from 'react';
import {Affix, Avatar, Button, Icon, Popover} from 'antd';
import {connect} from 'react-redux';
import {findAllByUserId} from '../../redux/order/actions';
import {PREPARE_SIGN_UP} from '../../redux/entry/actions';
import UserPopoverContent from '../user/PopoverContent';
import {Role} from '../../model/user';

class FloatActionButton extends React.Component {
    render() {
        const functionComp = this.props.isAuthed ? (
            <Popover
                trigger="click"
                title={this.props.user.username}
                content={<UserPopoverContent />}
            >
                <Avatar
                    size="large"
                    src={this.props.user.avatar}
                    shape="square"
                    style={{ color: 'rgb(0, 54, 104)' }}
                    onClick={
                        this.props.user.role === Role.CUSTOMER
                            ? () =>
                                  this.props.findAllByUserId(this.props.user.id)
                            : null
                    }
                />
            </Popover>
        ) : (
            <Button.Group size="large">
                <Button
                    size="large"
                    type="dashed"
                    onClick={this.props.showSignUpForm}
                >
                    <Icon type="user-add" />注册
                </Button>

                <Button
                    size="large"
                    type="primary"
                    onClick={this.props.showSignInForm}
                >
                    <Icon type="login" />登录
                </Button>
            </Button.Group>
        );

        return (
            <Affix
                style={{
                    position: 'fixed',
                    top: '88%',
                    left: this.props.isAuthed ? '90%' : '82%'
                }}
            >
                {functionComp}
            </Affix>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showSignUpForm: () => dispatch({ type: PREPARE_SIGN_UP }),
        findAllByUserId: userId => dispatch(findAllByUserId(userId))
    };
};

const mapStateToProps = state => {
    return {
        user: state.loginReducer.user,
        isAuthed: state.loginReducer.isAuthed
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FloatActionButton);