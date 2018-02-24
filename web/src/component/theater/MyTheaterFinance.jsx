import React, {Component} from "react";
import {connect} from "react-redux";

class MyTheaterFinance extends Component {
    render = () => <div></div>
}

const mapStateToProps = (state) => {
    return {
        isAuthed: state.loginReducer.isAuthed,
        user: state.loginReducer.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTheaterFinance)


