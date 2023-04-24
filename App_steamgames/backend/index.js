import express from "express";
import mysql from "mysql";
import userRoutes from "./routes/users.js";
import gameRoutes from "./routes/games.js";
import friendRoutes from "./routes/friends.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import historyRoutes from "./routes/history.js";
import ratingRoutes from "./routes/rating.js";
import reportRoutes from "./routes/report.js";


const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(cors({origin: "*"}));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/report", reportRoutes);

export const db = mysql.createConnection({
    user: "root",
    password: "steamgames",
    database: "steamgames",
    socketPath: "/cloudsql/cs411-finalproject-378600:us-central1:steamgames"
});

db.connect((err) => {
    if (err) {
        console.log("Fail to connect database");
        return;
    }
    console.log("Database Connected");
});

export { app as backendapp };
