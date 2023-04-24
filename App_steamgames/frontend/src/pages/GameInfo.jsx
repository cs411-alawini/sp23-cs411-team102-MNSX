import axios from "axios";
import React, { useEffect, useState } from "react";


const GameInfo = (props) => {
    const {game} = props;
    const [showinfo, setShowinfo] = useState(false);
    const [err, setErr] = useState(false);
    const [currentRating, setCurrentRaing] = useState(null);

    const handleClick = async () => {
        setShowinfo(true);
        await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/history/add", {
            gameID: game.gameID,
            gameName: game.name
        }, {withCredentials: true});
        const res = await axios.get(`https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/rating/get/${game.gameID}`, {withCredentials: true});
        if (res.data.rating.length > 0) {
            setCurrentRaing(res.data.rating[0].rating);
        }
    };

    useEffect(() => {
        const stars = document.getElementsByClassName("star -"+game.gameID);
        for (let i = 0; i < stars.length; i++) {
            stars[i].classList.remove("active");
            if (i < currentRating) {
                stars[i].classList.add("active");
            }
        }
    }, [currentRating, game.gameID]);

    const setUserRating = async (idx) => {
        if (currentRating !== idx) {
            setCurrentRaing(idx);
            await axios.post("https://us-central1-cs411-finalproject-378600.cloudfunctions.net/cs411-steamgames-backend/api/rating/set", {
                gameid: game.gameID,
                rating: idx
            }, {withCredentials: true});
        }
    };


    return (
        <>
            {!showinfo && <div className="gameicon" onClick={handleClick}>
                <img src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.gameID}/header.jpg`} alt="Game-poster" />
                <p className="gamename">{game.name}</p>
            </div>}
            {showinfo && <div className="gameinfo">
                {!err && <img src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.gameID}/library_600x900.jpg`} alt="Game-poster" onError={() => setErr(true)} />}
                <div className="infolist">
                    <h3>{game.name}</h3>
                    <p>GameID: {game.gameID}</p>
                    <p>Description: {game.description}</p>
                    <p>SteamRating: {game.steamRating}</p>
                    <p>Price: ${game.price}</p>
                    <p>Website: {game.website}</p>
                    <p>Genres: {game.genreList}</p>
                    <p>Platforms: {game.platformList}</p>
                    <p>
                        Your Rating: 
                        <span className="ratingstars">
                            <i className={`fa-solid fa-star star -${game.gameID}`} onClick={() => setUserRating(1)}></i>
                            <i className={`fa-solid fa-star star -${game.gameID}`} onClick={() => setUserRating(2)}></i>
                            <i className={`fa-solid fa-star star -${game.gameID}`} onClick={() => setUserRating(3)}></i>
                            <i className={`fa-solid fa-star star -${game.gameID}`} onClick={() => setUserRating(4)}></i>
                            <i className={`fa-solid fa-star star -${game.gameID}`} onClick={() => setUserRating(5)}></i>
                        </span>
                    </p>
                </div>
                <i className="fa-regular fa-circle-xmark closeicon" onClick={() => setShowinfo(false)}></i>
            </div>}
        </>
    );
};

export default GameInfo;
