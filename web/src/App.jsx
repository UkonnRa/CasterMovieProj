import React, {Component} from 'react';
import {Breadcrumb, Col, Input, Layout, Menu, Row} from 'antd';
import LoginForm from './component/LoginForm'
import {FrameSider} from './component/frame/FrameSider'
import AvatarAffix from './component/frame/AvatarAffix'
import {fadeModal, showModal} from './redux/ui/baseFrame/actions'
import {connect} from 'react-redux'

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const Search = Input.Search;

const BaseFrame = (Comp) => {
    class App extends Component {
        state = {
            collapsed: false,
            // modalVisible: false,
            // popoverVisible: false
        };
        onCollapse = (collapsed) => {
            console.log(collapsed);
            this.setState({collapsed});
        };
        handleCancel = (e) => {
            console.log(e);
            // this.setState({
            //     modalVisible: false,
            // });
            this.props.fadeModal()
        };

        onAvatarClick = () => {
            if (!this.props.isAuthed) {
                // this.setState({modalVisible: true})
                this.props.showModal()
            }
        };

        render() {
            return (
                <Layout style={{minHeight: '100vh'}}>
                    {!this.props.isAuthed ? (
                        <LoginForm
                            visible={this.props.modalVisible}
                            onCancel={this.handleCancel}
                        />) : null}
                    <FrameSider collapsed={this.state.collapsed} onCollapse={this.onCollapse}/>
                    <Layout>
                        <Header style={{width: '100%', position: 'fixed'}}>
                            <Row>
                                <Col span={8}>
                                    <Menu
                                        theme="dark"
                                        mode="horizontal"
                                        defaultSelectedKeys={['2']}
                                        style={{lineHeight: '64px'}}>
                                        <Menu.Item key="1">nav 1</Menu.Item>
                                        <Menu.Item key="2">nav 2</Menu.Item>
                                        <Menu.Item key="3">nav 3</Menu.Item>
                                    </Menu>
                                </Col>
                                <Col span={4} offset={8}>
                                    <Search
                                        placeholder="input search text"
                                        onSearch={value => console.log(value)}
                                        enterButton
                                    />
                                </Col>
                            </Row>
                        </Header>
                        <Content style={{margin: '0 16px', marginTop: 64}}>
                            <AvatarAffix style={{position: 'fixed', top: '90%', left: '90%'}}
                                         onAvatarClick={this.onAvatarClick}/>
                            <Breadcrumb style={{margin: '16px 0'}}>
                                <Breadcrumb.Item>User</Breadcrumb.Item>
                                <Breadcrumb.Item>Bill</Breadcrumb.Item>
                            </Breadcrumb>
                            <Comp/>
                            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                                Bill is a cat.<br/>Bill is a cat.<br/>Bill is a cat.<br/>
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            Ant Design ©2016 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            );
        }
    }

    const mapStateToProps = (state) => {
        return {
            isAuthed: state.loginReducer.isAuthed,
            username: state.loginReducer.username,
            role: state.loginReducer.userRole,
            modalVisible: state.modalReducer.modalVisible
        }
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            showModal: () => dispatch(showModal()),
            fadeModal: () => dispatch(fadeModal())
        }
    };

    return connect(mapStateToProps, mapDispatchToProps)(App);
};

export default BaseFrame


