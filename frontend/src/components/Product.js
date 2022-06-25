import React from 'react';
import './Product.css'
import { useState } from 'react';

function Product({code, created_at, image, listing_or_not, like_count}) {
    const [ basket , dispatch] = useState();

    const addToBasket = () => {
        dispatch({
            type:"ADD_TO_BASKET",
            item: {
                code: code,
                created_at: created_at,
                image: image,
                listing_or_not: listing_or_not,
                like_count: like_count,
            },
        });

    };


    return (
        <div className="product">

            <div className="product_info">
                <p>{code}</p>
                <p className="product_price">
                    <small>생성일</small>
                    <strong>{created_at}</strong>

                </p>

                <div className="product_rating">
                    {Array(like_count)
                        .fill()
                        .map(() => (
                            <p>★</p>
                        ))}


                </div>

            </div>

            <img src={image} alt=""/>
            <button onClick={addToBasket}>장바구니에 담기</button>


        </div>
    );
}

export default Product;