import express from "express";
import { db } from "../index.js";

const gameRoutes = express.Router();

// Game search by gamename API
gameRoutes.post("/search", (req, res) => {

    var gameName = req.body.name;
    const q1 = `SELECT * FROM Games WHERE name LIKE '%${gameName}%' LIMIT 30`;
    
    db.query(q1, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else {
            res.status(200).json({message: 'Games found!', gameinfo: data});
        }
    });
});


// Game search by gameID
gameRoutes.get("/search/:id", (req, res) => {

    var gameID = req.params.id;
    const q1 = `SELECT * FROM Games WHERE gameID = ${gameID}`;
    
    db.query(q1, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else res.status(200).json({message: 'Games found!', gameinfo: data});
    });
});


// Advanced Query to show the average rating and price, and the total number of games in each genre
gameRoutes.get("/genreinfo", (req, res) => {

    const q = `SELECT genreName, AVG(steamRating) as AvgRating, AVG(price) as AvgPrice, COUNT(gameID) as gameNum FROM Games NATURAL JOIN GenreofGame WHERE steamRating <> 0 GROUP BY genreName`;

    db.query(q, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else res.status(200).json({message: 'OK', data});
    });
});

// Advanced query to find all action games with non-empty descriptions and ratings with a price below 30 and supported by both Windows and Mac. Limits to 15 games.
gameRoutes.get("/actiongames", (req, res) => {
    const q = `SELECT DISTINCT name, description, steamRating, price FROM PlatformofGame NATURAL JOIN (SELECT * FROM Games NATURAL JOIN GenreofGame WHERE genreName = "Action" AND description <> "" AND steamRating <> 0 AND price < 30) as temp WHERE platformName = "PlatformWindows" OR platformName = "PlatformMac" LIMIT 15;`

    db.query(q, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else res.status(200).json({message: 'OK', data});
    });
});


export default gameRoutes;
