import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "../style/homepage.scss"
import GameInfo from "./GameInfo";
import QuerySelector from "./QuerySelector";


const Homepage = () => {

    const {currentUser, clearUser} = useContext(AuthContext);

    const [gamename, setGamename] = useState("");
    const [queryParams, setQueryParams] = useState({
        steamRating_low: 0,
        steamRating_high: 100,
        price_low: 0,
        price_high: 450,
        genre: [],
        platform: [],
    });
    const [additionQparams, setAdditionQparams] = useState({
        genreIntersect: false,
        platformIntersect: false,
        limit: 30
    });
    const [searchResults, setSearchResults] = useState(null);
    const [searchHistory, setSearchHistory] = useState(null);
    // const [friendList, setFriendList] = useState(null);             // new
    const [genreinfo, setGenreinfo] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState("313px");

    const genreinfoStyle = {left: offsetLeft};

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

    // new
    const DeleteFriend = async (username) => {
        await axios.delete(`http://localhost:8800/api/friends/remove/${username}`, {withCredentials: true});
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

    useEffect(() => {
        const getgenreinfo = async () => {
            const res = await axios.get("http://localhost:8800/api/games/genreinfo");
            setGenreinfo(res.data.data);
        };

        getgenreinfo();
    }, []);


    useEffect(() => {
        const checkQueryParams = () => {
            if (JSON.stringify(queryParams) === JSON.stringify({
                steamRating_low: 0,
                steamRating_high: 100,
                price_low: 0,
                price_high: 450,
                genre: [],
                platform: [],
            })) return true;
            else return false;
        };
        
        const Searchgames = async () => {
            if (checkQueryParams() && JSON.stringify(additionQparams) === JSON.stringify({
                genreIntersect: false,
                platformIntersect: false,
                limit: 30
            })) var APIurl = `http://localhost:8800/api/games/search`;
            else APIurl = `http://localhost:8800/api/games/search?steamRating={"low": ${queryParams.steamRating_low}, "high": ${queryParams.steamRating_high}}&price={"low": ${queryParams.price_low}, "high": ${queryParams.price_high}}&genre={"genre": [${queryParams.genre}]}&genreIntersect=${additionQparams.genreIntersect}&platform={"platform": [${queryParams.platform}]}&platformIntersect=${additionQparams.platformIntersect}&limit=${additionQparams.limit}`;

            const res = await axios.post(APIurl, {
                name: gamename
            });
            if (res.data.gameinfo.length === 0) {
                setSearchResults(null);   
            } else {
                setSearchResults(res.data.gameinfo);
            }
        };

        if (gamename !== "" || !checkQueryParams()) {
            Searchgames();
        } else {
            setSearchResults(null);
        }
    }, [gamename, queryParams, additionQparams]);

    useEffect(() => {
        const getHistory = async () => {
            const res = await axios.post("http://localhost:8800/api/history/get", {}, {withCredentials: true});
            setSearchHistory(res.data.history);
        };

        getHistory();
    }, [searchHistory]);

    // is this right???? god I hope so 
    // useEffect(() => {
    //     const getFriends = async () => {
    //         const res = await axios.post("http://localhost:8800/api/friends/get", {}, {withCredentials: true});
    //         setFriendList(res.data.friends);
    //     };

    //     getFriends();
    // }, [friendList]);


    return (
        <div className="homepagewrapper">
            <div className="friendSection">
                {/* <p className="title">Friends</p>
                <div className="friendlist"> 
                    {friendList?.map((friend) => (
                        <p className="friendrecord" key={friend.username}> <span className="deleteicon"><i className="fa-regular fa-trash-can" onClick={(e) => {e.stopPropagation(); DeleteFriend(friend.username)}}></i></span></p>
                    ))}
                </div> */}
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
                <input type="gamename" placeholder="Enter steamgame name..." name="gamename" value={gamename} onChange={(e) => setGamename(e.target.value)} />
                <QuerySelector setQueryParams={setQueryParams} setAdditionQparams={setAdditionQparams} welcomeSectionRef={welcomeSectionRef} />
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
