import React, { Component } from 'react';

import './iframe.scss';
import { Embed, Play } from '../../../builder_client_common';

class IframeItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props?.preview,
			previewType: props.previewType,
			height: props.height,
			source: props.source,
			errorState: '',
			iframeScroll: props?.iframeScroll,
			showIframe: false,
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
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.height !== nextProps.height) {
			this.setState({
				height: nextProps.height,
			});
		}
		if (this.state.source !== nextProps.source) {
			this.setState({
				source: nextProps.source,
			});
		}
		if (this.state.iframeScroll !== nextProps.iframeScroll) {
			this.setState({
				iframeScroll: nextProps.iframeScroll,
			});
		}
	};
	handleOnClick = () => {
		this.state.preview == true
			? [
					// e.stopPropagation(),
					// window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),
			  ]
			: [this.props.setTab('bframe')];
	};
	// handleOnError = () => {
	// 	this.setState({ errorState: 'Error loading iframe try to change the url' });
	// };
	// handleOnLoad = () => {
	// 	this.setState({ errorState: '' });
	// };

	render() {
		return (
			<div
				className={`iframe-block `}
				style={{
					height:
						this.state.previewType === 'd' ? `${this.state?.height}vh` : 'fit-content',
					// padding: !this.state.source && '118px 140px'
				}}
				onClick={() => this.handleOnClick()}
			>
				{this.state.errorState && (
					<div className="error-overlay">
						<p>{this.state.errorState}</p>
					</div>
				)}
				{/* {!this.state.errorState && ( */}

				{!this.state.source ? (
					<div className="iframe-null" style={{ height: `${this.state.height}vh` }}>
						<div className="iframe-svg">
							<Embed />
						</div>
						<p className="iframe-para">
							No embedded content detected. Please add a link in the right bar.
						</p>
					</div>
				) : (
					<>
						{this.props?.customImage &&
						this.props?.customImageUrl &&
						this.props?.isFluid &&
						!this.state?.showIframe ? (
							<>
								<div className="iframe-img-div">
									<img src={this.props?.customImageUrl} alt="iframe-img" />
									<div
										className="iframe-img-svg"
										onClick={() => this.setState({ showIframe: true })}
									>
										<Play />
									</div>
								</div>
							</>
						) : (
							<>
								<iframe
									width="100%"
									height="100%"
									src={this.state?.source && this.state.source}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									referrerpolicy="no-referrer"
									sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts "
									radius="4"
									allowfullscreen=""
									// onLoad={this.handleOnLoad}
									// onError={this.handleOnError}
								></iframe>
								{!this.state.preview && (
									<div
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											zIndex: 1,
											backgroundColor: 'transparent',
											cursor: 'move',
										}}
									></div>
								)}

								{!this.state.iframeScroll && this.state.preview && (
									<div
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											zIndex: 1000,
											backgroundColor: 'transparent',
										}}
									></div>
								)}
							</>
						)}
					</>
				)}

				{/* <div style={}></div> */}
				{/* )} */}
			</div>
		);
	}
}

export default IframeItem;
