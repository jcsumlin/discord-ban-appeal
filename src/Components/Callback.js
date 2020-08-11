import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {oauth} from"../App"
class Callback extends Component {

    constructor(props) {
        super(props);
        this.state = {logged_in: false}
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search)
        if (params.has('code') && params.has('state')){
            oauth.tokenRequest({
                code: params.get("code"),
                scope: "identify guilds email",
                grantType: "authorization_code",

            }).then((response) => {

                localStorage.setItem("access_token", response.access_token)
                localStorage.setItem("refresh_token", response.refresh_token)
                this.setState({logged_in: true})
            })
        }

    }

    render() {
        return (
            <div>
                {this.state.logged_in ? <Redirect to={{
                    pathname: "/form"
                }} /> : null}
            </div>
        );
    }
}

export default Callback;