import React, { useState, useEffect } from 'react';
import './CartItem.css'
import Header from './Header';

function CartItem({id, image, title, price, rating, hideButton } ) {
    const [basket, dispatch] = useState();
    const removeFromBasket = () => {

        dispatch({
            type: 'REMOVE_FROM_BASKET',
            id: id,

        });
    };

    return (
            <div className="cartItem">
                <img className='cartItem_image' src={image}/>

                <div className='cartItem_info'>
                    <p className='cartItem_title'>{title}</p>
                    <p className='cartItem_price'>
                        <small>₩</small>
                        <strong>{price}</strong>

                    </p>
                    <div className='cartItem_rating'>
                        {Array(rating)
                            .fill()
                            .map((_, i) => (
                                <p>★</p>
                            ))}
                    </div>
                    {!hideButton && (<button onClick={removeFromBasket}>장바구니에서 제거하기</button>)}
                </div>
            </div>
    );
}

export default CartItem;