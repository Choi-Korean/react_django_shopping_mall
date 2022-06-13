import React, { Component } from 'react';
import CreateItemPage from "./CreateItemPage";
import BuyItemPage from "./BuyItemPage";
import Item from "./Item";
import { BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom"; // 바꿔야 할 부분
import {Grid, Button, ButtonGroup, Typography } from '@material-ui/core'
import {withRouter} from './withRouter';

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: null,
        }
    }

    // ** 중요 : 사용자 상태에 따라 component 다르게 적용하는 것?
    // asynchronous operation 비동기 처리를 위한 것
    // async를 붙여야 동기처리 기다리지 않고 렌더링/작업 진행함 << 실시간처리 가능
    // id가 위 설정한 null에서 변경된 사항 있다면 즉시 비동기처리로 아래에 넘겨줌
    async componentDidMount(){
        fetch('/api/user-in-item')
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                id: data.id
            })
        });
    }

    renderHomePage(){
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant='h3' compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    {/*disableElevation : 쉐도우 느낌? 검색해봐야겠다 */}
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/buy" component={ Link }>
                            Buy a Item
                        </Button>
                        <Button color="secondary" to="/create" component={ Link }>
                            Create a Item
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render(){ // slash는 exact path로 처리해서 /buy 등이 일치하지 않게 처리
        return (<Router>
            <Routes> 
                {/* id 변경사항이 있다면 (? : if), item/id 주소로 이동시키고, 아니면 그냥 홈페이지 rendering */}
                <Route path='/*' element={
                    this.state.id ? (<Navigate replace to={`/item/${this.state.id}`} />) : ( this.renderHomePage() )
                }></Route>
                {/* 아래 안 되어서 위 코드로 바꿈. 아래도 원래 강의 코드 안되어서 바꿨던 거. */}
                {/* <Route path='/*' render={() => {
                    return this.state.id ? (this.props.navigate(`/item/${this.state.id}`)) : ( this.renderHomePage() )
                }}></Route> */}
                <Route path='/buy' element={<BuyItemPage />} />
                <Route path='/create' element={<CreateItemPage />} />
                <Route path='/item/:id' element={<Item />} />
            </Routes>
        </Router>);
    }
}