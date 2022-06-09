import React, { Component } from "react";
// import { render } from "react-dom";  // 이 개같은거 이제 React 18부터는 안씀
import HomePage from "./HomePage";
import {createRoot} from 'react-dom/client';

// 현재 파일의 default 앱
export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {  // state 기록하고 있다가, component 변경사항 있으면 그부분 자동 rendering

        }
    }

    render(){  //< /> :  <> </>를 요약하는 문법
        return (<div>
            <HomePage>
            </HomePage>
        </div> 
    )}
}

// 위 {render} 안써서, 이렇게 createRoot으로 감싸주고 얘로 render 해야 됨
const root = createRoot(document.getElementById("app"));
root.render(<App />);