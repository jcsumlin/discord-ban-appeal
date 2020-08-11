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

const DiscordOauth2 = require("discord-oauth2");


function App() {
    return (
        <Router className="App">
            <Box maxWidth="sm" className="background">
                <Grid container spacing={4} style={{margin: "50px 0"}}>
                    <Grid item style={{backgroundColor: "#23272a"}} xs={12}>
                        <img alt="r/TunicTheGame Discord Icon" src={logo} className={"icon"} height={150}/>
                        <h1>r/TunicTheGame Discord Ban Appeal System</h1>
                    </Grid>
                </Grid>
                <Switch>
                    <Route path="/" exact>
                        <Home/>
                    </Route>
                    <Route path="/callback" exact>
                        <Callback/>
                    </Route>
                    <PrivateRoute path="/form" exact>
                        <Form/>
                    </PrivateRoute>
                    <PrivateRoute path="/success" exact>
                        <Success/>
                    </PrivateRoute>
                </Switch>
            </Box>
        </Router>
    );
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
