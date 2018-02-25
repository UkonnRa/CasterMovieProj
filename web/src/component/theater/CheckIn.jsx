import React, {Component} from "react";
import {connect} from "react-redux";
import {Input} from 'antd'
import axios from 'axios'
import {Api} from "../../api";

class CheckIn extends Component {

    onCheckIn = async (value) => {
        if (value) {
            const orderData = await axios.post(Api.order.checkIn,
                {theaterId: this.props.user.id, orderId: value});
            if (orderData.data.value) {
                alert("检票成功");
                this.search.value = ""
            } else {
                alert(`检票出错：${orderData.data.message}`)
            }
        } else {
            alert("订单号不能为空")
        }
    };

    render = () => <div>
        <Input.Search
            placeholder="请输入订单号"
            onSearch={this.onCheckIn}
            style={{width: 200}}
            ref={node => this.search = node}
        />
    </div>
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
    }
};

export default connect(mapStateToProps)(CheckIn)


