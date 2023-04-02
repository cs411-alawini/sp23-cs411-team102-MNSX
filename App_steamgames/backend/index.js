import express from "express";
import mysql from "mysql";
import userRoutes from "./routes/users.js";
import gameRoutes from "./routes/games.js";
import friendRoutes from "./routes/friends.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from 'dotenv';
config();


const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(cors({origin: "http://localhost:3000"}));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/friends", friendRoutes);

export const db = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_name
});

db.connect((err) => {
    if (err) {
        console.log("Fail to connect database");
        return;
    }
    console.log("Database Connected");
});

var port = process.env.PORT || 8800;

app.listen(port, () => {
    console.log("Server running on port " + port);
});
