import React, { Component } from 'react';
import { ActionDropDown, UploadFileSVG, Delete } from '../../../builder_client_common';
import ColorPicker from '../../../properties/colorpicker';
import randomize from 'randomatic';
import ImageLibrary from '../../../imageLibrary/';
import Modal from '../../modals/index';
import Images from '../../../../../controllers/images';
import Cropper from 'react-easy-crop';
import _ from 'lodash';
export default class EventPopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			overlayEffect: false,
			activeComponent: props?.activeComponent || {},
			showImageProgressBar: false,
			uploadBatchID: randomize('Aa0', 10),
			interval: null,
			progressCount: 0,
			uploadedImageURL: null,
			showImageModal: props?.showImageModal,
			debounceCropperValues: null,
			activeModule: props?.activeModule ?? 'block',
			activeComponent: this.props?.activeComponent,
			activeBgtype: props?.activeComponent?.style?.backgroundType || 'background',
			debounceInterval: null,
		};
		this.fileInputRef = React.createRef();
	}
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.activeComponent) {
			this.setState({ activeComponent: nextProps.activeComponent });
		}
	};
	handleSetEventModule = (e) => {
		this.setState({
			activeModule: e,
		});
	};
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
						backgroundType: 'background',
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
						sectionBackgroundColor: newComponent?.style?.sectionBackgroundColor || '',
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
				// this.props?.setBgType(newComponent?.style?.backgroundType);
				this.props?.setActiveSection(newComponent);
			},
		);
	};
	handleEventCardStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		newComponent = {
			...newComponent,
			style: { ...newComponent?.style, [type]: value },
		};
		this.setState({ activeComponent: newComponent });
		this.props?.setActiveSection(newComponent);
	};
	handleVideoProps = (type, value) => {
		let newComponent = { ...this.props?.activeComponent };
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
			this.props?.setActiveSection(newComponent);
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
				res = await this.uploadImage(json, file, this.props?.activeModuleId);
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
	handleBlockItemImage = (imageURL) => {
		let newActiveBlock = { ...this.props?.activeBlock };
		newActiveBlock.subBlocks[0].imageURL = imageURL;
		this.setState({
			activeBlock: newActiveBlock,
		});
		this.props?.setActiveBlock(newActiveBlock);
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
					if (!this.props?.isServiceItem) {
						this.handleActiveCardStyles(
							'backgroundImageURL',
							this.state.uploadedImageURL,
						);
					} else {
						this.handleBlockItemImage(this.state.uploadedImageURL);
					}
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
	render() {
		return (
			<div className="service-popup-container element_image_container_main element-shapes-container">
				<div className="service-popup-header">
					<div
						onClick={() => this.handleSetEventModule('block')}
						className={`service-popup-header-title ${
							this.state.activeModule === 'block' ? 'active' : ''
						}`}
					>
						Block
					</div>
					<div
						onClick={() => this.handleSetEventModule('design')}
						className={`service-popup-header-title ${
							this.state.activeModule === 'design' ? 'active' : ''
						}`}
					>
						Design
					</div>
				</div>
				<div className="service-popup-body element_image_container_main element-shapes-container">
					{this.state.activeModule === 'block' && (
						<>
							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div className="block_styles pad-color-p-imp">
										<ColorPicker
											title={'Event Card Background Color'}
											color={
												this.props?.activeComponent?.style
													?.cardBackgroundColor
											}
											handleColor={(e) =>
												this.handleEventCardStyles('cardBackgroundColor', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											isDarkBg={true}
										/>
									</div>
								</div>
							</div>
							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div className="block_styles pad-color-p-imp">
										<ColorPicker
											title={'Event Card Font Color'}
											color={this.props?.activeComponent?.style?.fontColor}
											handleColor={(e) =>
												this.handleEventCardStyles('fontColor', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											isDarkBg={true}
										/>
									</div>
								</div>
							</div>
							<div className="padding-options-wrapper">
								<div className="padding-options-header">Vertical Padding</div>
								<div className="padding-options-item">
									<div
										className={`padding-one ${
											!_.has(this.props?.activeComponent?.style, 'padding') ||
											this.props?.activeComponent?.style?.padding === 0
												? 'active'
												: ''
										}`}
										onClick={() => this.handleEventCardStyles('padding', 0)}
									>
										null
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 1
												? 'active'
												: ''
										}`}
										onClick={() => this.handleEventCardStyles('padding', 1)}
									>
										S
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 2
												? 'active'
												: ''
										}`}
										onClick={() => this.handleEventCardStyles('padding', 2)}
									>
										M
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 3
												? 'active'
												: ''
										}`}
										onClick={() => this.handleEventCardStyles('padding', 3)}
									>
										L
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 4
												? 'active'
												: ''
										}`}
										onClick={() => this.handleEventCardStyles('padding', 4)}
									>
										XL
									</div>
								</div>
							</div>
							{/* <div className="padding-options-wrapper">
                                <div className="padding-options-header">
                                    Horizontal Padding
                                </div>
                                <div className="padding-options-item">
                                    <div className={`padding-one ${!_.has(this.props?.activeComponent?.style, 'paddingHorizontal') || this.props?.activeComponent?.style?.paddingHorizontal === 0 ? 'active' : ''}`} onClick={() => this.handleEventCardStyles('paddingHorizontal', 0)}>null</div>
                                    <div className={`padding-one ${this.props?.activeComponent?.style?.paddingHorizontal == 1 ? 'active' : ''}`} onClick={() => this.handleEventCardStyles('paddingHorizontal', 1)}>S</div>
                                    <div className={`padding-one ${this.props?.activeComponent?.style?.paddingHorizontal == 2 ? 'active' : ''}`} onClick={() => this.handleEventCardStyles('paddingHorizontal', 2)}>M</div>
                                    <div className={`padding-one ${this.props?.activeComponent?.style?.paddingHorizontal == 3 ? 'active' : ''}`} onClick={() => this.handleEventCardStyles('paddingHorizontal', 3)}>L</div>
                                    <div className={`padding-one ${this.props?.activeComponent?.style?.paddingHorizontal == 4 ? 'active' : ''}`} onClick={() => this.handleEventCardStyles('paddingHorizontal', 4)}>XL</div>
                                </div>
                            </div> */}
						</>
					)}
					{this.state.activeModule === 'design' && (
						<div className="card-tab-wrapper">
							{/* <div
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
                      </div> */}
							<div className="line"></div>
							<div
								className="bg-types-container"
								style={{ justifyContent: 'space-evenly' }}
							>
								<span
									className={
										`bg-item ` +
										(this.props?.activeComponent?.style?.backgroundType ===
										'background'
											? ' active-bg-type'
											: '')
									}
									onClick={() =>
										this.setState({ activeBgtype: 'background' }, () => {
											this.handleActiveCardStyles(
												'backgroundType',
												'background',
											);
										})
									}
								>
									Color
								</span>
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
							</div>
							{this.state.activeBgtype == 'background' ? (
								<div className="element_image">
									<div className="element_pasteURL" style={{ gap: '15px' }}>
										<div
											className="block_styles pad-color-p-imp"
											style={{ padding: '12px 0px' }}
										>
											<ColorPicker
												title={'Background Color'}
												color={
													this.state?.activeComponent?.style
														?.sectionBackgroundColor
												}
												handleColor={(e) =>
													this.handleActiveCardStyles(
														'sectionBackgroundColor',
														e,
													)
												}
												brandColors={this.props?.brandColors}
												zoom={0.8}
												isDarkBg={true}
											/>
										</div>
									</div>
								</div>
							) : this.state?.activeBgtype == 'image' ? (
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
																<UploadFileSVG />
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
											<span
												style={{
													color: '#7c7c84',
													fontSize: '12px',
													fontWeight: '500',
													fontFamily: 'Inter',
												}}
											>
												{' '}
												Selects from Library
											</span>
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
													<ActionDropDown
														style={{
															transform: this.state.overlayEffect
																? 'rotate(180deg)'
																: 'rotate(0deg)',
														}}
													/>
												</div>
												{this.state.overlayEffect && (
													<>
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
																			this.state
																				?.activeComponent
																				?.style
																				?.bgOverlayOpacity
																		}
																		%
																	</p>
																</div>
															</div>
														</div>
													</>
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
							if (!this.props?.isServiceItem) {
								this.handleActiveCardStyles('backgroundImageURL', e);
							} else {
								this.handleBlockItemImage(e);
							}
						}}
					/>
				</Modal>
			</div>
		);
	}
}
