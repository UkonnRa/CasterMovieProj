import React from 'react';
import { connect } from 'react-redux';
import { Modal, Tabs } from 'antd';
import { Role } from '../model/user';
import LoginForm from './SignInForm';
import CustomerSignUpForm from './CustomerSignUpForm';
import TheaterSignUpForm from './TheaterSignUpForm';
import {
    HIDE_ENTRY_FORM,
    PREPARE_SIGN_IN,
    PREPARE_SIGN_UP
} from '../redux/entry/actions';

class EntryForm extends React.Component {
    state = {
        role: Role.CUSTOMER
    };

    render() {
        const switchLink =
            this.props.intention === 'SIGN_UP' ? (
                <div>
                    <span>已有账号？</span>
                    <a
                        onClick={e => {
                            e.preventDefault();
                            this.props.switchToSignIn();
                        }}
                    >
                        现在登录→
                    </a>
                </div>
            ) : (
                <div>
                    <a
                        onClick={e => {
                            e.preventDefault();
                            this.props.switchToSignUp();
                        }}
                    >
                        现在注册→
                    </a>
                </div>
            );

        return (
            <Modal
                bodyStyle={{ padding: '6px 24px 24px' }}
                onCancel={this.props.hide}
                visible={this.props.visible}
                footer={null}
                closable={true}
                title={this.props.intention === 'SIGN_UP' ? '注册' : '登录'}
                style={{
                    top: this.props.intention === 'SIGN_UP' ? '2%' : '20%'
                }}
            >
                <Tabs
                    animated={false}
                    size="small"
                    onChange={role => {
                        this.setState({ role });
                    }}
                    tabBarStyle={{
                        margin: `0 0 ${
                            this.state.role === Role.THEATER &&
                            this.props.intention === 'SIGN_UP'
                                ? '0'
                                : '16px'
                        } 0`
                    }}
                >
                    <Tabs.TabPane tab="我是用户" key={Role.CUSTOMER}>
                        {this.props.intention === 'SIGN_UP' ? (
                            <CustomerSignUpForm />
                        ) : (
                            <LoginForm role={Role.CUSTOMER} />
                        )}
                        {switchLink}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="我是场馆经理" key={Role.THEATER}>
                        {this.props.intention === 'SIGN_UP' ? (
                            <TheaterSignUpForm />
                        ) : (
                            <LoginForm role={Role.THEATER} />
                        )}
                        {switchLink}
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        intention: state.entryFormReducer.intention,
        visible: state.entryFormReducer.visible
    };
};

const mapDispatchToProps = dispatch => {
    return {
        hide: () => dispatch({ type: HIDE_ENTRY_FORM }),
        switchToSignIn: () => dispatch({ type: PREPARE_SIGN_IN }),
        switchToSignUp: () => dispatch({ type: PREPARE_SIGN_UP })
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryForm);