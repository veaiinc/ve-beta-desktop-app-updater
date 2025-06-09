import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import './video.scss';
import VideoSVG from '../../svgs/VideoSvg';
import { Helmet } from 'react-helmet';
class Video extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props?.preview,
			videoURL: props?.videoURL,
			loop: props?.loop,
			autoplay: props?.autoplay,
			fillVideoBlock: props?.fillVideoBlock,
			isFluid: props?.isFluid,
			subBlockID: props?.subBlockID,
			height: props?.height,
			previewType: props?.previewType,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.isFluid !== nextProps.isFluid) {
			this.setState({
				isFluid: nextProps.isFluid,
			});
		}
		if (this.state.subBlockID !== nextProps.subBlockID) {
			this.setState({
				subBlockID: nextProps.subBlockID,
			});
		}
		if (this.state.height !== nextProps.height) {
			this.setState({
				height: nextProps.height,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.fillVideoBlock !== nextProps.fillVideoBlock) {
			this.setState({
				fillVideoBlock: nextProps.fillVideoBlock,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.videoURL !== nextProps.videoURL) {
			this.setState({
				videoURL: nextProps.videoURL,
			});
		}
		if (this.state.loop !== nextProps.loop) {
			this.setState({
				loop: nextProps.loop,
			});
		}
		if (this.state.autoplay !== nextProps.autoplay) {
			this.setState({
				autoplay: nextProps.autoplay,
			});
		}
	};
	handleOnClick = () => {
		this.state.preview == true
			? [
					// e.stopPropagation(),
					window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),
			  ]
			: [this.props.setTab('bvideo')];
	};

	render() {
		return (
			<>
				<Helmet>
					<style>{`
						.video-block .react-layer{
							height:${this.state.height}
						}
					`}</style>
				</Helmet>
				<div
					className={`video-block `}
					style={{
						overflow: 'hidden',
						position: 'relative',
						maxWidth: this.state.fillVideoBlock || this.state.isFluid ? '' : '1024px',
						...(this.state.isFluid
							? {
									display: 'flex',
									gridArea: 'inherit',
									flex: 1,
									flexDirection: 'column',
							  }
							: {}),
						// height: this.state.fillVideoBlock ? '100%' : '',
					}}
				>
					{(this.state.isFluid
						? this.state.previewType !== 'ml' && !this.props?.client
						: !this.state.preview) && (
						<div className="video-overlay" onClick={this.handleOnClick}></div>
					)}
					{/* {(this.state?.isFluid ? !this.state.videoURL || this.state?.notValidVideo : !this.state.videoURL)  */}
					{!this.state.videoURL && (
						<div
							className="video-block-bg"
							style={{
								width: this.state?.isFluid ? '100%' : '',
								height: this.state?.isFluid ? '100%' : '',
							}}
						>
							{' '}
							<VideoSVG />{' '}
						</div>
					)}
					{/* {(this.state?.isFluid ? this.state.videoURL  && !this.state?.notValidVideo : this.state?.videoURL) */}
					{this.state?.videoURL && (
						<div
							className={`react-player-container ${
								this.state.isFluid ? this.state.subBlockID : ''
							}`}
							style={{
								...(this.state.isFluid && this.state.fillVideoBlock
									? { padding: 0, height: '100%' }
									: {}),
							}}
						>
							<ReactPlayer
								className={'react-player'}
								url={this.state?.videoURL}
								width="100%"
								height="100%"
								loop={this.state.loop}
								onError={(e) => {
									this.setState({
										notValidVideo: true,
									});
									this.props.setIsValidURL(false);
								}}
								onReady={(e) => {
									this.setState({
										notValidVideo: false,
									});
									this.props.setIsValidURL(true);
								}}
								playing={this.state.autoplay}
								controls
								muted={this.state?.isFluid ? this.props.muteVideo : true}
							/>
						</div>
					)}
					{/* {console.log('mute', this.props.muteVideo)} */}
					{this.state?.isFluid &&
						this.props?.videoAltText &&
						this.state?.notValidVideo && <span>{this.props.videoAltText}</span>}
				</div>
			</>
		);
	}
}

export default Video;
