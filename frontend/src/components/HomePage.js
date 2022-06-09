import React, { Component } from 'react';
import CreateItemPage from "./CreateItemPage";
import BuyItemPage from "./BuyItemPage";
import Item from "./Item";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom"; // 바꿔야 할 부분

export default class HomePage extends Component{
    constructor(props){
        super(props);
    }

    render(){ // slash는 exact path로 처리해서 /buy 등이 일치하지 않게 처리
        return (<Router>
            <Routes> 
                <Route path='/*'></Route>
                <Route path='/buy' element={<BuyItemPage />} />
                <Route path='/create' element={<CreateItemPage />} />
                <Route path='/item/:postId' element={<Item />} />
            </Routes>
        </Router>);
    }
}