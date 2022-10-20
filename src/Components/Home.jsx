import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { oauth } from "../App"
import {ReactComponent as DiscordLogo} from '../Images/Discord-Logo-White.svg';


const crypto = require('crypto');

class Home extends Component {
    render() {
        const url = oauth.generateAuthUrl({
            scope: ["identify", "email"],
            state: crypto.randomBytes(16).toString("hex"), // Be aware that randomBytes is sync if no callback is provided
        });
        return (
            <Grid container alignItems="center" direction="column">
                <Grid item xs={12}>
                    <Button
                        startIcon={<DiscordLogo height={25} width={25} />}
                        href={url}
                        size={"large"}>
                        Login with Discord
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default Home;