import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Error extends Component {
    render() {
        return (
            <div>
                <h1>Error {this.props.location.state.errorCode}!</h1>
                {this.props.location.state.errorMessage ? <h2>{this.props.location.state.errorMessage}</h2>: null}
                <Link to="/">Return Home</Link>
            </div>
        );
    }
}

export default Error;