import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';   // react-router-dom v6부터는 이걸로 params 가져와야 된대.. 아 이거때문에 40분 날렸네. 근데 안되네 ㅋㅋ
// function 형으로 바꿔야 할듯.. class에서는 useParams가 안먹히는거 같어
 // https://github.com/remix-run/react-router/issues/8146
import { Grid, Button, Typography } from '@material-ui/core'
import { useNavigate } from 'react-router-dom';
import CreateItemPage from './CreateItemPage';
import MusicPlayer from './MusicPlayer';

// 에러 수정 필요 : id 세션제거
// (1) 두개의 홈페이지에서 같은 id 페이지 띄우고, 하나에서 session 제거해서 초기페이지로 이동시, 다른 페이지도 새로고침시 이동되어야 하는데 안됨.
// (2) create-room 해서 item page 들어가고, 새로고침 한번 하고 leave-item 버튼 눌러도 나가지지가 않음. 다시 새로고침해야 나가짐. 이건 뭐지


export default function Item(props) {
  const initialState = {
    image: null,
    listing_or_not: true,
    showSettings: false,
    isWriter: false,
    like_count: 0
    // spotifyAuthenticated: false,  // 초기 인증값 false
  }
  const [postData, setPostData] = useState(initialState);
  const { code } = useParams();
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get-item" + "?code=" + code)
      .then((res) => {
        if(!res.ok){
          props.leaveItemCallback();
          navigate("/");
        }
        return res.json();
      }).then(data => {
          setPostData({
          image: data.image,
          listing_or_not: data.listing_or_not,
          isWriter: data.is_writer,
          like_count: data.like_count
        })
      });
      if(postData.isWriter){
        authenticateSpotify();
      };
      // getCurrentSong(); // 아래 request 많이 보내면 혹시 모를 부담있을까봐 걍 한번 호출로 바꿈 일단. 엥? 근데 이것만 해도 계속 request 하는 거 같은데?
      // 내가 아래에 song 정보 바뀔때마다 Effect 실행되게 해서 그런듯
      componentDidMount(); // 이거 호출하면 1초당 한번씩 request. 
      // componentWillUnmount();
  },[postData.isWriter, spotifyAuthenticated]) //It renders when the object changes .If we use roomData and/or roomCode then it rerenders infinite times
  // 이 배열안에 들어간 값(컴포넌트)이 바뀔 때마다 useEffect 실행됨. 비우면 처음 렌더링 될때 한번만 실행. 배열을 생략하면 리렌더링 될때마다 실행


  // 매 1초마다 API 요청 보내는 websocket 역할. 와 신기하다. 계속 보내네
  const componentDidMount = () => {
    const interval = setInterval(getCurrentSong, 10000);
  }

  const componentWillUnmount = () => {
    clearInterval(componentDidMount.interval);
  }

  const getCurrentSong = () => {
    fetch('/spotify/current-song').then((response) => {
      if(!response.ok){
        return{};
      }else{
        return response.json();
      }
    }).then((data) => {setSong(data);
    console.log("getCurrentSong : " + data);
    })
  }


    // API 서버에서 auth 받아오기
  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
    .then((response) => response.json())
    .then((data) => {
      setSpotifyAuthenticated(data.status);

      if(!data.status){ // auth값이 없다면 <- 권한 초기에 받아야 할 경우
        fetch('/spotify/get-auth-url')
        .then((response) => response.json())
        .then((data) => {
          window.location.replace(data.url);  // auth 받는 url로 redirect 시켜주기
        })
      };
    });
  }


// 강의에선 class component라 함수형으로 만들고, hisotry.push 사용헀음.
// 나도 다른 page처럼 class형이었으면 그냥 withRouter.js 만들어놓은거로 처리했으면 됐는데,
// 이 페이지는 함수형으로 만들어서 애 좀 먹었다..
// 그래서 const 함수형으로 선언하고, useNavigate을 위에 const 변수에 담아서 url 이동시켜야 함.
// 이렇게 함수형일 때는 const로 함수 선언해줘야 아래 html 태그에서 변수 인식하더라. 아오.. 힘들어...
  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    };
    fetch("/api/leave-item/", requestOptions).then((response) => {
      props.leaveItemCallback();
      navigate("/");
      location.reload() // navigate만 하면 왠지 모르겠는데 자꾸 item.js에 있는 useEffect도 실행이 된다? 그래서 reload 일단 한건데. 아니 그럼 rerender 의미가 없는데
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
          image={postData.image}
          listing_or_not={postData.listing_or_not}
          like_count={postData.like_count}
          code={code}
          // updateCallBack={useEffect}
          // updateCallBack={} // 여기서 원래 useEffect같은거 전달하고, createItem page에서 값 업데이트 되면 이거 써서 reRender효과 줘야 함.
          // 강의에서는 getItem() 함수로 작성된 부분이라 난 패스. 대신 location.reload 처리
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
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" componoet="h4">
          COde: {code}
        </Typography>
      </Grid>
      <MusicPlayer {...song}/>
      {postData.isWriter? renderSettingsButton(): null}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={() => leaveButtonPressed()}>
            Leave Item
        </Button>
      </Grid>
    </Grid>
  )
}



  // 필요없어진, 못 쓰는 코드들 모음


        // <Grid item xs={12} align="center">
        //   <Typography variant="h6" componoet="h6">
        //     Image: {postData.image}
        //   </Typography>
        // </Grid>
        // <Grid item xs={12} align="center">
        //   <Typography variant="h6" componoet="h6">
        //     판매중: {postData.listing_or_not.toString()}
        //   </Typography>
        // </Grid>
  


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

  


  // 아래 class형은 useparams가 왠지 모르겠는데 안먹힘.. 아무리 찾아봐도 원인을 모르겠다. 그래서 위처럼 함수형으로 바꿈

// export default class Item extends Component{

//     constructor(props){
//         super(props);
//         this.state = {
//             image: null,
//             listing_or_not: true,
//             writer: 'writer',
//         };
        
//     }

//     render(){
//         let { postId } = this.props.params;
//         return (
//         <div>
//             {/* <h3>{postId.postId}</h3> */}
//             <p>Image: {this.state.image}</p>
//             <p>Listing_or_not: {this.state.listing_or_not}</p>
//             <p>Writer: {this.state.writer}</p>
//         </div>
//         );
//     }
// }



  // useEffect는 홈페이지 시작될 때마다 실행되는 함수. 이걸로 어케 해볼라 했는데 버튼 클릭하면 session 해제하는 의도랑 다른 거라 냅두고 바꿈
    // useEffect(() => {
    //   console.log(id);
    //   const requestOptions = {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //       };
    //   fetch("/api/leave-item/", requestOptions)
    //     .then((response) => response.json())
    //     .then(data => {this.props.navigate("/"),
    //       setId({
    //         id: data.id
    //       })
    // });
    // console.log(getId);
    //     }, [id, setId])