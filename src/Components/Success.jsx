import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";

class Success extends Component {
    render() {
        return (
            <Grid item xs={12}>
                <h1 style={{textAlign: "center", color: "#57d287"}}>Success! Your ban appeal has been submitted to the mods!</h1>
                <h4 style={{textAlign: "center", color: "#FFFFFF"}}>Please allow some time for them to review your appeal. Abusing this system will result in a perma-ban.</h4>
            </Grid>
        );
    }
}

export default Success;