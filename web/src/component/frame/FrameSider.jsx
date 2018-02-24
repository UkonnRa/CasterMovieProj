import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {collapseSide, expandSide} from "../../redux/ui/frameSider/actions";
import {route} from "../../redux/ui/actions";
import {Role, SiderMap} from "../../model/user"
import {connect} from "react-redux";

const {Sider} = Layout;

class FrameSider extends Component {

    onCollapse = (collapsed) => {
        if (collapsed) this.props.collapseSide();
        else this.props.expandSide()
    };

    onItemClick = (item) => {
        console.log(item.key);
        console.log(this.props.isAuthed);
        console.log(this.props.userRole);
        this.props.route(item.key, this.props.isAuthed, this.props.userRole)
    };

    menuItem = () =>
                this.parseMapToComp(SiderMap[this.props.userRole]);

    parseMapToComp = (map) => {
        return map.map(item => {
            if (item.type === "item")
                return <Menu.Item key={item.key}>
                    <Icon type={item.icon}/>
                    <span>{item.text}</span>
                </Menu.Item>;
            else if (item.type === "subMenu") {
                const title = <span><Icon type={item.icon}/><span>{item.text}</span></span>;
                return <Menu.SubMenu key={item.text} title={title}>
                    {this.parseMapToComp(item.item)}
                </Menu.SubMenu>
            } else return null
        })
    };

    render() {
        return (
            <Sider
                collapsible
                collapsed={this.props.sideCollapsed}
                onCollapse={this.onCollapse}>
                <Menu theme="dark" onClick={this.onItemClick} selectedKeys={[this.props.itemKey]} mode="inline">
                    {this.menuItem()}
                </Menu>
            </Sider>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userRole: state.loginReducer.user.role,
        sideCollapsed: state.siderReducer.sideCollapsed,
        itemKey: state.routeReducer.key,
        isAuthed: state.loginReducer.isAuthed,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        collapseSide: () => dispatch(collapseSide()),
        expandSide: () => dispatch(expandSide()),
        route: (item, isAuthed, role = Role.CUSTOMER) => dispatch(route(item, isAuthed, role))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FrameSider)
