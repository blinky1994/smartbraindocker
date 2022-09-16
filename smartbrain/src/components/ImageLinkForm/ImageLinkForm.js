import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return (
		<div className='mt-5'>
			<p className='f4 b light-purple'>
				{'Insert an image to detect faces'}
			</p>
			<div className = 'center'>
				<div className='bg-white-40 w-100 mw7 center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-60 center' type='text' onChange={onInputChange} placeholder='Insert url' />
					<button className='br2 shadow-hover w-30 center grow bn f4 link ph3 pv2 dib white bg-light-purple'
							onClick={onButtonSubmit}>

					Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;