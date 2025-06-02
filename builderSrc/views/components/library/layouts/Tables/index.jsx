import React, { Component } from 'react';
import './Tables.scss';
import Text from '../../elements/text/index.jsx';

// svgs
import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
import Edit from '../actions/edit.jsx';
import Copy from '../actions/copy.jsx';

//! modal options svgs client side
// import RowUp from '../../svgs/table-svgs/RowUp.svg';
// import RowDown from '../../svgs/table-svgs/RowDown.svg';
// import ColumnLeft from '../../svgs/table-svgs/ColumnLeft.svg';
// import ColumnRight from '../../svgs/table-svgs/ColumnRight.svg';
// import ClearFormatting from '../../svgs/table-svgs/ClearFormat.svg';
// import Duplicate from '../../svgs/table-svgs/Duplicate.svg';
// import DeleteRow from '../../svgs/table-svgs/DeleteRow.svg';

// import RedColor from '../../svgs/table-svgs/RedColor.svg';
// import YellowColor from '../../svgs/table-svgs/YellowColor.svg';
// import BlueColor from '../../svgs/table-svgs/BlueColor.svg';
// import GreenColor from '../../svgs/table-svgs/GreenColor.svg';

// import ShowOption from '../../svgs/table-svgs/ShowOption.svg';

// ! modal options svgs builder side
import { ReactComponent as RowUp } from '../../svgs/table-svgs/RowUp.svg';
import { ReactComponent as RowDown } from '../../svgs/table-svgs/RowDown.svg';
import { ReactComponent as ColumnLeft } from '../../svgs/table-svgs/ColumnLeft.svg';
import { ReactComponent as ColumnRight } from '../../svgs/table-svgs/ColumnRight.svg';
import { ReactComponent as ClearFormatting } from '../../svgs/table-svgs/ClearFormat.svg';
import { ReactComponent as Duplicate } from '../../svgs/table-svgs/Duplicate.svg';
import { ReactComponent as DeleteRow } from '../../svgs/table-svgs/DeleteRow.svg';

import { ReactComponent as RedColor } from '../../svgs/table-svgs/RedColor.svg';
import { ReactComponent as YellowColor } from '../../svgs/table-svgs/YellowColor.svg';
import { ReactComponent as BlueColor } from '../../svgs/table-svgs/BlueColor.svg';
import { ReactComponent as GreenColor } from '../../svgs/table-svgs/GreenColor.svg';

import { ReactComponent as ShowOption } from '../../svgs/table-svgs/ShowOption.svg';
import _ from 'lodash';

const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
class Table extends Component {
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
			// randomString: randomize('A', 5),
			showHide: false,
			activeAnimation: props.activeAnimation,
			animationSpeed: props.animationSpeed,
			animationDirection: props.animationDirection,
			animationType: props.animationType,

			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,

			contractVariables: props.contractVariables,
			socialMediaLinks: props?.socialMediaLinks,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			showOption: false,
			showTableModal: {},
			showColumnOption: null,
			showColumnModal: {},
			section: props.section,
			rowWidth: 0,
			rowHeight: 0,
			showAddRow: false,
			ShowAddColumn: false,
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.rowRef = [];
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
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
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.style !== nextProps.style && nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
			if (_.has(nextProps.style, 'count')) {
				if (this.state.style.count !== nextProps.style.count) {
					setTimeout(
						function () {
							gsap.fromTo(
								'.listAnimation',
								{ opacity: 0 },
								{
									opacity: 1,
									duration: 0.1,
									stagger: 0.1,
									ease: 'power2.out',
								},
							);
						}.bind(this),
						100,
					);
				}
			}
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

		if (this.state.section !== nextProps.section) {
			this.setState({
				section: nextProps.section,
			});
		}
	};

	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);

		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}
		this.CalculateSize();
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	componentDidUpdate = () => {
		this.CalculateSize();
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
		this.setState({
			// showOption:false,
			// showTableModal:{}
		});
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

	handleDuplicate = () => {
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlock(e);
	};

	CalculateSize = (e) => {
		const blockIds = Object.keys(this.rowRef); // Get all keys (block IDs)
		let newWidth = 0;

		for (const id of blockIds) {
			const BlockRef = this.rowRef[id];
			if (BlockRef && BlockRef.offsetWidth) {
				newWidth = BlockRef.offsetWidth;
				break; // Stop after finding the first valid block
			}
		}
		const newHeight = this.state.blocks.reduce((sum, block) => {
			const BlockRef = this.rowRef[block?._id];

			return sum + (BlockRef ? BlockRef?.offsetHeight || 0 : 0);
		}, 0);
		if (newWidth !== this.state.rowWidth) {
			this.setState({ rowWidth: newWidth }, () => {});
		}
		if (newHeight !== this.state.rowHeight) {
			this.setState({ rowHeight: newHeight }, () => {});
		}
	};
	handleColorChange = (e, type, index, val) => {
		e.stopPropagation();
		if (type === 'row') {
			const newBlocks = this.state?.blocks?.map((row, key) => {
				if (key === index) {
					row.subBlocks.map((subBlock) => {
						subBlock.TableColumnColor = val === 'clear' ? '#EFEFEF' : val;
					});
				}
				return row;
			});
			this.setState(
				{
					blocks: newBlocks,
					showTableModal: {},
					section: { ...this.state.section, blocks: newBlocks },
				},
				() => {
					setTimeout(() => {
						this.props?.setActiveSection(this.state?.section);
					}, 300);
				},
			);
		} else if (type === 'column') {
			const newBlocks = this.state?.blocks?.map((row, key) => {
				row.subBlocks.map((subBlock, subIndex) => {
					if (subIndex === index) {
						subBlock.TableColumnColor = val === 'clear' ? '#EFEFEF' : val;
					}
					return subBlock;
				});
				return row;
			});
			this.setState(
				{
					blocks: newBlocks,
					showColumnModal: {},
					section: { ...this.state.section, blocks: newBlocks },
				},
				() => {
					setTimeout(() => {
						this.props?.setActiveSection(this.state?.section);
					}, 300);
				},
			);
		} else {
		}
	};
	render() {
		return (
			<div
				className={`block table1 ${
					!this.state.preview &&
					this.state.showBlockOptions &&
					!disabledModules.includes(this.props.module)
						? 'borderedBlock '
						: ''
				} `}
				style={{
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
					// backgroundSize: '100% 100%',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					// aspectRatio: 16/9,
					position: 'relative',
					border: this.state.preview ? 'none' : '',
				}}
				onClick={(e) => {
					if (this.state.preview !== true) {
						this.toggleSideBar(e);
						this.setState({
							showOption: false,
							showTableModal: {},
							showColumnModal: {},
						});
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
				{this.state.style?.backgroundType == 'video' ||
					(this.state.style?.backgroundType == 'image' && (
						<div
							className="bg-overlay"
							style={{
								backgroundColor: this.state.style?.bgOverlayColor,
								opacity: this.state.style?.bgOverlayOpacity / 100,
							}}
						></div>
					))}
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
					className="d-flex justify-content-center align-items-center"
					style={{
						display:
							this.state.sectionType === 'list' || this.state.sectionType === 'text'
								? this.state?.showHide && this.state?.style?.foldBlock
									? 'none'
									: 'flex'
								: 'flex',

						padding: this.state.style?.noPadding
							? ''
							: `${
									this.state?.style?.padding
										? padding[this.state?.style?.padding]
										: '0px'
							  } ${
									(this.state.previewType === 'm' ||
										this.state.previewType === 'ml') &&
									this.state.preview
										? this.state?.style?.noMPadding
											? '0px'
											: '14px'
										: this.state.style?.paddingHorizontal
										? paddingHorizontal[this.state.style.paddingHorizontal]
										: '0px'
							  }`,

						zIndex: 10,
						...(_.has(this.state.style, 'heading')
							? {
									flexDirection: 'column',
									display:
										this.state.sectionType === 'list' ||
										this.state.sectionType === 'text'
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
							<span className="tooltip" onClick={(e) => this.handleBlock(e)}>
								<Edit />
								<label className="tooltip-text">Block&nbsp;Settings</label>
							</span>
							{!this.props?.activeModule?.showAsSlide && (
								<>
									<span
										className="tooltip"
										onClick={(e) => this.handleDuplicate(e)}
									>
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
										disabled={
											this.props.sortedIndex === this.props.itemsLength - 1
										}
										style={{
											cursor:
												this.props.sortedIndex ===
												this.props.itemsLength - 1
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
												this.props.sortedIndex === 0
													? 'not-allowed'
													: 'pointer',
										}}
									>
										<Up />
										<label className="tooltip-text">Up</label>
									</span>
								</>
							)}
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
					!this.props?.activeModule?.showAsSlide &&
					!disabledModules.includes(this.props.module) ? (
						<a className="add-block" onClick={(e) => this.hanldeAddBlock(e)}>
							Add Block
						</a>
					) : (
						''
					)}
					{/* {_.has(this.state.style, 'heading') ? (
						<div className="row w-100p">
							<div
								className="column"
								style={{
									display: 'flex',

									...(_.has(this.state.style?.heading, 'divStyles')
										? this.state.style?.heading?.divStyles
										: {}),
								}}
							>
								<Text
									setTriggerFont={(e) => this.props.setTriggerFont(e)}
									triggerFont={this.state.triggerFont}
									setTriggeredFont={(e) =>
										this.setState({
											triggeredFont: e,
										})
									}
									triggeredFont={this.state.triggeredFont}
									text={this.state.style?.heading?.content}
									style={this.state.style?.heading?.styles}
									//divStyles={component.divStyles}
									className={this.state.style?.heading?.className}
									activeFontColor={this.state.activeFontColor}
									refID={''}
									reference={this.state.style?.heading?.reference}
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
											this.state?._id,
											this.state.style.heading?._id,
										)
									}
									preview={this.state.preview}
									setTab={(e) =>
										this.props.handleSetTab(
											e,
											this.state.style.heading?._id,
											this.state?._id,
										)
									}
									activeVariableID={this.state.activeVariableID}
									activeVariableName={this.state.activeVariableName}
									subBlockID={''}
									variables={this.props.variables}
									client={this.props.client}
									module={this.props.module}
									activeVariable={(e) => this.props.setContractActiveVariable(e)}
									activeSubBlockId={this.state.activeSubBlockId}
									sectionType={this.state.sectionType}
									// header={header}
									clearStyling={() => this.props.clearStyle()}
									// label={component?.label}
									// contractVariables={
									// 	component?.contractVariables
									// }
									tables={this.props.tables}
									sections={this.props.sections}
									sectionBg={this.state.style?.sectionBackgroundColor}
								/>
							</div>
						</div>
					) : null} */}
					<div
						className={`layout hide-scrollbar ${
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
                    
                    ${
						this.props.module === 'thankyou' && this.state.previewType === 'm'
							? 'p-60p-imp'
							: ''
					}
                    `}
						style={{
							display: 'flex',
							width: 'fit-content',

							gap: `${
								_.has(this.state.style, 'gap')
									? `${this.state?.style?.gap}px`
									: '40px'
							}`,

							padding: ` ${
								this.state.previewType === 'm' ? '24px 32px' : '64px 120px'
							}`,
							overflow: 'auto',
						}}
					>
						{_.map(this.state.blocks, (row, key) => {
							return (
								<>
									<div
										className={`row position-relative ${
											_.has(row, 'className')
												? _.has(row, 'mclassName') &&
												  this.state.previewType === 'm' &&
												  this.state.preview
													? row.className + ' ' + row.mclassName
													: row.className
												: ''
										} ${_.has(row, 'contentAlign') ? row.contentAlign : ''}
                                ${
									this.props.module === 'thankyou' &&
									this.state.previewType === 'm'
										? 'w-100p-imp'
										: ''
								}

                               
                                `}
										onMouseEnter={() => {
											this.setState({
												showOption: { index: key },
												showAddRow:
													key === this.state?.blocks?.length - 1
														? true
														: false,
											});
										}}
										onMouseLeave={() => {
											this.setState({
												showOption: false,
											});
										}}
										style={{
											paddingLeft:
												this.state?.previewType === 'm' ? 0 : '20px',
											// paddingTop: key === 0 ? '20px' : '0px',
											transition: 'all 0.3s ease-in-out',
										}}
										ref={(el) => (this.rowRef[row?._id] = el)}
										// ref={this.rowRef}
									>
										{this.state?.showOption?.index === key &&
											this.state?.previewType !== 'm' &&
											!this.props?.client && (
												<div
													className="option-svg-div"
													style={{
														rotate: '90deg',
														left: '-6px',
														bottom: '35%',
													}}
													onClick={(e) => {
														e.stopPropagation();
														this.props.handleSideBar(e, this.props._id);
														this.setState({
															showTableModal: {
																index: key,
																row: row,
															},
															showColumnModal: {},
														});
													}}
												>
													<ShowOption />
												</div>
											)}
										{_.map(row?.subBlocks, (component, k) => {
											return (
												<div
													className="table-column"
													ref={(el) =>
														(this.boxRefs[component?._id] = el)
													}
													key={k}
													onMouseEnter={() => {
														this.setState({
															showColumnOption: k,
															showAddColumn:
																k === row?.subBlocks?.length - 1,
															//  (k === (row?.subBlocks?.length -1 ) ? true : false)
															// (key === (this.state?.blocks?.length -1 ) ? true : false)
														});
													}}
													onMouseLeave={() => {
														this.setState({
															showColumnOption: null,
														});
													}}
													style={{
														paddingTop:
															this.state?.previewType !== 'm' &&
															key === 0
																? '20px'
																: '0px',
													}}
												>
													{key === 0 &&
														this.state.showColumnOption === k &&
														this.state?.previewType !== 'm' &&
														!this.props?.client && (
															<div
																className="option-svg-div"
																style={{ top: '-2px' }}
																onClick={(e) => {
																	e.stopPropagation();
																	this.props.handleSideBar(
																		e,
																		this.props._id,
																	);
																	this.setState({
																		showColumnModal: {
																			index: k,
																			row: row,
																			column: component,
																		},
																		showTableModal: {},
																	});
																}}
															>
																<ShowOption />
															</div>
														)}
													<div
														className={`column  ${
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
															this.state.previewType === 'm'
																? component.mclassName
																: ''
														} `}
														style={{
															display: (() => {
																// Check label condition
																if (_.has(component, 'label')) {
																	if (
																		_.has(
																			this.state.style,
																			'viewSubBlockOptions',
																		)
																	) {
																		return this?.returnSubBlock(
																			component.label,
																		);
																	}
																	return 'flex';
																}

																return 'flex';
															})(),

															background: (() => {
																// check for table Column colour

																if (
																	this.state?.style?.hasTable &&
																	_.has(
																		component,
																		'TableColumnColor',
																	)
																) {
																	return component?.TableColumnColor;
																}
																// Default return
																return '';
															})(),

															...(_.has(component, 'divStyles')
																? component.divStyles
																: {}),
														}}
													>
														<Text
															setTriggerFont={(e) =>
																this.props.setTriggerFont(e)
															}
															triggerFont={this.state.triggerFont}
															setTriggeredFont={(e) =>
																this.setState({
																	triggeredFont: e,
																})
															}
															triggeredFont={this.state.triggeredFont}
															text={component?.content}
															style={component?.styles}
															//divStyles={component.divStyles}
															className={component.className}
															activeFontColor={
																this.state.activeFontColor
															}
															refID={component?._id}
															reference={component?.reference}
															actionType={this.state.actionType}
															actionValue={this.state.actionValue}
															handleSelection={(e, activeTextBlock) =>
																this.props.handleBSelection(
																	e,
																	activeTextBlock,
																)
															}
															activeSectionID={
																this.state.activeSectionID
															}
															sectionID={this.state.sectionID}
															activeTextBlock={
																this.state.activeTextBlock
															}
															setContent={(e) =>
																this.props.setSubBlockContent(
																	e,
																	this.state.sectionID,
																	row?._id,
																	component?._id,
																)
															}
															preview={this.state.preview}
															setTab={(e) =>
																this.props.handleSetTab(
																	e,
																	component?._id,
																	row?._id,
																)
															}
															activeVariableID={
																this.state.activeVariableID
															}
															activeVariableName={
																this.state.activeVariableName
															}
															subBlockID={component?._id}
															variables={this.props.variables}
															client={this.props.client}
															module={this.props.module}
															activeVariable={(e) =>
																this.props.setContractActiveVariable(
																	e,
																)
															}
															activeSubBlockId={
																this.state.activeSubBlockId
															}
															sectionType={this.state.sectionType}
															// header={header}
															clearStyling={() =>
																this.props.clearStyle()
															}
															label={component?.label}
															contractVariables={
																component?.contractVariables
															}
															tables={this.props.tables}
															sections={this.props.sections}
															sectionBg={
																this.state.style
																	?.sectionBackgroundColor
															}
														/>
													</div>
													{key === 0 &&
														this.state?.showColumnModal?.index === k &&
														this.state?.previewType !== 'm' &&
														!this.props?.client && (
															<div
																className="table-options-modal"
																style={{
																	left: '-10px',
																	top: '20px',
																}}
															>
																<div className="table-options-container">
																	<div
																		className="table-options-item"
																		onClick={(e) => {
																			e.stopPropagation();
																			this.props?.AddInTable(
																				'column',
																				k,
																				'before',
																			);
																			this.setState({
																				showColumnModal: {},
																			});
																		}}
																	>
																		<ColumnLeft />

																		<span>Add Column Left</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) => {
																			e.stopPropagation();
																			this.props?.AddInTable(
																				'column',
																				k,
																				'after',
																			);
																			this.setState({
																				showColumnModal: {},
																			});
																		}}
																	>
																		<ColumnRight />

																		<span>
																			Add Column Right
																		</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) =>
																			this.handleColorChange(
																				e,
																				'column',
																				k,
																				'clear',
																			)
																		}
																	>
																		<ClearFormatting />

																		<span>
																			Clear formatting
																		</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) => {
																			e.stopPropagation();
																			this.props?.DuplicateInTable(
																				'column',
																				k,
																			);
																			this.setState({
																				showColumnModal: {},
																			});
																		}}
																	>
																		<Duplicate />

																		<span>Duplicate</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) => {
																			e.stopPropagation();
																			this.props?.DeleteInTable(
																				'column',
																				k,
																			);
																			this.setState({
																				showColumnModal: {},
																			});
																		}}
																	>
																		<DeleteRow />

																		<span>Delete</span>
																	</div>
																	<div
																		style={{
																			background: '#333334',
																			height: '1px',
																			width: '178px',
																		}}
																	></div>
																	<div className="table-options-item">
																		<span
																			style={{
																				color: '#C0C0C0',
																				cursor: 'none',
																			}}
																		>
																			Color
																		</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) =>
																			this.handleColorChange(
																				e,
																				'column',
																				k,
																				'#FFBEBA',
																			)
																		}
																	>
																		<RedColor />

																		<span>Red</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) =>
																			this.handleColorChange(
																				e,
																				'column',
																				k,
																				'#FFF5D1',
																			)
																		}
																	>
																		<YellowColor />

																		<span>Yellow</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) =>
																			this.handleColorChange(
																				e,
																				'column',
																				k,
																				'#D7E7FF',
																			)
																		}
																	>
																		<BlueColor />

																		<span>Blue</span>
																	</div>
																	<div
																		className="table-options-item"
																		onClick={(e) =>
																			this.handleColorChange(
																				e,
																				'column',
																				k,
																				'#CDEAD7',
																			)
																		}
																	>
																		<GreenColor />

																		<span>Green</span>
																	</div>
																</div>
															</div>
														)}
												</div>
											);
										})}
										{this.state?.showTableModal?.index == key &&
											this.state?.previewType !== 'm' &&
											!this.props?.client && (
												<div
													className="table-options-modal"
													style={{
														left: '-80px',
														// sandeep sir logic
														// ...(this.state?.blocks?.length == key + 1
														// 	? {
														// 			bottom: '0px',
														// 			top: 'auto',
														// 	  }
														// 	: {}),
													}}
												>
													<div className="table-options-container">
														<div
															className="table-options-item"
															onClick={(e) => {
																e.stopPropagation();
																this.props?.AddInTable(
																	'row',
																	key,
																	'before',
																	this.state?.blocks[0]?.subBlocks
																		?.length,
																);
																this.setState({
																	showTableModal: {},
																});
															}}
														>
															<RowUp />

															<span>Add row above</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) => {
																e.stopPropagation();
																this.props?.AddInTable(
																	'row',
																	key,
																	'after',
																	this.state?.blocks[0]?.subBlocks
																		?.length,
																);
																this.setState({
																	showTableModal: {},
																});
															}}
														>
															<RowDown />

															<span>Add row down</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) =>
																this.handleColorChange(
																	e,
																	'row',
																	key,
																	'clear',
																)
															}
														>
															<ClearFormatting />

															<span>Clear formatting</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) => {
																e.stopPropagation();
																this.props?.DuplicateInTable(
																	'row',
																	key,
																);
																this.setState({
																	showTableModal: {},
																});
															}}
														>
															<Duplicate />

															<span>Duplicate</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) => {
																e.stopPropagation();
																this.props?.DeleteInTable(
																	'row',
																	key,
																);
																this.setState({
																	showTableModal: {},
																});
															}}
														>
															<DeleteRow />

															<span>Delete</span>
														</div>
														<div
															style={{
																background: '#333334',
																height: '1px',
																width: '178px',
															}}
														></div>
														<div className="table-options-item">
															<span style={{ color: '#C0C0C0' }}>
																Color
															</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) =>
																this.handleColorChange(
																	e,
																	'row',
																	key,
																	'#FFBEBA',
																)
															}
														>
															<RedColor />

															<span>Red</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) =>
																this.handleColorChange(
																	e,
																	'row',
																	key,
																	'#FFF5D1',
																)
															}
														>
															<YellowColor />

															<span>Yellow</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) =>
																this.handleColorChange(
																	e,
																	'row',
																	key,
																	'#D7E7FF',
																)
															}
														>
															<BlueColor />

															<span>Blue</span>
														</div>
														<div
															className="table-options-item"
															onClick={(e) =>
																this.handleColorChange(
																	e,
																	'row',
																	key,
																	'#CDEAD7',
																)
															}
														>
															<GreenColor />

															<span>Green</span>
														</div>
													</div>
												</div>
											)}
										{key === 0 &&
											// && this.state?.ShowAddColumn
											this.state?.blocks[0]?.subBlocks?.length > 0 &&
											this.state?.previewType !== 'm' &&
											!this.props?.client && (
												<div
													className="add-row-div add-row-div-right"
													style={{
														height:
															this.state?.rowHeight -
															(this.state?.blocks?.length < 3
																? 13
																: 4),
													}}
													onClick={(e) => {
														e.stopPropagation();
														this.props.handleSideBar(e, this.props._id);
														this.props?.AddInTable(
															'column',
															key,
															'last',
														);
													}}
												>
													+{' '}
												</div>
											)}
									</div>
								</>
							);
						})}
						{this.state?.showAddRow &&
							this.state?.previewType !== 'm' &&
							!this.props?.client && (
								<div
									className="add-row-div "
									style={{ width: this.state?.rowWidth - 20, marginLeft: '20px' }}
									onClick={(e) => {
										e.stopPropagation();
										this.props.handleSideBar(e, this.props._id);
										this.props?.AddInTable(
											'row',
											-1,
											'last',
											this.state?.blocks[0]?.subBlocks?.length,
										);
									}}
								>
									{' '}
									+{' '}
								</div>
							)}
					</div>
				</div>
			</div>
		);
	}
}

export default Table;
