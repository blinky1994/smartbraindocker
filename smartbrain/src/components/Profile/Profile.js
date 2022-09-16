import React, { Component } from 'react';
import './Profile.css';
import server from '../../ServerSettings';
import axios from 'axios';

export default class Profile extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            name: this.props.user.name,
        }
    }

    onFormChange = (event) => {
        switch (event.target.name) {
            case 'username': this.setState({name: event.target.value})
            break;
            default:
                return;
        }
    }

    onProfileUpdate = (data) => {
        fetch(`${server}/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({ formInput : data})
        }).then(resp => {
            if (resp.status === 200 || resp.status === 304) {
                this.props.toggleModal();
                this.props.loadUser({...this.props.user, ...data});
            }
        }).catch(console.log);
    }
    
    render() {
        const { user, toggleModal } = this.props;
        const { name } = this.state;
    return (
        <div className='profile-modal'>
        <article className="mv6 br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
           <main className="pa4 black-80 w-80">
           <img src="http://tachyons.io/img/logo.jpg"
               className="h3 w3 dib" alt="avatar" />
           <h1>{this.state.name}</h1>
           <h4>{`Images submitted: ${user.entries}`}</h4>
           <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
           <hr className='light-purple' />
           <label className="mt-2 fw6" htmlFor="username">Name:</label>
               <input 
               onChange={this.onFormChange}
               className="br3 pa2 w-100" 
               placeholder={user.name}
               type="text" 
               name="username"  
               id="name"/>
           <div className='mt4' style={{display: 'flex', justifyContent: 'space-evenly'}}>
               <button 
               onClick={() => this.onProfileUpdate({ name })}
               className='b pa2 grow pointer white w-40 bg-light-purple b--black-20'>
                   Save
               </button>
               <button className='b pa2 grow pointer light-purple w-40 bg-transparent b--light-purple'
                       onClick={toggleModal}>
                   Cancel
               </button>
           </div>
           </main>
           <div className='modal-close pa4 h1 pointer' onClick={toggleModal}>&times;</div>
       </article>
   </div>
    )
  }
}
