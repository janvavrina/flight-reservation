PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users
(
    users_id INTEGER PRIMARY KEY AUTOINCREMENT,
    users_username TEXT UNIQUE NOT NULL,
    users_password TEXT NOT NULL,
    users_role TEXT NOT NULL DEFAULT 'zakaznik'
);

CREATE TABLE IF NOT EXISTS flights(
    flights_id INTEGER PRIMARY KEY AUTOINCREMENT,
    flights_company TEXT NOT NULL,
    flights_departure TEXT NOT NULL,
    flights_destination TEXT NOT NULL,
    flights_date TEXT NOT NULL,
    flights_capacity INTEGER CHECK( flights_capacity > 0 ) NOT NULL,
    flights_occupied INTEGER DEFAULT 0 NOT NULL
        CHECK (flights_occupied <= flights.flights_capacity)
);

CREATE TABLE IF NOT EXISTS flights_status(
    flights_status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    flights_id INTEGER NOT NULL,
    flights_status_datetime TEXT NOT NULL,
    flights_status_text TEXT NOT NULL,
    CONSTRAINT f1
        FOREIGN KEY(flights_id) REFERENCES flights(flights_id)
);

CREATE TABLE IF NOT EXISTS reservations(
    reservations_id INTEGER PRIMARY KEY AUTOINCREMENT,
    flights_id INTEGER NOT NULL,
    users_id INTEGER NOT NULL,
    reservations_census INTEGER DEFAULT 1 NOT NULL,
    CONSTRAINT f2
            FOREIGN KEY(flights_id) REFERENCES flights(flights_id),
    CONSTRAINT u2
        FOREIGN KEY(users_id) REFERENCES users(users_id)
);

CREATE TABLE IF NOT EXISTS notifications(
    notifications_id INTEGER PRIMARY KEY AUTOINCREMENT,
    users_id INTEGER,
    notifications_datetime TEXT NOT NULL,
    notifications_type TEXT CHECK( notifications_type IN ('success','info','alert') ) NOT NULL,
    notifications_status TEXT DEFAULT 'shown' CHECK( notifications_status IN ('shown','hidden','archived') ) NOT NULL,
    notifications_text TEXT NOT NULL,
    CONSTRAINT u3
            FOREIGN KEY(users_id) REFERENCES users(users_id)
);
-- INSERT sekretarka&technik (password same as username)
INSERT INTO users(users_username, users_password, users_role) VALUES ('sekretarka','16b7b15fe7fb131dec7635703ab7ef5166e209cce1acb491eb67a2f19fb8ad4c4be053a323fef21b95de95b044cbd889a4bf2fbca2381a8d5041a6bb3aee51cc','sekretarka');
INSERT INTO users(users_username, users_password, users_role) VALUES ('technik','49ee6bd47bfb6fa4af6f7504218d6ac7a68c6fa8fc2429f5d71e73718290c8f6b66a82c561fc984e64e413aa88d3abb44bd470d9c97b9dcf0d12da078e4828ed','technik');