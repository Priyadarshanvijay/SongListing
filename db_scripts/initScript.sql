CREATE DATABASE songs_priyadarshan;
\c songs_priyadarshan;
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    song_name VARCHAR NOT NULL,
    date_of_release DATE NOT NULL
);
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    artist_name VARCHAR NOT NULL,
    dob DATE NOT NULL
);
CREATE TABLE song_artist (
    song_id INTEGER NOT NULL REFERENCES songs(id),
    artist_id INTEGER NOT NULL REFERENCES artists(id),
    PRIMARY KEY (song_id, artist_id)
);
CREATE TABLE users (
    id SERIAL UNIQUE,
    full_name VARCHAR NOT NULL,
    email VARCHAR PRIMARY KEY
);
CREATE TABLE rating (
    id SERIAL,
    rating INTEGER DEFAULT 0,
    song_id INTEGER NOT NULL REFERENCES songs(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    PRIMARY KEY (song_id, user_id)
);