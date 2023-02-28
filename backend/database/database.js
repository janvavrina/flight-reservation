const sqlite3 = require("sqlite3");
const{open} = require("sqlite"); //{open} = z této package vytáhnu pouze funkci open

let connection;

async function initializeDatabase(){
    //await = čekáme než se provede open
    connection = await open({
        filename: "./database/database.sqlite",
        driver: sqlite3.Database
    });
    await connection.migrate(); //migrace = definice struktury databáze (jak bude db vypadat na začátku)
}

function database(){
    return connection;
}

module.exports = {initializeDatabase, database}; //exportnu tyto dvě metody, aby byly použitelné