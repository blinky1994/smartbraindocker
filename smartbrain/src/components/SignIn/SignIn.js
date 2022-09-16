import React from 'react';
import server from '../../ServerSettings';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import axios from 'axios';

class SignIn extends React.Component {
	
	constructor() {
		super();
		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}
	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value});
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value});
	}

	saveAuthTokenInSession = (token) => {
		window.sessionStorage.setItem('token', token);
	}

	onSubmitSignIn = () => {;
		fetch(`${server}/signin`, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
		.then(response => {
			if (response.status === 400) {
				throw new Error('Invalid email/password')
			}
			return response.json();
		})
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
	  .catch(err => this.props.setError(true, 'Invalid email / password'));
	}

	render() {
		const { onRouteChange, errorMessage } = this.props;
		return (
			<div>
			<article className="flex br3 ba b--black-10 mt6 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className=" pa4 black-80">
			  <div className="measure flex-column justify-center">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				<legend className="f2 fw6 ph0 mh0">Welcome to Smart Brain</legend>
			      <div className="mt5 ph5">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input
			         className="br3 pa2 input-reset ba bg-transparent hover-bg-black-10 hover-black w-100" 
			         type="email" 
			         name="email-address"  
			         id="email-address"
			         onChange={this.onEmailChange} />
			      </div>
			      <div className="mv3 ph5">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input 
			        className="br3 b pa2 input-reset ba bg-transparent hover-bg-black-10 hover-black w-100" 
			        type="password" 
			        name="password"  
			        id="password"
			        onChange={this.onPasswordChange} />
			      </div>
			    </fieldset>
			    <div className="">
			      <input className="br2 ph3 pv2 bn input-reset bg-light-purple white grow pointer f6 dib" 
			      		 type="submit" 
			      		 value="SIGN IN"
			      		 onClick={this.onSubmitSignIn}
			      		  />

			    </div>
			    <div className="lh-copy mt3">
			      <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
			    </div>
			  </div>
			</main>
			</article>
			{errorMessage.isActive &&
			 <ErrorMessage errorMessage={errorMessage.message}/>}
			</div>
		);
	}
}




export default SignIn;