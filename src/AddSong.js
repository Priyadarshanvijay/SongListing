import React, { useState,useEffect } from 'react';
import AddArtist from './components/AddArtist';
import { withRouter } from 'react-router-dom'
import { Form, Container, Grid, GridColumn, GridRow, Button, Dropdown, Message, Segment } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import formatDate from './utils/formatSQLDate'


const AddSong = (props) => {
    const [currentDate, setNewDate] = useState(null);
    const onDateChange = (event, data) => {
        setNewDate(data.value);
        setDateReleaseError(false);
    }
    const [state,changeState] = useState({
        songName:'',
        submittedSong:''
    })
    const [isError, setIsError] = useState(0); // 0 -> no song posted yet, 1 -> tried to post song but error, 2 -> song posted successfully
    const [selectedArtists, changeSelectedArtists] = useState([]);
    const [artists, setArtists] = useState([]);
    const [image,setImage] = useState('');
    const [songNameError, setSongNameError] = useState(false);
    const [dateReleaseError, setDateReleaseError] = useState(false);
    const [albumArtError, setAlbumArtError] = useState(false);
    const [artistError, setArtistError] = useState(false);
    useEffect(() => {
        const fetchData = async () =>{
            fetch('http://localhost:5000/artistsAll')
            .then(response => response.json())
            .then(response => {
                const receivedArr = response.map((artist) => {
                    return {
                        text : artist["artist_name"],
                        key : artist["id"],
                        value : artist["id"]
                    }
                  });
                  setArtists(receivedArr);
            })
            .catch(e => console.log(e))
        }
        fetchData();
    },[setArtists]);
    const uploadFile = evt => {
        console.log("Uploading");
        const reader = new FileReader();
        const file = evt.target.files[0];
    
        reader.onload = function(upload) {
            setImage(upload.target.result);
        };
        reader.readAsDataURL(file);
        setTimeout(() => console.log(image), 2000);
        console.log("Uploaded");
        setAlbumArtError(false)
    }
    const handleChange = (e, { name, value }) => {
        if(name === "selectedArtists"){
           changeSelectedArtists(value);
           setArtistError(false)
        }else{
            const prevState = state;
            prevState[name] = value;
            changeState(prevState);
            setSongNameError(false)
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const { songName } = state;
        const prevState = state;
        prevState.submittedSong = songName;
        changeState(prevState);
        let errorInSubmission = false;
        if(currentDate === null){
            setDateReleaseError(true);
            errorInSubmission = true;
        }
        if(state.submittedSong === ''){
            setSongNameError(true);
            errorInSubmission = true;
        }
        if(selectedArtists.length === 0){
            setArtistError(true);
            errorInSubmission = true;
        }
        if(image === ''){
            setAlbumArtError(true);
            errorInSubmission = true;
        }
        if(errorInSubmission){
            return;
        }
        const dateOfRelease = formatDate(currentDate);
        console.log('Improve it dude')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                songName : state.submittedSong, 
                dateOfRelease : dateOfRelease,
                artists : selectedArtists,
                image : image
            })
        };
        const postSong  = async() => {
            fetch('http://localhost:5000/songs', requestOptions)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                setIsError(2);
                clearForm();
            })
            .catch(error => {
                setIsError(1);
                console.error('There was an error!', error);
            });
        }
        postSong();
        // console.log(state.submittedSong);
        // console.log(selectedArtists);
        // console.log(formatDate(currentDate));
    }
    const clearForm = () => {
        changeSelectedArtists([]);
        setNewDate(null);
        changeState({
            songName : '',
            submittedSong : '',
        })
        setImage('');
    }
    return (
        <Container fluid>
            <Segment padded='very' basic>
            <Grid stackable padded columns={1}>
                <GridRow><h1>Add A New Song</h1></GridRow>
                <GridColumn>
                    <Form 
                        onSubmit={handleSubmit}
                        error={isError === 1}
                        success={isError === 2}
                    >
                        <Grid stackable>
                            <Grid.Row columns={2}>
                                <GridColumn>
                                    <Form.Input 
                                        fluid 
                                        label="Song Name" 
                                        name="songName" 
                                        onChange={handleChange} 
                                        placeholder="Song Name" 
                                        error={songNameError ? {
                                            content: 'Please enter a valid song Name',
                                            pointing: 'below',
                                          } : songNameError}
                                    />
                                </GridColumn>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <GridColumn>
                                    <Form.Field
                                     error={dateReleaseError}
                                    >
                                        <label>Date Released</label>
                                        <SemanticDatepicker onChange={onDateChange} />
                                    </Form.Field>
                                </GridColumn>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <GridColumn>
                                    <Form.Field
                                         error={albumArtError}
                                    >
                                        <label>Upload AlbumArt</label>
                                        <input 
                                            type="file" 
                                            onChange={uploadFile} 
                                            encType="multipart/form-data" 
                                        />
                                    </Form.Field>
                                </GridColumn>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <GridColumn>
                                    <Form.Field
                                         error={artistError}
                                    >
                                        <label>Artists</label>
                                        <Dropdown
                                            placeholder='Artist'
                                            fluid
                                            multiple
                                            search
                                            selection
                                            name="selectedArtists"
                                            value = {selectedArtists}
                                            onChange={handleChange}
                                            options={artists}
                                        />
                                    </Form.Field>
                                </GridColumn>
                                <GridColumn width={4} verticalAlign='bottom'>
                                    <AddArtist setArtists = {setArtists}/>
                                </GridColumn>
                            </Grid.Row>
                            <Grid.Row columns={4}>
                                <Grid.Column>
                                    <Button primary fluid type='submit'>Save</Button>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button 
                                    type="button" 
                                    negative 
                                    fluid
                                    onClick = {
                                        () => {
                                            props.history.push('/')
                                        }
                                    }
                                     >Cancel</Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                <Message
                                    success
                                    header='Song Added!'
                                    content="You've successfully added a new song"
                                />
                                <Message
                                    error
                                    header='Unable to Add'
                                    content="Adding a new song failed. Please try again later!"
                                />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </GridColumn>
            </Grid>
            </Segment>
        </Container>
    )
}

export default withRouter(AddSong);