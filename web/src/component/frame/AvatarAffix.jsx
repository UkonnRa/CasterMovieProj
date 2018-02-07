import React, {Component} from 'react';
import {Affix, Avatar, Popover} from 'antd';
import {connect} from 'react-redux'

import {fadePopover, showPopover} from '../../redux/ui/avatarAffix/actions'

class AvatarAffix extends Component {

    onAvatarClickInner = () => {
        this.props.onAvatarClick();
        if (this.props.isAuthed) this.props.showPopover()
    };

    onPopoverVisibleChange = (visible) => {
        if (!visible) this.props.fadePopover()
    };

    render() {
        return (
            <Popover visible={this.props.popoverVisible} trigger="click" title="title"
                     onVisibleChange={this.onPopoverVisibleChange}
            >
                <Affix style={this.props.style}>
                    <Avatar size="large" icon={this.props.isAuthed ? null : "user"} onClick={this.onAvatarClickInner}>
                        {this.props.isAuthed ? this.props.username : null}
                    </Avatar>
                </Affix>
            </Popover>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        username: state.loginReducer.username,
        popoverVisible: state.popoverReducer.popoverVisible
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showPopover: () => dispatch(showPopover()),
        fadePopover: () => dispatch(fadePopover())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AvatarAffix)

