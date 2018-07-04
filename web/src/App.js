import React, {Component} from 'react';
import {Avatar, Col, Dropdown, Input, Layout, Menu, message, Popover, Row} from 'antd';
import EntryForm from './component/EntryForm';
import Main from './component/user/Main';
import {route} from './redux/ui/actions';
import {connect} from 'react-redux';
import {mainComponent, RouteTable} from './route';
import {getCurrentUser, logout} from './redux/auth/actions';
import {changeLocation} from "./redux/location/actions";
import {Role} from './model/user';
import _ from 'lodash';
import 'react-area-linkage/dist/index.css'; // v2 or higher
import {pcaa} from "area-data";
import {AreaCascader} from 'react-area-linkage';
import './App.css'
import {PREPARE_SIGN_IN} from "./redux/entry/actions";

const { Header, Content, Footer } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comp: <Main />
        };
    }

    componentWillMount = () => {
        if (_.isEmpty(this.props.itemKey)) {
            this.props.route(
                RouteTable[
                    _.isEmpty(this.props.user.role) ? Role.CUSTOMER : this.props.user.role
                ].Main.path,
                this.props.isAuthed
            );
        } else {
            this.props.route(this.props.itemKey, this.props.isAuthed);
        }
    };

    onMenuClick = (e) => {
        console.log(e.key);
        if (e.key.toString() === "logout") {
            this.props.route(RouteTable.CUSTOMER.Main.path, this.props.isAuthed);
            message.info("登出成功，返回主页");
            this.props.logout();
        } else if (e.key.toString() === "login"){
            this.props.showSignInForm();
        } else {
            this.props.route(e.key.toString(), this.props.isAuthed);
        }
    };

    onRegionCodeChange = code => {
        console.log(code);
        this.props.changeLocation(code[2]);
    };

    loginMenu = (menu) => this.props.isAuthed? <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="#">
            <Avatar
                size="large"
                src={this.props.user.avatar}
                shape="square"
                style={{ color: 'rgb(0, 54, 104)', marginLeft: '10px' }}
            />
        </a>
    </Dropdown>: <Menu
        onClick={this.onMenuClick}
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}>
        <Menu.Item key="login">登录</Menu.Item>
    </Menu>;

    render = () => {
        const menu = <Menu
            onClick={this.onMenuClick}
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}>
                <Menu.Item key="MyInfo">我的信息</Menu.Item>
                <Menu.Item key="logout">退出登录</Menu.Item>
        </Menu>;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                {!this.props.isAuthed ? (
                    <EntryForm visible={this.props.modalVisible} />
                ) : null}
                {/*<FrameSider />*/}
                <Layout>
                    <Header>
                        <Row>
                            <Col span={4}>
                                    <Popover placement="bottomLeft" content={<AreaCascader onChange={this.onRegionCodeChange} defaultArea={['110000','110100','110101']} level={1} type='all' data={pcaa}/>}>
                                        <div className="app-menu-location-popover">{Object.values(this.props.location)[0]}</div>
                                    </Popover>
                            </Col>
                            <Col span={12}>
                                <Menu
                                    onClick={this.onMenuClick}
                                    theme="dark"
                                    mode="horizontal"
                                    defaultSelectedKeys={['Main']}
                                    style={{ lineHeight: '64px' }}>
                                    <Menu.Item className="app-menu-item" key="Main">主页</Menu.Item>
                                    <Menu.Item className="app-menu-item" key="ShowList">剧集列表</Menu.Item>
                                </Menu>
                            </Col>
                            <Col span={6}>
                                <Input.Search
                                    placeholder="请输入关键词"
                                    onSearch={value => console.log(value)}/>
                            </Col>
                            <Col span={2}>
                                { this.loginMenu(menu) }
                            </Col>
                        </Row>

                    </Header>
                    <Content style={{ margin: '0 16px', marginTop: 80 }}>
                        <div
                            style={{
                                padding: 24,
                                background: '#fff',
                                textAlign: 'center'
                            }}
                        >
                            {mainComponent(this.props)}

                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        CasterKKK 2018
                    </Footer>
                </Layout>
            </Layout>
        );
    };
}

const mapStateToProps = state => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
        itemKey: state.routeReducer.key,
        location: state.locationReducer.location
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showSignInForm: () => dispatch({ type: PREPARE_SIGN_IN }),
        logout: () => dispatch(logout()),
        changeLocation: (location) => dispatch(changeLocation(location)),
        getCurrentUser: () => dispatch(getCurrentUser()),
        route: (key, isAuthed, role = Role.CUSTOMER) =>
            dispatch(route(key, isAuthed, role))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
