import express from "express"
import { db } from "../index.js"
import jwt from "jsonwebtoken"


const historyRoutes = express.Router();

// get the latest 10 history records API
historyRoutes.post("/get", (req, res) => {

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `SELECT * FROM SearchHistory WHERE username = '${username}' ORDER BY searchID DESC LIMIT 10`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else {
                    res.status(200).json({message: 'SearchHistory found!', history: sqlData});
                }
            });
        }
    });
});


// Add new history record API
historyRoutes.post("/add", (req, res) => {

    var gameID = req.body.gameID;
    var gameName = req.body.gameName;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            // Insert new history record
            const q = `INSERT INTO SearchHistory (username, gameName, gameID) VALUES ('${username}', '${gameName}', '${gameID}')`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: "New history record inserted!"});
            });
        }
    });
});


// Delete history record API
historyRoutes.delete("/delete/:id", (req, res) => {

    var searchID = req.params.id;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            // Insert new history record
            const q = `DELETE FROM SearchHistory WHERE searchID = ${searchID}`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: "History record deleted!"});
            });
        }
    });
});

export default historyRoutes;
