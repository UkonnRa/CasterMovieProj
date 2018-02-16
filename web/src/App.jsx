import React, {Component} from 'react';
import {Input, Layout, Menu, Card} from 'antd';
import LoginForm from './component/LoginForm'
import FrameSider from './component/frame/FrameSider'
import AvatarAffix from './component/frame/AvatarAffix'
import {fadeModal, showModal} from './redux/ui/baseFrame/actions'
import {connect} from 'react-redux'
import Main from './component/user/Main'

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const Search = Input.Search;

class App extends Component {
    handleCancel = (e) => {
        console.log(e);
        this.props.fadeModal()
    };

    onAvatarClick = () => {
        if (!this.props.isAuthed) {
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
                <FrameSider/>
                <Layout>

                    <Content style={{margin: '0 16px', marginTop: 80}}>
                        <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                            <Main />

                            <AvatarAffix style={{position: 'fixed', top: '90%', left: '90%'}}
                                         onAvatarClick={this.onAvatarClick}/>
                        </div>
                    </Content>

                    <Header style={{width: '100vw', position: 'fixed'}}>
                        <Search
                            style={{position: 'fixed', top: '15px', left: '80%', width: '15vw'}}
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            enterButton
                        />
                    </Header>
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
        fadeModal: () => dispatch(fadeModal()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


