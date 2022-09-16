import React from 'react';
import server from '../../ServerSettings';
import axios from 'axios';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			name: ''
		}
	}

	onEmailChange = (event) => {
		this.setState({email: event.target.value});
	}

	onPasswordChange = (event) => {
		this.setState({password: event.target.value});
	}

	onNameChange = (event) => {
		this.setState({name: event.target.value});
	}

	onBackButton = () => {
		this.props.onRouteChange('signin');
	}

	saveAuthTokenInSession = (token) => {
		window.sessionStorage.setItem('token', token);
	}

	onSubmitSignIn = () => {
		fetch(`${server}/register`, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				name: this.state.name
			})
		})
		.then(response => response.json())
      	.then(data => {
	       	 if(data.userID && data.success === 'true'){
			  this.saveAuthTokenInSession(data.token);
			  fetch(`${server}/profile/${data.userID}`, {
				method: 'get',
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': data.token
				}
				})
				.then(resp => resp.json())
				.then(user => {
				  if (user && user.email)
				  {
					this.props.loadUser(user);
					this.props.onRouteChange('home');
				  }
				})
				.catch(console.log);
        }
      })
		
	}

	render() {
		return (
		<article className="mv6 br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
		<main className="pa4 black-80">
		  <div className="measure">
		    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
		      <legend className="f2 fw6 ph0 mh0">Register</legend>
		       <div className="mt3">
		        <label className="db fw6 lh-copy f6" htmlFor="email-address">Name</label>
		        <input 
		        className="br3 pa2 input-reset ba bg-transparent hover-bg-black-10 hover-black w-100" 
		        type="text" 
		        name="name"  
		        id="name"
		        onChange={this.onNameChange} />
		      </div>
		      <div className="mt3">
		        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
		        <input 
		        className="br3 pa2 input-reset ba bg-transparent hover-bg-black-10 hover-black w-100" 
		        type="email" 
		        name="email-address"  
		        id="email-address"
		        onChange={this.onEmailChange} />
		      </div>
		      <div className="mv3">
		        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
		        <input 
		        className="br3 b pa2 input-reset ba bg-transparent hover-bg-black-10 hover-black w-100" 
		        type="password" 
		        name="password"  
		        id="password"
		        onChange={this.onPasswordChange} />
		      </div>
		    </fieldset>
		    <div className="ph2 flex flex-row justify-between">
			<div className = "">
				<input className="br2 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
		      		 type="submit" 
		      		 value="Back"
		      		 onClick={this.onBackButton}
		      		  />
				</div>
			<div>
		      <input className="br2 ph3 pv2 bn input-reset bg-light-purple white grow pointer f6 dib" 
		      		 type="submit" 
		      		 value="Register"
		      		 onClick={this.onSubmitSignIn}
		      		  />
				</div>
		    </div> 
		  </div>
		</main>
		</article>
		);
	}	
}

export default Register;