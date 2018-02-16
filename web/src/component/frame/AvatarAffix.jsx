import React, {Component} from 'react';
import {Affix, Avatar, Popover} from 'antd';
import {connect} from 'react-redux'
import {findAllByUserId} from "../../redux/order/actions";
import UserPopoverContent from '../user/PopoverContent'
import {fadePopover, showPopover} from '../../redux/ui/avatarAffix/actions'
import {Role} from "../../model/user";
import _ from 'lodash'

class AvatarAffix extends Component {

    onAvatarClickInner = () => {
        this.props.onAvatarClick();
        if (this.props.isAuthed) {
            this.props.showPopover();
            this.props.findAllByUserId(this.props.user.id)
        }
    };

    onPopoverVisibleChange = (visible) => {
        if (!visible) this.props.fadePopover()
    };

    popoverContent = () => {
        if (_.isEmpty(this.props.user) || _.isEmpty(this.props.user.role)) return null;
        switch (this.props.user.role) {
            case Role.CUSTOMER:
            default:
                return <UserPopoverContent/>
        }
    };

    render() {
        return (
            <Popover visible={this.props.popoverVisible} trigger="click" title={this.props.user.username} content={this.popoverContent()}
                     onVisibleChange={this.onPopoverVisibleChange}>
                <Affix style={this.props.style}>
                    <Avatar size="large" icon={this.props.isAuthed ? null : "user"} onClick={this.onAvatarClickInner}>
                        {this.props.isAuthed ? this.props.user.username : null}
                    </Avatar>
                </Affix>
            </Popover>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
        popoverVisible: state.popoverReducer.popoverVisible
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showPopover: () => dispatch(showPopover()),
        fadePopover: () => dispatch(fadePopover()),
        findAllByUserId: (userId) => dispatch(findAllByUserId(userId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AvatarAffix)

