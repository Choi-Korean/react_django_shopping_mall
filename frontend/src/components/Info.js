// 함수형 기반 component
// 현재 존재하는 item 리스트 목록 보여줄 페이지

import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton, Card } from "@material-ui/core";
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
    const initialState = {
        id:0,
        image: null,
        listing_or_not: true,
        showSettings: false,
        like_count: 0,
        created_at: null,
      }
    
    const [items, setItems] = useState([]);

    // const [postData, setPostData] = useState(initialState);

    function joinInfo(){    // default fucntion 밖에 정의해도 되지만, 여기에 하는게 좋대. 그 상황에 따라 다른건가. 여기 정의하면 props등 사용 가능
        return "Join page";
    }

    function createInfo(){
        return "Create page";
    }

    useEffect(() => {
        // renderItemList();
    });

    const getItems = () => {
        fetch('/api/item-list').then((response) => {
          if(!response.ok){
            return{};
          }else{
            return response.json();
          }
        }).then(data => {
            const new_items = [];
            for (var key of data) {
                new_items.push(key);
                // console.log(items.length);
            };

            setItems(new_items);
    
            // initialState.id = data.id;
            // initialState.image = data.image;
            // initialState.listing_or_not = data.listing_or_not;
            // initialState.code = data.code;
            // initialState.like_count = data.like_count;
            // initialState.created_at = data.created_at;
        }
        );
      }

    const renderItemList = () => {
        if(items.length == 0){
            getItems();
        }
        console.log(items);
        const item_list = items.map((item) =>
            <Card>
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h4" componoet="h4">
                        COde: {item.code}
                        </Typography>
                    </Grid>
                    {/* <MusicPlayer {...song}/> */}
                    <Card align="center">
                        <Grid item xs={12} align="center">
                            <img src={item.image} height="100%" width="100%" />
                        </Grid>
                    </Card>
                </Grid>
            </Card>
        );
        return <ul>{item_list}</ul>;
    }
    
    return (
        <div>
        {/* // <Grid container spacing={10}> */}
        {/* <Button color="secondary" variant="contained" onClick={() => renderItemList()}>
            새로고침
        </Button> */}
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
            {renderItemList()}
        {/* </Grid> */}
        </div>
    );
}

