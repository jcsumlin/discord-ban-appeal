import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {oauth} from"../App"
import { mdiDiscord } from '@mdi/js';
import Icon from "@mdi/react";

const crypto = require('crypto');

class Home extends Component {


    render() {
        const url = oauth.generateAuthUrl({
            scope: ["identify", "guilds"],
            state: crypto.randomBytes(16).toString("hex"), // Be aware that randomBytes is sync if no callback is provided
        });
        return (
            <Grid container alignItems={"center"} justify="center" direction="column">
                <Grid item xs={12}>
                    <Button startIcon={<Icon size={1} path={mdiDiscord}/>} href={url} size={"large"} className={"button"}>Login with Discord</Button>
                </Grid>
            </Grid>
        );
    }
}

export default Home;