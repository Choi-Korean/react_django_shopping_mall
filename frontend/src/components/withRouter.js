// CreateItemPage에서 사용함. 근데 이렇게 해놓으면 어디서든 쓸 수 있겠다.
// props.history,push 대체품인 withRouter를 사용할럤더니 이것도 사라져서 함수로 만들어야 됨..
// 쨌든, 여기에서 useNavigate 쓰려면 export default 빼야 하는듯? 그리고 이거 빼려면 withRouter써야되는 거 같은데.

import React, { Component } from "react";
import { useNavigate } from 'react-router-dom';

export const withRouter = (Component) => {
const Wrapper = (props) => {
    const navigate = useNavigate();

    return (
    <Component
        navigate={navigate}
        //  ... : spread operator. 넘겨진 props(properties) 전부 써줌. props 일일히 써주는 작업 없애주는 약속어?
        {...props}
        />
    );
};

return Wrapper;
};