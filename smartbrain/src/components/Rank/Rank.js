import React, { Component } from 'react'
import axios from 'axios';

export default class Rank extends Component {
  
	constructor() {
		super();
		this.state = {
			rank: ''
		}
	}

	componentDidMount() {
		this.generateEmoji(this.props.entries);
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.entries !== this.props.entries) {
			this.generateEmoji(this.props.entries);
		}
		
	}

	generateEmoji = (entries) => {
		fetch(`https://4onba5y346.execute-api.ap-southeast-1.amazonaws.com/rank?rank=${entries}`)
		.then(resp => resp.json())
		.then(data => this.setState({ rank: data.input }))
		.catch(console.log);
	}

	render() {
	return (
		<div className='w-100 flex-column ph5'>
			<div className='w5 center p black f4 bg-white-80 ba bw b--yellow br2'>
					{`Rank Badge: ${this.state.rank}`}
			</div>
			<div className='black f4 w-100 mw mt2'>
			{`Hi ${this.props.name}! You have submitted ${this.props.entries} image(s)`}
			</div>
		</div>
	)
  }
}