import React from 'react';
import { ReactComponent as UploadFile } from '../../svgs/uploadFile.svg';
import _ from 'lodash';

import { ReactComponent as GridGap } from '../../svgs/gridGap.svg';
import { ReactComponent as GridNoGap } from '../../svgs/gridNoGap.svg';
import { ReactComponent as RowGap } from '../../svgs/rowHeight.svg';
import { ReactComponent as ColumnGap } from '../../svgs/coloumGap.svg';
import { ReactComponent as Positive } from '../../svgs/positive.svg';
import { ReactComponent as Negative } from '../../svgs/negative.svg';

import { ReactComponent as RightArrow } from '../../svgs/dropDown.svg';
import ColorPicker from '../../../properties/colorpicker';
import '../elementPopup.scss';

// Image for Api

import Images from '../../../../../controllers/images';
import randomize from 'randomatic';

// modal for library

import Modal from '../../modals/index';
import ImageLibrary from '../../../imageLibrary';

// cropper for image
import Cropper from 'react-easy-crop';
import { ReactComponent as Delete } from '../../svgs/delete.svg';
export default class FormCardPopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			active: 'c',
			overlayEffect: false,
			activeComponent: props?.activeComponent || {},
			showImageProgressBar: false,
			uploadBatchID: randomize('Aa0', 10),
			interval: null,
			progressCount: 0,
			uploadedImageURL: null,
			showImageModal: false,
			debounceCropperValues: null,
			activeModuleId: props?.activeModuleId,

			activeBgtype: props?.activeComponent?.style?.backgroundType || 'image',
		};

		this.fileInputRef = React.createRef();
		this.cropperRef = React.createRef();
		this.popupRef = React.createRef();
	}

	componentDidMount() {
		// document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		// document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (event) => {
		// Don't close if clicking on the draggable handle
		if (event.target.closest('.draggerPoint')) {
			return;
		}

		if (this.popupRef.current && !this.popupRef.current.contains(event.target)) {
			const updatedComponent = {
				...this.state.activeComponent,
				shouldClose: true,
			};
			this.props.handleCardPopupProps(updatedComponent);
		}
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeBgtype: nextProps?.activeComponent?.style?.backgroundType,
			});
		}
		if (nextProps?.activeModuleId !== this.state?.activeModuleId) {
			this.setState({
				activeModuleId: nextProps?.activeModuleId,
			});
		}
	}
	handleActive = (type) => {
		this.setState({
			active: type,
		});
	};

	//! file/image upload functions
	handleDivClick = (e) => {
		if (this.fileInputRef.current) {
			this.fileInputRef.current.click();
		}
	};

	handleFileChange = async (event, uploadAIImage = false) => {
		let file;
		if (uploadAIImage) {
			this.setState({
				activeImageURL: null,
			});
			try {
				// Handle both full data URL and raw base64 string
				const base64Data = event.includes('data:') ? event.split(';base64,').pop() : event;

				// Validate base64 string
				if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
					throw new Error('Invalid base64 string');
				}

				const byteCharacters = atob(base64Data);
				const byteArrays = [];

				for (let offset = 0; offset < byteCharacters.length; offset += 512) {
					const slice = byteCharacters.slice(offset, offset + 512);
					const byteNumbers = new Array(slice.length);

					for (let i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					byteArrays.push(byteArray);
				}

				const blob = new Blob(byteArrays, { type: 'image/jpeg' });
				file = new File([blob], 'ai-generated-image.jpg', { type: 'image/jpeg' });
			} catch (error) {
				console.error('Error processing base64 image:', error);
				return;
			}
		} else {
			file = event.target.files[0];
		}

		if (file) {
			this.setState({ showImageProgressBar: true }, () => {
				this.startCounting();
			});

			let json = {
				uploadBatchId: this.state.uploadBatchID,
				originalFileName: uploadAIImage ? 'ai-generated-image.jpg' : file?.name,
				originalDateTime: uploadAIImage ? moment().unix() : file?.lastModified,
			};

			let res = null;

			if (this.props?.isWorkflow) {
				res = await this.uploadImageWorkflow(json, file, {
					module: this.props.module,
					activeWorkflowModuleId: this.props.activeWorkflowModuleId,
				});
			} else {
				res = await this.uploadImage(json, file);
			}

			this.setState({
				uploadedImageURL: res[1],
			});

			let interval = setInterval(() => this.getUploadStatus(res[0]), 3000);
			this.setState({
				interval: interval,
			});
		}
	};
	getUploadStatus = async (imageID) => {
		let res = await this.getImageUploadStatus(this.state.uploadBatchID);
		if (res.processedCount === 1 && res.uploadedCount === 1) {
			clearInterval(this.state.interval);
			//this.props.getImages();
			//this.props.saveImage(imageID, this.state.originalHeight, this.state.originalWidth);
			this.setState(
				{
					interval: null,
					progressCount: 0,
					showImageProgressBar: false,
					activeImageURL: this.state.uploadedImageURL,
					uploadBatchID: randomize('Aa0', 10),
				},
				() => {
					// this.props.setImage(this.state.uploadedImageURL);
					this.handleActiveCardStyles('backgroundImageURL', this.state.uploadedImageURL);
				},
			);
		}
	};
	startCounting = () => {
		const duration = 2000; // 2 seconds
		const targetCount = 99;
		const interval = 10; // milliseconds
		const increment = targetCount / (duration / interval);

		this.intervalId = setInterval(() => {
			this.setState((prevState) => {
				const newCount = prevState.progressCount + increment;
				if (newCount >= targetCount) {
					clearInterval(this.intervalId);
					return { progressCount: targetCount };
				}
				return { progressCount: newCount };
			});
		}, interval);
	};

	//! grid layout related functions

	// ! background related functions
	handleActiveCardStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		if (
			type == 'sectionBackgroundColor' ||
			type == 'backgroundImageURL' ||
			type == 'backgroundVideoURL' ||
			type == 'backgroundType'
		) {
			if (type == 'sectionBackgroundColor') {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						sectionBackgroundColor: value,
						backgroundType: 'color',
					},
				};
			} else if (type == 'backgroundImageURL') {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						backgroundImageURL: value,
						backgroundType: 'image',
					},
				};
			} else if (type == 'backgroundVideoURL') {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						backgroundVideoURL: value,
						backgroundType: 'video',
					},
				};
			} else {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						backgroundType: value,
					},
				};
			}
		} else {
			newComponent = {
				...newComponent,
				style: {
					...newComponent?.style,

					[type]: value,
				},
			};
		}
		this.setState(
			{ activeComponent: newComponent, activeBgtype: newComponent?.style?.backgroundType },
			() => {
				this?.props?.handleCardPopupProps(
					newComponent,
					type == 'bgOverlayOpacity' ||
						type == 'verticalPadding' ||
						type == 'backgroundVideoURL'
						? true
						: false,
					type == 'verticalPadding' ? true : false,
				);
			},
		);
	};

	// ! bgvideo related functions
	handleVideoProps = (type, value) => {
		let newComponent = { ...this.state.activeComponent };

		newComponent = {
			...newComponent,
			style: {
				...newComponent?.style,
				videoProps: {
					...newComponent?.style?.videoProps,
					[type]: value,
				},
			},
		};

		this.setState({ activeComponent: newComponent }, () => {
			this.props?.handleCardPopupProps(newComponent, true, false);
		});
	};

	handleFormPadding = (value) => {
		let newComponent = { ...this.state.activeComponent };
		newComponent = {
			...newComponent,
			style: {
				...newComponent?.style,
				padding: value,
			},
		};
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.handleCardPopupProps(newComponent);
		});
	};

	render() {
		return (
			<div
				className="elementPopupContainer"
				style={{
					height: '425px',
				}}
				ref={this.popupRef}
			>
				<div className="elementPopupHeader">
					<p
						className={this.state.active === 'c' ? 'active' : ''}
						onClick={() => this.handleActive('c')}
					>
						Card
					</p>
					<p
						className={this.state.active === 'b' ? 'active' : ''}
						onClick={() => this.handleActive('b')}
					>
						Background
					</p>
					{/* <p
						className={this.state.active === 's' ? 'active' : ''}
						onClick={() => this.handleActive('s')}
					>
						Animation
					</p> */}
				</div>
				<div className="element_image_container_main element-shapes-container">
					{this.state?.active == 'c' ? (
						<div className="card-tab-wrapper">
							<div
								className="bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<b>Show Form Logo</b>
								<label
									className="switch"
									onClick={() => {
										this.handleActiveCardStyles(
											'showFormLogo',
											!this.state?.activeComponent?.style?.showFormLogo,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state?.activeComponent?.style?.showFormLogo ?? true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div className="line"></div>
							<div
								className="bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<b>Show Form Title</b>
								<label
									className="switch"
									onClick={() => {
										this.handleActiveCardStyles(
											'showFormTitle',
											!this.state?.activeComponent?.style?.showFormTitle,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state?.activeComponent?.style?.showFormTitle ??
											true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div className="line"></div>
							<div
								className="bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<b>Show Form Description</b>
								<label
									className="switch"
									onClick={() => {
										this.handleActiveCardStyles(
											'showFormDescription',
											!this.state?.activeComponent?.style
												?.showFormDescription,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state?.activeComponent?.style
												?.showFormDescription ?? true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div className="line"></div>
							<div className="padding-options-wrapper">
								<div
									className="padding-options-header"
									style={{
										color: '#e8e8e8',
										fontSize: '14px',
										fontWeight: '500',
										lineHeight: '24px',
									}}
								>
									Horizontal Padding
								</div>
								<div className="padding-options-item">
									<div
										className={`padding-one ${
											!_.has(this.props?.activeComponent?.style, 'padding') ||
											this.props?.activeComponent?.style?.padding === 0
												? 'active'
												: ''
										}`}
										onClick={() => this.handleFormPadding(0)}
									>
										S
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 2
												? 'active'
												: ''
										}`}
										onClick={() => this.handleFormPadding(2)}
									>
										M
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 4
												? 'active'
												: ''
										}`}
										onClick={() => this.handleFormPadding(4)}
									>
										L
									</div>
								</div>
							</div>
							{/* <div className="line"></div>
							<div
								className="bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<b>Single Page View</b>
								<label
									className="switch"
									onClick={() => {
										this.handleActiveCardStyles('isSinglePage', true);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state?.activeComponent?.style?.isSinglePage ===
											true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div className="line"></div>
							<div
								className="bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<b>Multi Page View</b>
								<label
									className="switch"
									onClick={() => {
										this.handleActiveCardStyles('isSinglePage', false);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state?.activeComponent?.style?.isSinglePage ===
											false
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div> */}

							{/* <div className="popup-shapes-range-wrapper">
								<b>Vertical Padding</b>
								<div className="popup-range-div">
									<div
										style={{
											display: 'flex',
											maxWidth: 170,
										}}
									>
										<input
											type="range"
											min={0}
											max={100}
											step={1}
											value={
												this.state?.activeComponent?.style?.verticalPadding
											}
											onChange={(e) =>
												this.handleActiveCardStyles(
													'verticalPadding',
													parseInt(e.target.value),
												)
											}
										/>
									</div>
									<p
										style={{
											textAlign: 'center',
										}}
									>
										{this.state?.activeComponent?.style?.verticalPadding}px
									</p>
								</div>
							</div> */}
						</div>
					) : (
						<div className="card-tab-wrapper">
							<div
								className="block_styles pad-color-p-imp"
								style={{ padding: '12px 0px' }}
							>
								<ColorPicker
									title={'Background Color'}
									color={
										this.state?.activeComponent?.style?.sectionBackgroundColor
									}
									handleColor={(e) =>
										this.handleActiveCardStyles('sectionBackgroundColor', e)
									}
									brandColors={this.props?.brandColors}
									zoom={0.8}
									isDarkBg={true}
								/>
							</div>
							<div className="line"></div>
							<div
								className="bg-types-container"
								style={{ justifyContent: 'space-evenly' }}
							>
								<span
									className={
										`bg-item ` +
										(this.state.activeBgtype === 'image'
											? ' active-bg-type'
											: '')
									}
									onClick={() =>
										this.setState({ activeBgtype: 'image' }, () => {
											this.handleActiveCardStyles('backgroundType', 'image');
										})
									}
								>
									Image
								</span>
								<span
									className={
										`bg-item` +
										(this.state.activeBgtype === 'video'
											? ' active-bg-type'
											: '')
									}
									onClick={() =>
										this.setState({ activeBgtype: 'video' }, () => {
											this.handleActiveCardStyles('backgroundType', 'video');
										})
									}
								>
									Video
								</span>
								{/* <span
									className={
										`bg-item` +
										(this.state.activeBgtype === 'custom'
											? ' active-bg-type'
											: '')
									}
									onClick={() => this.setState({ activeBgtype: 'custom' })}
								>
									Custom
								</span> */}
							</div>
							{this.state?.activeBgtype == 'image' ? (
								<>
									{this.state?.activeComponent?.style?.backgroundImageURL ? (
										<div
											className="element_image"
											style={{ marginTop: '10px' }}
										>
											<div className="popup-cropper-container">
												<div className="crop-wrapper">
													<Cropper
														image={
															this.state?.activeComponent?.style
																?.backgroundImageURL
														}
														crop={{ x: 0, y: 0 }}
														zoom={2}
														aspect={3 / 2}
														onCropChange={(e) => ''}
														onCropComplete={(e) => ''}
														onZoomChange={(e) => ''}
														onCropAreaChange={(e) => ''}
														restrictPosition={true}
														ref={this.cropperRef}
													/>
													<span
														onClick={(e) =>
															this.handleActiveCardStyles(
																'backgroundImageURL',
																'',
															)
														}
													>
														<Delete />
													</span>
												</div>
											</div>
										</div>
									) : (
										<div
											className="element_image"
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
											}}
										>
											<div className="element_block">
												<div
													className="image_input"
													style={{ display: 'none' }}
												>
													<input
														type="file"
														ref={this.fileInputRef}
														onChange={(e) => this.handleFileChange(e)}
														accept=".png, .jpg, .jpeg"
														id="fileInput"
														onClick={(e) => {
															e.stopPropagation();
														}}
													/>
												</div>

												<div
													className=""
													onClick={(e) => this.handleDivClick(e)}
												>
													{this.state.showImageProgressBar ? (
														<div className="image_progress_bar">
															<div
																className="count"
																style={{
																	color: '#7c7c84',
																}}
															>
																{parseInt(this.state.progressCount)}
																%
															</div>
															<div className="progress">
																<span
																	className="progress-b"
																	style={{
																		width: `${parseInt(
																			this.state
																				.progressCount,
																		)}%`,
																	}}
																></span>
																<span></span>
															</div>
														</div>
													) : (
														<div
															className="upload_image_block"
															style={{ gap: '10px' }}
														>
															<div className="">
																<UploadFile />
															</div>
															<div className="title">
																{' '}
																Upload Image
															</div>
															<div className="title">
																{' '}
																(Recommended 2000 x 2000 px)
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
									)}
									<div className="element_image">
										<div className="element_or">
											<div className="ortext">Or</div>
											<div className="line"></div>
										</div>
										<div
											className="element_button"
											onClick={() =>
												this.setState({ showImageModal: true }, () => {
													this.props?.setModalRef(
														this.state.showImageModal,
													);
												})
											}
											style={{ cursor: 'pointer' }}
										>
											<span className="subheading"> Select from Library</span>
										</div>
									</div>
								</>
							) : this.state?.activeBgtype == 'video' ? (
								<div className="element_image">
									<div className="element_pasteURL" style={{ gap: '15px' }}>
										<p className="heading">Video URL</p>
										<p className="subheading">
											Paste the URL link of your YouTube or Vimeo hosted
											video.
										</p>

										<div
											className="element_input"
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<input
												type="text"
												name="videoURL"
												placeholder="https://..."
												value={
													this.state?.activeComponent?.style
														?.backgroundVideoURL
												}
												onChange={(e) =>
													this.handleActiveCardStyles(
														'backgroundVideoURL',
														e.target.value,
													)
												}
											/>
										</div>
										<div
											className="line"
											style={{
												border: '1px solid #333334',
												margin: '10px 0px',
											}}
										></div>
										<div
											className=" bs-item bs-item-row animated-item"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												// margin: '20px 0px',
											}}
										>
											<b
											// style={{ textTransform: 'capitalize' }}
											>
												Mute video
											</b>

											<label
												className="switch"
												onClick={() => {
													this.handleVideoProps(
														'muteVideo',
														!this.state?.activeComponent?.style
															?.videoProps?.muteVideo,
													);
												}}
											>
												<input
													type="checkbox"
													// onChange={(e) => {
													// 	e.preventDefault();
													// 	this.handleActiveStickerStyles(
													// 		'stretch',
													// 		e.target.checked,
													// 	);
													// }}
													checked={
														this.state?.activeComponent?.style
															?.videoProps?.muteVideo ?? false
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
										<div
											className=" bs-item bs-item-row animated-item"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												// margin: '20px 0px',
											}}
										>
											<b
											// style={{ textTransform: 'capitalize' }}
											>
												Video loop
											</b>

											<label
												className="switch"
												onClick={() => {
													this.handleVideoProps(
														'loop',
														!this.state?.activeComponent?.style
															?.videoProps?.loop,
													);
												}}
											>
												<input
													type="checkbox"
													// onChange={(e) => {
													// 	e.preventDefault();
													// 	this.handleActiveStickerStyles(
													// 		'stretch',
													// 		e.target.checked,
													// 	);
													// }}
													checked={
														this.state?.activeComponent?.style
															?.videoProps?.loop ?? false
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
							{this.state?.activeBgtype == 'video' ||
							this.state?.activeBgtype == 'image' ? (
								<>
									<div className="element_image">
										<div className="element_pasteURL" style={{ gap: '15px' }}>
											<div
												className="overlayEffectContainer"
												style={{ marginTop: '10px' }}
											>
												<div
													className="overlayEffectHeading"
													onClick={() =>
														this.setState({
															overlayEffect:
																!this.state.overlayEffect,
														})
													}
												>
													<p className="heading">Overlay effect</p>
													<RightArrow
														style={{
															transform: this.state.overlayEffect
																? 'rotate(180deg)'
																: 'rotate(0deg)',
														}}
													/>
												</div>
												{this.state.overlayEffect && (
													<div
														className="overlayEffectContent"
														style={{ marginTop: '10px' }}
													>
														<div
															className="block_styles pad-color-p-imp"
															style={{ padding: '12px 0px' }}
														>
															<ColorPicker
																title={' Color'}
																color={
																	this.state?.activeComponent
																		?.style?.bgOverlayColor
																}
																handleColor={(e) =>
																	this.handleActiveCardStyles(
																		'bgOverlayColor',
																		e,
																	)
																}
																brandColors={
																	this.props?.brandColors
																}
																zoom={0.8}
																isDarkBg={true}
															/>
														</div>

														<div className="popup-shapes-range-wrapper">
															<b>Opacity</b>
															<div className="popup-range-div">
																<div
																	style={{
																		display: 'flex',
																		maxWidth: 170,
																	}}
																>
																	<input
																		type="range"
																		min={0}
																		max={100}
																		step={5}
																		value={
																			this.state
																				?.activeComponent
																				?.style
																				?.bgOverlayOpacity
																		}
																		onChange={(e) =>
																			this.handleActiveCardStyles(
																				'bgOverlayOpacity',
																				e.target.value,
																			)
																		}
																	/>
																</div>
																<p
																	style={{
																		textAlign: 'center',
																	}}
																>
																	{
																		this.state?.activeComponent
																			?.style
																			?.bgOverlayOpacity
																	}
																	%
																</p>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								</>
							) : (
								''
							)}
						</div>
					)}
				</div>
				<Modal
					show={this.state.showImageModal}
					handleClose={(e) => {
						this.setState({ showImageModal: false }, () => {
							this.props?.setModalRef(this.state.showImageModal);
						});
					}}
					modalType={'center'}
				>
					<ImageLibrary
						close={(e) => {
							this.setState({ showImageModal: false }, () => {
								this.props?.setModalRef(this.state.showImageModal);
							});
						}}
						setLibraryImage={(e) => {
							this.handleActiveCardStyles('backgroundImageURL', e);
						}}
					/>
				</Modal>
			</div>
		);
	}
}
