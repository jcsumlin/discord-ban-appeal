import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import {useLocation} from "react-router-dom";

const UnBanError = () => {
    const query = new URLSearchParams(useLocation().search);
    const msg = query.get("msg");
    return (
        <Grid item>
            <h1 style={{textAlign: "center", color: "#e60008"}}>Error! Something went wrong.</h1>
            <h4>{msg}</h4>
        </Grid>
    )
}

export default UnBanError;
