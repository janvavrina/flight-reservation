const express = require("express");
const router = express.Router();
const flightService = require("../services/flight-service");
const userService = require("../services/user-service");
const reservationService = require("../services/reservation-service");
const notificationService = require("../services/notification-service")

router.post('/:id',async (req,res) => {
    const userId = req.user.id;
    const flightId = parseInt(req.params.id)

    if (userId === undefined || flightId === undefined) {
        res.status(400).send("Bad input");
        return;
    }

    const oldReservation = await reservationService.getByUserAndFlight(flightId,userId)
    if(oldReservation){
        res.status(409).send("Already exists.");
        return;
    }

    const flight = await flightService.getById(flightId)
    if(flight.flights_occupied+1 > flight.flights_capacity){
        res.status(413).send("Exceeded range.");
        return;
    }

    const reservation = await reservationService.create(flightId,userId);

    console.log(userId)

    const reservationNotification = {
        type: 'success',
        text: 'New reservation was successfully created.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(reservationNotification)


    await flightService.addPerson(flightId);

    const flightNotification = {
        type: 'success',
        text: 'Person was successfully added in flights occupation.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(flightNotification)

    res.status(201).json(reservation)
})

router.delete('/:id',async (req,res) => {
    let reservationId = parseInt(req.params.id)
    const userId = req.user.id;
    const reservation = await reservationService.getById(reservationId)

    if (reservationId === undefined) {
        res.status(400).send("Bad input")
        return;
    }

    const deletedReservation = await reservationService.delete(reservationId);

    const reservationNotification = {
        type: 'success',
        text: 'Reservation was successfully removed.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(reservationNotification)

    await flightService.removePerson(reservation.flights_id);

    const flightNotification = {
        type: 'success',
        text: 'Person was successfully removed in flights occupation.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(flightNotification)


    res.status(201).json(deletedReservation);
})

router.get('/',async (req,res) => {
    const userId = req.user.id
    const user = await userService.getById(userId)
    let reservations;

    if(user.users_role==='zakaznik') {
        reservations = await reservationService.getAllUsersReservations(userId);
    }
    else if(user.users_role==='sekretarka' || user.users_role==='technik') {
        reservations = await reservationService.getAllReservations();
    }
    else {
        res.status(404).send("Who the fuck are you?");
        return;
    }

    if(reservations !== undefined){
        res.json(reservations);
    }
    else{
        res.status(404).send("No reservations found.");
        return;
    }
})

router.put('/update', async (req, res) => {
    const data = req.body;
    const userId = req.user.id

    const reservationId = data.id;
    const reservation = await reservationService.getById(reservationId)
    const flightId = reservation.flights_id

    const flight = await flightService.getById(flightId)

    if (
        reservationId === undefined ||
        data.census === undefined
    ) {
        res.status(400).send("Bad input");
        return;
    }

    if(flight.flights_occupied-1+data.census > flight.flights_capacity){
        res.status(413).send("Exceeded range.");
        return;
    }

    var puvodni = (flight.flights_occupied)
    var occupied = puvodni-reservation.reservations_census
    var newOccupied = occupied+data.census

    const updateReservation = await reservationService.updateCensus(reservationId,data.census)

    const reservationNotification = {
        type: 'success',
        text: 'Reservation successfully updated.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(reservationNotification)

    const updateFlight = await flightService.updateOccupied(reservation.flights_id,newOccupied)

    const flightNotification = {
        type: 'success',
        text: 'Flight successfully updated.',
        status: 'shown',
        users_id: userId
    }

    await notificationService.create(flightNotification)


    res.status(202).json(updateReservation);
})

module.exports = router;