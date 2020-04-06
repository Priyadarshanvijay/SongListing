import React from 'react';
import { Table, Rating } from 'semantic-ui-react'
const TableRow = ({type, artistData,songData, starsData, setStarsData}) => {
    const handleRating = (event, {name, rating}) => {
        setStarsData( prev => 
            {
                return {
                ...prev,
                [name]:rating
            }}
        )
    }
    if(type === 'songs')
    {
        return(
            songData.map((eachSong, indx) => {
                const dateOfRelease = new Date(eachSong.date_of_release);
                return (
                    <Table.Row key={eachSong.song_id}>
                        <Table.Cell>
                            <img height="50px" width="50px" alt={eachSong.song_name} src={"http://localhost:5000/static/album_art/" + eachSong["song_id"]}></img>
                        </Table.Cell>
                        <Table.Cell singleLine><h3>{eachSong.song_name}</h3></Table.Cell>
                        <Table.Cell>
                        <h4>{`${dateOfRelease.getDate()}/${dateOfRelease.getMonth()+1}/${dateOfRelease.getFullYear()}`}</h4>
                        </Table.Cell>
                        <Table.Cell>
                                {eachSong["artist_name"].map((artist, i) => {
                                    return<h3 key={i}>{artist}</h3>
                                })}
                        </Table.Cell>
                        <Table.Cell>
                            <Rating icon='star' name={eachSong["song_id"]} defaultRating={starsData[eachSong["song_id"]]} maxRating={5} onRate={handleRating} />
                            <h6>Current rating is {starsData[eachSong["song_id"]]}</h6>
                        </Table.Cell>
                    </Table.Row>
                )
            })
        )

    }
    else{
        return(
            artistData.map((artist) => {
                const dateOfBirth = new Date(artist.dob);
                return(
                    <Table.Row key={artist.id}>
                        <Table.Cell><h2>{artist["artist_name"]}</h2></Table.Cell>
                        <Table.Cell><h3>{`${dateOfBirth.getDate()}/${dateOfBirth.getMonth()+1}/${dateOfBirth.getFullYear()}`}</h3></Table.Cell>
                        <Table.Cell>{artist["song_name"].map((song, i) => {
                                    return<h3 key={i}>{song}</h3>
                                })}</Table.Cell>
                    </Table.Row>
                )
            })
        )
    }
}

export default TableRow;