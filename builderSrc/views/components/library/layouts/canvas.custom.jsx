import _, { transform } from 'lodash';
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
import ScrollText from '../elements/scrolltext/index.jsx';
import IframeItem from '../elements/iframe/index.jsx';

import JNumber from '../elements/jnumber';
import JIcon from '../elements/jicon';
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

import Underlay from './actions/underlay.jsx';
import Overlay from './actions/overlay.jsx';
// import DragIcon from './actions/drag.jsx';

import Draggable from 'react-draggable';
import { ReactComponent as Rotate } from '../../../../assets/svg/rotate.svg';
// import { ListGroup } from 'react-bootstrap';

//import Proposals from "../../../controllers/proposals";
const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
const animationSpeedSec = [{ slow: 10 }, { medium: 5 }, { fast: 1 }];
import randomize from 'randomatic';

// const GRID_ROWS = 8;

const elements = [
	{ text: 'text', _id: '6717413415e02bdd2b316121' },
	{ text: 'image', _id: '6717413415e02bdd2b316122' },
	{ text: 'button', _id: '6717413415e02bdd2b316122' },
	{ text: 'icon', _id: '6717413415e02bdd2b316122' },

	{ text: 'video', _id: '6717413415e02bdd2b316122' },
	{ text: 'shape', _id: '6717413415e02bdd2b316122' },
	// { text: 'sticker', _id: '6717413415e02bdd2b316122' },
	{ text: 'circleText', _id: '6717413415e02bdd2b316122' },
	{ text: 'listIcon', _id: '6717413415e02bdd2b316122' },
	{ text: 'logoSticker', _id: '6717413415e02bdd2b316122' },
	{ text: 'iframe', _id: '6717413415e02bdd2b316122' },
];
class Layout extends Component {
	constructor(props) {
		super();
		this.state = {
			gridCols: 28,
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
			layoutHeight: props.blocks?.[0]?.subBlocks?.[0]?.divStyles?.layoutHeight || 600, // default height
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
			deltaX: 0,
			deltaY: 0,
			dragX: 0,
			dragY: 0,
			activeColumnKey: null,
			drag2X: 0,
			drag2Y: 0,
			position: 'relative',
			activeBlockID: null,
			componentPositions: {},
			overlapOptions: {
				hasOverlappingAbove: false,
				hasOverlappingBelow: false,
			},
			blockWidth: 0,
			gridRows: 24,
			layoutResizing: false,

			activeComponent: null,
			isDragging: false,
			isFocused: false,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			previewMode: props?.previewMode,
			clickGridArea: null,
			showAddElement: false,
			searchQuery: '',
			filteredElements: elements,
			isClick: false,
			slashInput: '',
			showSlashElement: false,
			selectionBox: {
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
				isSelecting: false,
			},
			selectedComponents: [],
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.addElementRef = React.createRef();
		this.layoutRef = React.createRef();
		this.divRef = React.createRef();
		this.searchInputRef = React.createRef();
		this.resizableRefs = [];
		this.resizeObserver = null;
	}
	componentDidMount = () => {
		if (this.props.blocks?.[0]?.subBlocks?.[0]?.divStyles?.layoutHeight) {
			this.setState({
				layoutHeight: this.props.blocks?.[0]?.divStyles?.layoutHeight || 600,
			});
		}
		document.addEventListener('mousedown', this.handleClickOutside);
		document.addEventListener('keydown', this.handleKeyDown);
		this.animateSection();

		// if (this.blockRef.current) {
		// 	if (this.state.activeAnimation > 0) {
		// 		this.observer?.observe(this.blockRef.current);
		// 	}
		// }
		// //this.updateLayoutDimensions();
		// //window.addEventListener('resize', this.updateLayoutDimensions);

		// // Initialize ResizeObserver
		// this.resizeObserver = new ResizeObserver((entries) => {
		// 	for (let entry of entries) {
		// 		const newWidth = entry.contentRect.width;
		// 		// const layoutRect = this.divRef.current?.getBoundingClientRect();
		// 		// if (!layoutRect) return;

		// 		// // Use fixed cell height like in handleResizeBlock
		// 		// const cellHeight = 50; // Fixed cell height
		// 		// const gridGap = 10;
		// 		// let maxBottom = 0;

		// 		// // Find the lowest element
		// 		// const allElements = this.divRef.current.querySelectorAll('.column');
		// 		// allElements.forEach(element => {
		// 		// 	const rect = element.getBoundingClientRect();
		// 		// 	maxBottom = Math.max(maxBottom, rect.bottom - layoutRect.top);
		// 		// });

		// 		// // If elements are near bottom, add rows
		// 		// if (maxBottom + cellHeight > layoutRect.height) {
		// 		// 	const rowsNeeded = Math.ceil(maxBottom / (cellHeight + gridGap)) + 1;

		// 		// 	let updatedBlocks = [...this.state.blocks];
		// 		// 	if (updatedBlocks[0]?.subBlocks[0]) {
		// 		// 		updatedBlocks[0].subBlocks[0].divStyles = {
		// 		// 			...updatedBlocks[0].subBlocks[0].divStyles,
		// 		// 			gridRows: rowsNeeded
		// 		// 		};
		// 		// 	}

		// 		// 	this.setState({
		// 		// 		gridRows: rowsNeeded,
		// 		// 		blocks: updatedBlocks
		// 		// 	});
		// 		// }

		// 		// Update width if changed
		// 		if (newWidth !== this.state.blockWidth) {
		// 			this.setState({ blockWidth: newWidth }, () => {
		// 				this.handleSetLayoutHeight();
		// 			});
		// 		}
		// 	}
		// });

		// // Start observing blockRef
		// if (this.divRef.current) {
		// 	this.resizeObserver.observe(this.divRef.current);
		// }
		this.getGridRowsCount();

		// Remove transform styles from all column elements
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleKeyDown);
		//window.removeEventListener('resize', this.updateLayoutDimensions);
		document.removeEventListener('mousemove', this.handleResize);
		document.removeEventListener('mouseup', this.handleResizeStop);

		// Cleanup ResizeObserver
		// if (this.resizeObserver) {
		// 	this.resizeObserver.disconnect();
		// }
	}

	getGridRowsCount = () => {
		let gridRowsCount = this.state.gridRows;
		if (
			this.state.blocks &&
			this.state.blocks[0] &&
			this.state.blocks[0].subBlocks &&
			this.state.blocks[0].subBlocks[0] &&
			this.state.blocks[0].subBlocks[0].divStyles &&
			this.state.blocks[0].subBlocks[0].divStyles.gridRows
		) {
			gridRowsCount = this.state.blocks[0].subBlocks[0].divStyles.gridRows;
		}
		// console.log(gridRowsCount, 'gridRowsCount');

		this.setState({ gridRows: gridRowsCount });
	};
	// handleSetLayoutHeight = () => {
	// 	if (
	// 		this.state.blocks &&
	// 		_.size(this.state.blocks) > 0 &&
	// 		this.state.blocks[0].subBlocks &&
	// 		_.size(this.state.blocks[0].subBlocks) > 0
	// 	) {
	// 		let layoutHeight = this.state.blocks[0].subBlocks[0].divStyles.layoutHeight;
	// 		let layoutWidth = this.state.blocks[0].subBlocks[0].divStyles.layoutWidth;
	// 		let height = (this.divRef.current.clientWidth / layoutWidth) * layoutHeight;
	// 		// console.log('divStylest', layoutHeight, layoutWidth, height);
	// 		if (
	// 			this.state.blocks[0].subBlocks[0].divStyles.layoutHeight &&
	// 			this.state.blocks[0].subBlocks[0].divStyles.layoutWidth
	// 		) {
	// 			this.setState({
	// 				layoutHeight: height,
	// 			});
	// 			this.divRef.current.style.height = height + 'px';
	// 		}
	// 	}
	// };

	componentWillReceiveProps = (nextProps) => {
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.state.previewMode !== nextProps.previewMode) {
			this.setState(
				{
					previewMode: nextProps.previewMode,
				},
				() => {
					if (nextProps.previewMode === 'm') {
						this.setState({
							gridCols: 8,
						});
					} else {
						this.setState({
							gridCols: 28,
						});
					}
				},
			);
		}
		if (this.state.triggeredFont !== nextProps.triggeredFont) {
			this.setState({
				triggeredFont: nextProps.triggeredFont,
			});
		}
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
			this.setState(
				{
					blocks: nextProps.blocks,
				},
				() => {
					//();
				},
			);
		}
		if (this.state.style !== nextProps.style) {
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
		if (!this.state.snapToGrid) return { x, y };

		const layoutElement = this.blockRef.current;
		if (!layoutElement) return { x, y };

		const layoutRect = layoutElement?.getBoundingClientRect();

		const relativeX = x - layoutRect?.left;
		const relativeY = y - layoutRect?.top;

		return { x: this.snapToGrid(relativeX), y: this.snapToGrid(relativeY) };
	};

	handleClickOutside = (event) => {
		// this.props.setPreviewType('b');
		if (this.addElementRef.current && !this.addElementRef.current.contains(event.target)) {
			this.setState({
				showAddElement: false,
				searchQuery: '',
				filteredElements: elements,
			});
		}
		if (this.searchInputRef.current && !this.searchInputRef.current.contains(event.target)) {
			this.setState({
				showSlashElement: false,
				slashInput: '',
				isClick: false,
			});
		}
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
				activeComponentID: null,
				activeComponent: null,
				isFocused: false,
			});
		}
		if (this.blockRef.current && this.blockRef.current.contains(event.target)) {
			if (this.state.isActiveSection) {
				Object.values(this.boxRefs).forEach((ref, index) => {
					if (ref && !ref.contains(event.target)) {
						this.props.handleSetBlockTab(event);
						const dataId = ref?.getAttribute('data-id');

						if (dataId == this.state.activeComponentID) {
							this.setState({
								activeComponentID: null,
								activeComponent: null,
								isFocused: false,
							});
						}
					}
				});
			}
		}
		Object.values(this.boxRefs).forEach((ref, index) => {
			if (ref) {
				ref.style.cursor = 'text';
			}
		});
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
	switchComponent = (
		type,
		properties,
		blockID,
		header = null,
		contentAlign = null,
		fillVideoBlock = null,
		cardColor = null,
		iconColor = null,
		jCount = null,
	) => {
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
						setTriggerFont={(e) => this.props.setTriggerFont(e)}
						triggerFont={this.state.triggerFont}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state.triggeredFont}
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
							this.props.handleBSelection(e, activeTextBlock)
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
						tables={this.props.tables}
						sections={this.props.sections}
						sectionBg={this.state.style?.sectionBackgroundColor}
					/>
				);

			case 'image':
				return (
					<ImageItem
						isFluid={true}
						previewMode={this.state.previewMode}
						style={properties.styles}
						crop={this.state.crop}
						zoom={this.state.zoom}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={properties.imageURL}
						imageSettings={properties.image_settings}
						settingData={(e) => this.props.imgSettingData(e)}
						setActiveImage={(e) =>
							this.props.activeImage(
								this.state.sectionID,
								blockID,
								properties._id,
								properties.imageURL,
								e,
							)
						}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						client={this.props.client}
						label={properties?.label}
						ImgOverlayColor={properties?.ImgOverlayColor}
						ImgOverlayOpacity={properties?.ImgOverlayOpacity}
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
						generateAIImages={(e) => this.props.generateAIImages(e)}
						generateAIText={(e) => this.props.generateAIText(e)}
						isLogo={properties?.isLogo}
						sectionBg={this.state.style?.sectionBackgroundColor}
					/>
				);

			case 'button':
				return (
					<Button
						isFluid={true}
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
						sectionBg={this.state.style?.sectionBackgroundColor}
						triggerFont={this.state.triggerFont}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
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
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						sectionBg={this.state.style?.sectionBackgroundColor}
					/>
				);
			case 'circleText':
				return (
					<CircleText
						text={properties.text}
						isFluid={true}
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
						socialMediaLinks={this.state.socialMediaLinks}
						setIcon={(e) => this.props.handleSetIconLink(e, properties._id, blockID)}
						link={properties?.link}
						client={this.props.client}
					/>
				);
			case 'scrollText':
				return (
					<ScrollText
						isFluid={true}
						text={properties.text}
						itemSpacing={properties.itemSpacing}
						scrollSymbol={properties.scrollSymbol}
						fontStyles={properties.fontStyles}
						width={properties.width}
						scrollStyles={properties.scrollStyles}
						className={properties.className}
						refID={properties._id ? properties._id : null}
						reference={properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeVariableID={this.state.activeVariableID}
						activeVariableName={this.state.activeVariableName}
						subBlockID={this.state.subBlockID}
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
						borderStyle={this.state.style?.borderStyle}
						borderColor={this.state.style?.borderColor}
						borderWidth={this.state.style?.borderWidth}
						width={this.state.style?.width}
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
			// iframe work -Abdullah
			case 'iframe':
				return (
					<IframeItem
						isFluid={true}
						style={properties?.styles}
						source={properties?.source}
						height={properties?.height}
						// handleSelection={(e) => this.props.handleBSelection(e)}
						preview={this.state.preview}
						previewType={this.state.previewType}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeSubBlockId={this.state.activeSubBlockId}
						// refID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						// subBlockID={concat2}
						sectionType={this.state.sectionType}
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
						setLink={(e) => this.props.setButtonLink(e)}
						setOpenNewTab={(e) => this.props.setNewTab(e)}
						href={properties.href ? properties.href : ''}
						openInNewTab={properties.openInNewTab ? properties.openInNewTab : false}
						activeSubBlockId={this.state.activeSubBlockId}
						// refID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						// subBlockID={concat2}
						sectionType={this.state.sectionType}
						label={properties?.label}
						fillVideoBlock={fillVideoBlock}
					/>
				);

			// for journey
			case 'jNumber':
				return (
					<JNumber
						isFluid={true}
						cardColor={cardColor}
						cardBorder={this.hexToRgba(cardColor, 0.2)}
						color={iconColor}
						className={properties?.className}
						value={jCount}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state?.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props?.handleSetTab(e, properties._id, blockID)}
						subBlockID={this.state.subBlockID}
					/>
				);
			case 'jIcon':
				return (
					<JIcon
						isFluid={true}
						cardColor={cardColor}
						icon={properties?.icon}
						color={iconColor || properties?.color}
						size={properties?.size}
						className={properties?.className}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state?.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props?.handleSetTab(e, properties._id, blockID)}
						subBlockID={this.state.subBlockID}
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
		const layoutRect = this.blockRef.current?.getBoundingClientRect();
		if (!layoutRect) return null;

		// Calculate cell dimensions
		const cellWidth = layoutRect.width / this.state.gridCols;
		const cellHeight = layoutRect.height / this.state.gridRows;

		// Calculate relative mouse position within layout
		const relativeX = e.clientX - layoutRect.left;
		const relativeY = e.clientY - layoutRect.top;

		// Calculate nearest grid column and row
		const nearestCol = Math.round(relativeX / cellWidth);
		const nearestRow = Math.round(relativeY / cellHeight);

		// Ensure values stay within grid boundaries
		const col = Math.max(0, Math.min(nearestCol, this.state.gridCols - 1));
		const row = Math.max(0, Math.min(nearestRow, this.state.gridRows - 1));

		const updateGridArea = `${row} / ${col} / ${row + 4} / ${col + 4}`;
		if (this.state.clickGridArea !== updateGridArea) {
			this.setState({
				slashInput: '',
			});
		}
		this.setState(
			{
				showBlockActions: true,
				isFocused: true,
				isClick: true,
				clickGridArea: updateGridArea,
				showSlashElement: false,
				posX: relativeX,
				posY: relativeY,
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
				this.props.setLastClick(this.state.clickGridArea);
			},
		);
	};

	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	handleKeyDown = (e) => {
		if (this.state.isFocused) {
			// if (
			// 	(e.key === 'Delete' || e.key === 'Backspace') &&
			// 	this.state.activeComponentID &&
			// 	!this.state.preview
			// ) {
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// 	this.handleDeleteBlock();
			// }
			// if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// 	this.copyBlock();
			// }
			// if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// 	this.pasteBlock();
			// }
		}
	};
	handleDeleteSubBlock = (e, subBlockID) => {
		if (this.state.activeComponentID && !this.state.preview) {
			e.preventDefault();
			e.stopPropagation();
			this.handleDeleteBlock();
		}
	};
	copyBlock = () => {
		const selectedBlock = this.state.activeComponent;
		if (selectedBlock) {
			this.clipboardData = _.omit(selectedBlock, ['_id', 'order']);
			// console.log(this.clipboardData, 'this is the clipBoardCopy');
		}
	};
	pasteBlock = (component) => {
		let clipboardData = _.omit(component, ['_id', 'order']);
		let UpdateBlock = [...this.state.blocks];

		let [row, col, rowSpan, colSpan] = clipboardData.divStyles.gridArea
			.split('/')
			.map((val) => parseInt(val.trim()));
		let payload = {
			...clipboardData,
			divStyles: {
				...clipboardData.divStyles,
				gridArea: `${row + 1} / ${col + 1} / ${rowSpan + 1} / ${colSpan + 1}`,
				zIndex: clipboardData.divStyles.zIndex + 1,
			},
		};

		this.props.duplicateSubBlock(payload, this.state.blocks[0]._id);
		this.setState({
			blocks: UpdateBlock,
		});
	};

	handleDeleteBlock = (e) => {
		if (this.state.activeComponentID) {
			let updatedBlocks = this.state.blocks.map((block) => ({
				...block,
				subBlocks: block.subBlocks.filter(
					(subBlock) => subBlock._id !== this.state.activeComponentID,
				),
			}));

			this.setState(
				{
					blocks: updatedBlocks,
					activeComponentID: null,
					activeComponent: null,
					previewGrid: false,
				},
				() => {
					this.props.handleSaveblocks(this.state.blocks);
				},
			);
		}
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
		this.props.showAddBlock(e, sectionID);
	};
	hanldeAddElement = (e) => {
		// e.stopPropagation();
		// this.props.showAddElement(e);
		this.setState({
			showAddElement: !this.state.showAddElement,
		});
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
	// 	const cellWidth = layoutRect.width / this.state.gridCols;
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
	// 	// const validColumnEnd = Math.min(columnEnd, this.state.gridCols + 1);
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
	handleDrag = (e, data, k, dragX = null, dragY = null, gridArea = null, componentID = null) => {
		// console.log('this is trigger');
		e.preventDefault();

		this.setState(
			{
				initialLayoutHeight: this.state.layoutHeight,
				initialGridRows: this.state.gridRows,
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
			},
		);

		// Store initial values when resize starts
	};
	handleDragStart = (e, data, k, component) => {
		if (data.x !== component?.divStyles?.dragX && data.y !== component?.divStyles?.dragY) {
			this.setState({ previewGrid: true, isDragging: true });
			let refs = [];
			let refValues = Object.values(this.boxRefs);
			refValues
				.filter((n) => n)
				.forEach((ref, i) => {
					if (i == k) {
						// ref.style.setProperty('grid-area', 'none');
						// ref.style.setProperty('transform', `translate(${this.state.dragX}px,${this.state.dragY}px)`);
						refs.push(ref);
					}
				});

			const dragElement = refs[0];

			const elementRect = dragElement?.getBoundingClientRect();

			const layoutRect = this.blockRef?.current?.getBoundingClientRect();

			// Calculate grid cell dimensions
			const cellWidth = layoutRect?.width / this.state.gridCols;
			const cellHeight = layoutRect?.height / this.state.gridRows; // Using the same minmax height value from gridTemplateRows

			// Calculate total number of rows based on layout height
			const totalRows = Math.ceil(layoutRect?.height / cellHeight);

			// Calculate relative positions
			const relativeLeft = elementRect?.left - layoutRect?.left;
			const relativeTop = elementRect?.top - layoutRect?.top;

			// Calculate spans
			const widthInCells = Math.round(elementRect?.width / cellWidth);
			const heightInCells = Math.round(elementRect?.height / cellHeight);

			// Calculate grid positions
			const columnStart = Math.floor(relativeLeft / cellWidth) + 1;
			const rowStart = Math.floor(relativeTop / cellHeight) + 1;

			// Ensure we don't exceed the total number of rows
			const rowEnd = Math.min(rowStart + heightInCells, totalRows);
			let columnEnd = columnStart + widthInCells;

			if (columnStart > this.state.gridCols) {
				columnStart = this.state.gridCols - 1;
			}
			if (columnEnd > this.state.gridCols) {
				columnEnd = this.state.gridCols;
			}
			const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
			if (this.state.gridRows === rowEnd) {
				this.setState({
					gridRows: this.state.gridRows + 1,
					layoutHeight: this.state.layoutHeight + cellHeight,
				});
			}

			this.setState({
				//gridArea,
				drag2X: data.x,
				drag2Y: data.y,
				totalRows,
				placeholderPosition: {
					gridArea,
					width: elementRect?.width,
					height: elementRect?.height,
				},
				componentPositions: {
					...this.state.componentPositions,
					[component?._id]: { x: data.x, y: data.y },
				},
			});
		}
	};

	doBlocksOverlap = (block1, block2) => {
		// Convert grid positions to numbers
		const [blockLeft1, blockTop1, blockRight1, blockBottom1] =
			block1?.divStyles?.gridArea?.split('/') || [0, 0, 0, 0];
		const b1 = {
			left: parseInt(blockLeft1),
			right: parseInt(blockRight1),
			top: parseInt(blockTop1),
			bottom: parseInt(blockBottom1),
		};

		const [blockLeft2, blockTop2, blockRight2, blockBottom2] =
			block2?.divStyles?.gridArea?.split('/') || [0, 0, 0, 0];

		const b2 = {
			left: parseInt(blockLeft2),
			right: parseInt(blockRight2),
			top: parseInt(blockTop2),
			bottom: parseInt(blockBottom2),
		};

		// Check if there's any intersection at all
		const horizontalIntersect = b1.left <= b2.right && b1.right >= b2.left;
		const verticalIntersect = b1.top <= b2.bottom && b1.bottom >= b2.top;

		return horizontalIntersect && verticalIntersect;
	};

	checkOverlap = (blocks, component) => {
		let hasOverlappingAbove = false;
		let hasOverlappingBelow = false;
		let overLappingBlocks = [];

		const currentIndex = blocks?.subBlocks?.findIndex((item) => item._id === component._id);

		blocks?.subBlocks?.forEach((otherBlock, index) => {
			if (otherBlock._id !== component._id) {
				// Check if blocks overlap
				if (this.doBlocksOverlap(component, otherBlock)) {
					// Determine if the overlapping block is above or below based on z-index
					const currentZIndex = component?.divStyles?.zIndex || 0;
					const otherZIndex = otherBlock?.divStyles?.zIndex || 0;

					if (otherZIndex > currentZIndex) {
						hasOverlappingAbove = true;
					} else if (otherZIndex < currentZIndex) {
						hasOverlappingBelow = true;
					} else {
						// If z-indices are equal, use block IDs to determine order
						if (index > currentIndex) {
							hasOverlappingAbove = true;
						} else {
							hasOverlappingBelow = true;
						}
					}

					overLappingBlocks.push(otherBlock);
				}
			}
		});

		// console.log('Overlap check for block', component._id, ':', {
		// 	hasOverlappingAbove,
		// 	hasOverlappingBelow,
		// });
		return { hasOverlappingAbove, hasOverlappingBelow, overLappingBlocks };
	};

	adjustZIndex = (blockId, increase) => {
		const newBlocks = this.state.blocks[0];

		const currentBlock = newBlocks?.subBlocks?.find((block) => block._id === blockId);

		let hasCurrentOverlappingAbove = false;
		let hasCurrentOverlappingBelow = false;

		// Find all overlapping blocks
		const overlappingBlocks = newBlocks?.subBlocks?.filter((block) => {
			if (block._id === blockId) return false;
			return this.doBlocksOverlap(currentBlock, block);
		});

		if (overlappingBlocks.length > 0) {
			// Sort overlapping blocks by z-index
			overlappingBlocks.sort(
				(a, b) => (a?.divStyles?.zIndex || 0) - (b?.divStyles?.zIndex || 0),
			);

			const currentZIndex = currentBlock?.divStyles?.zIndex || 0;

			if (increase) {
				// Get the block with next higher z-index
				const higherBlock = overlappingBlocks?.find(
					(block) => (block?.divStyles?.zIndex || 0) > currentZIndex,
				);

				if (higherBlock) {
					// Swap z-indices
					const higherZIndex = higherBlock?.divStyles?.zIndex || 0;
					currentBlock.divStyles.zIndex = higherZIndex;
					higherBlock.divStyles.zIndex = currentZIndex;
				} else if (currentZIndex === 0) {
					// If no higher block and current is 0, increment to 1
					currentBlock.divStyles.zIndex = 1;
				}
			} else {
				// Get the block with next lower z-index
				const lowerBlocks = overlappingBlocks?.filter(
					(block) => (block?.divStyles?.zIndex || 0) < currentZIndex,
				);
				const lowerBlock = lowerBlocks[lowerBlocks?.length - 1];

				if (lowerBlock) {
					// Swap z-indices
					const lowerZIndex = lowerBlock?.divStyles?.zIndex || 0;
					currentBlock.divStyles.zIndex = lowerZIndex;
					lowerBlock.divStyles.zIndex = currentZIndex;
				} else if (currentZIndex === 0) {
					// If no lower block and current is 0, decrement to -1
					currentBlock.divStyles.zIndex = 1;
				}
			}

			const { hasOverlappingAbove, hasOverlappingBelow } = this.checkOverlap(
				newBlocks,
				currentBlock,
			);
			hasCurrentOverlappingAbove = hasOverlappingAbove;
			hasCurrentOverlappingBelow = hasOverlappingBelow;
		}

		// console.log(newBlocks, 'z-index');
		const updatedBlocks = this.state.blocks;
		updatedBlocks[0] = newBlocks;

		this.setState(
			{
				blocks: updatedBlocks,
				overlapOptions: {
					hasOverlappingAbove: hasCurrentOverlappingAbove,
					hasOverlappingBelow: hasCurrentOverlappingBelow,
				},
			},
			() => {
				this.props.handleSaveblocks(updatedBlocks);
			},
		);
	};

	handleDragStop = (e, data, component, k) => {
		const initialX = e.clientX - data.x;
		const initialY = e.clientY - data.y;
		const finalX = e.clientX;
		const finalY = e.clientY;
		const isChanged = initialX !== finalX || initialY !== finalY;
		const currentBlock = this.state.blocks[0]?.subBlocks?.find(
			(block) => block._id === component._id,
		);
		// console.log('isChanged', isChanged, this.state.activeComponentID, currentBlock._id);

		if (!isChanged) {
			const { hasOverlappingAbove, hasOverlappingBelow } = this.checkOverlap(
				this.state.blocks[0],
				currentBlock,
			);
			this.setState({
				overlapOptions: {
					hasOverlappingAbove,
					hasOverlappingBelow,
				},
				activeComponentID: currentBlock._id,
			});

			return;
		}

		let updatedBlocks = [];
		let activeBlock = {
			blockIndex: null,
			subBlockIndex: null,
			block: null,
			subBlock: null,
		};

		let maxZ = 0;
		let type = null;
		_.map(this.state.blocks, (block, k) => {
			if (k == 0) {
				block.subBlocks[0].divStyles.layoutWidth = this.divRef.current.clientWidth;
				block.subBlocks[0].divStyles.layoutHeight = this.divRef.current.clientHeight;
				block.subBlocks[0].divStyles.gridRows = this.state.gridRows;
			}
			_.map(block.subBlocks, (subBlock, index) => {
				if (subBlock?._id == component?._id) {
					type = subBlock.type;
					let gridArea =
						this.state.placeholderPosition !== null &&
						data.x !== subBlock?.divStyles?.dragX &&
						data.y !== subBlock?.divStyles?.dragY
							? this.state.placeholderPosition?.gridArea
							: subBlock.divStyles?.gridArea;
					let mGridArea =
						this.state.placeholderPosition !== null &&
						data.x !== subBlock?.divStyles?.dragX &&
						data.y !== subBlock?.divStyles?.dragY
							? this.state.placeholderPosition?.gridArea
							: subBlock.divStyles?.gridArea;
					subBlock.divStyles = {
						...subBlock.divStyles,
						...(this.state.previewMode === 'ml' ? { mGridArea } : { gridArea }),
						dragX: data.x,
						dragY: data.y,
					};
					activeBlock.blockIndex = k;
					activeBlock.subBlockIndex = index;
					activeBlock.block = block;
					activeBlock.subBlock = subBlock;
				}
			});
			updatedBlocks.push(block);
		});

		const { hasOverlappingAbove, hasOverlappingBelow, overLappingBlocks } = this.checkOverlap(
			activeBlock?.block,
			activeBlock?.subBlock,
		);

		maxZ = Math.max(...overLappingBlocks.map((b) => b.divStyles.zIndex || 0), 0);
		const anyOverlapping = hasOverlappingAbove || hasOverlappingBelow;

		updatedBlocks[activeBlock.blockIndex].subBlocks[
			activeBlock.subBlockIndex
		].divStyles.zIndex = overLappingBlocks.length > 0 ? maxZ + 1 : 0;

		let updatedLayoutHeight = [...updatedBlocks];
		updatedLayoutHeight[0] = {
			...updatedLayoutHeight[0],
			divStyles: {
				...updatedLayoutHeight[0].divStyles,
				layoutHeight: this.state.layoutHeight,
				gridRows: this.state.gridRows,
			},
		};

		this.setState(
			{
				activeComponentID: component?._id,
				activeComponent: component,
				previewGrid: false,
				overlapOptions: {
					hasOverlappingAbove,
					hasOverlappingBelow,
				},

				blocks: updatedLayoutHeight,
			},
			() => {
				this.setState({
					placeholderPosition: null,
					// dragX: data.x,
					// dragY: data.y,
					componentPositions: {},
					drag2X: 0,
					drag2Y: 0,

					pos: 'relative',
					activeColumnKey: k,
					initialLayoutHeight: 0,
					initialGridRows: 0,
					isDragging: false,
				});
				this.props.handleSaveblocks(updatedLayoutHeight);
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
			const { width, height } = this.blockRef?.current?.getBoundingClientRect();
			this.setState({
				layoutDimensions: { width, height },
			});
		}
	};

	getMinLayoutHeight = (manual = null) => {
		const layoutElement = this.divRef.current;
		if (!layoutElement) return 600;
		//const maxHeight = this.state.layoutHeight;
		let maxHeight = 0;
		if (manual) {
			const allDraggableElements = layoutElement.querySelectorAll('.column');

			allDraggableElements.forEach((element) => {
				const rect = element?.getBoundingClientRect();
				maxHeight = Math.max(
					maxHeight,
					rect?.bottom - layoutElement?.getBoundingClientRect()?.top,
				);
			});
		} else {
			maxHeight = this.state.layoutHeight;
		}

		return Math.max(600, maxHeight + 50);
	};

	handleResizeStart = (e, direction, componentID, rowID, gridArea, mGridArea) => {
		e.preventDefault();

		// Store initial values when resize starts
		this.setState({
			isResizing: true,
			previewGrid: true,
			activeBlockID: rowID,
			activeResizeDirection: direction,
			resizingComponentID: componentID,
			initialMousePos: {
				x: e.clientX,
				y: e.clientY,
			},

			initialDimensions: this.boxRefs[componentID]?.getBoundingClientRect(),
			placeholderPosition: {
				gridArea,
				mGridArea,
			},
		});

		// Add mouse move and mouse up event listeners
		document.addEventListener('mousemove', this.handleResize);
		document.addEventListener('mouseup', this.handleResizeEnd);
	};

	cellWidthToBeIncreased = (deltaValue) => {
		if (this.state.deltaX !== deltaValue) {
			if (deltaValue > this.state.deltaX) {
				return 1;
			} else {
				return -1;
			}
		}
		return 0;
	};
	cellHeightToBeIncreased = (deltaValue) => {
		if (this.state.deltaY !== deltaValue) {
			return deltaValue > this.state.deltaY ? 1 : -1;
		}
		return 0;
	};

	handleResize = (e) => {
		if (!this.state.isResizing) return;
		this.setState({
			previewGrid: true,
		});

		const { activeResizeDirection, initialMousePos, initialDimensions } = this.state;
		const layoutRect = this.blockRef.current?.getBoundingClientRect();

		// Calculate cell dimensions
		const cellWidth = layoutRect.width / this.state.gridCols;
		const cellHeight = layoutRect.height / this.state.gridRows; // Fixed cell height

		// Calculate mouse movement in grid cells
		const deltaX = Math.round((e.clientX - initialMousePos.x) / cellWidth);
		const deltaY = Math.round((e.clientY - initialMousePos.y) / cellHeight);

		const [rowStart, colStart, rowEnd, colEnd] = (
			this.state.previewMode === 'ml'
				? this.state.placeholderPosition?.mGridArea
				: this.state.placeholderPosition?.gridArea
		)
			?.split('/')
			.map((val) => parseInt(val.trim()));

		let newGridArea;

		// Calculate new grid area based on resize direction
		switch (activeResizeDirection) {
			case 'e': // East (right)
				newGridArea = `${rowStart} / ${colStart} / ${rowEnd} / ${Math.max(
					colStart + 1,
					// this.state.deltaX !== deltaX ? colEnd + deltaX : colEnd,
					colEnd + this.cellWidthToBeIncreased(deltaX),
				)}`;

				break;

			case 'w': // West (left)
				newGridArea = `${rowStart} / ${Math.min(
					colEnd - 1,
					colStart + this.cellWidthToBeIncreased(deltaX),
				)} / ${rowEnd} / ${colEnd}`;
				break;

			case 'n': // North (top)
				newGridArea = `${Math.min(
					rowEnd - 1,
					rowStart + this.cellHeightToBeIncreased(deltaY),
				)} / ${colStart} / ${rowEnd} / ${colEnd}`;
				break;

			case 's': // South (bottom)
				newGridArea = `${rowStart} / ${colStart} / ${Math.max(
					rowStart + 1,
					rowEnd + this.cellHeightToBeIncreased(deltaY),
				)} / ${colEnd}`;
				break;

			case 'ne': // Northeast
				newGridArea = `${Math.min(
					rowEnd - 1,
					rowStart + this.cellHeightToBeIncreased(deltaY),
				)} / ${colStart} / ${rowEnd} / ${Math.max(
					colStart + 1,
					colEnd + this.cellWidthToBeIncreased(deltaX),
				)}`;
				break;

			case 'nw': // Northwest
				newGridArea = `${Math.min(
					rowEnd - 1,
					rowStart + this.cellHeightToBeIncreased(deltaY),
				)} / ${Math.min(
					colEnd - 1,
					colStart + this.cellWidthToBeIncreased(deltaX),
				)} / ${rowEnd} / ${colEnd}`;
				break;

			case 'se': // Southeast
				newGridArea = `${rowStart} / ${colStart} / ${Math.max(
					rowStart + 1,
					rowEnd + this.cellHeightToBeIncreased(deltaY),
				)} / ${Math.max(colStart + 1, colEnd + this.cellWidthToBeIncreased(deltaX))}`;
				break;

			case 'sw': // Southwest
				newGridArea = `${rowStart} / ${Math.min(
					colEnd - 1,
					colStart + this.cellWidthToBeIncreased(deltaX),
				)} / ${Math.max(
					rowStart + 1,
					rowEnd + this.cellHeightToBeIncreased(deltaY),
				)} / ${colEnd}`;
				break;
		}

		// Validate grid boundaries
		// const [newRowStart, newColStart, newRowEnd, newColEnd] = newGridArea
		// 	.split('/')
		// 	.map((val) => parseInt(val.trim()));

		// Ensure values stay within grid boundaries

		// Update placeholder position
		const [newRowStart, newColStart, newRowEnd, newColEnd] = newGridArea
			?.split('/')
			.map((val) => parseInt(val.trim()));

		if (this.state.gridRows === newRowEnd) {
			this.setState({
				gridRows: this.state.gridRows + 1,
				layoutHeight: this.state.layoutHeight + cellHeight,
			});
		}
		this.setState({
			placeholderPosition: {
				gridArea: newGridArea,
				mGridArea:
					this.state.previewMode === 'ml'
						? newGridArea
						: this.state.placeholderPosition?.mGridArea,
			},
			deltaX,
			deltaY,
		});
	};

	handleResizeEnd = () => {
		// Clean up event listeners
		let updatedBlocks = [];
		_.map(this.state.blocks, (block, k) => {
			if (k == 0) {
				block.subBlocks[0].divStyles.layoutWidth = this.divRef.current.clientWidth;
				block.subBlocks[0].divStyles.layoutHeight = this.divRef.current.clientHeight;
				block.subBlocks[0].divStyles.gridRows = this.state.gridRows;
			}
			_.map(block.subBlocks, (subBlock, index) => {
				if (subBlock._id == this.state.resizingComponentID) {
					let gridArea =
						this.state.placeholderPosition !== null
							? this.state.placeholderPosition?.gridArea
							: subBlock.divStyles?.gridArea;
					let mGridArea =
						this.state.placeholderPosition !== null
							? this.state.placeholderPosition?.gridArea
							: subBlock.divStyles?.gridArea;
					subBlock.divStyles = {
						...subBlock.divStyles,
						...(this.state.previewMode === 'ml' ? { mGridArea } : { gridArea }),
					};
				}
			});
			updatedBlocks.push(block);
		});
		document.removeEventListener('mousemove', this.handleResize);
		document.removeEventListener('mouseup', this.handleResizeEnd);

		let updatedLayoutHeight = [...updatedBlocks];
		updatedLayoutHeight[0] = {
			...updatedLayoutHeight[0],
			divStyles: {
				...updatedLayoutHeight[0].divStyles,
				layoutHeight: this.state.layoutHeight,
				gridRows: this.state.gridRows,
			},
		};

		this.setState(
			{
				isResizing: false,
				previewGrid: false,
				activeResizeDirection: null,
				resizingComponentID: null,
				deltaX: 0,
				deltaY: 0,
				blocks: updatedLayoutHeight,
			},
			() => {
				this.props.handleSaveblocks(updatedLayoutHeight);
			},
		);
	};

	handleResizeLayout = (e, blockId) => {
		this.setState({
			previewGrid: true,
			initialMouseY: e.clientY, // Store initial mouse position
			layoutResizing: true,
			activeBlockID: blockId,
		});

		document.addEventListener('mousemove', this.handleResizeBlock);
		document.addEventListener('mouseup', this.handleResizeStop);
	};

	handleResizeBlock = (e) => {
		if (!this.state.layoutResizing) return;

		const layoutElement = this.blockRef.current;
		if (!layoutElement) return;

		const layoutRect = layoutElement.getBoundingClientRect();
		const cellHeight = layoutRect.height / this.state.gridRows;

		// Calculate relative movement from initial position
		const deltaY = e.clientY - this.state.initialMouseY;

		// Only update if there's significant movement
		if (Math.abs(deltaY) >= cellHeight) {
			// Calculate number of cells to add
			const cellsToAdd = Math.floor(deltaY / cellHeight);
			this.setState({
				layoutHeight: this.state.layoutHeight + cellHeight * cellsToAdd,
				gridRows: this.state.gridRows + cellsToAdd,
				initialMouseY: e.clientY, // Update initial position for next movement
			});
		}
	};

	handleResizeStop = () => {
		const updatedBlocks = [...this.state.blocks];
		// console.log(this.state.gridRows, 'cellsToAdd====>');
		if (updatedBlocks) {
			if (updatedBlocks[0]._id === this.state.activeBlockID) {
				updatedBlocks[0] = {
					...updatedBlocks[0],
					divStyles: {
						...updatedBlocks[0].divStyles,
						layoutHeight: this.state.layoutHeight,
						gridRows: this.state.gridRows,
					},
				};
			}
		}
		this.setState({
			layoutResizing: false,
			previewGrid: false,
			initialMouseY: null,
			blocks: updatedBlocks,
		});

		this.props.handleSaveblocks(updatedBlocks);

		document.removeEventListener('mousemove', this.handleResizeBlock);

		document.removeEventListener('mousemove', this.handleResizeBlock);
		document.removeEventListener('mouseup', this.handleResizeStop);
	};

	getNumberOfRows = () => {
		const totalHeight = Math.max(this.state.layoutHeight, this.getMinLayoutHeight());
		const rowHeight = 50;
		// Your grid row height
		return Math.ceil(totalHeight / rowHeight);
	};
	colWidth = () => {
		return this.blockRef.current?.getBoundingClientRect()?.width / 50;
	};
	colHeight = () => {
		return this.blockRef.current?.getBoundingClientRect()?.height / 50;
	};
	snapToGrid = (value) => Math.round(value / this.state.gridSize) * this.state.gridSize;

	handleClick = (e, component, k) => {
		const dragElement = e.target;
		const elementRect = dragElement?.getBoundingClientRect();
		const layoutRect = this.blockRef?.current?.getBoundingClientRect();

		// Calculate grid cell dimensions
		const cellWidth = layoutRect.width / this.state.gridCols;
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
			activeComponent: component,
			initialGridArea: gridArea,
		});
	};
	hexToRgba = (hex, alpha = 1) => {
		// Remove the '#' if present
		if (hex == false) {
			hex = '#cccccc';
			hex = hex.replace('#', '');
		} else {
			hex = hex.replace('#', '');
		}
		// Parse the hex components
		const r = parseInt(hex.substring(0, 2), 16); // Red
		const g = parseInt(hex.substring(2, 4), 16); // Green
		const b = parseInt(hex.substring(4, 6), 16); // Blue

		// Return RGBA string
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};
	handleSearchElements = (e) => {
		const query = e.target.value?.toLowerCase();
		const filtered = elements.filter((element) => element.text?.toLowerCase()?.includes(query));

		this.setState({
			searchQuery: query,
			filteredElements: filtered,
		});
	};
	AddElement = (element) => {
		this.setState({
			showAddElement: false,
		});
		this.props.handleAddElement(element);
	};
	handleSlashInput = (e) => {
		const value = e.target.value;

		if (value === '/') {
			this.setState({
				showSlashElement: true,
				slashInput: value,
			});
		} else if (value === '') {
			this.setState({
				showSlashElement: false,
				slashInput: value,
			});
		} else {
			this.setState({ slashInput: value });
		}
	};
	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			const searchTerm = this.state.slashInput.replace('/', '')?.toLowerCase();

			const matchingElement = elements.find((element) =>
				element.text?.toLowerCase()?.includes(searchTerm),
			);
			if (matchingElement) {
				this.props.handleAddElement(matchingElement);
				this.setState({
					slashInput: '',
					showSlashElement: false,
					isClick: false,
				});
			} else {
				// Show error message
				alert('No matching element found');
				this.setState({
					slashInput: '',
				});
			}
		}
	};

	// Add these methods to the class
	handleRotateStart = (e, componentId) => {
		e.preventDefault();
		e.stopPropagation();

		// Get the element's center point
		const element = this.boxRefs[componentId];
		const rect = element.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Store initial angle and component info
		const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
		const component = this.state.blocks[0].subBlocks.find((block) => block._id === componentId);

		this.setState({
			isRotating: true,
			rotatingComponentId: componentId,
			rotationCenter: { x: centerX, y: centerY },
			initialAngle: initialAngle,
			currentRotation: component?.divStyles?.rotation || 0,
		});

		document.addEventListener('mousemove', this.handleRotateMove);
		document.addEventListener('mouseup', this.handleRotateEnd);
	};

	handleRotateMove = (e) => {
		if (!this.state.isRotating) return;

		// Calculate the new angle based on mouse position relative to center
		const currentAngle = Math.atan2(
			e.clientY - this.state.rotationCenter.y,
			e.clientX - this.state.rotationCenter.x,
		);

		// Calculate rotation difference in degrees
		const deltaAngle = (currentAngle - this.state.initialAngle) * (180 / Math.PI);
		const rotation = this.state.currentRotation + deltaAngle;

		// Update blocks with new rotation
		const updatedBlocks = this.state.blocks.map((block) => ({
			...block,
			subBlocks: block.subBlocks.map((subBlock) => {
				if (subBlock._id === this.state.rotatingComponentId) {
					return {
						...subBlock,
						divStyles: {
							...subBlock.divStyles,
							rotation,
						},
					};
				}
				return subBlock;
			}),
		}));

		this.setState({
			blocks: updatedBlocks,
			initialAngle: currentAngle, // Update initial angle for next move
			currentRotation: rotation,
		});
	};

	handleRotateEnd = () => {
		// Clean up event listeners
		document.removeEventListener('mousemove', this.handleRotateMove);
		document.removeEventListener('mouseup', this.handleRotateEnd);

		// Save the final rotation
		this.setState(
			{
				isRotating: false,
				rotatingComponentId: null,
				initialMouseY: null,
				currentRotation: null,
			},
			() => {
				this.props.handleSaveblocks(this.state.blocks);
			},
		);
	};

	handleSelectionStart = (e) => {
		// Only start selection if clicking directly on the layout (not on components)
		if (e.target === this.blockRef.current || e.target === this.divRef.current) {
			const layoutRect = this.blockRef.current.getBoundingClientRect();
			const startX = e.clientX - layoutRect.left;
			const startY = e.clientY - layoutRect.top;

			this.setState({
				selectionBox: {
					startX,
					startY,
					endX: startX,
					endY: startY,
					isSelecting: true,
				},
				selectedComponents: [],
			});

			document.addEventListener('mousemove', this.handleSelectionMove);
			document.addEventListener('mouseup', this.handleSelectionEnd);
		}
	};

	handleSelectionMove = (e) => {
		if (!this.state.selectionBox.isSelecting) return;

		const layoutRect = this.blockRef.current.getBoundingClientRect();
		const endX = e.clientX - layoutRect.left;
		const endY = e.clientY - layoutRect.top;

		this.setState((prevState) => ({
			selectionBox: {
				...prevState.selectionBox,
				endX,
				endY,
			},
		}));

		// Check which components are within selection box
		this.checkSelectedComponents();
	};

	handleSelectionEnd = () => {
		this.setState((prevState) => ({
			selectionBox: {
				...prevState.selectionBox,
				isSelecting: false,
			},
		}));

		document.removeEventListener('mousemove', this.handleSelectionMove);
		document.removeEventListener('mouseup', this.handleSelectionEnd);
	};

	checkSelectedComponents = () => {
		const { startX, startY, endX, endY } = this.state.selectionBox;
		const selectionRect = {
			left: Math.min(startX, endX),
			right: Math.max(startX, endX),
			top: Math.min(startY, endY),
			bottom: Math.max(startY, endY),
		};

		const selectedComponents = [];

		// Check each component against selection box
		Object.entries(this.boxRefs).forEach(([id, ref]) => {
			if (!ref) return;

			const componentRect = ref.getBoundingClientRect();
			const layoutRect = this.blockRef.current.getBoundingClientRect();

			// Convert component position to relative coordinates
			const relativeRect = {
				left: componentRect.left - layoutRect.left,
				right: componentRect.right - layoutRect.left,
				top: componentRect.top - layoutRect.top,
				bottom: componentRect.bottom - layoutRect.top,
			};

			// Check if component intersects with selection box
			if (
				relativeRect.left < selectionRect.right &&
				relativeRect.right > selectionRect.left &&
				relativeRect.top < selectionRect.bottom &&
				relativeRect.bottom > selectionRect.top
			) {
				selectedComponents.push(id);
			}
		});

		this.setState({ selectedComponents });
	};

	render() {
		const { width, height } = this.state.layoutDimensions;
		const baseHandleStyle = {
			width: '12px',
			height: '12px',
			backgroundColor: 'white',
			border: '2px solid #2196F3',
			position: 'absolute',
			zIndex: 1,
		};
		// console.log(this.state, '44');

		const layoutRect = this.blockRef.current?.getBoundingClientRect();
		const cellWidth = layoutRect ? layoutRect.width / this.state.gridCols : 0;
		const cellHeight = layoutRect ? layoutRect.height / this.state.gridRows : 0;

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
					minHeight: `${this.getMinLayoutHeight()}px`,
					height: `${Math.max(
						this.state.blocks?.[0]?.divStyles?.layoutHeight,
						this.getMinLayoutHeight(),
					)}px`,
				}}
				onClick={(e) => {
					this.toggleSideBar(e);
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
				onMouseDown={this.handleSelectionStart}
				ref={this.blockRef}
			>
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
					this.state.previewMode === 'd' &&
					!disabledModules.includes(this.props.module) ? (
						<>
							{!this.state.showAddElement && (
								<div className="add-element">
									<a
										className="add-element-button"
										onClick={(e) =>
											this.hanldeAddElement(e, true, this.state.sectionID)
										}
										style={{
											left: 'calc(1% + 10px)',
										}}
									>
										Add Element
									</a>
									<p>Search element or " /" to open search on canvas</p>
								</div>
							)}
							{this.state.showAddElement && (
								<div className="add-element-container" ref={this.addElementRef}>
									<input
										type="text"
										placeholder="Search Element"
										value={this.state.searchQuery}
										onChange={this.handleSearchElements}
									/>
									{this.state.filteredElements.map((element, index) => (
										<div
											key={index}
											className="add-element-item"
											onClick={() => this.AddElement(element)}
										>
											{element.text}
										</div>
									))}
								</div>
							)}

							<a
								className="add-block"
								onClick={(e) => this.hanldeAddBlock(e)}
								style={{ right: 'auto', left: 'calc(50% + 10px)' }}
							>
								Add Block
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
							gridTemplateColumns: `repeat(${this.state.gridCols}, 1fr)`,
							// gridTemplateRows: `repeat(auto-fill, 50px)`,
							gridTemplateRows: `repeat(${this.props.blocks?.[0]?.divStyles?.gridRows}, 1fr)`,
							gridRowGap: '10px',
							gridColumnGap: '10px',
							width: '100%',
							height: '100%',
							minHeight: '100%',
							// minHeight: this.state.layoutHeight
							// 	? this.state.layoutHeight
							// 	: `${this.getMinLayoutHeight()}px`,
							// height: `${Math.max(
							// 	this.state.layoutHeight,
							// 	this.getMinLayoutHeight(),
							// )}px`,

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
								<div className="grid-line-vertical"></div>

								<div
									className="grid-overlay"
									style={{
										position: 'absolute',
										width: '100%',
										height: '100%',
										backgroundColor: 'rgba(255,255,255,0)',
										border: '1px solid #E5E7EB',
										display: 'grid',
										gridTemplateColumns: `repeat(${this.state.gridCols}, 1fr)`,
										gridTemplateRows: `repeat(${this.state.gridRows}, 1fr)`,
										gridRowGap: '10px',
										gridColumnGap: '10px',
										zIndex: 0,
										pointerEvents: 'none',
									}}
								>
									{/* Generate grid cells based on columns and rows */}
									{Array.from({
										length: this.state.gridCols * this.state.gridRows,
									}).map((_, index) => (
										<div
											key={index}
											style={{
												border: '1px solid #f7f7f7',
												gridColumn: `${(index % this.state.gridCols) + 1}`,
												gridRow: `${
													Math.floor(index / this.state.gridCols) + 1
												}`,
												pointerEvents: 'none',
												backgroundColor: 'rgba(0,0,0,0.2)',
												borderRadius: '4px',
											}}
										>
											<div className="grid-cell-content"></div>
										</div>
									))}
								</div>

								{/* Placeholder for dragging */}
								<div
									style={{
										display: 'grid',
										gridArea: this.state?.placeholderPosition?.gridArea,
										//backgroundColor: 'rgba(59, 130, 246, 0.2)',
										border: '4px solid #79ecc9',
										pointerEvents: 'none',
										zIndex: 1,
										//width: `${this.state?.placeholderPosition?.width}px`,
										//height: `${this.state?.placeholderPosition?.height}px`,
										//position: 'absolute',
									}}
								/>
							</>
						)}

						{_.map(this.state.blocks, (row, key) => {
							return _.map(row.subBlocks, (component, k) => {
								// if (
								// 	_.has(component, 'listCount') &&
								// 	this.state.style.count < component.listCount
								// ) {
								// 	return null;
								// } else
								if (_.has(component, 'hasParentDiv')) {
									return (
										<div
											className={`${component.parentDivClass} hello-class`}
											key={k}
											styles={{
												display: 'grid',
												gridArea:
													component.divStyles?.gridArea ||
													'1 / 1 / 2 / 2',
											}}
										>
											<Draggable
												defaultPosition={{ x, y }}
												scale={1}
												// disabled={this.state.preview}
												//	onStart={(e, data) => this.handleDragStart(e, data)}
												// onDrag={(e, data) => this.handleDragStart(e, data)}
												onDrag={(e, data) =>
													!this.state.isResizing &&
													this.handleDragStart(e, data, k)
												}
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
														display: 'flex',
														cursor: this.state.preview
															? 'default'
															: 'move',
														position: 'relative',
														...(_.has(component, 'divStyles')
															? _.omit(component.divStyles, [
																	'gridArea',
																	'mGridArea',
																	'width',
															  ])
															: {}),
														...(this.state.isResizing && {
															background: 'rgba(59, 130, 246, 0.2)',
															opacity: 0.5,
														}),
														width: '100%',
														minHeight: '100%',
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
									let rowStart = null;
									if (this.state.previewMode == 'ml') {
										if (
											_.has(component.divStyles, 'mGridArea') &&
											component.divStyles.mGridArea
										) {
											rowStart = component.divStyles.mGridArea.split('/')[0];
										} else {
											if (
												_.has(component.divStyles, 'gridArea') &&
												component.divStyles.gridArea
											) {
												rowStart =
													component.divStyles.gridArea.split('/')[0];
											}
										}
									} else {
										if (
											_.has(component.divStyles, 'gridArea') &&
											component.divStyles.gridArea
										) {
											rowStart = component.divStyles.gridArea.split('/')[0];
										}
									}
									// console.log('rowStart', rowStart);
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

									return (
										<div
											className={`${component.parentDivClass} hello-class`}
											key={k}
											style={{
												display: 'grid',
												gridArea:
													this.state.previewMode === 'ml'
														? _.has(component.divStyles, 'mGridArea')
															? component.divStyles.mGridArea
															: component.divStyles?.gridArea ||
															  '1 / 1 / 2 / 2'
														: component.divStyles?.gridArea ||
														  '1 / 1 / 2 / 2',
												...(_.has(component?.divStyles, 'rotation')
													? {
															transform: `${
																component?.divStyles?.rotation
																	? `rotate(${component.divStyles.rotation}deg)`
																	: ''
															}`,
													  }
													: {}),
											}}
										>
											<Draggable
												bounds=".layout"
												//	key={k}
												//defaultPosition={{ x, y }}
												scale={1}
												disabled={this.state.preview}
												onStart={(e, data) =>
													this.handleDrag(
														e,
														data,
														k,
														dragX,
														dragY,
														this.state.previewMode == 'ml'
															? _.has(
																	component.divStyles,
																	'mGridArea',
															  )
																? component.divStyles?.mGridArea
																: component.divStyles?.gridArea
															: component.divStyles?.gridArea,
														component._id,
													)
												}
												onDrag={(e, data) =>
													!this.state.isResizing &&
													this.handleDragStart(e, data, k, component)
												}
												onStop={(e, data) =>
													this.state.isResizing
														? ''
														: this.handleDragStop(e, data, component, k)
												}
												// position={{
												// 	x: this.state.drag2X,
												// 	y: this.state.drag2Y,
												// }}
												position={{
													x:
														this.state.componentPositions[
															component?._id
														]?.x || 0,
													y:
														this.state.componentPositions[
															component?._id
														]?.y || 0,
												}}
												cancel={
													this.state.activeComponentID === component?._id
														? '.jodit-wysiwyg'
														: ''
												}
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
													data-id={component?._id}
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
														// width: 'fit-content',
														minHeight: '100%',
														zIndex: component?.divStyles?.zIndex,
														border:
															this.state.activeComponentID ===
															component?._id
																? '1px solid #79ecc9'
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
																	'width',
															  ])
															: {}),
														...(this.state.isResizing && {
															background: 'rgba(59, 130, 246, 0.2)',
															opacity: 0.5,
														}),
														display: 'flex',
														flexFlow: 'column',
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
														_.has(row, 'fillVideoBlock') &&
															row.fillVideoBlock,
														_.has(row, 'cardColor') && row?.cardColor,
														_.has(row, 'iconColor') && row?.iconColor,
														_.has(row, 'jCount') && row?.jCount,
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
																			row?._id,
																			component?.divStyles
																				?.gridArea,
																			component?.divStyles
																				?.mGridArea,
																		)
																	}
																/>
															),
														)}

													{this.state.activeComponentID ===
														component?._id && (
														<div
															className="z-index-controls"
															style={{
																display: 'flex',
																gap: '10px',
																alignItems: 'center',
																justifyContent: 'center',
																position: 'absolute',
																top: -51,
																left: 'calc(50% - 50px)',
																background: '#fff',
																padding: '10px',
																borderRadius: '4px',
																minWidth: '100px',
																boxShadow:
																	'0 1px 1px hsl(0deg 0% 0% / 0.075),0 2px 2px hsl(0deg 0% 0% / 0.075),0 4px 4px hsl(0deg 0% 0% / 0.075),0 8px 8px hsl(0deg 0% 0% / 0.075),0 16px 16px hsl(0deg 0% 0% / 0.075),0 16px 16px hsl(0deg 0% 0% / 0.075)',
															}}
														>
															<a
																onClick={(e) =>
																	this.handleDeleteSubBlock(
																		e,
																		component?._id,
																	)
																}
																style={{ cursor: 'pointer' }}
															>
																<Delete />
															</a>
															<a
																onMouseDown={(e) =>
																	this.handleRotateStart(
																		e,
																		component?._id,
																	)
																}
																style={{ cursor: 'pointer' }}
															>
																<Rotate />
															</a>
															<a
																style={{ cursor: 'pointer' }}
																onClick={() =>
																	this.pasteBlock(component)
																}
															>
																<Copy />
															</a>
															{this.state.overlapOptions
																.hasOverlappingAbove && (
																<a
																	onClick={(e) => {
																		e.stopPropagation();
																		this.adjustZIndex(
																			component?._id,
																			true,
																		);
																	}}
																>
																	<Overlay />
																</a>
															)}
															{this.state.overlapOptions
																.hasOverlappingBelow && (
																<a
																	onClick={(e) => {
																		e.stopPropagation();
																		this.adjustZIndex(
																			component?._id,
																			false,
																		);
																	}}
																>
																	<Underlay />
																</a>
															)}
														</div>
													)}
												</div>
											</Draggable>
										</div>
									);
								}
							});
						})}
						{this.state.isClick &&
							!this.state.showAddElement &&
							!this.state.activeComponentID &&
							this.props._id == this.state.activeSectionID && (
								<div
									style={{
										zIndex: 9999,
										position: 'relative',
										left: this.state.posX,
										top: this.state.posY,
										minWidth: '10px',
										maxWidth: '100%',
									}}
									ref={this.searchInputRef}
									onClick={(e) => e.stopPropagation()}
								>
									<input
										type="text"
										className="add-element-input"
										onChange={this.handleSlashInput}
										onKeyPress={this.handleKeyPress}
										value={this.state.slashInput}
										autoFocus
										onClick={(e) => e.stopPropagation()}
									/>
									{this.state.showSlashElement && (
										<div className="add-slash-element-container">
											{elements.map((element, index) => (
												<div
													key={index}
													className="add-element-item"
													onClick={() => this.AddElement(element)}
												>
													{element.text}
												</div>
											))}
										</div>
									)}
								</div>
							)}
					</div>
				</div>

				{this.state.preview == false && this.state.showBlockOptions ? (
					<div
						className="layout-resize-handle"
						onMouseDown={(e) => this.handleResizeLayout(e, this.state.blocks?.[0]?._id)}
						style={{
							position: 'absolute',
							bottom: 0,
							right: '20%',
							transform: 'translateX(-50%)',
							width: '40px',
							height: '14px',
							background: '#3474e0',
							borderRadius: '4px 4px 0 0',
							cursor: 'grab',
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

				{/* Add selection box */}
				{this.state.selectionBox.isSelecting && (
					<div
						style={{
							position: 'absolute',
							left: Math.min(
								this.state.selectionBox.startX,
								this.state.selectionBox.endX,
							),
							top: Math.min(
								this.state.selectionBox.startY,
								this.state.selectionBox.endY,
							),
							width: Math.abs(
								this.state.selectionBox.endX - this.state.selectionBox.startX,
							),
							height: Math.abs(
								this.state.selectionBox.endY - this.state.selectionBox.startY,
							),
							border: '2px solid #79ecc9',
							backgroundColor: 'rgba(59, 130, 246, 0.1)',
							pointerEvents: 'none',
							zIndex: 9999,
						}}
					/>
				)}

				{/* Modify your component rendering to show selection state */}
				{_.map(this.state.blocks, (row, key) => {
					return _.map(row.subBlocks, (component, k) => {
						// ... existing component rendering code
						return (
							<div
								className={`column ${
									this.state.selectedComponents.includes(component._id)
										? 'selected-component'
										: ''
								}`}
								style={{
									// ... existing styles
									border: this.state.selectedComponents.includes(component._id)
										? '2px solid #79ecc9'
										: 'none',
								}}
							>
								{/* ... rest of component content */}
							</div>
						);
					});
				})}
			</div>
		);
	}
}

export default Layout;
