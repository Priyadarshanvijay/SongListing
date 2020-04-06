import React, { Component } from 'react'
import { Menu, Segment, Search } from 'semantic-ui-react'

export default class MenuOnTop extends Component {
  constructor(props){
    super(props);
    this.state = { activeItem: 'Home' };
    this.handleSearch = this.handleSearch.bind(this)
  }
  

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleSearch = (event) => {
    console.log('Search Handled', event.target.value);
    fetch(`http://localhost:3002/songs?search=${event.target.value}`)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(e => console.log(e))
  }

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu attached='top' color="green" inverted tabular>
          <Menu.Item
            name='Home'
            active={activeItem === 'Home'}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Search
                icon={{ name: 'search', link: true}}
                placeholder='Search songs...'
                onChange={this.handleSearch}
                results={[{title:"Prateek Kuhad"}]}
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment attached='bottom'>
          {this.props.children}
        </Segment>
      </div>
    )
  }
}