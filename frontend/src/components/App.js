import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

// 현재 파일의 default 앱
export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {  // state 기록하고 있다가, component 변경사항 있으면 그부분 자동 rendering

        }
    }

    render(){  //< /> :  <> </>를 요약하는 문법
        return (<div>
            <HomePage />
        </div> 
    )}
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);