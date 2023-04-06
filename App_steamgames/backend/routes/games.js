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
        else {
            res.status(200).json({message: 'Games found!', gameinfo: data});
        }
    });
});


export default gameRoutes;
