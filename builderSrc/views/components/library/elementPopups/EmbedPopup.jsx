import React, { Component } from 'react';
import './elementPopup.scss';

// svgs
import { ReactComponent as Upload } from '../../../../assets/svg/upload.svg';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';
import { ReactComponent as Delete } from '../svgs/delete.svg';

import Images from '../../../../controllers/images';
import randomize from 'randomatic';

// cropper for image
import Cropper from 'react-easy-crop';

// !anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';
export default class EmbedPopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			active: 'e',
			activeComponent: props.activeComponent,
			debounceStateEmbed: null,

			uploadBatchID: randomize('Aa0', 10),
			interval: null,
			progressCount: 0,
			uploadedImageURL: null,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',
		};
		this.fileInputRef = React.createRef();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeAnimeType: nextProps.activeComponent?.animations?.animeType || '',
				activeAnimeName: nextProps.activeComponent?.animations?.animeName || '',
			});
		}
		if (nextProps?.activeModuleId !== this.state?.activeModuleId) {
			this.setState({
				activeModuleId: nextProps?.activeModuleId,
			});
		}
	}
	intervalRef = null;
	componentDidUpdate(prevProps, prevState) {
		if (prevState?.showAnimeLoader !== this.state?.showAnimeLoader) {
			this.showLoaderAnimation();
		}
	}
	componentWillUnmount() {
		if (this.intervalRef) clearInterval(this.intervalRef);
	}
	showLoaderAnimation = () => {
		const speed = this.state?.message?.length > 15 ? 70 : 100;

		if (this.intervalRef) clearInterval(this.intervalRef); // Clear previous interval

		this.intervalRef = setInterval(() => {
			this.setState((prevState) => {
				let nextIndex =
					prevState.highlightIndex < prevState.message.length
						? prevState.highlightIndex + 1
						: -prevState.highlightLength;

				return {
					highlightIndex: nextIndex,
				};
			});
		}, speed);
	};
	handleActive = (type) => {
		this.setState({
			active: type,
		});
	};
	// embed styles function

	handleActiveEmbedProps = (type, value, transform = '') => {
		const outerAdjustmentsTypes = [
			'animeDelay',
			'animeDuration',
			'position',
			'animeDistance',
			'direction',
			'animeIntensity',
		];
		const innerAdjustmentsTypes = [
			'scale',
			'translate',
			'translateX',
			'translateY',
			'skewY',
			'skewX',
			'skew',
			'angle',
			'opacity',
			'opacityDelay',
			'rotate',
			'mDirection',
			'spin',
			'speed',
			'orientation',
			'parts',
			'stagger',
			'blur',
		];
		let newComponent = { ...this.state.activeComponent };
		if (type == 'remove') {
			newComponent = { ...newComponent, customImageUrl: '' };
		} else if (type == 'source') {
			const processUrl = (input) => {
				try {
					// If input is empty or not a string, return null
					if (!input || typeof input !== 'string') {
						return null;
					}

					// First try to extract src if it's an iframe
					let url = input;
					if (input.includes('<iframe')) {
						const srcMatch = input.match(/src="([^"]+)"/);

						url = srcMatch ? srcMatch[1] : input;
					}

					// Try to process specific platforms only if URL matches their patterns
					if (url.includes('docs.google.com') && url.includes('/spreadsheets/')) {
						return url.replace(/\/edit/, '/preview');
					}

					if (url.includes('onedrive.live.com') || url.includes('office.com')) {
						if (url.includes('?')) {
							return url.replace('?', '/embed?');
						}
						return url + '/embed';
					}

					if (url.includes('.sharepoint.com')) {
						return url.replace('/edit', '/view');
					}

					if (url.includes('sheet.zoho.')) {
						return url.replace('/edit', '/view').replace('?', '/embed?');
					}

					if (url.includes('airtable.com') && !url.includes('/embed')) {
						const baseUrl = url.split('?')[0];
						return `${baseUrl}/embed${
							url.includes('?') ? '?' + url.split('?')[1] : ''
						}`;
					}

					if (url.includes('smartsheet.com')) {
						return url.replace('/edit', '/view');
					}

					// If no specific platform matches, return the original URL
					return url;
				} catch (error) {
					console.error('Error processing URL:', error);
					// Instead of returning null, return the original input
					return input;
				}
			};
			const src = processUrl(value);
			newComponent = { ...newComponent, source: src };
		} else if (type == 'animeType' || type == 'animeName' || type == 'animePreview') {
			newComponent = {
				...newComponent,
				animations: { ...(newComponent?.animations || {}), [type]: value },
			};
		} else if (
			outerAdjustmentsTypes.includes(type) ||
			innerAdjustmentsTypes.includes(type)
			// ||
			// type == 'animationArea' ||
			// type == 'animationPosition'
		) {
			if (
				innerAdjustmentsTypes.includes(type)
				// ||
				// type == 'animationArea' ||
				// type == 'animationPosition'
			) {
				newComponent = {
					...newComponent,
					animations: {
						...(newComponent?.animations || {}),
						adjust: true,
						adjustments: {
							...(newComponent?.animations?.adjustments || {}),
							[type]: value,
							transform: transform,
							// direction: direction,
						},
					},
				};
			} else {
				newComponent = {
					...newComponent,
					animations: {
						...(newComponent?.animations || {}),
						adjust: true,
						adjustments: {
							...(newComponent?.animations?.adjustments || {}),
							[type]: value,
						},
					},
				};
			}
		} else {
			newComponent = { ...newComponent, [type]: value };
		}

		this.setState(
			{
				activeComponent: newComponent,
				activeAnimeName: type == 'animeName' ? value : this.state?.activeAnimeName,
				showAnimeLoader: type == 'animePreview' ? true : this.state?.showAnimeLoader,
			},
			() => {
				if (type === 'description' || type == 'source') {
					this.debounceFuncForEmbed(() => {
						this.props?.setActivePopupComponent(newComponent);
					}, 1000);
				} else {
					this.props?.setActivePopupComponent(newComponent);
					if (type == 'animePreview') {
						const timeout = newComponent?.animations?.adjust
							? this.state?.activeAnimeType == 'scroll'
								? this.state?.activeAnimeName == 'arc'
									? 6
									: 4
								: parseFloat(
										newComponent?.animations?.adjustments?.animeDuration || 2,
								  ) +
								  parseFloat(newComponent?.animations?.adjustments?.animeDelay || 1)
							: 4;
						setTimeout(() => {
							newComponent = {
								...newComponent,
								animations: { ...newComponent?.animations, animePreview: false },
							};
							this.setState({ showAnimeLoader: false }, () => {
								this.props?.setActivePopupComponent(newComponent);
							});
						}, timeout * 1000);
					}
				}
			},
		);
	};

	debounceFuncForEmbed = (func, delay = 800) => {
		if (this.state?.debounceStateEmbed) {
			clearTimeout(this.state?.debounceStateEmbed);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateEmbed: debounceFunc });
	};

	// for image upload
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
					this.handleActiveEmbedProps('customImageUrl', this.state?.uploadedImageURL);
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
			<div className="elementPopupContainer">
				{this.state.isAdjustment ? (
					<>
						<div className="element_image_container_main element-shapes-container">
							<div className="element_image">
								<div className="anime-adjustment-header">
									<Arrow
										style={{ rotate: '180deg', cursor: 'pointer' }}
										onClick={() => this.setState({ isAdjustment: false })}
									/>
									<div className="heading">Adjust Animation</div>
								</div>
								<div
									style={{
										opacity: this.state?.showAnimeLoader ? 0.4 : 1,
										pointerEvents: this.state?.showAnimeLoader
											? 'none'
											: 'auto',
									}}
								>
									{this.state?.activeAnimeType === 'hover' ||
									this.state?.activeAnimeType == 'press' ? (
										<>
											<HoverPressAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveEmbedProps}
											/>
										</>
									) : this.state?.activeAnimeType === 'loop' ? (
										<>
											<LoopAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveEmbedProps}
											/>
										</>
									) : this.state?.activeAnimeType === 'scroll' ? (
										<>
											<ScrollAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveEmbedProps}
											/>
										</>
									) : (
										''
									)}
								</div>

								<div className="card-tab-wrapper">
									{this.state?.activeComponent?.animations?.animeType ? (
										<div className="anime-preview-container">
											{this.state?.showAnimeLoader ? (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														gap: '10px',
													}}
												>
													<AnimeLoader />

													<span className="heading">
														{this.state?.message
															.split('')
															.map((char, index) => (
																<span
																	key={index}
																	className="subheading"
																	style={{
																		color:
																			index >=
																				this.state
																					.highlightIndex &&
																			index <
																				this.state
																					.highlightIndex +
																					this.state
																						.highlightLength
																				? '#f1f1f1'
																				: '#7c7c84',
																	}}
																>
																	{char}
																</span>
															))}
													</span>
												</div>
											) : (
												<div
													className="heading"
													style={{ cursor: 'pointer' }}
													onClick={() =>
														this.handleActiveEmbedProps(
															'animePreview',
															true,
														)
													}
												>
													Preview
												</div>
											)}
										</div>
									) : (
										''
									)}
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="elementPopupHeader">
							<p
								className={this.state.active === 'e' ? 'active' : ''}
								onClick={() => this.handleActive('e')}
							>
								Embed
							</p>
							<p
								className={this.state.active === 'a' ? 'active' : ''}
								onClick={() => this.handleActive('a')}
							>
								Animation
							</p>
						</div>
						<div className="element_image_container_main element-shapes-container">
							{this.state?.active === 'e' ? (
								<>
									<div className="element_image">
										<div className="element_pasteURL" style={{ gap: '15px' }}>
											<>
												<p className="heading">
													Enter the URL of the item you’d like to embed,
													and we’ll fetch and format it for your site.
												</p>

												<div
													className="element_input"
													style={{
														flexDirection: 'row',
														alignItems: 'center',
													}}
												>
													<input
														type="text"
														name="source"
														placeholder="https://..."
														value={this.state?.activeComponent?.source}
														onChange={(e) =>
															this.handleActiveEmbedProps(
																'source',
																e.target.value,
															)
														}
													/>
												</div>
											</>

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
													style={{
														textTransform: 'capitalize',
														fontSize: '12px',
													}}
												>
													Custom feature Image
												</b>

												<label
													className="switch"
													onClick={() => {
														this.handleActiveEmbedProps(
															'customImage',
															!this.state?.activeComponent
																?.customImage,
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
															this.state?.activeComponent
																?.customImage ?? false
														}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
											{this.state?.activeComponent?.customImage && (
												<>
													{this.state?.activeComponent?.customImage &&
													this.state?.activeComponent?.customImageUrl ? (
														<>
															<div className="popup-cropper-container">
																<div className="crop-wrapper">
																	<Cropper
																		image={
																			this.state
																				?.activeComponent
																				?.customImageUrl
																		}
																		crop={{ x: 0, y: 0 }}
																		zoom={2}
																		aspect={1}
																		onCropChange={(e) => ''}
																		onCropComplete={(e) => ''}
																		onZoomChange={(e) => ''}
																		onCropAreaChange={(e) => ''}
																		restrictPosition={true}
																		ref={this.cropperRef}
																	/>
																	<span
																		onClick={(e) =>
																			this.handleActiveEmbedProps(
																				'remove',
																				e,
																			)
																		}
																	>
																		<Delete />
																	</span>
																</div>
															</div>
														</>
													) : (
														<>
															<div className="element_block">
																<div
																	className="image_input"
																	style={{ display: 'none' }}
																>
																	<input
																		type="file"
																		ref={this.fileInputRef}
																		onChange={(e) =>
																			this.handleFileChange(e)
																		}
																		accept=".png, .jpg, .jpeg"
																		id="fileInput"
																		onClick={(e) => {
																			e.stopPropagation();
																		}}
																	/>
																</div>

																<div
																	className=""
																	onClick={(e) =>
																		this.handleDivClick(e)
																	}
																>
																	{this.state
																		?.showImageProgressBar ? (
																		<div className="image_progress_bar">
																			<div
																				className="count"
																				style={{
																					color: '#7c7c84',
																				}}
																			>
																				{parseInt(
																					this.state
																						?.progressCount,
																				)}
																				%
																			</div>
																			<div className="progress">
																				<span
																					className="progress-b"
																					style={{
																						width: `${parseInt(
																							this
																								.state
																								?.progressCount,
																						)}%`,
																					}}
																				></span>
																				<span></span>
																			</div>
																		</div>
																	) : (
																		<div className="upload_image_block">
																			<div className="icon">
																				<Upload />
																			</div>
																			<div className="title">
																				{' '}
																				Add Image (20 MB
																				max)
																			</div>
																		</div>
																	)}
																</div>
															</div>
														</>
													)}
												</>
											)}
											{/* <div    
								className="line"
								style={{ border: '1px solid #333334', margin: '10px 0px' }}
							></div> */}
											{/* <>
								<p className="heading">Description</p>
								<div className="element_input" style={{ padding: '0px' }}>
									<textarea
										name="description"
										placeholder="Type description here..."
										value={this.state?.activeComponent?.description}
										onChange={(e) =>
											this.handleActiveEmbedProps(
												'description',
												e.target.value,
											)
										}
										// maxLength={150}
										rows={9}
										style={{
											width: '100%',
											// border: '1px solid #333334',
											// borderRadius: '5px',
											padding: '10px',
											background: 'none',
											border: 'none',
											color: ' #f1f1f187',
											resize: 'none',
										}}
									/>
								</div>
							</> */}
										</div>
									</div>
								</>
							) : (
								<>
									<div className="card-tab-wrapper">
										<div className="bg-types-container">
											<span
												className={
													`bg-item ` +
													(this.state.activeAnimeType === 'hover'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'hover' },
														() => {
															this.handleActiveEmbedProps(
																'animeType',
																'hover',
															);
														},
													)
												}
											>
												Hover
											</span>
											<span
												className={
													`bg-item` +
													(this.state.activeAnimeType === 'loop'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'loop' },
														() => {
															this.handleActiveEmbedProps(
																'animeType',
																'loop',
															);
														},
													)
												}
											>
												Loop
											</span>
											<span
												className={
													`bg-item` +
													(this.state.activeAnimeType === 'press'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'press' },
														() => {
															this.handleActiveEmbedProps(
																'animeType',
																'press',
															);
														},
													)
												}
											>
												Press
											</span>
											<span
												className={
													`bg-item` +
													(this.state.activeAnimeType === 'scroll'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'scroll' },
														() => {
															this.handleActiveEmbedProps(
																'animeType',
																'scroll',
															);
														},
													)
												}
											>
												Scroll
											</span>
										</div>
										<div className="anime-hw-popup-content">
											{this.state?.activeAnimeType == 'loop' ? (
												<LoopPopup
													activeElementAnimeName={
														this.state?.activeAnimeName
													}
													handleElementAnimationsValue={(e) =>
														this.handleActiveEmbedProps('animeName', e)
													}
													activeElementAnimeType={
														this.state?.activeAnimeType
													}
												/>
											) : this.state?.activeAnimeType == 'scroll' ? (
												<ScrollPopup
													activeElementAnimeName={
														this.state?.activeAnimeName
													}
													handleElementAnimationsValue={(e) =>
														this.handleActiveEmbedProps('animeName', e)
													}
													activeElementAnimeType={
														this.state?.activeAnimeType
													}
												/>
											) : (
												<HoverPopup
													activeElementAnimeName={
														this.state?.activeAnimeName
													}
													handleElementAnimationsValue={(e) =>
														this.handleActiveEmbedProps('animeName', e)
													}
													activeElementAnimeType={
														this.state?.activeAnimeType
													}
												/>
											)}
										</div>
										{this.state?.activeComponent?.animations?.animeType ? (
											<div className="anime-preview-container">
												<div
													className="heading"
													style={{ cursor: 'pointer' }}
													onClick={() =>
														this.setState({
															isAdjustment: true,
														})
													}
												>
													Adjust Animation
												</div>
											</div>
										) : (
											''
										)}
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		);
	}
}
