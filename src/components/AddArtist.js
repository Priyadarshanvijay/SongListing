import React, { useState } from 'react'
import { Button,Grid, Modal, Form } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import formatDate from '../utils/formatSQLDate'
const AddArtist = ({setArtists}) => {
    const [artistNameError, setArtistNameError] = useState(false);
    const [dateOfBirthError, setDateOfBirthError] = useState(false);
    const [currentDate, setNewDate] = useState(null);
    const [artistName, changeArtistName] = useState('');
    const handleChange = (event, {name, value}) => {
        if(name === 'artistName'){
            changeArtistName(value)
            setArtistNameError(false)
        }
    }
    const onDateChange = (event, data) => {
        setNewDate(data.value);
        setDateOfBirthError(false)
    }
    const [open, setOpen] = useState(false);
    const [dimmer, setDimmer] = useState(true);
    const show = (dimmer) => {
        setDimmer(dimmer);
        setOpen(true);
    }
    const close = () => setOpen(false);
    const submitArtist = (e) => {
        e.preventDefault();
        let isAnyError = false;
        if(artistName === ''){
            isAnyError = true;
            setArtistNameError(true);
        }
        if(currentDate === null){
            isAnyError = true;
            setDateOfBirthError(true)
        }
        if(isAnyError) return;
        console.log('Improve it');
        const dateOfBirth = formatDate(currentDate);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                artistName : artistName, 
                dateOfBirth : dateOfBirth
            })
        };
        const postArtist  = async() => {
            fetch('http://localhost:5000/artists', requestOptions)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                console.log(data)
                setArtists(prev => {
                    return [...prev, {
                        text : data.artistName,
                        key : data.artistID,
                        value : data.artistID
                    }]
                })
                clearForm();
                close();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
        postArtist();
    }
    const clearForm = () => {
        setNewDate(null);
        changeArtistName('');
    }
    return (
        <div>
            <Button 
                type="button"
                positive 
                icon='plus'
                // fluid 
                labelPosition='left'
                content="Add Artist"
                onClick={() => show('blurring')}
            />

            <Modal dimmer={dimmer} open={open} onClose={close}>
                <Modal.Header>Add a new Artist</Modal.Header>
                <Modal.Content>
                    <Form>
                    <Grid stackable>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Form.Input error={artistNameError} fluid label="Artist Name" name="artistName" value={artistName} onChange = {handleChange} placeholder="Artist Name" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Form.Field>
                                        <label>Date of Birth</label>
                                        <SemanticDatepicker error={dateOfBirthError} onChange={onDateChange} />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Save new Artist"
                        onClick={submitArtist}
                    />
                </Modal.Actions>
            </Modal>
        </div>
    )
}

export default AddArtist;