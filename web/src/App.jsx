import React, {Component} from 'react';
import {Breadcrumb, Layout} from 'antd';
import LoginForm from './component/LoginForm'
import FrameSider from './component/frame/FrameSider'
import AvatarAffix from './component/frame/AvatarAffix'
import Main from './component/user/Main'
import {route} from "./redux/ui/actions";
import {fadeModal, showModal} from './redux/ui/baseFrame/actions'
import {connect} from 'react-redux'
import {mainComponent, RouteTable} from "./route";
import {getCurrentUser} from "./redux/auth/actions";
import {Role} from "./model/user";
import _ from 'lodash'

const {Header, Content, Footer} = Layout;

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

    componentWillMount = () => {
        if (_.isEmpty(this.props.itemKey)) {
            this.props.route(RouteTable[_.isEmpty(this.props.role) ? Role.CUSTOMER : this.props.role].Main.path, this.props.isAuthed)
        } else {
            this.props.route(this.props.itemKey, this.props.isAuthed)
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
                                        <Breadcrumb.Item>{RouteTable[this.props.role][_.isEmpty(this.props.itemKey)? 'Main': this.props.itemKey].text}</Breadcrumb.Item> :
                                        <Breadcrumb.Item>{RouteTable[this.props.role][this.props.itemKey.split("#")[0]].text}</Breadcrumb.Item>
                            }
                        </Breadcrumb>
                        <div style={{padding: 24, background: '#fff', textAlign: 'center'}}>

                            {mainComponent(this.props)}

                            <AvatarAffix style={{position: 'fixed', top: '90%', left: '90%'}}
                                         onAvatarClick={this.onAvatarClick}/>
                        </div>
                    </Content>

                    <Header style={{width: '100vw', position: 'fixed'}}/>
                    <Footer style={{textAlign: 'center'}}>
                        CasterKKK 2018
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
        route: (key, isAuthed, role = Role.CUSTOMER) => dispatch(route(key, isAuthed, role))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


