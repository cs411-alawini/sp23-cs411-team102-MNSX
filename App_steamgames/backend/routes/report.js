import express from "express"
import { db } from "../index.js"
import jwt from "jsonwebtoken"

const reportRoutes = express.Router();

// Generate statistic report for genres in searchHistory
reportRoutes.post("/generate/genrereport", (req, res) => {

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `call steamgames.generate_report('${username}', True)`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK', GenreReport: sqlData});
            });
        }
    });
});


// Generate statistic report for game info in searchHistory
reportRoutes.post("/generate/gamereport", (req, res) => {

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `call steamgames.generate_report('${username}', False)`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK', GameReport: sqlData[0]});
            });
        }
    });
});

export default reportRoutes;
