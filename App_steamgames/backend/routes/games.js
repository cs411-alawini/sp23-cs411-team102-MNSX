import express from "express";
import { db } from "../index.js";

const gameRoutes = express.Router();

// Game search API
gameRoutes.post("/search/keyword", (req, res) => {
    // Check if game has keyword
    var gameName = req.body.name;
    const q1 = `SELECT * FROM Games WHERE name = '%${gameName}%'`;
    
    db.query(q1, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else {
            res.status(200).json({message: 'Games found!', data});
        }
    });
});


export default gameRoutes;
