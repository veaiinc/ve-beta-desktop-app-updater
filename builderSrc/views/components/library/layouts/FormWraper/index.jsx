import React, { Component } from 'react';
import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
import Edit from '../actions/edit.jsx';
import Copy from '../actions/copy.jsx';
import { ReactComponent as AddBlock } from '../../svgs/LeftBar/Addblock.svg';
import { ReactComponent as AddBlank } from '../../svgs/LeftBar/AddBlank.svg';
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
import LogicalForm from '../logicalForm/LogicalForm';
import { BlockSidebar } from '../../../builder_client_common.jsx';
import ReactPlayer from 'react-player';

const disabledModules = ['contract', 'invoice', 'thankyou'];

class FormWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
			activeSection: props?.activeSection,
			section: props?.section,
			activeType: '',
			showPopup: false,
			elementEndPosition: { x: 1000, y: 100 },
			activePopupComponent: {},
			activeTextTab: 'f',
			isSinglePage: false,
			isLogicalText: [
				'buttonText',
				'formTitle',
				'formDescription',
				'formQuestionDescription',
				'formQuestion',
				'button',
			],
		};
		this.blockRef = React.createRef();
		this.blockSidebarRef = React.createRef();
		this.boxRefs = [];
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (
			this.state.triggerAdjustGridAreas !== nextProps.triggerAdjustGridAreas &&
			nextProps.triggerAdjustGridAreas === true
		) {
			this.props.setAdjustGridAreas(false);
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
		if (this.state.activeSection !== nextProps.activeSection) {
			this.setState({
				activeSection: nextProps.activeSection,
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
		if (
			this.blockSidebarRef.current &&
			this.blockSidebarRef.current.getSidebarNode && // check if method exists
			!this.blockSidebarRef.current.getSidebarNode().contains(event.target) &&
			!this.state.showImageModal
		) {
			this.setState({
				showPopup: false,
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
	// ... existing code ...
	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	// ... existing code ...
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

	handleElementEdit = (type, tab = 'f', popupFor = '', field = false) => {
		const upperPopupValues = ['formTitle', 'formDescription', 'form-v1', 'logoImage'];
		this.setState(
			{
				activeType: type === 'logoImage' ? 'shape' : type == 'buttonText' ? 'text' : type,
				popupFor: popupFor || '',
				activePopupComponent:
					type === 'logoImage'
						? this.state?.section?.logoProps || {}
						: type == 'shape'
						? field
						: type == 'button' || type == 'buttonText'
						? this.state?.section?.buttonProps || {}
						: this.state?.section,
				elementEndPosition: {
					x: type === 'form-v1' ? 900 : 600,
					y: upperPopupValues.includes(type)
						? 100
						: upperPopupValues.includes(popupFor)
						? 150
						: this.state?.yPosition,
				},
				activeTextTab: tab,
				showPopup: true,
			},
			() => {},
		);
	};

	handleSetActivePopupComponent = (value) => {
		if (this.state?.popupFor === 'formLogo') {
			const updatedSection = {
				...this.state?.section,
				logoProps: {
					...this.state?.section?.logoProps,
					...value,
				},
			};
			this.setState(
				{
					section: updatedSection,
					activePopupComponent: value,
				},
				() => {
					this.props?.setActiveSection(updatedSection);
				},
			);
		} else if (this.state?.popupFor === 'blockImage') {
			let updateBlocks = [...this.state?.blocks];
			updateBlocks = updateBlocks.map((field, index) => {
				if (field?.id === value?.id) {
					return value;
				}
				return field;
			});

			const updatedSection = {
				...this.state?.section,
				blocks: updateBlocks,
			};
			this.setState(
				{
					section: updatedSection,
					blocks: updateBlocks,
					activePopupComponent: value,
				},
				() => {
					// this.debounceFuncForImage(() => {
					this.props?.setActiveSection(updatedSection);
					// }, 1000);
				},
			);

			// props.saveSections(updateSections);
		} else if (this.state?.popupFor === 'button') {
			const updatedSection = {
				...this.state?.section,
				buttonProps: {
					...this.state?.section?.buttonProps,
					...value,
				},
			};
			this.setState(
				{
					section: updatedSection,
					activePopupComponent: value,
				},
				() => {
					this.props?.setActiveSection(updatedSection);
				},
			);
		}
	};
	setActiveImageSettings = (value) => {
		if (this.state?.popupFor === 'formLogo') {
			const updatedSection = {
				...this.state?.section,
				logoProps: {
					// ...this.state?.section?.logoProps,
					...value,
				},
			};
			this.setState(
				{
					section: updatedSection,
					activePopupComponent: value,
				},
				() => {
					this.debounceFuncForImage(() => {
						this.props?.setActiveSection(updatedSection);
					}, 1000);
				},
			);
		} else if (this.state?.popupFor === 'blockImage') {
			let updateBlocks = [...this.state?.blocks];
			updateBlocks = updateBlocks.map((field, index) => {
				if (field?.id === value?.id) {
					return value;
				}
				return field;
			});

			const updatedSection = {
				...this.state?.section,
				blocks: updateBlocks,
			};
			this.setState(
				{
					section: updatedSection,
					blocks: updateBlocks,
					activePopupComponent: value,
				},
				() => {
					this.debounceFuncForImage(() => {
						this.props?.setActiveSection(updatedSection);
					}, 1000);
				},
			);

			// props.saveSections(updateSections);
		}
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
	handleIsSinglePage = (value) => {
		this.setState({
			isSinglePage: value,
		});
	};

	// ! function for handling click to update the yposition for popup
	handleClickValue = (e) => {
		const rect = e?.currentTarget?.getBoundingClientRect();
		// const x = e?.clientX - rect?.left;
		const y = e?.clientY - rect?.top - 50;
		if (this.state?.yPosition != y) {
			this.setState({
				yPosition: y,
			});
		}
	};
	render() {
		return (
			<div
				className={`block  invoice-wrapper-containeryvy ${
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
						this.state.style?.backgroundType !== 'image'
							? this.state.style?.sectionBackgroundColor
							: 'transparent',
					backgroundImage:
						this.state.style?.backgroundType === 'image'
							? `url(${this.state.style.backgroundImageURL})`
							: 'none',
					// backgroundSize: '100% 100%',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					// aspectRatio: 16/9,
					position: 'relative',
					border: this.state.preview ? 'none' : '',
					width: '100%',
					height: !this.props?.client
						? 'auto'
						: this.state?.section?.isSinglePage && this.props?.client
						? 'auto'
						: '100%',
					minHeight: '418.5px',
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
								loop={true}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
								playing={true}
								muted={this.state?.style?.videoProps?.muteVideo}
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
											: '9px'
										: this.state.style?.paddingHorizontal
										? paddingHorizontal[this.state.style.paddingHorizontal]
										: '0px'
							  }`,

						zIndex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					}}
				>
					{this.state.showBlockActions &&
					this.state.preview == false &&
					!disabledModules.includes(this.props.module) ? (
						<div
							className="block-action-bar"
							style={{
								top: '0px',
							}}
						>
							<span
								className="tooltip"
								onClick={(e) => {
									this.handleElementEdit('form-v1');
									this.handleBlock(e);
								}}
							>
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
						<div
							className="add-block-new-container"
							style={{
								top: '0px',
							}}
						>
							<div
								onClick={(e) => this.hanldeAddBlock(e)}
								className="addBlankContainer"
							>
								<AddBlock />
								<label className="tooltip-text">Add Block</label>
							</div>
							{/* <div className="addBlockDividerContainer">
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
							</div> */}
						</div>
					) : (
						''
					)}
					<div
						className="Form-wrapper"
						style={{
							maxWidth: 792,
							width: '100%',
							zoom: this.state.previewType === 'ml' && this.state.preview ? 0.4 : 1,
						}}
						onClick={(e) => this.handleClickValue(e)}
					>
						<LogicalForm
							deleteSection={this.handleDeleteSection}
							submitLogicalForm={this.props.submitLogicalForm}
							submitFormLoading={this.state.submitFormLoading}
							showFormError={this.state.showFormError}
							showSuccessMessage={this.state.showSuccessMessage}
							errorMessage={this.state.errorMessage}
							successMessage={this.state.successMessage}
							client={this.props?.client}
							_id={this.props?._id}
							isTheme={this.props.isTheme}
							setActiveTheme={this.props.setActiveTheme}
							handleLogicalFormAnswer={this.props.handleLogicalFormAnswer}
							preview={this.state?.client || this.state?.preview}
							previewType={this.state?.previewType}
							setTab={(e, id = null, bid = null) => this.props?.setTab(e, id, bid)}
							handleSideBar={(e, _id) => {
								this.props.handleSideBar(e, _id);
							}}
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
							activeSubBlockId={this.props?.activeSubBlockId}
							sections={this.props.sections}
							key={this.props._id}
							field={this.props.blocks}
							allFields={this.props.blocks}
							onQuestionEdit={this.props.handleQuestionEdit}
							onAnswerChange={this.props.handleAnswerChange}
							onDuplicate={this.props.handleDuplicateField}
							onDelete={this.props.handleDeleteField}
							onConditionChange={this.props.handleConditionChange}
							onRemoveCondition={this.props.handleRemoveCondition}
							onAddAction={this.props.handleAddAction}
							onRemoveOption={this.props.handleRemoveOption}
							createNewField={this.props.createNewField}
							saveSections={this.props.saveSections}
							backgroundType={this.state.backgroundType}
							backgroundImageURL={this.state.backgroundImageURL}
							backgroundVideoURL={this.state.backgroundVideoURL}
							handleIsValidBgVideoURL={(e) => {
								this.props.setIsValidBgVideoURL(e);
							}}
							newTheme={this.props?.themes}
							handleBSelection={(e, activeTextBlock) =>
								this.props.handleBSelection(e, activeTextBlock)
							}
							handleSetTab={(e, subBlockID, blockID) =>
								this.props?.handleSetTab(e, subBlockID, blockID)
							}
							setActiveSection={(e) => this.props?.setActiveSection(e)}
							handleElementEdit={this.handleElementEdit}
							fonts={this.props?.fonts}
							fontFamily={this.props?.fontFamily}
							fontColor={this.props?.fontColor}
							fontSize={this.props?.fontSize}
							justifyleft={this.props?.justifyleft}
							justifyright={this.props?.justifyright}
							justifycenter={this.props?.justifycenter}
							justifyfull={this.props?.justifyfull}
							lineHeight={this.props?.lineHeight}
							letterSpacing={this.props?.letterSpacing}
							showPopup={this.state.showPopup}
							buttonProps={this.props?.buttonProps}
							handleIsSinglePage={(value) => this.handleIsSinglePage(value)}
						/>
					</div>
				</div>
				{this.state.showPopup && (
					<BlockSidebar
						ref={this.blockSidebarRef}
						elementEndPosition={this.state.elementEndPosition || { x: 1000, y: 100 }}
						activeType={this.state.activeType || 'form-v1'}
						section={this.props.section}
						fonts={this.props?.fonts}
						activePopupComponent={
							this?.state?.activePopupComponent || this?.state?.section
						}
						brandColors={this.props?.brandColors}
						modules={this.props?.modules}
						getModuleSections={(e) => this.props?.getModuleSections(e)}
						activeModuleSections={this.props?.activeModuleSections}
						isWorkflow={this.props.isWorkflow}
						previewType={this.props.previewType}
						handleCardPopupProps={(e) => {
							if (e?.shouldClose) {
								this.setState({ showPopup: false });
							} else {
								this.setState(
									{
										section: e,
										style: e?.style,
									},
									() => {
										this.props?.setActiveSection(e);
									},
								);
							}
						}}
						style={this.state?.activePopupComponent?.style}
						textTab={this.state?.activeTextTab}
						changeFontColor={(e, f, event = null) => {
							this.props?.changeFontColor(e, f);
						}}
						activeColor={this.props?.fontColor}
						fontSize={this.props?.fontSize}
						justifyleft={this.props?.justifyleft}
						justifyright={this.props?.justifyright}
						justifycenter={this.props?.justifycenter}
						justifyfull={this.props?.justifyfull}
						lineHeight={this.props?.lineHeight}
						letterSpacing={this.props?.letterSpacing}
						fontFamily={this.props?.fontFamily}
						setActivePopupComponent={(e) => {
							this.handleSetActivePopupComponent(e);
						}}
						setModalRef={(e) => {
							this.setState({
								showImageModal: e,
							});
						}}
						setActiveImageSettings={this.setActiveImageSettings}
						activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
						activeModuleId={this.props?.activeModuleId}
						activeSectionID={this.props.activeSectionID}
						module={this.props.module}
						isLogicalFormLogo={this.state?.popupFor === 'formLogo'}
						isLogicalFormImage={this.state?.popupFor === 'blockImage'}
						isLogicalFormText={this.state?.isLogicalText.includes(this.state?.popupFor)}
						handleIsValidBgVideoURL={this.props.handleIsValidBgVideoURL}
						isLogicalForm={true}
					/>
				)}
			</div>
		);
	}
}

export default FormWrapper;
