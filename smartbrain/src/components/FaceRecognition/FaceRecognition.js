import React from 'react';
import BoundingBox from './BoundingBox.js';

const FaceRecognition = ({imageUrl, box, showBoundingBox}) => {
	if (!box.length)
	{
		return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' alt='' src={imageUrl} width='500px' height='auto'/>
			</div>
		</div>
		);
	}
	else{
		return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' alt='' src={imageUrl} width='500px' height='auto'/>
				{	
					showBoundingBox && 
					box.map((box, index) => {
						return <BoundingBox key={index} box = {box} />
					})
				}
			</div>
		</div>
		);
	}
}

export default FaceRecognition;