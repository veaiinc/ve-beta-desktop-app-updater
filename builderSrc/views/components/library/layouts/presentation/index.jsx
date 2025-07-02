import React, { Component } from 'react';
import './presentation.scss';
import { Edit } from '../../../builder_client_common';
// layouts for presentation
import Layout from '../index';
import ServicesLayout from '../services/index';
import Events from '../events/index';
import FormQandA from '../formQ&A/index';
import Signaiture from '../contract/index';
import PaymentSchedule from '../paymentSchedule/index';
import InvoiceWrapper from '../invoiceWrapper/index';
import Table from '../Tables/index';
import FluidLayout from '../canvas';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

class Presentation extends Component {
	constructor(props) {
		super();
		this.sectionRefs = [];
		this.state = {
			activeStyle: props?.sections[0]?.style,
			activeKey: 0,
			activeOrderNo: 0,
			showBlockOptions: false,
			activeFontColor: props.activeFontColor,
			actionType: props.actionType,
			actionValue: props.actionValue,
			crop: props.crop,
			zoom: props.zoom,
			showAddBlock: false,
			sections: props.sections,
			itemHeight: 0,
			isDragging: false,
			activeSectionID: props.activeSectionID,
			activeTextBlock: props.activeTextBlock,
			preview: props.preview,
			previewType: props.previewType,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			subBlockID: props.subBlockID,
			tables: props.tables,
			variables: props.variables,
			showContractSingatureModal: false,
			uploadingSignature: props.uploadingSignature,
			signatures: props.signatures,
			showContractSign: props.showContractSign,
			activeSubBlockId: props.activeSubBlockId,
			headerSection: props?.headerSection,
			isHeader: props?.isHeader,
			formBgColor: props?.formBgColor,
			setActiveTheme: props?.setActiveTheme,
			isTheme: props?.isTheme,
			tablesValuesforClient: props?.tablesValuesforClient,
			submitFormLoading: props?.submitFormLoading,
			restrictServiceSelection: props?.restrictServiceSelection,
			handleContractNaviagtion: props?.handleContractNaviagtion,

			backgroundType: props.backgroundType,
			backgroundImageURL: props.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,

			isTenantLogo: props?.isTenantLogo,
			contractVariables: props?.contractVariables,

			socialMediaLinks: props?.socialMediaLinks,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			activeModule: props?.activeModule,
			isWorkflow: props?.isWorkflow,
		};
		// this.ref = createRef();
		// this.blockRefs = React.createRef(); // Create a ref
		// this.blockRefs.current = []; //

		// this.blockRefsStore = []; // Array to store refs for each block
		// this.observer = null; // Observer to track visibility
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeFontColor !== nextProps.activeFontColor) {
			this.setState({
				activeFontColor: nextProps.activeFontColor,
			});
		}
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
		if (this.state.paymentSchedule !== nextProps.paymentSchedule) {
			this.setState({
				paymentSchedule: nextProps.paymentSchedule,
			});
		}
		if (this.state.activeAnimation !== nextProps.activeAnimation) {
			this.setState({
				activeAnimation: nextProps.activeAnimation,
			});
		}
		if (this.state.setActiveTheme !== nextProps.setActiveTheme) {
			this.setState({
				setActiveTheme: nextProps.setActiveTheme,
			});
		}
		if (this.state.isTheme !== nextProps.isTheme) {
			this.setState({
				isTheme: nextProps.isTheme,
			});
		}
		if (this.state.formBgColor !== nextProps.formBgColor) {
			this.setState({
				formBgColor: nextProps.formBgColor,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.headerSection !== nextProps.headerSection) {
			this.setState({
				headerSection: nextProps.headerSection,
			});
		}
		if (this.state.isHeader !== nextProps.isHeader) {
			this.setState({
				isHeader: nextProps.isHeader,
			});
		}

		if (this.state.uploadingSignature !== nextProps.uploadingSignature) {
			this.setState({
				uploadingSignature: nextProps.uploadingSignature,
			});
		}
		if (this.state.signatures !== nextProps.signatures) {
			this.setState({
				signatures: nextProps.signatures,
			});
		}
		if (this.state.sections !== nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
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
		if (this.state.variables !== nextProps.variables) {
			this.setState({
				variables: nextProps.variables,
			});
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
			});
		}
		if (this.state.tablesValuesforClient !== nextProps.tablesValuesforClient) {
			this.setState({
				tablesValuesforClient: nextProps.tablesValuesforClient,
			});
		}
		if (this.state.showContractSign !== nextProps.showContractSign) {
			this.setState({
				showContractSign: nextProps.showContractSign,
			});
		}
		if (this.state.submitFormLoading !== nextProps.submitFormLoading) {
			this.setState({
				submitFormLoading: nextProps.submitFormLoading,
			});
		}
		if (this.state.restrictServiceSelection !== nextProps.restrictServiceSelection) {
			this.setState({
				restrictServiceSelection: nextProps.restrictServiceSelection,
			});
		}

		if (this.state.eventsLabel !== nextProps.eventsLabel && nextProps.eventsLabel) {
			this.setState({
				eventsLabel: nextProps.eventsLabel,
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
		if (this.state.isTenantLogo !== nextProps.isTenantLogo) {
			this.setState({
				isTenantLogo: nextProps.isTenantLogo,
			});
		}
		if (this.state.contractVariables !== nextProps.contractVariables) {
			this.setState({
				contractVariables: nextProps.contractVariables,
			});
		}
		if (this.state.socialMediaLinks !== nextProps.socialMediaLinks) {
			this.setState({
				socialMediaLinks: nextProps.socialMediaLinks,
			});
		}
		if (this.state.activeModule !== nextProps.activeModule) {
			this.setState({
				activeModule: nextProps.activeModule,
			});
		}
		if (this.state.isWorkflow !== nextProps.isWorkflow) {
			this.setState({
				isWorkflow: nextProps.isWorkflow,
			});
		}
	};
	handleKeyDown = (event) => {
		const { activeKey, sections } = this.state;
		const maxIndex = sections.length - 1;
		if (event.key === 'ArrowRight' && activeKey < maxIndex) {
			// Only navigate right if not at the last section
			this.setState({
				activeKey: activeKey + 1,
				activeStyle: sections[activeKey + 1]?.style,
			});
		} else if (event.key === 'ArrowLeft' && activeKey > 0) {
			// Only navigate left if not at the first section
			this.setState({
				activeKey: activeKey - 1,
				activeStyle: sections[activeKey - 1]?.style,
			});
		}
	};
	componentDidMount() {
		// Add keydown event listener
		window.addEventListener('keydown', this.handleKeyDown);
	}

	componentWillUnmount() {
		// Remove keydown event listener
		window.removeEventListener('keydown', this.handleKeyDown);
	}
	componentDidUpdate(prevProps, prevState) {
		// if (prevState?.activeKey !== this.state?.activeKey && this.state?.activeKey !== null) {
		// 	this.sectionRefs[this.state?.activeKey]?.scrollIntoView({
		// 		behavior: 'smooth',
		// 		block: 'center',
		// 	});
		// }
		if (prevState?.activeKey !== this.state?.activeKey && this.state?.activeKey !== null) {
			const element = this.sectionRefs[this.state?.activeKey];

			if (element) {
				const rect = element?.getBoundingClientRect();
				const isFullyVisible = rect?.top >= 0 && rect?.bottom <= window?.innerHeight;

				if (!isFullyVisible) {
					element.scrollIntoView({
						behavior: 'smooth',
						block: 'nearest', // You can adjust this to 'nearest' if needed
					});
				}
			}
		}
	}

	renderLayout = (section, index) => {
		switch (section?.type) {
			case 'services':
				return (
					<ServicesLayout
						setTriggerFont={(e) => this.props?.setTriggerFontP(e)}
						// setTriggeredFont={(e) =>
						// 	this.props?.setTriggeredFontP(e)
						// }
						triggerFont={this.state?.triggerFont}
						key={index}
						_id={section?._id}
						blocks={section?.blocks}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						addServiceBlock={(services_style) =>
							this.props.addServiceBlockP(
								section?._id,
								_.size(section?.blocks) + 1,
								services_style,
							)
						}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id, true)}
						showAddBlock={(e) => this.showAddBlockP(e, section?.order, index)}
						index={section?.order}
						itemsLength={this.state?.sections?.length}
						//   moveDirection={moveDirection}
						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						activeImage={(
							sectionID,
							blockID,
							subBlockID,
							imageURL,
							dimensions,
							ImgSubBlock,
						) =>
							this.props.activeImageP(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							)
						}
						handleSetTab={(e) =>
							this.state?.preview ? '' : this.props.handleSetTabP(e)
						}
						activeVariableID={this.state?.activeVariableID}
						activeVariableName={this.state?.activeVariableName}
						subBlockID={this.state?.subBlockID}
						variables={this.state?.variables}
						client={this.props.client}
						tables={this.state?.tables}
						handleServiceSelect={(block, type, value) =>
							this.props.handleServiceSelectP(block, type, value, section?._id)
						}
						setTable={(e) => this.props.setTableP(e)}
						imgSettingData={(e) => this.props.imgSettingDataP(e)}
						selectBlock={(e) => this.props.selectBlockP(e)}
						activeSection={this.props?.activeSection}
						setActiveSection={(e) => this.props.setActiveSectionP(e)}
						activeSubBlockId={this.state?.activeSubBlockId}
						serviceTableSubBlock={(e) => {
							this.props?.serviceTableSubBlockP(e);
						}}
						handleDeleteServiceBlock={(e, f) =>
							this.props.handleDeleteServiceBlockP(e, f)
						}
						setServiceBlock={(e, f, g, h) => this.props.setServiceBlockP(e, f, g, h)}
						duplicateBlock={(e) => this.props.duplicateBlockP(e)}
						duplicateServiceBlock={(e, f, g) =>
							this.props.duplicateServiceBlockP(e, f, g)
						}
						section={section}
						isActiveSection={this.state?.activeSectionID == section._id}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						handleUpdateSectionData={this.props?.handleUpdateSectionDataP}
						restrictServiceSelection={this.state?.restrictServiceSelection}
						clearStyle={() => this.props.clearStyleP()}
						backgroundType={section?.style?.backgroundType}
						backgroundImageURL={section?.style?.backgroundImageURL}
						backgroundVideoURL={section?.style?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						module={this.props.module}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						activeModule={this.state?.activeModule}
						isWorkflow={this.state.isWorkflow}
						generateAIImages={(e) => this.props?.generateAIImagesP(e)}
						generateAIText={(e) => this.props?.generateAITextP(e)}
					/>
				);
			case 'events':
				return (
					<Events
						key={index}
						_id={section?._id}
						blocks={section?.blocks}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id, false)}
						showAddBlock={(e) => this.showAddBlockP(e, section?.order, index)}
						index={section.order}
						itemsLength={this.state?.sections?.length}
						// moveDirection={moveDirection}

						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						activeImage={(
							sectionID,
							blockID,
							subBlockID,
							imageURL,
							dimensions,
							ImgSubBlock,
						) =>
							this.props.activeImageP(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							)
						}
						handleSetTab={(e) =>
							this.state?.preview ? '' : this.props.handleSetTabP(e)
						}
						client={this.props?.client}
						tables={this.state?.tables}
						selectBlock={(e) => this.props.selectBlockP(e)}
						isActiveSection={this.state?.activeSectionID == section._id}
						tablesValuesforClient={this.state?.tablesValuesforClient}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						backgroundType={section?.style?.backgroundType}
						backgroundImageURL={section?.style?.backgroundImageURL}
						backgroundVideoURL={section?.style?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeModule={this.state?.activeModule}
						isWorkflow={this.state.isWorkflow}
						generateAIImages={(e) => this.props?.generateAIImagesP(e)}
						generateAIText={(e) => this.props?.generateAITextP(e)}
					/>
				);
			case 'form-q&a':
				return (
					<FormQandA
						isWorkflow={this.state.isWorkflow}
						setTriggerFont={(e) => this.props.setTriggerFontP(e)}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggerFont={this.state?.triggerFont}
						triggeredFont={this.state?.triggeredFont}
						activeSubBlockId={this.state?.activeSubBlockId}
						key={index}
						module={this.props?.module}
						_id={section?._id}
						sections={[section]}
						blocks={section?.blocks}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id)}
						showAddBlock={(e) => this.props?.showAddBlockP(e, section?.order, index)}
						isActiveSection={
							this.props.client ? false : this.state.activeSectionID == section._id
						}
						index={section?.order}
						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						setSubBlockContent={(content, sectionID, blockID, id) =>
							this.props.setSubBlockContentP(content, sectionID, blockID, id)
						}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						handleSetTab={(e, subBlockID, blockID) =>
							this.state?.preview
								? ''
								: this.props.handleSetTabP(e, subBlockID, blockID)
						}
						activeVariableID={this.state?.activeVariableID}
						activeVariableName={this.state?.activeVariableName}
						subBlockID={this.state?.subBlockID}
						variables={this.state?.variables}
						client={this.props?.client}
						selectBlock={(e) => this.props.selectBlockP(e)}
						duplicateBlock={(e) => this.props.duplicateBlockP(e)}
						handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
						sectionType={section?.type}
						setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
						circleTextData={(e) => this.props.circleTextDataP(e)}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						clearStyle={() => this.props.clearStyleP()}
						handleIsValidURL={(e) => {
							this.props.client ? '' : this.props.handleIsValidURLP(e);
						}}
						backgroundType={this.props.activeSection?.style?.backgroundType}
						backgroundImageURL={this.props?.activeSection?.style?.backgroundImageURL}
						backgroundVideoURL={this.state?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						tenantLogo={this.props?.tenantLogo}
						isTenantLogo={this.state?.isTenantLogo}
						contractVariables={this.state?.contractVariables}
						uploadImageBase64={(e) => this.props.uploadImageBase64P(e)}
						tables={this.state?.tables}
						socialMediaLinks={this.state?.socialMediaLinks}
						handleSetIconLink={(e, subBlockID, blockID) =>
							this.props.handleSetIconLinkP(e, subBlockID, blockID)
						}
						activeModule={this.state?.activeModule}
						submitFormLoading={this.props.submitFormLoading}
						setFSections={(e, restrict = null) => this.props.setFSectionsP(e, restrict)}
						deleteFBlock={(blockID, sectionID) =>
							this.props?.deleteFBlockP(blockID, sectionID)
						}
						addQues={(sectionID, blockOrder) =>
							this.props?.addQuesP(sectionID, blockOrder)
						}
						handleSetFSideBar={(e, blockID) =>
							this.props?.handleSetFSideBarP(e, blockID)
						}
						addOptionForm={(e) => this.props?.addOptionFormP(e)}
						handleFormAnswer={(answer, key, order) =>
							this.props?.handleFormAnswerP(answer, key, order)
						}
						submitForm={(e, sectionId) => this.props?.submitFormP(e, sectionId)}
					/>
				);
			case 'contract-with-signature':
				return (
					<Signaiture
						setTriggerFont={(e) => this.props.setTriggerFontP(e)}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state?.triggeredFont}
						activeSubBlockId={this.state?.activeSubBlockId}
						key={index}
						module={this.props?.module}
						_id={section?._id}
						blocks={section?.blocks}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						triggerFont={this.state?.triggerFont}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id)}
						showAddBlock={(e) => this.props?.showAddBlockP(e, section?.order, index)}
						isActiveSection={
							this.props.client ? false : this.state.activeSectionID == section._id
						}
						index={section?.order}
						// itemsLength={arr.length}
						// moveDirection={moveDirection}

						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						setSubBlockContent={(content, sectionID, blockID, id) =>
							this.props.setSubBlockContentP(content, sectionID, blockID, id)
						}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						activeImage={(
							sectionID,
							blockID,
							subBlockID,
							imageURL,
							dimensions,
							ImgSubBlock,
						) =>
							this.props.activeImageP(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							)
						}
						handleSetTab={(e, subBlockID, blockID) =>
							this.state?.preview
								? ''
								: this.props.handleSetTabP(e, subBlockID, blockID)
						}
						activeVariableID={this.state?.activeVariableID}
						activeVariableName={this.state?.activeVariableName}
						subBlockID={this.state?.subBlockID}
						variables={this.state?.variables}
						client={this.props?.client}
						setContractActiveVariable={(e) =>
							this.props.client == true
								? ''
								: this.props.setContractActiveVariableP(e)
						}
						handlesetActiveShape={(e) => this.props.handlesetActiveShapeP(e)}
						setButtonLink={(e) => this.props.setButtonLinkP(e)}
						setNewTab={(e) => this.props.setNewTabP(e)}
						setButtonStyles={(e) => this.props.setButtonStylesP(e)}
						btShape={(e) => this.props.btShapeP(e)}
						imgSettingData={(e) => this.props.imgSettingDataP(e)}
						selectBlock={(e) => this.props.selectBlockP(e)}
						duplicateBlock={(e) => this.props.duplicateBlockP(e)}
						handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
						sectionType={section?.type}
						setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
						circleTextData={(e) => this.props.circleTextDataP(e)}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						clearStyle={() => this.props.clearStyleP()}
						handleIsValidURL={(e) => {
							this.props.client ? '' : this.props.handleIsValidURLP(e);
						}}
						backgroundType={this.props.activeSection?.style?.backgroundType}
						backgroundImageURL={this.props?.activeSection?.style?.backgroundImageURL}
						backgroundVideoURL={this.state?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						tenantLogo={this.props?.tenantLogo}
						isTenantLogo={this.state?.isTenantLogo}
						contractVariables={this.state?.contractVariables}
						uploadImageBase64={(e) => this.props.uploadImageBase64P(e)}
						tables={this.state?.tables}
						sections={this.state?.sections}
						socialMediaLinks={this.state?.socialMediaLinks}
						handleSetIconLink={(e, subBlockID, blockID) =>
							this.props.handleSetIconLinkP(e, subBlockID, blockID)
						}
						activeModule={this.state?.activeModule}
						isWorkflow={this.state.isWorkflow}
						contractBg={this.props.contractBg}
						signatures={this.props.signatures}
						toggleSignatureModal={this.props?.toggleSignatureModalP}
						handleActiveCurrentSignatureSubBlock={(e) =>
							this.setState(
								{
									activeCurrentSignatureSubBlock: e,
								},
								() => {
									this.props?.handleActiveCurrentSignatureSubBlockP(e);
								},
							)
						}
						version={this.props.version}
					/>
				);
			case 'invoice-with-payment':
				return (
					<PaymentSchedule
						setTriggerFont={(e) => this.props.setTriggerFontP(e)}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state?.triggeredFont}
						activeSubBlockId={this.state?.activeSubBlockId}
						key={index}
						module={this.props?.module}
						_id={section?._id}
						blocks={section?.blocks}
						paymentSchedule={section?.blocks}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						triggerFont={this.state?.triggerFont}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id)}
						showAddBlock={(e) => this.props?.showAddBlockP(e, section?.order, index)}
						isActiveSection={
							this.props.client ? false : this.state.activeSectionID == section._id
						}
						index={section?.order}
						// itemsLength={arr.length}
						// moveDirection={moveDirection}

						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						setSubBlockContent={(content, sectionID, blockID, id) =>
							this.props.setSubBlockContentP(content, sectionID, blockID, id)
						}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						handleSetTab={(e, subBlockID, blockID) =>
							this.state?.preview
								? ''
								: this.props.handleSetTabP(e, subBlockID, blockID)
						}
						activeVariableID={this.state?.activeVariableID}
						activeVariableName={this.state?.activeVariableName}
						subBlockID={this.state?.subBlockID}
						variables={this.state?.variables}
						client={this.props?.client}
						selectBlock={(e) => this.props.selectBlockP(e)}
						duplicateBlock={(e) => this.props.duplicateBlockP(e)}
						handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
						sectionType={section?.type}
						setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						clearStyle={() => this.props.clearStyleP()}
						handleIsValidURL={(e) => {
							this.props.client ? '' : this.props.handleIsValidURLP(e);
						}}
						backgroundType={this.props.activeSection?.style?.backgroundType}
						backgroundImageURL={this.props?.activeSection?.style?.backgroundImageURL}
						backgroundVideoURL={this.state?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						tenantLogo={this.props?.tenantLogo}
						isTenantLogo={this.state?.isTenantLogo}
						tables={this.state?.tables}
						sections={this.state?.sections}
						socialMediaLinks={this.state?.socialMediaLinks}
						handleSetIconLink={(e, subBlockID, blockID) =>
							this.props.handleSetIconLinkP(e, subBlockID, blockID)
						}
						activeModule={this.state?.activeModule}
						isWorkflow={this.state.isWorkflow}
						setPaymentSchedule={(e) => {
							this.props?.setPaymentScheduleP(e, section?._id);
						}}
						addPaymentScheduleBlock={(id, order) =>
							this.props?.addPaymentScheduleBlockP(id, order)
						}
					/>
				);
			case 'invoice':
				return (
					<InvoiceWrapper
						setTriggerFont={(e) => this.props.setTriggerFontP(e)}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state?.triggeredFont}
						activeSubBlockId={this.state?.activeSubBlockId}
						key={index}
						module={this.props?.module}
						_id={section?._id}
						blocks={section?.blocks}
						section={section}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						triggerFont={this.state?.triggerFont}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id)}
						showAddBlock={(e) => this.props?.showAddBlockP(e, section?.order, index)}
						isActiveSection={
							this.props.client ? false : this.state.activeSectionID == section._id
						}
						index={section?.order}
						// itemsLength={arr.length}
						// moveDirection={moveDirection}

						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						setSubBlockContent={(content, sectionID, blockID, id) =>
							this.props.setSubBlockContentP(content, sectionID, blockID, id)
						}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						activeImage={(
							sectionID,
							blockID,
							subBlockID,
							imageURL,
							dimensions,
							ImgSubBlock,
						) =>
							this.props.activeImageP(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							)
						}
						handleSetTab={(e, subBlockID, blockID) =>
							this.state?.preview
								? ''
								: this.props.handleSetTabP(e, subBlockID, blockID)
						}
						activeVariableID={this.state?.activeVariableID}
						activeVariableName={this.state?.activeVariableName}
						subBlockID={this.state?.subBlockID}
						variables={this.state?.variables}
						client={this.props?.client}
						selectBlock={(e) => this.props.selectBlockP(e)}
						duplicateBlock={(e) => this.props.duplicateBlockP(e)}
						handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
						sectionType={section?.type}
						setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
						circleTextData={(e) => this.props.circleTextDataP(e)}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						clearStyle={() => this.props.clearStyleP()}
						handleIsValidURL={(e) => {
							this.props.client ? '' : this.props.handleIsValidURLP(e);
						}}
						backgroundType={this.props.activeSection?.style?.backgroundType}
						backgroundImageURL={this.props?.activeSection?.style?.backgroundImageURL}
						backgroundVideoURL={this.state?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						tenantLogo={this.props?.tenantLogo}
						isTenantLogo={this.state?.isTenantLogo}
						tables={this.state?.tables}
						sections={this.state?.sections}
						activeModule={this.state?.activeModule}
						isWorkflow={this.state.isWorkflow}
						invoiceDetails={this.props?.invoiceDetails}
						paymentSchedule={this.props?.paymentSchedule}
						showSchedule={this.props?.showSchedule}
						invoiceClientVariables={this.props?.invoiceClientVariables}
						invoiceNumber={this.props?.invoiceNumber}
						handleInvoiceNumber={(e) => this.props?.handleInvoiceNumberP(e)}
						currencySymbol={this.props?.currencySymbol}
						activeFontColor={this.state?.activeFontColor}
						currencySymbol2={this.props?.currencySymbol2}
					/>
				);
			case 'table':
				return (
					<Table
						setTriggerFont={(e) => this.props.setTriggerFontP(e)}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state?.triggeredFont}
						activeSubBlockId={this.state?.activeSubBlockId}
						key={index}
						module={this.props?.module}
						_id={section?._id}
						blocks={section?.blocks}
						style={section?.style}
						actionType={this.state?.actionType}
						actionValue={this.state?.actionValue}
						triggerFont={this.state?.triggerFont}
						handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id)}
						showAddBlock={(e) => this.props?.showAddBlockP(e, section?.order, index)}
						isActiveSection={
							this.props.client ? false : this.state.activeSectionID == section._id
						}
						index={section?.order}
						// itemsLength={arr.length}
						// moveDirection={moveDirection}

						handleBSelection={(e, activeTextBlock) =>
							this.props.handleBSelectionP(e, activeTextBlock)
						}
						activeSectionID={this.state?.activeSectionID}
						activeTextBlock={this.state?.activeTextBlock}
						deleteSection={(e) => this.props?.deleteSectionP(e)}
						setSubBlockContent={(content, sectionID, blockID, id) =>
							this.props.setSubBlockContentP(content, sectionID, blockID, id)
						}
						preview={this.state?.preview}
						previewType={this.state?.previewType}
						activeImage={(
							sectionID,
							blockID,
							subBlockID,
							imageURL,
							dimensions,
							ImgSubBlock,
						) =>
							this.props.activeImageP(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							)
						}
						handleSetTab={(e, subBlockID, blockID) =>
							this.state?.preview
								? ''
								: this.props.handleSetTabP(e, subBlockID, blockID)
						}
						activeVariableID={this.state?.activeVariableID}
						activeVariableName={this.state?.activeVariableName}
						subBlockID={this.state?.subBlockID}
						variables={this.state?.variables}
						client={this.props?.client}
						setContractActiveVariable={(e) =>
							this.props.client == true
								? ''
								: this.props.setContractActiveVariableP(e)
						}
						handlesetActiveShape={(e) => this.props.handlesetActiveShapeP(e)}
						setButtonLink={(e) => this.props.setButtonLinkP(e)}
						setNewTab={(e) => this.props.setNewTabP(e)}
						setButtonStyles={(e) => this.props.setButtonStylesP(e)}
						btShape={(e) => this.props.btShapeP(e)}
						imgSettingData={(e) => this.props.imgSettingDataP(e)}
						selectBlock={(e) => this.props.selectBlockP(e)}
						duplicateBlock={(e) => this.props.duplicateBlockP(e)}
						handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
						sectionType={section?.type}
						setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
						circleTextData={(e) => this.props.circleTextDataP(e)}
						activeAnimation={section?.style?.isAnimation}
						animationSpeed={section?.style?.animationSpeed}
						animationDirection={section?.style?.animationDirection}
						animationType={section?.style?.animationType}
						clearStyle={() => this.props.clearStyleP()}
						handleIsValidURL={(e) => {
							this.props.client ? '' : this.props.handleIsValidURLP(e);
						}}
						backgroundType={this.props.activeSection?.style?.backgroundType}
						backgroundImageURL={this.props?.activeSection?.style?.backgroundImageURL}
						backgroundVideoURL={this.state?.backgroundVideoURL}
						handleIsValidBgVideoURL={(e) => {
							this.props.handleIsValidBgVideoURLP(e);
						}}
						tenantLogo={this.props?.tenantLogo}
						isTenantLogo={this.state?.isTenantLogo}
						contractVariables={this.state?.contractVariables}
						uploadImageBase64={(e) => this.props.uploadImageBase64P(e)}
						tables={this.state?.tables}
						sections={this.state?.sections}
						setActiveSection={(e) => this.props.setActiveSectionP(e)}
						activeModule={this.state?.activeModule}
						isWorkflow={this.state.isWorkflow}
						section={section}
						DeleteInTable={(type, index) => this.props?.DeleteInTableP(type, index)}
						AddInTable={(type, index, position, length = 0) =>
							this.props?.AddInTableP(type, index, position, length)
						}
						DuplicateInTable={(type, index) =>
							this.props?.DuplicateInTableP(type, index)
						}
					/>
				);
			default:
				if (section?.isFluidSection) {
					return (
						<FluidLayout
							isWorkflow={this.state.isWorkflow}
							duplicateSubBlock={(json, subBlockId) =>
								this.props?.duplicateSubBlockP(json, subBlockId, section?._id)
							}
							saveSections={(e, restrict = null) =>
								this.props.saveSectionsP(e, restrict)
							}
							previewMode={this.props.previewMode}
							handleAddElement={(e, zIndex) =>
								this.props?.handleAddElementP(e, zIndex)
							}
							setLastClick={(e) => this.props?.setLastClickP(e)}
							handleSaveblocks={(e) => this.props?.handleSaveblocksP(e)}
							setTriggerFont={(e) => this.props.setTriggerFontP(e)}
							setTriggeredFont={(e) =>
								this.setState({
									triggeredFont: e,
								})
							}
							setActiveSection={(e) => this.props.setActiveSectionP(e)}
							triggeredFont={this.state?.triggeredFont}
							activeSubBlockId={this.state?.activeSubBlockId}
							key={index}
							module={this.props?.module}
							_id={section?._id}
							blocks={section?.blocks}
							style={section?.style}
							section={section}
							actionType={this.state?.actionType}
							actionValue={this.state?.actionValue}
							triggerFont={this.state?.triggerFont}
							handleSideBar={(e, _id) => {
								this.props.handleOpenSideBar(e, _id, false, true);
							}}
							showAddBlock={(e) =>
								this.props?.showAddBlockP(e, section?.order, index)
							}
							showAddElement={(e) =>
								this.props?.showAddElementP(
									e,
									section?.order,
									index,
									true,
									section._id,
								)
							}
							isActiveSection={
								this.props.client
									? false
									: this.state.activeSectionID == section._id
							}
							index={section?.order}
							// itemsLength={arr.length}
							// moveDirection={moveDirection}

							handleBSelection={(e, activeTextBlock) =>
								this.props.handleBSelectionP(e, activeTextBlock)
							}
							activeSectionID={this.state?.activeSectionID}
							activeTextBlock={this.state?.activeTextBlock}
							deleteSection={(e) => this.props?.deleteSectionP(e)}
							setSubBlockContent={(content, sectionID, blockID, id) =>
								this.props.setSubBlockContentP(content, sectionID, blockID, id)
							}
							preview={this.state?.preview}
							previewType={this.state?.previewType}
							activeImage={(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							) =>
								this.props.activeImageP(
									sectionID,
									blockID,
									subBlockID,
									imageURL,
									dimensions,
									ImgSubBlock,
								)
							}
							handleSetTab={(e, subBlockID, blockID) =>
								this.state?.preview
									? ''
									: this.props.handleSetTabP(e, subBlockID, blockID)
							}
							activeVariableID={this.state?.activeVariableID}
							activeVariableName={this.state?.activeVariableName}
							subBlockID={this.state?.subBlockID}
							variables={this.state?.variables}
							client={this.props?.client}
							setContractActiveVariable={(e) =>
								this.props.client == true
									? ''
									: this.props.setContractActiveVariableP(e)
							}
							handlesetActiveShape={(e) => this.props.handlesetActiveShapeP(e)}
							setButtonLink={(e) => this.props.setButtonLinkP(e)}
							setNewTab={(e) => this.props.setNewTabP(e)}
							setButtonStyles={(e) => this.props.setButtonStylesP(e)}
							btShape={(e) => this.props.btShapeP(e)}
							imgSettingData={(e) => this.props.imgSettingDataP(e)}
							selectBlock={(e) => this.props.selectBlockP(e)}
							duplicateBlock={(e) => this.props.duplicateBlockP(e)}
							handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
							sectionType={section?.type}
							setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
							circleTextData={(e) => this.props.circleTextDataP(e)}
							activeAnimation={section?.style?.isAnimation}
							animationSpeed={section?.style?.animationSpeed}
							animationDirection={section?.style?.animationDirection}
							animationType={section?.style?.animationType}
							clearStyle={() => this.props.clearStyleP()}
							handleIsValidURL={(e) => {
								this.props.client ? '' : this.props.handleIsValidURLP(e);
							}}
							backgroundType={this.props.activeSection?.style?.backgroundType}
							backgroundImageURL={
								this.props?.activeSection?.style?.backgroundImageURL
							}
							backgroundVideoURL={this.state?.backgroundVideoURL}
							handleIsValidBgVideoURL={(e) => {
								this.props.handleIsValidBgVideoURLP(e);
							}}
							tenantLogo={this.props?.tenantLogo}
							isTenantLogo={this.state?.isTenantLogo}
							contractVariables={this.state?.contractVariables}
							uploadImageBase64={(e) => this.props.uploadImageBase64P(e)}
							generateAIImages={(e) => this.props?.generateAIImagesP(e)}
							generateAIText={(e) => this.props?.generateAITextP(e)}
							tables={this.state?.tables}
							sections={this.state?.sections}
							socialMediaLinks={this.state?.socialMediaLinks}
							handleSetIconLink={(e, subBlockID, blockID) =>
								this.props.handleSetIconLinkP(e, subBlockID, blockID)
							}
							activeModule={this.state?.activeModule}
							handleAddLayout={(e, isFluid, isService) =>
								this.props.handleAddLayout(e, isFluid, isService)
							}
							activeModuleId={this.props?.activeModuleId}
							handleSaveSingleBlock={(e) => this.props.handleSaveSingleBlock(e)}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
						/>
					);
				} else {
					return (
						<Layout
							setTriggerFont={(e) => this.props.setTriggerFontP(e)}
							setTriggeredFont={(e) =>
								this.setState({
									triggeredFont: e,
								})
							}
							triggeredFont={this.state?.triggeredFont}
							activeSubBlockId={this.state?.activeSubBlockId}
							key={index}
							module={this.props?.module}
							_id={section?._id}
							blocks={section?.blocks}
							style={section?.style}
							actionType={this.state?.actionType}
							actionValue={this.state?.actionValue}
							triggerFont={this.state?.triggerFont}
							handleSideBar={(e, _id) => this.props.handleSideBarP(e, _id)}
							showAddBlock={(e) =>
								this.props?.showAddBlockP(e, section?.order, index)
							}
							isActiveSection={
								this.props.client
									? false
									: this.state.activeSectionID == section._id
							}
							index={section?.order}
							// itemsLength={arr.length}
							// moveDirection={moveDirection}

							handleBSelection={(e, activeTextBlock) =>
								this.props.handleBSelectionP(e, activeTextBlock)
							}
							activeSectionID={this.state?.activeSectionID}
							activeTextBlock={this.state?.activeTextBlock}
							deleteSection={(e) => this.props?.deleteSectionP(e)}
							setSubBlockContent={(content, sectionID, blockID, id) =>
								this.props.setSubBlockContentP(content, sectionID, blockID, id)
							}
							preview={this.state?.preview}
							previewType={this.state?.previewType}
							activeImage={(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							) =>
								this.props.activeImageP(
									sectionID,
									blockID,
									subBlockID,
									imageURL,
									dimensions,
									ImgSubBlock,
								)
							}
							handleSetTab={(e, subBlockID, blockID) =>
								this.state?.preview
									? ''
									: this.props.handleSetTabP(e, subBlockID, blockID)
							}
							activeVariableID={this.state?.activeVariableID}
							activeVariableName={this.state?.activeVariableName}
							subBlockID={this.state?.subBlockID}
							variables={this.state?.variables}
							client={this.props?.client}
							setContractActiveVariable={(e) =>
								this.props.client == true
									? ''
									: this.props.setContractActiveVariableP(e)
							}
							handlesetActiveShape={(e) => this.props.handlesetActiveShapeP(e)}
							setButtonLink={(e) => this.props.setButtonLinkP(e)}
							setNewTab={(e) => this.props.setNewTabP(e)}
							setButtonStyles={(e) => this.props.setButtonStylesP(e)}
							btShape={(e) => this.props.btShapeP(e)}
							imgSettingData={(e) => this.props.imgSettingDataP(e)}
							selectBlock={(e) => this.props.selectBlockP(e)}
							duplicateBlock={(e) => this.props.duplicateBlockP(e)}
							handleSetBlockTab={(e) => this.props.handleSetBlockTabP(e)}
							sectionType={section?.type}
							setTab={(e) => (this.state.preview ? '' : this.props.setTabP(e))}
							circleTextData={(e) => this.props.circleTextDataP(e)}
							activeAnimation={section?.style?.isAnimation}
							animationSpeed={section?.style?.animationSpeed}
							animationDirection={section?.style?.animationDirection}
							animationType={section?.style?.animationType}
							clearStyle={() => this.props.clearStyleP()}
							handleIsValidURL={(e) => {
								this.props.client ? '' : this.props.handleIsValidURLP(e);
							}}
							backgroundType={this.props.activeSection?.style?.backgroundType}
							backgroundImageURL={
								this.props?.activeSection?.style?.backgroundImageURL
							}
							backgroundVideoURL={this.state?.backgroundVideoURL}
							handleIsValidBgVideoURL={(e) => {
								this.props.handleIsValidBgVideoURLP(e);
							}}
							tenantLogo={this.props?.tenantLogo}
							isTenantLogo={this.state?.isTenantLogo}
							contractVariables={this.state?.contractVariables}
							uploadImageBase64={(e) => this.props.uploadImageBase64P(e)}
							generateAIImages={(e) => this.props?.generateAIImagesP(e)}
							generateAIText={(e) => this.props?.generateAITextP(e)}
							tables={this.state?.tables}
							sections={this.state?.sections}
							socialMediaLinks={this.state?.socialMediaLinks}
							handleSetIconLink={(e, subBlockID, blockID) =>
								this.props.handleSetIconLinkP(e, subBlockID, blockID)
							}
							activeModule={this.state?.activeModule}
							isWorkflow={this.state.isWorkflow}
							iframeScroll={this.props?.iframeScroll}
						/>
					);
				}
		}
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlockP(e, this.state?.activeOrderNo, this.state?.activeKey);
	};

	// function for presentation layout drag and drop
	onDragEnd = (result) => {
		const { destination, source } = result;

		if (!destination) return; // If dropped outside the list
		if (destination.index === source.index) return; // No change in position

		const reorderedSections = Array.from(this.state.sections);
		const [movedItem] = reorderedSections.splice(source.index, 1);
		reorderedSections.splice(destination.index, 0, movedItem);
		// let arr = [];
		// _.map(reorderedSections, (section, key) => {
		// 	section.order = key + 1;
		// 	arr.push(section);
		// });
		// this.setState({ sections: reorderedSections }, () => {

		// 		this.props?.onDragEndP(arr);

		// });

		const updatedSections = reorderedSections.map((section, index) => ({
			...section,
			order: index + 1,
		}));

		// Update state synchronously
		this.setState(
			{
				sections: updatedSections,
				activeKey: destination.index,
				activeStyle: updatedSections[destination.index]?.style,
			},
			() => {
				this.props?.onDragEndP(updatedSections);
			},
		);
	};

	getOppositeHexColor = (hex) => {
		// Normalize the hex color (e.g., remove `#` if present)
		const normalizedHex = hex?.startsWith('#') ? hex.slice(1) : hex;

		// Convert the hex to a decimal value, invert the color, and pad it back to hex
		const invertedHex = (0xffffff ^ parseInt(normalizedHex, 16)).toString(16).padStart(6, '0');

		// Return the opposite color in hex format with `#`
		return `#${invertedHex}`;
	};
	hexToRgba = (hex, alpha = 1) => {
		// Remove the '#' if present
		hex = hex.replace('#', '');

		// Parse the hex components
		const r = parseInt(hex.substring(0, 2), 16); // Red
		const g = parseInt(hex.substring(2, 4), 16); // Green
		const b = parseInt(hex.substring(4, 6), 16); // Blue

		// Return RGBA string
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};
	render() {
		return (
			<div className="presentation_container">
				{this.state?.preview !== true && !this.state?.previewType?.includes('m') && (
					<div className="left-layouts-bar">
						<DragDropContext onDragEnd={this.onDragEnd} transitionDuration={50}>
							<Droppable droppableId="sections" isCombineEnabled={true}>
								{(provided) => (
									<div
										className="sections-thumbnail-container"
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{this.state?.sections?.length > 0 &&
											this.state?.sections?.map((section, index) => {
												this.sectionRefs[index] =
													this.sectionRefs[index] || React.createRef();
												return (
													<Draggable
														key={section._id}
														draggableId={section._id}
														index={index}
													>
														{(provided, snapshot) => (
															<div
																// className="section-thumbnail-row"
																ref={(el) => {
																	provided.innerRef(el); // Pass the innerRef
																	this.sectionRefs[index] = el; // Assign custom ref if needed
																}} // Attach ref here
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																onClick={() =>
																	this.setState({
																		activeKey: index,
																		activeOrderNo:
																			section?.order,
																		activeStyle: section?.style,
																	})
																}
																className={`section-thumbnail-row ${
																	snapshot.isDragging
																		? 'dragging'
																		: ''
																}`}
															>
																<div
																	className={`line-div ${
																		this.state.activeKey ===
																		index
																			? 'active-p-line'
																			: ''
																	}`}
																></div>
																<span className="section-number">
																	{index + 1}
																</span>

																<div
																	className={`section-thumbnail ${
																		this.state.activeKey ===
																		index
																			? 'active-section-thumbnail'
																			: ''
																	}`}
																	style={{
																		backgroundColor:
																			section?.style
																				?.sectionBackgroundColor ||
																			'#000000',
																	}}
																>
																	<div
																		style={{
																			display: 'block',
																			zoom:
																				section?.type ===
																				'services'
																					? 0.2
																					: section?.type ===
																					  'events'
																					? 0.3
																					: 0.1,
																			pointerEvents: 'none',
																		}}
																		data-section-id={
																			section?._id
																		}
																		data-block-id={
																			section?.type
																		}
																	>
																		{this.renderLayout(
																			section,
																			index,
																		)}
																	</div>
																</div>
															</div>
														)}
													</Draggable>
												);
											})}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
						<div className="add-section-button">
							<button onClick={(e) => this.hanldeAddBlock(e)}>+ Add Slide</button>
						</div>
					</div>
				)}
				<div
					className="p-layouts-wrapper"
					style={{ width: this.state?.preview ? '100%' : '85%' }}
				>
					{(this.state?.preview || this.state?.previewType?.includes('m')) && (
						<div
							className="p-h-row-container"
							style={{
								backgroundColor:
									this.state?.activeStyle?.backgroundType !== 'image' &&
									this.state?.activeStyle?.backgroundType !== 'video'
										? this.state?.activeStyle?.sectionBackgroundColor
										: '',
							}}
						>
							<div
								className="p-h-row"
								style={{
									gap: this.state?.previewType === 'm' ? '1px' : '10px',
									overflow: this.state?.previewType === 'm' ? 'auto' : 'visible',
									width: this.state?.previewType !== 'm' ? '100%' : '90%',
								}}
							>
								{this.state?.sections?.length > 0 &&
									this.state?.sections?.map((section, index) => {
										const totalWidth =
											this.state?.previewType !== 'm'
												? window.innerWidth
												: 420; // Screen width or container width
										const lineWidth =
											this.state?.previewType === 'm'
												? `${totalWidth / this.state?.sections?.length}px`
												: '60px'; // Default width for other preview types

										return (
											<div
												className="p-h-row-item"
												key={index}
												onMouseEnter={() =>
													this.setState({ hoverKey: index })
												}
												onMouseLeave={() =>
													this.setState({ hoverKey: null })
												}
												onClick={() =>
													this.setState({
														activeKey: index,
														activeStyle: section?.style,
													})
												}
												style={{
													height:
														this.state?.previewType === 'm'
															? '20px'
															: '50px',
												}}
											>
												<div
													className="p-h-row-line"
													style={{
														backgroundColor:
															this.state?.activeStyle
																?.backgroundType !== 'image' &&
															this.state?.activeStyle
																?.backgroundType !== 'video'
																? this.state?.activeKey >= index
																	? this.getOppositeHexColor(
																			_.has(
																				this.state
																					?.activeStyle,
																				'sectionBackgroundColor',
																			)
																				? this.state
																						?.activeStyle
																						?.sectionBackgroundColor
																				: '#ffffff',
																	  )
																	: this.hexToRgba(
																			this.getOppositeHexColor(
																				_.has(
																					this.state
																						?.activeStyle,
																					'sectionBackgroundColor',
																				)
																					? this.state
																							?.activeStyle
																							?.sectionBackgroundColor
																					: '#ffffff',
																			),
																			0.3,
																	  )
																: this.state?.activeKey >= index
																? '#202123'
																: '#20212333',
														width: lineWidth,
													}}
												></div>
											</div>
										);
									})}
							</div>
						</div>
					)}
					{this.state?.sections?.length > 0 ? (
						this.state?.sections?.map((section, index) => {
							if (index == this.state?.activeKey) {
								return (
									<div
										// ref={(el) => {
										// 	if (el) {
										// 		this.blockRefs.current[index] = el; // Assign DOM element to the ref array
										// 		this.blockRefsStore[index] = el;
										// 	}
										// }}
										key={index}
										style={{ display: 'block' }}
										data-section-id={section?._id}
										data-block-id={section?.type}
									>
										{this.renderLayout(section, index)}
									</div>
								);
							}
						})
					) : (
						<div className="empty_builder">
							<span>
								<Edit />
							</span>
							<p>We're waiting for your next masterpiece</p>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Presentation;
