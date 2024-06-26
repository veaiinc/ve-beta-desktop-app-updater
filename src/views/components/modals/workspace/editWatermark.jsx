import React, { Component } from 'react';
import InputHeader from '../../../components/input/inputwithHeader';
import { ReactComponent as Close } from '../../../../assets/svg/workspaceSettings/close.svg';
import '../../../../assets/scss/workspaceSettings/galleryCreateForm.scss';
import TenantController from '../../../../controllers/tenant';
import Landscape from '../../../../assets/images/landscape.jpg';
import Portrait from '../../../../assets/images/portrait.jpg';

import _ from 'lodash';

class Logo extends TenantController {
	constructor(props) {
		super(props);
		this.state = {
			imageSrc:
				'https://images.ctfassets.net/2onq0fbdrig0/6FnJwHJwEwhltj42dkgbDZ/5728c1f29cb3564b5009317d4d642ac3/akhilasanketh18.jpeg?w=800&h=534&q=50',
			imageType: 'landscape',
			watermarkName: '',
			scale: 0,
			opacity: 100,
			watermarkUrl: null,
			watermarkPosition: null,
			tpos: 'auto',
			rpos: 10,
			bpos: 10,
			lpos: 'auto',
			watermarkProfileId:
				props.watermark.profileId === props.watermarkProfileId
					? props.watermarkProfileId
					: null,
			tempWatermarkProfileId:
				props.watermark.profileId === props.watermarkProfileId
					? props.watermarkProfileId
					: null,
		};
	}
	componentDidMount = () => {
		this.setState({
			tpos: this.props.tpos,
			rpos: this.props.rpos,
			bpos: this.props.bpos,
			lpos: this.props.lpos,
			watermarkPosition: this.props.watermarkPosition,
		});
	};

	posactive = async (e, t, r, b, l) => {
		this.setState({
			watermarkPosition: e,
			tpos: t,
			rpos: r,
			bpos: b,
			lpos: l,
		});
		let json = {
			// name: this.state.watermarkName,
			// scale: this.state.scale,
			// opacity: this.state.opacity,
			watermarkPosition: e,
		};
	};

	saveWatermark = async () => {
		let json = {
			// name: this.state.watermarkName,
			// scale: this.state.scale,
			// opacity: this.state.opacity,
			watermarkPosition: this.state.watermarkPosition,
			//watermarkProfileId: this.state.watermarkProfileId,
		};
		this.props.getpreference(json);
		this.props.close();
		// let res = await this.updateTenantSettings(json);
		// if (res === true) {
		// 	this.props.getpreference(json);
		// }
	};

	render() {
		return (
			<React.Fragment>
				<div style={{ overflowY: 'overlay' }} className="lrBodyChild">
					<div className="leadHeader">
						EDIT WATERMARK
						<span onClick={(e) => this.props.close(e)} className={'cancel-container'}>
							<Close />
						</span>
					</div>
					<div style={{ marginTop: '64px' }}>
						<div style={{ display: 'flex' }} className="w-100 f-left ">
							<div className={'watermark-image-container'}>
								<div className={'watermark-image'}>
									<img
										className={
											this.state.imageType === 'landscape'
												? 'bg-image'
												: 'bg-image2'
										}
										src={
											this.state.imageType === 'landscape'
												? Landscape
												: Portrait
										}
									/>
									<a
										className="watermark-img"
										style={{
											left: this.state.lpos,
											right: this.state.rpos,
											top: this.state.tpos,
											bottom: this.state.bpos,
											opacity: `${(this.state.opacity / 100).toFixed(2)}`,
											width: `${this.state.scale * 0.5 + 40}px`,
											height: `${this.state.scale * 0.5 + 40}px`,
										}}
									>
										<img src={this.props.watermark.resizedWatermakrUrl} />
									</a>
								</div>
								<div className="logo-preview-toggle">
									<span
										className={`${
											this.state.imageType === 'landscape' ? 'active' : ''
										}`}
										onClick={() => this.setState({ imageType: 'landscape' })}
									>
										Desktop
									</span>
									<span
										className={`${
											this.state.imageType === 'portrait' ? 'active' : ''
										}`}
										onClick={() => this.setState({ imageType: 'portrait' })}
									>
										Mobile
									</span>
								</div>
							</div>
							<div className={'edit-watermark-container'}>
								<div className="upper-edit-container">
									<div className="input-water-mark-edit">
										<InputHeader
											type="text"
											name="name"
											isInputError={false}
											label="Name"
											value={this.state.watermarkName}
											onChange={(e) =>
												this.setState({ watermarkName: e.target.value })
											}
											width="100%"
										/>
									</div>
									<div className="scale-opacity-item">
										<div className="scale-opacity-title">Scale</div>
										<div className="percentage-plus-minus-wrapper">
											<div className="percentage-container">
												<span className="percent-number">
													{this.state.scale}
												</span>
												<span className="percentage-symbol">%</span>
											</div>
											<div className="plus-minus-container">
												<div
													className="minus-item"
													onClick={() => {
														if (this.state.scale > 1) {
															let scale = this.state.scale;
															scale -= 10;
															this.setState({ scale: scale });
														}
													}}
												>
													<span>-</span>
												</div>
												<div className="border-item"></div>
												<div
													className="plus-item"
													onClick={() => {
														if (this.state.scale < 100) {
															let scale = this.state.scale;
															scale += 10;
															this.setState({ scale: scale });
														}
													}}
												>
													<span>+</span>
												</div>
											</div>
										</div>
									</div>
									<div className="scale-opacity-item">
										<div className="scale-opacity-title">Opacity</div>
										<div className="percentage-plus-minus-wrapper">
											<div className="percentage-container">
												<span className="percent-number">
													{this.state.opacity}
												</span>
												<span className="percentage-symbol">%</span>
											</div>
											<div className="plus-minus-container">
												<div
													className="minus-item"
													onClick={() => {
														if (this.state.opacity > 1) {
															let opacity = this.state.opacity;
															opacity -= 10;
															this.setState({ opacity });
														}
													}}
												>
													<span>-</span>
												</div>
												<div className="border-item"></div>
												<div
													className="plus-item"
													onClick={() => {
														if (this.state.opacity < 100) {
															let opacity = this.state.opacity;
															opacity += 10;
															this.setState({ opacity });
														}
													}}
												>
													<span>+</span>
												</div>
											</div>
										</div>
									</div>
									<div className="position-container">
										<span className="position-title">Position</span>
										<div className="position-box-container">
											<div className="position-box-row">
												<span
													className={`box-item ${
														this.state.watermarkPosition === 'northwest'
															? 'active'
															: ''
													}`}
													onClick={() => {
														this.setState({ position: 1 });
														this.posactive(
															'northwest',
															10,
															'auto',
															'auto',
															10,
														);
													}}
												></span>
												<span
													onClick={() => {
														this.setState({ position: 2 });
														this.posactive(
															'north',
															10,
															'calc(50% - 45px)',
															'auto',
															'auto',
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'north'
															? 'active'
															: ''
													}`}
												></span>
												<span
													onClick={() => {
														this.setState({ position: 3 });
														this.posactive(
															'northeast',
															10,
															10,
															'auto',
															'auto',
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'northeast'
															? 'active'
															: ''
													}`}
												></span>
											</div>
											<div className="position-box-row">
												<span
													onClick={() => {
														this.setState({ position: 4 });
														this.posactive(
															'west',
															'calc(50% - 20px)',
															'auto',
															'auto',
															10,
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'west'
															? 'active'
															: ''
													}`}
												></span>
												<span
													onClick={() => {
														this.setState({ position: 5 });
														this.posactive(
															'center',
															'calc(50% - 20px)',
															'auto',
															'auto',
															'calc(50% - 45px)',
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'center'
															? 'active'
															: ''
													}`}
												></span>
												<span
													onClick={() => {
														this.setState({ position: 6 });
														this.posactive(
															'east',
															'calc(50% - 20px)',
															10,
															'auto',
															'auto',
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'east'
															? 'active'
															: ''
													}`}
												></span>
											</div>
											<div className="position-box-row">
												<span
													onClick={() => {
														this.setState({ position: 7 });
														this.posactive(
															'southwest',
															'auto',
															'auto',
															10,
															10,
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'southwest'
															? 'active'
															: ''
													}`}
												></span>
												<span
													onClick={() => {
														this.setState({ position: 8 });
														this.posactive(
															'south',
															'auto',
															'auto',
															10,
															'calc(50% - 45px)',
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'south'
															? 'active'
															: ''
													}`}
												></span>
												<span
													onClick={() => {
														this.setState({ position: 9 });
														this.posactive(
															'southeast',
															'auto',
															10,
															10,
															'auto',
														);
													}}
													className={`box-item ${
														this.state.watermarkPosition === 'southeast'
															? 'active'
															: ''
													}`}
												></span>
											</div>
										</div>
									</div>
									<div className="set-default-container">
										<div className="default-title">Set as Default</div>
										<div
											className={
												'toggle-button-container' +
												(this.state.watermarkProfileId !== null
													? ' active'
													: '')
											}
											onClick={() =>
												this.setState({
													watermarkProfileId:
														this.state.watermarkProfileId === null
															? this.props.watermark.profileId
															: null,
												})
											}
										>
											<span className="toggle-button"></span>
										</div>
									</div>
								</div>
								<div className="lower-cancel-save-watermark-container">
									<div className="buttons-container">
										<div
											className="cancel-container"
											onClick={(e) => this.props.close(e)}
										>
											Cancel
										</div>
										<div
											className={
												'save-button' +
												((this.state.watermarkPosition !== null &&
													this.state.watermarkPosition !==
														this.props.watermarkPosition) ||
												this.state.watermarkProfileId !==
													this.state.tempWatermarkProfileId
													? ' active'
													: '')
											}
											onClick={() => {
												if (
													(this.state.watermarkPosition !== null &&
														this.state.watermarkPosition !==
															this.props.watermarkPosition) ||
													this.state.watermarkProfileId !==
														this.state.tempWatermarkProfileId
												)
													this.saveWatermark();
											}}
										>
											Save
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Logo;
