import React, { Component } from 'react';
import ImagePlaceholder from './imgholder.jsx';

import Cropper from 'react-easy-crop';
import CircleSticker from '../../svgs/fluidShapes/circle.jsx';
import Preview from '../../svgs/preview.jsx';
import CloseButton from '../../svgs/addEventModal/Close.jsx';
import { Helmet } from 'react-helmet';
import { ImageIndexBaseClass } from '../../../builder_client_common';
import _ from 'lodash';
// Remove the Proposals import if in client mode
const BaseClass = ImageIndexBaseClass;

class ImageItem extends BaseClass {
	constructor(props) {
		super(props);
		this.state = {
			showElementOptions: false,
			hasImage: props?.imageUrl,
			boxWidth: 0,
			boxHeight: 0,
			width: 0,
			height: 0,

			preview: props?.preview,
			preview: props?.previewType,
			imageUrl: props?.imageUrl,
			imageSettings: props?.imageSettings,
			refID: props?.refID,
			activeSubBlockId: props?.activeSubBlockId,
			isClicked: false,
			showGenerateButton: false,
			showGeneratePopup: false,
			imagePrompt: '',
			aiPromptLoading: false,
			imagesGenerated: false,
			ImgOverlayColor: props?.imgOverlayColor,
			ImgOverlayOpacity: props?.ImgOverlayOpacity ?? 1,
			sectionBg: props?.sectionBg,
			isFluid: props?.isFluid || false,
			previewMode: props?.previewMode,
			isShape: props?.isShape || false,
			isImageEdit: props?.isImageEdit || false,
			mImageObjectFit: props?.mImageObjectFit,
			mobileImageObjectFit: props?.mobileImageObjectFit,
			properties: props?.properties,
		};
		this.boxRef = React.createRef();
		this.popupRef = React.createRef();
	}

	componentDidMount = () => {
		const { clientWidth, clientHeight } = this.boxRef.current;
		this.setState({
			boxWidth: clientWidth,
			boxHeight: clientHeight,
		});
		const img = new Image();
		img.src = this.state.imageUrl;

		img.onload = () => {
			this.setState({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
		};
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.properties !== nextProps.properties) {
			this.setState({
				properties: nextProps.properties,
			});
		}
		if (this.state.mImageObjectFit !== nextProps.mImageObjectFit) {
			this.setState({
				mImageObjectFit: nextProps.mImageObjectFit,
			});
		}
		if (this.state.mobileImageObjectFit !== nextProps.mobileImageObjectFit) {
			this.setState({
				mobileImageObjectFit: nextProps.mobileImageObjectFit,
			});
		}
		if (this.state.isImageEdit !== nextProps.isImageEdit) {
			this.setState({
				isImageEdit: nextProps.isImageEdit,
			});
		}
		if (this.state.previewMode !== nextProps.previewMode) {
			this.setState({
				previewMode: nextProps.previewMode,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.refID !== nextProps.refID) {
			this.setState({
				refID: nextProps.refID,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.imageSettings !== nextProps.imageSettings) {
			this.setState({
				imageSettings: nextProps.imageSettings,
			});
		}

		if (this.state.imageUrl !== nextProps.imageUrl) {
			this.setState({
				imageUrl: nextProps?.imageUrl,
				hasImage: nextProps?.imageUrl,
			});
		}
		if (this.state.ImgOverlayColor !== nextProps.ImgOverlayColor) {
			this.setState({
				ImgOverlayColor: nextProps?.ImgOverlayColor,
			});
		}
		if (this.state.ImgOverlayOpacity !== nextProps.ImgOverlayOpacity) {
			this.setState({
				ImgOverlayOpacity: nextProps?.ImgOverlayOpacity,
			});
		}
		if (this.state.sectionBg !== nextProps.sectionBg) {
			this.setState({
				sectionBg: nextProps?.sectionBg,
			});
		}
		if (this.state.isShape !== nextProps.isShape) {
			this.setState({
				isShape: nextProps?.isShape,
			});
		}
	};
	componentDidUpdate = (prevProps, prevState) => {
		if (
			this.state.imageUrl !== prevState.imageUrl &&
			this.state.imageUrl &&
			this.state.imageUrl !== null
		) {
			this.setState({
				showGeneratePopup: false,
			});
		}
	};
	handleClickOutside = (event) => {
		// this.props.setPreviewType('b');
		if (this.popupRef.current && !this.popupRef.current.contains(event.target)) {
			this.setState({
				showGeneratePopup: false,
			});
		}
	};
	handleClick = (e) => {
		this.setState(
			{
				isClicked: true,
			},
			() => {
				if (this.props?.navbarImage) {
					return;
				} else {
					this.props.setActiveImage({
						width: this.state.boxWidth,
						height: this.state.boxHeight,
					});
					this.props.settingData(this.state.imageSettings);
				}
			},
		);
	};
	generateImage = async (e) => {
		this.setState({
			aiPromptLoading: true,
		});
		let response = await this.props.generateAIImages({
			prompt: this.state.imagePrompt,
			num_images: 2,
		});
		this.setState(response);
	};
	handleImageClick = (image) => {
		this.props.uploadImageBase64(image);
	};

	getOppositeHexColor = (hex) => {
		// Normalize the hex color (e.g., remove `#` if present)
		const normalizedHex = hex?.startsWith('#') ? hex.slice(1) : hex;

		// Convert the hex to a decimal value, invert the color, and pad it back to hex
		const invertedHex = (0xffffff ^ parseInt(normalizedHex, 16)).toString(16).padStart(6, '0');

		// Return the opposite color in hex format with `#`

		return `#${invertedHex}`;
	};

	scaleNavbarCropZoom = (crop, zoom) => {
		const scale = 0.7; // Use 0.7 as requested
		return {
			crop: crop ? { x: crop.x * scale, y: crop.y * scale } : { x: 0, y: 0 },
			zoom: zoom ? zoom * scale : 1,
		};
	};

	render() {
		let imageSettings = { ...this.state.imageSettings };
		let imgSet;

		if (this.props.navbarImage) {
			const scaled = this.scaleNavbarCropZoom(imageSettings.crop, imageSettings.zoom);
			imgSet = {
				...imageSettings,
				crop: scaled.crop,
				zoom: scaled.zoom,
			};
		} else if (
			_.has(imageSettings, 'width') &&
			_.has(this.props, 'logo') &&
			this.props.isLogo == true
		) {
			let oldWidth = imageSettings?.width;
			let oldHeight = imageSettings?.height;
			let newCropX = imageSettings?.crop?.x * (this.state.boxWidth / oldWidth);
			let newCropY = imageSettings?.crop?.y * (this.state.boxHeight / oldHeight);
			let newZoom = imageSettings?.zoom * (this.state.boxWidth / oldWidth);
			imgSet = {
				crop: {
					x: newCropX,
					y: newCropY,
				},
				zoom: newZoom,
				aspect: 1.5,
			};
		} else {
			imgSet = imageSettings;
		}

		let cropDefaultValues = {
			x: 0,
			y: 0,
		};

		return (
			<>
				<Helmet>
					<style type="text/css">{`
					.image_block svg{
						width:${this.state.isFluid ? '10%' : ''};
						height:${this.state.isFluid ? '100%' : ''};
					}
				`}</style>
				</Helmet>
				{/* {this.state.isFluid ? (
					<>
						<CircleSticker
							stickerFill={this.props.stickerFill}
							stickerStroke={this.props.stickerStroke}
							width={this.state.height}
							opacity={this.props?.opacity || 1}
							stretch={this.state.stretch}
						/>
						<Helmet>
							<style type="text/css">{`
								.img_cropper {
									width:400px;
									height:400px;
									clip-path: url(#circle2);
								}
							`}</style>
						</Helmet>
					</>
				) : ''} */}

				<div
					// className={`image_block component ${this.state.showElementOptions ? 'borderedElement' : ''
					// 	}`}
					className={`image_block component `}
					style={{
						...(_.has(this.state.imageSettings, 'imageWidth')
							? this.state.imageSettings.imageWidth
							: { width: '100%', height: '100%' }),
						...(this.props.style || {}),
						border:
							!this.state.preview &&
							((this.state.isClicked &&
								this.state.activeSubBlockId === this.state.refID) ||
								this.state.showElementOptions)
								? // ? '1px solid #3474e0'
								  `1px solid ${this.getOppositeHexColor(this.state?.sectionBg)}`
								: '',
						width:
							this.state.isFluid || this.state?.isShape
								? '100%'
								: imageSettings?.imageWidth?.width,
						height:
							this.state.isFluid || this.state?.isShape || this.props?.navbarImage
								? '100%'
								: imageSettings?.imageWidth?.height,
						...(this.state.isFluid
							? {
									display: 'flex',
									gridArea: 'inherit',
									flex: 1,
							  }
							: {}),
					}}
					onMouseEnter={() => {
						if (this.state.preview !== true) {
							this.setState({
								showElementOptions: true,
								// ! commented coz not using
								// showGenerateButton: this.state.previewMode == 'ml' ? false : true,
							});
						}
					}}
					onMouseLeave={() =>
						this.setState({ showElementOptions: false, showGenerateButton: false })
					}
					onClick={(e) => {
						if (!this.state.preview && !this.props?.client) {
							this.handleClick(e);
						}
					}}
					ref={this.boxRef}
				>
					{this.state.hasImage ? (
						<>
							<div
								className="img_cropper"
								style={{
									...(this.state.isFluid
										? {
												display: 'inherit',
												gridArea: 'inherit',
										  }
										: {}),
								}}
							>
								{/* {(_.has(this.state.properties, 'mImageObjectFit') || */}
								{/* // _.has(this.state.properties, 'mobileImageObjectFit')) && ( */}
								{this.state.mobileImageObjectFit || this.state.mImageObjectFit ? (
									// ! wrote new logic for pdf download
									// <img
									// 	src={this.state.imageUrl}
									// 	style={{
									// 		objectFit:
									// 			this.state.previewType === 'm'
									// 				? this.state.mobileImageObjectFit
									// 				: this.state.mImageObjectFit
									// 				? this.state.mImageObjectFit
									// 				: this.state.mobileImageObjectFit,
									// 		height: '100%',
									// 		width: '100%',
									// 	}}
									// />
									<div
										style={{
											height: '100%',
											width: '100%',
											backgroundImage: `url(${this.state.imageUrl})`,
											backgroundSize:
												this.state.previewType === 'm'
													? this.state.mobileImageObjectFit
													: this.state.mImageObjectFit
													? this.state.mImageObjectFit
													: this.state.mobileImageObjectFit,
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
										}}
									></div>
								) : (
									<Cropper
										image={
											this.state.previewType === 'd'
												? this.state.imageUrl.includes('optimized-500w')
													? this.state.imageUrl.replace(
															'optimized-500w',
															'optimized-1000w',
													  )
													: this.state.imageUrl.replace(
															'optimized-1920w',
															'optimized-3840w',
													  )
												: this.state.imageUrl
										}
										crop={
											this.state.preview && this.state.previewType === 'm'
												? this.state.imageSettings.crop
													? this.state.imageSettings.crop
													: cropDefaultValues
												: imgSet.crop
												? imgSet.crop
												: cropDefaultValues
											//:
										}
										zoom={
											this.state.preview && this.state.previewType === 'm'
												? imgSet?.zoom
												: this.state.imageSettings?.zoom
										}
										aspect={this.state.imageSettings?.aspect}
										onCropChange={(e) => ''}
										onCropComplete={(e) => ''}
										onZoomChange={(e) => ''}
									/>
								)}
							</div>

							{!this.state.isImageEdit && (
								<div
									className="img_cropper_overlay"
									style={{
										backgroundColor: this.state?.ImgOverlayColor,
										// opacity: this.state?.ImgOverlayOpacity / 100,
										opacity: (this.state.ImgOverlayOpacity ?? 100) / 100,
									}}
								></div>
							)}

							{this.state.showGenerateButton ? (
								<a
									className="generate-ai-btn"
									onClick={() =>
										this.setState({
											showGeneratePopup: true,
											showGenerateButton: false,
										})
									}
								>
									<Preview />
									<legend> Generate With AI</legend>
								</a>
							) : (
								''
							)}
						</>
					) : (
						// <a
						// 	className="image_block_img"
						// 	style={{
						// 		backgroundImage: `url(${this.state.imageUrl})`,
						// 		backgroundRepeat: 'no-repeat',
						// 		backgroundPosition: `${this.state.crop.x}% ${this.state.crop.y}%`,
						// 		backgroundSize: 'cover',
						// 		display: 'block',
						// 		float: 'left',
						// 		width: `${100 * this.state.zoom}%`, // Adjusted width
						// 		height: `${100 * this.state.zoom}%`, // Adjusted height
						// 	}}
						// ></a>

						<ImagePlaceholder isFluid={this.state.isFluid} />
					)}
					{this.state.showElementOptions ||
					(!this.state.preview &&
						this.state.isClicked &&
						this.state.activeSubBlockId === this.state.refID)
						? // <a
						  // 	className="element-edit-label"
						  // 	style={{
						  // 		backgroundColor: this.getOppositeHexColor(this.state?.sectionBg),
						  // 		color: this.state?.sectionBg,
						  // 	}}
						  // >
						  // 	Edit Image
						  // </a>
						  ''
						: ''}
					{/* {this.state.showGenerateButton && !this.props.client ? (
						<a
							className="generate-ai-btn"
							onClick={() =>
								this.setState({
									showGeneratePopup: true,
									showGenerateButton: false,
								})
							}
						>
							<Preview />
							<legend> Generate With AI</legend>
						</a>
					) : (
						''
					)} */}
					{/* {this.state.showGeneratePopup ? (
						<div className="generate-popup" ref={this.popupRef}>
							<div className="generate-popup-header">
								<h3>Generate AI Image</h3>
								<a
									className="close-btn"
									onClick={() => this.setState({ showGeneratePopup: false })}
								>
									<CloseButton />
								</a>
							</div>
							<div className="generate-popup-content">
								<label>Prompt</label>
								<textarea
									placeholder="Describe the image you want to generate"
									onChange={(e) => this.setState({ imagePrompt: e.target.value })}
								/>
							</div>
							<div className="generate-popup-footer">
								<button
									className="generate-popup-footer-btn"
									onClick={(e) =>
										this.state.imagePrompt !== '' ? this.generateImage(e) : ''
									}
									style={{
										backgroundColor:
											this.state.imagePrompt === '' ? '#ccc' : '',
									}}
								>
									{this.state.aiPromptLoading ? (
										<a>
											<span class="p-loader"></span>
										</a>
									) : (
										'Generate'
									)}
								</button>
							</div>
							{this.state.imagesGenerated ? (
								<div className="generate-popup-images">
									{this.state.image_data.map((image, index) => (
										<a onClick={() => this.handleImageClick(image)}>
											<img src={`data:image/png;base64,${image}`} />
										</a>
									))}
								</div>
							) : (
								''
							)}
						</div>
					) : (
						''
					)} */}
					{/* {this.state.showElementOptions && _.has(this.props, 'label') && this.props.label ? (
					<legend
						className="element-edit-label"
						style={{
							position: 'absolute',
							right: 0,
							top: -23,
							left: 'auto',
							fontSize: '7px',
							// color: '#fff',
							width: 'fit-content',
							backgroundColor: this.getOppositeHexColor(this.state?.sectionBg),
							color: this.state?.sectionBg,
						}}
					>
						{' '}
						{this.props.label}
					</legend>
				) : (
					''
				)} */}
				</div>
			</>
		);
	}
}

export default ImageItem;
