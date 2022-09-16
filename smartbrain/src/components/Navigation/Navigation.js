import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({onRouteChange, toggleModal}) => {
	return (
		<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
			<ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal}/>
		</nav>
	);
}

export default Navigation;