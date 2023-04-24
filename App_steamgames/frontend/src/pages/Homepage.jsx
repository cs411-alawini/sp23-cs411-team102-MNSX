import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "../style/homepage.scss"
import GameInfo from "./GameInfo";
import QuerySelector from "./QuerySelector";
import { FormControlLabel, Switch } from '@mui/material';


const Homepage = () => {

    const {currentUser, clearUser} = useContext(AuthContext);

    const [friendsNum, setFriendsNum] = useState(null);
    const [searchname, setSearchname] = useState("");
    const [userlist, setUserlist] = useState(null);
    const [addfriendstatus, setAddfriendstatus] = useState(true);
    const [friendlist, setFriendlist] = useState(null);

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
    const [genreinfo, setGenreinfo] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState("313px");

    const genreinfoStyle = {left: offsetLeft};

    const handleLogout = async () => {
        await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/users/logout");
        clearUser();
    };

    const ClickHistory = async (gameID) => {
        setGamename("");
        setSearchResults(null);
        const res = await axios.get(`https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/games/search/${gameID}`);
        setSearchResults(res.data.gameinfo);
    };

    const DeleteHistory = async (searchID) => {
        await axios.delete(`https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/history/delete/${searchID}`, {withCredentials: true});
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

    const updateAddfriendStatus = async () => {
        await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/friends/changestatus", {
            status: (addfriendstatus ? "False" : "True")
        }, {withCredentials: true});

        setAddfriendstatus(!addfriendstatus);
    };

    const handleDeletefriend = async (friendname) => {
        await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/friends/remove", {
            friendname: friendname
        }, {withCredentials: true});
        setFriendlist(friendlist.filter((f) => {return f !== friendname}));
        setFriendsNum(friendsNum - 1);
    };

    const checknewfriend = (username) => {
        const checklist = friendlist.filter((f) => {return f === username});
        if (checklist.length > 0) return false;
        else return true;
    };

    const handleAddfriend = async (newfriend) => {
        await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/friends/add", {
            friendname: newfriend.username
        }, {withCredentials: true});
        setUserlist(userlist.filter((u) => {return u !== newfriend}));
        setFriendlist(friendlist.concat([newfriend.username]));
        setFriendsNum(friendsNum + 1);
    };

    const navigate = useNavigate();
    const handleReport = (e) => {
        e.preventDefault();
        navigate("/report");
    };


    useEffect(() => {
        const getgenreinfo = async () => {
            const res = await axios.get("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/games/genreinfo");
            setGenreinfo(res.data.data);
        };

        const getaddfriendstatus = async () => {
            const res = await axios.get("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/friends/getstatus", {withCredentials: true});
            if (res.data.currentStatus[0].status === "True") setAddfriendstatus(true);
            else setAddfriendstatus(false);
        };

        const getfriendlist = async () => {
            const res = await axios.get("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/friends/friendlist", {withCredentials: true});
            var flist = [];
            res.data.friendlist.map((f) => {
                flist.push(f.friendname);
                return 1;
            });
            setFriendlist(flist);
        };

        const getfriendsNum = async () => {
            const res = await axios.get("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/friends/getnum", {withCredentials: true});
            setFriendsNum(res.data.friendsNum[0].friendsNum);
        };

        getfriendsNum();
        getaddfriendstatus();
        getfriendlist();
        getgenreinfo();
    }, []);

    useEffect(() => {
        const searchusers = async () => {
            const res = await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/users/findusers", {
                searchname: searchname
            }, {withCredentials: true});
            setUserlist(res.data.userlist);
        };

        if (searchname !== "") searchusers();
        else setUserlist(null);
    }, [searchname]);

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
            })) var APIurl = `https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/games/search`;
            else APIurl = `https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/games/search?steamRating={"low": ${queryParams.steamRating_low}, "high": ${queryParams.steamRating_high}}&price={"low": ${queryParams.price_low}, "high": ${queryParams.price_high}}&genre={"genre": [${queryParams.genre}]}&genreIntersect=${additionQparams.genreIntersect}&platform={"platform": [${queryParams.platform}]}&platformIntersect=${additionQparams.platformIntersect}&limit=${additionQparams.limit}`;

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
            const res = await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/history/get", {}, {withCredentials: true});
            setSearchHistory(res.data.history);
        };

        getHistory();
    }, [searchHistory]);


    return (
        <div className="homepagewrapper">
            <div className="historySection">
                <p className="title">History</p>
                <div className="historylist">
                    {searchHistory?.map((history) => (
                        <p className="historyrecord" key={history.searchID} onClick={() => ClickHistory(history.gameID)}>{history.gameName}<span className="deleteicon"><i className="fa-regular fa-trash-can" onClick={(e) => {e.stopPropagation(); DeleteHistory(history.searchID)}}></i></span></p>
                    ))}
                </div>
                <div className="reportbutton">
                    <button onClick={(e) => handleReport(e)}>Generate Report</button>
                </div>
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
            <div className="friendSection">
                <p className="title">Friends ({friendsNum})</p>
                <FormControlLabel className="disturbmodecontrol" control={<Switch color="warning" size="small" checked={!addfriendstatus} onChange={updateAddfriendStatus} />} label="No Disturb Mode" />
                <div className="searchuser">
                    <input type="username" placeholder="Search new friends..." value={searchname} onChange={(e) => setSearchname(e.target.value)} />
                    <div className="resultlist">
                        {userlist?.map((user) => {
                            if (checknewfriend(user.username))
                                return (
                                    <p key={user.username} className="newfriend"><i className="fa-solid fa-user-plus addfriendicon" onClick={(e) => {e.preventDefault(); handleAddfriend(user)}}></i> {user.username}</p>
                                )
                            return null;
                        })}
                    </div>
                </div>
                <div className="friendlist">
                    {friendlist?.map((friend) => (
                        <p className="friendname" key={friend}><i className="fa-regular fa-user usericon"></i> {friend} <i className="fa-regular fa-trash-can trashcanicon" onClick={(e) => {e.preventDefault(); handleDeletefriend(friend)}}></i></p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
