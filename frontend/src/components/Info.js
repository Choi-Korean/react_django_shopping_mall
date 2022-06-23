// 함수형 기반 component

import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext"
import { Link }from "react-router-dom";

// ENM ? 어쨌든 페이지 값 저장해놓는거
const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create',
}

export default function Info(props) {
    const [page, setPage] = useState(pages.JOIN);

    function joinInfo(){    // default fucntion 밖에 정의해도 되지만, 여기에 하는게 좋대. 그 상황에 따라 다른건가. 여기 정의하면 props등 사용 가능
        return "Join page";
    }

    function createInfo(){
        return "Create page";
    }

    useEffect(() => {
        console.log("ran")
        return () => console.log("cleanup");
    });
    
    return (
    <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
                What do you want to buy?
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <Typography variant="body1">
                { page === pages.JOIN? joinInfo() : createInfo() }
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <IconButton onClick={() => {
                page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
            }}>
                {page === pages.CREATE ? <NavigateBeforeIcon/>: <NavigateNextIcon />}
            </IconButton>
        </Grid>
        <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" to="/" component={Link}>
                Back
            </Button>
        </Grid>
    </Grid>
    );
}

