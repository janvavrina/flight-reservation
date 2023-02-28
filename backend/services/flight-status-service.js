const {database} = require("../database/database");

class FlightStatusService{
    async getAllStatuses(){
        return await database().all("SELECT * FROM flights_status");
    }

    async getByFlightId(id){
        return await database().all("SELECT * FROM flights_status WHERE flights_id=?",id);
    }

    async getById(id){
        return await database().get("SELECT * FROM flights_status WHERE flights_status_id=?",id);
    }

    async create(flightStatus) {
        const result = await database().run(
            "INSERT INTO flights_status (flights_id,flights_status_text,flights_status_datetime) VALUES (?,?,datetime('now','localtime'))",flightStatus.id,flightStatus.text
        );
        return await this.getById(result.lastID);
    }
}

module.exports = new FlightStatusService;