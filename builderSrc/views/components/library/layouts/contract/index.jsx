import React, { Component } from 'react';
import _ from 'lodash';
import '../index.scss';
import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
import Edit from '../actions/edit.jsx';
import Copy from '../actions/copy.jsx';
import { message } from 'antd/lib';
import { BlockSidebar } from '../../../builder_client_common.jsx';
import ReactPlayer from 'react-player';
import { ReactComponent as AddBlock } from '../../svgs/LeftBar/Addblock.svg';
import { ReactComponent as AddBlank } from '../../svgs/LeftBar/AddBlank.svg';

const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];

export default class Signature extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showBlockActions: false,
			showBlockOptions: false,
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
			signature: props.signature,
			contractBg: props.contractBg,
			signatures: props.signatures,
			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,
			bgOverlayColor: props?.bgOverlayColor,
			bgOverlayOpacity: props?.bgOverlayOpacity,
			contractVariables: props.contractVariables,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			setTriggerFontSize: props?.setTriggerFontSize,
			activeCurrentSignatureSubBlock: null,
			activeTableData: null,
			showImageModal: false,
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.blockSidebarRef = React.createRef();
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
		this.animateSection();

		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
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
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
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
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
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
		if (this.state.signature !== nextProps.signature) {
			this.setState({
				signature: nextProps.signature,
			});
		}
		if (this.state.contractBg !== nextProps.contractBg) {
			this.setState({
				contractBg: nextProps.contractBg,
			});
		}
		if (this.state.contractVariables !== nextProps.contractVariables) {
			this.setState({
				contractVariables: nextProps.contractVariables,
			});
		}
		if (this.state.setTriggerFontSize !== nextProps.setTriggerFontSize) {
			this.setState({
				setTriggerFontSize: nextProps.setTriggerFontSize,
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
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.signatures !== nextProps.signatures) {
			this.setState({
				signatures: nextProps.signatures,
			});
		}
		if (this.state.contractBg !== nextProps.contractBg) {
			this.setState({
				contractBg: nextProps.contractBg,
			});
		}
		if (!this.state.activeTableData) {
			this.setState({
				activeTableData: _.find(
					this.props?.tables,
					(item) => item?._id === this.props?._id,
				),
			});
		}
	};

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
				showContractSingatureModal: false,
			});
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
			this.observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
					}
				});
			});
		}
	};
	switchComponent = (type, properties, blockID, header = null) => {
		let concat2 = '';
		let concat1 = '';
		let subID2 = header === 'header' ? blockID : properties?._id;

		let sectionID = this.state?.sectionID;

		concat2 = subID2?.concat(sectionID?.toString());

		switch (type) {
			case 'text':
				return (
					<Text
						isWorkflow={this.props.isWorkflow}
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
						style={{
							...properties?.styles,
							...(this.props?.customisedImageStylesForPresentation || {}),
						}}
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
								properties,
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
			case 'loader':
				return <Loader />;

			default:
				return (
					<Text
						isWorkflow={this.props.isWorkflow}
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
	// returnData = () => {
	//     if (this.props.client) {
	//         let tables = this.state.tablesValuesforClient;
	//         let table = _.filter(tables, { _id: this.state.sectionID })[0]?.values;
	//         return table;
	//     } else {
	//         return this.state.blocks;
	//     }
	// };
	handleBlock = (e) => {
		// this.props.selectBlock('b');
		this.setState({
			showContractSingatureModal: true,
		})
	};
	handleDuplicate = () => {
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlock(e);
	};

	openTeamMemberSignatureModal = () => {
		if (!this.props.client) return;
		if (this.props.version === 1) {
			let details = {
				...this.state.blocks[0].subBlocks[1],
				blockID: this.state.blocks[0]._id,
				sectionId: this.props._id,
			};
			this.props.handleActiveCurrentSignatureSubBlock(details);
		}

		this.props.toggleSignatureModal();
	};

	openClientSignatureModal = () => {
		if (!this.props.client) return;
		if (this.props.version === 1) {
			let details = {
				...this.state.blocks[0].subBlocks[0],
				blockID: this.state.blocks[0]._id,
				sectionId: this.props._id,
			};
			this.props.handleActiveCurrentSignatureSubBlock(details);
		}

		this.props.toggleSignatureModal();
	};

	onErrorLoadingImage = (e) => {
		let imageUrl = this.state.activeTableData?.values[0]?.value;
		if (imageUrl) {
			message.loading('Loading image...');
			const retryTimer = setTimeout(() => {
				e.target.src = imageUrl;
				message.destroy();
			}, 2000);

			return () => clearTimeout(retryTimer);
		}
	};

	render() {
		return (
			<div
				className={`block ${!this.state.preview &&
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
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					position: 'relative',
					border: this.state.preview ? 'none' : '',
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
								playing={true}
								muted={this.state.style?.videoProps?.muteVideo ?? false}
								controls={false}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
							/>
						</div>
					)}
				<div
					style={{

						padding: this.state.style?.noPadding
							? ''
							: `${this.state?.style?.padding
								? this.state.previewType === 'm'
									? '20px'
									: padding[this.state?.style?.padding]
								: '0px'
							} ${(this.state.previewType === 'm' ||
								this.state.previewType === 'ml') &&
								this.state.preview
								? this.state?.style?.noMPadding
									? '0px'
									: '0px'
								: this.state.style?.paddingHorizontal
									? paddingHorizontal[this.state.style.paddingHorizontal]
									: '0px'
							}`,

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
							{!this.props?.activeModule?.showAsSlide && (
								<>
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
								<span className="tooltip" onClick={(e) => this.handleDeleteSection(e)}>
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
										className={`addBlank ${this.state.activeTab === 'fluid' ? 'active' : ''
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

					<div>
						<div
							className="contract_signature"
							style={{
								backgroundColor: this.state?.contractBg,
								padding: this.state?.previewType === 'm' && '0px 24px',
							}}
						>
							{this.state.activeTableData?.values[1]?.value ? (
								<>
									<div
										className="sign_box sign_box_text"
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 10,
											alignItems: 'center',
											height: 'auto',
										}}
									>
										{!this.state.activeTableData?.values[1]?.isImage ? (
											<label>
												{' '}
												{this.state.activeTableData?.values[1]?.value}
											</label>
										) : (
											<a
												style={{
													backgroundColor: '#fff',
													boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.12)',
													width: 'auto',
													minHeight: '80px',
													height: '100%',
												}}
											>
												<img
													src={this.state.activeTableData?.values[1]?.value}
													style={{
														width: '100%',
														height: '100%',
													}}
												/>
											</a>
										)}
									</div>
									<div>
										<div className="cs_name">
											<span>Tennant Signature</span>
										</div>
									</div>
								</>
							) : (
								<>
									<div
										className="sign_box"
									// onClick={this.openTeamMemberSignatureModal}

									>
										<span className='signature-title'>{this.props?.client ? 'To be signed in the Dashboard after you have signed.' : ""}</span>
									</div>
									<div>
										<div className="cs_name">
											<span>(Company Representative)</span>
										</div>
										<label>*Signature required</label>
										{/* <a>Signer details</a> */}
									</div>
								</>
							)}
						</div>
					</div>

					<div>
						<div
							className="contract_signature"
							style={{
								backgroundColor: this.state?.contractBg,
								padding: this.state?.previewType === 'm' && '0px 24px',
							}}
						>
							{this.state.activeTableData?.values[0]?.value ? (
								<>
									<div
										className="sign_box sign_box_text"
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 10,
											alignItems: 'center',
											height: 'auto',
										}}
									>
										{!this.state.activeTableData?.values[0]?.isImage ? (
											<label>
												{' '}
												{this.state.activeTableData?.values[0]?.value}
											</label>
										) : (
											<a
												style={{
													backgroundColor: '#fff',
													boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.12)',
													width: 'auto',
													minHeight: '80px',
													height: '100%',
												}}
											>
												<img
													src={this.state.activeTableData?.values[0]?.value}
													onError={this.onErrorLoadingImage}
													style={{
														width: '100%',
														height: '100%',
													}}
												/>
											</a>
										)}
									</div>
									<div>
										<div className="cs_name">
											<div>Client Signature</div>
										</div>
									</div>
								</>
							) : (
								<>
									<div
										className="sign_box"
										style={{ cursor: 'pointer' }}
										onClick={this.openClientSignatureModal}
									>
										<span className='signature-title'>{this.props?.client ? 'Click to type, draw or upload your signature' : ''}</span>
									</div>
									<div>
										<div className="cs_name">
											<div>(Client Name)</div>
										</div>
										<label>*Signature required</label>
										{/* <a>Signer details</a> */}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				{
					this.state.showContractSingatureModal && (
						<BlockSidebar
							ref={this.blockSidebarRef}
							activeType="signature"
							elementEndPosition={
								this.state.elementEndPosition || { x: 450, y: 100 }
							}
							activePopupComponent={this.props.section}
							setActiveSection={(e) => this.setState({
								section: e,
								style: e?.style
							}, () => {
								this.props.setActiveSection(e)
							})}
							setModalRef={(e) => {
								this.setState({
									showImageModal: e,
								});
							}}
							showImageModal={this.state.showImageModal}
							activeModuleId={this.props?.activeModuleId}

						/>
					)
				}
			</div>
		);
	}
}
