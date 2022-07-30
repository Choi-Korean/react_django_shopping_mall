// 함수형 기반 component
// 현재 존재하는 item 리스트 목록 보여줄 페이지

import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton, Card } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext"
import { Link } from "react-router-dom";
import Header from './Header';
import Product from './Product';
import './Info.css'
import { useNavigate } from 'react-router-dom';

// ENM ? 어쨌든 페이지 값 저장해놓는거
const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create',
}

export default function Info(props) {
    const [page, setPage] = useState(pages.JOIN);
    const initialState = {
        id: 0,
        image: null,
        listing_or_not: true,
        showSettings: false,
        like_count: 0,
        created_at: null,
    }

    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    // const [postData, setPostData] = useState(initialState);

    function joinInfo() {    // default fucntion 밖에 정의해도 되지만, 여기에 하는게 좋대. 그 상황에 따라 다른건가. 여기 정의하면 props등 사용 가능
        return "Join page";
    }

    function createInfo() {
        return "Create page";
    }

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch('/api/item-list').then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        }).then(data => {
            const new_items = [];
            for (var key of data) {
                new_items.push(key);
                // console.log(items.length);
            };

            setItems(new_items);
        }
        );
    }
    // getItems();

    const renderItemList = () => {
        // if (items.length == 0) {
        //     getItems();
        // }
        const item_list = items.map((item) =>
            // <ul className="t-grid t-grid-cols-1 sm:t-grid-cols-2 md:t-grid-cols-3 lg:sm:t-grid-cols-4 t-gap-[20px] t-mt-3">
            <Grid>
                <Product
                    // id={index ++}
                    id={item.id}
                    display_name={item.display_name}
                    sale_price={item.sale_price}
                    image={item.image}
                    colors={item.colors} />
                <Button variant="contained" color="primary" onClick={() => buyButtonPressed(item.id)}>Buy</Button>
            </Grid>
        );
        return <div className="product_container">{item_list}</div>;
    }

    const buyButtonPressed = (e) => {
        console.log(e);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: e
            })
        };
        fetch('/api/buy-item/', requestOptions).then((response) => {
            if (response.ok) {
                navigate(`/item/${e}`);
            } else {
                this.setState({ error: "code not found." });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <Grid container spacing={4}>
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
                    {page === pages.JOIN ? joinInfo() : createInfo()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={() => {
                    page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
                }}>
                    {page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>

            <Grid item xs={12} align="center">
                {renderItemList()}
            </Grid>
        </Grid>
    );
}


        // const arr = ['a'];
        // let item_list2 = document.createElement('table');
        // let new_tags = "";
        // new_tags += '<tr>';
        // const make_item_list = arr.map((v) => {

        //     for (let i = 0; i < items.length; i++) {
        //         if (i % 2 === 0) {
        //             new_tags += '</tr><tr>';
        //         }

        //         new_tags +=
        //             '<td>'
        //             +
        //             "<Product code='" + items[i].code +
        //             "' created_at='" + items[i].created_at +
        //             "' listing_or_not='" + items[i].listing_or_not +
        //             "' image='" + items[i].image +
        //             "' like_count='" + items[i].like_count + "'/>"
        //             + '</td>';
        //     }


        // })
        // new_tags += '</tr>';
        // item_list2.innerHTML = new_tags;

        // console.log('tq ' + item_list);
        // console.log(make_item_list);




        // <Card>
        //     <Grid container spacing={1}>
        //         <Grid item xs={12} align="center">
        //             <Typography variant="h4" componoet="h4">
        //             COde: {item.code}
        //             </Typography>
        //         </Grid>
        //         {/* <MusicPlayer {...song}/> */}
        //         <Card align="center">
        //             <Grid item xs={12} align="center">
        //                 <img src={item.image} className='info_image' />
        //             </Grid>
        //         </Card>
        //     </Grid>
        // </Card>


                // let index = 1;   //추후 index별 listing 배열 다르게 적용 예정

        {/* <img src={item.image} className='info_image' /> */ }
        // const item_list = items.map((item) =>
        //     <div className="info_row">
        //         <Product
        //             // id={index ++}
        //             code={item.code}
        //             created_at={item.created_at}
        //             listing_or_not={item.listing_or_not}
        //             image={item.image}
        //             like_count={item.like_count} />
        //     </div>
        // );

                    // initialState.id = data.id;
            // initialState.image = data.image;
            // initialState.listing_or_not = data.listing_or_not;
            // initialState.code = data.code;
            // initialState.like_count = data.like_count;
            // initialState.created_at = data.created_at;