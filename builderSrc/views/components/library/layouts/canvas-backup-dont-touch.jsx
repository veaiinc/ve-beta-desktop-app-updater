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
import Divider from '../elements/divider/index.jsx';

import './index.scss';
// import { ReactComponent as Edit } from './actions/edit.svg';
// import { ReactComponent as Copy } from './actions/copy.svg';
import ReactPlayer from 'react-player';
import Line from '../elements/line/index.jsx';
import LogoSticker from '../elements/logosticker/index.jsx';
import Video from '../elements/video/index.jsx';
// import Copy from './actions/copy.jsx';
import Delete from './actions/delete.jsx';
import Down from './actions/down.jsx';
// import Edit from './actions/edit.jsx';
import Up from './actions/up.jsx';
// import Link from './actions/link.jsx';

// import Underlay from './actions/underlay.jsx';
// import Overlay from './actions/overlay.jsx';
// import DragIcon from './actions/drag.jsx';

import Draggable from 'react-draggable';

const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
const animationSpeedSec = [{ slow: 10 }, { medium: 5 }, { fast: 1 }];
import randomize from 'randomatic';

import { ReactComponent as AddBlock } from '../svgs/LeftBar/Addblock.svg';
import { ReactComponent as AddBlank } from '../svgs/LeftBar/AddBlank.svg';
import { ReactComponent as NewDelete } from '../svgs/LeftBar/NewDelete.svg';
import { ReactComponent as NewDown } from '../svgs/LeftBar/NewDown.svg';
import { ReactComponent as NewEdit } from '../svgs/LeftBar/NewEdit.svg';
import { ReactComponent as NewCopy } from '../svgs/LeftBar/NewCopy.svg';
import { ReactComponent as NewUp } from '../svgs/LeftBar/NewUp.svg';

import { ElementSidebar } from '../../builder_client_common.jsx';
import MultiSelectionComp from './fluid-engine/MultiSelectionComp.jsx';
import MultiSelectionOptionComp from './fluid-engine/MultiSelectionOptionComp.jsx';
import FluidBlockOptionsControls, {
	ShowZIndexValues,
} from './fluid-engine/FluidBlockOptionsControls.jsx';
import LayoutResizeHandle from './fluid-engine/layoutResizeHandle.jsx';
// import MenuBar from '../elements/menubar/menubar.jsx';
// const GRID_ROWS = 8;

const elements = [
	{ text: 'text', _id: '6717413415e02bdd2b316121' },
	{ text: 'image', _id: '6717413415e02bdd2b316122' },
	{ text: 'button', _id: '6717413415e02bdd2b316122' },
	// { text: 'icon', _id: '6717413415e02bdd2b316122' },

	{ text: 'icon', _id: '6717413415e02bdd2b316122' },

	{ text: 'video', _id: '6717413415e02bdd2b316122' },
	{ text: 'shape', _id: '6717413415e02bdd2b316122' },
	// { text: 'sticker', _id: '6717413415e02bdd2b316122' },
	// { text: 'circleText', _id: '6717413415e02bdd2b316122' },
	// { text: 'listIcon', _id: '6717413415e02bdd2b316122' },
	// { text: 'logoSticker', _id: '6717413415e02bdd2b316122' },
	{ text: 'iframe', _id: '6717413415e02bdd2b316122' },
	// { text: 'menubar', _id: '6717413415e02bdd2b316122' },
	// { text: 'signature', _id: '67165712f9a74b97c60d1f05' },
	{ text: 'divider', _id: '6717413415e02bdd2b316122' },
];
import ObjectID from 'bson-objectid';

import gsap from 'gsap';
// import ScrollMagic from 'scrollmagic';

class Layout extends Component {
	constructor(props) {
		super();

		this.elements = [
			{ text: 'text', _id: '6717413415e02bdd2b316121' },
			{ text: 'image', _id: '6717413415e02bdd2b316122' },
			{ text: 'button', _id: '6717413415e02bdd2b316122' },
			// { text: 'icon', _id: '6717413415e02bdd2b316122' },

			{ text: 'icon', _id: '6717413415e02bdd2b316122' },

			{ text: 'video', _id: '6717413415e02bdd2b316122' },
			{ text: 'shape', _id: '6717413415e02bdd2b316122' },
			// { text: 'sticker', _id: '6717413415e02bdd2b316122' },
			// { text: 'circleText', _id: '6717413415e02bdd2b316122' },
			// { text: 'listIcon', _id: '6717413415e02bdd2b316122' },
			// { text: 'logoSticker', _id: '6717413415e02bdd2b316122' },
			{ text: 'iframe', _id: '6717413415e02bdd2b316122' },
			// { text: 'menubar', _id: '6717413415e02bdd2b316122' },
			// { text: 'signature', _id: '67165712f9a74b97c60d1f05' },
			{ text: 'divider', _id: '6717413415e02bdd2b316122' },
		];
		this.state = {
			gridCols: 28,
			sections: props.sections,
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
			initialDragX: 0,
			initialDragY: 0,
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
			gridRows: 8,
			mGridRows: 8,

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
			activeComponentLink: null,
			setIconLink: false,
			selectionBox: {
				startX: 0,
				startY: 0,
				endX: 0,
				endY: 0,
				isSelecting: false,
			},
			selectedComponents: [],
			selectionBoxPosition: {
				x: 0,
				y: 0,
			},
			_id: props._id,
			isImageEdit: false,
			className: randomize('a', 10),
			isCenter: false,
			fluidShowGrid: props?.fluidShowGrid || false,
			gridHeight: 30,
			isLastSection: props?.isLastSection || false,
			divideBy: 1.6,
			activeSelectedText: false,

			showSidebar: false,
			activeType: '',
			elementEndPosition: { x: 0, y: 0 },
			activePopupComponent: {},

			debounceCropperValues: null,

			showActiveSubBlockAnime: false,
			intialGridRows: props?.intialGridRows,
			mIntialGridRows: props?.mIntialGridRows,
			cellHeight: 0,
			cellWidth: 0,
			isvalidActiveVideoURL: true,
			textError: false,
			followUpBlocks: {},
			debounceStateForCardProps: null,

			debounceStateForElementProps: null,

			// justifyleft: props.justifyleft,
			// justifycenter: props.justifycenter,
			// justifyright: props.justifyright,
			// justifyfull: props.justifyfull,
			activeFontSize: 16,
			activeColor: '#000000',
			selectedFontColor: '#000000',
			adjustGridAreasTriggerd: false,

			animeTriggerPoints: {
				start: 0.9,
				center: 0.6,
				end: 0.2,
			},
		};
		this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.columnRefs = [];
		this.addElementRef = React.createRef();
		this.layoutRef = React.createRef();
		this.divRef = React.createRef();
		this.searchInputRef = React.createRef();
		this.resizableRefs = [];
		this.resizeObserver = null;
		this.groupResizeRef = React.createRef();
		this.placeholderRef = React.createRef();
		this.elementSidebarRef = React.createRef();
		this.animeBlockParentsRef = [];
	}
	componentDidMount = async () => {
		if (typeof window != 'undefined') {
			const ScrollMagicModule = await import('scrollmagic');
			this.ScrollMagic = ScrollMagicModule.default;
		}
		this.setState({
			layoutHeight: this.props.blocks?.[0]?.divStyles?.layoutHeight || 600,
			gridRows: _.has(this.props.blocks?.[0]?.divStyles, 'gridRows')
				? this.state.previewType === 'm'
					? this.props.blocks?.[0]?.divStyles?.mGridRows
					: this.props.blocks?.[0]?.divStyles?.gridRows
				: 8,
			gridCols: this.state.previewType === 'm' || this.state.previewMode === 'm' ? 8 : 28,
		});

		window.addEventListener('beforeunload', this.handleBeforeUnload);
		document.addEventListener('mousedown', this.handleClickOutside);
		window.addEventListener('suppressWarning', (e) => {
			this.setState({ suppressWarning: e.detail });
		});
		document.addEventListener('keydown', this.handleKeyDown);
		this.animateSection();
		let windowWidth = window.innerWidth;
		let windowHeight = window.innerHeight;
		let gridHeight = windowHeight / 28;
		this.setState({ gridHeight: window.innerWidth > 768 ? gridHeight : 30 });
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

		// 		// // If elements are near bottom, lockrows
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

		this.observers = new Map();
	};
	componentWillUnmount() {
		// Clean up ScrollMagic
		if (this.controller) {
			this?.controller?.destroy();
		}
		if (this.scene) {
			this?.scene?.destroy();
		}
		document.removeEventListener('mousedown', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleKeyDown);
		//window.removeEventListener('resize', this.updateLayoutDimensions);
		document.removeEventListener('mousemove', this.handleResize);
		document.removeEventListener('mouseup', this.handleResizeStop);
		// this.adjustGridAreas();

		// Cleanup ResizeObserver
		// if (this.resizeObserver) {
		// 	this.resizeObserver.disconnect();
		// }

		// Cleanup observers
		window.removeEventListener('beforeunload', this.handleBeforeUnload);
		this?.observers?.forEach((observer) => observer?.disconnect());
		this?.observers?.clear();
	}

	handleBeforeUnload(e) {
		// Most browsers ignore the custom message these days,
		// but you must set returnValue to show the confirmation dialog.\
		// if (!this.props.client) {
		// 	this.adjustGridAreas();
		// }

		const confirmationMessage = 'Are you sure you want to leave this page without saving?';

		// event.preventDefault();

		// event.returnValue = confirmationMessage;
		// return confirmationMessage;
		if (!this.state.suppressWarning && !this.props.client) {
			e.preventDefault();
			e.returnValue = confirmationMessage;
		}
	}

	getGridRowsCount = () => {
		let gridRowsCount = this.state.gridRows;
		if (
			this.state.blocks &&
			this.state.blocks[0] &&
			this.state.blocks[0].divStyles &&
			(this.state.previewType === 'm'
				? this.state.blocks[0].divStyles.mGridRows
				: this.state.blocks[0].divStyles.gridRows)
		) {
			gridRowsCount =
				this.state.previewType === 'm'
					? this.state.blocks[0].divStyles.mGridRows
					: this.state.blocks[0].divStyles.gridRows;
		}

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

	getFontSizeForMobile = (fontSize) => {
		let font = 16;
		if (16 < fontSize <= 18) {
			font = fontSize / 1.2;
		} else if (18 < fontSize < 100) {
			font = fontSize / 1.5;
		} else {
			if (100 < fontSize < 300) {
				font = fontSize / 1.8;
			} else {
				font = fontSize / 2.4;
			}
		}
		return font;
	};
	convertRemToPx = (value) => {
		if (typeof value === 'string' && value.includes('rem')) {
			const remValue = parseFloat(value);
			return `${remValue * 16}px`;
		}
		return value;
	};
	convertPxToRem = (value) => {
		if (typeof value === 'string' && value.includes('px')) {
			const pxValue = parseFloat(value);
			return `${pxValue / 16}rem`;
		}
		return value;
	};
	compareAndConvertValues = (styleValue, themeValue) => {
		const stylePx = this.convertRemToPx(styleValue);
		const themePx = this.convertRemToPx(themeValue);

		const styleNum = parseFloat(stylePx);
		const themeNum = parseFloat(themePx);

		if (Math.abs(styleNum - themeNum) < 0.1) {
			return styleValue;
		} else {
			return this.convertPxToRem(themePx);
		}
	};

	adjustGridAreas() {
		console.log('adjustGridAreas====>');
		let rowStart = 1;
		let updatedSections = [];
		const fluidSections = this.props?.sections?.filter(
			(section) => _.has(section, 'isFluidSection') && section?.isFluidSection,
		);

		this.props?.sections?.forEach((section) => {
			let updatedSection = { ...section };

			if (
				_.has(section, 'isFluidSection') &&
				section?.isFluidSection &&
				section?.blocks?.length > 0
			) {
				updatedSection.blocks = section?.blocks?.map((block, key) => {
					let updatedBlock = { ...block };
					let currentRow = 1;
					updatedBlock.subBlocks = block?.subBlocks?.map((subBlock, k) => {
						let rowIncrement = 0;

						let gridAreaUndefined = false;
						if (!_.has(subBlock?.divStyles, 'mGridArea')) {
							let textIncrement = 6;
							if (subBlock.type === 'text') {
								let cellIncrement = this.state.cellHeight - 30;
								let cellWidth = this.state.cellWidth - 420 / 8;
								let cellWidthRows = cellWidth > 0 ? cellWidth : 0;
								let cellHeightRows = cellIncrement > 0 ? cellIncrement : 0;

								let columnWidth =
									parseInt(subBlock.divStyles.gridArea?.split('/')[3]) -
									parseInt(subBlock.divStyles.gridArea?.split('/')[1]) -
									8;
								let difference =
									parseInt(subBlock.divStyles.gridArea?.split('/')[2]) -
									parseInt(subBlock.divStyles.gridArea?.split('/')[0]);
								let textCellWidthIncrement =
									columnWidth > 0
										? (cellHeightRows + cellWidthRows) * difference +
										  columnWidth
										: (cellHeightRows + cellWidthRows) * difference;
								let numberOfRows = Math.floor(textCellWidthIncrement / 30);

								textIncrement =
									columnWidth > 0
										? difference + columnWidth + numberOfRows
										: difference + numberOfRows;
							}
							rowIncrement =
								subBlock.type === 'button'
									? 2
									: subBlock.type === 'text'
									? textIncrement
									: 6;
						} else {
							let rowStart = 1,
								colStart = 1,
								rowEnd = 6,
								colSpan = 9;
							if (subBlock?.divStyles?.mGridArea) {
								const gridValues = subBlock?.divStyles?.mGridArea
									?.split('/')
									.map((val) => {
										const parsed = parseInt(val?.trim());
										return isNaN(parsed) ? 9 : parsed;
									});

								if (gridValues.length === 4) {
									[rowStart, colStart, rowEnd, colSpan] = gridValues;
								}
							}

							if (rowEnd == undefined || rowEnd == NaN) {
								rowEnd = 9;
								gridAreaUndefined = true;
							}
							currentRow = rowIncrement < rowEnd ? rowEnd : rowIncrement;
						}

						const updatedSubBlock = {
							...subBlock,
							divStyles: !_.has(subBlock?.divStyles, 'mGridArea')
								? {
										...subBlock?.divStyles,
										mGridArea: `${
											currentRow == undefined || currentRow == NaN
												? (k + 1) * 6
												: currentRow
										} / 1 / ${
											currentRow == undefined ||
											currentRow == NaN ||
											rowIncrement == undefined ||
											rowIncrement == NaN ||
											rowIncrement == null
												? (k + 1) * 6 + 6
												: currentRow + rowIncrement
										} / 9`,
								  }
								: subBlock?.divStyles,
						};
						if (!_.has(subBlock?.divStyles, 'mGridArea')) {
							currentRow += rowIncrement;
						} else {
							currentRow += rowIncrement;
						}

						if (subBlock.type === 'text') {
							let content = subBlock.content;
							let contentWithSpace = content
								?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
								?.replace(/\s{3,}/g, '  ')
								?.trim();
							const plainText = content
								?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
								?.replace(/\s+/g, '')
								?.replace(/<input[^>]*>/g, (match) => match.replace(/\s+/g, ''))
								?.trim();
							if (_.has(subBlock, 'mContent')) {
								let mContent = subBlock.mContent;
								let mContentWithSpace = mContent
									?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
									?.replace(/\s{3,}/g, '  ')
									?.trim();
								let mPlainText = mContent
									?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
									?.replace(/\s+/g, '')
									?.replace(/<input[^>]*>/g, (match) => match.replace(/\s+/g, ''))
									?.trim();

								const tagMatch = mContent?.match(
									/<(\w+)[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/,
								);
								const tagMatch2 = content?.match(
									/<(\w+)[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/,
								);
								let tagName = tagMatch?.[1] || '';
								let styles = tagMatch?.[2] || '';
								let DesktopTagName = tagMatch2?.[1] || '';
								let DesktopStyles = tagMatch2?.[2] || '';
								let fontSizeMatch = true;

								if (_.includes(styles, 'font-size')) {
									styles = styles.replace(
										/font-size:\s*([^;]+)/g,
										(match, value) => {
											const themeValue =
												this.props?.themes?.mobileFonts?.[tagName]
													?.fontSize ||
												this.props?.themes?.mobileFonts?.p?.fontSize;
											const newValue = this.compareAndConvertValues(
												value,
												themeValue,
											);
											if (newValue !== value) {
												fontSizeMatch = false;
											}

											return `font-size: ${newValue}`;
										},
									);
								}

								if (
									plainText === mPlainText &&
									tagName === DesktopTagName &&
									fontSizeMatch
								) {
									return updatedSubBlock;
								} else {
									if (tagMatch) {
										if (tagName !== DesktopTagName) {
											let formedContent = `<${DesktopTagName} style="${DesktopStyles}">${contentWithSpace}</${DesktopTagName}>`;
											content = formedContent?.replace(
												/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
												(match, min, vw, max) => {
													const ThemeSize =
														this.props?.themes?.mobileFonts?.[
															DesktopTagName
														]?.fontSize ||
														this.props?.themes?.fonts?.p?.fontSize;
													const ThemeSizeInRem =
														parseFloat(ThemeSize?.replace('px', '')) /
														16;
													return `font-size: ${ThemeSizeInRem}rem`;
												},
											);
										} else if (
											_.includes(styles, 'font-size') &&
											tagName === DesktopTagName
										) {
											content = `<${tagName} style="${styles}">${contentWithSpace}</${tagName}>`;
										} else {
											let formedContent = `<${tagName} style="${styles}">${contentWithSpace}</${tagName}>`;
											content = formedContent?.replace(
												/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
												(match, min, vw, max) => {
													const ThemeSize =
														this.props.themes?.mobileFonts?.[tagName]
															?.fontSize ||
														this.props.themes?.fonts?.p?.fontSize;
													const ThemeSizeInRem =
														parseFloat(ThemeSize?.replace('px', '')) /
														16;
													return `font-size: ${ThemeSizeInRem}rem`;
												},
											);
										}
									} else {
										content = subBlock?.content?.replace(
											/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
											(match, min, vw, max) => {
												const ThemeSize =
													this.props.themes?.mobileFonts?.[tagName]
														?.fontSize ||
													this.props.themes?.fonts?.p?.fontSize;
												const ThemeSizeInRem =
													parseFloat(ThemeSize?.replace('px', '')) / 16;
												return `font-size: ${ThemeSizeInRem}rem`;
											},
										);
									}
								}
								updatedSubBlock.mContent = content;
							} else {
								const tagNameMatch = content.match(/<(\w+)[^>]*>/);
								let tagName = '';
								if (tagNameMatch) {
									tagName = tagNameMatch[1];
									content = content?.replace(
										/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
										(match, min, vw, max) => {
											const ThemeSize =
												this.props.themes?.mobileFonts?.[tagName]
													?.fontSize ||
												this.props.themes?.fonts?.p?.fontSize;
											const ThemeSizeInRem =
												parseFloat(ThemeSize?.replace('px', '')) / 16;
											return `font-size: ${ThemeSizeInRem}rem`;
										},
									);
								} else {
									content = content?.replace(
										/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
										(match, min, vw, max) => {
											const originalFontSize = (parseFloat(max) * 16) / 2;
											const minSizeRem = originalFontSize / 16;
											return `font-size: ${minSizeRem}rem`;
										},
									);
								}

								updatedSubBlock.mContent = content;
							}

							// 	// Replace font sizes in content with mobile-adjusted sizes
						}
						if (subBlock.type === 'button') {
							let content = subBlock.content;
							let contentWithSpace = content
								?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
								?.replace(/\s{3,}/g, '  ')
								?.trim();
							const plainText = content
								?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
								?.replace(/\s+/g, '')
								?.replace(/<input[^>]*>/g, (match) => match.replace(/\s+/g, ''))
								?.trim();
							if (_.has(subBlock, 'mContent')) {
								let mContent = subBlock.mContent;
								let mContentWithSpace = mContent
									?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
									?.replace(/\s{3,}/g, '  ')
									?.trim();
								let mPlainText = mContent
									?.replace(/<\/?(?!br|input|li|strong|em)[a-z][^>]*>/gi, '')
									?.replace(/\s+/g, '')
									?.replace(/<input[^>]*>/g, (match) => match.replace(/\s+/g, ''))
									?.trim();

								const tagMatch = mContent?.match(
									/<(\w+)[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/,
								);
								const tagMatch2 = content?.match(
									/<(\w+)[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/,
								);
								let tagName = tagMatch?.[1] || '';
								let styles = tagMatch?.[2] || '';
								let DesktopTagName = tagMatch2?.[1] || '';
								let DesktopStyles = tagMatch2?.[2] || '';
								let fontSizeMatch = true;

								if (_.includes(styles, 'font-size')) {
									styles = styles.replace(
										/font-size:\s*([^;]+)/g,
										(match, value) => {
											const themeValue =
												this.props?.themes?.mobileFonts?.[tagName]
													?.fontSize ||
												this.props?.themes?.mobileFonts?.p?.fontSize;
											const newValue = this.compareAndConvertValues(
												value,
												themeValue,
											);
											if (newValue !== value) {
												fontSizeMatch = false;
											}

											return `font-size: ${newValue}`;
										},
									);
								}

								if (
									plainText === mPlainText &&
									tagName === DesktopTagName &&
									fontSizeMatch
								) {
									return updatedSubBlock;
								} else {
									if (tagMatch) {
										if (tagName !== DesktopTagName) {
											let formedContent = `<${DesktopTagName}">${contentWithSpace}</${DesktopTagName}>`;
											content = formedContent?.replace(
												/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
												(match, min, vw, max) => {
													const ThemeSize =
														this.props?.themes?.mobileFonts?.[
															DesktopTagName
														]?.fontSize ||
														this.props?.themes?.fonts?.p?.fontSize;
													const ThemeSizeInRem =
														parseFloat(ThemeSize?.replace('px', '')) /
														16;
													return `font-size: ""`;
												},
											);
										} else if (
											_.includes(styles, 'font-size') &&
											tagName === DesktopTagName
										) {
											content = `<${tagName} >${contentWithSpace}</${tagName}>`;
										} else {
											let formedContent = `<${tagName} >${contentWithSpace}</${tagName}>`;
											content = formedContent?.replace(
												/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
												(match, min, vw, max) => {
													const ThemeSize =
														this.props.themes?.mobileFonts?.[tagName]
															?.fontSize ||
														this.props.themes?.fonts?.p?.fontSize;
													const ThemeSizeInRem =
														parseFloat(ThemeSize?.replace('px', '')) /
														16;
													return `font-size: ""`;
												},
											);
										}
									} else {
										content = subBlock?.content?.replace(
											/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
											(match, min, vw, max) => {
												const ThemeSize =
													this.props.themes?.mobileFonts?.[tagName]
														?.fontSize ||
													this.props.themes?.fonts?.p?.fontSize;
												const ThemeSizeInRem =
													parseFloat(ThemeSize?.replace('px', '')) / 16;
												return `font-size: ""`;
											},
										);
									}
								}
								updatedSubBlock.mContent = content;
							} else {
								const tagNameMatch = content.match(/<(\w+)[^>]*>/);
								let tagName = '';
								if (tagNameMatch) {
									tagName = tagNameMatch[1];
									content = content?.replace(
										/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
										(match, min, vw, max) => {
											const ThemeSize =
												this.props.themes?.mobileFonts?.[tagName]
													?.fontSize ||
												this.props.themes?.fonts?.p?.fontSize;
											const ThemeSizeInRem =
												parseFloat(ThemeSize?.replace('px', '')) / 16;
											return `font-size: ""`;
										},
									);
								} else {
									content = content?.replace(
										/font-size:\s*clamp\(([0-9.]+)rem,\s*([0-9.]+)vw\s*,\s*([0-9.]+)rem\)/g,
										(match, min, vw, max) => {
											const originalFontSize = (parseFloat(max) * 16) / 2;
											const minSizeRem = originalFontSize / 16;
											return `font-size: ""`;
										},
									);
								}

								updatedSubBlock.mContent = content;
							}

							// 	// Replace font sizes in content with mobile-adjusted sizes
						}
						return updatedSubBlock;
					});

					return {
						...updatedBlock,
						divStyles: {
							...updatedBlock?.divStyles,
							mGridRows:
								updatedBlock?.divStyles?.mGridRows >= currentRow
									? updatedBlock?.divStyles?.mGridRows
									: currentRow - 1,
						},
					};
				});
			}
			updatedSections.push(updatedSection);
		});
		this.props.saveSections(updatedSections, null);

		this.setState(
			{
				adjustGridAreasTriggerd: true,
			},
			() => {
				setTimeout(() => {
					this.setState({
						adjustGridAreasTriggerd: false,
					});
				}, 3000);
			},
		);
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.props.triggerAdjustGridAreas !== nextProps.triggerAdjustGridAreas) {
			if (nextProps.triggerAdjustGridAreas === true) {
				this.adjustGridAreas();
				this.props.setAdjustGridAreas(false);
			}
		}
		if (this.state.intialGridRows !== nextProps.intialGridRows) {
			this.setState({
				intialGridRows: nextProps.intialGridRows,
			});
		}
		if (this.state.mIntialGridRows !== nextProps.mIntialGridRows) {
			this.setState({
				mIntialGridRows: nextProps.mIntialGridRows,
			});
		}
		if (this.state.fluidShowGrid !== nextProps.fluidShowGrid) {
			this.setState({
				fluidShowGrid: nextProps.fluidShowGrid,
			});
		}
		if (this.state.isLastSection !== nextProps.isLastSection) {
			this.setState({
				isLastSection: nextProps.isLastSection,
			});
		}
		if (this.state._id !== nextProps._id) {
			this.setState({
				_id: nextProps._id,
			});
		}
		if (this.state.previewMode !== nextProps.previewMode) {
			this.setState(
				{
					previewMode: nextProps.previewMode,
				},
				() => {
					if (nextProps.previewMode === 'm') {
						// this.adjustGridAreas();
						this.setState(
							{
								gridCols: 8,
								adjustGridAreasTriggerd: true,
							},
							() => {
								this.adjustGridAreas();
							},
						);
					} else {
						this.setState(
							{
								gridCols: 28,
							},
							() => {},
						);
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
					this.setState({
						gridRows: _.has(nextProps.blocks?.[0]?.divStyles, 'gridRows')
							? this.state.previewType === 'm'
								? nextProps.blocks?.[0]?.divStyles?.mGridRows
								: nextProps.blocks?.[0]?.divStyles?.gridRows
							: 8,
					});
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
			this.setState(
				{
					previewType: nextProps.previewType,
				},
				() => {
					this.getGridRowsCount();
				},
			);
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
		// if (this.state.justifyleft !== nextProps.justifyleft) {
		// 	this.setState({
		// 		justifyleft: nextProps.justifyleft,
		// 	});
		// }
		// if (this.state.justifycenter !== nextProps.justifycenter) {
		// 	this.setState({
		// 		justifycenter: nextProps.justifycenter,
		// 	});
		// }
		// if (this.state.justifyright !== nextProps.justifyright) {
		// 	this.setState({
		// 		justifyright: nextProps.justifyright,
		// 	});
		// }
		// if (this.state.justifyfull !== nextProps.justifyfull) {
		// 	this.setState({
		// 		justifyfull: nextProps.justifyfull,
		// 	});
		// }
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
								setLink: false,
								activeComponentLink: null,
							});
						}
					}
				});
			}
		}
		if (
			this.elementSidebarRef.current &&
			this.elementSidebarRef.current.getSidebarNode && // check if method exists
			!this.elementSidebarRef.current.getSidebarNode().contains(event.target) &&
			!this.state.showImageModal
		) {
			this.setState({
				showSidebar: false,
			});
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
	returnStickerWidth = (id) => {
		let arr = [];
		Object.values(this.boxRefs).forEach((ref, index) => {
			if (ref) {
				if (ref.getAttribute('data-id') === id) {
					arr.push(parseInt(ref.offsetWidth));
				}
			}
		});

		return arr[0];
	};
	returnStickerHeight = (id) => {
		let arr = [];
		Object.values(this.boxRefs).forEach((ref, index) => {
			if (ref) {
				if (ref.getAttribute('data-id') === id) {
					arr.push(parseInt(ref.offsetHeight));
				}
			}
		});

		return arr[0];
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

		const rgbStringToHex = (rgb) => {
			// Extract numbers from the string using regex and convert them to an array of numbers
			// Ensure rgb is a valid string
			if (typeof rgb !== 'string') {
				return '#ececec';
			}

			// Extract numbers from the string using regex
			const matches = rgb.match(/\d+/g);

			// Check if matches exist and contain exactly 3 values (R, G, B)
			// if (!matches || matches.length < 3) {
			// 	return '#ededed';
			// }

			// Convert extracted values to numbers
			const [r, g, b] = matches?.map(Number);

			// Ensure RGB values are within the valid range (0-255)
			if ([r, g, b].some((num) => num < 0 || num > 256)) {
				return '#efefef';
			}

			// Convert RGB to HEX
			const hexValue = `#${((1 << 24) | (r << 16) | (g << 8) | b)
				.toString(16)
				.slice(1)
				.toUpperCase()}`;

			return hexValue;
		};

		let dividerHeight = '100%';
		let dividerWidth = '100%';
		if (properties?.type === 'divider') {
			const dividerMeasurement = this.boxRefs[properties?._id];
			if (dividerMeasurement) {
				dividerHeight = dividerMeasurement.clientHeight || '100%';
				dividerWidth = dividerMeasurement.clientWidth || '100%';
			}
		}
		switch (type) {
			case 'text':
				return (
					<Text
						onChange={(content) => this.handleJoditChange(properties._id, content)}
						onPaste={() => this.handleJoditPaste(properties._id)}
						clientDetails={this.props?.clientDetails}
						isWorkflow={this.props.isWorkflow}
						isFluid={true}
						setTriggerFont={(e) => this.props.setTriggerFont(e)}
						triggerFont={this.state.triggerFont}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state.triggeredFont}
						text={
							this.state.previewType === 'm'
								? _.has(properties, 'mContent')
									? properties.mContent
									: properties.content
								: properties.content
						}
						style={properties.styles}
						//divStyles={properties.divStyles}
						className={properties.className}
						activeFontColor={this.state.activeFontColor}
						refID={header === 'header' ? blockID : concat2}
						reference={header === 'header' ? blockID : properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) => {
							this.setState({
								activeFontSize: e[1],
								activeColor: e[2],
							});
							let newAlign =
								e[3] === 'justify' ? 'justifyfull' : e[3] ? `justify${e[3]}` : '';
							// this.setState(
							// {
							// [newAlign]: true,
							// selectedFontColor: rgbStringToHex(e[2]),
							// },
							// () => {
							this.setAlignmentValues(newAlign);
							this.props.handleBSelection(e, activeTextBlock);
						}}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						setContent={(e, mContent = false) => {
							this.setState({
								followUpBlocks: {},
							});
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								header === 'header' ? null : blockID,
								properties._id,
								mContent,
							);
							// this.autoMobileSave();
						}}
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
						increaseColumnGrid={() =>
							this.handleIncreseColumnGrid(properties._id, true)
						}
						decreaseColumnGrid={() => this.handleDecreaseColumnGrid(properties._id)}
						previewType={this.state.previewType}
						openColorPicker={(e, tab) =>
							this.handleElementEdit(null, properties, true, true, false, tab)
						}
						elementFontColor={this.state?.elementFontColor}
						closeTextPopup={() => {
							const selection = window.getSelection();
							if (selection) {
								selection.removeAllRanges();
							}
							// this.setState({
							// elementFontColor: null,
							// showSidebar: false,
							// });
						}}
						activeSelectedText={this.state.activeSelectedText}
						fluidSublockID={properties._id}
						triggerTextChange={(height, width, activeID, isTrigger) =>
							this.handleTextChangeData(height, width, activeID, isTrigger)
						}
						clientGrandTotal={this.props?.clientGrandTotal || 0}
						openSmartFieldPopup={(e) =>
							this.handleElementEdit(
								null,
								properties,
								true,
								true,
								false,
								false,
								false,
								true,
							)
						}
						currencySymbol={this.props?.currencySymbol}
						themes={this.props?.themes}
						debounceFuncForElementProps={this.props?.debounceFuncForElementProps}
						adjustGridAreasTriggerd={this.state.adjustGridAreasTriggerd}
						verticalAlign={properties?.divStyles?.verticalAlign || ''}
						mobileVerticalAlign={properties?.divStyles?.mobileVerticalAlign || ''}
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
						// ImgOverlayOpacity={properties?.ImgOverlayOpacity}
						ImgOverlayOpacity={parseFloat(properties?.ImgOverlayOpacity) ?? 1}
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
						generateAIImages={(e) => this.props.generateAIImages(e)}
						generateAIText={(e) => this.props.generateAIText(e)}
						isLogo={properties?.isLogo}
						sectionBg={this.state.style?.sectionBackgroundColor}
						isImageEdit={this.state.isImageEdit}
						properties={properties}
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
						setContent={(e) => {
							this.setState({
								followUpBlocks: {},
							});
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								blockID,
								properties._id,
							);
						}}
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
						setTriggerFont={(e) => this.props.setTriggerFont(e)}
						triggerFont={this.state.triggerFont}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						getModuleInfo={(id, type) => this.props.getModuleInfo(id, type)}
						scrollToSection={(id) => this.props.scrollToSection(id)}
						properties={properties}
						client={this.props?.client}
						previewType={this.state.previewType}
						openColorPicker={(e, tab) =>
							this.handleElementEdit(null, properties, true, true, false, tab, true)
						}
						themes={this.props?.themes}
					/>
				);
			case 'sticker':
				return (
					<Sticker
						isFluid={true}
						content={properties.content}
						setContent={(e) => {
							this.setState({
								followUpBlocks: {},
							});
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								blockID,
								properties._id,
							);
						}}
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
						stickerFill={
							properties?.stickerFill
								? properties?.stickerFill
								: this.state.style?.stickerFill
						}
						stickerStroke={
							properties?.stickerStroke
								? properties?.stickerStroke
								: this.state.style?.stickerStroke
						}
						opacity={parseFloat(properties?.shapeOpacity) ?? (properties?.opacity || 1)}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						clearStyling={() => this.props.clearStyle()}
						width={this.returnStickerWidth(properties._id)}
						height={this.returnStickerHeight(properties._id)}
						stretch={properties?.stretch}
						strokeStyles={properties?.strokeStyles || {}}
						shadowStyles={properties?.shadowStyles || {}}
						cornerRadius={properties?.cornerRadius || 0}
						corners={properties?.corners}
						isDiffCorners={properties?.isDiffCorners}
					/>
				);
			case 'shape':
				return (
					<Shape
						isFluid={true}
						isImageEdit={this.state.isImageEdit}
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
						client={this.props.client}
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
						fluidWidth={this.returnStickerWidth(properties._id)}
						fluidHeight={this.returnStickerHeight(properties._id)}
						mImageObjectFit={properties?.mImageObjectFit}
						mobileImageObjectFit={properties?.mobileImageObjectFit}
						properties={properties}
						getModuleInfo={(id, type) => this.props.getModuleInfo(id, type)}
						scrollToSection={(id) => this.props.scrollToSection(id)}
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
						setIconLink={this.state.setIconLink}
						activeComponentLink={this.state.activeComponentLink == properties?._id}
						setModal={() =>
							this.setState({
								setIconLink: false,
								activeComponentLink: null,
							})
						}
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
						customImageUrl={properties?.customImageUrl}
						customImage={properties?.customImage}
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
							if (this.state?.activeType == 'video') {
								this.setState({
									isvalidActiveVideoURL: e,
								});
							}
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
						fillVideoBlock={properties?.fillVideoBlock}
						subBlockID={properties?._id}
						height={this.returnStickerHeight(properties._id)}
						previewType={this.state.previewType}
						videoAltText={properties?.videoAltText || ''}
						// showAltText={properties?.showAltText || false}
						muteVideo={properties?.muteVideo || false}
						client={this.props?.client}
						audioMode={this.props.audioMode}
					/>
				);

			// for journey
			case 'jNumber':
				return (
					<JNumber
						isFluid={true}
						cardColor={cardColor || properties?.cardColor}
						cardBorder={this.hexToRgba(cardColor, 0.2)}
						color={iconColor || properties?.color}
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
						cardColor={cardColor || properties?.cardColor}
						icon={properties?.icon}
						color={iconColor || properties?.color}
						size={properties?.size}
						mSize={properties?.mSize}
						className={properties?.className}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state?.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props?.handleSetTab(e, properties._id, blockID)}
						subBlockID={this.state.subBlockID}
						extraStyles={properties?.extraStyles || {}}
						properties={properties || {}}
						getModuleInfo={(id, type) => this.props.getModuleInfo(id, type)}
						scrollToSection={(id) => this.props.scrollToSection(id)}
						client={this.props.client}
					/>
				);

			case 'loader':
				return <Loader />;
			case 'divider':
				return (
					<Divider
						align={properties?.align || 'center'}
						borderColor={properties?.borderColor || '#121314'}
						borderStyle={properties?.borderStyle || 'arrow'}
						borderWidth={properties?.borderWidth || 1}
						isHorizontal={properties?.isHorizontal || false}
						height={dividerHeight}
						width={dividerWidth}
					/>
				);

			default:
				return (
					<Text
						clientDetails={this.props?.clientDetails}
						currencySymbol={this.props?.currencySymbol}
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
						clientGrandTotal={this.props?.clientGrandTotal || 0}
						client={this.props?.client}
						module={this.props?.module}
						themes={this.props?.themes}
					/>
				);
		}
	};
	isLayoutClick = (e) => {
		return e.target === this.blockRef.current || e.target === this.divRef.current;
	};

	toggleSideBar = (e) => {
		const layoutRect = this.blockRef.current?.getBoundingClientRect();
		if (!layoutRect) return null;

		// Calculate cell dimensions
		const cellWidth = layoutRect.width / this.state.gridCols;
		// const cellHeight = 30;

		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

		let desktopCellHeight = cellWidth / this.state.divideBy;

		this.setState({
			cellHeight: desktopCellHeight,
			cellWidth: cellWidth,
		});

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

		if (this.isLayoutClick(e)) {
			this.setState({
				showBlockActions: true,
				showBlockOptions: true,
			});
		} else {
			// Clicked on a subblock - hide block actions
			this.setState({
				showBlockActions: false,
				showBlockOptions: false,
			});
		}
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
		}
	};
	pasteBlock = (component) => {
		let clipboardData = _.omit(component, ['_id', 'order', 'mContent']);
		let UpdateBlock = [...this.state.blocks];

		let zindexValues = this.getMaxZIndex();
		let [row, col, rowSpan, colSpan] = clipboardData.divStyles.gridArea
			.split('/')
			.map((val) => parseInt(val.trim()));
		let payload = {
			...clipboardData,
			divStyles: {
				..._.omit(clipboardData.divStyles, ['mGridArea']),
				gridArea: `${row + 1} / ${col + 1} / ${rowSpan + 1} / ${colSpan + 1}`,
				zIndex: zindexValues.zIndex + 1,
				mZIndex: zindexValues.mZIndex + 1,
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
					this.autoMobileSave();
					// this.props.handleSaveblocks(this.state.blocks);
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
		// e.stopPropagation();
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

	// 	// Calculate grid cell dimensions
	// 	const cellWidth = layoutRect.width / this.state.gridCols;
	// 	const cellHeight = layoutRect.height / GRID_ROWS;

	// 	// Calculate relative positions
	// 	const relativeLeft = elementRect.left - layoutRect.left;
	// 	const relativeTop = elementRect.top - layoutRect.top;

	// 	// Calculate start positions (using floor to get the starting grid line)
	// 	const columnStart = Math.floor(relativeLeft / cellWidth) + 1;
	// 	const rowStart = Math.floor(relativeTop / cellHeight) + 1;

	// 	// Calculate spans (using ceil to ensure the element fits)
	// 	const elementColSpan = Math.ceil(layoutRect.width - (relativeLeft + elementRect.width));
	// 	const elementRowSpan = Math.ceil(layoutRect.height - (relativeTop + elementRect.height));

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
	// console.log({
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
		e.preventDefault();

		const { hasOverlappingAbove, hasOverlappingBelow, overLappingBlocks } = this.checkOverlap(
			this.state.blocks[0],
			this.state.blocks[0].subBlocks.find((block) => block._id === componentID),
		);

		this.setState(
			{
				initialLayoutHeight: this.state.layoutHeight,
				initialGridRows: this.state.gridRows,
				activeComponentID: componentID,
				initialDragX: data.x,
				initialDragY: data.y,
				followUpBlocks: {},
				overlapOptions: {
					hasOverlappingAbove,
					hasOverlappingBelow,
				},
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
			},
		);

		// Store initial values when resize starts
	};

	handleDragStart = (e, data, k, component) => {
		let intialRows = this.state?.blocks?.[0]?.divStyles?.gridRows;

		this.setState({
			placeholderPosition: {
				gridArea:
					this.state.previewType === 'm'
						? component?.divStyles?.mGridArea
						: component?.divStyles?.gridArea,
			},
		});
		if (
			(data.x !== this.state.initialDragX || data.y !== this.state.initialDragY) &&
			(data.x !== component?.divStyles?.dragX || data.y !== component?.divStyles?.dragY) &&
			(Math.abs(data.x - component?.divStyles?.dragX) > 10 ||
				Math.abs(data.y - component?.divStyles?.dragY) > 10)
		) {
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

			const childRect = this.placeholderRef?.current?.getBoundingClientRect();

			// Calculate the horizontal centers
			const parentCenterX = layoutRect?.left + layoutRect?.width / 2;
			const childCenterX = childRect?.left + childRect?.width / 2;

			// Check if centers align horizontally
			if (Math.abs(parentCenterX - childCenterX) < 1) {
				this.setState({ isCenter: true });
			} else {
				this.setState({ isCenter: false });
			}

			// Calculate grid cell dimensions
			const cellWidth = layoutRect?.width / this.state.gridCols;
			const rowGap = parseInt(this.state?.blocks?.[0]?.divStyles?.rowGap || 0);
			// const rowGap = -9;

			// const cellHeight = 30 + rowGap;
			const cellHeight =
				this.state.previewType === 'm'
					? 30 + rowGap
					: (cellWidth + rowGap) / this.state.divideBy; // Using the same minmax height value from gridTemplateRows

			const totalRows = Math.ceil(layoutRect?.height / cellHeight);

			// Calculate relative positions
			const relativeLeft = elementRect?.left - layoutRect?.left;

			const relativeTop =
				elementRect?.top >= layoutRect?.top
					? elementRect?.top - layoutRect?.top
					: layoutRect?.top - elementRect?.top;

			// Calculate spans
			const widthInCells = Math.round(elementRect?.width / cellWidth);

			let heightInCells = 0;

			if (component?.divStyles) {
				if (this.state.previewType === 'm') {
					heightInCells =
						parseInt(component?.divStyles?.mGridArea.split('/')[2]) -
						parseInt(component?.divStyles?.mGridArea.split('/')[0]);
				} else {
					heightInCells =
						parseInt(component?.divStyles?.gridArea.split('/')[2]) -
						parseInt(component?.divStyles?.gridArea.split('/')[0]);
				}
			}

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
				if ((columnEnd = this.state.gridCols + 1)) {
					columnEnd = this.state.gridCols + 1;
				} else {
					columnEnd = this.state.gridCols;
				}
			}
			// if (columnEnd = this.state.gridCols) {
			// 	columnEnd = columnEnd + 1;
			// }

			let gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;

			if (Math.abs((columnEnd - columnStart) % 2) == 1) {
				if (Math.abs(parentCenterX - childCenterX) < cellWidth) {
					gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd + 1}`;
				}
			}
			if (this.state.gridRows === rowEnd) {
				this.setState({
					gridRows: this.state.gridRows + 1,
					layoutHeight: this.state.layoutHeight + cellHeight,
				});
			}
			// else if (rowEnd < this.state.gridRows && this.state.gridRows > intialRows) {
			// 	this.setState({
			// 		gridRows: this.state.gridRows - 1,
			// 	});
			// }

			this.setState({
				//gridArea,
				drag2X: data.x,
				drag2Y: data.y,
				totalRows,
				placeholderPosition: {
					gridArea,
					mGridArea: gridArea,
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

	handleDragStop = (e, data, component, k) => {
		if (this.state.isDragging == true) {
			const initialX = e.clientX - data.x;
			const initialY = e.clientY - data.y;
			const finalX = e.clientX;
			const finalY = e.clientY;
			const isChanged = initialX !== finalX || initialY !== finalY;
			const currentBlock = [...this.state.blocks][0]?.subBlocks?.find(
				(block) => block._id === component._id,
			);

			if (!isChanged) {
				const { hasOverlappingAbove, hasOverlappingBelow } = this.checkOverlap(
					[...this.state.blocks][0],
					currentBlock,
				);

				this.setState({
					overlapOptions: {
						hasOverlappingAbove,
						hasOverlappingBelow,
					},
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
			_.map([...this.state.blocks], (block, k) => {
				if (k == 0) {
					block.subBlocks[0].divStyles.layoutWidth = this.divRef.current.clientWidth;
					block.subBlocks[0].divStyles.layoutHeight = this.divRef.current.clientHeight;
					if (this.state.previewType === 'm') {
						block.subBlocks[0].divStyles.mGridRows = this.state.mGridRows;
					} else {
						block.subBlocks[0].divStyles.gridRows = this.state.gridRows;
					}
				}
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock?._id == component?._id) {
						type = subBlock.type;
						let gridArea =
							this.state.placeholderPosition !== null &&
							(data.x !== subBlock?.divStyles?.dragX ||
								data.y !== subBlock?.divStyles?.dragY)
								? this.state.placeholderPosition?.gridArea
								: subBlock.divStyles?.gridArea;
						let mGridArea =
							this.state.placeholderPosition !== null &&
							(data.x !== subBlock?.divStyles?.dragX ||
								data.y !== subBlock?.divStyles?.dragY)
								? this.state.placeholderPosition?.gridArea
								: subBlock.divStyles?.gridArea;
						subBlock.divStyles = {
							...subBlock.divStyles,
							...(this.state.previewMode === 'm' ? { mGridArea } : { gridArea }),
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

			const { hasOverlappingAbove, hasOverlappingBelow, overLappingBlocks } =
				this.checkOverlap(activeBlock?.block, activeBlock?.subBlock);

			// if (overLappingBlocks.length === 0) {
			// 	updatedBlocks[0].subBlocks.forEach((subblock) => {
			// 		if (subblock._id === component?._id) {
			// 			subblock.divStyles.zIndex = 0;
			// 		}
			// 	});
			// }

			let updatedLayoutHeight = [...updatedBlocks];
			updatedLayoutHeight[0] = {
				...updatedLayoutHeight[0],
				divStyles: {
					...updatedLayoutHeight[0].divStyles,
					layoutHeight: this.state.layoutHeight,
					...(this.state.previewType === 'm'
						? { mGridRows: this.state.gridRows }
						: { gridRows: this.state.gridRows }),
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
						initialDragX: 0,
						initialDragY: 0,
					});
					// this.autoMobileSave();
					this.props.handleSaveblocks(updatedBlocks);
					// Remove transforms after state update
				},
			);
		}
		// Store the position
		// this.props.setElementPosition(
		// 	elementId,
		// 	this.state.placeholderPosition?.x,
		// 	this.state.placeholderPosition?.y,
		// );
	};

	autoMobileSave = async () => {
		await this.adjustGridAreas();
	};
	doBlocksOverlap = (block1, block2) => {
		// Convert grid positions to numbers
		let gridArea1 =
			this.state.previewType === 'm'
				? block1?.divStyles?.mGridArea
				: block1?.divStyles?.gridArea;
		const [blockLeft1, blockTop1, blockRight1, blockBottom1] = gridArea1?.split('/') || [
			0, 0, 0, 0,
		];
		const b1 = {
			left: parseInt(blockLeft1),
			right: parseInt(blockRight1),
			top: parseInt(blockTop1),
			bottom: parseInt(blockBottom1),
		};

		let gridArea2 =
			this.state.previewType === 'm'
				? block2?.divStyles?.mGridArea
				: block2?.divStyles?.gridArea;
		const [blockLeft2, blockTop2, blockRight2, blockBottom2] = gridArea2?.split('/') || [
			0, 0, 0, 0,
		];

		const b2 = {
			left: parseInt(blockLeft2),
			right: parseInt(blockRight2),
			top: parseInt(blockTop2),
			bottom: parseInt(blockBottom2),
		};

		// Check if there's any intersection at all
		const horizontalIntersect = b1.left < b2.right && b1.right > b2.left;
		const verticalIntersect = b1.top < b2.bottom && b1.bottom > b2.top;

		return horizontalIntersect && verticalIntersect;
	};

	checkOverlap = (blocks, component) => {
		blocks = blocks || this.state.blocks[0];
		let hasOverlappingAbove = false;
		let hasOverlappingBelow = false;
		let overLappingBlocks = [];

		const currentIndex = blocks?.subBlocks?.findIndex((item) => item._id === component._id);

		blocks?.subBlocks?.forEach((otherBlock, index) => {
			if (otherBlock._id !== component._id) {
				// Check if blocks overlap
				if (this.doBlocksOverlap(component, otherBlock)) {
					// Determine if the overlapping block is above or below based on z-index
					const currentZIndex =
						this.state.previewType === 'm'
							? component?.divStyles?.mZIndex || 0
							: component?.divStyles?.zIndex || 0;
					const otherZIndex =
						this.state.previewType === 'm'
							? otherBlock?.divStyles?.mZIndex || 0
							: otherBlock?.divStyles?.zIndex || 0;

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

		// console.log(hasOverlappingAbove, hasOverlappingBelow, 'hasOverlappingAbove');

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
			// overlappingBlocks.sort(
			// 	(a, b) =>
			// 		(this.state.previewType === 'm'
			// 			? a?.divStyles?.mZIndex || 0
			// 			: a?.divStyles?.zIndex || 0) -
			// 		(this.state.previewType === 'm'
			// 			? b?.divStyles?.mZIndex || 0
			// 			: b?.divStyles?.zIndex || 0),
			// );

			const currentZIndex =
				this.state.previewType === 'm'
					? currentBlock?.divStyles?.mZIndex || 0
					: currentBlock?.divStyles?.zIndex || 0;

			if (increase) {
				// Get the block with next higher z-index
				const higherBlock = overlappingBlocks?.find(
					(block) =>
						(this.state.previewType === 'm'
							? block?.divStyles?.mZIndex || 0
							: block?.divStyles?.zIndex || 0) > currentZIndex,
				);

				if (higherBlock) {
					// Swap z-indices
					const higherZIndex =
						this.state.previewType === 'm'
							? higherBlock?.divStyles?.mZIndex || 0
							: higherBlock?.divStyles?.zIndex || 0;
					currentBlock.divStyles[this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'] =
						higherZIndex;
					higherBlock.divStyles[this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'] =
						currentZIndex;
				} else if (currentZIndex === 0) {
					// If no higher block and current is 0, increment to 1
					currentBlock.divStyles[
						this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'
					] = 1;
				} else {
					currentBlock.divStyles[this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'] =
						currentZIndex + 1;
				}
			} else {
				// Get the block with next lower z-index
				const lowerBlocks = overlappingBlocks?.filter(
					(block) =>
						(this.state.previewType === 'm'
							? block?.divStyles?.mZIndex || 0
							: block?.divStyles?.zIndex || 0) < currentZIndex,
				);
				const lowerBlock = lowerBlocks[lowerBlocks?.length - 1];

				if (lowerBlock) {
					// Swap z-indices
					const lowerZIndex =
						this.state.previewType === 'm'
							? lowerBlock?.divStyles?.mZIndex || 0
							: lowerBlock?.divStyles?.zIndex || 0;
					currentBlock.divStyles[this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'] =
						lowerZIndex;
					lowerBlock.divStyles[this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'] =
						currentZIndex;
				} else if (currentZIndex === 0) {
					// If no lower block and current is 0, decrement to -1
					currentBlock.divStyles[
						this.state.previewType === 'm' ? 'mZIndex' : 'zIndex'
					] = 1;
				}
			}

			const { hasOverlappingAbove, hasOverlappingBelow } = this.checkOverlap(
				newBlocks,
				currentBlock,
			);
			hasCurrentOverlappingAbove = hasOverlappingAbove;
			hasCurrentOverlappingBelow = hasOverlappingBelow;
		}

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

	updateLayoutDimensions = () => {
		if (this.blockRef.current) {
			const { width, height } = this.blockRef?.current?.getBoundingClientRect();
			this.setState({
				layoutDimensions: { width, height },
			});
		}
	};

	getMinLayoutHeight = (manual = null) => {
		const layoutElement = this.divRef.current.offsetHeight;
		// if (!layoutElement) return 600;
		// //const maxHeight = this.state.layoutHeight;
		// let maxHeight = 0;
		// if (manual) {
		// 	const allDraggableElements = layoutElement.querySelectorAll('.column');

		// 	allDraggableElements.forEach((element) => {
		// 		const rect = element?.getBoundingClientRect();
		// 		maxHeight = Math.max(
		// 			maxHeight,
		// 			rect?.bottom - layoutElement?.getBoundingClientRect()?.top,
		// 		);
		// 	});
		// } else {
		// 	maxHeight = this.state.layoutHeight;
		// }

		// return Math.max(600, maxHeight + 50);
		return layoutElement;
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

		const activeComponent = this.state.blocks[0].subBlocks.find(
			(block) => block._id === this.state.resizingComponentID,
		);

		if (activeComponent?.type === 'text') {
			const textElement = document.querySelector(
				`[data-id="${this.state.resizingComponentID}"] .jodit-wysiwyg`,
			);
			const textHeight = textElement?.scrollHeight || 0;

			const layoutRect = this.blockRef.current?.getBoundingClientRect();
			const cellWidth = layoutRect?.width / this.state.gridCols;
			const columnGap = parseInt(this.state?.blocks?.[0]?.divStyles?.columnGap || 0);
			const cellHeight =
				this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

			const textElementHeightInCells = Math.floor(textHeight / (cellHeight + columnGap));
			const numberOfRows = textElementHeightInCells + 1;

			const gridArea =
				this.state.previewType === 'm'
					? this.state.placeholderPosition?.mGridArea
					: this.state.placeholderPosition?.gridArea;
			const [rowStart, colStart, rowEnd, colEnd] = gridArea
				.split('/')
				.map((n) => parseInt(n));

			const rowDiff = rowEnd - rowStart;
			const difference = numberOfRows - rowDiff;
			const updatedRowEnd = rowEnd + difference || rowEnd;

			if (rowEnd < updatedRowEnd) {
				this.setState(
					{
						placeholderPosition: {
							...this.state.placeholderPosition,
							...(this.state.previewType === 'm'
								? {
										mGridArea: `${rowStart} / ${colStart} / ${updatedRowEnd} / ${colEnd}`,
								  }
								: {
										gridArea: `${rowStart} / ${colStart} / ${updatedRowEnd} / ${colEnd}`,
								  }),
						},
					},
					() => {
						this.setState({
							textError: true,
						});
					},
				);

				return;
			}
		}

		const { activeResizeDirection, initialMousePos, initialDimensions } = this.state;
		const layoutRect = this.blockRef.current?.getBoundingClientRect();

		// Calculate cell dimensions
		const cellWidth = layoutRect.width / this.state.gridCols;
		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

		// Calculate mouse movement in grid cells
		const deltaX = Math.round((e.clientX - initialMousePos.x) / cellWidth);
		const deltaY = Math.round((e.clientY - initialMousePos.y) / cellHeight);

		// Parse current grid area values
		const [rowStart, colStart, rowEnd, colEnd] = (
			this.state.previewMode === 'm'
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
		const [newRowStart, newColStart, newRowEnd, newColEnd] = newGridArea
			?.split('/')
			.map((val) => parseInt(val.trim()));

		if (this.state.gridRows === newRowEnd) {
			this.setState({
				gridRows: this.state.gridRows + 1,
				layoutHeight: this.state.layoutHeight + cellHeight,
			});
		}
		if (this.state.previewMode === 'm' && newColEnd > 9) {
			newGridArea = `${newRowStart} / ${newColStart} / ${newRowEnd} / ${9}`;
		}
		if (this.state.previewMode === 'm' && newRowStart < 1) {
			newGridArea = `${1} / ${newColStart} / ${newRowEnd} / ${newColEnd}`;
		}
		if (this.state.previewMode === 'm' && newColStart < 1) {
			newGridArea = `${newRowStart} / ${1} / ${newRowEnd} / ${newColEnd}`;
		}
		this.setState({
			placeholderPosition: {
				gridArea: newGridArea,
				mGridArea:
					this.state.previewMode === 'm'
						? newGridArea
						: this.state.placeholderPosition?.mGridArea,
			},
			deltaX,
			deltaY,
		});
	};

	handleMobileTextZoom = (e, id) => {
		let updatedBlocks = [];
		_.map(this.state.blocks, (block, index) => {
			_.map(block.subBlocks, (subBlock, index) => {
				if (subBlock._id === id) {
					subBlock.divStyles.mFontSize = e.target.value;
				}
			});
			updatedBlocks.push(block);
		});
		this.setState({
			blocks: updatedBlocks,
		});
		this.autoMobileSave();
		// this.props.handleSaveblocks(updatedBlocks);
	};

	handleResizeEnd = () => {
		// Clean up event
		this.setState({
			textError: false,
		});
		let updatedBlocks = [];
		_.map(this.state.blocks, (block, k) => {
			if (k == 0) {
				block.subBlocks[0].divStyles.layoutWidth = this.divRef.current.clientWidth;
				block.subBlocks[0].divStyles.layoutHeight = this.divRef.current.clientHeight;
				if (this.state.previewType === 'm') {
					block.subBlocks[0].divStyles.mGridRows = this.state.mGridRows;
				} else {
					block.subBlocks[0].divStyles.gridRows = this.state.gridRows;
				}
			}
			_.map(block.subBlocks, (subBlock, index) => {
				if (subBlock._id == this.state.resizingComponentID) {
					let gridArea =
						this.state.placeholderPosition !== null
							? this.state.placeholderPosition?.gridArea
							: subBlock.divStyles?.gridArea;
					let mGridArea =
						this.state.placeholderPosition !== null
							? this.state.placeholderPosition?.mGridArea
							: subBlock.divStyles?.mGridArea;
					subBlock.divStyles = {
						...subBlock.divStyles,
						...(this.state.previewMode === 'm' || this.state.previewType === 'm'
							? { mGridArea }
							: { gridArea }),
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
				...(this.state.previewType === 'm'
					? { mGridRows: this.state.gridRows }
					: { gridRows: this.state.gridRows }),
			},
		};

		this.setState(
			{
				isResizing: false,
				previewGrid: false,
				activeResizeDirection: null,

				deltaX: 0,
				deltaY: 0,
				blocks: updatedLayoutHeight,
			},
			() => {
				this.handleTextResize(updatedLayoutHeight);
			},
		);
	};

	handleTextResize = (updatedLayoutHeight) => {
		const activeComponent = updatedLayoutHeight[0].subBlocks.find(
			(block) => block._id === this.state.resizingComponentID,
		);

		if (activeComponent?.type === 'text') {
			const textElement = document.querySelector(
				`[data-id="${this.state.resizingComponentID}"] .jodit-wysiwyg`,
			);
			const textHeight = textElement?.scrollHeight || 0;

			const layoutRect = this.blockRef.current?.getBoundingClientRect();
			const cellWidth = layoutRect?.width / this.state.gridCols;
			const columnGap = parseInt(updatedLayoutHeight?.[0]?.divStyles?.columnGap || 0);
			const cellHeight =
				this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

			const textElementHeightInCells = Math.floor(textHeight / (cellHeight + columnGap));
			const numberOfRows = textElementHeightInCells + 1;

			let presentgrid =
				this.state.previewType === 'm'
					? _.has(activeComponent, 'divStyles.mGridArea')
						? activeComponent?.divStyles?.mGridArea
						: activeComponent?.divStyles?.gridArea
					: activeComponent?.divStyles?.gridArea;

			const [rowStart, colStart, rowEnd, colEnd] = presentgrid
				.split('/')
				.map((n) => parseInt(n));

			const rowDiff = rowEnd - rowStart;
			const difference = numberOfRows - rowDiff;
			const updatedRowEnd = rowEnd + difference || rowEnd;
			updatedLayoutHeight[0].subBlocks.forEach((subBlock, index) => {
				if (subBlock._id === this.state.resizingComponentID) {
					updatedLayoutHeight[0].subBlocks[index].divStyles = {
						...updatedLayoutHeight[0].subBlocks[index].divStyles,
						...(this.state.previewType === 'm'
							? { mGridArea: `${rowStart}/${colStart}/${updatedRowEnd}/${colEnd}` }
							: { gridArea: `${rowStart}/${colStart}/${updatedRowEnd}/${colEnd}` }),
					};
				}
			});
			if (this.state.previewType === 'm') {
				if (updatedRowEnd >= this.state.mIntialGridRows + 1) {
					updatedLayoutHeight[0].divStyles.mGridRows = updatedRowEnd;
					this.setState({
						mGridRows: updatedRowEnd,
					});
				} else {
					this.setState({
						mGridRows: this.state.mIntialGridRows,
					});
				}
			} else {
				if (updatedRowEnd >= this.state.intialGridRows + 1) {
					updatedLayoutHeight[0].divStyles.gridRows = updatedRowEnd;
					this.setState({
						gridRows: updatedRowEnd,
					});
				} else {
					this.setState({
						gridRows: this.state.intialGridRows,
					});
				}
			}
		}
		this.setState(
			{
				resizingComponentID: null,
				blocks: updatedLayoutHeight,
			},
			() => {
				this.autoMobileSave();
				// this.props.handleSaveblocks(updatedLayoutHeight);
			},
		);
	};

	handleResizeLayout = (e, blockId) => {
		this.setState(
			{
				previewGrid: true,
				initialMouseY: e.clientY, // Store initial mouse position
				layoutResizing: true,
				activeBlockID: blockId,
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
			},
		);

		document.addEventListener('mousemove', this.handleResizeBlock);
		document.addEventListener('mouseup', this.handleResizeStop);
	};

	handleResizeBlock = (e, blockId) => {
		if (!this.state.layoutResizing) return;

		const layoutElement = this.blockRef.current;
		if (!layoutElement) return;
		const layoutRect = layoutElement.getBoundingClientRect();
		const cellWidth = layoutRect.width / this.state.gridCols;
		// const cellHeight = 30;
		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;
		const deltaY = e.clientY - this.state.initialMouseY;
		const layoutHElement = this.divRef.current;
		let bottomPos = [];

		Object.values(this.columnRefs).forEach((ref) => {
			if (ref) {
				bottomPos.push(parseInt(ref.style['grid-row-end']));
			}
		});
		if (Math.abs(deltaY) >= cellHeight) {
			const cellsToAdd = deltaY > 0 ? 1 : -1;
			if (Math.max.apply(Math, bottomPos) - 1 <= this.state.gridRows + cellsToAdd) {
				this.setState({
					layoutHeight: this.state.layoutHeight + cellHeight * cellsToAdd,
					gridRows: this.state.gridRows + cellsToAdd,
					initialMouseY: e.clientY,
				});
			} else {
				this.setState({
					initialMouseY: e.clientY,
				});
			}
		}
	};

	handleResizeStop = () => {
		const updatedBlocks = [...this.state.blocks];

		if (updatedBlocks) {
			if (updatedBlocks[0]._id === this.state.activeBlockID) {
				updatedBlocks[0] = {
					...updatedBlocks[0],
					divStyles: {
						...updatedBlocks[0].divStyles,
						layoutHeight: this.state.layoutHeight,
						...(this.state.previewType === 'm'
							? { mGridRows: this.state.gridRows }
							: { gridRows: this.state.gridRows }),
					},
				};
			}
		}

		this.setState(
			{
				layoutResizing: false,
				previewGrid: false,
				initialMouseY: null,
				blocks: updatedBlocks,
			},
			() => {
				// this.autoMobileSave();
				this.props.handleSaveblocks(updatedBlocks);
			},
		);

		document.removeEventListener('mousemove', this.handleResizeBlock);

		document.removeEventListener('mousemove', this.handleResizeBlock);
		document.removeEventListener('mouseup', this.handleResizeStop);
	};

	getNumberOfRows = () => {
		const totalHeight = Math.max(this.state.layoutHeight, this.getMinLayoutHeight());
		const rowHeight = 30;
		// Your grid row height
		return Math.ceil(totalHeight / rowHeight);
	};
	// colWidth = () => {
	// 	return this.blockRef.current?.getBoundingClientRect()?.width / 50;
	// };
	// colHeight = () => {
	// 	return this.blockRef.current?.getBoundingClientRect()?.height / 50;
	// };
	snapToGrid = (value) => Math.round(value / this.state.gridSize) * this.state.gridSize;

	handleClick = (e, component, k) => {
		const dragElement = e.target;
		const elementRect = dragElement?.getBoundingClientRect();
		const layoutRect = this.blockRef?.current?.getBoundingClientRect();

		// Calculate grid cell dimensions
		const cellWidth = layoutRect.width / this.state.gridCols;
		// const cellHeight = 30; // Using the same minmax height value from gridTemplateRows
		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;
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

		let zindexValues = this.getMaxZIndex();
		let order = this.state.blocks[0]?.subBlocks?.length || 0;
		this.props.handleAddElement(element, zindexValues, order);
	};
	getMaxZIndex = () => {
		if (_.size(this.state.blocks) > 0) {
			if (_.size(this.state.blocks[0].subBlocks) > 0) {
				let zIndex = Math.max(
					...this.state.blocks[0].subBlocks.map((subBlock) => subBlock.divStyles?.zIndex),
				);
				let mZIndex = Math.max(
					...this.state.blocks[0].subBlocks.map(
						(subBlock) => subBlock.divStyles?.mZIndex,
					),
				);
				return { zIndex, mZIndex };
			} else {
				return { zIndex: 0, mZIndex: 0 };
			}
		} else {
			return { zIndex: 0, mZIndex: 0 };
		}
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
				element.text?.toLowerCase().includes(searchTerm),
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
				this.autoMobileSave();
				// this.props.handleSaveblocks(this.state.blocks);
			},
		);
	};

	// group selection functions
	handleGroupSelectionStart = (e) => {
		if (this.props?.client) {
			return;
		}
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

			document.addEventListener('mousemove', this.handleGroupSelectionMove);
			document.addEventListener('mouseup', this.handleGroupSelectionEnd);
		}
	};

	handleGroupSelectionMove = (e) => {
		if (!this.state.selectionBox.isSelecting) return;

		const layoutRect = this.blockRef.current.getBoundingClientRect();
		let endX = e.clientX - layoutRect.left;
		let endY = e.clientY - layoutRect.top;

		// Constrain selection within layout boundaries
		endX = Math.max(0, Math.min(endX, layoutRect.width));
		endY = Math.max(0, Math.min(endY, layoutRect.height));

		this.setState((prevState) => ({
			selectionBox: {
				...prevState.selectionBox,
				endX,
				endY,
			},
		}));

		// Check which components are within selection box
		this.checkGroupSelectedComponents();
	};

	handleGroupSelectionEnd = () => {
		this.setState((prevState) => ({
			selectionBox: {
				...prevState.selectionBox,
				isSelecting: true,
			},
		}));

		document.removeEventListener('mousemove', this.handleGroupSelectionMove);
		document.removeEventListener('mouseup', this.handleGroupSelectionEnd);

		// Calculate the selection box boundaries based on selected components
		if (this.state.selectedComponents.length > 0) {
			const layoutRect = this.blockRef.current.getBoundingClientRect();
			let minLeft = Infinity;
			let minTop = Infinity;
			let maxRight = -Infinity;
			let maxBottom = -Infinity;

			// Find boundaries of all selected components
			this.state.selectedComponents.forEach((id) => {
				const ref = this.boxRefs[id];
				if (!ref) return;

				const componentRect = ref.getBoundingClientRect();
				const relativeRect = {
					left: componentRect.left - layoutRect.left,
					right: componentRect.right - layoutRect.left,
					top: componentRect.top - layoutRect.top,
					bottom: componentRect.bottom - layoutRect.top,
				};

				minLeft = Math.min(minLeft, relativeRect.left);
				minTop = Math.min(minTop, relativeRect.top);
				maxRight = Math.max(maxRight, relativeRect.right);
				maxBottom = Math.max(maxBottom, relativeRect.bottom);
			});

			// Add 10px padding to selection box
			this.setState({
				selectionBox: {
					...this.state.selectionBox,
					startX: Math.max(0, minLeft - 10),
					startY: Math.max(0, minTop - 10),
					endX: Math.min(layoutRect.width, maxRight + 10),
					endY: Math.min(layoutRect.height, maxBottom + 10),
				},
			});
		}

		document.removeEventListener('mousemove', this.handleGroupSelectionMove);
		document.removeEventListener('mouseup', this.handleGroupSelectionEnd);

		if (this.state.selectedComponents.length === 0) {
			this.setState({
				selectionBox: {
					startX: 0,
					startY: 0,
					endX: 0,
					endY: 0,
					isSelecting: false,
				},
			});
		}
	};

	checkGroupSelectedComponents = () => {
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

	handleGroupSelectionBoxDrag = (e, data) => {
		const { x, y } = data;

		// Update selection box position
		this.setState({
			selectionBoxPosition: { x, y },
			previewGrid: true,
			showMultipOptions: true,
		});
		let groupRect = this.groupResizeRef.current.getBoundingClientRect();
		let layoutRect = this.blockRef.current.getBoundingClientRect();

		if (parseInt(groupRect.bottom) >= parseInt(layoutRect.bottom)) {
			this.setState({
				gridRows: this.state.gridRows + 1,
			});
		}

		// Calculate the horizontal centers
		const parentCenterX = layoutRect?.left + layoutRect?.width / 2;
		const childCenterX = groupRect?.left + groupRect?.width / 2;

		// Check if centers align horizontally

		if (Math.abs(parentCenterX - childCenterX) < 6) {
			this.setState({ isCenter: true });
		} else {
			this.setState({ isCenter: false });
		}

		const updatedBlocks = [...this.state.blocks];
		this.state.selectedComponents.forEach((componentId) => {
			updatedBlocks.forEach((block) => {
				block.subBlocks.forEach((subBlock) => {
					if (subBlock._id === componentId) {
						// Update component positions
						this.setState((prevState) => ({
							componentPositions: {
								...prevState.componentPositions,
								[componentId]: {
									x:
										(prevState.componentPositions[componentId]?.x || 0) +
										data.deltaX,
									y:
										(prevState.componentPositions[componentId]?.y || 0) +
										data.deltaY,
								},
							},
						}));
					}
				});
			});
		});
	};

	handleGroupSelectionBoxDragStop = (e, data) => {
		this.setState({
			selectionBoxPosition: { x: 0, y: 0 },
			previewGrid: false,
			showMultipOptions: true,
		});

		const updatedBlocks = this.state.blocks.map((block) => ({
			...block,
			divStyles: {
				...block.divStyles,
				...(this.state.previewMode === 'm'
					? { mGridRows: this.state.gridRows }
					: { gridRows: this.state.gridRows }),
			},
			subBlocks: block.subBlocks.map((subBlock) => {
				if (this.state.selectedComponents.includes(subBlock._id)) {
					const pos = this.state.componentPositions[subBlock._id];
					if (pos) {
						const currentGridArea =
							this.state.previewMode === 'm'
								? subBlock.divStyles.mGridArea || ''
								: subBlock.divStyles.gridArea || '';
						const [currentStartRow, currentStartCol, currentEndRow, currentEndCol] =
							currentGridArea.split('/').map((val) => parseInt(val.trim()));

						const layoutRect = this.blockRef.current.getBoundingClientRect();
						const cellWidth = layoutRect.width / this.state.gridCols;
						// const cellHeight = 30;
						const cellHeight =
							this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

						const deltaGridX = Math.round(pos.x / cellWidth);

						const deltaGridY = Math.round(pos.y / cellHeight);

						const originalWidth = currentEndCol - currentStartCol;
						const newStartCol = Math.max(1, currentStartCol + deltaGridX);
						const newStartRow = Math.max(1, currentStartRow + deltaGridY);
						const newEndCol = newStartCol + originalWidth;
						const newEndRow = currentEndRow + deltaGridY;

						const newGridArea = `${newStartRow}/${newStartCol}/${newEndRow}/${newEndCol}`;

						return {
							...subBlock,
							divStyles: {
								...subBlock.divStyles,
								...(this.state.previewMode === 'm'
									? { mGridArea: newGridArea }
									: { gridArea: newGridArea }),
								dragX: pos.x,
								dragY: pos.y,
							},
						};
					}
				}
				return subBlock;
			}),
		}));

		this.setState(
			{
				blocks: updatedBlocks,
				componentPositions: {},
				selectionBox: {
					...this.state.selectionBox,
					isSelecting: false,
				},
			},
			() => {
				// this.autoMobileSave();
				this.props.handleSaveblocks(updatedBlocks);
			},
		);
	};

	calculateGridPosition = (x, y) => {
		const layoutRect = this.blockRef.current?.getBoundingClientRect();
		if (!layoutRect) return { column: 1, row: 1 };

		// Get cell dimensions based on grid size
		const cellWidth = layoutRect.width / this.state.gridCols;
		// const cellHeight = 30;
		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;
		// Calculate grid positions
		let column = Math.floor(x / cellWidth) + 1;
		let row = Math.floor(y / cellHeight) + 1;

		// Ensure we stay within grid boundaries
		column = Math.max(1, Math.min(column, this.state.gridCols));
		row = Math.max(1, Math.min(row, this.state.gridRows));

		// Get block dimensions from the first block if available
		const blockWidth = this.state.blocks[0]?.subBlocks[0]?.divStyles?.width || cellWidth;
		const blockHeight = this.state.blocks[0]?.subBlocks[0]?.divStyles?.height || cellHeight;

		// Adjust for block dimensions
		if (column + Math.ceil(blockWidth / cellWidth) > this.state.gridCols) {
			column = this.state.gridCols - Math.ceil(blockWidth / cellWidth) + 1;
		}
		if (row + Math.ceil(blockHeight / cellHeight) > this.state.gridRows) {
			row = this.state.gridRows - Math.ceil(blockHeight / cellHeight) + 1;
		}

		return { column, row };
	};

	handleGroupResize = (e) => {
		if (!this.state.isResizing) return;
		this.setState({
			previewGrid: true,
		});

		const { activeResizeDirection, initialMousePos, initialDimensions } = this.state;
		const layoutRect = this.blockRef.current?.getBoundingClientRect();

		// Calculate cell dimensions`
		const cellWidth = layoutRect.width / this.state.gridCols;
		// const cellHeight = 30; // Fixed cell height
		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;
		// Calculate mouse movement in grid cells
		const deltaX = Math.round((e.clientX - initialMousePos.x) / cellWidth);
		const deltaY = Math.round((e.clientY - initialMousePos.y) / cellHeight);

		const [rowStart, colStart, rowEnd, colEnd] = (
			this.state.previewMode === 'm'
				? this.state.placeholderPosition?.mGridArea
				: this.state.placeholderPosition?.gridArea
		)
			?.split('/')
			.map((val) => parseInt(val.trim()));
	};

	handleGroupResizeStart = (e, handle) => {
		e.preventDefault();

		this.setState({
			isResizing: true,
			previewGrid: true,
			activeResizeDirection: handle.direction,
			initialMousePos: {
				x: e.clientX,
				y: e.clientY,
			},
		});

		document.addEventListener('mousemove', this.handleGroupResize);
	};
	handleSetLink = (e) => {
		this.setState({
			setIconLink: true,
			activeComponentLink: e,
		});
	};

	handleElementFollow = (
		id,
		rowEndData,
		updatedBlocks = null,
		incrementFollowUpBlocks = true,
	) => {
		let blocks = updatedBlocks ? updatedBlocks : this.state.blocks;
		blocks.forEach((block, key) => {
			if (key == 0) {
				block.subBlocks.forEach((subBlock) => {
					if (subBlock._id === id) {
						let [rowStart, colStart, rowEnd, colEnd] = subBlock.divStyles.gridArea
							.split('/')
							.map((val) => parseInt(val.trim()));

						// for increasing the blocks
						if (rowStart !== rowEndData && incrementFollowUpBlocks) {
							rowStart = Number(rowStart) + 1;
							rowEnd = Number(rowEnd) + 1;
						}
						// for decreasing the blocks
						else if (rowStart !== rowEndData && !incrementFollowUpBlocks) {
							let currentActiveFollowup = this.state.followUpBlocks?.[id];

							let [prevRowStart, prevColStart, prevRowEnd, prevColEnd] =
								currentActiveFollowup.divStyles.gridArea
									.split('/')
									.map((val) => parseInt(val.trim()));

							if (prevRowStart == rowStart && prevRowEnd == rowEnd) {
								rowStart = Number(prevRowStart);
								rowEnd = Number(prevRowEnd);
							} else {
								rowStart = Number(rowStart) - 1;
								rowEnd = Number(rowEnd) - 1;
							}
						}
						subBlock.divStyles.gridArea = `${rowStart}/${colStart}/${rowEnd}/${colEnd}`;
					}
				});
			}
		});

		return blocks;
	};

	handleIncreseColumnGrid = (id, overlaps = false) => {
		let blocks = this.state.blocks;
		let rowEnd;
		blocks.forEach((block, key) => {
			if (key == 0) {
				block.subBlocks.forEach((subBlock) => {
					if (subBlock._id === id) {
						rowEnd = parseInt(subBlock.divStyles.gridArea.split('/')[2]);
						if (this.state.previewType === 'd') {
							subBlock.divStyles.gridArea =
								subBlock?.divStyles?.gridArea?.split('/')[0] +
								'/' +
								subBlock?.divStyles?.gridArea?.split('/')[1] +
								'/' +
								(parseInt(subBlock?.divStyles?.gridArea?.split('/')[2]) +
									parseInt(1)) +
								'/' +
								subBlock?.divStyles?.gridArea?.split('/')[3];
						} else {
							subBlock.divStyles.mGridArea =
								subBlock?.divStyles?.mGridArea?.split('/')[0] +
								'/' +
								subBlock?.divStyles?.mGridArea?.split('/')[1] +
								'/' +
								(parseInt(subBlock?.divStyles?.mGridArea?.split('/')[2]) +
									parseInt(1)) +
								'/' +
								subBlock?.divStyles?.mGridArea?.split('/')[3];
						}
					}
				});
			}
		});

		if (overlaps) {
			let component = blocks[0].subBlocks.find((subBlock) => subBlock._id === id);
			let { overLappingBlocks } = this.checkOverlap(null, component);
			if (overLappingBlocks?.length > 0) {
				overLappingBlocks?.forEach((block) => {
					blocks = this.handleElementFollow(block._id, parseInt(rowEnd));
				});
			}
		}

		let updateFields = {
			blocks,
		};

		// if(rowEnd-1 > this.state.gridRows){
		// 	updateFields.blocks[0].divStyles.gridRows +=1;
		// }
		this.setState(updateFields, () => {
			this.autoMobileSave();
			// this.props.handleSaveblocks(blocks);
		});
	};

	handleDecreaseColumnGrid = (id) => {
		let blocks = this.state.blocks;
		blocks.forEach((block, key) => {
			if (key == 0) {
				block.subBlocks.forEach((subBlock) => {
					if (subBlock._id === id) {
						if (this.state.previewType === 'd') {
							subBlock.divStyles.gridArea =
								subBlock?.divStyles?.gridArea?.split('/')[0] +
								'/' +
								subBlock?.divStyles?.gridArea?.split('/')[1] +
								'/' +
								(parseInt(subBlock?.divStyles?.gridArea?.split('/')[2]) -
									parseInt(1)) +
								'/' +
								subBlock?.divStyles?.gridArea?.split('/')[3];
						} else {
							subBlock.divStyles.mGridArea =
								subBlock?.divStyles?.mGridArea?.split('/')[0] +
								'/' +
								subBlock?.divStyles?.mGridArea?.split('/')[1] +
								'/' +
								(parseInt(subBlock?.divStyles?.mGridArea?.split('/')[2]) -
									parseInt(1)) +
								'/' +
								subBlock?.divStyles?.mGridArea?.split('/')[3];
						}
					}
				});
			}
		});

		this.setState({ blocks }, () => {
			this.autoMobileSave();
			// this.props.handleSaveblocks(blocks);
		});
	};

	handleCopyElements = () => {
		let selectedComponents = this.state.selectedComponents;
		let blocks = [...this.state.blocks];
		blocks.forEach((block, key) => {
			block.subBlocks.forEach((subBlock) => {
				if (selectedComponents.includes(subBlock._id)) {
					let newSubBlock = { ...subBlock };
					newSubBlock._id = ObjectID().toString();
					let blockdata = _.omit(newSubBlock, ['divStyles.mGridArea']);
					block.subBlocks.push(blockdata);
				}
			});
		});
		this.setState({ blocks }, () => {
			this.autoMobileSave();
			// this.props.handleSaveblocks(blocks);
		});
	};
	handleDeleteElements = () => {
		let blocks = [...this.state.blocks];
		blocks.forEach((block, key) => {
			block.subBlocks = block.subBlocks.filter(
				(subBlock) => !this.state.selectedComponents.includes(subBlock._id),
			);
		});
	};

	handleImageObjectFit = (value, component) => {
		let blocks = [...this.state.blocks];
		blocks.forEach((block, key) => {
			block.subBlocks.forEach((subBlock) => {
				if (subBlock._id == component._id) {
					if (this.state.previewType === 'm') {
						subBlock.mobileImageObjectFit = value;
					} else {
						subBlock.mImageObjectFit = value;
					}
				}
			});
		});

		this.setState({ blocks }, () => {
			this.autoMobileSave();
			// this.props.handleSaveblocks(blocks);
		});
	};

	handleElementEdit = (
		e,
		component,
		isEdit = false,
		isText = true,
		section = false,
		tab = 'f',
		buttonText = false,
		openSmartFieldPopup = false,
	) => {
		if (section) {
			this.setState(
				{
					showSidebar: isText,
					activeType: 'card',
					elementEndPosition: { x: 677, y: 69 },
					activePopupComponent: section,
					showPopupInMobile: this.state.previewType === 'm',
				},
				() => {
					if (this.state?.previewType == 'm') {
						this.props?.setShowPopupInMobile(
							this.state?.showPopupInMobile,
							this.state?.activeType,
							this.state?.activePopupComponent,
						);
					}
				},
			);
		} else {
			const gridArea =
				this.state.previewMode === 'm'
					? component?.divStyles?.mGridArea
					: component?.divStyles?.gridArea;

			const [rowStart, colStart, rowEnd, colEnd] = gridArea
				?.split('/')
				.map((val) => parseInt(val.trim()));

			const layoutRect = this.blockRef.current?.getBoundingClientRect();
			const cellWidth = layoutRect ? layoutRect.width / this.state.gridCols : 0;
			const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / 2;

			const endX = colEnd * cellWidth;
			const endY = rowStart * cellHeight - 40;

			let difference = layoutRect.width - endX;

			if (component.type === 'text' && !isEdit) {
				// const textElement = this.boxRefs[component._id]?.querySelector('.jodit-wysiwyg');
				const textElement = this.boxRefs[component._id]?.querySelector('.jodit-wysiwyg');

				if (textElement) {
					const range = document.createRange();
					const selection = window.getSelection();
					range.selectNodeContents(textElement);
					selection.removeAllRanges();
					selection.addRange(range);

					textElement.focus();
				}
				this.setState({
					activeSelectedText: true,
				});
			} else {
				this.setState({
					activeSelectedText: false,
				});
			}

			if (difference > 276) {
				this.setState(
					{
						showSidebar: isText,
						activeType: openSmartFieldPopup
							? 'smartField'
							: buttonText
							? 'text'
							: component.type,
						elementEndPosition: { x: endX, y: endY },
						activePopupComponent: component,
						showPopupInMobile: this.state.previewType === 'm',
						textTab: tab,
					},
					() => {
						if (this.state?.previewType == 'm') {
							this.props?.setShowPopupInMobile(
								this.state?.showPopupInMobile,
								this.state?.activeType,
								this.state?.activePopupComponent,
							);
						}
					},
				);
			} else {
				this.setState(
					{
						showSidebar: isText,
						activeType: openSmartFieldPopup
							? 'smartField'
							: buttonText
							? 'text'
							: component.type,
						elementEndPosition: { x: layoutRect.width - 276, y: endY },
						activePopupComponent: component,
						showPopupInMobile: this.state.previewType === 'm',
						textTab: tab,
					},
					() => {
						if (this.state?.previewType == 'm') {
							this.props?.setShowPopupInMobile(
								this.state?.showPopupInMobile,
								this.state?.activeType,
								this.state?.activePopupComponent,
							);
						}
					},
				);
			}
		}
	};
	handleFontsStyles = (e, f) => {
		this.setState({
			elementFontColor: e,
			activeColor: e,
		});
	};
	debounceFuncForImage = (func, timeout = 800) => {
		if (this.state.debounceCropperValues) {
			clearTimeout(this.state.debounceCropperValues);
		}
		const timeFunction = setTimeout(() => {
			func();
		}, timeout);
		this.setState({
			debounceCropperValues: timeFunction,
		});
	};

	/**
	 * Set the active popup component and optionally call the single block API
	 * @param {Object} value - The value to set the active popup component to
	 * @param {boolean} callSingleBlockApi - Whether to call the single block API
	 */
	setActivePopupComponent = (value, callSingleBlockApi = false) => {
		let newBlocks = [...this.state.blocks];
		newBlocks.map((block) => {
			block.subBlocks.map((subBlock, index) => {
				if (subBlock._id === value._id) {
					block.subBlocks[index] = value;
				}
			});
		});

		if (callSingleBlockApi) {
			this.setState({ blocks: newBlocks, activePopupComponent: value });
			this.props.handleSaveSingleBlock(newBlocks);
		} else {
			this.setState({ blocks: newBlocks, activePopupComponent: value }, () => {
				this.autoMobileSave();
				// this.props.handleSaveblocks(newBlocks);
			});
		}
	};
	setActiveImageSettings = (value) => {
		let newBlocks = [...this.state.blocks];
		newBlocks.map((block) => {
			block.subBlocks.map((subBlock, index) => {
				if (subBlock._id === value._id) {
					block.subBlocks[index] = value;
				}
			});
		});
		this.setState({ blocks: newBlocks, activePopupComponent: value }, () => {
			this.debounceFuncForImage(() => {
				this.props.handleSaveblocks(this.state.blocks);
			}, 1000);
		});
	};

	handleTextChangeData = (height, width, activeID, isTrigger) => {
		if (this.state.adjustGridAreasTriggerd) {
			return;
		}

		let incrementFollowUpBlocks = true;
		let layoutRect = this.blockRef.current?.getBoundingClientRect();

		let removeColumnGap =
			parseInt(this.state.blocks?.[0]?.divStyles?.columnGap) *
			(this.state.previewType === 'm' ? 8 : 0);

		let cellWidth = layoutRect
			? (layoutRect.width - removeColumnGap) /
			  (this.state.previewType === 'm' ? 8 : parseInt(this.state.gridCols))
			: 0;

		// console.log(
		// 	cellWidth,
		// 	parseInt(this.state.blocks?.[0]?.divStyles?.columnGap),
		// 	layoutRect.width,
		// 	'====>karthikHandleTextChangeData',
		// );
		let cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

		const columnGap = parseInt(this.state.blocks?.[0]?.divStyles?.rowGap) || 0;
		let textElementHeightInCells = Math.floor(height / (cellHeight + columnGap));
		let numberOfRows = textElementHeightInCells + 1;

		const textElementData = _.find(this.state.blocks[0]?.subBlocks, { _id: activeID });
		let presentgrid =
			this.state.previewType === 'm'
				? _.has(textElementData, 'divStyles.mGridArea')
					? textElementData?.divStyles?.mGridArea
					: textElementData?.divStyles?.gridArea
				: textElementData?.divStyles?.gridArea;

		const [rowStart, colStart, rowEnd, colEnd] = presentgrid
			?.split('/')
			?.map((val) => parseInt(val.trim()));

		let rowDiff = rowEnd - rowStart;
		let difference = numberOfRows - rowDiff;
		let updatedRowEnd = Math.max(rowStart + numberOfRows, rowStart + 1);
		let updatedBlocks = [...this.state.blocks];

		// Update the current text block's grid area
		updatedBlocks[0].subBlocks.forEach((subBlock, index) => {
			if (subBlock._id === activeID) {
				updatedBlocks[0].subBlocks[index].divStyles = {
					...updatedBlocks[0].subBlocks[index].divStyles,
					...(this.state.previewType === 'm'
						? { mGridArea: `${rowStart}/${colStart}/${updatedRowEnd}/${colEnd}` }
						: { gridArea: `${rowStart}/${colStart}/${updatedRowEnd}/${colEnd}` }),
				};
			}
		});

		if (updatedRowEnd < rowEnd) {
			incrementFollowUpBlocks = false;
		}

		// Find the maximum rowEnd among all blocks (including non-text elements)
		let maxRowEnd = updatedRowEnd;
		updatedBlocks[0].subBlocks.forEach((subBlock) => {
			if (subBlock._id !== activeID) {
				const gridArea =
					this.state.previewType === 'm'
						? subBlock.divStyles?.mGridArea || subBlock.divStyles?.gridArea
						: subBlock.divStyles?.gridArea;
				if (gridArea) {
					const [, , blockRowEnd] = gridArea
						.split('/')
						.map((val) => parseInt(val.trim()));
					maxRowEnd = Math.max(maxRowEnd, blockRowEnd);
				}
			}
		});

		// Update grid rows based on the maximum rowEnd found
		if (this.state.previewType === 'm') {
			updatedBlocks[0].divStyles.mGridRows = maxRowEnd;
			this.setState({ mGridRows: Math.max(maxRowEnd, this.state.mIntialGridRows) });
		} else {
			updatedBlocks[0].divStyles.gridRows = maxRowEnd;
			this.setState({ gridRows: Math.max(maxRowEnd, this.state.intialGridRows) });
		}

		let component = updatedBlocks[0].subBlocks.find((subBlock) => subBlock._id === activeID);
		let { overLappingBlocks } = this.checkOverlap(updatedBlocks[0], component);

		// if (overLappingBlocks?.length > 0) {
		// 	let newFollowUpBlocks = {};
		// 	_.cloneDeep(overLappingBlocks).forEach((block) => {
		// 		if (!this.state?.followUpBlocks?.[block._id]) {
		// 			newFollowUpBlocks[block._id] = _.cloneDeep(block);
		// 		}
		// 	});

		// 	this.setState({
		// 		followUpBlocks: { ...this.state.followUpBlocks, ...newFollowUpBlocks },
		// 	});

		// 	overLappingBlocks?.forEach((block) => {
		// 		updatedBlocks = this.handleElementFollow(
		// 			block._id,
		// 			parseInt(updatedRowEnd),
		// 			updatedBlocks,
		// 			true,
		// 		);
		// 	});
		// } else if (_.size(this.state.followUpBlocks) >= 1 && !incrementFollowUpBlocks) {
		// 	Object.values(this.state.followUpBlocks).forEach((block) => {
		// 		updatedBlocks = this.handleElementFollow(
		// 			block._id,
		// 			parseInt(updatedRowEnd),
		// 			updatedBlocks,
		// 			false,
		// 		);
		// 	});
		// }

		this.setState({ blocks: updatedBlocks });
	};
	//! card popup function
	handleCardPopupProps = (e, debounce = false, isShowGrid = true) => {
		this.setState(
			{
				activePopupComponent: e,
				previewGrid: isShowGrid,
			},
			() => {
				if (debounce) {
					this.props.setActiveSection(e);
				} else {
					this.props.setActiveSection(e);
				}
				setTimeout(() => {
					this.setState({
						previewGrid: false,
					});
				}, 2000);
			},
		);
	};
	debounceFuncForCardProps = (func, delay = 600) => {
		if (this.state?.debounceStateForCardProps) {
			clearTimeout(this.state?.debounceStateForCardProps);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateForCardProps: debounceFunc });
	};
	getDeviceType = () => {
		if (typeof window !== 'undefined') {
			const userAgent = navigator.userAgent || navigator.vendor || window.opera;

			if (/android/i.test(userAgent)) {
				return 'Android';
			}
			if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
				return 'iOS';
			}
		}
		return 'Unknown';
	};

	getHeight = (component, intitalHeight, row) => {
		if (intitalHeight === 'auto') {
			return 'auto';
		}
		const intialCellHeight = this.state.previewType === 'm' ? 30 : intitalHeight;

		let GridArea =
			this.state.previewType === 'm'
				? component.divStyles?.mGridArea?.split('/')
				: component.divStyles?.gridArea?.split('/');
		let difference = GridArea?.[2] - GridArea?.[0];
		let girdRowGap = row?.divStyles?.rowGap || 0;

		const cellHeight =
			this.state.previewType === 'm' && this.getDeviceType() === 'Android'
				? 30
				: this.state.previewType === 'd'
				? intialCellHeight
				: '100%';

		const height = cellHeight * difference;
		let rowHeight = girdRowGap * (difference - 1);
		let totalHeight = height + rowHeight;
		if (component.type === 'text' || component.type === 'sticker') {
			return '100%';
		} else {
			return `${totalHeight}px`;
		}
	};

	updateActiveVariables = (id, value) => {
		this.setState({
			activeVariableID:
				this.state?.activeVariableID === id ? this.state?.activeVariableID : id,
			activeVariableName:
				this.state?.activeVariableName === value ? this.state?.activeVariableName : value,
		});
	};

	// ! global functions for debouncing on popup properties

	handleElementDebounceSave = (value) => {
		let newBlocks = [...this.state.blocks];
		newBlocks.map((block) => {
			block.subBlocks.map((subBlock, index) => {
				if (subBlock._id === value._id) {
					block.subBlocks[index] = value;
				}
			});
		});
		this.setState({ blocks: newBlocks, activePopupComponent: value }, () => {
			this.debounceFuncForElementProps(() => {
				this.autoMobileSave();
				// this.props.handleSaveblocks(this.state.blocks);
			}, 800);
		});
	};
	debounceFuncForElementProps = (func, delay = 600) => {
		if (this.state.debounceStateForElementProps) {
			clearTimeout(this.state.debounceStateForElementProps);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateForElementProps: debounceFunc });
	};
	handleFontAlignment = (e, f, event) => {
		this.setState(
			{
				// [f]: true,
				[event]: true,
				actionType: f,
				actionValue: null,
				triggerFont: true,
			},
			() => {
				this.setAlignmentValues(f);
			},
		);
	};

	// ?animation functions

	// ! animation functions for hover and click

	onMouseLeaveAnime = (component) => {
		if (
			component?.animations?.animeType == 'hover' &&
			this.boxRefs[component?._id]?.classList.contains('rotate')
		) {
			this.boxRefs[component?._id]?.classList.remove('rotate');
			this.boxRefs[component?._id]?.classList.add('reverseRotate');
			setTimeout(() => {
				this.boxRefs[component?._id]?.classList.remove('reverseRotate');
				this.boxRefs[component?._id]?.classList.add('rotate');
			}, 2000);
		} else {
			this.handleHoverNPressAnimations(component, this.boxRefs[component?._id], 'remove');
		}
	};

	// ! animation function for hover
	onHoverAnime = (component) => {
		const animations = component?.animations || {};
		if (animations?.animeType == 'hover' && animations?.adjust == true) {
			this.handleHoverNPressAnimations(component, this.boxRefs[component?._id], 'add');
		}
	};

	// ! animation function for click
	onClickAnime = (component) => {
		const animations = component?.animations || {};
		if (animations?.adjust == true) {
			this.handleHoverNPressAnimations(component, this.boxRefs[component?._id], 'add');
		} else {
			if (animations?.animeName == 'appear') {
				this.boxRefs[component?._id]?.classList.add(`press-out-${animations?.animeName}`);
				setTimeout(() => {
					this.boxRefs[component?._id]?.classList.remove(
						`press-out-${animations?.animeName}`,
					);
				}, 2000);
			} else {
				this.boxRefs[component?._id]?.classList.add(`press-${animations?.animeName}`);
				setTimeout(
					() => {
						this.boxRefs[component?._id]?.classList.remove(
							`press-${animations?.animeName}`,
						);
						this.boxRefs[component?._id]?.classList.add(
							`press-out-${animations?.animeName}`,
						);
						// add remove
						setTimeout(
							() => {
								this.boxRefs[component?._id]?.classList.remove(
									`press-out-${animations?.animeName}`,
								);
							},
							animations?.animeName == 'rotate' ? 3000 : 1500,
						);
					},
					animations?.animeName == 'rotate' ? 3000 : 1500,
				);
			}
		}
	};

	// ! setting alignment
	setAlignmentValues = (f) => {
		if (f === 'justifyright') {
			this.setState({
				justifyleft: false,
				justifycenter: false,
				justifyright: true,
				justifyfull: false,
			});
		} else if (f === 'justifycenter') {
			this.setState({
				justifyleft: false,
				justifycenter: true,
				justifyright: false,
				justifyfull: false,
			});
		} else if (f === 'justifyfull') {
			this.setState({
				justifyleft: false,
				justifycenter: false,
				justifyright: false,
				justifyfull: true,
			});
		} else {
			this.setState({
				justifyleft: true,
				justifycenter: false,
				justifyright: false,
				justifyfull: false,
			});
		}
	};

	// ! function for returning animation classes
	returnAnimationClasses = (component) => {
		if (!component?.animations) return '';

		if (component?.animations?.animePreview == true && !this.props?.client) {
			if (component?.animations?.adjust == true) {
				this.triggerAnimationAdjustments(component, this.boxRefs[component?._id]);
			} else {
				return `${
					component?.animations?.animeType == 'loop'
						? `loop-${component?.animations?.animeName}`
						: component?.animations?.animeType == 'scroll'
						? `scroll-${component?.animations?.animeName}`
						: component?.animations?.animeName
				}`;
			}
		} else {
			if (this.state?.preview == true && this.props?.client == true) {
				if (component?.animations?.animeType == 'loop') {
					if (component?.animations?.adjust == true) {
						this.handleLoopAnimations(component, this.boxRefs[component?._id]);
					} else {
						return `${`loop-${component?.animations?.animeName}`}`;
					}
				} else if (component?.animations?.animeType == 'scroll') {
					if (component?.animations?.adjust == true) {
						this.handleScrollAnimations(component, this.boxRefs[component?._id]);
					} else {
						return `${`scroll-${component?.animations?.animeName}`}`;
					}
				} else if (
					component?.animations?.animeType == 'hover' ||
					component?.animations?.animeType === 'press'
				) {
					if (
						component?.animations?.adjustments?.position === 'into' &&
						!_.has(component, 'initialPositionSet')
					) {
						this.setHoverNPressPosition(this.boxRefs[component?._id], component);
					}
					return '';
				} else {
					return `${
						component?.animations?.animeType == 'hover'
							? `hover-${component?.animations?.animeName}`
							: ''
					}  ${
						component?.animations?.animeType == 'press' &&
						component?.animations?.animeName == 'appear'
							? 'press-appear'
							: ''
					} ${
						component?.animations?.animeType == 'loop'
							? `loop-${component?.animations?.animeName}`
							: ''
					}${
						component?.animations?.animeType == 'scroll'
							? `scroll-${component?.animations?.animeName}`
							: ''
					}`;
				}
			}
		}
	};

	// ! scroll animation logic

	// Modify your ref callback
	handleBoxRef = (component, element) => {
		// Store the ref in boxRefs
		this.boxRefs[component?._id] = element;
		//! If it's a scroll animation, initialize the observer
		// if (this.state?.preview == true && this.props?.client == true) {
		// 	if (element && component?.animations?.animeType === 'scroll') {
		// 		// Cleanup any existing observer for this component
		// 		if (this.observers?.has(component?._id)) {
		// 			this.observers?.get(component?._id)?.disconnect();
		// 		}

		// 		// Create new observer
		// 		const observer = this.initScrollObserver(component, element);
		// 		this.observers?.set(component?._id, observer);
		// 	}
		// }
	};
	initScrollObserver = (component, element) => {
		if (!element || component?.animations?.animeType !== 'scroll') return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Trigger the animation only once
						// this.handleScrollAnimations(component, element, 'add');

						// Disconnect the observer so it doesn't trigger again
						observer.unobserve(entry.target);
						this.observers?.delete(component?._id);
					}
				});
			},
			{ threshold: 0.2, rootMargin: '50px' },
		);
		observer.observe(element);
		return observer;
	};

	triggerAnimationAdjustments = (component, element) => {
		const adjustments = component?.animations?.adjustments || {};
		const animations = component?.animations || {};
		if (!adjustments) return;

		if (element && element.nodeType) {
			if (animations?.animeType == 'loop') {
				this.handleLoopAnimations(component, element);
			} else if (animations?.animeType == 'scroll') {
				this.handleScrollAnimations(component, element);
			} else if (animations?.animeType == 'hover' || animations?.animeType == 'press') {
				this.handleHoverNPressAnimations(component, element, 'add');
			} else {
				return;
			}
		}

		return '';
	};

	//? main loop animation function

	handleLoopAnimations = (component, element) => {
		const adjustments = component?.animations?.adjustments || {};
		const animations = component?.animations || {};
		const animationHandlers = {
			breathe: this.handleLoopBreathe,
			pulse: this.handleLoopPulse,
			spin: this.handleLoopSpin,
			poke: this.handleLoopPoke,
			flash: this.handleLoopFlash,
			swing: this.handleLoopSwing,
			flip: this.handleLoopFlip,
			rubber: this.handleLoopRubber,
			jello: this.handleLoopJello,
			bounce: this.handleLoopBounce,
			wiggle: this.handleLoopWiggle,
			flap: this.handleLoopFlap,
			cross: this.handleLoopCross,
		};
		const handler = animationHandlers[animations?.animeName];
		if (handler && element) {
			handler.call(this, element, adjustments);
		} else if (animations?.animeName) {
			// console.warn(`Unknown animation: ${animations?.animeName}`);
		}
	};
	//? main function for scroll animation

	handleScrollAnimations = (component, element) => {
		const adjustments = component?.animations?.adjustments || {};
		const animations = component?.animations || {};
		const animationHandlers = {
			fade: this.handleScrollFade,
			move: this.handleScrollMove,
			expand: this.handleScrollExpand,
			shrink: this.handleScrollShrink,
			spin: this.handleScrollSpin,
			slide: this.handleScrollSlide,
			blur: this.handleScrollBlur,
			reveal: this.handleScrollReveal,
			'3dspin': this.handleScroll3dSpin,
			fly: this.handleScrollFly,
			turn: this.handleScrollTurn,
			tilt: this.handleScrollTilt,
			stretch: this.handleScrollStretch,
			flip: this.handleScrollFlip,
			parallax: this.handleScrollParallax,
			arc: this.handleScrollArc,
			shape: this.handleScrollShape,
			shutters: this.handleScrollShutters,
		};
		const handler = animationHandlers[animations?.animeName];
		const parentBlock = this.animeBlockParentsRef[component?._id];
		// ! new logic
		if (typeof window !== 'undefined' && handler && element) {
			handler.call(this, element, adjustments, animations?.animePreview, parentBlock);
		} else if (animations?.animeName) {
			// console.warn(`Unknown animation: ${animations?.animeName}`);
		}
		// !previouse logic
		// if (action == 'add' && this.props?.client) {
		// 	if (animations?.adjust == true) {
		// 		if (handler) {
		// 			handler.call(this, element, adjustments, 'add');
		// 		}
		// 	} else {
		// 		element.classList.add(`scroll-${animations?.animeName}`);
		// 	}
		// } else if (action == 'remove' && this.props?.client) {
		// 	if (animations?.adjust == true) {
		// 		if (handler) {
		// 			handler.call(this, element, adjustments, 'remove');
		// 		}
		// 	} else {
		// 		element.classList.remove(`scroll-${animations?.animeName}`);
		// 	}
		// } else {
		// 	if (handler) {
		// 		handler.call(this, element, adjustments, '', preview);
		// 	} else if (animations?.animeName) {
		// 		console.warn(`Unknown animation: ${animations?.animeName}`);
		// 	}
		// }
	};
	// ? main function for Hover and Press animations
	handleHoverNPressAnimations = (component, element, action = 'add') => {
		const animations = component?.animations || {};
		const animationHandlers = {
			easeOut: this.handleEaseInOutAnime,
			easeIn: this.handleEaseInOutAnime,
			skew: this.handleSkewAnime,
			rotate: this.handleRotateAnime,
			move: this.handleMoveAnime,
			appear: this.handleAppearAnime,
		};
		const handler = animationHandlers[animations?.animeName];
		if (typeof window !== 'undefined' && handler && element) {
			handler.call(this, element, component, action, animations?.animePreview);
		} else if (animations?.animeName) {
			// console.warn(`Unknown animation: ${animations?.animeName}`);
		}
	};

	//* various functions for Hover and Press animations

	// ! setting initial position for into Position
	setHoverNPressPosition = (element, component) => {
		const { animations = {} } = component || {};
		const { adjustments = {} } = animations || {};
		setTimeout(() => {
			if (animations?.animeName == 'easeIn' || animations?.animeName == 'easeOut') {
				const scaleValue =
					animations?.animeName == 'easeOut'
						? parseFloat(adjustments?.scale || 1.3)
						: parseFloat(
								parseFloat(adjustments?.scale || 1) /
									(adjustments?.position == 'into' ? 1 : 10),
						  );

				gsap.to(element, {
					scale: scaleValue,
					overwrite: true,
					opacity: 0,
					duration: 0,
					ease: 'power3.Out',
				});
				component.initialPositionSet = true;
			} else if (animations?.animeName == 'skew') {
				const skewValue = parseFloat(adjustments?.skew || 20);
				gsap.to(element, {
					skewX: skewValue,
					opacity: 0,
					overwrite: true,
					duration: 0,
					ease: 'power3.out',
				});
				component.initialPositionSet = true;
			} else if (animations?.animeName == 'rotate') {
				const rotateValue = parseFloat(adjustments?.rotate || 360);

				gsap.to(element, {
					rotation: rotateValue,
					opacity: 0,
					overwrite: true,
					duration: 0,
					ease: 'power3.out',
				});
				component.initialPositionSet = true;
			} else if (animations?.animeName == 'move') {
				const { animeDistance = 150, mDirection = 'top' } = adjustments || {};
				const returnDistance = (direction) => {
					if (direction == 'top' || direction == 'left') {
						return `-${parseFloat(animeDistance || 100)}px`;
					}
					return `${parseFloat(animeDistance || 100)}px`;
				};
				gsap.to(element, {
					y: mDirection == 'top' || mDirection == 'down' ? returnDistance(mDirection) : 0,
					x:
						mDirection == 'left' || mDirection == 'right'
							? returnDistance(mDirection)
							: 0,
					opacity: 0,
					overwrite: true,
					duration: 0,
					ease: 'power3.out',
				});
				component.initialPositionSet = true;
			} else if (animations?.animeName == 'appear') {
				gsap.to(element, {
					opacity: 0,
					overwrite: true,
					duration: 0,
					ease: 'power3.out',
				});
				component.initialPositionSet = true;
			}
		}, 0);

		return '';
	};

	// ! EaseIn and EaseOut animation function
	handleEaseInOutAnime = (element, component, action = 'add', preview = false) => {
		// !function to add and remove animation properties
		const { animations = {} } = component || {};
		const { adjustments = {} } = animations || {};
		const scaleValue =
			animations?.animeName == 'easeOut'
				? parseFloat(adjustments?.scale || 1.3)
				: parseFloat(
						parseFloat(adjustments?.scale || 1) /
							(adjustments?.position == 'into' ? 1 : 10),
				  );
		const add = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					scale: 1,
					opacity: 1,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.out',
				});
			} else {
				gsap.to(element, {
					scale: scaleValue,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.out',
				});
			}
		};
		const remove = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					scale: scaleValue,
					overwrite: true,
					opacity: this.props?.client ? 0 : 1,
					duration:
						adjustments?.position !== 'into' ? adjustments?.animeDuration || 3 : 0,
					ease: 'power3.Out',
				});
			} else {
				gsap.to(element, {
					scale: 1,
					overwrite: true,
					duration: 2,
					ease: 'power3.Out',
				});
			}
		};
		if (animations?.animeType === 'press') {
			if (this.state?.preview && this.props?.client) {
				if (!component?.animations?.isClicked) {
					add();
					component.animations.isClicked = true;
				} else {
					remove();
					component.animations.isClicked = false;
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		} else {
			if (this.state?.preview && this.props?.client) {
				if (action == 'add') {
					add();
				} else if (action == 'remove') {
					remove();
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		}
	};
	// ! Skew animation function
	handleSkewAnime = (element, component, action = 'add', preview = false) => {
		// !function to add and remove animation properties
		const { animations = {} } = component || {};
		const { adjustments = {} } = animations || {};
		const skewValue = parseFloat(adjustments?.skew || 20);
		const add = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					skewX: 0,
					opacity: 1,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.Out',
				});
			} else {
				gsap.to(element, {
					skewX: skewValue,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.out',
				});
			}
		};
		const remove = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					skewX: skewValue,
					overwrite: true,
					opacity: this.props?.client ? 0 : 1,
					duration:
						adjustments?.position !== 'into' ? adjustments?.animeDuration || 3 : 0,
					ease: 'power3.out',
				});
			} else {
				gsap.to(element, {
					skewX: 0,
					overwrite: true,
					duration: 2,
					ease: 'power3.Out',
				});
			}
		};
		if (animations?.animeType === 'press') {
			if (this.state?.preview && this.props?.client) {
				if (!component?.animations?.isClicked) {
					add();
					component.animations.isClicked = true;
				} else {
					remove();
					component.animations.isClicked = false;
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		} else {
			if (this.state?.preview && this.props?.client) {
				if (action == 'add') {
					add();
				} else if (action == 'remove') {
					remove();
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		}
	};
	// ! Rotate animation function
	handleRotateAnime = (element, component, action = 'add', preview = false) => {
		// !function to add and remove animation properties
		const { animations = {} } = component || {};
		const { adjustments = {} } = animations || {};
		const rotateValue = parseFloat(adjustments?.rotate || 360);
		const add = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					rotation: 0,
					opacity: 1,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.Out',
				});
			} else {
				gsap.to(element, {
					rotation: rotateValue,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.out',
				});
			}
		};
		const remove = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					rotation: rotateValue,
					overwrite: true,
					opacity: this.props?.client ? 0 : 1,
					duration:
						adjustments?.position !== 'into' ? adjustments?.animeDuration || 3 : 0,
					ease: 'power3.out',
				});
			} else {
				gsap.to(element, {
					rotation: 0,
					overwrite: true,
					duration: 2,
					ease: 'power3.Out',
				});
			}
		};
		if (animations?.animeType === 'press') {
			if (this.state?.preview && this.props?.client) {
				if (!component?.animations?.isClicked) {
					add();
					component.animations.isClicked = true;
				} else {
					remove();
					component.animations.isClicked = false;
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		} else {
			if (this.state?.preview && this.props?.client) {
				if (action == 'add') {
					add();
				} else if (action == 'remove') {
					remove();
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		}
	};
	// ! Move animation function
	handleMoveAnime = (element, component, action = 'add', preview = false) => {
		// !function to add and remove animation properties
		const { animations = {} } = component || {};
		const { adjustments = {} } = animations || {};
		const { animeDistance = 150, mDirection = 'top' } = adjustments || {};
		const returnDistance = (direction) => {
			if (direction == 'top' || direction == 'left') {
				return `-${parseFloat(animeDistance || 100)}px`;
			}
			return `${parseFloat(animeDistance || 100)}px`;
		};
		const add = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					x: 0,
					y: 0,
					opacity: 1,
					overwrite: true,
					duration: 2,
					ease: 'power3.Out',
				});
			} else {
				gsap.to(element, {
					y: mDirection == 'top' || mDirection == 'down' ? returnDistance(mDirection) : 0,
					x:
						mDirection == 'left' || mDirection == 'right'
							? returnDistance(mDirection)
							: 0,
					overwrite: true,
					duration: adjustments?.animeDuration || 3,
					ease: 'power3.out',
				});
			}
		};
		const remove = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					y: mDirection == 'top' || mDirection == 'down' ? returnDistance(mDirection) : 0,
					x:
						mDirection == 'left' || mDirection == 'right'
							? returnDistance(mDirection)
							: 0,
					overwrite: true,
					opacity: this.props?.client ? 0 : 1,
					duration:
						adjustments?.position !== 'into' ? adjustments?.animeDuration || 3 : 0,
					ease: 'power3.out',
				});
			} else {
				gsap.to(element, {
					x: 0,
					y: 0,
					overwrite: true,
					duration: 2,
					ease: 'power3.Out',
				});
			}
		};
		if (animations?.animeType === 'press') {
			if (this.state?.preview && this.props?.client) {
				if (!component?.animations?.isClicked) {
					add();
					component.animations.isClicked = true;
				} else {
					remove();
					component.animations.isClicked = false;
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		} else {
			if (this.state?.preview && this.props?.client) {
				if (action == 'add') {
					add();
				} else if (action == 'remove') {
					remove();
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		}
	};
	// ! Appear animation function
	handleAppearAnime = (element, component, action = 'add', preview = false) => {
		// !function to add and remove animation properties
		const { animations = {} } = component || {};
		const { adjustments = {} } = animations || {};
		const add = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					opacity: 1,
					overwrite: true,
					duration: adjustments?.opacityDelay || 3,
					ease: 'power3.Out',
				});
			} else {
				gsap.to(element, {
					opacity: 0,
					overwrite: true,
					duration: adjustments?.opacityDelay || 3,
					ease: 'power3.out',
				});
			}
		};
		const remove = () => {
			if (adjustments?.position === 'into') {
				gsap.to(element, {
					overwrite: true,
					opacity: 0,
					// opacity: this.props?.client ? 0 : 1,
					duration: adjustments?.position !== 'into' ? adjustments?.opacityDelay || 3 : 0,
					ease: 'power3.out',
				});
			} else {
				gsap.to(element, {
					opacity: 1,
					overwrite: true,
					duration: 2,
					ease: 'power3.Out',
				});
			}
		};
		if (animations?.animeType === 'press') {
			if (this.state?.preview && this.props?.client) {
				if (!component?.animations?.isClicked) {
					add();
					component.animations.isClicked = true;
				} else {
					remove();
					component.animations.isClicked = false;
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		} else {
			if (this.state?.preview && this.props?.client) {
				if (action == 'add') {
					add();
				} else if (action == 'remove') {
					remove();
				}
			} else if (action == 'add' && preview) {
				if (adjustments?.position === 'into') {
					remove();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						add();
					}, timeout * 1000);

					return '';
				} else {
					add();
					const timeout = parseFloat(adjustments?.animeDuration || 1);
					setTimeout(() => {
						remove();
					}, timeout * 1000);
					return '';
				}
			} else {
				return '';
			}
		}
	};

	//* various functions for loop animations
	// ! breathe loop animation function
	handleLoopBreathe = (element, adjustments) => {
		element.classList.add(
			adjustments?.direction == 'center' ? 'loop-breathe-center' : 'loop-breathe',
		);
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--breathe-x-distance',
			`${adjustments?.direction == 'horizontal' ? adjustments?.animeDistance : '0'}px`,
		);

		element.style.setProperty(
			'--breathe-y-distance',
			`${adjustments?.direction == 'vertical' ? adjustments?.animeDistance : '0'}px`,
		);
		adjustments?.direction == 'center' &&
			element.style.setProperty(
				'--breathe-scale-value',
				`${adjustments?.animeDistance / 100 + 0.5 || 2}`,
			);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove(
					adjustments?.direction == 'center' ? 'loop-breathe-center' : 'loop-breathe',
				);
				element.style.removeProperty('--breathe-x-distance');
				element.style.removeProperty('--breathe-y-distance');
				element.style.removeProperty('--breathe-scale-value');
			}, timeout * 1000);
		}
	};

	// ! pulse loop animation function
	handleLoopPulse = (element, adjustments) => {
		element.classList.add('loop-pulse');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';
		element.style.setProperty(
			'--pulse-intensity-value',
			`${adjustments?.animeIntensity == 0 ? 0.1 : adjustments?.animeIntensity || 1}`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-pulse');
				element.style.removeProperty('--pulse-intensity-value');
			}, timeout * 1000);
		}
	};
	// ! spin loop animation function
	handleLoopSpin = (element, adjustments) => {
		element.classList.add('loop-spin');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		// element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';
		element.style.setProperty(
			'--spin-end-angle',
			`${adjustments?.direction == 'Clockwise' ? '360deg' : '-360deg'}`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-spin');
				element.style.removeProperty('--spin-end-angle');
			}, timeout * 1000);
		}
	};

	// ! poke loop animation function
	handleLoopPoke = (element, adjustments) => {
		element.classList.add('loop-poke');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--poke-x-distance',
			`${adjustments?.direction == 'left' ? '-' : ''}${parseFloat(
				adjustments?.animeIntensity &&
					(adjustments?.direction == 'left' || adjustments?.direction == 'right')
					? 50 * adjustments?.animeIntensity
					: '0',
			)}px`,
		);
		element.style.setProperty(
			'--poke-y-distance',
			`${adjustments?.direction == 'top' ? '-' : ''}${parseFloat(
				adjustments?.animeIntensity &&
					(adjustments?.direction == 'top' || adjustments?.direction == 'bottom')
					? 50 * adjustments?.animeIntensity
					: '0',
			)}px`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-poke');
				element.style.removeProperty('--poke-x-distance');
				element.style.removeProperty('--poke-y-distance');
			}, timeout * 1000);
		}
	};

	// ! flash loop animation function
	handleLoopFlash = (element, adjustments) => {
		element.classList.add('loop-flash');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-flash');
			}, timeout * 1000);
		}
	};

	// ! poke loop animation function
	handleLoopSwing = (element, adjustments) => {
		element.classList.add('loop-swing');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.transformOrigin = `${
			adjustments?.direction
				? adjustments?.direction == 'right'
					? '100% 50%'
					: adjustments?.direction == 'bottom'
					? '50% 100%'
					: adjustments?.direction == 'left'
					? '0% 50%'
					: '50% 0%'
				: '50% 0%'
		}`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--swing-value',
			`${parseFloat(
				adjustments?.animeIntensity ? 25 * adjustments?.animeIntensity : '15',
			)}deg`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-swing');
				element.style.removeProperty('--swing-value');
				element.style.removeProperty('transform-origin');
			}, timeout * 1000);
		}
	};
	// ! flip loop animation function
	handleLoopFlip = (element, adjustments) => {
		element.classList.add('loop-flip');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 2 : 'infinite';
		element.style.setProperty(
			'--flip-Name',
			`${adjustments?.direction == 'horizontal' ? 'Flip' : 'FlipX'}`,
		);
		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-flip');
				element.style.removeProperty('--flip-Name');
			}, timeout * 1000);
		}
	};
	// ! rubber loop animation function
	handleLoopRubber = (element, adjustments) => {
		element.classList.add('loop-rubber');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';
		element.style.setProperty(
			'--rubber-intensity-value',
			`${
				adjustments?.animeIntensity <= 0.5
					? parseFloat(adjustments?.animeIntensity) + 0.3
					: parseFloat(adjustments?.animeIntensity) + 0.2 || 1
			}`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-rubber');
				element.style.removeProperty('--rubber-intensity-value');
			}, timeout * 1000);
		}
	};

	// ! jello loop animation function
	handleLoopJello = (element, adjustments) => {
		element.classList.add('loop-jello');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--jello-skew-value',
			`${parseFloat(
				adjustments?.animeIntensity ? 30 * adjustments?.animeIntensity : '10',
			)}deg`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-jello');
				element.style.removeProperty('--jello-skew-value');
			}, timeout * 1000);
		}
	};

	// ! bounce loop animation function
	handleLoopBounce = (element, adjustments) => {
		element.classList.add('loop-bounce');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';
		element.style.setProperty(
			'--bounce-value',
			`${adjustments?.animeIntensity ? 30 * adjustments?.animeIntensity : 30}px`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-bounce');
				element.style.removeProperty('--bounce-value');
			}, timeout * 1000);
		}
	};

	// ! jello loop animation function
	handleLoopWiggle = (element, adjustments) => {
		element.classList.add('loop-wiggle');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--wiggle-value',
			`${parseFloat(adjustments?.animeIntensity ? 20 * adjustments?.animeIntensity : 15)}deg`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-wiggle');
				element.style.removeProperty('--wiggle-value');
			}, timeout * 1000);
		}
	};

	// ! Flap loop animation function
	handleLoopFlap = (element, adjustments) => {
		element.classList.add('loop-flap');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationDirection = 'alternate';
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--flap-name',
			`${
				adjustments?.direction == 'left' || adjustments?.direction == 'right'
					? 'FlapX'
					: 'FlapY'
			}`,
		);
		element.style.setProperty(
			'--flap-intensity-value',
			`${parseFloat(
				adjustments?.animeIntensity ? 40 * adjustments?.animeIntensity : 22.7,
			)}deg`,
		);
		element.style.setProperty(
			'--flap-origin-value',
			`${
				adjustments?.direction == 'top'
					? '50% 0%'
					: adjustments?.direction == 'bottom'
					? '50% 100%'
					: adjustments?.direction == 'left'
					? '0% 50%'
					: '100% 50%'
			}`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-flap');
				element.style.removeProperty('--flap-name');
				element.style.removeProperty('--flap-intensity-value');
				element.style.removeProperty('--flap-origin-value');
			}, timeout * 1000);
		}
	};

	// ! cross loop animation function
	handleLoopCross = (element, adjustments) => {
		element.classList.add('loop-cross');
		element.style.animationDuration = `${adjustments?.animeDuration || 3}s`;
		element.style.animationTimingFunction = adjustments?.animeEase || 'ease-in-out';
		element.style.animationDelay = `${adjustments?.animeDelay || 0}s`;
		element.style.animationIterationCount =
			!this.state?.preview && !this.props?.client ? 1 : 'infinite';

		element.style.setProperty(
			'--cross-x-distance',
			`${adjustments?.direction == 'left' ? '-' : ''}${
				adjustments?.direction == 'left' || adjustments?.direction == 'right' ? '200' : 0
			}px`,
		);
		element.style.setProperty(
			'--cross-y-distance',
			`${adjustments?.direction == 'top' ? '-' : ''}${
				adjustments?.direction == 'top' || adjustments?.direction == 'bottom' ? '200' : 0
			}px`,
		);

		if (!this.state?.preview && !this.props?.client) {
			const timeout = parseFloat(
				parseFloat(adjustments?.animeDuration || 1) +
					parseFloat(adjustments?.animeDelay || 1),
			);

			setTimeout(() => {
				element.classList.remove('loop-cross');
				element.style.removeProperty('--cross-x-distance');
				element.style.removeProperty('--cross-y-distance');
			}, timeout * 1000);
		}
	};

	// * various functions for scroll animations

	// ! scroll fade animation function
	handleScrollFade = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const add = () => {
			element.classList.add('scroll-fade');
			element.style.setProperty(
				'--starting-opacity',
				`${parseFloat(adjustments?.opacity / 100) || 0}`,
			);
		};
		const remove = () => {
			element.classList.remove('scroll-fade');
			element.style.removeProperty('--starting-opacity');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					element.style.willChange = 'opacity, transform';
					const fadeTween = gsap.fromTo(
						element,
						{
							autoAlpha: parseFloat(adjustments?.opacity / 100) || 0,
							force3D: 'auto',
							backfaceVisibility: 'hidden',
						},
						{
							autoAlpha: 1,
							duration: 1,
							ease: 'none',
							paused: true,
							immediateRender: false,
							overwrite: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							fadeTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll move animation function

	handleScrollMove = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const add = () => {
			element.classList.add('scroll-move');

			let x = '0px';
			let y = '0px';
			const distance = adjustments?.animeDistance || 100;

			switch (adjustments?.direction) {
				case 'left':
					x = `-${distance}px`;
					break;
				case 'right':
					x = `${distance}px`;
					break;
				case 'top':
					y = `-${distance}px`;
					break;
				case 'bottom':
					y = `${distance}px`;
					break;
				default:
					break;
			}

			element.style.setProperty('--breathe-x-distance', x);
			element.style.setProperty('--breathe-y-distance', y);
		};
		const remove = () => {
			element.classList.remove('scroll-move');
			element.style.removeProperty('--breathe-x-distance');
			element.style.removeProperty('--breathe-y-distance');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const direction = adjustments?.direction || 'top';
					const returnDistance = (direction) => {
						if (direction == 'top' || direction == 'left') {
							return `-${parseFloat(adjustments?.animeDistance || 100)}px`;
						}
						return `${parseFloat(adjustments?.animeDistance || 100)}px`;
					};
					element.style.willChange = 'opacity, transform';
					const moveTween = gsap.fromTo(
						element,
						{
							y:
								direction == 'top' || direction == 'bottom'
									? returnDistance(direction)
									: 0,
							x:
								direction == 'left' || direction == 'right'
									? returnDistance(direction)
									: 0,
							autoAlpha: 0,
							force3D: true,
							backfaceVisibility: 'hidden',
						},
						{
							y: 0,
							x: 0,
							autoAlpha: 1,
							duration: 3,
							ease: 'power3.inOut',
							paused: true,
							immediateRender: false,
							overwrite: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							moveTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll Expand animation function
	handleScrollExpand = (
		element,
		adjustments,
		preview = false,
		parent = this.blockRef.current,
	) => {
		// !function to add and remove animation properties
		const { direction = 'center', scale = 1, speed = 1, intensity } = adjustments || {};
		const add = () => {
			const offset = getDirectionOffset(direction, intensity);

			element.style.setProperty('--expand-x', `${offset.x}px`);
			element.style.setProperty('--expand-y', `${offset.y}px`);
			element.style.setProperty('--expand-scale', scale / 100);
			element.style.setProperty('--expand-speed', `${speed}s`);

			element.classList.add('scroll-expand');
		};
		const remove = () => {
			element.classList.remove('scroll-expand');
			element.style.removeProperty('--expand-x');
			element.style.removeProperty('--expand-y');
			element.style.removeProperty('--expand-scale');
			element.style.removeProperty('--expand-speed');
		};
		const getDirectionOffset = (direction, intensity = 600) => {
			switch (direction) {
				case 'From Top':
					return { x: 0, y: -intensity };
				case 'From Bottom':
					return { x: 0, y: intensity };
				case 'From Left':
					return { x: -intensity, y: 0 };
				case 'From Right':
					return { x: intensity, y: 0 };
				case 'From Top Left':
					return { x: -intensity, y: -intensity };
				case 'From Top Right':
					return { x: intensity, y: -intensity };
				case 'From Bottom Left':
					return { x: -intensity, y: intensity };
				case 'From Bottom Right':
					return { x: intensity, y: intensity };
				default:
					return { x: 0, y: 0 };
			}
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					element.style.willChange = 'opacity, transform';
					const expandTween = gsap.fromTo(
						element,
						{
							y: parseFloat(getDirectionOffset(direction, intensity).y) || 100,
							x: parseFloat(getDirectionOffset(direction, intensity).x) || 100,
							autoAlpha: 0,
							scale: parseFloat(scale / 100),

							force3D: true,
							backfaceVisibility: 'hidden',
						},
						{
							y: 0,
							x: 0,
							autoAlpha: 1,
							scale: 1,
							duration: speed || 3,
							ease: 'power3.inOut',
							paused: true,
							immediateRender: false,
							overwrite: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							expandTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};
	// ! scroll shrink animation function
	handleScrollShrink = (
		element,
		adjustments,
		preview = false,
		parent = this.blockRef.current,
	) => {
		// !function to add and remove animation properties
		const { direction = 'center', scale = 2, speed = 1, intensity } = adjustments || {};
		const add = () => {
			const offset = getDirectionOffset(direction, intensity);

			element.style.setProperty('--shrink-x', `${offset.x}px`);
			element.style.setProperty('--shrink-y', `${offset.y}px`);
			element.style.setProperty('--shrink-scale', scale);
			element.style.setProperty('--shrink-speed', `${speed}s`);

			element.classList.add('scroll-shrink');
		};
		const remove = () => {
			element.classList.remove('scroll-shrink');
			element.style.removeProperty('--shrink-x');
			element.style.removeProperty('--shrink-y');
			element.style.removeProperty('--shrink-scale');
			element.style.removeProperty('--shrink-speed');
		};
		const getDirectionOffset = (direction, intensity = 600) => {
			switch (direction) {
				case 'From Top':
					return { x: 0, y: -intensity };
				case 'From Bottom':
					return { x: 0, y: intensity };
				case 'From Left':
					return { x: -intensity, y: 0 };
				case 'From Right':
					return { x: intensity, y: 0 };
				case 'From Top Left':
					return { x: -intensity, y: -intensity };
				case 'From Top Right':
					return { x: intensity, y: -intensity };
				case 'From Bottom Left':
					return { x: -intensity, y: intensity };
				case 'From Bottom Right':
					return { x: intensity, y: intensity };
				default:
					return { x: 0, y: 0 };
			}
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					element.style.willChange = 'opacity, transform';
					const shrinkTween = gsap.fromTo(
						element,
						{
							y: parseFloat(getDirectionOffset(direction, intensity).y) || 100,
							x: parseFloat(getDirectionOffset(direction, intensity).x) || 100,
							autoAlpha: 0,
							scale: parseFloat(scale),

							force3D: 'auto',
							backfaceVisibility: 'hidden',
						},
						{
							y: 0,
							x: 0,
							scale: 1,
							autoAlpha: 1,
							duration: speed || 3,
							ease: 'power3.inOut',
							paused: true,
							immediateRender: false,
							overwrite: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							shrinkTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// !scroll spin animation function
	handleScrollSpin = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const spinCount = adjustments?.spin || 1;
		const scale = adjustments?.scale / 100;
		const direction = adjustments?.direction === 'counter-clockwise' ? -1 : 1;

		const spinDegrees = 360 * spinCount * direction;
		const add = () => {
			element.classList.add('scroll-spin');

			element.style.setProperty('--spin-rotate', `${spinDegrees}deg`);
			element.style.setProperty('--spin-scale', scale);
		};
		const remove = () => {
			element.classList.remove('scroll-spin');
			element.style.removeProperty('--spin-rotate');
			element.style.removeProperty('--spin-scale');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();

					const spinTween = gsap.fromTo(
						element,
						{
							rotation: spinDegrees || 360,
							scale: scale,
						},
						{
							rotate: 0,
							scale: 1,
							duration: 3,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							spinTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};
	// ! scroll slide animation function
	handleScrollSlide = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const add = () => {
			const { direction = '' } = adjustments;

			let translate;
			switch (direction) {
				case 'top':
					translate = 'translateY(-100%)';
					break;
				case 'down':
					translate = 'translateY(100%)';
					break;
				case 'left':
					translate = 'translateX(-100%)';
					break;
				case 'right':
					translate = 'translateX(100%)';
					break;
				default:
					translate = 'translateY(100%)';
			}

			element.style.setProperty('--slide-translate', translate);
			element.classList.add('scroll-slide');
		};
		const remove = () => {
			element.classList.remove('scroll-slide');
			element.style.removeProperty('--slide-translate');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					// element.style.willChange = 'transform';
					const direction = adjustments?.direction || 'top';
					const returnDistance = (direction) => {
						if (direction == 'top' || direction == 'left') {
							return `-${parseFloat(adjustments?.animeDistance || 100)}px`;
						}
						return `${parseFloat(adjustments?.animeDistance || 100)}px`;
					};
					const slideTween = gsap.fromTo(
						element,
						{
							y:
								direction == 'top' || direction == 'down'
									? returnDistance(direction)
									: 0,
							x:
								direction == 'left' || direction == 'right'
									? returnDistance(direction)
									: 0,
						},
						{
							y: 0,
							x: 0,
							duration: 3,
							ease: 'power2.inOut',
							immediateRender: false,
							overwrite: 'auto',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							slideTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll blur animation function
	handleScrollBlur = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties

		const add = () => {
			element.classList.add('scroll-blur');
			element.style.setProperty('--blur-intensity', `${adjustments?.blur}px`);
		};
		const remove = () => {
			element.classList.remove('scroll-blur');
			element.style.removeProperty('--blur-intensity');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();

					const blurTween = gsap.fromTo(
						element,
						{
							filter: `blur(${parseFloat(adjustments?.blur || 10)}px)`,
						},
						{
							filter: 'blur(0px)',
							duration: 1,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							blurTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll reveal animation function
	handleScrollReveal = (
		element,
		adjustments,
		preview = false,
		parent = this.blockRef.current,
	) => {
		// !function to add and remove animation properties
		const clipMap = {
			top: 'inset(100% 0 0 0)',
			bottom: 'inset(0 0 100% 0)',
			left: 'inset(0 100% 0 0)',
			right: 'inset(0 0 0 100%)',
		};

		const clipStart = clipMap[adjustments?.direction || 'top'] || clipMap.top;
		const add = () => {
			element.style.setProperty('--clip-start', clipStart);
			element.classList.add('scroll-reveal');
		};
		const remove = () => {
			element.classList.remove('scroll-reveal');
			element.style.removeProperty('--clip-start');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const revealTween = gsap.fromTo(
						element,
						{
							clipPath: clipStart,
						},
						{
							clipPath: 'inset(0% 0% 0% 0%)',
							duration: 2,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							revealTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll 3dspin animation function
	handleScroll3dSpin = (
		element,
		adjustments,
		preview = false,
		parent = this.blockRef.current,
	) => {
		// !function to add and remove animation properties

		const { rotate = 150, speed = 2 } = adjustments;
		const add = () => {
			element.style.setProperty('--spin-angle', `${rotate}deg`);

			element.classList.add('scroll-3dspin');
			element.style.animationDuration = `${speed}s`;
		};
		const remove = () => {
			element.classList.remove('scroll-3dspin');
			element.style.removeProperty('--spin-angle');
			element.style.animationDuration = '';
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();

					const tl = gsap.timeline({ paused: true });
					tl.fromTo(
						element,
						{
							transformPerspective: 1000,
							rotateX: rotate || 360,
							rotateY: rotate || 360,
							scale: 0.2,
						},
						{
							transformPerspective: 1000,
							rotateX: rotate / 2 || 180,
							rotateY: rotate / 2 || 180,
							scale: 0.6,
							duration: speed || 2,
						},
					).to(element, {
						rotateX: 0,
						rotateY: 0,
						autoAlpha: 1,
						scale: 1,
						duration: speed || 1,
					});
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							tl.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll fly animation function
	handleScrollFly = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties

		const distance = adjustments?.distance || 100;
		const angle = adjustments?.angle || 17;
		const direction = adjustments?.direction || 'right';
		const add = () => {
			element.classList.add('scroll-fly');

			const translate =
				direction === 'left' ? `translateX(-${distance}%)` : `translateX(${distance}%)`;

			const skew = direction === 'left' ? `skewX(${angle}deg)` : `skewX(-${angle}deg)`;

			element.style.setProperty('--fly-translate', translate);
			element.style.setProperty('--fly-skew', skew);
		};
		const remove = () => {
			element.classList.remove('scroll-fly');
			element.style.removeProperty('--fly-translate');
			element.style.removeProperty('--fly-skew');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();

					const translate = direction === 'left' ? -200 : 200;

					const skew = direction === 'left' ? angle : -angle;
					const flyTween = gsap.fromTo(
						element,
						{
							x: translate,
							skewX: skew,
						},
						{
							x: 0,
							skewX: 0,
							duration: 1,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							flyTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};
	// ! scroll Turn animation function

	handleScrollTurn = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties

		const {
			direction = '',
			orientation = '',
			scale = 0.5,
			intensity = 600,
		} = adjustments || {};
		let translateX = direction === 'right' ? intensity : -intensity;
		const add = () => {
			element.classList.add('scroll-turn');

			let rotateZ = orientation === 'Clockwise' ? '-180deg' : '180deg';

			element.style.setProperty('--turn-x', `${translateX}px`);
			element.style.setProperty('--turn-rotate', rotateZ);
			element.style.setProperty('--turn-scale', scale);
		};
		const remove = () => {
			element.classList.remove('scroll-turn');
			element.style.removeProperty('--turn-x');
			element.style.removeProperty('--turn-rotate');
			element.style.removeProperty('--turn-scale');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					element.style.willChange = 'opacity, transform';

					let rotateZ = orientation === 'Clockwise' ? -180 : 180;
					const turnTween = gsap.fromTo(
						element,
						{
							x: translateX,
							z: -200,
							rotationZ: rotateZ,
							scale: parseFloat(scale),
							autoAlpha: 0,
							force3D: 'auto',
							backfaceVisibility: 'hidden',
							transformStyle: 'preserve-3d',
							transformPerspective: 1000,
						},
						{
							x: 0,
							z: 0,
							rotationZ: 0,
							scale: 1,
							autoAlpha: 1,
							duration: 3,
							ease: 'none',
							paused: true,
							immediateRender: false,
							overwrite: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							turnTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll tilt animation function

	handleScrollTilt = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const { speed = 1, direction = 'left' } = adjustments || {};
		const add = () => {
			element.classList.add('scroll-tilt');
			element.style.setProperty('--tilt-speed', `${speed}s`);

			if (direction === 'left') {
				element.style.setProperty('--rotate-y', '25deg');
				element.style.setProperty('--rotate', '-25deg');
			} else {
				element.style.setProperty('--rotate-y', '-25deg');
				element.style.setProperty('--rotate', '25deg');
			}
		};
		const remove = () => {
			element.classList.remove('scroll-tilt');
			element.style.removeProperty('--tilt-speed');
			element.style.removeProperty('--rotate-y');
			element.style.removeProperty('--rotate');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const rotateX = direction === 'left' ? -15 : 15;
					const rotateY = direction === 'left' ? 25 : -25;
					const rotate = direction === 'left' ? -25 : 25;
					const zValue = direction === 'left' ? 50 : -50;

					const tiltTween = gsap.fromTo(
						element,
						{
							z: zValue,
							rotationX: rotateX,
							rotationY: rotateY,
							rotation: rotate,
							scale: 0.95,
							duration: speed,
							transformStyle: 'preserve-3d',
							transformPerspective: 400,
						},
						{
							z: 0,
							rotationX: 0,
							rotationY: 0,
							rotation: 0,
							scale: 1,
							duration: 2,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							tiltTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll stretch animation function
	handleScrollStretch = (
		element,
		adjustments,
		preview = false,
		parent = this.blockRef.current,
	) => {
		// !function to add and remove animation properties
		const scale = parseFloat((adjustments?.scale || 20) / 100);
		const add = () => {
			element.style.setProperty('--stretch-scale', scale);

			element.classList.add('scroll-stretch');
		};
		const remove = () => {
			element.classList.remove('scroll-stretch');
			element.style.removeProperty('--stretch-scale');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();

					const stretchTween = gsap.fromTo(
						element,
						{
							scaleX: 2 - scale,
							scaleY: 1 - scale,
							y: '40%',
							duration: 2,
							transformStyle: 'preserve-3d',
							transformPerspective: 400,
						},
						{
							scaleX: 1,
							scaleY: 1,
							y: 0,
							duration: 2,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							stretchTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll flip animation function
	handleScrollFlip = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const { angle = -360, direction = 'horizontal' } = adjustments || {};

		const add = () => {
			element.classList.add('scroll-flip');

			element.style.setProperty('--flip-angle', `${angle}deg`);

			if (direction === 'vertical') {
				element.style.setProperty('--flip-rotate', `rotateX(calc(${angle}deg * -1))`);
			} else {
				element.style.setProperty('--flip-rotate', `rotateY(calc(${angle}deg * -1))`);
			}
		};
		const remove = () => {
			element.classList.remove('scroll-flip');
			element.style.removeProperty('--flip-angle');
			element.style.removeProperty('--flip-rotate');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const rotateX = direction == 'vertical' ? angle : 0;
					const rotateY = direction == 'horizontal' ? angle : 0;

					const flipTween = gsap.fromTo(
						element,
						{
							rotationY: rotateY,
							rotationX: rotateX,
							scale: 0.95,
							duration: 2,
							transformStyle: 'preserve-3d',
							transformPerspective: 400,
						},
						{
							rotationY: 0,
							rotationX: 0,
							scale: 1,
							duration: 4,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							flipTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// !  scroll parallax animation function

	handleScrollParallax = (
		element,
		adjustments,
		preview = false,
		parent = this.blockRef.current,
	) => {
		// !function to add and remove animation properties

		const add = () => {
			element.classList.add('scroll-parallax');

			const intensity = adjustments?.animeIntensity || 1;

			element.style.setProperty('--parallax-intensity', intensity * -1);
		};
		const remove = () => {
			element.classList.remove('scroll-parallax');
			element.style.removeProperty('--parallax-intensity');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const intensity = parseFloat((adjustments?.animeIntensity || 1) * -1);

					const parallaxTween = gsap.fromTo(
						element,
						{
							y: 259.524 * intensity,
							opacity: 1,
							duration: 2,
							transformStyle: 'preserve-3d',
							transformPerspective: 400,
						},
						{
							y: 0,
							duration: 4,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							parallaxTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};
	// ! scroll arc animation
	handleScrollArc = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties
		const { direction = 'vertical', speed = 6 } = adjustments;
		const add = () => {
			let rotateY = '0deg';
			let rotateX = '0deg';

			if (direction === 'vertical') {
				rotateX = '-55deg';
			} else if (direction === 'horizontal') {
				rotateY = '-55deg';
			}

			element.style.setProperty('--arc-rotate-x', rotateX);
			element.style.setProperty('--arc-rotate-y', rotateY);

			element.classList.add('scroll-arc');
			element.style.animationDuration = `${speed}s`;
		};
		const remove = () => {
			element.classList.remove('scroll-arc');
			element.style.removeProperty('--arc-rotate-x');
			element.style.removeProperty('--arc-rotate-y');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};
		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const arcTween = gsap.fromTo(
						element,
						{
							z: 400,
							rotationX: direction === 'horizontal' ? 0 : -65,
							rotationY: direction === 'horizontal' ? -55 : 0,
							y: direction === 'horizontal' ? 0 : 200,
							x: direction === 'horizontal' ? -200 : 0,
							scale: 1.3,
						},
						{
							z: 0,
							y: 0,
							x: 0,
							rotationX: 0,
							rotationY: 0,
							scale: 1,
							duration: speed || 2,
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							arcTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	// ! scroll shape animation
	handleScrollShape = (element, adjustments, preview = false, parent = this.blockRef.current) => {
		// !function to add and remove animation properties

		const { direction = 'circle', animeIntensity = 1 } = adjustments;
		const add = () => {
			const shapeMap = {
				circle: (int) => ({
					start: 'circle(0% at center)',
					mid: `circle(${50 * int}% at center)`,
					end: `circle(${150 * int}% at center)`,
				}),
				square: (int) => ({
					start: `inset(${50 * int}% round 0%)`,
					mid: `inset(${25 * int}% round 0%)`,
					end: `inset(0% round 0%)`,
				}),
				oval: (int) => ({
					start: `ellipse(${0}% ${0}% at center)`,
					mid: `ellipse(${40 * int}% ${25 * int}% at center)`,
					end: `ellipse(${100 * int}% ${100 * int}% at center)`,
				}),
				diamond: (int) => {
					const mid = Math.min(50 * int, 50);
					return {
						start: `polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%)`,
						mid: `polygon(50% 0%, ${50 + mid}% 50%, 50% ${50 + mid}%, ${
							50 - mid
						}% 50%)`,
						end: `polygon(50% 0%, ${50 + mid}% 50%, 50% ${50 + mid}%, ${
							50 - mid
						}% 50%)`,
					};
				},
			};

			const def = shapeMap[direction]?.(animeIntensity) || shapeMap.circle(animeIntensity);
			element.style.setProperty('--shape-clip-start', def.start);
			element.style.setProperty('--shape-clip-mid', def.mid);
			element.style.setProperty('--shape-clip-end', def.end);

			element.classList.add('scroll-shape');
		};
		const remove = () => {
			element.classList.remove('scroll-shape');
			element.style.removeProperty('--shape-clip-start');
			element.style.removeProperty('--shape-clip-mid');
			element.style.removeProperty('--shape-clip-end');
		};
		let triggerValue = 'start';
		const returnTrigger = () => {
			const { triggerPoint = 'In', animeArea = [0, 0] } = adjustments || {};
			let triggerHook = 0.9;
			if (_.has(adjustments, 'animeArea')) {
				if (animeArea[0] >= 0 && animeArea[1] < 51) {
					triggerValue = 'start';
					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else if (animeArea[0] > 20 && animeArea[1] < 75) {
					triggerValue = 'center';
					triggerHook = this.state?.animeTriggerPoints?.center || 0.6;
				} else if (animeArea[0] > 50 && animeArea[1] > 50) {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			} else {
				if (triggerPoint == 'In') {
					triggerValue = 'start';

					triggerHook = this.state?.animeTriggerPoints?.start || 0.9;
				} else {
					triggerValue = 'end';
					triggerHook = this.state?.animeTriggerPoints?.end || 0.2;
				}
			}
			return triggerHook;
		};

		if (this.state?.preview == true && this.props?.client == true) {
			setTimeout(() => {
				if (this.ScrollMagic) {
					this.controller = new this.ScrollMagic.Controller();
					const shapeMap = {
						circle: {
							start: 'circle(0% at center)',
							end: `circle(150% at center)`,
						},
						square: {
							start: `inset(50% round 0%)`,
							end: `inset(0% round 0%)`,
						},
						oval: {
							start: `ellipse(0% 0% at center)`,
							end: `ellipse(100% 60% at center )`,
						},
						diamond: {
							start: `polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)`,
							end: `polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)`,
						},
					};
					const shapeTween = gsap.fromTo(
						element,
						{
							clipPath: shapeMap[direction]?.start || 'circle(0% at center)',
						},
						{
							clipPath: shapeMap[direction]?.end || `circle(150% at center)`,
							duration: parseFloat(animeIntensity + 1),
							ease: 'none',
							paused: true,
						},
					);
					this.scene = new this.ScrollMagic.Scene({
						triggerElement: parent,
						triggerHook: returnTrigger() || 0.9,
						duration: this?.returnAnimeDuration(triggerValue) || 900,
					})
						.on('progress', (event) => {
							shapeTween.progress(event.progress);
						})
						.addTo(this.controller);
				}
			}, 0);
			return '';
		} else if (preview) {
			add();

			setTimeout(() => {
				remove();
			}, 4000);
			return '';
		} else {
			return '';
		}
	};

	//! scroll shutters animation
	handleScrollShutters = (element, adjustments, preview = false, action = 'add') => {
		if (element._hasPlayedShutterAnimation && action === 'add') {
			return;
		}
		const add = () => {
			const { direction = 'left', parts = 6, stagger = false } = adjustments;
			const animationName = `shutters_${direction}_${parts}_${stagger}`.replace(
				/[^a-zA-Z0-9]/g,
				'_',
			);
			const styleId = `style-${animationName}`;

			// Ensure animation keyframes are created once
			if (!document.getElementById(styleId)) {
				const style = document.createElement('style');
				style.id = styleId;
				let keyframes = '';

				for (let i = 0; i < parts; i++) {
					const delay = stagger ? i * 0.1 : 0;
					keyframes += `
					@keyframes ${animationName}-${i} {
						0% {
							transform: translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${
						direction === 'left' || direction === 'top' ? '0%' : '100%'
					});
						}
						100% {
							transform: translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${
						direction === 'left' || direction === 'top' ? '-100%' : '0%'
					});
						}
					}
				`;
				}

				style.innerHTML = keyframes;
				document.head.appendChild(style);
			}

			// Clear any previous spans
			element.querySelectorAll('.shutter-layer').forEach((el) => el.remove());
			element.style.position = 'relative';
			element.style.overflow = 'hidden';

			// Create shutter overlay spans
			for (let i = 0; i < parts; i++) {
				const span = document.createElement('span');
				span.classList.add('shutter-layer');
				span.style.position = 'absolute';
				span.style.background = '#fff'; // or match the
				// span.style.background = 'rgba(0, 0, 0, 0.6)'; // dark transparent shutter

				span.style.zIndex = 2;
				span.style.animation = `${animationName}-${i} 0.6s ease-in-out forwards`;
				span.style.animationDelay = `${stagger ? i * 0.1 : 0}s`;

				// Dimensions and placement per direction
				if (direction === 'left' || direction === 'right') {
					const width = 100 / parts;
					span.style.width = `${width}%`;
					span.style.height = `100%`;
					span.style.top = 0;
					span.style.left = `${i * width}%`;
				} else {
					const height = 100 / parts;
					span.style.height = `${height}%`;
					span.style.width = `100%`;
					span.style.left = 0;
					span.style.top = `${i * height}%`;
				}

				element.appendChild(span);
			}
		};
		const remove = () => {
			element.querySelectorAll('.shutter-layer').forEach((el) => el.remove());
		};
		if (preview) {
			add();
			const timeout = parseFloat(4);

			setTimeout(() => {
				remove();
			}, timeout * 1000);
		} else if (action == 'add') {
			add();
			element._hasPlayedShutterAnimation = true;
			setTimeout(() => {
				remove();
			}, 4500);
		} else if (action == 'remove' && this.props?.client) {
			remove();
		}
	};

	// returning scroll duration (area to animation)
	returnAnimeDuration = (triggerValue = 'start') => {
		if (triggerValue == 'start') {
			return window?.innerHeight * 1 - 100;
		} else if (triggerValue == 'center') {
			return window?.innerHeight * 1 - 300;
		} else {
			return window?.innerHeight * 1 - 400;
		}
	};
	getZoomScale = () => {
		const screenWidth = window.innerWidth;
		const targetWidth = 420;
		if (screenWidth < targetWidth) {
			return screenWidth / targetWidth;
		}
		return 1;
	};

	render() {
		const deviceType = this.getDeviceType();

		const { width, height } = this.state.layoutDimensions;
		const baseHandleStyle = {
			width: '12px',
			height: '12px',
			backgroundColor: 'white',
			border: '2px solid #2196F3',
			position: 'absolute',
			zIndex: 1,
		};

		const layoutRect = this.blockRef.current?.getBoundingClientRect();
		const cellWidth = layoutRect ? layoutRect.width / this.state.gridCols : 0;
		// const cellHeight = layoutRect ? layoutRect.height / this.state.gridRows : 0;
		const cellHeight = this.state.previewType === 'm' ? 30 : cellWidth / this.state.divideBy;

		return (
			<div
				className={`layout ${this.state.className} ${
					this.state.showBlockActions && 'borderedBlock'
				} `}
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
					// minHeight: `${this.getMinLayoutHeight()}px`,
					// height: `${Math.max(
					// 	this.state.blocks?.[0]?.divStyles?.layoutHeight,
					// 	this.getMinLayoutHeight(),
					// )}px`,
					height: 'fit-content',
					padding: '0px',
					border:
						this.props._id === this.state.activeSectionID
							? '3px solid #79ecc9'
							: 'none',

					...(this.state.previewType === 'm' && deviceType !== 'Android'
						? { zoom: this.getZoomScale() }
						: {}),
					// 	this.state.previewType === 'm' || this.state.previewMode === 'm' ? 0.4 : 1,
				}}
				onClick={(e) => {
					if (!this.props.client) {
						this.toggleSideBar(e);
					}
					this.setState({
						previewGrid: false,
					});
				}}
				onMouseEnter={() => {
					if (this.state.preview !== true) {
						this.setState({ showBlockOptions: true });
					}
					// this.props.fluidGrid(false);
				}}
				onMouseLeave={() => {
					if (this.state.isActiveSection == false) {
						this.setState({ showBlockOptions: false });
					}
				}}
				onMouseDown={(e) =>
					this.props.client == true ? '' : this.handleGroupSelectionStart(e)
				}
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
								loop={this.state?.style?.videoProps?.loop}
								onError={(e) => {
									this.props?.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props?.handleIsValidBgVideoURL(true)}
								playing={true}
								muted={this.state?.style?.videoProps?.muteVideo}
								controls={false}
								playbackRate={2 || this.state?.style?.videoProps?.playbackRate}
							/>
						</div>
					)}

				<div
					className="layout-content"
					style={{
						height: 'fit-content',
						minHeight: 'inherit',
						display:
							this.state.sectionType === 'list'
								? this.state.showHide
									? 'none'
									: 'flex'
								: 'flex',

						padding: this.state.style?.noPadding
							? ''
							: _.has(this.state?.style, 'verticalPadding') &&
							  this.state?.style?.verticalPadding > 0
							? `${this.state?.style?.verticalPadding}px 0px`
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
					this.props.client == false &&
					!disabledModules.includes(this.props.module) ? (
						<div className="block-action-bar">
							{/* <span className="tooltip" onClick={(e) => this.handleBlock(e)}>
								<NewEdit />
								<label className="tooltip-text">Block&nbsp;Settings</label>
							</span> */}
							<span
								className="tooltip"
								onClick={(e) =>
									this.handleElementEdit(e, {}, false, true, this.props?.section)
								}
							>
								<NewEdit />
								<label className="tooltip-text">Block&nbsp;Settings</label>
							</span>
							<span className="tooltip" onClick={(e) => this.handleDuplicate(e)}>
								<NewCopy />
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
								<NewDown />
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
								<NewUp />
								<label className="tooltip-text">Up</label>
							</span>
							{this.props.module === 'form' ? (
								''
							) : (
								<span
									className="tooltip"
									onClick={(e) => this.handleDeleteSection(e)}
								>
									<NewDelete />
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
										onMouseEnter={(e) => {
											// Create a timeout to show the popup after a brief delay
											this.hoverTimeout = setTimeout(() => {
												this.hanldeAddElement(
													e,
													true,
													this.state.sectionID,
												);
												this.toggleSideBar(e);
											}, 300);
										}}
										onMouseLeave={() => {
											// Clear the timeout if mouse leaves before delay
											clearTimeout(this.hoverTimeout);
										}}
										style={{
											left: 'calc(1% + 10px)',
										}}
									>
										Add Block
									</a>
									{/* <p>Search element or " /" to open search on canvas</p> */}
								</div>
							)}

							{this.state.showAddElement && (
								<div
									className="add-element-container"
									ref={this.addElementRef}
									onMouseLeave={() => {
										// Hide the popup when mouse leaves the container
										this.setState({
											showAddElement: false,
											searchQuery: '',
											filteredElements: this.elements,
										});
									}}
								>
									<input
										type="text"
										placeholder="Search Element"
										value={this.state.searchQuery}
										onChange={this.handleSearchElements}
										autoFocus
										className="search-element-input"
									/>
									{(this.state.filteredElements || []).map((element, index) => (
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

							{/* <a
								className="add-block"
								onClick={(e) => this.hanldeAddBlock(e)}
								style={{ right: 'auto', left: 'calc(50% + 10px)' }}
							>
								Add Block
							</a> */}
							<div className="add-block-new-container">
								<div
									// onMouseEnter={() => {
									// 	this.addBlockHoverTimeout = setTimeout(() => {
									// 		this.setState({ showAddBlock: true }, () => {
									// 			this.hanldeAddBlock(this.state.showAddBlock);
									// 		});
									// 	}, 300); // 300ms delay
									// }}
									// onMouseLeave={() => {
									// 	clearTimeout(this.addBlockHoverTimeout);
									// }}

									className="addBlankContainer"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										this.setState({ showAddBlock: true }, () => {
											this.hanldeAddBlock(this.state.showAddBlock);
										});
									}}
								>
									<AddBlock />
									<span className="tooltip-text">Add Layout</span>
								</div>
								<div className="addBlockDividerContainer">
									<div className="addBlockDivider"></div>
								</div>
								<div
									className="addBlankContainer"
									onClick={(e) =>
										this.props.handleAddLayout(
											{ emptyCardOrder: this.props?.index - 0.1 },
											true,
										)
									}
									style={{
										cursor: 'pointer',
										transition: 'color 0.3s ease',
										fontSize: '10px',
										fontWeight: 'bold',
										textAlign: 'center',
										width: '71.8px',
									}}
								>
									{this.state.isElement !== true ? (
										<div className="addBlank">Add Card</div>
									) : (
										''
									)}
								</div>
							</div>
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
							// gridTemplateColumns: `repeat(${this.state.gridCols}, 1fr)`,
							// // gridTemplateRows: `repeat(auto-fill, 50px)`,
							// gridTemplateRows: `repeat(${this.state.gridRows || 24}, 1fr)`,
							gridTemplateColumns: `repeat(${this.state.gridCols}, 1fr)`,
							// gridTemplateRows: `repeat(auto-fill, 50px)`,
							gridTemplateRows:
								this.props.client && this.state.previewType === 'm'
									? `repeat(${
											this.state.gridRows || 8
									  }, minmax(${cellHeight}px, ${
											deviceType === 'Android' ? 'auto' : `${cellHeight}px`
									  }))`
									: `repeat(${this.state.gridRows || 8}, ${
											this.props.client && this.state.previewType === 'd'
												? `minmax(${cellHeight}px, auto)`
												: this.props?.mobile_preview_builder
												? `minmax(45px, ${cellHeight}px)`
												: `${cellHeight}px`
									  })`,
							gridRowGap: `${this.state.blocks?.[0]?.divStyles?.rowGap || 0}px`,
							gridColumnGap: `${this.state.blocks?.[0]?.divStyles?.columnGap || 0}px`,
							width: '100%',
							height: '100%',

							minHeight: 'inherit',
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

						{(this.state.previewGrid || this.state.fluidShowGrid) && (
							<>
								<div
									className="grid-line-vertical"
									style={{
										borderColor: this.state.isCenter ? 'yellow' : 'blue',
									}}
								></div>

								<div
									className="grid-overlay"
									style={{
										position: 'absolute',
										width: '100%',
										height: '100%',
										backgroundColor: 'rgba(255,255,255,0)',
										border: '1px solid #a9a9a9',

										display: 'grid',
										// this.state.previewType === 'm' ? 8 : this.state.gridCols
										gridTemplateColumns: `repeat(${
											this.state.previewType === 'm' ? 8 : this.state.gridCols
										}, 1fr)`,
										gridTemplateRows:
											this.props.client && this.state.previewType === 'm'
												? `repeat(${
														this.state.gridRows || 8
												  }, minmax(${cellHeight}px, ${
														deviceType === 'Android'
															? 'auto'
															: `${cellHeight}px`
												  }))`
												: `repeat(${this.state.gridRows || 8}, ${
														this.props.client &&
														this.state.previewType === 'd'
															? `minmax(${cellHeight}px, auto)`
															: `${cellHeight}px`
												  })`,

										gridRowGap: `${
											this.state.blocks?.[0]?.divStyles?.rowGap || 0
										}px`,
										gridColumnGap: `${
											this.state.blocks?.[0]?.divStyles?.columnGap || 0
										}px`,
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
												border: '1.5px solid #a9a9a9',
												gridColumn: `${(index % this.state.gridCols) + 1}`,
												gridRow: `${
													Math.floor(index / this.state.gridCols) + 1
												}`,
												pointerEvents: 'none',
												backgroundColor: 'rgba(255,255,255,0.2)',
												borderRadius: '6px',
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
										gridArea:
											this.state.previewMode === 'm'
												? this.state?.placeholderPosition?.mGridArea
												: this.state?.placeholderPosition?.gridArea,
										//backgroundColor: 'rgba(59, 130, 246, 0.2)',
										border: '4px solid #79ecc9',
										borderBottom: this.state.textError
											? '4px solid red'
											: '4px solid #79ecc9',
										pointerEvents: 'none',
										zIndex: 999999999999999,

										//width: `${this.state?.placeholderPosition?.width}px`,
										//height: `${this.state?.placeholderPosition?.height}px`,
										//position: 'absolute',
									}}
									ref={this.placeholderRef}
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
													this.state.previewMode === 'm'
														? _.has(component.divStyles, 'mGridArea')
															? component.divStyles.mGridArea
															: component.divStyles?.gridArea ||
															  '1 / 1 / 2 / 2'
														: component.divStyles?.gridArea ||
														  '1 / 1 / 2 / 2',
												...(this.props.client && {
													height:
														this.getHeight(
															component,
															cellHeight,
															row,
														) || 'auto',
												}),
											}}
											ref={(el) => (this.columnRefs[k] = el)}
										>
											<Draggable
												defaultPosition={{ x, y }}
												scale={1}
												disabled={
													this.props.client ||
													this.state.previewMode === 'ml' ||
													this.state.previewType === 'ml'
												}
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
														zIndex: 11,
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
									if (this.state.previewMode == 'm') {
										if (
											_.has(component.divStyles, 'mGridArea') &&
											component.divStyles.mGridArea
										) {
											rowStart = parseInt(
												component.divStyles.mGridArea.split('/')[0],
											);
										} else {
											if (
												_.has(component.divStyles, 'gridArea') &&
												component.divStyles.gridArea
											) {
												rowStart = parseInt(
													component.divStyles.gridArea.split('/')[0],
												);
											}
										}
									} else {
										if (
											_.has(component.divStyles, 'gridArea') &&
											component.divStyles.gridArea
										) {
											rowStart = parseInt(
												component.divStyles.gridArea.split('/')[0],
											);
										}
									}
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
													this.state.previewMode === 'm'
														? _.has(component.divStyles, 'mGridArea')
															? component.divStyles.mGridArea
															: component.divStyles?.gridArea ||
															  '1 / 1 / 2 / 2'
														: component.divStyles?.gridArea ||
														  '1 / 1 / 2 / 2',
												...(this.props.client && {
													height:
														this.getHeight(
															component,
															cellHeight,
															row,
														) || 'auto',
												}),
											}}
											ref={(el) => {
												this.columnRefs[k] = el;
												this.animeBlockParentsRef[component?._id] = el;
											}}
										>
											<Draggable
												bounds={`.${this.state.className}`}
												//	key={k}
												//defaultPosition={{ x, y }}
												scale={1}
												disabled={
													this.props.client ||
													this.state.previewMode === 'ml' ||
													this.state.previewType === 'ml'
												}
												onStart={(e, data) =>
													this.handleDrag(
														e,
														data,
														k,
														dragX,
														dragY,
														this.state.previewMode == 'm'
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
														? '.jodit-wysiwyg, .text-zoom-input'
														: ''
												}
											>
												<div
													onMouseEnter={() => {
														if (
															(this.state?.preview == true ||
																this.props?.client == true) &&
															component?.animations?.animeType ==
																'hover'
														) {
															this.onHoverAnime(component);
														}
													}}
													onMouseLeave={() => {
														if (
															(this.state?.preview == true ||
																this.props?.client == true) &&
															component?.animations?.animeType ==
																'hover'
														) {
															this.onMouseLeaveAnime(component);
														}
													}}
													onClick={(e) => {
														e.stopPropagation();
														if (
															(this.state?.preview == true ||
																this.props?.client == true) &&
															component?.animations?.animeType ==
																'press'
														) {
															this.onClickAnime(component);
														}
													}}
													className={`column  ${this.returnAnimationClasses(
														component,
													)}
														 ${component.listCount && 'listAnimation'} ${
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
														zIndex:
															this.state.previewType === 'm'
																? component?.divStyles?.mZIndex
																: component?.divStyles?.zIndex,
														opacity: this.state.isDragging
															? this.state.activeComponentID !==
															  component?._id
																? 1
																: 0.8
															: 1,
														outline: this.state.isDragging
															? '3px solid #79ecc9'
															: this.state.activeComponentID ===
															  component?._id
															? '3px solid #79ecc9'
															: 'none',
														wordBreak: 'break-word',

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
																	'zIndex',
																	'mZIndex',
															  ])
															: {}),
														...((this.state.isResizing ||
															this.state.isDragging) && {
															background: 'rgba(59, 130, 246, 0.2)',
															opacity: 0.5,
														}),
														display: 'flex',
														flexFlow: 'column',
														// animation: this.state?.showActiveSubBlockAnime ? `${component?.animeName ? component?.animeName : 'none'} 3s infinite` : 'none',
													}}
													key={k}
													// ref={(el) =>
													// 	(this.boxRefs[component?._id] = el)
													// }
													ref={(el) => this.handleBoxRef(component, el)}
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

													{/* show z index values if showZIndexValues is true */}
													{sessionStorage.getItem('showZIndexValues') ===
														'true' && (
														<ShowZIndexValues component={component} />
													)}

													{/* Fluid Block Options Controls overlay options etcc... */}
													{this.state.activeComponentID ===
														component?._id && (
														<FluidBlockOptionsControls
															component={component}
															previewMode={this.state?.previewMode}
															previewType={this.state?.previewType}
															handleDeleteSubBlock={
																this.handleDeleteSubBlock
															}
															handleElementEdit={
																this.handleElementEdit
															}
															handleSetLink={this.handleSetLink}
															pasteBlock={this.pasteBlock}
															adjustZIndex={this.adjustZIndex}
															overlapOptions={
																this.state?.overlapOptions
															}
															client={this.props?.client || false}
														/>
													)}
												</div>
											</Draggable>
										</div>
									);
								}
							});
						})}
						{/* {this.state.isClick &&
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
							)} */}
					</div>
				</div>

				{(
					!this.props.client && this.state.previewType === 'm'
						? 1 == 1
						: (this.state.previewType == 'ml'
								? this.state.preview == true
								: this.state.preview == false) && this.state.showBlockOptions
				) ? (
					<LayoutResizeHandle
						handleResizeLayout={this.handleResizeLayout}
						blocks={this.state.blocks}
					/>
				) : (
					''
				)}

				{/* for sidebar options */}
				{this.state.showSidebar && this.state.previewType !== 'm' && (
					<>
						<ElementSidebar
							ref={this.elementSidebarRef}
							activeType={this.state.activeType}
							elementEndPosition={this.state.elementEndPosition}
							activePopupComponent={this.state.activePopupComponent}
							showPopupInMobile={this.state.showPopupInMobile}
							isvalidActiveVideoURL={this.state.isvalidActiveVideoURL}
							brandColors={this.props?.brandColors}
							isWorkflow={this.props.isWorkflow}
							modules={this.props?.modules}
							module={this.props.module}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							previewType={this.state?.previewType}
							activeSectionID={this.state.activeSectionID}
							activeModuleSections={this.props?.activeModuleSections}
							handleFonts={(e, f) => this.handleFontsStyles(e, f)}
							getModuleSections={(e) => this.props?.getModuleSections(e)}
							setActiveImageSettings={(value) => this.setActiveImageSettings(value)}
							setActivePopupComponent={(value, callSingleBlockApi = false) =>
								this?.setActivePopupComponent(value, callSingleBlockApi)
							}
							setModalRef={(e) => {
								this.setState({
									showImageModal: e,
								});
							}}
							handleCardPopupProps={this.handleCardPopupProps}
							// !for text popup
							textTab={this.state?.textTab}
							fonts={this.props?.fonts}
							fontFamily={this.props?.fontFamily}
							changeFontColor={(e, f, event = null) => {
								if (e == 'align') {
									this.handleFontAlignment(e, f, event);
								} else {
									this.props?.changeFontColor(e, f);
									// this.handleFonts(e, f);
								}
							}}
							activeColor={this.state?.activeColor}
							fontColor={this.props.fontColor}
							fontSize={this.props.fontSize}
							// fontColor={this.state?.elementFontColor}
							// fontSize={this.state?.fontSize}
							justifyleft={this.state.justifyleft}
							justifyright={this.state.justifyright}
							justifycenter={this.state.justifycenter}
							justifyfull={this.state.justifyfull}
							lineHeight={this.props.lineHeight}
							letterSpacing={this.props.letterSpacing}
							//! for smart fields
							smartVariables={this.props?.smartVariables}
							paramsTemplateID={this.props?.paramsTemplateID}
							updateActiveVariables={this.updateActiveVariables}
							// ! debouncing for element props
							handleElementDebounceSave={this.handleElementDebounceSave}
							navBar={this.props.navBar}
							activeFontSize={this.state.activeFontSize}
							// elementFontColor={this.state?.selectedFontColor}
							debounceFuncForElementProps={this.props?.debounceFuncForElementProps}
							handleShowSmartModal={(type, editValue = '') => {
								this.setState(
									{
										showSidebar: false,
									},
									() => {
										this.props?.handleShowSmartModal(type, editValue);
									},
								);
							}}
							handleDeleteVariable={this.props?.handleDeleteVariable}
							handleEditVariable={(e) => {
								this.setState({
									showSidebar: false,
								});
								this.props?.handleEditVariable(e);
							}}
							handleVerticleAlign={this.props?.handleVerticleAlign}
						/>
					</>
				)}

				{/* Add selection box */}
				{this.state.selectionBox.isSelecting && (
					<MultiSelectionComp
						className={this.state?.className}
						selectionBoxPosition={this.state?.selectionBoxPosition}
						handleGroupSelectionBoxDrag={this.handleGroupSelectionBoxDrag}
						handleGroupSelectionBoxDragStop={this.handleGroupSelectionBoxDragStop}
						isResizing={this.state?.isResizing}
						handleCopyElements={this.handleCopyElements}
						handleDeleteElements={this.handleDeleteElements}
						client={this.props?.client || false}
						previewMode={this.state?.previewMode}
						previewType={this.state?.previewType}
						groupResizeRef={this.groupResizeRef}
						selectionBox={this.state?.selectionBox}
					/>
				)}

				{/* Add selection options */}
				{!this.props?.client &&
					this.state.selectionBox.isSelecting &&
					_.size(this.state.selectedComponents) > 0 && (
						<MultiSelectionOptionComp
							selectionBox={this.state?.selectionBox}
							handleCopyElements={this.handleCopyElements}
							handleDeleteElements={this.handleDeleteElements}
						/>
					)}
			</div>
		);
	}
}

export default Layout;
