import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';   // react-router-dom v6부터는 이걸로 params 가져와야 된대.. 아 이거때문에 40분 날렸네. 근데 안되네 ㅋㅋ
// function 형으로 바꿔야 할듯.. 아 짜증나. class에서는 useParams가 안먹히는거 같어
 // https://github.com/remix-run/react-router/issues/8146
import { withRouter } from "react-router-dom";

export default function Item(props) {
    const initialState = {
      image: null,
      listing_or_not: true,
      writer: 'writer'
    }
    const [postData, setPostData] = useState(initialState) 
    const { id } = useParams()
  
    useEffect(() => {
      fetch("/api/get-item" + "?id=" + id)
        .then(res => res.json())
        .then(data => {
            setPostData({
            ...postData, 
            image: data.image,
            listing_or_not: data.listing_or_not,
            writer: data.writer,
          })
        })
    },[id,setPostData]) //It renders when the object changes .If we use roomData and/or roomCode then it rerenders infinite times
    return (
      <div>
        <h3>{id}</h3>
        <p>Votes: {postData.image}</p>  
        <p>Guest: {postData.listing_or_not.toString()}</p>
        <p>Host: {postData.writer.toString()}</p>  
      </div>
    )
  }

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