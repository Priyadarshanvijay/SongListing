import React, {useState, useEffect} from 'react';
import MenuOnTop from './Menu'
import {Container, Button, Grid} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Table from './Table'

function Home(props) {
  const [songData, setSongData] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [starsData, setStarsData] = useState({});
  const fetchSongs = async () => {
    fetch(
      'http://localhost:5000/songs',
    )
    .then(response => response.json())
    .then(response => {
        const receivedArr = Object.keys(response).map((song) => {
          return response[song];
        });
        setSongData(receivedArr);
        receivedArr.forEach((song) => {
          setStarsData(prev => {
            return {
              ...prev,
              [song["song_id"]] : 0
            }
          })
        })
    })
    .catch(e => console.log(e))
  };
  const fetchArtists = async () => {
    fetch(
      'http://localhost:5000/artists',
    )
    .then(response => response.json())
    .then(response => {
        const receivedArr = Object.keys(response).map((artist) => {
          return response[artist];
        });
        setArtistData(receivedArr);
    })
    .catch(e => console.log(e))
  };
  useEffect(() => console.log('Post new stars'),[setStarsData]);
  useEffect(() => {
    fetchSongs();
    fetchArtists();
  }, []);
  return (
    <div>
      <Container>
        <MenuOnTop>
          <Grid stackable columns={4}>
            <Grid.Column floated='right'>
              <Link to='/addSong'><Button fluid negative>Add Song</Button></Link>
            </Grid.Column>
          </Grid>
          <Table type='songs' songData={songData}  starsData={starsData} setStarsData={setStarsData}/>
          <Table type='artist' artistData= {artistData}/>
        </MenuOnTop>
        
      </Container>
    </div>
  );
}

export default Home;
