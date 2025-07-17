import React, { Component } from 'react';
import './jNumber.scss';

class JNumber extends Component {
	constructor(props) {
		super();
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			value: props?.value,
			cardColor: props.cardColor,
			cardBorder: props.cardBorder,
			color: props?.color,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.value !== nextProps.value) {
			this.setState({
				value: nextProps.value,
			});
		}
		if (this.state.cardColor !== nextProps.cardColor) {
			this.setState({
				cardColor: nextProps.cardColor,
			});
		}
		if (this.state.cardBorder !== nextProps.cardBorder) {
			this.setState({
				cardBorder: nextProps.cardBorder,
			});
		}
		if (this.state.color !== nextProps.color) {
			this.setState({
				color: nextProps.color,
			});
		}
	};
	handleOnClick = () => {
		this.state?.preview == true
			? [
					// e.stopPropagation(),
					// window.open(this.state?.href, this.state.openInNewTab ? '_blank' : '_self'),
			  ]
			: [this.props?.setTab('ji')];
	};
	render() {
		return (
			<div
				className="j-number-container"
				style={{
					backgroundColor: this.state?.cardBorder,

					width: this.state?.previewType === 'm' && '40px',
					height: this.state?.previewType === 'm' && '40px',
				}}
				onClick={() => this.handleOnClick()}
			>
				<span
					style={{
						backgroundColor: this.state?.cardColor,
						color: this.state?.color,
						width: this.state?.previewType === 'm' && '32px',
						height: this.state?.previewType === 'm' && '32px',
						fontSize: this.state?.previewType === 'm' && '19px',
					}}
				>
					{this.state?.value < 10 ? `0${this.state.value}` : this.state?.value}
				</span>
			</div>
		);
	}
}

export default JNumber;
