const express = require("express");
const router = express.Router();

const userService = require("../services/user-service");
const flightService = require("../services/flight-service");
const reservationService = require("../services/reservation-service");
const notificationService = require("../services/notification-service")
const flightStatusService = require("../services/flight-status-service");

router.post("/login",async (req, res) => {
    const data = req.body;
    const user = await userService.getByUsername(data.username);

    if (data.username === undefined || data.password === undefined) {
        res.status(400).send("Bad input.");
        return;
    }
    if (!user) {
        res.status(404).send("Not found.")
        return;
    }
    if (!(userService.hashPassword(data.password) === user.users_password)) {
        res.status(401).send("Incorrect credentials.");
        return;
    }
    const response = {
        token: await userService.generateToken(user.users_username,user.users_id,user.users_role)
    };
    res.status(201).json(response)
});

router.post("/register",async (req, res) => {
    const data = req.body;
    if (data.username === undefined ||
        data.username.trim() === "" ||
        data.password === undefined ||
        data.password.trim() === "")
    {
        res.status(400).send("Bad input");
        return;
    }

    const testUser = await userService.getByUsername(data.username);
    if(testUser !== undefined){
        res.status(409).send("User with this username already exists.")
        return;
    }

    const user = {
        username: data.username,
        password: userService.hashPassword(data.password),
        role: 'zakaznik'
    }

    await userService.register(user);
    const createdUser = await userService.getByUsername(user.username)
    const notification = {
        type: 'success',
        text: 'User successfully registered.',
        status: 'shown',
        users_id: null
    }

    await notificationService.create(notification)
    res.status(201).send(user);
});

module.exports = router;