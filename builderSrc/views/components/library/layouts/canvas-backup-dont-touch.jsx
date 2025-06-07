import _ from 'lodash';
import React, { Component } from 'react';
import Button from '../elements/button';
import CircleText from '../elements/circletext/CircleText.jsx';
import Icon from '../elements/icons/index.jsx';
import ImageItem from '../elements/image';
import ListIcon from '../elements/listicon/index.jsx';
import Loader from '../elements/loader/index.jsx';
import Shape from '../elements/shape';
import Sticker from '../elements/sticker';
import Text from '../elements/text';
import './index.scss';
// import { ReactComponent as Edit } from './actions/edit.svg';
// import { ReactComponent as Copy } from './actions/copy.svg';
import ReactPlayer from 'react-player';
import Line from '../elements/line/index.jsx';
import LogoSticker from '../elements/logosticker/index.jsx';
import Video from '../elements/video/index.jsx';
import Copy from './actions/copy.jsx';
import Delete from './actions/delete.jsx';
import Down from './actions/down.jsx';
import Edit from './actions/edit.jsx';
import Up from './actions/up.jsx';

import Draggable from 'react-draggable';

//import Proposals from "../../../controllers/proposals";
const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
const animationSpeedSec = [{ slow: 10 }, { medium: 5 }, { fast: 1 }];
import randomize from 'randomatic';

const GRID_COLS = 25;
// const GRID_ROWS = 8;
class Layout extends Component {
	constructor(props) {
		super();
		this.state = {
			showBlockOptions: false,
			showBlockActions: false,
			activeFontColor: props.activeFontColor,
			actionType: props.actionType,
			actionValue: props.actionValue,
			crop: props.crop,
			zoom: props.zoom,
			style: props.style,
			blocks: props.blocks,
			activeSectionID: props.activeSectionID,
			sectionID: props._id,
			activeTextBlock: props.activeTextBlock,
			preview: props.preview,
			previewType: props.previewType,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			subBlockID: props.subBlockID,
			activeSubBlockId: props.activeSubBlockId,
			isActiveSection: props.isActiveSection,
			sectionType: props?.sectionType,
			randomString: randomize('A', 5),
			showHide: false,
			activeAnimation: props.activeAnimation,
			animationSpeed: props.animationSpeed,
			animationDirection: props.animationDirection,
			animationType: props.animationType,

			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,

			contractVariables: props.contractVariables,
			previewGrid: false,
			gridSize: 65,
			snapToGrid: true,
			layoutDimensions: {
				width: 0,
				height: 0,
			},
			isResizing: false,
			layoutHeight: 300, // default height
			snapPosition: null,
			placeholderPosition: null,
			resizeHandles: [
				{
					position: { top: '-6px', left: '-6px' },
					cursor: 'nw-resize',
					direction: 'nw',
				},
				{
					position: { top: '-6px', right: '-6px' },
					cursor: 'ne-resize',
					direction: 'ne',
				},
				{
					position: { bottom: '-6px', left: '-6px' },
					cursor: 'sw-resize',
					direction: 'sw',
				},
				{
					position: { bottom: '-6px', right: '-6px' },
					cursor: 'se-resize',
					direction: 'se',
				},
				// Edge handles
				{
					position: { top: '-6px', left: '50%' },
					cursor: 'n-resize',
					direction: 'n',
					transform: 'translateX(-50%)',
				},
				{
					position: { top: '50%', right: '-6px' },
					cursor: 'e-resize',
					direction: 'e',
					transform: 'translateY(-50%)',
				},
				{
					position: { bottom: '-6px', left: '50%' },
					cursor: 's-resize',
					direction: 's',
					transform: 'translateX(-50%)',
				},
				{
					position: { top: '50%', left: '-6px' },
					cursor: 'w-resize',
					direction: 'w',
					transform: 'translateY(-50%)',
				},
			],
			activeComponentID: null,
			editLayout: false,
			dragX: 0,
			dragY: 0,
			activeColumnKey: null,
			drag2X: 0,
			drag2Y: 0,
			position: 'absolute',
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.layoutRef = React.createRef();
		this.divRef = React.createRef();
	}
	componentDidMount = () => {
		// console.log('props===>Canvas', this.props, 'state===>Canvas', this.state);
		document.addEventListener('mousedown', this.handleClickOutside);
		this.animateSection();

		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}
		this.updateLayoutDimensions();
		window.addEventListener('resize', this.updateLayoutDimensions);

		// Remove transform styles from all column elements
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		window.removeEventListener('resize', this.updateLayoutDimensions);
		document.removeEventListener('mousemove', this.handleResize);
		document.removeEventListener('mouseup', this.handleResizeStop);
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeFontColor !== nextProps.activeFontColor) {
			this.setState({
				activeFontColor: nextProps.activeFontColor,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.activeSectionID !== nextProps.activeSectionID) {
			this.setState({
				activeSectionID: nextProps.activeSectionID,
			});
		}
		if (this.state.animationDirection !== nextProps.animationDirection) {
			this.setState(
				{
					animationDirection: nextProps.animationDirection,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.animationSpeed !== nextProps.animationSpeed) {
			this.setState(
				{
					animationSpeed: nextProps.animationSpeed,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.animationType !== nextProps.animationType) {
			this.setState(
				{
					animationType: nextProps.animationType,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.activeAnimation !== nextProps.activeAnimation) {
			this.setState(
				{
					activeAnimation: nextProps.activeAnimation,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.crop !== nextProps.crop) {
			this.setState({
				crop: nextProps.crop,
			});
		}
		if (this.state.zoom !== nextProps.zoom) {
			this.setState({
				zoom: nextProps.zoom,
			});
		}
		if (this.state.blocks !== nextProps.blocks) {
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.style !== nextProps.style && nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
		if (this.state.sectionID !== nextProps._id) {
			this.setState({
				sectionID: nextProps._id,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.activeVariableID !== nextProps.activeVariableID) {
			this.setState({
				activeVariableID: nextProps.activeVariableID,
			});
		}
		if (this.state.activeVariableName !== nextProps.activeVariableName) {
			this.setState({
				activeVariableName: nextProps.activeVariableName,
			});
		}
		if (this.state.subBlockID !== nextProps.subBlockID) {
			this.setState({
				subBlockID: nextProps.subBlockID,
			});
		}
		if (this.state.isActiveSection !== nextProps.isActiveSection) {
			this.setState(
				{
					isActiveSection: nextProps.isActiveSection,
				},
				() => {
					this.setState({
						showBlockOptions: nextProps.isActiveSection,
					});
				},
			);
		}
		if (this.state.sectionType !== nextProps.sectionType) {
			this.setState({
				sectionType: nextProps.sectionType,
			});
		}
		// for bg types -Abdullah
		if (this.state.backgroundType !== nextProps.backgroundType) {
			this.setState({
				backgroundType: nextProps.backgroundType,
			});
		}
		if (this.state.backgroundImageURL !== nextProps.backgroundImageURL) {
			this.setState({
				backgroundImageURL: nextProps.backgroundImageURL,
			});
		}
		if (this.state.backgroundVideoURL !== nextProps.backgroundVideoURL) {
			this.setState({
				backgroundVideoURL: nextProps.backgroundVideoURL,
			});
		}

		// for contract page

		if (this.state.contractVariables !== nextProps.contractVariables) {
			this.setState({
				contractVariables: nextProps.contractVariables,
			});
		}
	};

	getSnapPosition = (x, y) => {
		// console.log('x, y====>', x, y);
		if (!this.state.snapToGrid) return { x, y };

		const layoutElement = this.blockRef.current;
		if (!layoutElement) return { x, y };

		const layoutRect = layoutElement.getBoundingClientRect();

		const relativeX = x - layoutRect.left;
		const relativeY = y - layoutRect.top;

		return { x: this.snapToGrid(relativeX), y: this.snapToGrid(relativeY) };
	};

	handleClickOutside = (event) => {
		// this.props.setPreviewType('b');
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
			});
		}
		if (this.blockRef.current && this.blockRef.current.contains(event.target)) {
			if (this.state.isActiveSection) {
				Object.values(this.boxRefs).forEach((ref, index) => {
					if (ref && !ref.contains(event.target)) {
						this.props.handleSetBlockTab(event);
					}
				});
			}
		}
	};
	reanimateSection = () => {
		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}

		Object.values(this.boxRefs).forEach((ref, index) => {
			if (ref) {
				ref.style.animationName = 'unset';
				ref.style.animationDuration = 'unset';
				ref.style.animationTimingFunction = 'unset';
				ref.style.animationFillMode = 'unset';
			}
		});

		if (this.blockRef) {
			this.blockRef.current.style.animationName = 'unset';
			this.blockRef.current.style.animationDuration = 'unset';
			this.blockRef.current.style.animationTimingFunction = 'unset';
			this.blockRef.current.style.animationFillMode = 'unset';
		}

		this.animateSection();
	};
	animateSection = () => {
		if (this.state.activeAnimation > 0) {
			// let animationNames =
			// 	this.state.animationType === 'slideIn' ? this.state.animationDirection : 'fadeIn';
			// let animationDurations = `${this.getAnimationTiming()}s`;
			// let animationTimingFunctions = 'ease';
			// let animationFillModes = 'forwards';
			this.observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							if (this.state.activeAnimation === 1) {
								Object.values(this.boxRefs).forEach((ref, index) => {
									if (ref) {
										ref.style.animationName =
											this.state.animationType === 'slideIn'
												? this.state.animationDirection
												: 'fadeIn';
										ref.style.animationDuration = `${this.getAnimationTiming()}s`;
										ref.style.animationTimingFunction = 'ease';
										ref.style.animationFillMode = 'forwards';
									}
								});
							} else {
								if (this.blockRef) {
									if (this.blockRef) {
										this.blockRef.current.style.animationName =
											this.state.animationType === 'slideIn'
												? this.state.animationDirection
												: 'fadeIn';
										this.blockRef.current.style.animationDuration = `${this.getAnimationTiming()}s`;
										this.blockRef.current.style.animationTimingFunction =
											'ease';
										this.blockRef.current.style.animationFillMode = 'forwards';
									}
								}
							}
						}
						// else {
						// 	entry.target.classList.remove('visibled');
						// 	this.boxRefs.forEach((ref, index) => {
						// 		if (ref) {
						// 			ref.classList.remove('visibled');
						// 		}
						// 	});
						// }
					});
				},
				{ threshold: 0.1 },
			);
		}
	};
	switchComponent = (type, properties, blockID, header = null, contentAlign = null) => {
		let concat2 = '';
		let concat1 = '';
		let subID2 = header === 'header' ? blockID : properties?._id;

		let sectionID = this.state?.sectionID;

		concat2 = subID2?.concat(sectionID?.toString());

		switch (type) {
			case 'text':
				return (
					<Text
						isFluid={true}
						text={properties.content}
						style={properties.styles}
						//divStyles={properties.divStyles}
						className={properties.className}
						activeFontColor={this.state.activeFontColor}
						refID={header === 'header' ? blockID : concat2}
						reference={header === 'header' ? blockID : properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.state.editLayout
								? ''
								: this.props.handleBSelection(e, activeTextBlock)
						}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						setContent={(e) =>
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								header === 'header' ? null : blockID,
								properties._id,
							)
						}
						preview={this.state.preview}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeVariableID={this.state.activeVariableID}
						activeVariableName={this.state.activeVariableName}
						subBlockID={header === 'header' ? blockID : concat2}
						variables={this.props.variables}
						client={this.props.client}
						module={this.props.module}
						activeVariable={(e) => this.props.setContractActiveVariable(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						sectionType={this.state.sectionType}
						header={header}
						clearStyling={() => this.props.clearStyle()}
						label={properties?.label}
						contractVariables={properties?.contractVariables}
					/>
				);

			case 'image':
				return (
					<ImageItem
						isFluid={true}
						style={properties.styles}
						crop={this.state.crop}
						zoom={this.state.zoom}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={properties.imageURL}
						imageSettings={properties.image_settings}
						settingData={(e) => this.props.imgSettingData(e)}
						setActiveImage={(e) => console.log(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						client={this.props.client}
						label={properties?.label}
						ImgOverlayColor={properties?.ImgOverlayColor}
						ImgOverlayOpacity={properties?.ImgOverlayOpacity}
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
					/>
				);

			case 'button':
				return (
					<Button
						style={properties.styles}
						content={properties.content}
						// handleSelection={(e) => this.props.handleBSelection(e)}
						preview={this.state.preview}
						reference={properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						setContent={(e) =>
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								blockID,
								properties._id,
							)
						}
						setTab={(e) => this.props.handleSetTab('bt', properties._id, blockID)}
						setTextTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						setLink={(e) => this.props.setButtonLink(e)}
						setOpenNewTab={(e) => this.props.setNewTab(e)}
						href={properties.href ? properties.href : ''}
						openInNewTab={properties.openInNewTab ? properties.openInNewTab : false}
						shape={properties.shape ? properties.shape : ''}
						btStyles={properties.btStyles ? properties.btStyles : ''}
						setBtStyles={(e) => this.props.setButtonStyles(e)}
						setShape={(e) => this.props.btShape(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={concat2}
						activeFontColor={this.state.activeFontColor}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						subBlockID={concat2}
						sectionType={this.state.sectionType}
						label={properties?.label}
						clearStyling={() => this.props.clearStyle()}
						isFluid={true}
					/>
				);
			case 'sticker':
				return (
					<Sticker
						isFluid={true}
						content={properties.content}
						setContent={(e) =>
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								blockID,
								properties._id,
							)
						}
						divStyles={properties.divStyles}
						textStyles={properties.textStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						activeSubBlockId={this.state.activeSubBlockId}
						reference={properties.reference}
						// text={properties.content}
						sectionType={this.state.sectionType}
						subBlockID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						refID={concat2}
						activeFontColor={this.state.activeFontColor}
						setTextTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						isSticker={properties.isSticker}
						stickerFill={this.state.style?.stickerFill}
						stickerStroke={this.state.style?.stickerStroke}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						clearStyling={() => this.props.clearStyle()}
					/>
				);
			case 'shape':
				return (
					<Shape
						isFluid={true}
						style={properties.styles}
						shape={properties.shape}
						crop={this.state.crop}
						zoom={this.state.zoom}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={properties.imageURL}
						imageSettings={properties.image_settings}
						setActiveImage={(e) =>
							this.props.activeImage(
								this.state.sectionID,
								blockID,
								properties._id,
								properties.imageURL,
								e,
								properties,
							)
						}
						setActiveShape={(e) => this.props.handlesetActiveShape(properties.shape)}
						settingData={(e) => this.props.imgSettingData(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						label={properties?.label}
						width={properties?.width}
						height={properties?.height}
						mShapeSize={properties?.mShapeSize}
						ImgOverlayColor={properties?.ImgOverlayColor}
						ImgOverlayOpacity={properties?.ImgOverlayOpacity}
					/>
				);
			case 'circleText':
				return (
					<CircleText
						isFluid={true}
						text={properties.text}
						radius={properties.radius}
						width={properties.width}
						style={properties.style}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						preview={this.state.preview}
						previewType={this.state.previewType}
						circleTextData={(e) => this.props.circleTextData(e)}
						label={properties?.label}
					/>
				);
			case 'icon':
				return (
					<Icon
						isFluid={true}
						iconName={properties.iconName}
						fillColor={properties.fillColor}
						iconBgColor={properties.iconBgColor}
						iconType={properties.iconType}
						iconSize={properties.iconSize}
						divStyles={properties.divStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			case 'listIcon':
				return (
					<ListIcon
						isFluid={true}
						color={properties.color}
						shape={properties.shape}
						size={properties.size}
						listCount={properties.listCount}
						divStyles={properties.divStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			case 'line':
				return (
					<Line
						isFluid={true}
						borderStyle={this.state.style.borderStyle}
						borderColor={this.state.style.borderColor}
						borderWidth={this.state.style.borderWidth}
						width={this.state.style.width}
						divStyles={properties.divStyles}
						contentAlign={contentAlign}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			// logo Sticker -Abdullah
			case 'logoSticker':
				return (
					<LogoSticker
						isFluid={true}
						fillColor={properties.fillColor}
						divStyles={properties.divStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			// video block -Abdullah
			case 'video':
				return (
					<Video
						isFluid={true}
						style={properties?.styles}
						videoURL={properties?.videoURL}
						loop={properties?.loop}
						autoplay={properties?.autoplay}
						preview={this.state.preview}
						reference={properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						setIsValidURL={(e) => {
							this.props.handleIsValidURL(e);
						}}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeSubBlockId={this.state.activeSubBlockId}
						// refID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						// subBlockID={concat2}
						sectionType={this.state.sectionType}
						label={properties?.label}
					/>
				);
			case 'loader':
				return <Loader />;

			default:
				return (
					<Text
						isFluid={true}
						text={properties.content}
						style={properties.styles}
						divStyles={properties.divStyles}
						className={properties.className}
						activeFontColor={this.state.activeFontColor}
						reference={properties.reference ? properties.reference : null}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e) => this.props.handleBSelection(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						sectionType={this.state.sectionType}
						label={properties?.label}
					/>
				);
		}
	};

	toggleSideBar = (e) => {
		this.setState(
			{
				showBlockActions: true,
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
			},
		);
	};
	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	handleBlock = (e) => {
		this.props.selectBlock('b');
	};
	returnSubBlock = (subBlockLabel) => {
		let display = 'flex';
		let labels = this.state.style.viewSubBlockOptions;
		if (_.size(labels) > 0) {
			let label = labels.find((obj) => obj.hasOwnProperty(subBlockLabel));

			display = label[subBlockLabel] == true ? 'flex' : 'none';
		} else {
			display = 'flex';
		}
		return display;
	};
	handleDuplicate = () => {
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e, isElement = null, sectionID = null) => {
		e.stopPropagation();
		this.props.showAddBlock(e, isElement, sectionID);
	};
	hanldeAddElement = (e) => {
		e.stopPropagation();
		this.props.showAddElement(e);
	};
	toggleShowHide = (e) => {
		this.setState({
			showHide: !this.state.showHide,
		});
	};
	getAnimationTiming = () => {
		const matchedAnimation = animationSpeedSec.find(
			(item) => Object.keys(item)[0] === this.state.animationSpeed, // Return the result of the comparison
		);

		const speed = matchedAnimation ? matchedAnimation[this.state.animationSpeed] : 0;

		return speed;
	};

	// getSnapPosition = (x, y) => {
	// 	const layoutElement = document.querySelector('.layout');
	// 	if (!layoutElement) return { x, y };

	// 	const { width, height } = layoutElement.getBoundingClientRect();
	// 	const cellWidth = width / this.state.gridSize;
	// 	const cellHeight = height / this.state.gridSize;

	// 	const snappedX = Math.round(x / cellWidth) * cellWidth;
	// 	const snappedY = Math.round(y / cellHeight) * cellHeight;

	// 	return { x: snappedX, y: snappedY };
	// };

	// handleDragStart = (e, data) => {
	// 	this.props.handleCloseSideBar();
	// 	this.setState({ previewGrid: true });

	// 	const dragElement = e.target;
	// 	const elementRect = dragElement.getBoundingClientRect();
	// 	const layoutRect = this.blockRef.current.getBoundingClientRect();

	// 	console.log(layoutRect, elementRect, 'layoutRect, elementRect');

	// 	// Calculate grid cell dimensions
	// 	const cellWidth = layoutRect.width / GRID_COLS;
	// 	const cellHeight = layoutRect.height / GRID_ROWS;

	// 	console.log(cellWidth, cellHeight, 'cellWidth, cellHeight');

	// 	// Calculate relative positions
	// 	const relativeLeft = elementRect.left - layoutRect.left;
	// 	const relativeTop = elementRect.top - layoutRect.top;

	// 	// Calculate start positions (using floor to get the starting grid line)
	// 	const columnStart = Math.floor(relativeLeft / cellWidth) + 1;
	// 	const rowStart = Math.floor(relativeTop / cellHeight) + 1;

	// 	// Calculate spans (using ceil to ensure the element fits)
	// 	const elementColSpan = Math.ceil(layoutRect.width - (relativeLeft + elementRect.width));
	// 	const elementRowSpan = Math.ceil(layoutRect.height - (relativeTop + elementRect.height));

	// 	console.log(elementColSpan, elementRowSpan, 'elementColSpan, elementRowSpan');

	// 	// Calculate end positions (start + span)
	// 	// We don't add 1 here because grid-area end lines are exclusive
	// 	const columnEnd = columnStart + elementColSpan;
	// 	const rowEnd = rowStart + elementRowSpan;

	// 	// Validate end positions don't exceed grid boundaries
	// 	// const validColumnEnd = Math.min(columnEnd, GRID_COLS + 1);
	// 	// const validRowEnd = Math.min(rowEnd, GRID_ROWS + 1);

	// 	console.table({
	// 		columnStart,
	// 		rowStart,
	// 		columnEnd,
	// 		rowEnd,
	// 	});

	// 	this.setState({
	// 		placeholderPosition: {
	// 			gridArea: `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`,
	// 			width: elementRect.width,
	// 			height: elementRect.height,
	// 		},
	// 	});

	// 	// Debug logging
	// 	// console.log({
	// 	// 	elementDimensions: {
	// 	// 		width: elementRect.width,
	// 	// 		height: elementRect.height,
	// 	// 	},
	// 	// 	gridPositions: {
	// 	// 		columnStart,
	// 	// 		rowStart,
	// 	// 		columnEnd: validColumnEnd,
	// 	// 		rowEnd: validRowEnd,
	// 	// 	},
	// 	// 	cellDimensions: {
	// 	// 		cellWidth,
	// 	// 		cellHeight,
	// 	// 	},
	// 	// });
	// };
	handleDrag = (e, data, k, dragX = null, dragY = null) => {
		this.setState({
			position: 'absolute',
		});

		// Object.values(this.boxRefs).forEach((ref, i) => {
		// 	if (i == k) {

		// 		if (dragX !== null && dragY !== null) {
		// 			ref.style.setProperty('transform', `translate(${this.state.dragX}px,${this.state.dragY}px)`);
		// 		}

		// 	}
		// });
	};
	handleDragStart = (e, data, k) => {
		this.props.handleCloseSideBar();
		this.setState({ previewGrid: true });
		let refs = [];
		Object.values(this.boxRefs).forEach((ref, i) => {
			if (i == k) {
				// ref.style.setProperty('grid-area', 'none');
				// ref.style.setProperty('transform', `translate(${this.state.dragX}px,${this.state.dragY}px)`);
				refs.push(ref);
			}
		});

		// console.log(refs, 'elementRect');
		const dragElement = refs[0];

		const elementRect = dragElement.getBoundingClientRect();

		const layoutRect = this.blockRef.current.getBoundingClientRect();

		// Calculate grid cell dimensions
		const cellWidth = layoutRect.width / GRID_COLS;
		const cellHeight = 50; // Using the same minmax height value from gridTemplateRows

		// Calculate total number of rows based on layout height
		const totalRows = Math.ceil(layoutRect.height / cellHeight);

		// Calculate relative positions
		const relativeLeft = elementRect.left - layoutRect.left;
		const relativeTop = elementRect.top - layoutRect.top;

		// Calculate spans
		const widthInCells = Math.round(elementRect.width / cellWidth);
		const heightInCells = Math.round(elementRect.height / cellHeight);

		// Calculate grid positions
		const columnStart = Math.floor(relativeLeft / cellWidth) + 1;
		const rowStart = Math.floor(relativeTop / cellHeight) + 1;

		// Ensure we don't exceed the total number of rows
		const rowEnd = Math.min(rowStart + heightInCells, totalRows);
		let columnEnd = columnStart + widthInCells;

		if (columnStart > GRID_COLS) {
			columnStart = GRID_COLS - 1;
		}
		if (columnEnd > GRID_COLS) {
			columnEnd = GRID_COLS;
		}
		const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;

		console.table({
			columnStart,
			rowStart,
			widthInCells,
			heightInCells,
			cellWidth,
			cellHeight,
			totalRows,
			layoutWidth: layoutRect.width,
			layoutHeight: layoutRect.height,
			elementWidth: elementRect.width,
			elementHeight: elementRect.height,
			gridArea,
		});

		this.setState({
			//gridArea,
			drag2X: data.x,
			drag2Y: data.y,
			totalRows,
			placeholderPosition: {
				gridArea,
				width: elementRect.width,
				height: elementRect.height,
			},
		});
	};

	// handleDrag = (e, data) => {
	// 	const layoutElement = this.blockRef.current;
	// 	if (!layoutElement) return;

	// 	// Get all draggable elements
	// 	const allDraggableElements = layoutElement.querySelectorAll('.column');
	// 	let maxBottom = 0;

	// 	// Find the lowest point among all elements
	// 	allDraggableElements.forEach((element) => {
	// 		const rect = element.getBoundingClientRect();
	// 		const bottom =
	// 			element === e.target
	// 				? data.y + rect.height
	// 				: rect.bottom - layoutElement.getBoundingClientRect().top;
	// 		maxBottom = Math.max(maxBottom, bottom);
	// 	});

	// 	// Add padding and set new height
	// 	const newHeight = Math.max(300, maxBottom + 200); // Minimum 300px or content height + padding
	// 	layoutElement.style.height = `${newHeight}px`;
	// };

	handleDragStop = (e, data, component, k) => {
		let updatedBlocks = [];
		_.map(this.state.blocks, (block, k) => {
			_.map(block.subBlocks, (subBlock, index) => {
				if (subBlock._id == component?._id) {
					subBlock.divStyles = {
						...subBlock.divStyles,
						gridArea:
							this.state.placeholderPosition !== null
								? this.state.placeholderPosition?.gridArea
								: subBlock.divStyles?.gridArea,
						dragX: data.x,
						dragY: data.y,
					};
				}
			});
			updatedBlocks.push(block);
		});

		this.setState(
			{
				activeComponentID: component?._id,
				previewGrid: false,
				//gridValue: this.state.placeholderPosition?.gridArea,

				blocks: updatedBlocks,
			},
			() => {
				this.setState({
					placeholderPosition: null,
					dragX: data.x,
					dragY: data.y,
					drag2X: 0,
					drag2Y: 0,
					pos: 'relative',
					activeColumnKey: k,
				});

				// Remove transforms after state update
			},
		);

		// Store the position
		// this.props.setElementPosition(
		// 	elementId,
		// 	this.state.placeholderPosition?.x,
		// 	this.state.placeholderPosition?.y,
		// );
	};

	updateLayoutDimensions = () => {
		if (this.blockRef.current) {
			const { width, height } = this.blockRef.current.getBoundingClientRect();
			this.setState({
				layoutDimensions: { width, height },
			});
		}
	};

	getMinLayoutHeight = () => {
		const layoutElement = this.divRef.current;

		if (!layoutElement) return 600;

		const allDraggableElements = layoutElement.querySelectorAll('.column');
		let maxHeight = 0;

		allDraggableElements.forEach((element) => {
			const rect = element.getBoundingClientRect();
			maxHeight = Math.max(
				maxHeight,
				rect.bottom - layoutElement.getBoundingClientRect().top,
			);
			console.log(rect.bottom, layoutElement.getBoundingClientRect().top, 'hello==>');
		});

		return Math.max(600, maxHeight + 50); // minimum 300px or content height + padding
	};

	handleResizeStart = (e, direction, componentID) => {
		e.preventDefault();
		console.log(e, e.clientX, e.clientY, 'e.clientX, e.clientY');

		// Store initial values when resize starts
		this.setState({
			isResizing: true,
			previewGrid: true,
			activeResizeDirection: direction,
			resizingComponentID: componentID,
			initialMousePos: {
				x: e.clientX,
				y: e.clientY,
			},
			initialDimensions: this.boxRefs[componentID]?.getBoundingClientRect(),
		});

		// Add mouse move and mouse up event listeners
		document.addEventListener('mousemove', this.handleResize);
		document.addEventListener('mouseup', this.handleResizeEnd);
	};

	// handleResize = (e) => {
	// 	if (!this.state.isResizing) return;

	// 	const { activeResizeDirection, initialMousePos, initialGridArea, maxGridRows } = this.state;
	// 	console.log(
	// 		activeResizeDirection,
	// 		initialMousePos,
	// 		initialGridArea,
	// 		'activeResizeDirection, initialMousePos, initialGridArea',
	// 	);
	// 	const gridArea = initialGridArea.split('/').map(Number);
	// 	const [rowStart, colStart, rowEnd, colEnd] = gridArea;

	// 	// Calculate movement distance (you may want to adjust these thresholds)
	// 	const deltaX = Math.floor((e.clientX - initialMousePos.x) / 50); // 50px per grid unit
	// 	const deltaY = Math.floor((e.clientY - initialMousePos.y) / 50);

	// 	let newGridArea;

	// 	switch (activeResizeDirection) {
	// 		case 'e':
	// 			newGridArea = `${rowStart}/${colStart}/${rowEnd}/${Math.min(
	// 				GRID_COLS,
	// 				Math.max(colStart + 1, colEnd + deltaX),
	// 			)}`;
	// 			break;

	// 			// case 'w':
	// 			// 	newGridArea = `${rowStart}/${Math.max(0, colStart - deltaX)}/${rowEnd}/${colEnd}`;
	// 			// 	break;

	// 			// case 'n':
	// 			// 	newGridArea = `${Math.max(0, rowStart - deltaY)}/${colStart}/${rowEnd}/${colEnd}`;
	// 			// 	break;

	// 			// case 's':
	// 			// 	newGridArea = `${rowStart}/${colStart}/${Math.min(maxGridRows, Math.max(rowStart + 1, rowEnd + deltaY))}/${colEnd}`;
	// 			// 	break;

	// 			// case 'ne':
	// 			// 	newGridArea = `${Math.max(0, rowStart - deltaY)}/${colStart}/${rowEnd}/${Math.min(GRID_COLS, Math.max(colStart + 1, colEnd + deltaX))}`;
	// 			// 	break;

	// 			// case 'se':
	// 			// 	newGridArea = `${rowStart}/${colStart}/${Math.min(maxGridRows, Math.max(rowStart + 1, rowEnd + deltaY))}/${Math.min(GRID_COLS, Math.max(colStart + 1, colEnd + deltaX))}`;
	// 			// 	break;

	// 			// case 'sw':
	// 			// 	newGridArea = `${rowStart}/${Math.max(0, colStart - deltaX)}/${Math.min(maxGridRows, Math.max(rowStart + 1, rowEnd + deltaY))}/${colEnd}`;
	// 			// 	break;

	// 			// case 'nw':
	// 			newGridArea = `${Math.max(0, rowStart - deltaY)}/${Math.max(
	// 				0,
	// 				colStart - deltaX,
	// 			)}/${rowEnd}/${colEnd}`;
	// 			break;
	// 	}

	// 	this.setState({ initialGridArea: newGridArea });
	// };

	handleResizeEnd = () => {
		// Clean up event listeners
		document.removeEventListener('mousemove', this.handleResize);
		document.removeEventListener('mouseup', this.handleResizeEnd);

		this.setState({
			isResizing: false,
			previewGrid: false,
			activeResizeDirection: null,
			resizingComponentID: null,
		});
	};

	snapToGrid = (value) => Math.round(value / this.state.gridSize) * this.state.gridSize;

	handleClick = (e, component, k) => {
		const dragElement = e.target;
		const elementRect = dragElement.getBoundingClientRect();
		const layoutRect = this.blockRef.current.getBoundingClientRect();

		// Calculate grid cell dimensions
		const cellWidth = layoutRect.width / GRID_COLS;
		const cellHeight = 50; // Using the same minmax height value from gridTemplateRows

		// Calculate total number of rows based on layout height
		const totalRows = Math.ceil(layoutRect.height / cellHeight);

		// Calculate relative positions
		const relativeLeft = elementRect.left - layoutRect.left;
		const relativeTop = elementRect.top - layoutRect.top;

		// Calculate spans
		const widthInCells = Math.round(elementRect.width / cellWidth);
		const heightInCells = Math.round(elementRect.height / cellHeight);

		// Calculate grid positions
		const columnStart = Math.floor(relativeLeft / cellWidth) + 1;
		const rowStart = Math.floor(relativeTop / cellHeight) + 1;

		// Ensure we don't exceed the total number of rows
		const rowEnd = Math.min(rowStart + heightInCells, totalRows);
		const columnEnd = columnStart + widthInCells;

		// Set grid area
		const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
		this.props.handleCloseSideBar();
		this.setState({
			activeComponentID: component?._id,
			initialGridArea: gridArea,
		});
	};

	render() {
		// console.log('layout==>', this.state.previewGrid);
		const { width, height } = this.state.layoutDimensions;
		// console.log(this.state.initialGridArea, 'initialGridArea');
		const baseHandleStyle = {
			width: '12px',
			height: '12px',
			backgroundColor: 'white',
			border: '2px solid #2196F3',
			position: 'absolute',
			zIndex: 1,
		};

		return (
			<div
				className="layout"
				style={{
					...this.props.style,
					flexDirection: 'column',
					backgroundColor:
						this.props.module === 'thankyou'
							? ''
							: this.state.style?.backgroundType !== 'video' &&
							  this.state.style?.backgroundType !== 'image' &&
							  this.state.style?.sectionBackgroundColor,
					backgroundImage:
						this.state.style?.backgroundType == 'image' &&
						`url(${this.state.style.backgroundImageURL})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					position: 'relative',
				}}
				onClick={(e) => {
					if (this.state.preview !== true && this.state.editLayout == false) {
						//this.toggleSideBar(e);
					}
				}}
				onMouseEnter={() => {
					if (this.state.preview !== true) {
						this.setState({ showBlockOptions: true });
					}
				}}
				onMouseLeave={() => {
					if (this.state.isActiveSection == false) {
						this.setState({ showBlockOptions: false });
					}
				}}
				ref={this.blockRef}
			>
				{/* {console.log('layouts props',this.state.style)} */}
				{this.state.sectionType &&
				this.state.sectionType === 'list' &&
				_.has(this.state.style, 'foldBlock') &&
				this.state.style.foldBlock == true ? (
					<div
						style={{
							display: 'flex',
							minHeight: '150px',
							width: '100%',
							position: 'relative',
							zIndex: 1,
						}}
						className="show-hide"
					>
						<a onClick={(e) => this.toggleShowHide(e)}>
							{this.state.showHide ? <Down /> : <Up />}
							{this.state.style.foldBlockText
								? this.state.style.foldBlockText
								: 'Show / Hide'}
						</a>
					</div>
				) : (
					''
				)}

				{this.state.style?.backgroundType !== 'color' && (
					<div
						className="bg-overlay"
						style={{
							backgroundColor: this.state.style?.bgOverlayColor,
							opacity: this.state.style?.bgOverlayOpacity / 100,
						}}
					></div>
				)}
				{this.state.style?.backgroundType == 'video' &&
					this.state.style?.backgroundVideoURL && (
						<div className="bg-video-player">
							<ReactPlayer
								url={this.state.style.backgroundVideoURL}
								width="100%"
								height="100%"
								loop={true}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
								playing={true}
								muted
								controls={false}
							/>
						</div>
					)}

				<div
					style={{
						height: '100%',
						display:
							this.state.sectionType === 'list'
								? this.state.showHide
									? 'none'
									: 'flex'
								: 'flex',

						padding: this.state.style?.noPadding
							? ''
							: `${
									this.state.style?.padding
										? padding[this.state.style.padding]
										: '0px'
							  } ${
									this.state.previewType === 'm' && this.state.preview
										? '14px'
										: this.state.style?.paddingHorizontal
										? paddingHorizontal[this.state.style.paddingHorizontal]
										: '0px'
							  }`,

						zIndex: 1,
						...(_.has(this.state.style, 'heading')
							? {
									flexDirection: 'column',
									display:
										this.state.sectionType === 'list'
											? this.state.showHide
												? 'none'
												: 'flex'
											: 'flex',
							  }
							: {}),
					}}
				>
					{this.state.showBlockActions &&
					this.state.preview == false &&
					!disabledModules.includes(this.props.module) ? (
						<div className="block-action-bar">
							{/* <span>
<Edit />
</span>
<span>
<Copy />
</span> */}
							<span className="tooltip" onClick={(e) => this.handleBlock(e)}>
								<Edit />
								<label className="tooltip-text">Block&nbsp;Settings</label>
							</span>
							<span className="tooltip" onClick={(e) => this.handleDuplicate(e)}>
								<Copy />
								<label className="tooltip-text">Duplicate</label>
							</span>

							<span
								className="tooltip"
								onClick={() => {
									this.props.moveItem(
										this.props.index,
										this.props.index + 1,
										this.state.activeSectionID,
										'down',
									);
								}}
								disabled={this.props.sortedIndex === this.props.itemsLength - 1}
								style={{
									cursor:
										this.props.sortedIndex === this.props.itemsLength - 1
											? 'not-allowed'
											: 'pointer',
								}}
							>
								<Down />
								<label className="tooltip-text">Down</label>
							</span>

							<span
								className="tooltip"
								onClick={() => {
									this.props.moveItem(
										this.props.index,
										this.props.index - 1,
										this.state.activeSectionID,
										'up',
									);
								}}
								disabled={this.props.sortedIndex === 0}
								style={{
									cursor:
										this.props.sortedIndex === 0 ? 'not-allowed' : 'pointer',
								}}
							>
								<Up />
								<label className="tooltip-text">Up</label>
							</span>
							{this.props.module === 'form' ? (
								''
							) : (
								<span
									className="tooltip"
									onClick={(e) => this.handleDeleteSection(e)}
								>
									<Delete />
									<label className="tooltip-text">Delete</label>
								</span>
							)}
						</div>
					) : (
						''
					)}
					{this.state.preview == false &&
					this.state.showBlockOptions &&
					this.props.module !== 'form' &&
					!disabledModules.includes(this.props.module) ? (
						<>
							<a className="add-block" onClick={(e) => this.hanldeAddBlock(e)}>
								Add Block
							</a>
							<a
								className="add-block"
								onClick={(e) => this.hanldeAddBlock(e, true, this.state.sectionID)}
								style={{ right: 'auto', left: 'calc(50% + 120px)', width: '119px' }}
							>
								Add Element
							</a>
							<a
								className="add-block"
								style={{
									position: 'absolute',
									right: '-640px',
									top: '10px',
									width: '120px',
								}}
								onClick={(e) =>
									this.setState({ editLayout: !this.state.editLayout })
								}
							>
								Edit Layout
							</a>
						</>
					) : (
						''
					)}
					{_.has(this.state.style, 'heading') ? (
						<div className="row w-100p">
							<div
								className="column"
								style={{
									display: 'flex',

									...(_.has(this.state.style.heading, 'divStyles')
										? this.state.style.heading.divStyles
										: {}),
								}}
							>
								{this.switchComponent(
									this.state.style.heading.type,
									this.state.style.heading,
									'header' + this.state?.sectionID?.toString(),
									'header',
									null,
								)}
							</div>
						</div>
					) : null}
					<div
						// className={`layout ${
						// 	_.has(this.state, 'style') &&
						// 	_.has(this.state.style, 'blocksClassName') &&
						// 	!_.has(this.state.style, 'heading')
						// 		? _.has(this.state.style, 'mblocksClassName') &&
						// 		  this.state.previewType === 'm' &&
						// 		  this.state.preview
						// 			? _.has(
						// 					this.state.style,
						// 					'flipmblockClassName'
						// 			  ) && this.state.style?.flip == true
						// 				? this.state.style.blocksClassName +
						// 				  ' ' +
						// 				  this.state.style.mblocksClassName +
						// 				  ' ' +
						// 				  this.state.style.flipmblockClassName
						// 				: this.state.style.blocksClassName +
						// 				  ' ' +
						// 				  this.state.style.mblocksClassName
						// 			: _.has(
						// 					this.state.style,
						// 					'flipblocksClassName'
						// 			  ) && this.state.style.flip == true
						// 			? this.state.style.blocksClassName +
						// 			  ' ' +
						// 			  this.state.style.flipblocksClassName
						// 			: this.state.style.blocksClassName
						// 		: _.has(this.state.style, 'heading')
						// 		? _.has(this.state.style, 'mblocksClassName') &&
						// 		  this.state.previewType === 'm' &&
						// 		  this.state.preview
						// 			? `${this.state.style.mblocksClassName} d-flex`
						// 			: 'd-flex'
						// 		: 'd-flex-column'
						// } ${
						// 	_.has(this.state.style, 'heading')
						// 		? this.state.style.rowsClassName
						// 		: ''
						// }`}
						className={` ${
							_.has(this.state, 'style') &&
							_.has(this.state.style, 'blocksClassName') &&
							!_.has(this.state.style, 'heading')
								? _.has(this.state.style, 'mblocksClassName') &&
								  this.state.previewType === 'm' &&
								  this.state.preview
									? _.has(this.state.style, 'mImagePositionStyles') &&
									  this.state.style?.mimagePosition == true
										? this.state.style.blocksClassName +
										  ' ' +
										  this.state.style.mblocksClassName +
										  ' ' +
										  this.state.style.mImagePositionStyles
										: this.state.style.blocksClassName +
										  ' ' +
										  this.state.style.mblocksClassName
									: this.state.style.blocksClassName +
									  ' ' +
									  this.state?.style?.imagePositionStyles
								: _.has(this.state.style, 'heading')
								? _.has(this.state.style, 'mblocksClassName') &&
								  this.state.previewType === 'm' &&
								  this.state.preview
									? `${this.state.style.mblocksClassName} d-flex`
									: 'd-flex'
								: 'd-flex-column'
						} ${
							_.has(this.state.style, 'heading') ? this.state.style.rowsClassName : ''
						}
						
						${this.props.module === 'thankyou' && this.state.previewType === 'm' ? 'p-60p-imp' : ''}
						`}
						ref={this.divRef}
						style={{
							display: 'grid',
							gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
							gridTemplateRows: `repeat(auto-fill, 50px)`,
							width: '100%',
							minHeight: `${this.getMinLayoutHeight()}px`,
							height: `${Math.max(
								this.state.layoutHeight,
								this.getMinLayoutHeight(),
							)}px`,

							// list spacing code  -abdullah

							// gap: `${
							// 	_.has(this.state.style, 'listSpacing') &&
							// 	_.has(this.state.style, 'gap')
							// 		? `${this.state?.style?.gap}px`
							// 		: '40px'
							// }`,

							// video alignment -Abdullah
							justifyContent:
								_.has(this.state.style, 'alignVideoBlock') &&
								this.state.style.alignVideoBlock,

							padding:
								this.state.style?.innerPadding &&
								this.state.style?.imgLayoutPadding &&
								`${
									this.state.style?.padding
										? padding[this.state.style.padding]
										: '0px'
								} ${
									this.state.previewType === 'm' && this.state.preview
										? '14px'
										: '0px'
								}`,

							position: 'relative',
							//minHeight: 1000,
						}}
					>
						{/* Add grid overlay */}
						{this.state.previewGrid && (
							<>
								<div
									className="grid-overlay"
									style={{
										position: 'absolute',
										width: '100%',
										height: '100%',
										backgroundColor: 'white',
										border: '1px solid #E5E7EB',
										backgroundImage: `
											linear-gradient(to right, transparent ${this.state.gridSize - 1}px, #f0f0f0 1px),
											linear-gradient(to bottom, transparent ${this.state.gridSize - 1}px, #f0f0f0 1px)
										`,
										zIndex: 1,
										backgroundSize: `${this.state.gridSize}px ${this.state.gridSize}px`,
										pointerEvents: 'none',
									}}
								>
									{/* Calculate number of rows needed based on height */}
									{Array.from({
										length:
											Math.ceil(
												this.blockRef.current?.getBoundingClientRect()
													.height / 50,
											) * this.state.gridSize,
									}).map((_, index) => (
										<div
											key={index}
											style={{
												gridColumn: `${(index % this.state.gridSize) + 1}`,
												gridRow: `${
													Math.floor(index / this.state.gridSize) + 1
												}`,
												pointerEvents: 'none',
											}}
											// className="grid-cell"
										>
											<div className="grid-cell-content"></div>
										</div>
									))}
								</div>
								{console.log(this.state.placeholderPosition, 'placeholderPosition')}
								<div
									style={{
										// position: 'absolute',
										display: 'grid',
										gridArea: this.state?.placeholderPosition?.gridArea,
										backgroundColor: 'rgba(59, 130, 246, 0.2)',
										border: '2px dashed #3B82F6',
										pointerEvents: 'none',
										zIndex: 1,
										width: `${this.state?.placeholderPosition?.width}px`,
										height: `${this.state?.placeholderPosition?.height}px`,
									}}
								/>
							</>
						)}

						{_.map(this.state.blocks, (row, key) => {
							return _.map(row.subBlocks, (component, k) => {
								if (
									_.has(component, 'listCount') &&
									this.state.style.count < component.listCount
								) {
									return null;
								} else if (_.has(component, 'hasParentDiv')) {
									return (
										<div
											className={`${component.parentDivClass} hello-class`}
											key={k}
											styles={{
												display: 'grid',
												gridArea: component.divStyles?.gridArea,
											}}
										>
											<Draggable
												defaultPosition={{ x, y }}
												scale={1}
												disabled={this.state.preview}
												//	onStart={(e, data) => this.handleDragStart(e, data)}
												onDrag={(e, data) => this.handleDragStart(e, data)}
												onStop={(e, data) =>
													this.handleDragStop(e, data, component, k)
												}
											>
												<div
													className={`column ${
														_.has(component, 'className')
															? component.className
															: ''
													} `}
													style={{
														// display: 'flex',
														cursor: this.state.preview
															? 'default'
															: 'move',
														position: 'relative',
														...(_.has(component, 'divStyles')
															? _.omit(component.divStyles, [
																	'gridArea',
															  ])
															: {}),
													}}
													key={k}
													ref={(el) => (this.boxRefs[k] = el)}
												>
													{this.switchComponent(
														component.type,
														component,
														row._id,
														null,
														_.has(row, 'contentAlign')
															? row.contentAlign
															: null,
													)}
												</div>
											</Draggable>
										</div>
									);
								} else {
									let x = 0;
									let y = 0;

									if (
										_.has(component, 'divStyles') &&
										component.divStyles.transform
									) {
										try {
											let transform = _.pick(component.divStyles, [
												'transform',
											]);
											let values = transform.transform.match(
												/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/,
											);
											if (values) {
												x = parseInt(values[1]) || 0;
												y = parseInt(values[2]) || 0;
											}
										} catch (error) {
											// console.log('Error parsing transform:', error);
											x = 0;
											y = 0;
										}
									}
									let dragX = null;
									let dragY = null;
									if (_.has(component, 'divStyles')) {
										if (_.has(component.divStyles, 'dragX')) {
											dragX = component.divStyles?.dragX;
										}
										if (_.has(component.divStyles, 'dragY')) {
											dragY = component.divStyles?.dragY;
										}
									}
									// console.log(dragX, dragY, 'dragX, dragY', component.divStyles);
									return (
										<div
											className={`${component.parentDivClass} hello-class`}
											key={k}
											style={{
												display: 'grid',
												gridArea: component.divStyles?.gridArea,
											}}
										>
											<Draggable
												//bounds=".layout"
												//	key={k}
												//defaultPosition={{ x, y }}
												scale={1}
												disabled={this.state.preview}
												onStart={(e, data) =>
													this.handleDrag(e, data, k, dragX, dragY)
												}
												onDrag={(e, data) =>
													this.handleDragStart(e, data, k)
												}
												onStop={(e, data) =>
													this.handleDragStop(e, data, component, k)
												}
												position={{
													x: this.state.drag2X,
													y: this.state.drag2Y,
												}}
											>
												<div
													className={`column ${
														component.listCount && 'listAnimation'
													} ${
														_.has(component, 'className')
															? _.has(component, 'mclassName') &&
															  this.state.previewType === 'm' &&
															  this.state.preview
																? component.className +
																  '' +
																  component.mclassName
																: component.className
															: ''
													} ${
														_.has(component, 'mclassName') &&
														this.state.previewType === 'm' &&
														this.state.preview
															? component.mclassName
															: ''
													} ${
														_.has(component, 'device')
															? component.device
															: ''
													} ${
														_.has(component, 'border')
															? component.border
															: ''
													}`}
													style={{
														// display: _.has(component, 'label')
														// 	? _.has(
														// 			this.state.style,
														// 			'viewSubBlockOptions',
														// 	  )
														// 		? this.returnSubBlock(component.label)
														// 		: 'block'
														// 	: 'block',
														cursor: this.state.preview
															? 'default'
															: 'move',
														position: this.state.position,
														width: 'fit-content',
														zIndex: 1,
														border:
															this.state.activeComponentID ===
															component?._id
																? '1px solid #3B82F6'
																: 'none',

														background: `${
															_.has(component, 'backgroundlabel') &&
															_.has(
																this.state.style,
																'subBlocksBackgroundColor',
															) &&
															_.size(
																this.state.style
																	.subBlocksBackgroundColor,
															) > 0
																? this.state.style
																		.subBlocksBackgroundColor[
																		component.backgroundlabel
																  ]
																: _.has(
																		component,
																		'sameBgCircle',
																  ) &&
																  _.has(
																		this.state.style,
																		'sectionBackgroundColor',
																  )
																? this.state.style
																		.sectionBackgroundColor
																: ''
														}`,
														...(_.has(component, 'divStyles')
															? _.omit(component.divStyles, [
																	'gridArea',
															  ])
															: {}),
													}}
													key={k}
													ref={(el) =>
														(this.boxRefs[component?._id] = el)
													}
													//onClick={(e) => this.handleClick(e, component)}
												>
													{this.switchComponent(
														component.type,
														component,
														row._id,
														null,
														_.has(row, 'contentAlign')
															? row.contentAlign
															: null,
													)}
													{this.state.activeComponentID ===
														component?._id &&
														this.state.resizeHandles.map(
															(handle, index) => (
																<div
																	key={index}
																	style={{
																		...baseHandleStyle,
																		...handle.position,
																		cursor: handle.cursor,
																		transform:
																			handle.transform || '',
																	}}
																	onMouseDown={(e) =>
																		this.handleResizeStart(
																			e,
																			handle.direction,
																			component?._id,
																		)
																	}
																/>
															),
														)}
												</div>
											</Draggable>
										</div>
									);
								}
							});
						})}
					</div>
				</div>

				{this.state.preview == false && this.state.showBlockOptions ? (
					<div
						className="layout-resize-handle"
						onMouseDown={this.handleResizeStart}
						style={{
							position: 'absolute',
							bottom: 0,
							right: '20%',
							transform: 'translateX(-50%)',
							width: '40px',
							height: '14px',
							background: '#3474e0',
							borderRadius: '4px 4px 0 0',
							cursor: 'ns-resize',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 100,
							padding: '10px',
						}}
					>
						<div
							style={{
								width: '20px',
								height: '2px',
								background: 'white',
								borderRadius: '2px',
								position: 'relative',
							}}
						>
							<div
								style={{
									position: 'absolute',
									width: '20px',
									height: '2px',
									background: 'white',
									borderRadius: '2px',
									top: -5,
								}}
							/>
							<div
								style={{
									position: 'absolute',
									width: '20px',
									height: '2px',
									background: 'white',
									borderRadius: '2px',
									top: 5,
								}}
							/>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default Layout;
