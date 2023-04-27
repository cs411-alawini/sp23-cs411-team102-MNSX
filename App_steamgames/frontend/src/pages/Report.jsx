import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import "../style/report.scss"
import axios from "axios";

const SearchReport = () => {

    const { currentUser } = useContext(AuthContext);

    const [genreReport, setGenreReport] = useState(null);
    const [totalSearchNum, setTotalSearchNum] = useState(null);
    const [searchDistinctNum, setSearchDistinctNum] = useState(null);
    const [mostSearchgameName, setMostSearchgameName] = useState(null);
    const [highRateGenreName, setHighRateGenreName] = useState(null);
    const [highRateGamelist, setHighRateGamelist] = useState(null);
    
    useEffect(() => {
        const generateReport = async () => {
            const res = await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/report/generate", {}, {withCredentials: true});
            setGenreReport(res.data.reportData[1]);

            if (res.data.reportData[0][0].TotalSearchNum === null) setTotalSearchNum("__");
            else setTotalSearchNum(res.data.reportData[0][0].TotalSearchNum);
            if (res.data.reportData[0][0].SearchDistinctNum === null) setSearchDistinctNum("__");
            else setSearchDistinctNum(res.data.reportData[0][0].SearchDistinctNum);
            if (res.data.reportData[0][0].MostSearchgameName === null) setMostSearchgameName("__");
            else setMostSearchgameName(res.data.reportData[0][0].MostSearchgameName);
            if (res.data.reportData[0][0].HighRateGenreName === null) setHighRateGenreName("__");
            else setHighRateGenreName(res.data.reportData[0][0].HighRateGenreName);
            if (res.data.reportData[0][0].HighRateGamelist === "") setHighRateGamelist("__");
            else setHighRateGamelist(res.data.reportData[0][0].HighRateGamelist);
        };

        generateReport();
    }, []);


    return (
        <div className="reportWrapper">
            <div className="textsection">
                <p>Hi <span className="statisticNumber">{currentUser.username}</span>!</p>
                <p>So far, you've searched <span className="statisticNumber">{totalSearchNum}</span> times for <span className="statisticNumber">{searchDistinctNum}</span> games.</p>
                <p>You searched for <span className="statisticNumber">{mostSearchgameName}</span> most times, hope you enjoy this game!</p>
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
