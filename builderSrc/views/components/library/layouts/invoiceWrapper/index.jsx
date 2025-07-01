import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import Invoice from '../invoices/index.jsx';
// actions

import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
// import Edit from '../actions/edit.jsx';
// import Copy from '../actions/copy.jsx';
//new lefrbar
import { ReactComponent as NewDelete } from '../../svgs/LeftBar/NewDelete.svg';
import { ReactComponent as NewDown } from '../../svgs/LeftBar/NewDown.svg';
import { ReactComponent as NewEdit } from '../../svgs/LeftBar/NewEdit.svg';
import { ReactComponent as NewCopy } from '../../svgs/LeftBar/NewCopy.svg';
import { ReactComponent as NewUp } from '../../svgs/LeftBar/NewUp.svg';
import { ReactComponent as AddBlock } from '../../svgs/LeftBar/Addblock.svg';
import { ReactComponent as AddBlank } from '../../svgs/LeftBar/AddBlank.svg';

import '../index.scss';

const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
class InvoiceWrapper extends Component {
	constructor(props) {
		super();
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			invoiceDetails: props.invoiceDetails,
			tables: props.tables,
			client: props?.client,
			invoiceNumber: props.invoiceNumber,

			showBlockOptions: false,
			showBlockActions: false,
			activeFontColor: props.activeFontColor,
			actionType: props.actionType,
			actionValue: props.actionValue,
			style: props.style,
			blocks: props.blocks,
			activeSectionID: props.activeSectionID,
			sectionID: props._id,
			activeTextBlock: props.activeTextBlock,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			subBlockID: props.subBlockID,
			activeSubBlockId: props.activeSubBlockId,
			isActiveSection: props.isActiveSection,
			sectionType: props?.sectionType,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,
			showCardPopup: false,
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
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
	};

	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	// functions for block actions
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
	toggleSideBar = (e) => {
		this.setState(
			{
				showBlockActions: true,
			},
			() => {
				this.props.handleSideBar('b', this.props._id);
			},
		);
	};

	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	handleBlock = (e) => {
		// this.props.selectBlock('b');
		this.setState({ showCardPopup: true });
	};

	handleDuplicate = () => {
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlock(e);
	};

	render() {
		return (
			<div
				className={`block  invoice-wrapper-container ${
					!this.state.preview &&
					this.state.showBlockOptions &&
					!disabledModules.includes(this.props.module)
						? 'borderedBlock '
						: ''
				} `}
				style={{
					flexDirection: 'column',
					backgroundColor:
						this.state.style?.backgroundType !== 'video' &&
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
					width: '100%',
				}}
				onClick={(e) => {
					if (this.state.preview !== true) {
						this.toggleSideBar(e);
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
				{' '}
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
					style={{
						display: 'flex',

						padding: this.state.style?.noPadding
							? ''
							: `${
									this.state?.style?.padding
										? this.state.previewType === 'm'
											? '20px'
											: padding[this.state?.style?.padding]
										: '0px'
							  } ${
									(this.state.previewType === 'm' ||
										this.state.previewType === 'ml') &&
									this.state.preview
										? this.state?.style?.noMPadding
											? '0px'
											: '0px'
										: this.state.style?.paddingHorizontal
										? paddingHorizontal[this.state.style.paddingHorizontal]
										: '0px'
							  }`,

						zIndex: 1,
						justifyContent: 'center',
					}}
				>
					{this.state.showBlockActions &&
					this.state.preview == false &&
					!disabledModules.includes(this.props.module) ? (
						<div className="block-action-bar">
							<span className="tooltip" onClick={(e) => this.handleBlock(e)}>
								<NewEdit />
								<label className="tooltip-text">Block&nbsp;Settings</label>
							</span>
							{!this.props?.activeModule?.showAsSlide && (
								<>
									<span
										className="tooltip"
										onClick={(e) => this.handleDuplicate(e)}
									>
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
												this.props.sortedIndex === 0
													? 'not-allowed'
													: 'pointer',
										}}
									>
										<NewUp />
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
					!this.props?.activeModule?.showAsSlide &&
					!disabledModules.includes(this.props.module) ? (
						// <a className="add-block" onClick={(e) => this.hanldeAddBlock(e)}>
						// 	Add Block
						// </a>
						<div className="add-block-new-container">
							<div
								onClick={(e) => this.hanldeAddBlock(e)}
								className="addBlankContainer"
							>
								<AddBlock />
								<span className="tooltip-text">Add Card</span>
							</div>
							<div className="addBlockDividerContainer">
								<div className="addBlockDivider"></div>
							</div>
							<div className="addBlankContainer">
								{this.state.isElement !== true ? (
									<div
										className={`addBlank ${
											this.state.activeTab === 'fluid' ? 'active' : ''
										}`}
										onClick={(e) => this.props.handleAddLayout(null, true)}
										//onMouseEnter={(e) => this.setActiveTab('fluid')}
									>
										<AddBlank />
									</div>
								) : (
									''
								)}

								<span className="tooltip-text">Add Blank Card</span>
							</div>
						</div>
					) : (
						''
					)}
					<div
						className="invoice-layout-wrapper"
						style={{
							// maxWidth: 792,
							// margin:
							// 	this.props.module === 'contract' || this.props.module === 'invoice'
							// 		? '0px auto'
							// 		: '',
							width: '100%',

							zoom: this.state.previewType === 'ml' && this.state.preview ? 0.4 : 1,
						}}
					>
						<Invoice
							preview={this.state?.preview}
							previewType={this.state?.previewType}
							invoiceDetails={this.props?.invoiceDetails}
							client={this.props?.client}
							tables={this.props?.tables}
							paymentSchedule={this.state?.paymentSchedule}
							setPaymentSchedule={(e) => {
								this.props?.setPaymentSchedule(e);
							}}
							showSchedule={this.state?.showSchedule}
							setTab={(e, id = null, bid = null) => this.props?.setTab(e, id, bid)}
							handleSideBar={(e, _id) => {
								this.props.handleSideBar(e, _id);
							}}
							invoiceClientVariables={this.props?.invoiceClientVariables}
							invoiceNumber={this.props?.invoiceNumber}
							setInvoiceNumber={(e) => this.props.handleInvoiceNumber(e)}
							currencySymbol={this.props?.currencySymbol}
							blocks={this.state?.blocks}
							style={this.state?.style}
							section={this.props?.section}
							setTriggerFont={(e) => this.props?.setTriggerFont(e)}
							triggerFont={this.props.triggerFont}
							triggeredFont={this.props?.triggeredFont}
							setTriggeredFont={(e) =>
								this.setState({
									triggeredFont: e,
								})
							}
							activeFontColor={this.props?.activeFontColor}
							actionType={this.props?.actionType}
							actionValue={this.props?.actionValue}
							handleSelection={(e, activeTextBlock) => {
								this.props.handleBSelection(e, activeTextBlock);
							}}
							activeSectionID={this.props.activeSectionID}
							activeTextBlock={this.props.activeTextBlock}
							sectionID={this.props?.section?._id}
							setContent={(e, sid, bid, id) =>
								this.props.setSubBlockContent(e, sid, bid, id)
							}
							activeVariableID={this.props.activeVariableID}
							activeVariableName={this.props.activeVariableName}
							subBlockID={this.props?.subBlockID}
							variables={this.props.variables}
							sectionType={this.props.sectionType}
							header={this.props.header}
							clearStyling={() => this.props.clearStyle()}
							module={this.props.module}
							activeVariable={(e) => this.props?.setContractActiveVariable(e)}
							iveSubBlockId={this.props?.activeSubBlockId}
							sections={this.props.sections}
							currencySymbol2={this.props?.currencySymbol2}
							isWorkflow={this.props.isWorkflow}
							clientGrandTotal={this.props?.clientGrandTotal || 0}
							activeImage={this.props?.activeImage}
							imgSettingData={(e) => this.props?.imgSettingData(e)}
							setActiveSection={(e) => this.props?.setActiveSection(e)}
							addManualInvoiceBlock={this.props?.addManualInvoiceBlock}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							brandColors={this.props?.brandColors}
							modules={this.props?.modules}
							updateTablesForTaxes={this.props?.updateTablesForTaxes}
							showCardPopup={this.state.showCardPopup}
							setShowCardPopup={(e) => this.setState({ showCardPopup: e })}
							smartFileVariables={this.props?.smartFileVariables || {}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default InvoiceWrapper;
