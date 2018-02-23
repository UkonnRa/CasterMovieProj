import React, {Component} from 'react';
import {Breadcrumb, Input, Layout} from 'antd';
import LoginForm from './component/LoginForm'
import FrameSider from './component/frame/FrameSider'
import AvatarAffix from './component/frame/AvatarAffix'
import Main from './component/user/Main'

import {fadeModal, showModal} from './redux/ui/baseFrame/actions'
import {connect} from 'react-redux'
import {route, RouteTable} from "./route";
import {getCurrentUser} from "./redux/auth/actions";
import {LOGIN} from "./redux/auth/types";


const {Header, Content, Footer} = Layout;
const Search = Input.Search;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comp: <Main/>
        }
    }

    handleCancel = () => {
        this.props.fadeModal()
    };

    onAvatarClick = () => {
        if (!this.props.isAuthed) {
            this.props.showModal()
        }
    };

    render = () => {
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
                        <Breadcrumb style={{margin: '0 0 16px'}}>
                            {
                                this.props.itemKey.indexOf("#") === -1 ?
                                    <Breadcrumb.Item>{RouteTable[this.props.role][this.props.itemKey].text}</Breadcrumb.Item> :
                                    <Breadcrumb.Item>{RouteTable[this.props.role][this.props.itemKey.split("#")[0]].text}</Breadcrumb.Item>
                            }
                        </Breadcrumb>
                        <div style={{padding: 24, background: '#fff', textAlign: 'center'}}>

                            {route(this.props)}

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
        role: state.loginReducer.user.role,
        modalVisible: state.modalReducer.modalVisible,
        itemKey: state.routeReducer.key,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showModal: () => dispatch(showModal()),
        fadeModal: () => dispatch(fadeModal()),
        getCurrentUser: () => dispatch(getCurrentUser()),
        loginWithDispatch: (value) => dispatch({type: LOGIN, user: value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


