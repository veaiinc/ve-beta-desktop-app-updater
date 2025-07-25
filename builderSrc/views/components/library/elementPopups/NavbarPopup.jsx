import React from 'react';
import './elementPopup.scss';
import ColorPicker from '../../properties/colorpicker';
import { ReactComponent as Option1 } from '../../library/svgs/Navbar/FirstActive.svg';
import { ReactComponent as Option2 } from '../../library/svgs/Navbar/SecondOption.svg';
import { ReactComponent as Option3 } from '../../library/svgs/Navbar/ThirdOption.svg';
import { ReactComponent as Option4 } from '../../library/svgs/Navbar/ForthOption.svg';
import { ReactComponent as Cart } from '../../library/svgs/Navbar/Cart/Cart1.svg';
import { ReactComponent as Hamburger } from '../../library/svgs/Navbar/Hamburger/Hamberger4.svg';
import randomize from 'randomatic';
import _ from 'lodash';
import { Delete, ElementSidebar } from '../../builder_client_common';
// import NavImagePopup from './NavImagePopup';
import { ReactComponent as Cart1 } from '../../library/svgs/Navbar/Cart/Cart1.svg';
import { ReactComponent as Cart2 } from '../../library/svgs/Navbar/Cart/Catrt2.svg';
import { ReactComponent as Cart3 } from '../../library/svgs/Navbar/Cart/Cart3.svg';
import { ReactComponent as Cart4 } from '../../library/svgs/Navbar/Cart/Cart4.svg';
import { ReactComponent as Cart5 } from '../../library/svgs/Navbar/Cart/Cart5.svg';
import { ReactComponent as Cart6 } from '../../library/svgs/Navbar/Cart/Cart6.svg';
import { ReactComponent as Cart7 } from '../../library/svgs/Navbar/Cart/Cart7.svg';
import { ReactComponent as Cart8 } from '../svgs/Navbar/Hamburger/Hamburger1.svg';
import { ReactComponent as Cart9 } from '../svgs/Navbar/Hamburger/Hamberger2.svg';
import { ReactComponent as Cart10 } from '../svgs/Navbar/Hamburger/Hamberger3.svg';
import { ReactComponent as Cart11 } from '../svgs/Navbar/Hamburger/Hamberger4.svg';
import { ReactComponent as Cart12 } from '../svgs/Navbar/Hamburger/Hamburger5.svg';
import { ReactComponent as Cart13 } from '../svgs/Navbar/Hamburger/Hamburger6.svg';
import { ReactComponent as Cart14 } from '../svgs/Navbar/Hamburger/Hamburger7.svg';
import { ReactComponent as Upload } from '../svgs/Navbar/Upload.svg';
import Cropper from 'react-easy-crop';
import Images from '../../../../controllers/images';
import Modal from '../modals/index';
import ImageLibrary from '../../imageLibrary';

class NavbarPopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			siteTitle: this.props.activeComponent?.style?.siteTitle || '',
			desktopLogo: null,
			mobileLogo: null,
			showImageProgressBar: false,
			uploadBatchID: randomize('Aa0', 10),
			uploadedImageURL: null,
			interval: null,
			progressCount: 0,
			showImageModalLibrary: props.showImageModalLibrary || false,
			debounceInterval: null,
			crop: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.crop,
			mCrop: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings?.crop,
			zoom: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.zoom || 1,
			mZoom: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings?.zoom || 1,
			aspect: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.aspect,
			activeEditDesign: 'design',
			navbarAlign: 'center',
			activeNavbarAlign: 'one',
			activeComponent: props.activeComponent,
			activeBackground: 'solid',
			activeBackgroundColor: 'solid',
			selectedOption: 'Realistic',
			spread: -20,
			blur: 20,
			distance: 20,
			pageSpacing: 20,
			verticalPadding: 20,
			showShadow: false,
			cartEnabled: false,
			style: 'icon',
			selectedCart: 0,
			selectedHamburger: 0,
			selectedBorder: 0,
			showZero: false,
			libraryImageType: null,
		};

		this.cartIcons = [
			<Cart1 />,
			<Cart2 />,
			<Cart3 />,
			<Cart4 />,
			<Cart5 />,
			<Cart6 />,
			<Cart7 />,
		];
		this.cartShapes = [
			<Cart8 />,
			<Cart9 />,
			<Cart10 />,
			<Cart11 />,
			<Cart12 />,
			<Cart13 />,
			<Cart14 />,
		];
		this.borderShapes = ['dash', 'square', 'hexagon', 'circle'];
		this.desktopLogoRef = React.createRef();
		this.mobileLogoRef = React.createRef();
		this.cropperRef = React.createRef();
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
			});
		}
	};
	handleNavbarStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		if (
			type == 'navbarAlign' ||
			type == 'mNavbarAlign' ||
			type == 'showLogo' ||
			type == 'showCart' ||
			type == 'position' ||
			type == 'downloadIcon' ||
			type == 'cartValue' ||
			type == 'sectionBackgroundColor'
		) {
			this.setState({ activeNavbarAlign: value });
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [type]: value },
			};
		} else {
			newComponent = { ...newComponent, [type]: value };
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};

	handleEditDesign = (type) => {
		// console.log(type, 'jeevan');
		this.setState({ activeEditDesign: type });
	};
	handleOptionClick = (option) => {
		this.setState({ selectedOption: option });
	};

	handleSliderChange = (property, event) => {
		this.setState({ [property]: parseInt(event.target.value) });
	};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeComponent !== nextProps.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				// crop: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.crop,
				// mCrop: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings
				// ?.crop,

				// zoom: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.zoom,
				// mZoom: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings
				// 	?.zoom,

				aspect: this.props.isMobileNavbar
					? nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings
							?.aspect
					: nextProps.activeComponent?.image_settings?.aspect,
			});
		}
	};
	debounceFunction = (func, delay) => {
		if (this.state.debounceInterval) {
			clearInterval(this.state.debounceInterval);
		}
		let debounceIntervalFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceInterval: debounceIntervalFunc });
	};

	handleTitleChange = (e) => {
		this.setState({ siteTitle: e.target.value }, () => {
			this.debounceFunction(() => {
				this.handleActiveImageStyles('siteTitle', this.state.siteTitle);
			}, 1000);
		});
	};

	//! file upload functions
	handleDivClick = (e) => {
		if (this.desktopLogoRef.current) {
			this.desktopLogoRef.current.click();
		} else if (this.mobileLogoRef.current) {
			this.mobileLogoRef.current.click();
		}
	};

	handleActiveImageStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		if (type == 'imageURL' || type == 'imgLibrary') {
			if (this.props.isMobileNavbar) {
				newComponent = {
					...newComponent,
					blocks: [
						{
							...newComponent.blocks[0],
							subBlocks: [
								{
									...newComponent.blocks[0].subBlocks[0],
									mImageURL: value,
								},
							],
						},
					],
				};
			} else {
				newComponent = {
					...newComponent,
					blocks: [
						{
							...newComponent.blocks[0],
							subBlocks: [
								{
									...newComponent.blocks[0].subBlocks[0],
									imageURL: value,
								},
							],
						},
					],
				};
			}
		} else if (type == 'remove') {
			if (this.props.isMobileNavbar) {
				newComponent = {
					...newComponent,
					blocks: [
						{
							...newComponent.blocks[0],
							subBlocks: [
								{
									...newComponent.blocks[0].subBlocks[0],
									mImageURL: '',
									mImage_settings: {
										crop: {
											x: 0,
											y: 0,
										},
										zoom: 1,
										aspect: 1.5,
									},
								},
							],
						},
					],
				};
			} else {
				newComponent = {
					...newComponent,
					blocks: [
						{
							...newComponent.blocks[0],
							subBlocks: [
								{
									...newComponent.blocks[0].subBlocks[0],
									imageURL: '',
									image_settings: {
										crop: {
											x: 0,
											y: 0,
										},
										zoom: 1,
										aspect: 1.5,
									},
								},
							],
						},
					],
				};
			}
		} else if (type == 'siteTitle') {
			newComponent.style = newComponent.style || {};
			newComponent.style.siteTitle = value;
		}
		this.setState(
			{
				activeComponent: newComponent,
			},
			() => {
				this.props?.setActivePopupComponent(newComponent);
			},
		);
	};

	handleFileChange = async (event, uploadAIImage = false) => {
		// console.log(this.props.activeModuleId, 'activeModuleId');
		let file;
		if (uploadAIImage) {
			this.setState({
				activeImageURL: null,
				isImage: null,
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
				res = await this.uploadImage(json, file, this.props.activeModuleId);
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
	handleCropChange = (value) => {
		// console.log(value, 'value');
		if (
			this.cropperRef.current &&
			this.cropperRef.current?.props?.crop?.x === value.x &&
			this.cropperRef.current?.props?.crop?.y === value.y
		) {
			return;
		}
		this.cropperRef.current = value;
		let newComponent = { ...this.state.activeComponent };
		if (this.props.isMobileNavbar) {
			newComponent = {
				...newComponent,
				blocks: [
					{
						...newComponent.blocks[0],
						subBlocks: [
							{
								...newComponent.blocks[0].subBlocks[0],
								mImage_settings: {
									...newComponent.blocks[0].subBlocks[0]?.mImage_settings,
									crop: value,
								},
							},
						],
					},
				],
			};
		} else {
			newComponent = {
				...newComponent,
				blocks: [
					{
						...newComponent.blocks[0],
						subBlocks: [
							{
								...newComponent.blocks[0].subBlocks[0],
								image_settings: {
									...newComponent.blocks[0].subBlocks[0]?.image_settings,
									crop: value,
								},
							},
						],
					},
				],
			};
		}
		this.setState(
			{
				[this.props.isMobileNavbar ? 'mCrop' : 'crop']: value,
				activeComponent: newComponent,
			},
			() => {
				this.debounceFunction(() => {
					this.props?.setActivePopupComponent(newComponent);
				}, 500);
			},
		);
	};

	handleZoomChange = (value) => {
		let newComponent = { ...this.state.activeComponent };
		if (this.props.isMobileNavbar) {
			newComponent = {
				...newComponent,
				blocks: [
					{
						...newComponent.blocks[0],
						subBlocks: [
							{
								...newComponent.blocks[0].subBlocks[0],
								mImage_settings: {
									...newComponent?.blocks[0].subBlocks[0]?.mImage_settings,
									zoom: parseFloat(value),
								},
							},
						],
					},
				],
			};
		} else {
			newComponent = {
				...newComponent,
				blocks: [
					{
						...newComponent.blocks[0],
						subBlocks: [
							{
								...newComponent.blocks[0].subBlocks[0],
								image_settings: {
									...newComponent?.blocks[0].subBlocks[0]?.image_settings,
									zoom: parseFloat(value),
								},
							},
						],
					},
				],
			};
		}
		this.setState(
			{
				[this.props.isMobileNavbar ? 'mZoom' : 'zoom']: parseFloat(value),
				activeComponent: newComponent,
			},
			() => {
				this.debounceFunction(() => {
					this.props?.setActivePopupComponent(newComponent);
				}, 500);
			},
		);
	};

	handleCartGlobalFunction = (key, value) => {
		let newComponent = { ...this.props.activeComponent };
		if (
			key == 'cartIcon' ||
			key == 'cartBorder' ||
			key == 'showCart' ||
			key == 'downloadIcon' ||
			key == 'cartValue'
		) {
			this.setState({ selectedCart: value });
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [key]: value },
			};
		} else {
			newComponent = { ...newComponent, [key]: value };
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};

	handleHamCartGlobalFunction = (type, value) => {
		console.log(type, value, 'jeevan');
		let newComponent = { ...this.props.activeComponent };
		if (type == 'hamburgerIcon' || type == 'thickness') {
			this.setState({ selectedHamburger: value });
			// console.log(this.state.selectedHamburger, 'value');
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [type]: value },
			};
		} else {
			newComponent = { ...newComponent, [type]: value };
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};

	render() {
		let isImage = this.props.isMobileNavbar
			? this.state?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImageURL
			: this.state?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.imageURL;
		return (
			<div className="edit-design-modal">
				<div className="edit-design-modal-header">
					<div
						onClick={() => this.handleEditDesign('design')}
						className={`navbar-title ${
							this.state.activeEditDesign === 'design' ||
							this.state.activeEditDesign === 'icons' ||
							(this.state.activeEditDesign === 'logo' &&
								this.state.activeEditDesign !== 'background')
								? 'navbar-title-active'
								: ''
						}`}
					>
						Edit Design
					</div>
					<div
						onClick={() => this.handleEditDesign('background')}
						className={`navbar-title ${
							this.state.activeEditDesign === 'background'
								? 'navbar-title-active'
								: ''
						}`}
					>
						{' '}
						Background
					</div>
				</div>

				{this.state.activeEditDesign !== 'background' && (
					<div className="navbar-options-container">
						<div className="navbar-options">
							<span
								onClick={() => this.handleEditDesign('design')}
								className={`navbar-option ${
									this.state.activeEditDesign === 'design'
										? 'navbar-title-active'
										: ''
								}`}
							>
								Styles
							</span>
							<span className="h_line" />
							<span
								onClick={() => this.handleEditDesign('logo')}
								className={`navbar-option ${
									this.state.activeEditDesign === 'logo'
										? 'navbar-title-active'
										: ''
								}`}
							>
								Logo
							</span>
							<span className="h_line" />
							<span
								onClick={() => this.handleEditDesign('icons')}
								className={`navbar-option ${
									this.state.activeEditDesign === 'icons'
										? 'navbar-title-active'
										: ''
								}`}
							>
								Icons
							</span>
						</div>
					</div>
				)}

				<div className="navbar-design-body">
					{this.state.activeEditDesign === 'logo' && (
						<>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Logo
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'showLogo',
											!this.state.activeComponent?.style?.showLogo,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.showLogo || false
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.showLogo &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							{/* <NavImagePopup /> */}
							<div className="bs-item2">
								<span className="bs-item-title2">Site title</span>

								{/* <div className="bs-item-input">
									<span className="bs-item-input-text">Add Site Title</span>
									
								</div> */}
								<input
									type="text"
									className="title-input"
									placeholder="Add Site title"
									value={this.state.siteTitle}
									onChange={this.handleTitleChange}
								/>
							</div>

							<div className="bs-item3">
								<div className="bs-item-title3">Logo</div>
								<div className="bs-item-upload" onClick={this.handleDivClick}>
									{isImage ? (
										<div
											style={{
												display: 'flex',
												gap: '5px',
												justifyContent: 'space-between',
												cursor: 'pointer',
											}}
											className="element_image"
										>
											{/* <img src={isImage} alt="logo" height={120} width={226} /> */}
											<div
												className="popup-cropper-container"
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													position: 'relative',
													width: '98%',
													height: '120px',
												}}
											>
												<div
													className="crop-wrapper"
													style={{
														width: '100%',
														height: '100%',
														position: 'absolute',
													}}
												>
													<Cropper
														image={isImage}
														crop={
															this.props?.isMobileNavbar
																? this.state?.mCrop || {
																		x: 1,
																		y: 1,
																  }
																: this.state?.crop || { x: 1, y: 1 }
														}
														zoom={
															this.props?.isMobileNavbar
																? this.state?.mZoom
																: this.state?.zoom || 1
														}
														aspect={this.state?.aspect}
														onCropChange={(e) =>
															this.handleCropChange(e)
														}
														onCropComplete={(e) => ''}
														onZoomChange={(e) => ''}
														onCropAreaChange={(e) => ''}
														restrictPosition={true}
														ref={this.cropperRef}
													/>
													{/* <span
												onClick={(e) =>
													this.handleActiveImageStyles('remove', e)
												}
											>
												<Delete />
											</span> */}
												</div>
											</div>
											<span
												onClick={(e) =>
													this.handleActiveImageStyles('remove', e)
												}
											>
												<Delete />
											</span>
										</div>
									) : this.state.showImageProgressBar ? (
										<div
											className="image_progress_bar"
											style={{
												width: '226px',
												height: '120px',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												border: '1px solid #e8e8e8',
											}}
										>
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
										<>
											<input
												type="file"
												id="desktop-logo"
												className="file-input"
												accept="image/*"
												ref={this.desktopLogoRef}
												onChange={(e) => this.handleFileChange(e)}
												onClick={(e) => {
													e.stopPropagation();
												}}
											/>
											<span>
												<Upload />
											</span>
											<span>Upload</span>
											<span className="bs-item-upload-text">
												Image Format: JPG && PNG
											</span>
										</>
									)}
								</div>
								<div className="bs-item-library">
									<span
										className="bs-item-library-text"
										onClick={(e) => {
											this.setState(
												{
													showImageModalLibrary: true,
													libraryImageType: 'l',
												},
												() => {
													this.props?.setModalRef(
														this.state.showImageModalLibrary,
													);
												},
											);
										}}
									>
										Library
									</span>
									<span
										onClick={(e) => {
											this.setState(
												{
													showImageModalLibrary: true,
													libraryImageType: 'u',
												},
												() => {
													this.props?.setModalRef(
														this.state.showImageModalLibrary,
													);
												},
											);
										}}
										className="bs-item-library-text"
									>
										Unsplash
									</span>
								</div>
							</div>

							<div className="bs-item4">
								<span className="bs-item-title4">Zoom</span>

								<div className="progress-container">
									<input
										className="progress-input"
										type="range"
										min={1}
										max={2}
										step={0.1}
										value={
											this.props.isMobileNavbar
												? this.state.mZoom
												: this.state?.zoom
										}
										onChange={(e) => this.handleZoomChange(e.target.value)}
									/>
									{/* <div className="progress-bar">
										<div className="progress-circle"></div>
									</div> */}
									<p className="progress-value">
										{parseFloat(
											this.props.isMobileNavbar
												? this.state.mZoom
												: this.state?.zoom,
										)?.toFixed(1)}
									</p>
								</div>
							</div>
						</>
					)}

					{this.state.activeEditDesign === 'icons' && (
						<>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Cart Icon
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'showCart',
											!this.state.activeComponent?.style?.showCart,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.showCart ||
											!_.has(this.state.activeComponent?.style, 'showCart')
												? true
												: false
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.showCart &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Download Icon
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'downloadIcon',
											!_.has(
												this.state.activeComponent?.style,
												'downloadIcon',
											)
												? false
												: !this.state.activeComponent?.style?.downloadIcon,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.downloadIcon ||
											(!_.has(
												this.state.activeComponent?.style,
												'downloadIcon',
											) &&
												true)
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.downloadIcon &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Cart Value
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'cartValue',
											!_.has(this.state.activeComponent?.style, 'cartValue')
												? false
												: !this.state.activeComponent?.style?.cartValue,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.cartValue ||
											(!_.has(
												this.state.activeComponent?.style,
												'cartValue',
											) &&
												true)
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.cartValue &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							<div className="cartclick-style">
								<span className="cartclick-label">Cart Icons</span>
								<div className="cartclick-icon-options">
									{this.cartIcons.map((Icon, i) => (
										<div
											key={i}
											className={`cartclick-icon-btn ${
												this.props.activeComponent?.style?.cartIcon === i ||
												(!this.props.activeComponent?.style?.cartIcon &&
													i === 0)
													? 'active'
													: ''
											}`}
											onClick={() =>
												this.handleCartGlobalFunction('cartIcon', i)
											}
										>
											{Icon}
										</div>
									))}
								</div>
							</div>
							{this.props.isMobileNavbar && (
								<div className="sectionsub">
									<span className="section-title">Hamburger Icons</span>
									<div className="field-style-options">
										{this.cartShapes.map((Icon, i) => (
											<div
												key={i}
												className={`style-btn ${
													this.props.activeComponent?.style
														?.hamburgerIcon === i ||
													(!this.props.activeComponent?.style
														?.hamburgerIcon &&
														i === 0)
														? 'active'
														: ''
												}`}
												onClick={() =>
													this.handleHamCartGlobalFunction(
														'hamburgerIcon',
														i,
													)
												}
											>
												{Icon}
											</div>
										))}
									</div>
								</div>
							)}
						</>
					)}
					{this.state.activeEditDesign === 'design' && (
						<div>
							<div className="fixed-possition">
								<div className="toggle-navbar">
									<div
										className=" bs-item bs-item-row animated-item"
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											textTransform: 'capitalize',
											fontSize: '12px',
											color: '#E8E8E8',
											width: '100%',
										}}
									>
										<span
										// style={{ textTransform: 'capitalize' }}
										>
											Fixed Position
										</span>

										<label
											className="switch"
											onClick={() => {
												this.handleNavbarStyles(
													'position',
													!this.state.activeComponent?.style?.position,
												);
											}}
										>
											<input
												type="checkbox"
												checked={
													this.state.activeComponent?.style?.position ||
													false
												}
											/>
											<span
												style={{
													backgroundColor:
														this.state.activeComponent?.style
															?.position && '#F1F1F1',
												}}
												className="slider-round-white round"
											></span>
										</label>
									</div>
								</div>
							</div>

							<div className="design-styles">
								<div className="design-paragraph">Styles</div>
								{!this.props?.isMobileNavbar ? (
									<div className="design-styles-options">
										<div
											onClick={() =>
												this.handleNavbarStyles('navbarAlign', 'one')
											}
											className={`design-style-item ${
												(_.has(
													this.props?.activeComponent?.style,
													'navbarAlign',
												) &&
													this.props?.activeComponent?.style
														?.navbarAlign === 'one') ||
												!_.has(
													this.props?.activeComponent?.style,
													'navbarAlign',
												)
													? 'active-design-style'
													: ''
											}`}
										>
											<Option1 />
										</div>
										<div
											onClick={() =>
												this.handleNavbarStyles('navbarAlign', 'two')
											}
											className={`design-style-item ${
												this.props?.activeComponent?.style?.navbarAlign ===
												'two'
													? 'active-design-style'
													: ''
											}`}
										>
											<Option2 />
										</div>
										<div
											onClick={() =>
												this.handleNavbarStyles('navbarAlign', 'three')
											}
											className={`design-style-item ${
												this.props?.activeComponent?.style?.navbarAlign ===
												'three'
													? 'active-design-style'
													: ''
											}`}
										>
											<Option3 />
										</div>
										<div
											onClick={() =>
												this.handleNavbarStyles('navbarAlign', 'four')
											}
											className={`design-style-item ${
												this.props?.activeComponent?.style?.navbarAlign ===
												'four'
													? 'active-design-style'
													: ''
											}`}
										>
											<Option4 />
										</div>
									</div>
								) : (
									<div className="design-styles-options-mobile">
										<div
											onClick={() =>
												this.handleNavbarStyles('mNavbarAlign', 'one')
											}
											className="cartAlign-one"
											style={{
												border:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'one' ||
													!_.has(
														this.props?.activeComponent?.style,
														'mNavbarAlign',
													)
														? '1px solid #f2f2f3'
														: '',
											}}
										>
											<Cart />
											<div
												style={{
													backgroundColor:
														this.props?.activeComponent?.style
															?.mNavbarAlign === 'one' ||
														!_.has(
															this.props?.activeComponent?.style,
															'mNavbarAlign',
														)
															? '#f2f2f3'
															: '',
												}}
												className="logo-text-mobile"
											>
												Logo
											</div>
											<Hamburger />
										</div>
										<div
											onClick={() =>
												this.handleNavbarStyles('mNavbarAlign', 'two')
											}
											className="cartAlign-one"
											style={{
												border:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'two'
														? '1px solid #f2f2f3'
														: '',
											}}
										>
											<div
												style={{
													backgroundColor:
														this.props?.activeComponent?.style
															?.mNavbarAlign === 'two'
															? '#f2f2f3'
															: '',
												}}
												className="logo-text-mobile"
											>
												Logo
											</div>

											<Cart />
											<Hamburger />
										</div>
										<div
											onClick={() =>
												this.handleNavbarStyles('mNavbarAlign', 'three')
											}
											className="cartAlign-one"
											style={{
												border:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'three'
														? '1px solid #f2f2f3'
														: '',
											}}
										>
											<div
												style={{
													backgroundColor:
														this.props?.activeComponent?.style
															?.mNavbarAlign === 'three'
															? '#f2f2f3'
															: '',
												}}
												className="logo-text-mobile"
											>
												Logo
											</div>
											<div
												style={{
													width: '100%',
													display: 'flex',
													justifyContent: 'flex-end',
												}}
											>
												<Cart />
											</div>
											<Hamburger />
										</div>
										<div
											onClick={() =>
												this.handleNavbarStyles('mNavbarAlign', 'four')
											}
											className="cartAlign-one"
											style={{
												border:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'four'
														? '1px solid #f2f2f3'
														: '',
											}}
										>
											<div
												style={{
													backgroundColor:
														this.props?.activeComponent?.style
															?.mNavbarAlign === 'four'
															? '#f2f2f3'
															: '',
												}}
												className="logo-text-mobile"
											>
												Logo
											</div>
											<div style={{ width: '100%' }}>
												<Cart />
											</div>
											<Hamburger />
										</div>
									</div>
								)}
							</div>
							{/* <div className="fixed-header-styles">
							<div className="design-paragraph">Fixed header styles</div>
							<div className="fixed-header-styles-options">
								<div
									onClick={() => this.handleNavbarStyles('scroll', 'static')}
									className={`fixed-item ${
										(_.has(this.props?.activeComponent, 'scroll') &&
											this.props?.activeComponent?.scroll === 'static') ||
										!_.has(this.props?.activeComponent, 'scroll')
											? 'navbar-title-active'
											: ''
									}`}
								>
									Static
								</div>
								<div
									onClick={() => this.handleNavbarStyles('scroll', 'scrollBack')}
									className={`fixed-item ${
										this.props?.activeComponent?.scroll === 'scrollBack'
											? 'navbar-title-active'
											: ''
									}`}
								>
									Scroll Back
								</div>
							</div>
						</div> */}
							{/* <div className="divider"></div> */}

							{/* hide shadow */}
							{/* <div className="shadow-editor">
							<div className="shadow-editor__section">
								<div className="shadow-editor__header">
									<h3>Drop shadow</h3>
									<svg style={{transform: this.state.showShadow ? 'rotate(180deg)' : 'rotate(0deg)'}} onClick={() => this.setState({showShadow: !this.state.showShadow})}
										className="shadow-editor__arrow"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M6 9L12 15L18 9"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							

								<div className="shadow-editor__option-group">
									<button
										className={`shadow-editor__option ${
											selectedOption === 'Realistic'
												? 'shadow-editor__option--selected'
												: ''
										}`}
										onClick={() => this.handleOptionClick('Realistic')}
									>
										Realistic
									</button>
									<button
										className={`shadow-editor__option ${
											selectedOption === 'Bold'
												? 'shadow-editor__option--selected'
												: ''
										}`}
										onClick={() => this.handleOptionClick('Bold')}
									>
										Bold
									</button>
									<button
										className={`shadow-editor__option ${
											selectedOption === 'Custom'
												? 'shadow-editor__option--selected'
												: ''
										}`}
										onClick={() => this.handleOptionClick('Custom')}
									>
										Custom
									</button>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Spread</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="-50"
										max="50"
										value={spread}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('spread', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `calc(${((spread + 50) / 100) * 100}%)` }}
									></div>
									<span className="shadow-editor__value">{spread}</span>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Blur</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={blur}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('blur', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${blur}%` }}
									></div>
									<span className="shadow-editor__value">{blur}</span>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Distance</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={distance}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('distance', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${distance}%` }}
									></div>
									<span className="shadow-editor__value">{distance}</span>
								</div>
							</div>

							<div className="shadow-editor__divider"></div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Page spacing</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={pageSpacing}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('pageSpacing', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${pageSpacing}%` }}
									></div>
									<span className="shadow-editor__value">{pageSpacing}</span>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Vertical padding</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={verticalPadding}
										className="shadow-editor__slider"
										onChange={(e) =>
											this.handleSliderChange('verticalPadding', e)
										}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${verticalPadding}%` }}
									></div>
									<span className="shadow-editor__value">{verticalPadding}</span>
								</div>
							</div>
						
						</div> */}
						</div>
					)}

					{this.state.activeEditDesign === 'background' && (
						<div className="background-body">
							<div className="background-title">Background</div>
							<div className="fixed-header-styles-options">
								<div
									onClick={() =>
										this.handleNavbarStyles('background', 'adaptive')
									}
									className={`fixed-item ${
										this.props?.activeComponent?.background === 'adaptive'
											? 'navbar-title-active'
											: ''
									}`}
								>
									Adaptive
								</div>
								<div
									onClick={() => this.handleNavbarStyles('background', 'solid')}
									className={`fixed-item ${
										(_.has(this.props?.activeComponent, 'background') &&
											this.props?.activeComponent?.background === 'solid') ||
										!_.has(this.props?.activeComponent, 'background')
											? 'navbar-title-active'
											: ''
									}`}
								>
									Solid
								</div>
							</div>
							<div className="line"></div>
							{(this.props?.activeComponent?.background === 'solid' ||
								!_.has(this.props?.activeComponent, 'background')) && (
								<>
									<div
										className="block_styles"
										style={
											{
												// height: this.state?.heightForPopup ? '425px' : 'auto',
											}
										}
									>
										<ColorPicker
											title={'Background Color'}
											color={
												this.state?.activeComponent?.style
													?.sectionBackgroundColor || '#fff'
											}
											handleColor={(e) =>
												this.handleNavbarStyles('sectionBackgroundColor', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											setHeightForPopup={(e) => {
												this.setState({
													heightForPopup: e,
												});
											}}
											shapePopup={true}
										/>
									</div>
									<div
										className="block_styles"
										style={
											{
												// height: this.state?.heightForPopup ?  'auto' : '425px',
											}
										}
									>
										<ColorPicker
											title={'Navigation Color'}
											color={
												this.state?.activeComponent?.navigationColor ||
												'#fff'
											}
											handleColor={(e) =>
												this.handleNavbarStyles('navigationColor', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											setHeightForPopup={(e) => {
												this.setState({
													heightForPopup: e,
												});
											}}
											shapePopup={true}
										/>
									</div>
								</>
							)}
						</div>
					)}
				</div>

				<Modal
					show={this.state.showImageModalLibrary}
					handleClose={(e) => {
						this.setState({ showImageModalLibrary: false }, () => {
							this.props?.setModalRef(this.state.showImageModalLibrary);
						});
					}}
					modalType={'center'}
				>
					<ImageLibrary
						close={(e) => {
							this.setState({ showImageModalLibrary: false }, () => {
								this.props?.setModalRef(this.state.showImageModalLibrary);
							});
						}}
						setLibraryImage={(e) => {
							this.handleActiveImageStyles('imgLibrary', e);
						}}
						libraryImageType={this.state.libraryImageType}
					/>
				</Modal>
			</div>
		);
	}
}

export default NavbarPopup;
