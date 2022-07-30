import React from 'react';
import './Product.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Cookies } from "react-cookie";

function Login(props) {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const CSRFToken = new Cookies();

    useEffect(() => {
        checkLogined();
        }
    )

    const checkLogined = () => {
        if(localStorage.getItem('token')){
            navigate("/");
            location.reload();
        }
    }

    const handleCreateButtonPressed = () => {
        var requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": CSRFToken.get('csrftoken')},
            body: JSON.stringify({
                username: username,
                password: password
            }),
        };

        fetch("/accounts/login/", requestOptions)
            .then((response) => {
                if(response.ok){
                    return response.json()}
                else{
                    return;
                }})
            .then((data) => {
                if(data != undefined){
                    props.userHasAuthenticated(true, data.username, data.token);
                    checkLogined();
                }
            }
        );
    }

    const handleUserName = (e) => {
        setUsername(e.target.value)
    };

    const handlePassword = (e) => {
        setPassword(e.target.value)
    };
    

    return (
        <section className="section-login t-flex-1 t-flex t-items-center t-justify-center">
            <div className="card t-w-full t-max-w-screen-md mx-4">
                <div className="card-header">
                    <i className="fas fa-sign-in-alt"></i> 로그인
                </div>
                <div className="card-body">
                    <input type="text" name="username" autofocus="" autocapitalize="none" autocomplete="username" maxlength="150" className="form-control" placeholder="아이디" required="" id="id_username" onChange={(e) => handleUserName(e)} />
                    <input type="password" name="password" autocomplete="current-password" className="form-control" placeholder="비밀번호" required="" id="id_password" onChange={(e) => handlePassword(e)} />
                    <button type="submit" className="btn-outline-primary" onClick={() => handleCreateButtonPressed()}><i className='fas fa-user-plus'></i>로그인</button>
                    {/* <button type="reset" class="btn-outline-primary">취소</button> */}
                </div>
            </div>
        </section>
    );
}
export default Login;