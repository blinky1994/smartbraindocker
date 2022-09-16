import React, { Component } from 'react'
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
  } from 'reactstrap';

export default class ProfileIcon extends Component {
    constructor(props){
        super(props);
        this.state = {
            dropdownOpen: false
        }
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }))
    }
  
    render() {
    const { onRouteChange, toggleModal, direction, ...args } = this.props;
        
    return (
        <div>
        <div className="pa4 tc">
      <Dropdown isOpen={this.state.dropdownOpen} toggle ={this.toggle} direction={direction}>
        <DropdownToggle
            data-toggle="dropdown"
            tag="span"
            className='pointer'
            >
        <img src="http://tachyons.io/img/logo.jpg"
             className="br-100 ba h3 w3 dib" alt="avatar" />
        </DropdownToggle>
        <DropdownMenu   end
                        className='b--transparent shadow-5' 
                        style={{backgroundColor: 'rgba(255,255,255,0.5'}}
                       {...args}>
          <DropdownItem onClick={toggleModal}>Profile Settings</DropdownItem>
          <DropdownItem onClick={() => onRouteChange('signin')}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
       </div>
        </div>
    )
  }
}
