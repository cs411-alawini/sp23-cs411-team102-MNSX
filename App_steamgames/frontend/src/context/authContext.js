import axios from "axios";
import { createContext, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login = async (inputs) => {
        const res = await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/users/login", inputs, {
            withCredentials: true
        });
        setCurrentUser(res.data.others);
        localStorage.setItem("user", JSON.stringify(res.data.others));
    };

    const clearUser = () => {
        localStorage.removeItem("user");
        setCurrentUser(null);
    };


    return (
        <AuthContext.Provider value={{currentUser, login, clearUser}}>
            {children}
        </AuthContext.Provider>
    );
};
