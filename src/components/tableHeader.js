import React from 'react';
import {Table} from 'semantic-ui-react';

const TableHeader = (props) => {
    if(props.type === 'songs'){
        return(
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Artwork</Table.HeaderCell>
                    <Table.HeaderCell>Song</Table.HeaderCell>
                    <Table.HeaderCell>Date of Release</Table.HeaderCell>
                    <Table.HeaderCell>Artists</Table.HeaderCell>
                    <Table.HeaderCell>Rate</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }
    else{
        return(
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Artist</Table.HeaderCell>
                    <Table.HeaderCell >Date Of Birth</Table.HeaderCell>
                    <Table.HeaderCell>Songs</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }
}

export default TableHeader;