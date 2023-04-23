import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import "../style/report.scss"
import axios from "axios";

const SearchReport = () => {

    const { currentUser } = useContext(AuthContext);

    const [genreReport, setGenreReport] = useState(null);
    const [totalSearchNum, setTotalSearchNum] = useState(null);
    const [searchDistinctNum, setSearchDistinctNum] = useState(null);
    const [mostSearchgameID, setMostSearchgameID] = useState(null);
    const [highRateGenreName, setHighRateGenreName] = useState(null);
    const [highRateGamelist, setHighRateGamelist] = useState(null);
    
    useEffect(() => {
        const getGenreReport = async () => {
            const res = await axios.post("http://localhost:8800/api/report/generate/genrereport", {}, {withCredentials: true});
            setGenreReport(res.data.GenreReport[0]);
        };

        const getGameReport = async () => {
            const res = await axios.post("http://localhost:8800/api/report/generate/gamereport", {}, {withCredentials: true});
            setTotalSearchNum(res.data.GameReport[0].TotalSearchNum);
            setSearchDistinctNum(res.data.GameReport[0].SearchDistinctNum);
            setMostSearchgameID(res.data.GameReport[0].MostSearchgameID);
            setHighRateGenreName(res.data.GameReport[0].HighRateGenreName);
            setHighRateGamelist(res.data.GameReport[0].HighRateGamelist);
        };

        getGenreReport();
        getGameReport();
    }, []);


    return (
        <div className="reportWrapper">
            <div className="textsection">
                <p>Hi <span className="statisticNumber">{currentUser.username}</span>!</p>
                <p>So far, you've searched <span className="statisticNumber">{totalSearchNum}</span> times for <span className="statisticNumber">{searchDistinctNum}</span> games.</p>
                <p>You searched for <span className="statisticNumber">{mostSearchgameID}</span> most times, hope you enjoy this game!</p>
                <p>You give a high rate on <span className="statisticNumber">{highRateGenreName}</span> games, and your favourite games are <span className="statisticNumber">{highRateGamelist}</span>...</p>
            </div>
            <div className="genreReport">
                <table>
                    <caption>Search Statistic based on Genres of Games</caption>
                    <thead>
                        <tr>
                            <th>Genre</th>
                            <th>Number of Searches</th>
                            <th>Average SteamRating</th>
                            <th>Average Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genreReport?.map((row) => (
                            <tr key={row.genreName}>
                                <td>{row.genreName}</td>
                                <td>{row.gameNum}</td>
                                <td>{row.AvgRating}</td>
                                <td>{row.AvgPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    );
};

export default SearchReport;
