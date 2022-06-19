import React, { Component } from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress, Icon } from "@material-ui/core";
import { PlayArrow, SkipNext, Pause } from "@material-ui/icons";

export default class MusicPlayer extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        const songPress = (this.props.time / this.props.duration) * 100;
        return(
        <Card>
            <Grid container alignItems='center'>
                <Grid item align="center" xs={4}>
                    <img src={this.props.image_url} height="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {this.props.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {this.props.artist}
                    </Typography>
                    <div>
                        <IconButton>
                            {this.props.is_playing? <Pause />:<PlayArrow />}
                        </IconButton>
                        <IconButton>
                            <SkipNext/>
                        </IconButton>
                    </div>    
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songPress} />
        </Card>
        )
    }

}