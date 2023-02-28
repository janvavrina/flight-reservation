const {database} = require("../database/database");
const {jwtConfig, passwordConfig} = require("../config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class UserService {
    async generateToken(username,id,role) {
        const tokenPayload = {
            id: id,
            username: username,
            role: role
        };

        return await jwt.sign(
            tokenPayload,
            jwtConfig.secret,
            {algorithm: jwtConfig.algorithms[0],}
        )
    }

    hashPassword(password) {
        return crypto.pbkdf2Sync(
            password,
            passwordConfig.salt,
            passwordConfig.iterations,
            passwordConfig.keylen,
            passwordConfig.digest,
        ).toString("hex");
    }

    async getByUsername(username) {
        return await database().get(
            "SELECT * from users WHERE users_username=?", username
        )
    }

    async getById(id) {
        return await database().get(
            "SELECT * from users WHERE users_id=?", id
        )
    }

    async register(user) {
        const result = await database().run(
            "INSERT INTO users(users_username,users_password,users_role) VALUES(?,?,?)", user.username, user.password, user.role
        )
        console.log(result);
    }

    async getAllUsers(){
        return await database().all("SELECT users_id,users_username FROM users ORDER BY users_id");
    }
}

module.exports = new UserService;