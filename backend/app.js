//import expressu
const express = require("express");
const app = express();
const {initializeDatabase} = require("./database/database");

//routery
const userRouter = require("./routes/user")
const flightRouter = require("./routes/flight")
const reservationRouter = require("./routes/reservation")
const notificationRouter = require("./routes/notification")

//config
const {jwtConfig} = require("./config");
const jwt = require("express-jwt");
const cors = require("cors");
const config = require("./config");

//setup
initializeDatabase();

//nas express bude pouzivat json
app.use(express.json());
app.use(cors({origin: config.allowedFrontendOrigin}));

//pouze autorizovani
app.use('/notifications', jwt(jwtConfig))
app.use('/flights', jwt(jwtConfig))
app.use('/reservations', jwt(jwtConfig))

//zaevidovat routy
app.use('/notifications',notificationRouter)
app.use("/user",userRouter);
app.use('/flights',flightRouter)
app.use('/reservations',reservationRouter)

//na jakém portu pojede server
const port = 3000;
app.listen(port, ()=>{
    console.log("App is up and running on port " + port + ". :)");
});