const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const db = require('./queries/queries');
const port = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.json({ info: 'Song Listing API created by Priyadarshan Vijay' });
});

app.get('/songs', db.getSongs);
app.get('/artists', db.getArtists);
app.get('/artistsAll', db.getArtistsAll);
app.post('/songs', db.createSong);
app.post('/artists',db.createArtist);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});