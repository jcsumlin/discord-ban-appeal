import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";

class UnBanSuccess extends Component {
    render() {
        return (
            <Grid item>
                <h1 style={{textAlign: "center", color: "#00e676"}}>Success! This ban appeal has been approved!</h1>
                <h4>The user has been unbanned from your server{process.env.REACT_APP_ENABLE_SENDGRID ? " and notified via email that they can rejoin with the provided invite" : ""}.</h4>
            </Grid>
        );
    }
}

export default UnBanSuccess;
