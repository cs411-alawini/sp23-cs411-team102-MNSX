import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "../style/homepage.scss"
import GameInfo from "./GameInfo";


const Homepage = () => {

    const {currentUser, clearUser} = useContext(AuthContext);

    const [gamename, setGamename] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchHistory, setSearchHistory] = useState(null);
    const [genreinfo, setGenreinfo] = useState(null);
    const [actionGames, setActionGames] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState("313px");

    const genreinfoStyle = {
        left: offsetLeft
    };

    const actionGamesStyle = {
        left: offsetLeft
    };

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

    const welcomeSectionRef = useRef();
    const genreinfoRef = useRef();
    const showgenreInfo = () => {
        const welcomeSectionWidth = welcomeSectionRef.current.offsetWidth;
        const genreinfo = document.getElementsByClassName("genreinfo")[0];
        genreinfo.style.display = "block";
        const genreinfoWidth = genreinfoRef.current.offsetWidth;
        const offset = (welcomeSectionWidth - genreinfoWidth) / 2;
        setOffsetLeft(`${offset}px`);
    };

    const closegenreInfo = () => {
        const genreinfo = document.getElementsByClassName("genreinfo")[0];
        genreinfo.style.display = "none";
    };

    const actionGamesRef = useRef();
    const showActionGames = () => {
        const welcomeSectionWidth = welcomeSectionRef.current.offsetWidth;
        const actionGames = document.getElementsByClassName("actionGames")[0];
        actionGames.style.display = "block";
        const actionGamesWidth = actionGamesRef.current.offsetWidth;
        const offset = (welcomeSectionWidth - actionGamesWidth) / 2;
        setOffsetLeft(`${offset}px`);
    };

    const closeActionGames = () => {
        const actionGames = document.getElementsByClassName("actionGames")[0];
        actionGames.style.display = "none";
    };

    useEffect(() => {
        const getgenreinfo = async () => {
            const res = await axios.get("http://localhost:8800/api/games/genreinfo");
            setGenreinfo(res.data.data);
        };

        getgenreinfo();
    }, []);

    useEffect(() => {
        const getActionGames = async () => {
            const res = await axios.get("http://localhost:8800/api/games/actiongames");
            setGenreinfo(res.data.data);
        };

        getActionGames();
    }, []);

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
            <div className="welcomeSection" ref={welcomeSectionRef}>
                <div className="userinfo">
                    {currentUser && <p className="title">Welcome {currentUser.username}!</p>}
                    {currentUser && <button onClick={handleLogout}>Logout</button>}
                </div>
                <p className="startsearch">Search a game to start <span><i className="fa-solid fa-circle-info" onMouseOver={showgenreInfo} onMouseOut={closegenreInfo}></i></span></p>
                <div className="genreinfo" ref={genreinfoRef} style={genreinfoStyle}>
                    {genreinfo && <table>
                        <thead>
                            <tr>
                                <th>genreName</th>
                                <th>AvgRating</th>
                                <th>AvgPrice</th>
                                <th>gameNum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genreinfo?.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.genreName}</td>
                                    <td>{row.AvgRating}</td>
                                    <td>{row.AvgPrice}</td>
                                    <td>{row.gameNum}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                </div>
                <div className="actiongames" ref={actionGamesRef} style={actionGamesStyle}>
                    {actionGames && <table>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>description</th>
                                <th>steamRating</th>
                                <th>price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionGames?.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.name}</td>
                                    <td>{row.description}</td>
                                    <td>{row.steamRating}</td>
                                    <td>{row.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                </div>
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
