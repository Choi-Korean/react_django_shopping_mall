import React from 'react';
import './Product.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="product_img_div"><img src={image} className="product_img"/></div>
        <h5 className="product_title">{code}</h5>
        <p className="product_des">{like_count}</p>
        <div className="product_mon">{created_at}</div>
        <div className="product_link_div"><Link className="product_link" to={`/item/${code}`} >구매하기</Link></div><br></br>
        <div className="product_link_div"><Link className="product_link_2" to='/cart'>찜하기</Link></div>
    </div>
        // <div className="product">

        //     <div className="product_info">
        //         <p>{code}</p>
        //         <p className="product_price">
        //             <small>생성일</small>
        //             <strong>{created_at}</strong>

        //         </p>

        //         <div className="product_rating">
        //             {Array(like_count)
        //                 .fill()
        //                 .map(() => (
        //                     <p>★</p>
        //                 ))}


        //         </div>

        //     </div>

        //     <img src={image} alt=""/>
        //     <button onClick={addToBasket}>장바구니에 담기</button>


        // </div>
    );
}

export default Product;