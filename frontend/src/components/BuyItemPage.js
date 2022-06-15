import React, { Component } from 'react';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {withRouter} from './withRouter';

class BuyItemPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            code: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.buyButtonPressed = this.buyButtonPressed.bind(this);
    }

    render(){
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Buy a Item
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        error={this.state.error}
                        label="Code"
                        placeholder="Enter a Code"
                        value={this.state.code}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this.buyButtonPressed}>Buy</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        );
    }

    handleTextFieldChange(e){
        this.setState({
            code: e.target.value,
        })
    }

    buyButtonPressed(){
        const requestOptions ={
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: this.state.code
            })
        };
        fetch('/api/buy-item/', requestOptions).then((response) => {
            if (response.ok){
                this.props.navigate(`/item/${this.state.code}`);
            }else{
                this.setState({error: "code not found."});
            }
        }).catch((error) => {
            console.log(error);
        })
    }
}

export default withRouter(BuyItemPage);