import React from 'react';
import './elementPopup.scss';
import ColorPicker from '../../properties/colorpicker';

// * svgs
import { ReactComponent as Upload } from '../../../../assets/svg/upload.svg';
import { ReactComponent as DropDown } from '../../../../assets/svg/dropDown.svg';
import { ReactComponent as RightArrow } from '../svgs/dropDown.svg';
import { ReactComponent as Pages } from '../svgs/Pages.svg';
import { ReactComponent as Delete } from '../svgs/delete.svg';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';

// Image for Api

import Images from '../../../../controllers/images';
import randomize from 'randomatic';

// modal for library

import Modal from '../modals/index';
import ImageLibrary from '../../imageLibrary';

// cropper for image
import Cropper from 'react-easy-crop';

// *anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';
import _ from 'lodash';

export default class ImagePopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			active: 'i',
			stylesState: this.props?.activeComponent?.mImageObjectFit || 'shape',
			activeShape: 1,
			overlayEffect: false,
			showShapes: false,
			activeComponent: props?.activeComponent || {},
			showImageProgressBar: false,
			uploadBatchID: randomize('Aa0', 10),
			interval: null,
			progressCount: 0,
			uploadedImageURL: null,

			extraProps: {
				altText: this.props?.activeComponent?.altText,
				link: this.props?.activeComponent?.link || '',
			},
			debounceStateForAltProps: null,
			pageDropdown: false,
			sectionDropdown: false,
			sectionLinkDropdown: false,
			showImageModal: false,
			debounceCropperValues: null,
			zoom: props?.activeComponent?.image_settings?.zoom,
			crop: props?.activeComponent?.image_settings?.crop,
			aspect: props?.activeComponent?.image_settings?.aspect,
			activeModuleId: props?.activeModuleId,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',
		};

		this.fileInputRef = React.createRef();
		this.cropperRef = React.createRef();
		// this.handleFileChange = this.handleFileChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				// zoom: nextProps.activeComponent?.image_settings?.zoom,
				crop: nextProps.activeComponent?.image_settings?.crop,
				aspect: nextProps.activeComponent?.image_settings?.aspect,
				extraProps: {
					altText: nextProps.activeComponent?.altText,
					link: nextProps.activeComponent?.link,
				},
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

	handleStylesState = (type) => {
		this.setState(
			{
				stylesState: type,
			},
			() => {
				if (type != 'shape') {
					this.handleActiveImageStyles(
						this.props?.previewType == 'm' ? 'mobileImageObjectFit' : 'mImageObjectFit',
						type,
					);
				}
			},
		);
	};
	handleActiveShape = (type) => {
		this.setState({
			activeShape: type,
		});
	};

	handleActiveImageStyles = (type, value, transform = '', debounce = false) => {
		const outerAdjustmentsTypes = [
			'animeDelay',
			'animeDuration',
			'position',
			'animeDistance',
			'direction',
			'animeIntensity',
			'animeArea',
			'triggerPoint',
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
		let image_settings = {
			crop: { x: 0, y: 0 },
			zoom: 1,
			aspect: 3 / 2,
		};
		if (type == 'page' || type == 'section' || type == 'link' || type == 'removeLink') {
			if (type == 'link') {
				newComponent = {
					...newComponent,
					link: value,
					linkType: 'link',
				};
			} else if (type == 'page') {
				newComponent = {
					...newComponent,
					linkModuleName: value?.label,
					linkModuleId: value?._id,
					linkModuleType: value?.module,
					linkType: 'page',
				};
				this.setState({ pageDropdown: false, sectionDropdown: true }, () => {
					this.props?.getModuleSections(value);
				});
			} else if (type == 'removeLink') {
				newComponent = {
					...newComponent,
					link: '',
					linkType: 'link',
					linkModuleName: '',
					linkModuleId: '',
					linkModuleType: '',
					sectionId: '',
				};
			} else {
				newComponent = {
					...newComponent,
					sectionId: value,
					linkType: 'section',
				};
				this.setState({
					sectionLinkDropdown: false,
					sectionDropdown: false,
				});
			}
		} else if (type == 'remove') {
			newComponent = {
				...newComponent,
				imageURL: '',
				image_settings: newComponent?.image_settings || image_settings,
				// mImageObjectFit:''
			};
		} else if (type == 'imageURL') {
			newComponent = {
				...newComponent,
				[type]: value,
				image_settings: newComponent?.image_settings || image_settings,
			};
		} else if (type == 'stretch') {
			newComponent = {
				...newComponent,
				stretch: value,
			};
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
		} else if (
			this.props?.previewType !== 'm' &&
			(type == 'mobileImageObjectFit' || type == 'mImageObjectFit')
		) {
			newComponent = {
				...newComponent,
				mobileImageObjectFit: value,
				mImageObjectFit: value,
			};
		} else {
			newComponent = { ...newComponent, [type]: value };
		}
		this.setState(
			{
				activeComponent: newComponent,
				activeAnimeName: type == 'animeName' ? value : this.state?.activeAnimeName,
				showAnimeLoader: type == 'animePreview' ? true : this.state?.showAnimeLoader,
				extraProps: {
					...this.state.extraProps,
					link: type == 'removeLink' ? '' : this.state.extraProps.link,
				},
			},
			() => {
				if (debounce) {
					this.debounceFuncForAltProps(() => {
						this.props?.setActivePopupComponent(newComponent);
					}, 700);
				} else {
					this.props?.setActivePopupComponent(newComponent);
				}
				if (type == 'animePreview') {
					const timeout = newComponent?.animations?.adjust
						? this.state?.activeAnimeType == 'scroll'
							? this.state?.activeAnimeName == 'arc'
								? 6
								: 4
							: parseFloat(
									newComponent?.animations?.adjustments?.animeDuration || 2,
							  ) + parseFloat(newComponent?.animations?.adjustments?.animeDelay || 1)
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
			},
		);
	};

	//! file upload functions
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
					this.handleActiveImageStyles('imageURL', this.state.uploadedImageURL);
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

	//! extra props function
	handleExtraprops = (e) => {
		const { name, value } = e.target;
		this.setState(
			{
				extraProps: { ...this.state.extraProps, [name]: value },
				pageDropdown: name == 'link' ? false : this.state.pageDropdown,
				sectionDropdown: name == 'link' ? false : this.state.sectionDropdown,
			},
			() => {
				this.debounceFuncForAltProps(() => {
					this.handleActiveImageStyles(name, value);
				}, 700);
			},
		);
	};

	debounceFuncForAltProps = (func, delay = 500) => {
		if (this.state.debounceStateForAltProps) {
			clearTimeout(this.state.debounceStateForAltProps);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateForAltProps: debounceFunc });
	};

	//! cropper functions
	handleZoomChange = (value) => {
		localStorage.setItem(
			`${this.state.activeComponent?.imageURL}::${this.props?.activeSectionID}::zoom`,
			value,
		);
		let newComponent = {
			...this.state.activeComponent,
			mImageObjectFit: '',
			mobileImageObjectFit: '',
			image_settings: { ...this.state.activeComponent?.image_settings, zoom: value },
		};
		this.setState(
			{
				// zoom: value != this.state.zoom ? value : this.state.zoom,
				zoom: value,
				activeComponent: newComponent,
				stylesState: 'shape',
			},
			() => {
				this.props?.setActiveImageSettings(newComponent);
			},
		);
	};

	handleCropChange = (value) => {
		if (
			this.cropperRef.current &&
			this.cropperRef.current?.props?.crop?.x === value.x &&
			this.cropperRef.current?.props?.crop?.y === value.y
		) {
			return; // Do nothing if crop hasn't changed
		}
		localStorage.setItem(
			`${this.state.activeComponent?.imageURL}::${this.props?.activeSectionID}::crop`,
			JSON.stringify(value),
		);
		this.cropperRef.current = value;
		let newComponent = {
			...this.state.activeComponent,
			mImageObjectFit: '',
			mobileImageObjectFit: '',
			image_settings: { ...this.state.activeComponent?.image_settings, crop: value },
		};
		this.setState(
			{
				// zoom: value != this.state.zoom ? value : this.state.zoom,
				crop: value,
				activeComponent: newComponent,
				stylesState: 'shape',
			},
			() => {
				this.props?.setActiveImageSettings(newComponent);
			},
		);
	};

	render() {
		const shapesData = [
			{
				name: 'square',
				style: {
					borderRadius: '0px',
					width: '38px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'circle',
				style: {
					borderRadius: '100%',
					width: '38px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'vRectangle',
				style: {
					borderRadius: '0px',
					width: '30px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'hRectangle',
				style: {
					borderRadius: '0px',
					width: '38px',
					height: '30px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'rectangle',
				style: {
					borderRadius: '100px 100px 0px 0px',
					width: '30px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'vcapsule',
				style: {
					borderRadius: '100px',
					width: '30px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'capsule',
				style: {
					borderRadius: '100px',
					width: '40px',
					height: '28px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'arcRight',
				style: {
					borderRadius: '0px 15px',
					width: '30px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
			{
				name: 'arcLeft',
				style: {
					borderRadius: '15px 0px',
					width: '30px',
					height: '38px',
					backgroundColor: '#3c3c3c',
				},
			},
		];
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
												adjustAnimation={this.handleActiveImageStyles}
											/>
										</>
									) : this.state?.activeAnimeType === 'loop' ? (
										<>
											<LoopAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveImageStyles}
											/>
										</>
									) : this.state?.activeAnimeType === 'scroll' ? (
										<>
											<ScrollAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveImageStyles}
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
														this.handleActiveImageStyles(
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
								className={this.state.active === 'i' ? 'active' : ''}
								onClick={() => this.handleActive('i')}
							>
								Image
							</p>
							<p
								className={this.state.active === 's' ? 'active' : ''}
								onClick={() => this.handleActive('s')}
							>
								Styles
							</p>
							{!this.props?.isLogicalFormLogo && !this.props?.isLogicalFormImage && (
								<p
									className={this.state.active === 'a' ? 'active' : ''}
									onClick={() => this.handleActive('a')}
								>
									Animation
								</p>
							)}
						</div>
						<div className="element_image_container_main element-shapes-container">
							{this.state?.active === 'a' ? (
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
															this.handleActiveImageStyles(
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
															this.handleActiveImageStyles(
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
															this.handleActiveImageStyles(
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
													`bg-item ` +
													(this.state.activeAnimeType === 'scroll'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'scroll' },
														() => {
															this.handleActiveImageStyles(
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
														this.handleActiveImageStyles('animeName', e)
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
														this.handleActiveImageStyles('animeName', e)
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
														this.handleActiveImageStyles('animeName', e)
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
							) : this.state.active === 'i' ? (
								<div className="element_image">
									{this.state?.activeComponent?.imageURL ? (
										<>
											<div className="popup-cropper-container">
												<div className="crop-wrapper">
													<Cropper
														image={
															this.state?.activeComponent?.imageURL
														}
														crop={this.state?.crop || { x: 0, y: 0 }}
														zoom={this.state?.zoom}
														aspect={this.state?.aspect}
														onCropChange={(e) =>
															this.handleCropChange(e)
														}
														onCropComplete={
															(e) => ''
															// this.handleCropChange('crop', e)
														}
														onZoomChange={
															(e) => ''
															//  this.handleZoomChange(e)
														}
														onCropAreaChange={
															(e) => ''
															// this.handleActiveImageStyles('crop', e)
														}
														restrictPosition={true}
														ref={this.cropperRef}
													/>
													<span
														onClick={(e) =>
															this.handleActiveImageStyles(
																'remove',
																e,
															)
														}
													>
														<Delete />
													</span>
												</div>
											</div>
											<div
												className="popup-shapes-range-wrapper"
												style={{ margin: '15px 0px' }}
											>
												<b>Zoom</b>
												<div className="popup-range-div">
													<div
														style={{
															display: 'flex',
															maxWidth: 170,
														}}
													>
														<input
															type="range"
															min={1}
															max={5}
															step={0.5}
															defaultValue={
																this.state?.activeComponent
																	?.image_settings?.zoom
															}
															value={
																this.state?.activeComponent
																	?.image_settings?.zoom
															}
															onChange={(e) =>
																this.handleZoomChange(
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
														{parseFloat(
															this.state?.activeComponent
																?.image_settings?.zoom,
														)?.toFixed(1)}
													</p>
												</div>
											</div>
										</>
									) : (
										<div className="element_block">
											<div
												className="image_input"
												// style={{
												// 	opacity: 0,
												// 	position: 'absolute',
												// 	width: '1px',
												// 	height: '1px',
												// }}
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
												{this.state?.showImageProgressBar ? (
													<div className="image_progress_bar">
														<div
															className="count"
															style={{
																color: '#7c7c84',
															}}
														>
															{parseInt(this.state?.progressCount)}%
														</div>
														<div className="progress">
															<span
																className="progress-b"
																style={{
																	width: `${parseInt(
																		this.state?.progressCount,
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
														<div className="title"> Upload Image</div>
													</div>
												)}
											</div>
										</div>
									)}
									<div className="element_or">
										<div className="ortext">Or</div>
										<div className="line"></div>
									</div>
									<div
										className="element_button"
										onClick={() =>
											this.setState({ showImageModal: true }, () => {
												this.props?.setModalRef(this.state.showImageModal);
											})
										}
										style={{ cursor: 'pointer' }}
									>
										<span className="subheading">
											{' '}
											Select an Image from Library
										</span>
									</div>
									{!this.props?.isLogicalFormLogo && (
										<>
											<div className="element_pasteURL">
												<p className="heading">Link</p>
												<div
													className="element_input"
													style={{ flexDirection: 'row' }}
												>
													<input
														type="text"
														name="link"
														placeholder="Add Link to your Image"
														value={
															this.state?.activeComponent
																?.linkType !== 'link'
																? `/${this.state?.activeComponent?.linkModuleName}`
																: this.state.extraProps.link || ''
														}
														onChange={(e) => {
															this.state?.activeComponent?.linkType ==
																'link' && this.handleExtraprops(e);
														}}
														onClick={() => {
															this.setState({
																pageDropdown: true,
															});
														}}
														// disabled={
														// 	this.state?.activeComponent?.linkType ==
														// 	'link'
														// 		? false
														// 		: true
														// }
													/>
													<span
														style={{
															cursor: 'pointer',
															color: '#e8e8e8',
															fontSize: '12px',
														}}
														onClick={(e) => {
															this.handleActiveImageStyles(
																'removeLink',
																e,
															);
														}}
													>
														x
													</span>
												</div>
												{this.state?.pageDropdown && (
													<div className="i-link-pages-container">
														<div className="i-link-pages-title">
															Pages
														</div>
														<div className="i-link-pages-list">
															{this.props?.modules?.map((module) => (
																<div
																	className="i-link-pages-modules"
																	onClick={() =>
																		this.handleActiveImageStyles(
																			'page',
																			module,
																		)
																	}
																>
																	<Pages /> /{module?.label}
																</div>
															))}
														</div>
													</div>
												)}
												{this.state.sectionDropdown && (
													<>
														<div className="link-pages">
															<div className="heading">Scroll to</div>
															<div
																className="link-pages-input"
																onClick={() =>
																	this.setState({
																		sectionLinkDropdown:
																			!this.state
																				.sectionLinkDropdown,
																	})
																}
															>
																<div>scroll to Section</div>
																<DropDown
																	style={{
																		height: '15px',
																		width: '15px',
																		cursor: 'pointer',
																		transform: this.state
																			.sectionLinkDropdown
																			? 'rotate(180deg)'
																			: 'rotate(0deg)',
																	}}
																/>
															</div>
														</div>
														{this.state.sectionLinkDropdown && (
															<div className="link-sections-list">
																{this.props?.activeModuleSections?.map(
																	(section, index) => (
																		<div
																			className="link-pages-modules"
																			onClick={() =>
																				this.handleActiveImageStyles(
																					'section',
																					section?._id,
																				)
																			}
																		>{`Section - ${
																			index + 1
																		}`}</div>
																	),
																)}
															</div>
														)}
													</>
												)}
											</div>
											<div
												className="element_pasteURL"
												style={{ paddingTop: '0px' }}
											>
												<p className="heading">Image Alt text</p>
												<div className="element_input">
													<input
														type="text"
														name="altText"
														value={this.state.extraProps.altText}
														placeholder="Alternate text for image"
														onChange={(e) => this.handleExtraprops(e)}
													/>
												</div>
											</div>
											<div>
												<p className="subheading">
													Enhance SEO and accessibility by describing your
													image.
												</p>
											</div>
										</>
									)}
								</div>
							) : (
								<div className="stylesMainContainer">
									<div className="stylesContainer">
										<p
											className={
												this.state.stylesState === 'cover' ? 'active' : ''
											}
											onClick={() => this.handleStylesState('cover')}
										>
											Fill
										</p>
										<p
											className={
												this.state.stylesState === 'contain' ? 'active' : ''
											}
											onClick={() => this.handleStylesState('contain')}
										>
											Fit
										</p>
										<p
											className={
												this.state.stylesState === 'shape' ? 'active' : ''
											}
											onClick={() => this.handleStylesState('shape')}
										>
											Shape
										</p>
									</div>
									<div className="line"></div>
									{/* <div
										className=" bs-item bs-item-row animated-item"
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<b style={{ textTransform: 'capitalize' }}>Stretch</b>

										<label
											className="switch"
											onClick={() => {
												this.handleActiveImageStyles(
													'stretch',
													!this.state.activeComponent?.stretch,
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
													this.state.activeComponent?.stretch ?? false
												}
											/>
											<span className="slider-round round"></span>
										</label>
									</div> */}
									<>
										{this.state?.stylesState === 'shape' ? (
											<div className="shapeContainer">
												<div
													className="shapeHeading"
													onClick={() =>
														this.setState({
															showShapes: !this.state.showShapes,
														})
													}
												>
													<p className="heading">Shape</p>
													<RightArrow
														style={{
															transform: this.state.showShapes
																? 'rotate(180deg)'
																: 'rotate(0deg)',
														}}
													/>
												</div>
												{this.state.showShapes && (
													<>
														<div className="shapeRatioContainer">
															<p
																className={
																	this.state.activeShape === 1
																		? 'active'
																		: ''
																}
																onClick={() =>
																	this.handleActiveShape(1)
																}
															>
																1:1
															</p>
															<p
																className={
																	this.state.activeShape === 2
																		? 'active'
																		: ''
																}
																onClick={() =>
																	this.handleActiveShape(2)
																}
															>
																2:3
															</p>
															<p
																className={
																	this.state.activeShape === 3
																		? 'active'
																		: ''
																}
																onClick={() =>
																	this.handleActiveShape(3)
																}
															>
																3:2
															</p>
														</div>
														<div
															className="block_shapes"
															style={{
																justifyContent: 'space-between',
															}}
														>
															{_.map(shapesData, (shape) => (
																<div
																	key={shape.name}
																	style={{
																		cursor: 'pointer',
																	}}
																>
																	<div
																		className={
																			shape.name ===
																			this.state
																				?.activeComponent
																				?.shape
																				? 'activePopupShape'
																				: ''
																		}
																		style={shape.style}
																		onClick={() =>
																			this.handleActiveImageStyles(
																				'shape',
																				shape.name,
																			)
																		}
																	></div>
																</div>
															))}
														</div>
													</>
												)}
												<div className="line"></div>

												{/* <div
											className=" bs-item bs-item-row animated-item"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												margin: '20px 0px',
											}}
										>
											<b style={{ textTransform: 'capitalize' }}>Stretch</b>

											<label
												className="switch"
												onClick={() => {
													this.handleActiveImageStyles(
														'stretch',
														!this.state?.activeComponent?.stretch,
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
														this.state?.activeComponent?.stretch ??
														false
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
										<div className="line"></div> */}
											</div>
										) : (
											''
										)}
										<div className="overlayEffectContainer">
											<div
												className="overlayEffectHeading"
												onClick={() =>
													this.setState({
														overlayEffect: !this.state.overlayEffect,
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
																	?.ImgOverlayColor
															}
															handleColor={(e) =>
																this.handleActiveImageStyles(
																	'ImgOverlayColor',
																	e,
																)
															}
															brandColors={this.props?.brandColors}
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
																		this.state?.activeComponent
																			?.ImgOverlayOpacity
																	}
																	onChange={(e) => {
																		this.handleActiveImageStyles(
																			'ImgOverlayOpacity',
																			e.target.value,
																			null,
																			true,
																		);
																	}}
																/>
															</div>
															<p
																style={{
																	textAlign: 'center',
																}}
															>
																{
																	this.state?.activeComponent
																		?.ImgOverlayOpacity
																}
																%
															</p>
														</div>
													</div>
												</div>
											)}
										</div>
									</>
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
									this.handleActiveImageStyles('imageURL', e);
								}}
							/>
						</Modal>
					</>
				)}
			</div>
		);
	}
}
