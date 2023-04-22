import express from "express"
import { db } from "../index.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from 'dotenv';
config();


const userRoutes = express.Router();

// Register API
userRoutes.post("/register", (req, res) => {

    // Check if username exists
    var newUsername = req.body.username;
    const q1 = `SELECT * FROM Users WHERE username = '${newUsername}'`;
    db.query(q1, (err, data) => {
        if (err) res.status(500).json({message: err.message});
        else if (data.length > 0) res.status(409).json({message: 'Username already exists!'});
        else {
            // Create new user
            var newPassword = req.body.password;
            // Hash user password
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(newPassword, salt);
            const q2 = `INSERT INTO Users (username, password) VALUES ('${newUsername}', '${hashPassword}')`;
            db.query(q2, (err, data) => {
                if (err) res.status(500).json({message: err.message});
                else {
                    const q3 = `INSERT INTO AddFriendStatus (username) VALUES ('${newUsername}')`;
                    db.query(q3, (err, data) => {
                        if (err) res.status(500).json({message: err.message});
                        else res.status(200).json({message: 'User created!'});
                    })
                }
            });
        }
    });
});


// Login API
userRoutes.post("/login", (req, res) => {

    // Check if username exists
    const q = `SELECT * FROM Users WHERE username = '${req.body.username}'`;
    db.query(q, (err, sqlData) => {
        if (err) res.status(500).json({message: err.message});
        else if (sqlData.length === 0) res.status(404).json({message: 'User not found!'});
        else {
            // Check password
            const checkPassword = bcrypt.compareSync(req.body.password, sqlData[0].password);
            if(!checkPassword) res.status(400).json({message: 'Wrong password or username!'});
            else {
                // Generate user jwt token and cookie
                const token = jwt.sign({username: sqlData[0].username}, process.env.SECRET_KEY);
                // const {password, ...others} = sqlData[0];
                res.cookie("accessToken", token, {httpOnly: true}).status(200).json({message: 'User login!', others: {username: sqlData[0].username}});
            }
        }
    });
});


// Logout API
userRoutes.post("/logout", (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json({message: "User has been logged out!"});
});


// Search user API
userRoutes.post("/findusers", (req, res) => {

    var searchname = req.body.searchname;

    // varify user authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message: "User not logged in!"});
    jwt.verify(token, process.env.SECRET_KEY, (err, userinfo) => {
        if (err) return res.status(403).json({message: "Token is invalid!"});
        else {
            var username = userinfo.username;
            const q = `SELECT username FROM Users WHERE username LIKE '%${searchname}%' AND username <> '${username}'`;
            db.query(q, (err, data) => {
                if (err) res.status(500).json({message: err.message});
                else res.status(200).json({message: 'OK', userlist: data});
            });
        }
    });
});


/**
 * To varify user's cookie for authenticaiton (use inside an API endpoint function):
 * const token = req.cookies.accessToken;
 * if (!token) return res.status(401).json({message: "User not logged in!"});
 * jwt.verify(token, process.env.SECRET_KEY, (err, userinfo) => {
 *     if (err) return res.status(403).json({message: "Token is invalid!"});
 *     else {......}
 * });
 */

export default userRoutes;
