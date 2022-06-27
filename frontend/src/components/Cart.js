import React, { useState, useEffect } from 'react';
import './Cart.css'
// import Subtotal from "./Subtotal";
import CartItem from "./CartItem";

function Cart() {
    const [basket, dispatch] = useState();  // {basket , user}

    return (
        <div className="cart">
            <div className="cart_left">
                <img className="cart_ad"
                    src="https://www.disruptivestatic.com/wp-content/uploads/2018/10/Screen-Shot-2018-10-29-at-11.50.03-AM-450x96.png"
                    alt=""/>

                    <div>
                        <h2 className="cart_title">  님의 장바구니 </h2>
                        {/* {basket.map(item => ( */}
                            <CartItem
                                id= '1' // {item.id}
                                title= '2' //{item.title}
                                image= '3' //{item.image}
                                price= '4' // {item.price}
                                rating= '5' //{item.rating}
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