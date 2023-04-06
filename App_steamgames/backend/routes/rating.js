import express from "express"
import { db } from "../index.js"
import jwt from "jsonwebtoken"

const ratingRoutes = express.Router();

// Get user rating for a game API
ratingRoutes.get("/get/:id", (req, res) => {

    var gameID = req.params.id;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, process.env.SECRET_KEY, (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `SELECT rating FROM Ratings WHERE username = '${username}' AND gameID = ${gameID}`;
            db.query(q, (err, sqlData) => {
                if (err) res.status(500).json({message: err.message});
                else {
                    res.status(200).json({message: 'SearchHistory found!', rating: sqlData});
                }
            });
        }
    });
});


// Set (or update) user rating for a game API
ratingRoutes.post("/set", (req, res) => {

    var gameID = req.body.gameid;
    var rating = req.body.rating;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, process.env.SECRET_KEY, (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            // check if already rated before
            const q1 = `SELECT * FROM Ratings WHERE username = '${username}' AND gameID = ${gameID}`;
            db.query(q1, (err1, sqlData1) => {
                if (err1) res.status(500).json({message: err.message});
                else {
                    if (sqlData1.length > 0) {
                        // update the rating
                        const q2 = `UPDATE Ratings SET rating = ${rating} WHERE username = '${username}' AND gameID = ${gameID}`;
                        db.query(q2, (err2, sqlData2) => {
                            if (err2) res.status(500).json({message: err.message});
                            else res.status(200).json({message: "Rating updated!"});
                        })
                    }
                    else {
                        // insert new rating
                        const q3 = `INSERT INTO Ratings (username, gameID, rating) VALUES ('${username}', ${gameID}, ${rating})`;
                        db.query(q3, (err3, sqlData3) => {
                            if (err3) res.status(500).json({message: err.message});
                            else res.status(200).json({message: "Rating added!"});
                        })
                    }
                }
            });
        }
    });
});

export default ratingRoutes;
