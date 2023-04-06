import express from "express";
import { db } from "../index.js";

const friendRoutes = express.Router();

// Remove friend API
friendRoutes.post("/remove", (req, res) => {
    // Check if friend exists
    var friendUser = req.body.username;
    const q1 = `SELECT * FROM Friends WHERE username = '${friendUser}'`;
    
    db.query(q1, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else if (results.length === 0) {
            res.status(404).json({message: `Friend with username '${friendUser}' not found!`});
        } else {
            // Remove the friend
            const q2 = `DELETE FROM Friends WHERE username = '${friendUser}'`;
            connection.query(q2, (err) => {
                if (err) {
                    res.status(500).json({message: err.message});
                } else {
                    res.status(200).json({message: `Friend with username '${friendUser}' has been removed.`});
                }
            });
        }
    });      
});

export default friendRoutes;
