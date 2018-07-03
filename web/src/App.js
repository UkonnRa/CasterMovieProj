import React, { Component } from 'react';
import { Layout, Menu, Icon, Row, Col, Input } from 'antd';
import EntryForm from './component/EntryForm';
import FloatActionButton from './component/frame/FloatActionButton';
import Main from './component/user/Main';
import { route } from './redux/ui/actions';
import { connect } from 'react-redux';
import { mainComponent, RouteTable } from './route';
import { getCurrentUser } from './redux/auth/actions';
import { Role } from './model/user';
import _ from 'lodash';

import 'react-area-linkage/dist/index.css'; // v2 or higher
import './App.css'
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
                    _.isEmpty(this.props.role) ? Role.CUSTOMER : this.props.role
                ].Main.path,
                this.props.isAuthed
            );
        } else {
            this.props.route(this.props.itemKey, this.props.isAuthed);
        }
    };

    onCityChange = (value) => {
        console.log(value);
    }

    render = () => {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                {!this.props.isAuthed ? (
                    <EntryForm visible={this.props.modalVisible} />
                ) : null}
                {/*<FrameSider />*/}
                <Layout>
                    <Header>
                        <Row>
                            <Col span={16}>
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    defaultSelectedKeys={['Main']}
                                    style={{ lineHeight: '64px' }}>
                                    <Menu.SubMenu title={<span>南京 <Icon type="down"/></span>}>
                                        <Menu.ItemGroup title="南京">
                                            <Menu.Item key="鼓楼区_320106">鼓楼区</Menu.Item>
                                            <Menu.Item key="栖霞区_320113">栖霞区</Menu.Item>
                                        </Menu.ItemGroup>
                                        <Menu.ItemGroup title="北京">
                                            <Menu.Item key="东城区_110101">东城区</Menu.Item>
                                            <Menu.Item key="西城区_110102">西城区</Menu.Item>
                                        </Menu.ItemGroup>
                                    </Menu.SubMenu>
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
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    style={{ lineHeight: '64px' }}>
                                    <Menu.SubMenu title={<span><Icon className="app-menu-item" style={{marginRight: '0px'}} type="user"/><Icon className="app-menu-item" type="down"/></span>}>
                                            <Menu.Item key="MyInfo">我的信息</Menu.Item>
                                            <Menu.Item key="Logout">退出登录</Menu.Item>
                                    </Menu.SubMenu>
                                </Menu>
                            </Col>
                        </Row>

                    </Header>
                    <Content style={{ margin: '0 16px', marginTop: 80 }}>
                        {/*<Breadcrumb style={{ margin: '0 0 16px' }}>*/}
                            {/*{this.props.itemKey.indexOf('#') === -1 ? (*/}
                                {/*<Breadcrumb.Item>*/}
                                    {/*{*/}
                                        {/*RouteTable[this.props.role][*/}
                                            {/*_.isEmpty(this.props.itemKey)*/}
                                                {/*? 'Main'*/}
                                                {/*: this.props.itemKey*/}
                                        {/*].text*/}
                                    {/*}*/}
                                {/*</Breadcrumb.Item>*/}
                            {/*) : (*/}
                                {/*<Breadcrumb.Item>*/}
                                    {/*{*/}
                                        {/*RouteTable[this.props.role][*/}
                                            {/*this.props.itemKey.split('#')[0]*/}
                                        {/*].text*/}
                                    {/*}*/}
                                {/*</Breadcrumb.Item>*/}
                            {/*)}*/}
                        {/*</Breadcrumb>*/}
                        <div
                            style={{
                                padding: 24,
                                background: '#fff',
                                textAlign: 'center'
                            }}
                        >
                            {mainComponent(this.props)}

                            <FloatActionButton />
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
        username: state.loginReducer.username,
        role: state.loginReducer.user.role,
        itemKey: state.routeReducer.key
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCurrentUser: () => dispatch(getCurrentUser()),
        route: (key, isAuthed, role = Role.CUSTOMER) =>
            dispatch(route(key, isAuthed, role))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
