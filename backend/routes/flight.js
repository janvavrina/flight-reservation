const express = require("express");
const router = express.Router();
const flightService = require("../services/flight-service");
const userService = require("../services/user-service");
const reservationService = require("../services/reservation-service");
const flightStatusService = require("../services/flight-status-service")
const {jwtConfig} = require("../config");
const notificationService = require("../services/notification-service")

router.get('/',async (req,res) => {
    const flights = await flightService.getAllFlights();
    if(flights !== undefined){
        res.json(flights);
    }
    else{
        res.status(404).send("No flights found.");
        return;
    }
})

router.get('/:id',async (req,res) => {
    const id = parseInt(req.params.id);
    const flight = await flightService.getById(id);
    if(flight !== undefined){
        res.json(flight);
    }
    else{
        res.status(404).send("Flight not found. Flight flew away.");
        return;
    }
})

router.post('/',async (req,res) => {
    const data = req.body;
    const userId = req.user.id;
    const user = await userService.getById(userId)

    if(user.users_role!=='technik') {
        res.status(401).send("Unauthorized.");
        return;
    }

    if (data.company === undefined || data.company.trim() ==="" ||
        data.departure === undefined || data.departure.trim()==="" ||
        data.destination === undefined || data.destination.trim()==="" ||
        data.date === undefined || data.date.trim() === "" ||
        data.capacity === undefined ||
        data.capacity === 0
    ) {
        res.status(400).send("Bad input");
        return;
    }

    var newDate = data.date.replace('T',' ');
    data.date = newDate;

    const flight = await flightService.create(data)

    const notification = {
        type: 'success',
        text: 'Flight successfully created.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(notification)

    res.status(201).json(flight);

})

//FlightStatus GET
router.get('/:id/status',async (req,res) => {
    const flightId = parseInt(req.params.id);
    const status = await flightStatusService.getByFlightId(flightId);

    if(status !== undefined){
        res.json(status);
    }
    else{
        res.status(404).send("Flight not found. Flight flew away.");
        return;
    }
})

//FlightStatus POST
router.post('/:id/status',async (req,res) => {
    const data = req.body;
    const userId = req.user.id;
    const user = await userService.getById(userId)

    if(user.users_role === 'zakaznik')
    {
        res.status(401).send("Unauthorized.");
        return;
    }

    if (data.id === undefined || data.text === undefined || data.text.trim()==="")
    {
        res.status(400).send("Bad input");
        return;
    }

    const status = await flightStatusService.create(data);

    const notification = {
        type: 'success',
        text: 'Status for flight was successfully created.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(notification)

    res.status(201).json(status);
})

module.exports = router;