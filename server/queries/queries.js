const fs = require('fs');
const Pool = require('pg').Pool;
const pool = new Pool({
    user : 'postgres',
    host: 'localhost',
    database : 'songs_priyadarshan',
    password : 'root',
    port: 5432
});

const getSongs = (request, response) => {
  pool.query('SELECT s.song_name, a.artist_name, a.dob, s.date_of_release, sa.song_id ,a.id FROM songs s, song_artist sa, artists a where s.id = sa.song_id and a.id = sa.artist_id;', (error, results) => {
    if (error) {
      throw error
    }
    let songs = {};
    results.rows.forEach((songArtist) => {
        const artistName = songArtist["artist_name"];
        if(typeof songs[songArtist["song_id"]] === 'undefined'){
            songs[songArtist["song_id"]] = songArtist;
            songs[songArtist["song_id"]]["artist_name"] = [];
            songs[songArtist["song_id"]]["artist_name"].push(artistName);
        }
        else{
            songs[songArtist["song_id"]]["artist_name"].push(artistName);
        }
    })
    response.status(200).json(songs);
  })
}

const getArtists = (request, response) => {
  pool.query('SELECT s.song_name, a.artist_name, a.dob, s.date_of_release, sa.song_id ,a.id FROM songs s, song_artist sa, artists a where s.id = sa.song_id and a.id = sa.artist_id;', (error, results) => {
    if (error) {
      throw error
    }
    let artists = {};
    results.rows.forEach((songArtist) => {
        const songName = songArtist["song_name"];
        if(typeof artists[songArtist["id"]] === 'undefined'){
            artists[songArtist["id"]] = songArtist;
            artists[songArtist["id"]]["song_name"] = [];
            artists[songArtist["id"]]["song_name"].push(songName);
            
        }
        else{
            artists[songArtist["id"]]["song_name"].push(songName);
        }
    })
    response.status(200).json(artists);
  })
}

const createSong = async (request, response) => {
  const { songName, dateOfRelease,artists } = request.body;
  const client = await pool.connect();
  let songID;
  const base64Data = request.body.image.replace(/^data:image\/jpeg;base64,/, "");
    try{
        await client.query('BEGIN');
        const insertSongText = "INSERT INTO songs (song_name, date_of_release) VALUES ($1, $2) RETURNING id";
        const songRes = await client.query(insertSongText, [songName, dateOfRelease]);
        const insertRelationText = "INSERT INTO song_artist (song_id, artist_id) VALUES ($1,$2)";
        songID = songRes.rows[0].id;
        const path = "./public/album_art/" + songID;
        fs.writeFile(path, base64Data, "base64", function(err) {
          if (err) {
            throw err;
          }
        });
        const noOfArtists = artists.length;
        for(let i = 0 ; i < noOfArtists ; ++i){
          await client.query(insertRelationText, [songID, artists[i]]);
        }
        await client.query('COMMIT');
    }
    catch(e){
        await client.query('ROLLBACK');
        console.log(e)
        throw e;
    }finally{
        client.release();
    }
    response.status(201).json({songID});
}

const createArtist = async (request, response) => {
  const { artistName, dateOfBirth } = request.body;
  const client = await pool.connect();
  let artistID;
    try{
        await client.query('BEGIN');
        const insertArtistText = "INSERT INTO artists (artist_name, dob) VALUES ($1, $2) RETURNING id";
        const artistRes = await client.query(insertArtistText, [artistName, dateOfBirth]);
        artistID = artistRes.rows[0].id;
        await client.query('COMMIT');
    }
    catch(e){
        await client.query('ROLLBACK');
        console.log(e)
        throw e;
    }finally{
        client.release();
    }
    response.status(201).json({artistID ,artistName});
}
const getArtistsAll = (req,res) => {
  pool.query('SELECT id, artist_name, dob FROM artists;', (error, results) => {
    if (error) {
      throw error
    }
    let artists = results.rows;
    if(req.query.artistID){
      artists = results.rows[req.query.artistID-1]
    }
    res.status(200).json(artists);
  })
}

module.exports = {
  getSongs,
  getArtists,
  getArtistsAll,
  createSong,
  createArtist,
}