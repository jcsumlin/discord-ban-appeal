import React, {Component} from 'react';
import {oauth} from "../App"
import '../App.css';
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";
import {createJwt} from "../Helpers/jwt-helpers";
import config from "../config.json"

const axios = require("axios")


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            avatar_url: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png",
            user: {id: null, avatar: null, username: null, discriminator: null, email: null},
            notBanned: false,
            blocked: false,
        }

        this.updateState = this.updateState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    updateState(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let user_info = {
            username: this.state.user.username,
            user_id: this.state.user.id,
            email: this.state.user.email,
            user_discriminator: this.state.user.discriminator,
            avatar_url: this.state.user.avatar_url
        };
        let unbanUrl = window.location.origin + "/.netlify/functions/unban";
        let data = {
            ban_reason: this.state.ban_reason,
            unban_reason: this.state.unban_reason,
            future_behavior: this.state.future_behavior,
            unban_url: unbanUrl
        }
        let auth_header = createJwt(user_info)
        console.log(auth_header)
        axios.post('/.netlify/functions/send_appeal', data, {headers: {"Authorization": auth_header}})
            .then((res) => {
                this.setState({success: res.data.success})
            })
            .catch(alert)
    }

    componentDidMount() {
        oauth.getUser(localStorage.getItem("access_token"))
            .then(user => {
                if (config.blocked_users.includes(user.id)) {
                    return this.setState({blocked: true})
                }
                return user
            })
            .then((user) => {
                if (!process.env.REACT_APP_SKIP_BAN_CHECK) {
                    axios.get("/.netlify/functions/user-checks?user_id=" + user.id).then((response) => {
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
                        <form onSubmit={this.handleSubmit} noValidate>
                            <div>
                                <InputLabel htmlFor="why-ban">Why were you banned?</InputLabel>
                                <TextField onChange={this.updateState} variant="outlined" className={"textarea"}
                                           id="why-ban" name="ban_reason" aria-describedby="my-helper-text" fullWidth
                                           multiline rows={4}/>
                                <InputLabel htmlFor="why-unban">Why do you feel you should be unbanned?</InputLabel>
                                <TextField onChange={this.updateState} variant="outlined" className={"textarea"}
                                           id="why-unban" name="unban_reason" aria-describedby="my-helper-text"
                                           fullWidth
                                           multiline rows={4}/>
                                <InputLabel htmlFor="avoid-ban">What will you do to avoid being banned in the
                                    future?</InputLabel>
                                <TextField onChange={this.updateState} variant="outlined" className={"textarea"}
                                           id="avoid-ban" aria-describedby="my-helper-text" name="future_behavior"
                                           fullWidth
                                           multiline rows={4}/>
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
