import React, {useEffect, useState} from 'react';
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
import Grid from "@material-ui/core/Grid";
import Success from "./Components/Success";
import Error from "./Components/Error";
import PageNotFoundError from "./Components/404";
import Helmet from "react-helmet";
import Skeleton from '@material-ui/lab/Skeleton';
import {createBrowserHistory} from "history";
import * as ReactGA from "react-ga";
import ErrorPath from "./Components/errorPath";
import SuccessPath from "./Components/successPath";
import Wizard from './Components/Wizard';
import ServerIcon from './Images/ServerIcon.jpg'

const axios = require("axios")

const DiscordOauth2 = require("discord-oauth2");

const history = createBrowserHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
});



function App() {
    const [icon, setIcon] = useState(ServerIcon);
    const [title, setTitle] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get("/.netlify/functions/guild")
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.guild_icon) {
                        setIcon(`https://cdn.discordapp.com/icons/${process.env.REACT_APP_GUILD_ID}/${response.data.guild_icon}.png`)
                    }
                    setTitle(response.data.guild_name)
                    setLoading(false)
                } else {
                    alert("Unable to fetch server from API. Please check all your environment variables.")
                }
            })
    }, [])

    return (
        <Router history={history}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{process.env.REACT_APP_SITE_TITLE ? process.env.REACT_APP_SITE_TITLE : `${title} Discord Ban Appeal Application`}</title>
                <meta name="description"
                      content={process.env.REACT_APP_SITE_DESCRIPTION ? process.env.REACT_APP_SITE_DESCRIPTION : `${title} Discord Ban Appeal Application`}/>
                <link rel="icon" href={icon} type="image/x-icon"/>
            </Helmet>
            <Grid container
                  direction="column"
                  alignItems="center"
            >
                <Grid item xs={12}>
                    <Box style={{backgroundImage: `url(${process.env.REACT_APP_BANNER_URL})`}} className={"banner"}>
                        {loading ? <Skeleton variant={'rect'} height={150} width={150} style={{'margin': '0 auto'}} /> :
                            <img alt={title + " Discord Icon"} src={icon} className="icon" height={150}/>}
                        {loading ? <Skeleton variant={'text'} width={750} height={37}/> : <h1>{title} Discord Ban Appeal System</h1>}
                    </Box>
                </Grid>
                <Switch>
                    <Route path="/wizard" exact>
                        <Wizard/>
                    </Route>
                    <Route path="/" exact>
                        <Home/>
                    </Route>
                    <Route path="/callback" exact>
                        <Callback/>
                    </Route>
                    <Route path="/404" render={(props) => <Error {...props}/>}/>
                    <Route path="/error" exact component={ErrorPath}/>
                    <Route path="/success" exact component={SuccessPath}/>
                    <PrivateRoute path="/form" exact>
                        <Form/>
                    </PrivateRoute>
                    <PrivateRoute path="/submitted" exact>
                        <Success/>
                    </PrivateRoute>
                    <Route path="*" component={PageNotFoundError}/>

                </Switch>
            </Grid>

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
