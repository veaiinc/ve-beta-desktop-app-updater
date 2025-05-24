import _ from 'lodash';
import React, { Component } from 'react';
const borders = ['solid', 'dashed', 'dotted'];
class Line extends Component {
	constructor(props) {
		super();
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
	};

	handleOnClick = (e) => {
		this.state.preview == true ? '' : [e.stopPropagation(), this.props.setTab('fi')];
	};

	render() {
		return (
			<div
				className={`line ${
					_.has(this.props, 'contentAlign') ? this.props.contentAlign : ''
				}`}
				style={{
					display: 'flex',
					width: '100%',
				}}
				onClick={(e) => this.handleOnClick(e)}
			>
				<div
					style={{
						borderStyle: borders[this.props.borderStyle],
						borderColor: this.props.borderColor,
						borderWidth: `${this.props.borderWidth}px ${0} ${0} ${0}`,
						width: `${parseInt(this.props.width)}%`,
					}}
				></div>

				{this.state.showElementOptions && _.has(this.props, 'label') && this.props.label ? (
					<legend
						className="element-edit-label"
						style={{
							position: 'absolute',
							right: 0,
							top: -23,
							left: 'auto',
							fontSize: '7px',
							color: '#fff',
							width: 'fit-content',
						}}
					>
						{' '}
						{this.props.label}
					</legend>
				) : (
					''
				)}
			</div>
		);
	}
}

export default Line;
