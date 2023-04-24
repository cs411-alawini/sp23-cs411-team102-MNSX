import express from "express";
import { db } from "../index.js";
import jwt from "jsonwebtoken"

const friendRoutes = express.Router();

// Get friend list API
friendRoutes.get("/friendlist", (req, res) => {

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `SELECT friendname FROM Friends WHERE username = '${username}'`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK', friendlist: sqlData});
            });
        }
    });   
});


// Remove friend API
friendRoutes.post("/remove", (req, res) => {

    var friendname = req.body.friendname;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q1 = `DELETE FROM Friends WHERE username = '${username}' AND friendname = '${friendname}'`;
            db.query(q1, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else {
                    const q2 = `DELETE FROM Friends WHERE username = '${friendname}' AND friendname = '${username}'`;
                    db.query(q2, (err, data) => {
                        if (err) res.status(500).json({message: err.message});
                        else res.status(200).json({message: 'OK'});
                    })
                }
            });
        }
    });
});


// Add new friends API
friendRoutes.post("/add", (req, res) => {

    var friendname = req.body.friendname;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q1 = `INSERT INTO Friends VALUES ('${username}', '${friendname}')`;
            db.query(q1, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else {
                    const q2 = `INSERT INTO Friends VALUES ('${friendname}', '${username}')`;
                    db.query(q2, (err, data) => {
                        if (err) res.status(500).json({message: err.message});
                        else res.status(200).json({message: 'OK'});
                    })
                }
            });
        }
    });
});


// get current addfriendstatus API
friendRoutes.get("/getstatus", (req, res) => {

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `SELECT status FROM AddFriendStatus WHERE username = '${username}'`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK', currentStatus: sqlData});
            });
        }
    });
});


// Update addfriendstatus API
friendRoutes.post("/changestatus", (req, res) => {

    var newStatus = req.body.status;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `UPDATE AddFriendStatus SET status = '${newStatus}' WHERE username = '${username}'`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK'});
            });
        }
    });
});


// get friendsNum API
friendRoutes.get("/getnum", (req, res) => {

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, "CS411finalprojectsteamgamessecretkey", (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `SELECT friendsNum FROM Users WHERE username = '${username}'`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK', friendsNum: sqlData});
            });
        }
    });
});

export default friendRoutes;
