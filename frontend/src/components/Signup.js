import React from 'react';
import './Product.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Cookies } from "react-cookie";

function Signup({ }) {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [gender, setGender] = useState();
    const [image, setImage] = useState();
    const navigate = useNavigate();
    const CSRFToken = new Cookies();

    const handleCreateButtonPressed = () => {
        const uploadData = new FormData();
        uploadData.append('profile_img', image, image.name);
        uploadData.append('username', username);
        uploadData.append('password', password);
        uploadData.append('email', email);
        uploadData.append('name', name);
        uploadData.append('gender', gender);

        var requestOptions = {
            method: "POST",
            headers: {"X-CSRFToken": CSRFToken.get('csrftoken')},  //"Content-Type": "application/json", 
            body: uploadData,
            //     JSON.stringify({
            //     username: username,
            //     password: password,
            //     email: email,
            //     name: name,
            //     gender: gender,
            //     profile_img: image,
            // }),
        };

        fetch("/users/signup/", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                navigate('/info');
            }
        );
    }

    const handleUserName = (e) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleGender = (e) => {
        console.log(e.target.value);
        setGender(e.target.value);
    };

    const handleImage = (e) => {
        let file = e.target.files[0];
        console.log(file);
        setImage(file);
    };
    

    return (
        <section className="section-join t-flex-1 t-flex t-items-center t-justify-center">
        <div className="card t-w-full t-max-w-screen-md mx-4">
            <div className="card-header"><i className="fas fa-user-plus"></i> 회원가입</div>
            <div className="card-body">
                <div>
                    <div className="mb-3">
                        <label className="form-label" for="id_username">아이디</label>
                        <input type="text" name="username" maxlength="150" autocapitalize="none" autocomplete="username" autofocus="" className="form-control" placeholder="아이디" required="" id="id_username" onChange={(e) => handleUserName(e)}/>
                        <div className="form-text">150자 이하 문자, 숫자 그리고 @/./+/-/_만 가능합니다.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_password1">비밀번호</label>
                        <input type="password" name="password1" autocomplete="new-password" className="form-control" placeholder="비밀번호" required="" id="id_password1" onChange={(e) => handlePassword(e)} />
                        <div className="form-text"><ul><li>다른 개인 정보와 유사한 비밀번호는 사용할 수 없습니다.</li><li>비밀번호는 최소 8자 이상이어야 합니다.</li><li>통상적으로 자주 사용되는 비밀번호는 사용할 수 없습니다.</li><li>숫자로만 이루어진 비밀번호는 사용할 수 없습니다.</li></ul></div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_password2">비밀번호 확인</label>
                        <input type="password" name="password2" autocomplete="new-password" className="form-control" placeholder="비밀번호 확인" required="" id="id_password2"></input>
                        <div className="form-text">확인을 위해 이전과 동일한 비밀번호를 입력하세요. </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_email">이메일 주소</label>
                        <input type="email" name="email" maxlength="254" className="form-control" placeholder="이메일 주소" required="" id="id_email" onChange={(e) => handleEmail(e)}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_name">이름</label>
                        <input type="text" name="name" maxlength="100" className="form-control" placeholder="이름" required="" id="id_name" onChange={(e) => handleName(e)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_gender">성별</label>
                        <select name="gender" className="form-select" id="id_gender" onChange={(e) => handleGender(e)}>
                            <option value="" selected="">---------</option>
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_profile_img">프로필이미지</label>
                        <input type="file" name="profile_img" accept="image/png, image/gif, image/jpeg" className="form-control" id="id_profile_img" onChange={(e) => handleImage(e)}/>
                        <div className="form-text">gif/png/jpg 이미지를 업로드해주세요.</div>
                    </div>

                    <button type="submit" className="btn-outline-primary" onClick={() => handleCreateButtonPressed()}><i className='fas fa-user-plus'></i>회원가입</button>
                    {/* <Button type="reset" class="btn-outline-primary">취소</Button> */}
                </div>
            </div>
        </div>
        <div className="signup">
            <input type="text" id="password" />
        </div>
    </section>
    );
}

export default Signup;