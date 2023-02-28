const {database} = require("../database/database");
class ReservationService{
    async create(flightId,userId) {
        const result = await database().run(
            "INSERT INTO reservations (flights_id, users_id, reservations_census) VALUES (?, ?, 1)",
            flightId,userId
        );
        return await this.getById(result.lastID);
    }

    async delete(reservationId) {
        const result = await database().run(
            "DELETE FROM reservations WHERE (reservations_id=?)",reservationId
        );
        return await this.getById(result.lastID);
    }

    async getById(id) {
        return await database().get(
            "SELECT * FROM reservations WHERE reservations_id = ?",
            id
        );
    }

    async getByUserAndFlight(flightId,userId){
        return await database().get(
            "SELECT * FROM reservations WHERE flights_id = ? and users_id = ?",flightId,userId
        );
    }

    async getAllReservations(){
        return await database().all("SELECT * FROM reservations JOIN users u on u.users_id = reservations.users_id JOIN flights f on f.flights_id = reservations.flights_id");
    }

    async getAllUsersReservations(userId){
        return await database().all("SELECT * FROM reservations JOIN users u on u.users_id = reservations.users_id JOIN flights f on f.flights_id = reservations.flights_id WHERE u.users_id=?",userId);
    }

    async updateCensus(reservationId,census) {
        const result = await database().run(
            "UPDATE reservations SET reservations_census = ? WHERE reservations_id = ?", census,reservationId
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(reservationId);
        }
    }
}
module.exports = new ReservationService;