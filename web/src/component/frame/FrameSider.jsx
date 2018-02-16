import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {collapseSide, expandSide, chooseSiderMenu} from "../../redux/ui/frameSider/actions";
import {Role, SiderMap} from "../../model/user"
import {connect} from "react-redux";

const {Sider} = Layout;

class FrameSider extends Component {

    onCollapse = (collapsed) => {
        if (collapsed) this.props.collapseSide();
        else this.props.expandSide()
    };

    onItemClick = (item) => {
        this.props.chooseSiderMenu(item.key)
    };

    menuItem = () => {
        switch (this.props.userRole) {
            case Role.CUSTOMER:
            default:
                return this.parseMapToComp(SiderMap.customer)
        }
    };

    parseMapToComp = (map) => {
        return map.map(item => {
            if (item.type === "item")
                return <Menu.Item key={item.key}>
                    <Icon type={item.icon}/>
                    <span>{item.text}</span>
                </Menu.Item>;
            else if (item.type === "subMenu") {
                const title = <span><Icon type={item.icon}/><span>{item.text}</span></span>;
                return <Menu.SubMenu key={item.key} title={title}>
                    {this.parseMapToComp(item.item)}
                </Menu.SubMenu>
            }
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
        itemKey: state.siderReducer.key
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        collapseSide: () => dispatch(collapseSide()),
        expandSide: () => dispatch(expandSide()),
        chooseSiderMenu: (item) => dispatch(chooseSiderMenu(item))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FrameSider)
