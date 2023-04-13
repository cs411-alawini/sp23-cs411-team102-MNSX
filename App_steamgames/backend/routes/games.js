import express from "express";
import { db } from "../index.js";

const gameRoutes = express.Router();

// API for keyword search with query parameters (steamRating, price, genre, platform) and the gameName. This is an Advanced Query search.
gameRoutes.post("/search", (req, res) => {

    // For example: SELECT DISTINCT gameID, name, description, steamRating, price, website, genreList, platformList FROM PlatformofGame NATURAL JOIN (SELECT * FROM Games NATURAL JOIN GenreofGame WHERE genreName = "Action" AND (steamRating >= 10 AND steamRating <=80) AND (price >=5 AND price <= 30)) as temp WHERE platformName = "PlatformWindows" OR platformName = "PlatformMac" LIMIT 30;

    var gameName = req.body.name;
    var q = `SELECT DISTINCT gameID, name, description, steamRating, price, website, genreList, platformList FROM PlatformofGame NATURAL JOIN (SELECT * FROM Games NATURAL JOIN GenreofGame WHERE name LIKE '%${gameName}%'`;

    var genreIntersect = false;
    var platformIntersect = false;
    if (req.query.genreIntersect) genreIntersect = req.query.genreIntersect;
    if (req.query.platformIntersect) platformIntersect = req.query.platformIntersect;

    var steamRating, price, genre, platform;
    if (req.query.genre) {
        genre = JSON.parse(req.query.genre);
        const genreList = genre.genre;
        if (genreList.length > 0) {
            if (genreIntersect === "true") {
                q += ` AND (`;
                genreList.map((genre, idx) => {
                    q += `genreList LIKE '%${genre}%'`;
                    if (idx !== genreList.length-1) q += ` AND `;
                    else q += `)`;
                });   
            }
            else {
                q += ` AND (`;
                genreList.map((genre, idx) => {
                    q += `genreName = '${genre}'`;
                    if (idx !== genreList.length-1) q += ` OR `;
                    else q += `)`;
                });   
            }
        }
    }

    if (req.query.steamRating) {
        steamRating = JSON.parse(req.query.steamRating);
        q += ` AND (steamRating >= ${steamRating.low} AND steamRating <= ${steamRating.high})`;
    }

    if (req.query.price) {
        price = JSON.parse(req.query.price);
        q += ` AND (price >= ${price.low} AND price <= ${price.high})`;
    }

    q += `) as temp`;

    if (req.query.platform) {
        platform = JSON.parse(req.query.platform);
        const platformList = platform.platform;
        if (platformList.length > 0) {
            if (platformIntersect === "true") {
                q += ` WHERE (`;
                platformList.map((platform, idx) => {
                    q += `platformList LIKE '%${platform}%'`;
                    if (idx !== platformList.length-1) q += ` AND `;
                    else q += `)`;
                });
            }   
            else {
                q += ` WHERE `;
                platformList.map((platform, idx) => {
                    q += `platformName = '${platform}'`;
                    if (idx !== platformList.length-1) q += ` OR `;
                });   
            }
        }
    }

    if (req.query.limit) {
        const limit = req.query.limit;
        q += ` LIMIT ${limit}`
    } else {
        q += ` LIMIT 30`;
    }

    db.query(q, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else {
            res.status(200).json({message: 'Games found!', gameinfo: data});
        }
    });
});


// Game search by gameID API
gameRoutes.get("/search/:id", (req, res) => {

    var gameID = req.params.id;
    const q = `SELECT * FROM Games WHERE gameID = ${gameID}`;
    
    db.query(q, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else res.status(200).json({message: 'Games found!', gameinfo: data});
    });
});


// Advanced Query to show the average rating and price, and the total number of games in each genre.
gameRoutes.get("/genreinfo", (req, res) => {

    const q = `SELECT genreName, AVG(steamRating) as AvgRating, AVG(price) as AvgPrice, COUNT(gameID) as gameNum FROM Games NATURAL JOIN GenreofGame WHERE steamRating <> 0 GROUP BY genreName`;

    db.query(q, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else res.status(200).json({message: 'OK', data});
    });
});

export default gameRoutes;
