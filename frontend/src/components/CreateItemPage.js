import React, { Component } from 'react';

// 사용된 material UI 궁금하면 직접 Google material UI를 검색해서 알아보고 공부하기
// https://www.youtube.com/watch?v=YDgZd9i3le4&list=WL&index=17&t=163s 22:14

import { Button, FormLabel, Grid, TextField } from "@material-ui/core";
import { Typography } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Link, Router } from 'react-router-dom';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import {withRouter} from './withRouter';
import { Collapse } from '@material-ui/core';

class CreateItemPage extends Component{
    static defaultProps = {
        image: null,
        listing_or_not: true,
        update: false,
        // code: null,
        updateCallBack: () => {},
    };

    constructor(props){
        super(props);
        
        // 이미지, 판매여부 state로 생성하기. 비동기 작업 위해?
        this.state = {
            code: this.props.code,
            image: this.props.image,
            listing_or_not: this.props.listing_or_not,
            msg: "",
        };

        // 메서드를 클래스에 묶는 것. 이렇게 안하면 뭐 다른 this 가리킬 수도 있다 뭐라 하는데? 뭔소리지
        // 쨌든 이렇게 명시 안해주면 this가 계속 바뀌나봐
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
        this.handleImageChanged = this.handleImageChanged.bind(this);
        this.handlelisting_or_not = this.handlelisting_or_not.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed(this);
    }

    // 이미지나 상품판매여부 변경사항 있으면 자동 재실행되게 set 메서드 생성. 채팅방때 채팅 생성이랑 같은 것
    handleImageChanged(e){
        this.setState({
            image: e.target.value,
        });
    }

    handlelisting_or_not(e){
        this.setState({
            listing_or_not: e.target.value === "true"? true:false,
        });
    }

    handleCreateButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                image: this.state.image,
                listing_or_not: this.state.listing_or_not,
            }),
        };
        // 오.. 여기서 django create-room api 페이지로 보내는 거네
        fetch("/api/create-item/", requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.navigate("/item/" + data.code));
    }

    handleUpdateButtonPressed(){
        console.log(this.props.code)
        const requestOptions = {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                image: this.state.image,
                listing_or_not: this.state.listing_or_not,
                code: this.props.code
            }),
        };

        fetch("/api/update-item/", requestOptions)
            .then((response) => {
                if(response.ok){
                    this.setState({
                        msg: "Item Updated Succesfully!"
                    });
                }else{
                    this.setState({
                        msg: "Error Updating Item..."
                    });
                }
                this.props.updateCallBack();
            });
    }

    renderCreateButtons(){
        return (
            // jsx expression은 반드시 1개의 upper level parent에 쌓여있어야 함.
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.handleCreateButtonPressed}>
                        Create A Item
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    renderUpdateButtons(){
        return(
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
                    Update Item
                </Button>
            </Grid>
        );
    }

    render(){
        const title = this.props.update? "Update Item" : "Create a Item"

        // spacing은 grid 안의 item간의 간격. 1은 8pixel
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={this.state.msg != ""}>
                    {this.state.msg}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align='center'>
                            Control of state
                        </div>
                    </FormHelperText>
                    <RadioGroup
                        row
                        defaultValue={this.props.listing_or_not.toString()}
                        onChange={this.handlelisting_or_not}>
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="판매중"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="재고소진"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                                    required={true}
                                    defaultValue={this.state.image}
                                    type="image"
                                    onChange={this.handleImageChanged}
                                    inputProps={{
                                        style: {textAlign: "center"},
                                    }}
                            />
                            <FormHelperText>
                                <div align="center">
                                    상품 이미지를 올려주세요.
                                </div>
                            </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update
                ?this.renderUpdateButtons()
                :this.renderCreateButtons()}
        </Grid>
        ); 
    }
}

export default withRouter(CreateItemPage);