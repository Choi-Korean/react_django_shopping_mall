import React, { Component } from 'react';

// 사용된 material UI 궁금하면 직접 Google material UI를 검색해서 알아보고 공부하기

import { Button, FormLabel, Grid, TextField } from "@material-ui/core";
import { Typography } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Link, Router } from 'react-router-dom';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { withRouter } from './withRouter';
import { Collapse } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";
import Header from './Header';
import { Cookies } from "react-cookie";

class CreateItemPage extends Component {
    static defaultProps = {
        name: null,
        display_name: null,
        price: null,
        sale_price: null,
        image: null,
        category: null,
        market: null,
        updateCallBack: () => { },
        
    };

    constructor(props) {
        super(props);
        this.getCategories();
        this.getMarkets();

        // 이미지, 판매여부 state로 생성하기. 비동기 작업 위해?
        this.state = {
            name: this.props.name,
            display_name: this.props.display_name,
            price: this.props.price,
            sale_price: this.props.sale_price,
            image: this.props.image,
            category: this.props.category,
            market: this.props.market,
            msg: "",
            detailImageFile: null,
            detailImageUrl: null,
            categories: [],
            markets: [],
            CSRFToken: new Cookies(),
        };

        // 메서드를 클래스에 묶는 것. 이렇게 안하면 뭐 다른 this 가리킬 수도 있다 뭐라 하는데? 뭔소리지
        // 쨌든 이렇게 명시 안해주면 this가 계속 바뀌나봐
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
        this.handleImageChanged = this.handleImageChanged.bind(this);
        this.handlelisting_or_not = this.handlelisting_or_not.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this); // 와 아니 뭐지? 정확히 똑같은 글씨(코드)인데 색이 노래서 보니까 오류가 있었는데?
        // 그래서 그냥 다시 타이핑 하니까 오류 사라짐... 아니... 하...이거 찾을라고... 몇시간..
        this.handlelike_count = this.handlelike_count.bind(this);
        this.getImage = this.getImage.bind(this);
        this.setImageFromFile = this.setImageFromFile.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.renderCategories = this.renderCategories.bind(this);
        this.getMarkets = this.getMarkets.bind(this);
        this.renderMarkets = this.renderMarkets.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleDisplayName = this.handleDisplayName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleSalePrice = this.handleSalePrice.bind(this); 
        this.handleCategory = this.handleCategory.bind(this);
        this.handleMarket = this.handleMarket.bind(this);
    }
    // set file reader function
    setImageFromFile({ file, setImageUrl }) {
        let reader = new FileReader();
        reader.onload = function () {
            setImageUrl({ result: reader.result });
        };
        reader.readAsDataURL(file);
    };

    // 이미지나 상품판매여부 변경사항 있으면 자동 재실행되게 set 메서드 생성. 채팅방때 채팅 생성이랑 같은 것
    handleImageChanged(e) {
        let image = e.target.files[0];
        // let form_data = new FormData();
        // console.log(image);
        // form_data.append("image_url", image.name);

        // form_data.append("title", image.title);
        // form_data.append("description", image.description);
        // form_data.append("category", image.category);

        // console.log(form_data);

        this.setState({
            image: image,
        });

        this.setImageFromFile({
            file: image,
            setImageUrl: ({ result }) => this.setState({ detailImageFile: image, detailImageUrl: result })
        });

        console.log(image);
    }

    handlelisting_or_not(e) {
        this.setState({
            listing_or_not: e.target.value === "true" ? true : false,
        });
    }

    handlelike_count(e) {
        this.setState({
            like_count: e.target.value,
        });
    }


    handleCreateButtonPressed() {

        const uploadData = new FormData();
        uploadData.append('image', this.state.image, this.state.image.name);
        uploadData.append('name', this.state.name);
        uploadData.append('display_name', this.state.display_name);
        uploadData.append('price', this.state.price);
        uploadData.append('sale_price', this.state.sale_price);
        uploadData.append('category', this.state.category);
        uploadData.append('market', this.state.market);

        // for (var key of uploadData.entries()) {
        //         console.log(key[0] + ', ' + key[1]);
        //     }
        // console.log(uploadData('image'))

        const requestOptions = {
            method: "POST",
            // headers: {'Content-Type': 'application/json'},
            headers: {"X-CSRFToken": this.state.CSRFToken.get('csrftoken')},
            body: uploadData,
        };


        // 여기서 django create-room api 페이지로 request
        fetch("/api/create-item/", requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.navigate("/item/" + data.code));
    }

    handleUpdateButtonPressed() {

        const uploadData = new FormData();
        uploadData.append('image', this.state.image, this.state.image.name);
        uploadData.append('listing_or_not', this.state.listing_or_not);
        uploadData.append('like_count', this.state.like_count);
        uploadData.append('code', this.props.code);
        uploadData.append('listing_or_not', this.state.listing_or_not);
        uploadData.append('like_count', this.state.like_count);
        uploadData.append('code', this.props.code);

        const requestOptions = {
            method: "PATCH",
            // headers: {'Content-Type': 'application/json'},
            body: uploadData,
            // body: JSON.stringify({
            //     image: this.state.image,
            //     listing_or_not: this.state.listing_or_not,
            //     like_count: this.state.like_count,
            //     code: this.props.code
            // }),
        };
        fetch("/api/update-item/", requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.setState({
                        msg: "Item Updated Succesfully!"
                    });
                } else {
                    this.setState({
                        msg: "Error Updating Item..."
                    });
                }
                // this.props.updateCallBack();
                // location.reload();  // 여기서 위처럼 props로 item page에서 render 효과 받아야 하는데, 함수로 안써서 그냥 새로고침 형식으로 전환
                // 근데 updating 하면 message 띄워주는데 그게 새로고침하면 안보임. 그래서 메시지 클릭하면 새로고침되게 바꿔놨음 일단.
            });
    }

    renderCreateButtons() {
        return (
            // jsx expression은 반드시 1개의 upper level parent에 쌓여있어야 함.
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={() => this.handleCreateButtonPressed()}>
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

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={() => this.handleUpdateButtonPressed()}>
                    Update Item
                </Button>
            </Grid>
        );
    }

    getImage() {
        return (
            <Grid item align="center" xs={4}>
                <img src={this.state.image} height="100%" width="100%" />
            </Grid>
        )
    }

    getCategories() {
        fetch('/api/cartegory-list')
        .then((response) => response.json())
        .then((data) => {
            const categories = [];
            for (var key of data) {
                categories.push(key);
                // console.log(items.length);
            };
            this.setState({categories: categories});
        });
        }
    
    renderCategories() {
        console.log(this.state.categories);
        const category_list = this.state.categories.map((category) =>
            <option value={category.id} >{category.name}</option>
        );
        return(
            <select name="category" className="form-select" id="id_category" onChange={(e) => this.handleCategory(e)}>
                <option value="" selected="">---------</option>
                {category_list}
            </select>
        );
    }

    getMarkets() {
        fetch('/markets/market-list')
        .then((response) => response.json())
        .then((data) => {
            const markets = [];
            for (var key of data) {
                markets.push(key);
            };
            this.setState({markets: markets});
        });
        }
    
    renderMarkets() {
        const market_list = this.state.markets.map((market) =>
            <option value={market.id} >{market.name}</option>
        );
        return(
            <select name="market" className="form-select" id="id_market" onChange={(e) => this.handleMarket(e)}>
                <option value="" selected="">---------</option>
                {market_list}
            </select>
        );
    }

    handleName(e) {
        this.setState({name:e.target.value});
        console.log(this.state);
    };

    handleDisplayName(e) {
        this.setState({display_name:e.target.value});
    };

    handlePrice(e) {
        this.setState({price:e.target.value});
    };

    handleSalePrice(e) {
        this.setState({sale_price:e.target.value});
    };

    handleCategory(e) {
        this.setState({category:e.target.value});
    };

    handleMarket(e) {
        this.setState({market:e.target.value});
        console.log(this.state);
    };

    render() {
        
        const title = this.props.update ? "Update Item" : "Create a Item"

        // spacing은 grid 안의 item간의 간격. 1은 8pixel
        return (
            <section className="section-join t-flex-1 t-flex t-items-center t-justify-center">
                <div className="card t-w-full t-max-w-screen-md mx-4">
                    <div className="card-header"><i className="fas fa-user-plus"></i> 상품 등록</div>
                    <div className="card-body">
                        <div>
                            <div className="mb-3">
                                <label className="form-label" for="id_name">상품명(내부)</label>
                                <input type="text" name="name" maxlength="100" autocapitalize="none" autocomplete="name" autofocus="" className="form-control" placeholder="상품명" required="" id="id_name" onChange={(e) => this.handleName(e)}/>
                                <div className="form-text">100자 이하 문자, 숫자 그리고 @/./+/-/_만 가능합니다.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="id_display_name">상품명(노출)</label>
                                <input type="text" name="display_name" maxlength="100" autocapitalize="none" autocomplete="display_name" autofocus="" className="form-control" placeholder="노출되는 상품명" required="" id="id_display_name" onChange={(e) => this.handleDisplayName(e)}/>
                                <div className="form-text">100자 이하 문자, 숫자 그리고 @/./+/-/_만 가능합니다.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="id_price">상품가</label>
                                <input type="number" name="price" autocapitalize="none" autocomplete="price" autofocus="" className="form-control" placeholder="실제 가격" required="" id="id_price" onChange={(e) => this.handlePrice(e)}/>
                                <div className="form-text">0 이상의 숫자만 입력 가능합니다.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="id_sale_price">판매가</label>
                                <input type="number" name="sale_price" autocapitalize="none" autocomplete="sale_price" autofocus="" className="form-control" placeholder="판매 가격" required="" id="id_sale_price" onChange={(e) => this.handleSalePrice(e)}/>
                                <div className="form-text">0 이상의 숫자만 입력 가능합니다.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="id_profile_img">상품이미지</label>
                                <input type="file" name="img" accept="image/png, image/gif, image/jpeg" className="form-control" id="id_img" onChange={(e) => this.handleImageChanged(e)}/>
                                <div className="form-text">gif/png/jpg 이미지를 업로드해주세요.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="id_category">카테고리</label>
                                {this.renderCategories()}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="id_market">스토어</label>
                                {this.renderMarkets()}
                            </div>
                            <button type="submit" className="btn-outline-primary" onClick={() => this.handleCreateButtonPressed()}><i className='fas fa-user-plus'></i>등록</button>
                            {/* <Button type="reset" class="btn-outline-primary">취소</Button> */}
                        </div>
                    </div>
                </div>
                <div className="signup">
                    <input type="text" id="password" />
                </div>
            </section>
            // <Grid container spacing={1}>
            //     <Grid item xs={12} align="center">
            //         <Collapse in={this.state.msg != ""}>
            //             {(<Alert onClose={() => { this.setState({ msg: "" }); location.reload(); }}>{this.state.msg}</Alert>)}
            //         </Collapse>
            //     </Grid>
            //     <Grid item xs={12} align="center">
            //         <Typography component="h4" variant="h4">
            //             {/* {profile_preview} */}
            //             {title}
            //         </Typography>
            //     </Grid>
            //     <Grid item xs={12} align="center">
            //         <FormControl component="fieldset">
            //             <FormHelperText>
            //                 <div align='center'>
            //                     Control of state
            //                 </div>
            //             </FormHelperText>
            //             <RadioGroup
            //                 row
            //                 defaultValue={this.props.listing_or_not.toString()}
            //                 onChange={this.handlelisting_or_not}>
            //                 <FormControlLabel
            //                     value="true"
            //                     control={<Radio color="primary" />}
            //                     label="판매중"
            //                     labelPlacement="bottom"
            //                 />
            //                 <FormControlLabel
            //                     value="false"
            //                     control={<Radio color="secondary" />}
            //                     label="재고소진"
            //                     labelPlacement="bottom"
            //                 />
            //             </RadioGroup>
            //         </FormControl>
            //     </Grid>
            //     <Grid item xs={12} align="center">
            //         {this.state.image != null ? this.getImage() : null}
            //     </Grid>

            //     <Grid item xs={12} align="center">
            //         {this.state.detailImageFile && (
            //             <div className="image_area">
            //                 <img src={this.state.detailImageUrl} alt={this.state.detailImageFile.name} />
            //             </div>
            //         )}
            //         <FormControl type="file">
            //             <input
            //                 id='CreateItemPageImg'
            //                 type='file'
            //                 accept="image/jpeg,image/png,image/gif"
            //                 name='image'
            //                 onChange={(e) => this.handleImageChanged(e)}>
            //                 {/* defaultValue={this.state.image} */}
            //             </input>
            //             {/* <TextField
            //                         required={true}
            //                         defaultValue={this.state.image}
            //                         type="image"
            //                         onChange={this.handleImageChanged}
            //                         inputProps={{
            //                             style: {textAlign: "center"},
            //                         }}
            //                 /> */}
            //             <FormHelperText>
            //                 <div align="center">
            //                     상품 이미지를 올려주세요.
            //                 </div>
            //             </FormHelperText>
            //         </FormControl>
            //     </Grid>
            //     <Grid item xs={12} align="center">
            //         <FormControl>
            //             <TextField
            //                 // required={true}
            //                 type="number"
            //                 onChange={this.handlelike_count}
            //                 defaultValue={this.state.like_count}
            //                 inputProps={{
            //                     min: 1,
            //                     style: { textAlign: "center" },
            //                 }}
            //             />
            //             <FormHelperText>
            //                 <div align="center">Max item</div>
            //             </FormHelperText>
            //         </FormControl>
            //     </Grid>
            //     {this.props.update
            //         ? this.renderUpdateButtons()
            //         : this.renderCreateButtons()}
            // </Grid>
        );
    }
}

export default withRouter(CreateItemPage);