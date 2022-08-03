import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';   // react-router-dom v6부터는 이걸로 params 가져와야 된대.. 아 이거때문에 40분 날렸네. 근데 안되네 ㅋㅋ
// function 형으로 바꿔야 할듯.. class에서는 useParams가 안먹히는거 같어
 // https://github.com/remix-run/react-router/issues/8146
import { Grid, Button, Typography, Card } from '@material-ui/core'
import { useNavigate } from 'react-router-dom';
import CreateItemPage from './CreateItemPage';
import MusicPlayer from './MusicPlayer';
import './Item.css';
import Product from './Product';
import { Cookies } from "react-cookie";

// 에러 수정 필요 : id 세션제거
// (1) 두개의 홈페이지에서 같은 id 페이지 띄우고, 하나에서 session 제거해서 초기페이지로 이동시, 다른 페이지도 새로고침시 이동되어야 하는데 안됨.
// (2) create-room 해서 item page 들어가고, 새로고침 한번 하고 leave-item 버튼 눌러도 나가지지가 않음. 다시 새로고침해야 나가짐. 이건 뭐지

// 현재 item page에 item 주인이 접속해있지 않으면 spotify item 못불러옴. token 처리 로직에서 그렇게 처리된 거 같은데, 이게 맞긴 한ㄷ ㅔ흠

export default function Item(props) {
  const initialState = {
    name: null,
    display_name: null,
    price: null,
    sale_price: null,
    image: null,
    category: {},
    market: {},
    // spotifyAuthenticated: false,  // 초기 인증값 false
  }

  const CSRFToken = new Cookies();
  const [postData, setPostData] = useState(initialState);
  const { id } = useParams();
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const navigate = useNavigate();
  const new_file = null;

  useEffect(() => {

    fetch("/api/get-item" + "?id=" + id)
      .then((res) => {
        if(!res.ok){
          // props.leaveItemCallback();
          navigate("/");
        }
        return res.json();
      }).then(data => {
          console.log(data);
          setPostData({
            id: data.id,
            name: data.name,
            display_name: data.display_name,
            price: data.price,
            sale_price: data.sale_price,
            image: data.image,
            category: data.category,
            market: data.market,
        });
      });

    // fetch('/api/get-category?id=' + c)
    // .then((response) => response.json())
    // .then((data) => {
    //   setPostData({
    //     ...postData,
    //     category: data.name,
    //   });
    // });

    // fetch('/markets/get-market?id=' + m)
    // .then((response) => response.json())
    // .then((data) => {
    //   setPostData({
    //     ...postData,
    //     market: data.name,
    //   });
    // });
      // const requestOptions = {
      //   method: "POST",
      //   // headers: {'Content-Type': 'application/json'},
      //   headers: {"X-CSRFToken": CSRFToken.get('csrftoken')},
      //   body: JSON.stringify({
      //       market_id:postData.market_id,
      //       category_id:postData.category_id,
      //   })
      // };

      
      // if(postData.isWriter){
      //   authenticateSpotify();
      // };
      // getCurrentSong(); // 아래 request 많이 보내면 혹시 모를 부담있을까봐 걍 한번 호출로 바꿈 일단. 엥? 근데 이것만 해도 계속 request 하는 거 같은데?
      // 내가 아래에 song 정보 바뀔때마다 Effect 실행되게 해서 그런듯
      // componentDidMount(); // 이거 호출하면 1초당 한번씩 request. 
      // componentWillUnmount();
  },[]) //It renders when the object changes .If we use roomData and/or roomCode then it rerenders infinite times
  // 이 배열안에 들어간 값(컴포넌트)이 바뀔 때마다 useEffect 실행됨. 비우면 처음 렌더링 될때 한번만 실행. 배열을 생략하면 리렌더링 될때마다 실행


  // // 매 1초마다 API 요청 보내는 websocket 역할.
  // const componentDidMount = () => {
  //   const interval = setInterval(getCurrentSong, 10000);
  // }

  // const componentWillUnmount = () => {
  //   clearInterval(componentDidMount.interval);
  // }

  // const getCurrentSong = () => {
  //   fetch('/spotify/current-song').then((response) => {
  //     if(!response.ok){
  //       return{};
  //     }else{
  //       return response.json();
  //     }
  //   }).then((data) => {setSong(data);
  //   console.log("getCurrentSong : " + data);
  //   })
  // }


  //   // API 서버에서 auth 받아오기
  // const authenticateSpotify = () => {
  //   fetch('/spotify/is-authenticated')
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setSpotifyAuthenticated(data.status);

  //     if(!data.status){ // auth값이 없다면 <- 권한 초기에 받아야 할 경우
  //       fetch('/spotify/get-auth-url')
  //       .then((response) => response.json())
  //       .then((data) => {
  //         window.location.replace(data.url);  // auth 받는 url로 redirect 시켜주기
  //       })
  //     };
  //   });
  // }


// 강의에선 class component라 함수형으로 만들고, hisotry.push 사용헀음.
// 나도 다른 page처럼 class형이었으면 그냥 withRouter.js 만들어놓은거로 처리했으면 됐는데,
// 이 페이지는 함수형으로 만들어서 애 좀 먹었다..
// 그래서 const 함수형으로 선언하고, useNavigate을 위에 const 변수에 담아서 url 이동시켜야 함.
// 이렇게 함수형일 때는 const로 함수 선언해줘야 아래 html 태그에서 변수 인식함
  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    };
    fetch("/api/leave-item/", requestOptions).then((response) => {
      props.leaveItemCallback();
      navigate("/");
      location.reload() // navigate만 하면 item.js에 있는 useEffect도 실행이 됨
      // useEffect에서 Unmount? 나 return을 해줘야 하는듯 한데
    });
  };

  const updateShowSettings = (value) => {
    setPostData({
      ...postData, 
      showSettings: value
    });
  }

  const renderSettings = () => {
    return(
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateItemPage
          update={true}
          listing_or_not={postData.listing_or_not}
          like_count={postData.like_count}
          id={id}
          name={postData.name}
          display_name={postData.display_name}
          price={postData.price}
          sale_price={postData.sale_price}
          image={postData.image}
          category={postData.category}
          market={postData.market}
          // updateCallBack={useEffect}
          // updateCallBack={} // 여기서 원래 useEffect같은거 전달하고, createItem page에서 값 업데이트 되면 이거 써서 reRender효과 줘야 함.
          // 자료에서는 getItem() 함수로 작성된 부분이라 난 패스. 대신 location.reload 처리
          />
      </Grid>
      <Grid item xs={12} align="center">
        {/* setting값 변경하고 close 누르면, 새로고침을 안하면 값변경내용이 안되어서 우선 reload처리로 했음. 이것보단 rerendering 처리해주는게 좋은데.. 왜 안되지?*/}
        <Button variant="contained" color="secondary" onClick={() => {updateShowSettings(false); location.reload()}}>
            Close
        </Button>
      </Grid>
    </Grid>
    );
  }

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
            Settings
          </Button>
      </Grid>
    );
  }

  if(postData.showSettings){
    return renderSettings();
  }
  return (
            <section className="section-prod-detail">
              <div className="container t-grid lg:t-grid-cols-[3fr_4fr] t-gap-10 t-items-start" >
                  <div className="card lg:!t-sticky lg:t-top-[76px]">
                      <div className="card-header">
                          상품상세정보
                      </div>
                      <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                              <a href="#product-img"><img className="t-w-full t-max-w-[300px] t-rounded" src={postData.image} alt="" /></a>
                          </li>
                          <li className="list-group-item">
                              <span className="t-w-16 t-inline-block">번호</span>
                              <span className="badge bg-primary">{postData.id}</span>
                          </li>
                          <li className="list-group-item">
                              <span className="t-w-16 t-inline-block">마켓</span>
                              <span className="badge bg-primary">{postData.market.name}</span>
                          </li>
                          <li className="list-group-item">
                              <span className="t-w-16 t-inline-block">카테고리</span>
                              {postData.category.name}
                          </li>
                          <li className="list-group-item">
                              <span className="t-w-16 t-inline-block">상품명</span>
                              <span className="t-font-bold">{postData.display_name}</span>
                          </li>
                          <li className="list-group-item">
                              <span className="t-w-16 t-inline-block">가격</span>
                              <span className="t-font-bold">{postData.sale_price}</span>원
                          </li>
                          <li className="list-group-item">
                              <span className="t-w-16 t-inline-block">색상</span>
                              {/* {{product.colors|safe}} */}
                          </li>
                      </ul>
                      </div>
                  </div>
                  <div className="card">
                      <div className="card-header">
                          옵션
                      </div>

                      <div className="card-body">
                          <table className="table table-hover">
                            <colgroup>
                              <col className="sm:t-w-40" />
                              <col className="sm:t-w-40" />
                              <col />
                              <thead>
                              <tr>
                                  <th>사이즈</th>
                                  <th>색상</th>
                                  <th>품절</th>
                              </tr>
                              </thead>
                              <tbody>
                              {/* {% for product_real in product_reals %} */}
                              <tr>
                                  <td>
                                      {/* {{product_real.option_1_display_name}} */}
                                  </td>
                                  <td>
                                      {/* {{product_real.option_2_display_name}} */}
                                  </td>
                                  <td>
                                      {/* {% if not product_real.is_sold_out %} */}
                                      <span className="badge bg-primary">판매중</span>
                                      {/* {% else %} */}
                                      <span className="badge bg-secondary">품절</span>
                                      {/* {% endif %} */}
                                  </td>
                              </tr>
                              {/* {% endfor %} */}
                              </tbody>
                        </colgroup>
                      </table> 
                  </div>
              </div>
              <div className="container t-grid lg:t-grid-cols-[1fr_2fr] t-gap-10 t-items-start t-mt-10">

                  <div className="card lg:!t-sticky lg:t-top-[76px]">
                      <div className="card-header">
                          질문등록
                      </div>

                      <div className="card-body">
                          {/* {% if user.is_authenticated %} */}

                          <form method="POST" action="{% url 'products:question_create' product.id %}">
                              {/* {% csrf_token %}

                              {% bootstrap_form question_form %}
                              {% bootstrap_button button_type="submit" content="<i className='fas fa-pen'></i> 질문작성" %}
                              {% bootstrap_button button_type="reset" content="취소" button_className="btn-outline-primary" %} */}

                          </form>
                          {/* {% else %} */}
                          <div className="t-text-gray-400">
                              <a href="{% url 'accounts:login' %}?next={{request.get_full_path}}">로그인</a> 후 이용해주세요.
                          </div>
                          {/* {% endif %} */}

                          {/* {% if question_form.errors %} */}
                          <script>
                              let $lastForm = $('form').last();
                              $(window).on('load', function() 
                                  $(window).scrollTop($lastForm.offset().top);
                              );
                          </script>
                          {/* {% endif %} */}

                      </div>
                  </div>

                  <div className="card">
                      <div className="card-header">
                          질문리스트
                      </div>

                      {/* {% if questions %} */}
                      <ul className="list-group list-group-flush">
                          {/* {% for question in questions %} */}
                          <li className="list-group-item !t-flex t-items-center">
                              <span className="badge bg-secondary">{postData.id}</span>
                              &nbsp;
                              <span>{postData.id}</span>
                              <div className="t-flex-grow"></div>
                              {/* {% if question.user == request.user %} */}
                              &nbsp;
                              <a href="{% url 'products:question_delete' product.id question.id %}" className="btn btn-sm btn-danger"
                                onClick="if ( confirm('정말 삭제하시겠습니까?') == false ) return false;">
                                  <i className="far fa-trash-alt"></i>
                                  삭제
                              </a>
                              {/* {% endif %} */}
                              &nbsp;
                              <a href="{% url 'products:question_modify' product.id question.id %}"
                                className="btn btn-sm btn-secondary">
                                  <i className="fas fa-edit"></i>
                                  수정
                              </a>
                          </li>
                          {/* {% endfor %} */}
                      </ul>
                      {/* {% endif %} */}

                      {/* {% if not questions %} */}
                      <div className="card-body">
                          <div className="t-text-gray-400">
                              질문이 없습니다.
                          </div>
                      </div>
                      {/* {% endif %} */}
                  </div>

              </div>

              <div className="container t-mt-10">
                  <a href="#">
                      <img id="product-img" className="t-w-full t-block rounded" src={postData.image} alt="" />
                  </a>
              </div>
          </section>
  )
}   

     {/* <Grid container spacing={1}>
       <Grid item xs={12} align="center">
         <Typography variant="h4" componoet="h4">
           상품코드: {code}
         </Typography>
       </Grid>
       <Grid item xs={12} align="center">
         <MusicPlayer {...song}/>
       </Grid>
       <Grid item xs={12} align="center">
      <Product 
      code={code}
      created_at={postData.created_at}
      listing_or_not={postData.listing_or_not}
      image={postData.image?postData.image:new_file}
      like_count={postData.like_count}/>
       </Grid> */}
       {/* <Card align="center">
         <Grid item xs={12} align="center">
             <img src={postData.image} classNameName="product_img" />
       </Grid>
      </Card> 
       {postData.isWriter? renderSettingsButton(): null}
       <Grid item xs={12} align="center">
         <Button variant="contained" color="secondary" onClick={() => leaveButtonPressed()}>
             Leave Item
         </Button>
       </Grid>
     </Grid> */}




  {/* // 필요없어진, 못 쓰는 코드들 모음


        // <Grid item xs={12} align="center">
        //   <Typography variant="h6" componoet="h6">
        //     Image: {postData.image}
        //   </Typography>
        // </Grid>
        // <Grid item xs={12} align="center">
        //   <Typography variant="h6" componoet="h6">
        //     판매중: {postData.listing_or_not.toString()}
        //   </Typography>
        // </Grid> */}
  


  {/* <Button variant="contained" color="secondary" onClick={
    () => {
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
      };
      fetch("/api/leave-item/", requestOptions).then((response) => response.json())
      .then((data) => {"/"});
      {"/"};
    }
  }> */}

  


   {/* 아래 className형은 useparams가 왠지 모르겠는데 안먹힘.. 아무리 찾아봐도 원인을 모르겠다. 그래서 위처럼 함수형으로 바꿈

 export default className Item extends Component{

     constructor(props){
         super(props);
         this.state = {
           image: null,
             listing_or_not: true,
             writer: 'writer',
         };
        
     } 
     render(){
      //         let { postId } = this.props.params;
//         return (
//         <div>
//             {/* <h3>{postId.postId}</h3>
             <p>Image: {this.state.image}</p>
             <p>Listing_or_not: {this.state.listing_or_not}</p>
             <p>Writer: {this.state.writer}</p>
         </div>
         );
     }
 } */}

     



{/* 
   useEffect는 홈페이지 시작될 때마다 실행되는 함수. 이걸로 어케 해볼라 했는데 버튼 클릭하면 session 해제하는 의도랑 다른 거라 냅두고 바꿈
     useEffect(() => {
       console.log(id);
       const requestOptions = {
             method: "POST",
             headers: {"Content-Type": "application/json"},
           };
       fetch("/api/leave-item/", requestOptions)
         .then((response) => response.json())
         .then(data => {this.props.navigate("/"),
           setId({
             id: data.id
          })
     });
     console.log(getId);
         }, [id, setId]) */}