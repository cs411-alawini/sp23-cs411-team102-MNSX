import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";


const Homepage = () => {

    const {currentUser, clearUser} = useContext(AuthContext);

    const handleLogout = async () => {
        await axios.post("http://localhost:8800/api/users/logout");
        clearUser();
    };


    return (
        <div>
            <h1>This is the Homepage of steamgames</h1>
            {currentUser && <p>Hi {currentUser.username}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Homepage;
