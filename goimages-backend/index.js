import { MONGO_URI, ORIGIN1, ORIGIN2, PORT } from "./constants.js"
import mongoose from "mongoose";
import express from "express"
import cors from "cors"
import uploadRouter from "./routes/uploadRoutes.js"
import morgan from "morgan";
import chalk from "chalk";

const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

mongoose.connect(MONGO_URI, mongooseOptions).then(
    () => {
        console.log("connected to mongodb");
    },
    (err) => {
        console.log("Error connecting to MongoDB: ", err);
    }
);

mongoose.connection.on("error", (err) => {
    console.log(err);
});

const app = express();
const corsOptions = {
    origin: [ORIGIN1, ORIGIN2],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req, res) !== "OPTIONS") {
        return [
            chalk.bgGreen.bold(tokens.method(req, res)),
            chalk.bold(tokens.status(req, res)),
            chalk.green.bold(`"${tokens.url(req, res)}"`),
            chalk.yellow("in " + tokens['response-time'](req, res) + ' ms'),
            chalk.yellow('from ' + tokens.referrer(req, res))
        ].join(' ');
    }
}));
app.use("/api/upload", cors(corsOptions), uploadRouter);

app.listen(PORT, () => {
    console.log("goimages server started")
})