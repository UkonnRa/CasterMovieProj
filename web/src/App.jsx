import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Input, Affix, Avatar } from 'antd';
import LoginForm from './component/LoginForm'
import { FrameSider } from './component/frame/FrameSider'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Search = Input.Search;

const frame = (Comp) => {
    return class App extends Component {
        state = {
            collapsed: false,
            modalVisible: false,
        };
        onCollapse = (collapsed) => {
            console.log(collapsed);
            this.setState({ collapsed });
        }
        handleCreate = () => {
            const form = this.form;
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }

                console.log('Received values of form: ', values);
                form.resetFields();
                this.setState({ visible: false });
            });
        }
        saveFormRef = (form) => {
            this.form = form;
        }
        handleCancel = (e) => {
            console.log(e);
            this.setState({
                modalVisible: false,
            });
        }
        showModal = () => {
            this.setState({
                modalVisible: true,
            });
        }
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
        }

        render() {
            return (
                <Layout style={{ minHeight: '100vh' }}>
                    <LoginForm
                        ref={this.saveFormRef}
                        visible={this.state.modalVisible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />
                    <FrameSider collapsed={this.state.collapsed} onCollapse={this.onCollapse} />
                    <Layout>
                        <Header style={{ width: '100%', position: 'fixed' }}>
                            <Row>
                                <Col span={8}>
                                    <Menu
                                        theme="dark"
                                        mode="horizontal"
                                        defaultSelectedKeys={['2']}
                                        style={{ lineHeight: '64px' }}>
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
                        <Content style={{ margin: '0 16px', marginTop: 64 }}>
                            <Affix style={{ position: 'fixed', top: '90%', left: '90%' }}>
                                <Avatar size="large" icon="user" onClick={this.showModal} />
                            </Affix>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>User</Breadcrumb.Item>
                                <Breadcrumb.Item>Bill</Breadcrumb.Item>
                            </Breadcrumb>
                            <Comp />
                            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                                Bill is a cat.<br />Bill is a cat.<br />Bill is a cat.<br />
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2016 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            );
        }
    }
}


export default frame;