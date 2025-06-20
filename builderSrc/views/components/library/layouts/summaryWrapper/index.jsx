import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Summary from '../summary/index.jsx';
// actions

import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
import Edit from '../actions/edit.jsx';
import Copy from '../actions/copy.jsx';
import { ReactComponent as AddBlock } from '../../svgs/LeftBar/Addblock.svg';
import { ReactComponent as AddBlank } from '../../svgs/LeftBar/AddBlank.svg';
import '../index.scss';
import { BlockSidebar } from '../../../builder_client_common.jsx';

const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
class SummaryWarpper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			globalSummaryData: props?.globalSummaryData,
			sections: props?.globalSummaryData?.sections,
			tables: props?.globalSummaryData?.tables,
			preview: props.preview,
			previewType: props.previewType,

			client: props?.client,

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
			showSummaryPopup: false,
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.blockSidebarRef = React.createRef();
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
		if (this.state.globalSummaryData !== nextProps.globalSummaryData) {
			this.setState({
				globalSummaryData: nextProps.globalSummaryData,
			});
		}
		if (this.state.sections !== nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
			});
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
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
		if (this.state.client !== nextProps.client) {
			this.setState({
				client: nextProps.client,
			});
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
		if (this.state.blocks !== nextProps.blocks) {
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.activeSectionID !== nextProps.activeSectionID) {
			this.setState({
				activeSectionID: nextProps.activeSectionID,
			});
		}
		if (this.state.sectionID !== nextProps.sectionID) {
			this.setState({
				sectionID: nextProps.sectionID,
			});
		}
		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
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
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.isActiveSection !== nextProps.isActiveSection) {
			this.setState({
				isActiveSection: nextProps.isActiveSection,
			});
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
		// if (this.state.globalSummaryData !== nextProps.globalSummaryData) {
		//     this.setState({
		//         globalSummaryData: nextProps.globalSummaryData,
		//     });
		// }
		if (this.state.sections !== nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
			});
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
			});
		}
	};
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (event) => {
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
		if (
			this.blockSidebarRef.current &&
			this.blockSidebarRef.current.getSidebarNode && // check if method exists
			!this.blockSidebarRef.current.getSidebarNode().contains(event.target) &&
			!this.state.showImageModal
		) {
			this.setState({
				showSummaryPopup: false,
			});
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
		this.setState({ showSummaryPopup: true });
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
					this.setState({ showBlockOptions: false });
				}}
				ref={this.blockRef}
			>
				{(this.state.style?.backgroundType == 'video' ||
					this.state.style?.backgroundType == 'image') && (
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
								loop={this.state.style?.videoProps?.loop ?? false}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
								playing={true}
								muted={this.state.style?.videoProps?.muteVideo ?? false}
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
						<div className="add-block-new-container">
							<div
								onClick={(e) => this.hanldeAddBlock(e)}
								className="addBlankContainer"
							>
								<AddBlock />
								<label className="tooltip-text">Add Block</label>
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

								<label className="tooltip-text">Add Blank</label>
							</div>
						</div>
					) : (
						''
					)}
					<div
						className="summary-layout-wrapper"
						style={{
							// maxWidth: 792,
							width: '100%',
							zoom: this.state.previewType === 'ml' && this.state.preview ? 0.4 : 1,
						}}
					>
						<Summary
							isWorkflow={this.props.isWorkflow}
							// sections={sectionsArr}
							// tables={this.state.tables}
							eventsLabel={this.state?.eventsLabel}
							paymentsLabel={this.state?.paymentsLabel}
							summaryBg={this.state?.summaryBg}
							summaryFont={this.state?.summaryFont}
							summaryFontColor={this.state?.summaryFontColor}
							summaryFontSize={this.state?.summaryFontSize}
							summaryBlock={this.state?.summaryBlock}
							preview={this.state.preview}
							previewType={this.state.previewType}
							setTab={(e) => this.props.setActiveTab(e)}
							handleSideBar={(e, _id) => this.props.handleOpenSideBar(e, _id, true)}
							currencySymbol={this.props?.currencySymbol}
							currencySymbol2={this.props?.currencySymbol2}
							globalSummaryData={this.props?.globalSummaryData}
							style={this.state?.style}
							client={this.props?.client}
							clientGrandTotal={this.props?.clientGrandTotal}
							sections={
								this.props?.client
									? this.props?.globalSummaryData?.sections
									: this.props?.sections
							}
							tables={
								this.props?.client
									? this.props?.globalSummaryData?.tables
									: this.props?.tables
							}
							isSummaryPreview={this.props.isSummaryPreview}
							variables={this.props?.variables}
							smartFileVariables={this.props?.smartFileVariables || {}}
						/>
					</div>
				</div>
				{this.state.showSummaryPopup && !this.props?.client && (
					<>
						<BlockSidebar
							ref={this.blockSidebarRef}
							elementEndPosition={this.state.elementEndPosition || { x: 450, y: 100 }}
							activeType={'summary'}
							activePopupComponent={this.props.section}
							brandColors={this.props?.brandColors}
							style={this.props.section?.style}
							setModalRef={(e) => {
								this.setState({
									showImageModal: e,
								});
							}}
							setActiveSection={(e) => {
								this.setState(
									{
										section: e,
										style: e?.style,
									},
									() => {
										this.props.setActiveSection(e);
									},
								);
							}}
							fonts={this.props?.fonts}
							activeModuleId={this.props?.activeModuleId}
						/>
					</>
				)}
			</div>
		);
	}
}
export default SummaryWarpper;
