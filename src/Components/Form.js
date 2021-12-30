import React, {Component} from 'react';
import {oauth} from "../App"
import '../App.css';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";
import Question from "./Question";
import {createJwt} from "../Helpers/jwt-helpers";
import config from "../config.json"
import HCaptcha from '@hcaptcha/react-hcaptcha';
import ReactGA from "react-ga";

const axios = require("axios")
let questions = require('../custom-questions.json');


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            avatar_url: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png",
            user: {id: null, avatar: null, username: null, discriminator: null, email: null},
            notBanned: false,
            blocked: false,
            form: [],
            token: ""
        }
        this.updateState = this.updateState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateState(e) {
        let form = this.state.form
        var existing = false;
        for (let i = 0; i < form.length; i++) {
            if (form[i].id === e.target.id) {
                existing = true
                form[i].answer = e.target.value
                break
            }
        }
        if (existing === false) {
            let question = {
                id: e.target.id,
                question: e.target.name,
                answer: e.target.value
            }
            form.push(question)
        }
        this.setState({form: form});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (process.env.REACT_APP_ENABLE_HCAPTCHA === "true" && this.state.token === "") {
            return alert("You must complete hCaptcha to submit this form")
        }
        let user_info = {
            username: this.state.user.username,
            user_id: this.state.user.id,
            email: this.state.user.email,
            user_discriminator: this.state.user.discriminator,
            avatar_url: this.state.user.avatar_url
        };
        let unbanUrl = window.location.origin + "/.netlify/functions/unban";
        let denyAndBlockUrl = window.location.origin + "/.netlify/functions/reject-and-block";
        let data = {
            form: this.state.form,
            unban_url: unbanUrl,
            deny_and_block_url: denyAndBlockUrl,
            hCaptcha: {
                token: this.state.token
            }
        }
        let auth_header = createJwt(user_info)
        axios.post('/.netlify/functions/send_appeal', data, {headers: {"Authorization": auth_header}})
            .then((res) => {
                this.setState({success: res.data.success})
            })
            .catch((e) => {
                alert(e.response.data.error)
            })
            .finally(() => {
                ReactGA.event({
                    category: "Submit Ban Appeal",
                    action: "User submitted a ban appeal",
                });
            })
    }

    componentDidMount() {
        oauth.getUser(localStorage.getItem("access_token"))
            .then(user => {
                if (config.blocked_users.includes(user.id)) {
                    return this.setState({blocked: true})
                }
                ReactGA.set({
                    userId: user.id,
                })
                return user
            })
            .then((user) => {
                if (process.env.REACT_APP_SKIP_BAN_CHECK === "false") {
                    axios.get("/.netlify/functions/user-checks?user_id=" + user.id)
                        .then((response) => {
                            if (!response.data.is_banned) {
                                this.setState({notBanned: true})
                            }
                        })
                }
                this.setState({user: user})
                if (this.state.user.avatar) {
                    this.setState({avatar_url: "https://cdn.discordapp.com/avatars/" + this.state.user.id + "/" + this.state.user.avatar + ".png"})
                }
            });
    }

    handleVerificationSuccess(token) {
        return this.setState({token: token})
    }

    handleExpiration() {
        return this.setState({token: ""})
    }

    render() {
        if (this.state.success) {
            return <Redirect to='/success'/>;
        }
        if (this.state.notBanned) {
            return <Redirect to={{
                pathname: '/404',
                state: {errorCode: '403', errorMessage: "It looks like you're not banned... yet..."}
            }}/>;
        }
        if (this.state.blocked) {
            return <Redirect to={{
                pathname: '/404',
                state: {errorCode: '403', errorMessage: "You have been blocked from submitting further ban appeals"}
            }}/>;
        }

        return (
            <Grid item xs={12} className={"form"}>
                <Grid
                    container
                    spacing={4}
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Grid item xs={12} className={"avatar"}>
                        <img alt={"Your discord profile"} src={this.state.avatar_url} height={100}/>
                        <h2>{this.state.user.username}#{this.state.user.discriminator}</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={this.handleSubmit} noValidate data-netlify-recaptcha="true" data-netlify="true">
                            <div>
                                {questions ? questions.map((q, index) => {
                                    return <Question question={q.question} characterLimit={q.character_limit}
                                                     index={index} handleChange={this.updateState}/>
                                }) : null}
                                {
                                    process.env.REACT_APP_ENABLE_HCAPTCHA === "true" ?
                                        <HCaptcha
                                            sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                                            onVerify={(token) => this.handleVerificationSuccess(token)}
                                            onExpire={() => this.handleExpiration}/> : null
                                }

                                <Button variant="contained" type={"submit"}>Submit</Button>
                            </div>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Form;
