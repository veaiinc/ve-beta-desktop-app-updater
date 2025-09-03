import React, { Component } from 'react';
import './logoSticker.scss';
import HeaderLogoSticker from '../../svgs/logoStickers/HeaderLogoSticker';

class LogoSticker extends Component {
	constructor(props) {
		super();
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			divStyles: props.divStyles,
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
		if (this.state.divStyles !== nextProps.divStyles) {
			this.setState({
				divStyles: nextProps.divStyles,
			});
		}
	};
	handleOnClick = (e) => {
		this.state.preview == true
			? [
					// e.stopPropagation(),
					window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),
			  ]
			: [this.props.setTab('ls')];
	};

	render() {
		return (
			<div
				className={`logo-sticker ${this.props.fillColor} `}
				onClick={() => this.handleOnClick()}
			>
				<HeaderLogoSticker
					fillColor={this.props.fillColor}
					divStyles={this.props.divStyles}
				/>
			</div>
		);
	}
}

export default LogoSticker;
