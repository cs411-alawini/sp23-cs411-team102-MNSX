import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/userAuth.scss"
import { AuthContext } from "../context/authContext";


const Register = () => {

    const [userinfo, setUserinfo] = useState({
        username: "",
        password: ""
    });

    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setUserinfo((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const handleClick = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        try {
            if (userinfo.username && userinfo.password) {
                await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/users/register", userinfo);
                await login(userinfo);
                navigate("/");
            }
        } catch (err) {
            setErr(err.response.data.message);
        }
        setIsLoading(false);
    };


    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Steamgames</span>
                <span className="title">Register</span>
                <form>
                    <input type="username" placeholder="Username" name="username" onChange={handleChange} />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                    {err && <p className="errMessage">{err}</p>}
                    <button onClick={handleClick}>Sign up {isLoading && <i className="fa fa-circle-o-notch fa-spin"></i>}</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here!</Link></p>
            </div>
        </div>
    );
}

export default Register;
