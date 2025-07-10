import React from 'react';
import './elementPopup.scss';
import randomize from 'randomatic';
import { ReactComponent as Upload } from '../svgs/Navbar/Upload.svg';
import { ReactComponent as Delete } from '../svgs/delete.svg';
import Modal from '../modals/index';
import ImageLibrary from '../../imageLibrary';

import Images from '../../../../controllers/images';
import Cropper from 'react-easy-crop';
class NavImagePopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			siteTitle: this.props.activeComponent?.style?.siteTitle || '',
			desktopLogo: null,
			mobileLogo: null,
			activeComponent: this.props.activeComponent,
			showImageProgressBar: false,
			uploadBatchID: randomize('Aa0', 10),
			uploadedImageURL: null,
			interval: null,
			progressCount: 0,
			showImageModalLibrary: false,
			debounceInterval: null,

			crop: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.crop,
			mCrop: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings?.crop,

			zoom: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.zoom || 1,
			mZoom: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings?.zoom || 1,

			aspect: props.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.aspect,
		};

		this.desktopLogoRef = React.createRef();
		this.mobileLogoRef = React.createRef();
		this.cropperRef = React.createRef();
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeComponent !== nextProps.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				crop: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.crop,
				mCrop: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings
					?.crop,

				zoom: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.image_settings?.zoom,
				mZoom: nextProps?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImage_settings
					?.zoom,

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

	handleFileChange = async (event, uploadAIImage = false) => {
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
		} else if (type == 'objectFit') {
			if (this.props.isMobileNavbar) {
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
			} else {
				newComponent = {
					...newComponent,
					[type]: value,
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

	handleCropChange = (value) => {
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
				console.log(this.state.mZoom, this.state.zoom, newComponent, 'jeevan');
				this.debounceFunction(() => {
					this.props?.setActivePopupComponent(newComponent);
				}, 500);
			},
		);
	};

	render() {
		let isImage = this.props.isMobileNavbar
			? this.state?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.mImageURL
			: this.state?.activeComponent?.blocks?.[0]?.subBlocks?.[0]?.imageURL;
		return (
			<>
				<div className="upload-container">
					<div className="upload-header">
						<div className="upload-header-title">Image</div>
					</div>
					{/* {!this.props.isMobileNavbar && (
						<div className="upload-section">
							<label className="upload-label">Image Styles</label>
							<div className="fill-fit-container">
								<span
									className="fill-fit"
									onClick={() =>
										this.handleActiveImageStyles('objectFit', 'fill')
									}
								>
									Fill
								</span>
								<span
									className="fill-fit"
									onClick={() =>
										this.handleActiveImageStyles('objectFit', 'contain')
									}
								>
									Fit
								</span>
							</div>
						</div>
					)} */}

					{!this.props.isMobileNavbar ? (
						<div className="upload-section">
							<label className="upload-label">Site title</label>
							<input
								type="text"
								className="title-input"
								placeholder="Add Site title"
								value={this.state.siteTitle}
								onChange={this.handleTitleChange}
							/>
						</div>
					) : null}
					<div className="upload-section">
						<label className="upload-label">
							Logo for {this.props.isMobileNavbar ? 'Mobile' : 'desktop'}
						</label>
						<div
							onClick={this.handleDivClick}
							style={{
								width: '100%',
								height: '100%',
							}}
						>
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
														? this.state?.mCrop || { x: 1, y: 1 }
														: this.state?.crop || { x: 1, y: 1 }
												}
												zoom={
													this.props?.isMobileNavbar
														? this.state?.mZoom
														: this.state?.zoom || 1
												}
												aspect={this.state?.aspect}
												onCropChange={(e) => this.handleCropChange(e)}
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
										onClick={(e) => this.handleActiveImageStyles('remove', e)}
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
												width: `${parseInt(this.state?.progressCount)}%`,
											}}
										></span>
										<span></span>
									</div>
								</div>
							) : (
								<div className="upload-box">
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
									<label htmlFor="desktop-logo" className="upload-placeholder">
										<span className="upload-img">
											<Upload />
										</span>
										<span className="text-upload">Add Image (20 MB max)</span>
									</label>
								</div>
							)}
						</div>

						<div
							className="popup-shapes-range-wrapper"
							style={{ margin: '15px 0px', width: '100%' }}
						>
							<b
								style={{
									fontSize: '12px',
									marginBottom: '12px',
								}}
							>
								Zoom
							</b>
							<div className="popup-range-div" style={{ display: 'flex' }}>
								<div
									style={{
										display: 'flex',
										maxWidth: 180,
									}}
								>
									<input
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
								</div>
								<p
									style={{
										textAlign: 'center',
									}}
								>
									{parseFloat(
										this.props.isMobileNavbar
											? this.state.mZoom
											: this.state?.zoom,
									)?.toFixed(1)}
								</p>
							</div>
						</div>
					</div>
					<div className="element_or">
						<div className="ortext">Or</div>
						<div className="line"></div>
					</div>
					<div className="element_button_main">
						<div
							className="element_button"
							onClick={() =>
								this.setState({ showImageModalLibrary: true }, () => {
									this.props?.setModalRef(this.state.showImageModalLibrary);
								})
							}
							style={{ cursor: 'pointer' }}
						>
							<span className="subheading"> Select an Image from Library</span>
						</div>
					</div>
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
					/>
				</Modal>
			</>
		);
	}
}

export default NavImagePopup;
