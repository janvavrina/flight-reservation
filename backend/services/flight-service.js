const {database} = require("../database/database");

class FlightService{
    async getAllFlights(){
        return await database().all("SELECT * FROM flights");
    }

    async getById(id){
        return await database().get("SELECT * FROM flights WHERE flights_id=?",id);
    }

    async addPerson(id){
        var count = await database().get("SELECT flights_occupied+1 as pocet FROM flights WHERE flights_id=?",id)
        const result = await database().run(
            "UPDATE flights SET flights_occupied = ? WHERE flights_id = ?",count.pocet,id
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(id); // the updated article
        }
    }
    async removePerson(id){
        var count = await database().get("SELECT flights_occupied-1 as pocet FROM flights WHERE flights_id=?",id)
        const result = await database().run(
            "UPDATE flights SET flights_occupied = ? WHERE flights_id = ?",count.pocet,id
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(id); // the updated article
        }
    }

    async create(flight) {
        const result = await database().run(
            "INSERT INTO flights (flights_company, flights_departure, flights_destination, flights_date, flights_capacity, flights_occupied) VALUES (?,?,?,?,?,0)",
            flight.company,flight.departure,flight.destination,flight.date,flight.capacity
        );
        return await this.getById(result.lastID);
    }

    async updateOccupied(flightId,occupied) {
        const result = await database().run(
            "UPDATE flights SET flights_occupied = ? WHERE flights_id = ?", occupied,flightId
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(flightId);
        }
    }
}

module.exports = new FlightService;