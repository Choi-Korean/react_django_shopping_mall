import React from 'react';
import './Product.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Header from './Header';
import { Cookies } from "react-cookie";

function Product({ id, display_name, sale_price, image, colors }) {

    const [cart, setCart] = useState(false);
    const CSRFToken = new Cookies();

    useEffect(() => {
        getCart();
    });

    const getCart = () => {
        fetch("/api/cart?item=" + id)
            .then((response) => {
                if (response.ok) {
                    console.log(response)
                    setCart(true);
                }
            });
    }
    


    const cartCreateButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" , "X-CSRFToken": CSRFToken.get('csrftoken')},
            body: JSON.stringify({
                item: id
            }),
        };
        fetch("/api/create-cart/", requestOptions)
            .then((response) => {
                if (response.ok) {
                    setCart(true);
                }
            });
    }

    const cartDeleteButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" , "X-CSRFToken": CSRFToken.get('csrftoken')},
            body: JSON.stringify({
                item: id
            }),
        };
        fetch("/api/delete-cart/", requestOptions)
            .then((response) => {
                if (response.ok) {
                    setCart(false);
                }
            });
    }


    return (
            <li className="t-flex t-flex-col t-group">
                <a data-before="VIEW MORE" href={`/item/${id}`}
                className="product_img_div">
                    <img className="product_img"
                        src={image} alt="" />
                         {/* style="aspect-ratio: 1 / 1;" */}
                </a>
                <a className="t-text-center t-mt-2 t-no-underline t-text-black t-italic group-hover:t-underline"
                href="{% url 'products:detail' product.id %}">
                    {display_name}
                </a>
                <a className="t-text-center t-mt-2 t-no-underline t-text-gray-400 group-hover:t-text-blue-500"
                href="{% url 'products:detail' product.id %}">
                    <i className="fas fa-won-sign"></i>
                    <span>{sale_price}</span>
                </a>
                <a className="t-text-center t-mt-2 t-no-underline t-text-gray-400 group-hover:t-text-blue-500"
                href="{% url 'products:detail' product.id %}">
                    <span>{colors}</span>
                </a>
                {cart ?
                <div className="product_link_div"><Button color="primary" variant="contained" onClick={() => cartDeleteButtonPressed()}>찜해제</Button></div>
                :
                <div className="product_link_div"><Button color="secondary" variant="contained" onClick={() => cartCreateButtonPressed()}>찜하기</Button></div>
                }
            </li>

        // <div className="product">
        //     <div className="product_img_div"><img src={image} className="product_img" /></div>
        //     <h5 className="product_title">{code}</h5>
        //     <p className="product_des">{like_count}</p>
        //     <div className="product_mon">{created_at}</div>
        //     {/* <div className="product_link_div"><Link className="product_link" to={`/item/${code}`} >구매하기</Link></div><br></br> */}
        //     {cart ?
        //         <div className="product_link_div"><Button color="primary" variant="contained" onClick={() => cartDeleteButtonPressed()}>찜해제</Button></div>
        //         :
        //         <div className="product_link_div"><Button color="secondary" variant="contained" onClick={() => cartCreateButtonPressed()}>찜하기</Button></div>
        //     }
        //     {/* <div className="product_link_div"><Link className="product_link_2" to='/cart'>찜하기</Link></div>
        //     <div className="product_link_div"><Link className="product_link_2" to='/cart'>찜해제하기</Link></div> */}
        // </div>
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