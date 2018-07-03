import React from 'react';
import {Layout} from 'antd';
import MyInfoCard from './MyInfoCard';
import MyOrder from './MyOrder';
import {connect} from 'react-redux';

class MyInfo extends React.Component {
    render() {
        return (
            <Layout style={{padding: '5px'}}>
                <Layout.Sider width='18vw' style={{backgroundColor: "#f0f2f5"}}>
                    <MyInfoCard width='18vw'/>
                </Layout.Sider>
                <Layout.Content style={{padding: '0px 16px 0px'}}>
                    <MyOrder />
                </Layout.Content>
            </Layout>
        );
    }
}

export default connect()(MyInfo);
