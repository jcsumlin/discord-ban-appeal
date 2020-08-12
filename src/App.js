import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Home from "./Components/Home";
import Callback from "./Components/Callback";
import Form from "./Components/Form";
import {Redirect} from "react-router-dom";
import logo from "./Images/header.jpg";
import Grid from "@material-ui/core/Grid";
import Success from "./Components/Success";
import Error from "./Components/Error";
import PageNotFoundError from "./Components/404";
import Helmet from "react-helmet";
import Icon from "./Images/header.jpg"

const axios = require("axios")

const DiscordOauth2 = require("discord-oauth2");


function App() {
    let title;
    let icon;
    let guild_info = getGuildInfo()
    if (guild_info) {
        title = guild_info.name
        icon = guild_info.icon

    } else {
        alert("Unable to fetch server from API. Please check all your environment variables.")
        title = "N/A"
        icon = "https://discord.com/assets/fe557f8b82e9d856daa84c6da9071985.png"
    }
    return (
        <Router className="App">
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{`${title} Discord Ban Appeal Application`}</title>
                <link rel="icon" href={Icon} type="image/x-icon"/>
            </Helmet>
            <Box maxWidth="sm" className="background">
                <Grid container spacing={4} style={{margin: "50px 0"}}>
                    <Grid item style={{backgroundColor: "#23272a"}} xs={12}>
                        <img alt={title + " Discord Icon"} src={icon} className={"icon"} height={150}/>
                        <h1>{title} Discord Ban Appeal System</h1>
                    </Grid>
                </Grid>
                <Switch>
                    <Route path="/" exact>
                        <Home/>
                    </Route>
                    <Route path="/callback" exact>
                        <Callback/>
                    </Route>
                    <Route path="/404" render={(props) => <Error {...props}/>}/>

                    <PrivateRoute path="/form" exact>
                        <Form/>
                    </PrivateRoute>
                    <PrivateRoute path="/success" exact>
                        <Success/>
                    </PrivateRoute>
                    <Route path="*" component={PageNotFoundError}/>

                </Switch>
            </Box>
        </Router>
    );
}

function getGuildInfo() {
    axios.get(window.location.origin + "/.netlify/functions/guild")
        .then((response) => {
            if (response.success) {
                let icon = `https://cdn.discordapp.com/icons/${process.env.REACT_APP_GUILD_ID}/${response.guild_icon}.png`
                return {name: response.guild_name, icon: icon}
            } else return false;
        })
}

function PrivateRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({location}) =>
                localStorage.getItem("access_token") ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}

export default App;

export const oauth = new DiscordOauth2({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: window.location.origin + "/callback",
});
