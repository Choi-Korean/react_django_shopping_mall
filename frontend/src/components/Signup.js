import React from 'react';
import './Product.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function Signup({ }) {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleCreateButtonPressed = () => {
        var requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            }),
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
        setUsername(e.target.value)
    };

    const handlePassword = (e) => {
        setPassword(e.target.value)
    };
    

    return (

        <div className="signup">
            <input type="text" id="username" onChange={(e) => handleUserName(e)} />
            <input type="text" id="password" onChange={(e) => handlePassword(e)} />
            <Button color="primary" variant="contained" onClick={() => handleCreateButtonPressed()}>Sign Up</Button>
        </div>
    );
}

export default Signup;