import React from 'react'
import { Table } from 'semantic-ui-react'
import CustomTableRow from './components/tableRow'
import TableHeader from './components/tableHeader'

const TableExamplePadded = (props) => {
  return(
  <Table padded color='grey'>
    <TableHeader type = {props.type}/>

    <Table.Body>
      <CustomTableRow type={props.type} artistData = {props.artistData} songData = {props.songData} starsData = {props.starsData} setStarsData = {props.setStarsData}/>
    </Table.Body>
  </Table>)
}

export default TableExamplePadded