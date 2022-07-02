import React, { useState, useEffect } from 'react';
import './Cart.css'
// import Subtotal from "./Subtotal";
import CartItem from "./CartItem";
import { Grid, Button, Typography, IconButton, Card } from "@material-ui/core";
import Product from './Product';

function Cart() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getCartList();
        renderItemList();
    });

    const getCartList = () => {
        fetch("/api/cart-list")
            .then((response) => {
                if(!response.ok){
                    return;
                }else{
                    return response.json();
                }
            }).then(data => {
                const new_items = [];
                for (var key of data) {
                    new_items.push(key);
                }
                setItems(new_items);
            });
    }

    const renderItemList = () => {
        const item_list = items.map((item) =>
            <Grid>
                <Product
                    // id={index ++}
                    code={item.code}
                    created_at={item.created_at}
                    listing_or_not={item.listing_or_not}
                    image={item.image}
                    like_count={item.like_count} />
                <Button variant="contained" color="primary" onClick={() => buyButtonPressed(item.code)}>Buy</Button>
            </Grid>
        );
        return <div className="product_container">{item_list}</div>;
    }

    return (
        <div className="cart">
            {renderItemList()}
            <div className="cart_left">
                <img className="cart_ad"
                    src="https://www.disruptivestatic.com/wp-content/uploads/2018/10/Screen-Shot-2018-10-29-at-11.50.03-AM-450x96.png"
                    alt="" />

                <div>
                    <h2 className="cart_title">  님의 장바구니 </h2>
                    {/* {basket.map(item => ( */}
                    <CartItem
                        id='1' // {item.id}
                        title='2' //{item.title}
                        image='3' //{item.image}
                        price='4' // {item.price}
                        rating='5' //{item.rating}
                    />
                    {/* ))} */}

                </div>

            </div>

            <div className="cart_right">
                {/* <Subtotal/> */}
            </div>

        </div>
    );
}

export default Cart;