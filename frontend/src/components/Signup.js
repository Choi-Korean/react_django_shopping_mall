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
            <div className="card-header"><i className="fas fa-user-plus"></i> ????????????</div>
            <div className="card-body">
                <div>
                    <div className="mb-3">
                        <label className="form-label" for="id_username">?????????</label>
                        <input type="text" name="username" maxlength="150" autocapitalize="none" autocomplete="username" autofocus="" className="form-control" placeholder="?????????" required="" id="id_username" onChange={(e) => handleUserName(e)}/>
                        <div className="form-text">150??? ?????? ??????, ?????? ????????? @/./+/-/_??? ???????????????.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_password1">????????????</label>
                        <input type="password" name="password1" autocomplete="new-password" className="form-control" placeholder="????????????" required="" id="id_password1" onChange={(e) => handlePassword(e)} />
                        <div className="form-text"><ul><li>?????? ?????? ????????? ????????? ??????????????? ????????? ??? ????????????.</li><li>??????????????? ?????? 8??? ??????????????? ?????????.</li><li>??????????????? ?????? ???????????? ??????????????? ????????? ??? ????????????.</li><li>???????????? ???????????? ??????????????? ????????? ??? ????????????.</li></ul></div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_password2">???????????? ??????</label>
                        <input type="password" name="password2" autocomplete="new-password" className="form-control" placeholder="???????????? ??????" required="" id="id_password2"></input>
                        <div className="form-text">????????? ?????? ????????? ????????? ??????????????? ???????????????. </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_email">????????? ??????</label>
                        <input type="email" name="email" maxlength="254" className="form-control" placeholder="????????? ??????" required="" id="id_email" onChange={(e) => handleEmail(e)}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_name">??????</label>
                        <input type="text" name="name" maxlength="100" className="form-control" placeholder="??????" required="" id="id_name" onChange={(e) => handleName(e)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_gender">??????</label>
                        <select name="gender" className="form-select" id="id_gender" onChange={(e) => handleGender(e)}>
                            <option value="" selected="">---------</option>
                            <option value="M">??????</option>
                            <option value="F">??????</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" for="id_profile_img">??????????????????</label>
                        <input type="file" name="profile_img" accept="image/png, image/gif, image/jpeg" className="form-control" id="id_profile_img" onChange={(e) => handleImage(e)}/>
                        <div className="form-text">gif/png/jpg ???????????? ?????????????????????.</div>
                    </div>

                    <button type="submit" className="btn-outline-primary" onClick={() => handleCreateButtonPressed()}><i className='fas fa-user-plus'></i>????????????</button>
                    {/* <Button type="reset" class="btn-outline-primary">??????</Button> */}
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