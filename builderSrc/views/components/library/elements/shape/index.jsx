import React, { Component } from 'react';
import './shapes.scss';
import _ from 'lodash';
import Image from '../image';
// import { Resizable } from 're-resizable';
class Shape extends Component {
	constructor(props) {
		super();
		this.state = {
			preview: props.preview,
			crop: props?.crop ? props.crop : { x: 0, y: 0 },
			zoom: props?.zoom ? props.zoom : 1,
			imageURL: props?.imageUrl ? props.imageUrl : '',
			style: props?.style,
			previewType: props?.previewType,
			imageSettings: props?.imageSettings,
			activeSubBlockId: props?.activeSubBlockId,
			refID: props?.refID,
			width: props?.width,
			height: props?.height,
			shape: props?.shape,
			mShapeSize: props?.mShapeSize,
			isFluid: props?.isFluid,
			isImageEdit: props?.isImageEdit || false,
			fluidWidth: props?.fluidWidth,
			fluidHeight: props?.fluidHeight,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.crop !== nextProps.crop) {
			this.setState({
				crop: nextProps.crop,
			});
		}
		if (this.state.fluidWidth !== nextProps.fluidWidth) {
			this.setState({
				fluidWidth: nextProps.fluidWidth,
			});
		}
		if (this.state.fluidHeight !== nextProps.fluidHeight) {
			this.setState({
				fluidHeight: nextProps.fluidHeight,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.isImageEdit !== nextProps.isImageEdit) {
			this.setState({
				isImageEdit: nextProps.isImageEdit,
			});
		}
		if (this.state.isFluid !== nextProps.isFluid) {
			this.setState({
				isFluid: nextProps.isFluid,
			});
		}
		if (this.state.refID !== nextProps.refID) {
			this.setState({
				refID: nextProps.refID,
			});
		}
		if (this.state.zoom !== nextProps.zoom) {
			this.setState({
				zoom: nextProps.zoom,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.imageURL !== nextProps.imageURL) {
			this.setState({
				imageURL: nextProps.imageURL,
			});
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
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
		// working on shapes logic -jeevan

		if (this.state.height !== nextProps.height) {
			this.setState({
				height: nextProps.height,
			});
		}
		if (this.state.width !== nextProps.width) {
			this.setState({
				width: nextProps.width,
			});
		}
		if (this.state.shape !== nextProps.shape) {
			this.setState({
				shape: nextProps.shape,
			});
		}

		if (this.state.mShapeSize !== nextProps.mShapeSize) {
			this.setState({
				mShapeSize: nextProps.mShapeSize,
			});
		}
	};
	getShapeDimensions = (shape) => {
		const { width, height } = this.props?.isFluid
			? {}
			: this.state?.previewType == 'm'
			? this.state?.mShapeSize
			: this.state;

		let size;
		const numericWidth = parseFloat(width);
		const numericHeight = parseFloat(height);

		switch (shape) {
			case 'square':
				// size = (numericHeight + numericWidth) / 2;

				return {
					width: numericWidth,
					height: numericWidth,
				};
			case 'circle':
				// size = (numericHeight + numericWidth) / 2;

				return {
					width: numericWidth,
					height: numericWidth,
				};
			case 'rectangle':
				return {
					width: width,
					height: `${
						numericHeight <= numericWidth ? numericHeight * 1.5 : numericHeight
					}px`,
				};
			case 'vRectangle':
				return {
					width: width,
					height: `${
						numericHeight <= numericWidth ? numericHeight * 1.5 : numericHeight
					}px`,
				};
			case 'hRectangle':
				return {
					width: `${numericWidth}px`,
					height: `${numericHeight * 0.55}px`,
				};

			case 'capsule':
				return {
					width: `${numericWidth}px`,
					height: `${numericHeight * 0.55}px`,
				};

			case 'vcapsule':
				return {
					width: width,
					height: `${
						numericHeight <= numericWidth ? numericHeight * 1.5 : numericHeight
					}px`,
				};
			case 'arcLeft':
				return {
					width: width,
					height: `${
						numericHeight <= numericWidth ? numericHeight * 1.5 : numericHeight
					}px`,
				};
			case 'arcRight':
				return {
					width: width,
					height: `${
						numericHeight <= numericWidth ? numericHeight * 1.5 : numericHeight
					}px`,
				};

			default:
				return {
					width: width,
					height: height,
				};
		}
	};

	handleOnClick = async (e) => {
		this.props?.client == true
			? [
					// e.stopPropagation(),
					// window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),

					// !new logic for navigation

					// e.stopPropagation(),
					this.props?.properties?.linkType === 'link'
						? window.open(
								this.props?.properties?.link,
								'_blank',
								// this.props?.properties?.openInNewTab ? '_blank' : '_self',
						  )
						: this.props?.properties?.linkType === 'section'
						? [
								await this.props.getModuleInfo(
									this.props?.properties?.linkModuleId,
									this.props?.properties?.linkModuleType,
								),
								await setTimeout(() => {
									this.props.scrollToSection(this.props?.properties?.sectionId);
								}, 500),
						  ]
						: '',
			  ]
			: [this.props.setTab('i')];
	};
	returnBorderRadiusForFluid = (shape, fluidHeight) => {
		switch (shape) {
			case 'circle':
				return '100%';
			default:
				return '0%';

			case 'rectangle':
				return `${fluidHeight * 0.5}px ${fluidHeight * 0.5}px 0 0`;
			case 'capsule':
				return `${fluidHeight * 0.5}px`;
			case 'vcapsule':
				return `${fluidHeight * 0.5}px`;
			case 'arcRight':
				return `0 ${fluidHeight * 0.15}px`;
			case 'arcLeft':
				return `${fluidHeight * 0.15}px 0`;
		}
	};
	render() {
		const { width, height } = this.getShapeDimensions(this.state.shape);

		return (
			// <Resizable
			// 	defaultSize={{
			// 		width: width,
			// 		height: height,
			// 	}}
			// >
			<div
				style={{
					overflow: 'hidden',
					position: 'relative',
					background: 'transparent',

					...(this.state.isFluid
						? {
								display: 'flex',
								gridArea: 'inherit',
								flex: 1,
								aspectRatio: '1/1',
								width: '100%',
						  }
						: {
								width: width,
								height: height,
						  }),
				}}
			>
				<div
					className={`shape ${_.has(this.props, 'shape') ? this.state.shape : ''}`}
					style={{
						overflow: 'hidden',
						position: 'relative',
						background: 'transparent',
						...(this.state.isFluid
							? this.state.shape === 'circle'
								? {
										display: 'block',
										width: this.state.fluidHeight,
										height: '100%',
										margin: '0 auto',
										borderRadius: this.returnBorderRadiusForFluid(
											this.state.shape,
											this.state.fluidWidth,
										),
								  }
								: {
										display: 'flex',
										flex: 1,
										gridArea: 'inherit',
										aspectRatio: '1/1',
										height: '100%',
								  }
							: {
									width: width,
									height: height,
							  }),
					}}
					onClick={(e) => {
						if (!this.props.client) {
							this.props.setActiveShape(e);
							if (this.state.isFluid) {
								this.props.setActiveImage(e);
							}
						} else {
							this.handleOnClick();
						}
					}}
				>
					<div
						style={{
							width: 'fit-content',
							height: '100%',
							position: 'absolute',
							zIndex: 2,
							opacity: '0.1',
							background: 'transparent',
							cursor: 'grab',
							overflow: 'hidden',
						}}
						onClick={() => this.handleOnClick()}
					></div>

					<Image
						isFluid={this.props?.isFluid}
						style={this.state.style}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={this.props.imageUrl}
						imageSettings={this.state.imageSettings}
						setActiveImage={(e) => this.props.setActiveImage(e)}
						settingData={() => this.props.settingData(this.state.imageSettings)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={this.state.refID ? this.state.refID : null}
						label={this.props.label}
						ImgOverlayColor={this.props?.ImgOverlayColor}
						ImgOverlayOpacity={this.props?.ImgOverlayOpacity}
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
						client={this.props.client}
						isLogo={this.props?.isLogo}
						sectionBg={this.props?.sectionBg}
						isShape={true}
						isImageEdit={this.state.isImageEdit}
						mImageObjectFit={this.props?.mImageObjectFit}
						mobileImageObjectFit={this.props?.mobileImageObjectFit}
						properties={this.props?.properties}
					/>
					{/* <div style={{position:'absolute', zIndex:'2', display:'flex',top:'0px',left:'0px',height:'100%',width:'100%', pointerEvents:'none',backgroundColor:'transparent'}}></div> */}
				</div>
			</div>
			// </Resizable>
		);
	}
}

export default Shape;
