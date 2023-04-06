import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "../style/homepage.scss"
import GameInfo from "./GameInfo";


const Homepage = () => {

    const {currentUser, clearUser} = useContext(AuthContext);

    const [gamename, setGamename] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchHistory, setSearchHistory] = useState(null);

    const handleLogout = async () => {
        await axios.post("http://localhost:8800/api/users/logout");
        clearUser();
    };

    const ClickHistory = async (gameID) => {
        setGamename("");
        setSearchResults(null);
        const res = await axios.get(`http://localhost:8800/api/games/search/${gameID}`);
        setSearchResults(res.data.gameinfo);
    };

    const DeleteHistory = async (searchID) => {
        await axios.delete(`http://localhost:8800/api/history/delete/${searchID}`, {withCredentials: true});
    }

    useEffect(() => {
        const Searchgames = async () => {
            const res = await axios.post("http://localhost:8800/api/games/search", {
                name: gamename
            });
            if (res.data.gameinfo.length === 0) {
                setSearchResults(null);   
            } else {
                setSearchResults(res.data.gameinfo);
            }
        };

        if (gamename !== "") {
            Searchgames();
        } else {
            setSearchResults(null);
        }
    }, [gamename]);

    useEffect(() => {
        const getHistory = async () => {
            const res = await axios.post("http://localhost:8800/api/history/get", {}, {withCredentials: true});
            setSearchHistory(res.data.history);
        };

        getHistory();
    }, [searchHistory]);


    return (
        <div className="homepagewrapper">
            <div className="friendSection">
                <p className="title">Friends</p>
            </div>
            <div className="welcomeSection">
                <div className="userinfo">
                    {currentUser && <p className="title">Welcome {currentUser.username}!</p>}
                    {currentUser && <button onClick={handleLogout}>Logout</button>}
                </div>
                <p className="startsearch">Search a game to start</p>
                <input type="gamename" placeholder="Enter steamgame name..." name="gamename" value={gamename} onChange={(e) => setGamename(e.target.value)} />
                <div className="searchresults">
                    {searchResults?.map((game) => (
                        <GameInfo game={game} key={game.gameID}/>
                    ))}
                </div>
            </div>
            <div className="historySection">
                <p className="title">History</p>
                <div className="historylist">
                    {searchHistory?.map((history) => (
                        <p className="historyrecord" key={history.searchID} onClick={() => ClickHistory(history.gameID)}>{history.gameName}<span className="deleteicon"><i className="fa-regular fa-trash-can" onClick={(e) => {e.stopPropagation(); DeleteHistory(history.searchID)}}></i></span></p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
