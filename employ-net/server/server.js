import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import {router as portalRouter} from './routes/portal.js'
import {router as attendanceRouter} from './routes/attendanceRoute.js'
import {router as notificationRouter} from './routes/notificationRoute.js'
import {router as benefitsRouter} from './routes/benefitsRoute.js'
import {router as authenticationRouter} from './routes/authenticationRoute.js'
import {router as employeeRouter} from './routes/employeeRoute.js'
import {router as managerRouter} from './routes/managerRoute.js'
import {router as teamRouter} from './routes/teamRoute.js'
import {router as payslipRouter} from './routes/payslipRoute.js'
import {router as roomBookingsRouter } from './routes/bookingsRoute.js'
import {router as leaveRouter} from './routes/leaveRoute.js'
import authorizeUser from "./middleware/verifyCookie.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

//This creates an express application for use
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        //     origin: ("https://employ-net-server.vercel.app"),
        //     methods: ["POST", "GET"],
        origin: true,
        credentials: true,
    })
);

//This is middleware called for all routes. We will update this later to include more information
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/authentication", authenticationRouter);
app.use("/api/emp", authorizeUser, employeeRouter);
app.use("/api/manager", authorizeUser, managerRouter);
app.use("/api/payslip", authorizeUser, payslipRouter);
app.use("/api/attendance", authorizeUser, attendanceRouter);
app.use("/api/notifications", authorizeUser, notificationRouter);
app.use("/api/benefits", authorizeUser, benefitsRouter);
app.use("/api/teams", authorizeUser, teamRouter);
app.use("/api/bookings", authorizeUser, roomBookingsRouter);
app.use("/api/leave", authorizeUser, leaveRouter);

mongoose
    .connect(process.env.MONG_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`listening on port ${process.env.PORT}`);
            console.log("Connected to Database");
        });
    })
    .catch((error) => {
        console.log(error);
    });


const __dirname = path.resolve(
	path.dirname(new URL(import.meta.url).pathname),
	".."
);

app.use(express.static(path.join(__dirname, "client", "build")));


app.get("*", (req, res) => {
    // res.json(path.join(__dirname, "client", "public", "index.html"))
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});