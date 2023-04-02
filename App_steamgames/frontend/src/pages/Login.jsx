import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/userAuth.scss"
import { AuthContext } from "../context/authContext";


const Login = () => {

    const [userinfo, setUserinfo] = useState({
        username: "",
        password: ""
    });

    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        setUserinfo((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (userinfo.username && userinfo.password) {
                await login(userinfo);
                navigate("/");
            }
        } catch (err) {
            setErr(err.response.data.message);
        }
    };


    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Steamgames</span>
                <span className="title">Login</span>
                <form>
                    <input type="username" placeholder="Username" name="username" onChange={handleChange} />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                    {err && <p className="errMessage">{err}</p>}
                    <button onClick={handleLogin}>Sign in</button>
                </form>
                <p>New user? <Link to="/register">Register now!</Link></p>
            </div>
        </div>
    );
}

export default Login;
