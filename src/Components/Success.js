import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";

class Success extends Component {
    render() {
        return (
            <Grid item>
                <h1 style={{textAlign: "center", color: "#00e676"}}>¡Éxito! ¡Tu apelación ha sido enviada al Staff!</h1>
                <h4>Podrás realizar una apelación cada 30 días, por favor, ten paciencia. En caso de ser aprobada recibirás un email</h4>
            </Grid>
        );
    }
}

export default Success;
