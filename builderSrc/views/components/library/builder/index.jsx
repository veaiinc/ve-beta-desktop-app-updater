import React, { Component, createRef } from 'react';
import './builder.scss';
// import AddBlock from '../addBlock';
import ContractSignature from '../signatureModal';
import AcceptProposalModal from '../signatureModal/AcceptModal';
import _ from 'lodash';
import Layout from '../layouts';
import FluidLayout from '../layouts/canvas';
import ServicesLayout from '../layouts/services/index';
import Events from '../layouts/events';
import Form from '../layouts/forms';
import FormQandA from '../layouts/formQ&A';
import Invoice from '../layouts/invoices';
import Summary from '../layouts/summary';
import moment from 'moment';
import Presentation from '../layouts/presentation';
import Table from '../layouts/Tables';
import Signature from '../layouts/contract';
import SummaryWrapper from '../layouts/summaryWrapper/index';
import FormWrapper from '../layouts/FormWraper';
import ContractModule from '../layouts/contract/contract_module';
import PaymentSchedule from '../layouts/paymentSchedule';
import InvoiceWrapper from '../layouts/invoiceWrapper';
import SchedulerWrapper from '../layouts/SchedulerWrapper';

//! Abdullah - animations
import './animations.scss';
import NavbarWrapper from '../layouts/NabarWrapper/Navbarwrapper';
import MobileNavbarComponent from '../layouts/NabarWrapper/MobileNavbar';

class Builder extends Component {
	constructor(props) {
		super();
		this.state = {
			invoiceTables: props.invoiceTables,
			previewMode: props?.previewMode,
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
			showAcceptProposalModal: false,
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

			contractBg: '',
			summaryBg: props?.summaryBg,
			summaryFont: props?.summaryFont,
			summaryFontColor: props?.summaryFontColor,
			summaryFontSize: props?.summaryFontSize,
			eventsLabel: props?.eventsLabel,
			paymentsLabel: props?.paymentsLabel,
			summaryBlock: props?.summaryBlock,
			paymentSchedule: props?.paymentSchedule,
			showSchedule: props?.showSchedule,
			invoiceNumber: props?.invoiceNumber,
			invoiceClientVariables: props?.invoiceClientVariables,
			socialMediaLinks: props?.socialMediaLinks,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			iframeScroll: props?.iframeScroll,

			activeModule: props?.activeModule,
			isWorkflow: props?.isWorkflow,
			activeCurrentSignatureSubBlock: null,
			globalSummaryData: props?.globalSummaryData,
			fluidShowGrid: props?.fluidShowGrid,
			smartFilePreview: props?.smartFilePreview,
			modules: props?.modules,
			duplicateModules: props?.duplicateModules,

			justifyleft: props.justifyleft,
			justifycenter: props.justifycenter,
			justifyright: props.justifyright,
			justifyfull: props.justifyfull,
			showMobileMenu: false,
			showReverceAnimation: false,
			grandTotal: 0,
			blurBuilder: false,
			isformv1: false,
		};
		this.ref = createRef();
		this.blockRefs = React.createRef(); // Create a ref
		this.blockRefs.current = []; //

		this.blockRefsStore = []; // Array to store refs for each block
		this.observer = null; // Observer to track visibility
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeFontColor !== nextProps.activeFontColor) {
			this.setState({
				activeFontColor: nextProps.activeFontColor,
			});
		}
		if (this.state.fluidShowGrid !== nextProps.fluidShowGrid) {
			this.setState({
				fluidShowGrid: nextProps.fluidShowGrid,
			});
		}
		if (this.state.invoiceTables !== nextProps.invoiceTables) {
			this.setState({
				invoiceTables: nextProps.invoiceTables,
			});
		}
		if (this.state.isWorkflow !== nextProps.isWorkflow) {
			this.setState({
				isWorkflow: nextProps.isWorkflow,
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
		if (this.state.previewMode !== nextProps.previewMode) {
			this.setState({
				previewMode: nextProps.previewMode,
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
		if (this.state.handleContractNaviagtion !== nextProps.handleContractNaviagtion) {
			this.setState({
				handleContractNaviagtion: nextProps.handleContractNaviagtion,
			});
		}

		if (this.state.summaryBg !== nextProps.summaryBg) {
			this.setState({
				summaryBg: nextProps.summaryBg,
			});
		}
		if (this.state.summaryFont !== nextProps.summaryFont && nextProps.summaryFont) {
			this.setState({
				summaryFont: nextProps.summaryFont,
			});
		}
		if (this.state.summaryFontSize !== nextProps.summaryFontSize && nextProps.summaryFontSize) {
			this.setState({
				summaryFontSize: nextProps.summaryFontSize,
			});
		}
		if (
			this.state.summaryFontColor !== nextProps.summaryFontColor &&
			nextProps.summaryFontColor
		) {
			this.setState({
				summaryFontColor: nextProps.summaryFontColor,
			});
		}
		if (this.state.eventsLabel !== nextProps.eventsLabel && nextProps.eventsLabel) {
			this.setState({
				eventsLabel: nextProps.eventsLabel,
			});
		}
		if (this.state.paymentsLabel !== nextProps.paymentsLabel && nextProps.paymentsLabel) {
			this.setState({
				paymentsLabel: nextProps.paymentsLabel,
			});
		}
		if (this.state.summaryBlock !== nextProps.summaryBlock && nextProps.summaryBlock) {
			this.setState({
				summaryBlock: nextProps.summaryBlock,
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
		if (this.state.showSchedule !== nextProps.showSchedule) {
			this.setState({
				showSchedule: nextProps.showSchedule,
			});
		}
		if (this.state.invoiceClientVariables !== nextProps.invoiceClientVariables) {
			this.setState({
				invoiceClientVariables: nextProps.invoiceClientVariables,
			});
		}
		if (this.state.invoiceNumber !== nextProps.invoiceNumber) {
			this.setState({
				invoiceNumber: nextProps.invoiceNumber,
			});
		}
		if (this.state.iframeScroll !== nextProps.iframeScroll) {
			this.setState({
				iframeScroll: nextProps.iframeScroll,
			});
		}
		if (this.state.activeModule !== nextProps.activeModule) {
			this.setState({
				activeModule: nextProps.activeModule,
			});
		}
		if (this.state.globalSummaryData !== nextProps.globalSummaryData) {
			this.setState({
				globalSummaryData: nextProps.globalSummaryData,
			});
		}
		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
			});
		}
		if (this.state.duplicateModules !== nextProps.duplicateModules) {
			this.setState({
				duplicateModules: nextProps.duplicateModules,
			});
		}
		if (this.state.justifyleft !== nextProps.justifyleft) {
			this.setState({
				justifyleft: nextProps.justifyleft,
			});
		}
		if (this.state.justifycenter !== nextProps.justifycenter) {
			this.setState({
				justifycenter: nextProps.justifycenter,
			});
		}
		if (this.state.justifyright !== nextProps.justifyright) {
			this.setState({
				justifyright: nextProps.justifyright,
			});
		}
		if (this.state.justifyfull !== nextProps.justifyfull) {
			this.setState({
				justifyfull: nextProps.justifyfull,
			});
		}
	};
	componentDidMount() {
		this.setItemHeight();
		//adding eventListner
		let builderElement = document.querySelector('.builder');
		if (builderElement) {
			builderElement.addEventListener('scroll', this.props?.handleScroll);
		}

		if (this.props.client) {
			this.createObserver();
		}
	}

	componentWillUnmount() {
		const builderElement = document.querySelector('.builder');
		if (builderElement) {
			builderElement.removeEventListener('scroll', this.props?.handleScroll);
		}
		if (this.props.client) {
			this.cleanUpObserver();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.ref.current && this.ref.current.clientHeight !== this.state.itemHeight) {
			this.setItemHeight();
		}
		if (
			prevProps.eventsLabel !== this.props.eventsLabel &&
			this.props.eventsLabel !== undefined
		) {
			// Update state when the eventsLabel prop changes
			this.setState({
				eventsLabel: this.props.eventsLabel,
			});
		}
		if (
			prevProps.paymentsLabel !== this.props.paymentsLabel &&
			this.props.paymentsLabel !== undefined
		) {
			// Update state when the eventsLabel prop changes
			this.setState({
				paymentsLabel: this.props.paymentsLabel,
			});
		}
	}
	toggleAddBlock = (e, order, key, isElement, sectionID = null) => {
		this.props.addBlock(
			true,

			key !== _.size(this.state.sections) - 1
				? _.sortBy(this.state.sections, 'order')[key + 1].order
				: false,

			key > 0
				? _.sortBy(this.state.sections, 'order')[key - 1].order
				: _.sortBy(this.state.sections, 'order')[key].order,
			order,
			isElement,
			sectionID,
		);
		// this.setState({
		// 	showAddBlock: true,
		// 	nextOrder:
		// 		key !== _.size(this.state.sections) - 1
		// 			? _.sortBy(this.state.sections, 'order')[key + 1].order
		// 			: false,
		// 	prevOrder:
		// 		key > 0
		// 			? _.sortBy(this.state.sections, 'order')[key - 1].order
		// 			: _.sortBy(this.state.sections, 'order')[key].order,
		// 	order,
		// });
	};
	layoutAdd = (e) => {
		let order =
			//this.state.nextOrder === false || this.state.order == 0
			this.state.order - 1;
		//: ((this.state.nextOrder + this.state.order) / 2).toFixed(3);
		this.props.addEmptyLayout(order);
		let json = {
			layoutId: e,
			order: order,
		};
		this.props.handleAddLayout(
			'this.props.params.workspaceId',
			json,
			'this.props.params.templateID',
		);

		this.setState({ showAddBlock: false });
	};
	setItemHeight = () => {
		this.setState({
			itemHeight: this.ref.current ? this.ref.current.clientHeight : 0,
		});
	};

	getMoveClass = () => {
		const { moveDirection, index } = this.props;
		if (!moveDirection) return '';
		if (moveDirection.fromIndex === index) {
			return moveDirection.toIndex > moveDirection.fromIndex ? 'move-down' : 'move-up';
		}
		if (moveDirection.toIndex === index) {
			return moveDirection.toIndex > moveDirection.fromIndex ? 'move-up' : 'move-down';
		}
		return '';
	};

	moveItem = (fromIndex, toIndex, activeSectionId, direction, isDragging = false) => {
		let sections = [...this.state.sections];
		let sects = _.cloneDeep(sections);
		let updatedItems = [];
		_.map(sections, (section, k) => {
			if (fromIndex == k + 1) {
				section.order = sects[toIndex - 1].order;
			} else if (toIndex == k + 1) {
				section.order = sects[fromIndex - 1].order;
			}
			updatedItems.push(section);
		});

		if (!isDragging) {
			this.setState({ moveDirection: { fromIndex, toIndex } });
			setTimeout(() => {
				this.setState(
					{
						sections: updatedItems,
						moveDirection: null,
					},
					() => {
						this.props.setSections(updatedItems);
					},
				);
			}, 500);
		} else {
			this.setState({ sections: updatedItems }, () => {
				this.props.setSections(updatedItems);
			});
		}
	};

	toggleSignatureModal = (e) => {
		this.setState({
			showContractSingatureModal: !this.state.showContractSingatureModal,
		});
	};

	cleanUpObserver() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}
	createObserver() {
		if (!this.props.client) {
			return;
		}
		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Get block details when it becomes visible
						const sectionId = entry.target.getAttribute('data-section-id');
						const blockId = entry.target.getAttribute('data-block-id'); //sectionType
						const inTime = moment().unix();

						// Make API call with block ID, section ID, and in-time

						this.handleSectionIntime(blockId, sectionId, inTime);

						// Optionally, stop observing after the first intersection
						this.observer.unobserve(entry.target);
					}
				});
			},
			{
				root: null, // Use the viewport
				rootMargin: '0px',
				threshold: 0.1, // Trigger when 10% of block is visible
			},
		);

		// Observe each block
		this.blockRefsStore.forEach((ref) => {
			if (ref) {
				this.observer?.observe(ref);
			}
		});
	}

	handleSectionIntime = async (blockType, sectionId, time) => {
		if (!this.props.client) {
			return;
		}
		const payload = {
			content: blockType,
			inTime: time,
			sectionId: sectionId,
			sectionType: blockType,
		};
		if (this.props?.handleUpdateSmatFileActivityForScroll) {
			this.props?.handleUpdateSmatFileActivityForScroll(payload);
		}
	};
	scrollToSection = (id) => {
		const element = document.querySelector(`[data-section-id="${id}"]`);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};
	handleNavbarHamburger = () => {
		let count = 0;
		this.setState(
			(prevState) => ({
				showMobileMenu: !prevState.showMobileMenu,
				count: count + 1,
			}),
			() => {
				if (count <= 1 && !this.state.showMobileMenu) {
					this.setState({
						showReverceAnimation: true,
					});
				}
			},
		);
	};

	render() {
		const { item, index, moveItem, itemsLength } = this.props;
		const { itemHeight, isDragging, moveDirection } = this.state;
		let sections = [...(this.state?.sections || [])];
		let sectionsArr = [];
		_.map(_.sortBy(this.state.sections, ['order']), (section, index) => {
			//section.order = index + 1;
			sectionsArr.push(section);
		});
		return (
			<>
				<div
					ref={this.ref}
					id={'builder'}
					className={`builder draggable-item ${this.getMoveClass()} ${
						this.props.module === 'contract' ? 'contractPage' : ''
					} ${this.props.module === 'invoice' ? 'invoicePage' : ''}`}
					style={{
						paddingBottom:
							this.props.client &&
							(!this.state?.sections?.length ||
								this.state?.sections[0]?.type !== 'form-v1')
								? '45px'
								: '0',
						opacity: this.getMoveClass() ? 0.5 : isDragging ? 0.52 : 1,
						// height: item.height,
						transition: this.getMoveClass() ? 'transform 0.5s, opacity 0.5s' : 'none',
						backgroundColor:
							this.props.module === 'form'
								? this.state?.isTheme
									? this.state?.setActiveTheme?.backgroundColor
									: this.state?.formBgColor
									? this.state?.formBgColor
									: ''
								: this.props.module === 'contract'
								? this.props.sections[0]?.style?.sectionBackgroundColor
								: '#fff',
						background:
							this.state?.activeModule?.showType == 'a4' &&
							this.state?.activeModule?.showAsA4 &&
							this.state?.activeModule?.a4BgColor
								? this.state?.activeModule?.a4BgColor
								: '',
						transform:
							this.getMoveClass() === 'move-up'
								? `translateY(-${item.height}px)`
								: this.getMoveClass() === 'move-down'
								? `translateY(${item.height}px)`
								: 'translateY(0)',
						maxWidth:
							this.props.client && this.state.previewType === 'm'
								? '100vw'
								: this.props.module === 'contract' ||
								  this.props.module === 'invoice'
								? 792
								: '',
						margin:
							this.props.module === 'contract' || this.props.module === 'invoice'
								? '0px auto'
								: '',

						overflowX:
							this.props.client && this.state.previewType === 'm' ? 'hidden' : '',

						zoom: this.state.previewType === 'ml' && this.state.preview ? 0.4 : 1,

						display: 'block',
						borderRadius: this.props.mobile_preview_builder ? '24px' : '',
						width: '100%',
					}}
				>
					{/* navigationBar */}
					{/* convert lower case if want to display */}
					{this.props?.navBar?.type === 'navbar' &&
						this.props?.navBar?.style?.navigationBar &&
						(() => {
							// Check if sections array has only one section and it's form-v1
							const onlyFormV1 =
								this.state?.sections?.length === 1 &&
								this.state?.sections[0]?.type === 'form-v1';

							// Don't render navbar if only form-v1 is present
							if (onlyFormV1) {
								return null;
							}

							return (
								<div
									style={{
										backgroundColor:
											this.props?.navBar.style?.sectionBackgroundColor ||
											'#ffffff',
										position: this.props?.navBar?.style?.position
											? 'sticky'
											: 'static',
										zIndex: 99999999999999,
									}}
									className="builder-navbar-wrapper"
								>
									{this.state.previewType === 'm' ? (
										<MobileNavbarComponent
											showMobileMenu={this.props?.showMobileMenu}
											showReverceAnimation={this.state?.showReverceAnimation}
											navBar={this.props?.navBar}
											finalTotalCost={this.props?.finalTotalCost}
											handleNavbarHamburger={this.handleNavbarHamburger}
											client={this.props?.client}
											clientPortalModules={this.props?.clientPortalModules}
											renderClientModulesClickFunction={
												this?.props?.renderClientModulesClickFunction
											}
											duplicateModules={this.state?.duplicateModules}
											getModuleInfo={this.props?.getModuleInfo}
											returnCartValue={this.props?.returnCartValue}
											currencySymbol={this.props?.currencySymbol}
											handleDownload={this.props?.handleDownload}
											setShowPopupInMobile={(e, type, component) =>
												this.props?.setShowPopupInMobile(e, type, component)
											}
											setEditMobileNavFunction={(e) => {
												this.props?.setEditMobileNavFunction(e);
												this.setState({ blurBuilder: e });
											}}
											navbarMobileEdit={this.props.navbarMobileEdit}
											activeModuleId={this.props?.activeModuleId}
											selectedLabelId={this.props?.selectedLabelId}
										/>
									) : (
										<NavbarWrapper
											globalTables={this.props.globalTables}
											// blocks={this.props.navBar.blocks}
											// style={this.props.navBar.style}
											section={this.props?.navBar}
											getModuleInfo={(id, type) =>
												this.props.getModuleInfo(id, type)
											}
											duplicateModules={this.props.duplicateModules}
											modules={this.state.modules}
											handleOpenSideBar={this.props.handleOpenSideBar}
											preview={this.state.preview}
											previewType={this.state.previewType}
											managePages={(e) => this.props.managePages(e)}
											client={this.props.client}
											setActiveSection={(value) =>
												this.props?.setActiveSection(value)
											}
											handleNavbarUpdate={this.props.handleNavbarUpdate}
											activeModuleId={this.props?.activeModuleId}
											finalTotalCost={this.props?.finalTotalCost}
											clientPortalModules={this.props?.clientPortalModules}
											renderClientModulesClickFunction={
												this.props?.renderClientModulesClickFunction
											}
											currencySymbol={this.props?.currencySymbol}
											returnCartValue={this.props?.returnCartValue}
											selectedLabelId={this.props?.selectedLabelId}
											handleDownload={this.props?.handleDownload}
											activeModule={this.props?.activeModule}
										/>
									)}
								</div>
							);
						})()}

					{this.props.module === 'contract' &&
						this.props.client &&
						this.state.signatures?.length === 0 && (
							<div className="contract_info">
								<span>You're all Set! Please Sign below</span>
								<a
									onClick={(e) => {
										this.toggleSignatureModal();
										// this.props.checkForContractInputs(e);
									}}
								>
									Sign Contract
								</a>
							</div>
						)}

					{_.find(
						this.props?.activeModule?.actions || [],
						(item) => item === 'contract-signature',
					) && (
						<div
							className="contract_info"
							style={{
								width: '350px',
								margin: '10px auto',
								display:
									this.props?.status !== 'confirmed' &&
									this.props?.status !== 'contractSigned'
										? 'block'
										: 'none',
							}}
						>
							<span>You're all Set! Please Sign Contract</span>
						</div>
					)}

					{this.props.module !== 'summary' &&
					(!_.has(this.state?.activeModule, 'showAsSlide') ||
						(_.has(this.state?.activeModule, 'showAsSlide') == true &&
							(this.state?.activeModule?.showAsSlide == false ||
								!this.state?.activeModule?.showAsSlide)))
						? _.map(
								_.sortBy(
									this.props.module === 'form' && this.state.isHeader
										? [this.state.headerSection]
										: sectionsArr,
									['order'],
								),
								(section, index, arr) => {
									let sectionId = section?._id;

									if (section?.type === 'services') {
										return (
											<div
												key={index}
												data-section-id={sectionId}
												data-block-id={section?.type}
												ref={(el) => (this.blockRefsStore[index] = el)}
												onClick={() => {
													if (this.props?.editingWorflow) {
														this.props?.handleSpanClick(sectionId);
													}
												}}
											>
												<ServicesLayout
													socialMediaLinks={this.state?.socialMediaLinks}
													isWorkflow={this.state.isWorkflow}
													setTriggerFont={(e) =>
														this.props.setTriggerFont(e)
													}
													triggerFont={this.state.triggerFont}
													key={index}
													_id={section._id}
													blocks={section.blocks}
													style={section.style}
													actionType={this.state.actionType}
													actionValue={this.state.actionValue}
													addServiceBlock={(services_style) =>
														this.props.handleAddServiceBlock(
															section._id,
															_.size(section.blocks) + 1,
															services_style,
														)
													}
													handleSideBar={(e, _id) =>
														this.props.handleOpenSideBar(e, _id, true)
													}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section.order,
															index,
															null,
														)
													}
													index={section.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													handleBSelection={(e, activeTextBlock) =>
														this.props.handleHSelection(
															e,
															activeTextBlock,
														)
													}
													activeSectionID={this.state.activeSectionID}
													activeTextBlock={this.state.activeTextBlock}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													preview={this.state.preview}
													previewType={this.state.previewType}
													activeImage={(
														sectionID,
														blockID,
														subBlockID,
														imageURL,
														e,
														ImgSubBlock,
													) =>
														this.props.handleActiveImage(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															e,
															ImgSubBlock,
														)
													}
													handleSetTab={(e) => this.props.setActiveTab(e)}
													activeVariableID={this.state.activeVariableID}
													activeVariableName={
														this.state.activeVariableName
													}
													subBlockID={this.state.subBlockID}
													variables={this.state.variables}
													client={this.props.client}
													tables={this.state.tables}
													handleServiceSelect={(block, type, value) =>
														this.props.serviceSelect(
															block,
															type,
															value,
															sectionId,
														)
													}
													setTable={(e) => this.props.setTables(e)}
													imgSettingData={(e) =>
														this.props.imgSettingData(e)
													}
													selectBlock={(e) => this.props.selectBlock(e)}
													activeSection={this.props.activeSection}
													setActiveSection={(e) =>
														this.props.setActiveSection(e, true)
													}
													activeSubBlockId={this.state.activeSubBlockId}
													serviceTableSubBlock={(e) =>
														this.props.setServiceSubBlock(e)
													}
													handleDeleteServiceBlock={(e, f) =>
														this.props.deleteServiceBlock(e, f)
													}
													setServiceBlock={(e, f, g, h) =>
														this.props.setServiceBlockContent(
															e,
															f,
															g,
															h,
														)
													}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													duplicateServiceBlock={(e, f, g) =>
														this.props.duplicateServiceBlock(e, f, g)
													}
													section={section}
													isActiveSection={
														this.state.activeSectionID == section._id
													}
													activeAnimation={section?.style?.isAnimation}
													animationSpeed={section?.style?.animationSpeed}
													animationDirection={
														section?.style?.animationDirection
													}
													animationType={section?.style?.animationType}
													handleUpdateSectionData={
														this.props?.handleUpdateSectionData
													}
													restrictServiceSelection={
														this.state?.restrictServiceSelection
													}
													clearStyle={() => this.props.clearFontStyles()}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.client
															? ''
															: this.props?.setIsValidBgVideoURL(e);
													}}
													status={this.props?.status}
													currencySymbol={this.props?.currencySymbol}
													builderCurrencySymbol={
														this.props?.currencySymbol
													}
													clientGrandTotal={this.props.clientGrandTotal}
													handleAddLayout={(e, isFluid, isService) =>
														this.props.handleAddLayout(
															e,
															isFluid,
															isService,
														)
													}
													handleSpanClick={
														this.props?.handleSpanClick || {}
													}
													editingWorflow={
														this.props?.editingWorflow || false
													}
													themes={this.props.themes}
													activeModule={this.props.activeModule}
												/>
											</div>
										);
									} else if (section?.type === 'events') {
										return (
											<div
												key={index}
												id={
													this.props?.mobile_preview_builder
														? 'preview_section_' + sectionId
														: sectionId
												}
												data-section-id={sectionId}
												data-block-id={section?.type}
												ref={(el) => (this.blockRefsStore[index] = el)}
												onClick={() => {
													if (this.props?.editingWorflow) {
														this.props?.handleSpanClick(sectionId);
													}
												}}
											>
												<Events
													themes={this.props.themes}
													isWorkflow={this.state.isWorkflow}
													setActiveSection={(e) =>
														this.props.setActiveSection(e, true)
													}
													setTriggerFont={(e) =>
														this.props.setTriggerFont(e)
													}
													key={index}
													section={section}
													_id={section._id}
													blocks={section.blocks}
													style={section.style}
													actionType={this.state.actionType}
													actionValue={this.state.actionValue}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section.order,
															index,
															null,
														)
													}
													index={section.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													handleBSelection={(e, activeTextBlock) =>
														this.props.handleHSelection(
															e,
															activeTextBlock,
														)
													}
													activeSectionID={this.state.activeSectionID}
													activeTextBlock={this.state.activeTextBlock}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													preview={this.state.preview}
													previewType={this.state.previewType}
													activeImage={(
														sectionID,
														blockID,
														subBlockID,
														imageURL,
														e,
														ImgSubBlock,
													) =>
														this.props.handleActiveImage(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															e,
															ImgSubBlock,
														)
													}
													handleSetTab={(e) => this.props.setActiveTab(e)}
													setTable={(e) => this.props.setTables(e)}
													client={this.props.client}
													tables={this.state.tables}
													selectBlock={(e) => this.props.selectBlock(e)}
													isActiveSection={
														this.state.activeSectionID == section._id
													}
													tablesValuesforClient={
														this.state.tablesValuesforClient
													}
													activeAnimation={section?.style?.isAnimation}
													animationSpeed={section?.style?.animationSpeed}
													animationDirection={
														section?.style?.animationDirection
													}
													animationType={section?.style?.animationType}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.client
															? ''
															: this.props?.setIsValidBgVideoURL(e);
													}}
													addEventBlock={(e) =>
														this.props.addEventBlock(e, section._id)
													}
													handleDeleteServiceBlock={(e, f) =>
														this.props.deleteServiceBlock(e, f)
													}
													duplicateBlock={this.props?.duplicateBlock}
													smartFilePreview={this.props?.smartFilePreview}
													handleAddLayout={(e, isFluid, isService) =>
														this.props.handleAddLayout(
															e,
															isFluid,
															isService,
														)
													}
													handleSpanClick={
														this.props?.handleSpanClick || {}
													}
													editingWorflow={
														this.props?.editingWorflow || false
													}
													handleSideBar={(e, _id) => {
														this.props.handleOpenSideBar(
															e,
															_id,
															false,
															true,
														);
													}}
													activeModuleId={this.props?.activeModuleId}
												/>
											</div>
										);
									} else if (section?.type === 'form-q&a') {
										return (
											<FormQandA
												isWorkflow={this.state.isWorkflow}
												key={index}
												_id={
													this.props?.mobile_preview_builder
														? 'preview_section_' + sectionId
														: section._id
												}
												sections={[section]}
												showAddBlock={(e) =>
													this.toggleAddBlock(e, section.order, index)
												}
												style={section.style}
												submitFormLoading={this.state.submitFormLoading}
												clearStyle={() => this.props.clearFontStyles()}
												setTriggerFont={(e) => this.props.setTriggerFont(e)}
												triggerFont={this.state.triggerFont}
												setFSections={(e, restrict = null) =>
													this.props.setSections(e, restrict)
												}
												deleteFBlock={(blockID, sectionID) =>
													this.props.deleteFQBlock(blockID, sectionID)
												}
												handleSetTab={(e, subBlockID, blockID) =>
													this.state.preview
														? ''
														: this.props.setActiveTab(
																e,
																subBlockID,
																blockID,
														  )
												}
												handleBSelection={(e, activeTextBlock) =>
													this.props.handleHSelection(e, activeTextBlock)
												}
												handleSideBar={(e, _id) =>
													this.props.handleOpenSideBar(e, _id)
												}
												setBlockContent={(content, sectionID, blockID) =>
													this.props.handleSetBlockContent(
														content,
														sectionID,
														blockID,
													)
												}
												actionType={this.state.actionType}
												actionValue={this.state.actionValue}
												addQues={(sectionID, blockOrder) =>
													this.props.addFormQuestion(
														sectionID,
														blockOrder,
													)
												}
												preview={this.state.preview}
												previewType={this.state.previewType}
												handleSetFSideBar={(e, blockID) =>
													this.props.setActiveFormQuestion(e, blockID)
												}
												addOptionForm={(e) =>
													this.props.handleAddFormOption(e)
												}
												handleFormAnswer={(answer, key, order, sectionID) =>
													this.props.setFormAnswer(
														answer,
														key,
														order,
														sectionID,
													)
												}
												client={this.props.client}
												submitForm={(e, sectionId) =>
													this.props.handleSubmitForm(e, sectionId)
												}
												moveItem={this.moveItem}
												deleteSection={(e) =>
													this.props.handledeleteSection(e)
												}
												selectBlock={(e) => this.props.selectBlock(e)}
												duplicateBlock={(e) => this.props.duplicateBlock(e)}
												activeFormQuestion={this.props?.activeFormQuestion}
											/>
										);
									} else if (section?.type === 'contract-with-signature') {
										return (
											<div
												key={index}
												style={{ display: 'block' }}
												data-section-id={sectionId}
												data-block-id={section?.type}
												ref={(el) => (this.blockRefsStore[index] = el)}
											>
												<Signature
													isWorkflow={this.props.isWorkflow}
													setTriggerFont={(e) =>
														this.props.setTriggerFont(e)
													}
													setTriggeredFont={(e) =>
														this.setState({ triggeredFont: e })
													}
													activeImage={(
														sectionID,
														blockID,
														subBlockID,
														imageURL,
														e,
														ImgSubBlock,
													) =>
														this.props.handleActiveImage(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															e,
															ImgSubBlock,
														)
													}
													handleTab={(e, subBlockID, blockID) =>
														this.props.setActiveTab(
															e,
															subBlockID,
															blockID,
														)
													}
													activeVariableID={this.state.activeVariableID}
													activeVariableName={
														this.state.activeVariableName
													}
													subBlockID={this.state.subBlockID}
													variables={this.state.variables}
													client={this.props.client}
													tables={this.state.tables}
													setContractActiveVariable={(e) =>
														this.props.client == true
															? ''
															: this.props.contractActiveVariable(e)
													}
													handlesetActiveShape={(e) =>
														this.props.setShape(e)
													}
													setButtonLink={(e) =>
														this.props.handleSetButtonLink(e)
													}
													setNewTab={(e) =>
														this.props.handleSetOpenNewtab(e)
													}
													setButtonStyles={(e) =>
														this.props.setBtStyles(e)
													}
													btShape={(e) => this.props.btShape(e)}
													imgSettingData={(e) =>
														this.props.imgSettingData(e)
													}
													selectBlock={(e) => this.props.selectBlock(e)}
													activeSubBlockId={this.state.activeSubBlockId}
													handleDuplicate={() =>
														this.props.duplicateBlock(this.props._id)
													}
													handleDeleteSection={(e) =>
														this.props.deleteSection(e)
													}
													handleSetBlockTab={(e) =>
														this.props.setBlockTab(e)
													}
													handleSetTab={(e, subBlockID, blockID) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.client
															? ''
															: this.props?.setIsValidBgVideoURL(e);
													}}
													tenantLogo={this.props?.tenantLogo}
													isTenantLogo={this.state.isTenantLogo}
													contractVariables={this.state.contractVariables}
													uploadImageBase64={(e) =>
														this.props.uploadImageBase64(e)
													}
													generateAIImages={(e) =>
														this.props.generateAIImages(e)
													}
													generateAIText={(e) =>
														this.props.generateAIText(e)
													}
													sections={this.state.sections}
													socialMediaLinks={this.state?.socialMediaLinks}
													handleSetIconLink={(e, subBlockID, blockID) =>
														this.props.handleSetIconLink(
															e,
															subBlockID,
															blockID,
														)
													}
													iframeScroll={this.state.iframeScroll}
													preview={this.state.preview}
													module={this.props.module}
													contractBg={this.state.contractBg}
													previewType={this.state.previewType}
													signatures={this.state.signatures}
													// handleSideBar={(e, _id) =>
													// 	this.props.handleOpenSideBar(e, _id)
													// }
													handleSideBar={(e, _id) => {
														this.props.handleOpenSideBar(
															e,
															_id,
															false,
															true,
														);
													}}
													showAddBlock={(e) =>
														this.toggleAddBlock(e, section.order, index)
													}
													key={index}
													_id={section?._id}
													blocks={section?.blocks}
													style={section?.style}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													hanldeAddBlock={(e) =>
														this.props.handleAddBlock(e)
													}
													toggleSignatureModal={this.toggleSignatureModal}
													handleActiveCurrentSignatureSubBlock={(e) =>
														this.setState({
															activeCurrentSignatureSubBlock: e,
														})
													}
													version={this.props.version}
													setActiveSection={(e) => {
														this.props.setActiveSection(e);
													}}
													section={section}
													activeModuleId={this.props?.activeModuleId}
													handleAddLayout={(e, isFluid, isService) =>
														this.props.handleAddLayout(
															e,
															isFluid,
															isService,
														)
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													handleBlock={(e) => this.props.handleBlock(e)}
												/>
											</div>
										);
									} else if (section?.type === 'invoice-with-payment') {
										return (
											<div
												key={index}
												data-section-id={sectionId}
												data-block-id={section?.type}
												ref={(el) => (this.blockRefsStore[index] = el)}
											>
												<PaymentSchedule
													isWorkflow={this.props.isWorkflow}
													tables={this.state.tables}
													paymentSchedule={section?.blocks}
													activeSubBlockId={this.state.activeSubBlockId}
													key={index}
													module={this.props.module}
													_id={section?._id}
													blocks={section?.blocks}
													style={section?.style}
													// handleSideBar={(e, _id) =>
													// 	this.props.handleOpenSideBar(e, _id)
													// }
													showAddBlock={(e) => {
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														);
													}}
													isActiveSection={
														this.props.client
															? false
															: this.state.activeSectionID ==
															  section._id
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													preview={this.state.preview}
													previewType={this.state.previewType}
													handleSetTab={(e) => this.props.setActiveTab(e)}
													selectBlock={(e) => this.props.selectBlock(e)}
													client={this.props.client}
													sectionType={section?.type}
													setTab={(e) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(e)
													}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state?.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.client
															? ''
															: this.props?.setIsValidBgVideoURL(e);
													}}
													setPaymentSchedule={(e, styles = null) => {
														if (this.props?.setPaymentSchedule) {
															this.props?.setPaymentSchedule(
																e,
																section?._id,
																null,
																styles,
															);
														}
													}}
													activeModule={this.state.activeModule}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													addPaymentScheduleBlock={(id, order) =>
														this.props.addPaymentScheduleBlock(
															id,
															order,
														)
													}
													clientGrandTotal={this.props?.clientGrandTotal}
													section={section}
													setActiveSection={(e) => {
														this.props.setActiveSection(e);
													}}
													handleSideBar={(e, _id) => {
														this.props.handleOpenSideBar(
															e,
															_id,
															false,
															true,
														);
													}}
													activeModuleId={this.props?.activeModuleId}
													handleAddLayout={(e, isFluid, isService) =>
														this.props.handleAddLayout(
															e,
															isFluid,
															isService,
														)
													}
													invoiceSentDate={this.props?.invoiceSentDate}
													invoiceAcceptedDate={
														this.props?.invoiceAcceptedDate
													}
												/>
											</div>
										);
									} else if (section?.type === 'invoice') {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el; // Assign DOM element to the ref array
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{ display: 'block' }}
												data-section-id={sectionId}
												data-block-id={section?.type}
											>
												<InvoiceWrapper
													variables={this.props.variables}
													setTriggerFont={(e) =>
														this.props?.client
															? ''
															: this.props?.setTriggerFont(e)
													}
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
													handleSideBar={(e, _id) => {
														this.props.handleOpenSideBar(
															e,
															_id,
															false,
															true,
														);
													}}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														)
													}
													isActiveSection={
														this.props?.client
															? false
															: this.state?.activeSectionID ==
															  section._id
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													handleBSelection={(e, activeTextBlock) => {
														this.props.handleHSelection(
															e,
															activeTextBlock,
														);
													}}
													activeSectionID={this.state?.activeSectionID}
													activeTextBlock={this.state?.activeTextBlock}
													deleteSection={(e) =>
														this.props?.handledeleteSection(e)
													}
													setSubBlockContent={(
														content,
														sectionID,
														blockID,
														id,
													) =>
														this.props?.handleSetSubBlockContent(
															content,
															sectionID,
															blockID,
															id,
														)
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
														this.props?.handleActiveImage(
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
															: this.props?.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													activeVariableID={this.state?.activeVariableID}
													activeVariableName={
														this.state?.activeVariableName
													}
													subBlockID={this.state?.subBlockID}
													client={this.props?.client}
													setNewTab={(e) =>
														this.props?.handleSetOpenNewtab(e)
													}
													selectBlock={(e) => this.props?.selectBlock(e)}
													duplicateBlock={(e) =>
														this.props?.duplicateBlock(e)
													}
													handleSetBlockTab={(e) =>
														this.props?.setBlockTab(e)
													}
													sectionType={section?.type}
													setTab={(e) =>
														this.state?.preview
															? ''
															: this.props?.setActiveTab(e)
													}
													activeAnimation={section?.style?.isAnimation}
													animationSpeed={section?.style?.animationSpeed}
													animationDirection={
														section?.style?.animationDirection
													}
													animationType={section?.style?.animationType}
													clearStyle={() => this.props?.clearFontStyles()}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state?.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props?.setIsValidBgVideoURL(e);
													}}
													tenantLogo={this.props?.tenantLogo}
													isTenantLogo={this.state?.isTenantLogo}
													tables={
														this.props.globalTables?.length > 0
															? this.props?.globalTables
															: this.state?.tables
													}
													sections={
														this.props?.globalSections?.length > 0
															? this.props?.globalSections
															: this.state?.sections
													}
													invoiceDetails={this.props?.invoiceDetails}
													paymentSchedule={this.state?.paymentSchedule}
													setPaymentSchedule={(e) => {
														if (this.props?.setPaymentSchedule) {
															this.props?.setPaymentSchedule(e);
														}
													}}
													showSchedule={this.state?.showSchedule}
													invoiceClientVariables={
														this.state?.invoiceClientVariables
													}
													invoiceNumber={this.state?.invoiceNumber}
													handleInvoiceNumber={(e) =>
														this.props?.handleInvoiceNumber(e)
													}
													currencySymbol={this.props?.currencySymbol}
													activeFontColor={this.state?.activeFontColor}
													isWorkflow={this.state.isWorkflow}
													clientGrandTotal={
														this.props?.clientGrandTotal || 0
													}
													imgSettingData={(e) =>
														this.props.imgSettingData(e)
													}
													setActiveSection={(e) => {
														if (this.props.setActiveSection) {
															this.props.setActiveSection(e);
														}
													}}
													addManualInvoiceBlock={(order) => {
														this.props?.addManualInvoiceBlock(
															section?._id,
															section?.blocks.length + 1,
														);
													}}
													activeWorkflowModuleId={
														this.props?.activeWorkflowModuleId
													}
													activeModuleId={this.props?.activeModuleId}
													brandColors={this.props?.brandColors}
													modules={this.props?.modules}
													updateTablesForTaxes={
														this.props?.updateTablesForTaxes
													}
													handleAddLayout={(e, isFluid, isService) => {
														this.props.handleAddLayout(
															e,
															isFluid,
															isService,
														);
													}}
													smartFileVariables={
														this.props?.smartFileVariables
													}
												/>
											</div>
										);
									} else if (section?.type === 'table') {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el; // Assign DOM element to the ref array
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{ display: 'block' }}
												data-section-id={sectionId}
												data-block-id={section?.type}
											>
												<Table
													setTriggerFont={(e) =>
														this.props.setTriggerFont(e)
													}
													setTriggeredFont={(e) =>
														this.setState({
															triggeredFont: e,
														})
													}
													triggeredFont={this.state.triggeredFont}
													activeSubBlockId={this.state.activeSubBlockId}
													key={index}
													module={this.props.module}
													_id={section?._id}
													blocks={section?.blocks}
													style={section?.style}
													actionType={this.state.actionType}
													actionValue={this.state.actionValue}
													triggerFont={this.state.triggerFont}
													handleSideBar={(e, _id) =>
														this.props.handleOpenSideBar(e, _id)
													}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														)
													}
													isActiveSection={
														this.props.client
															? false
															: this.state.activeSectionID ==
															  section._id
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													handleBSelection={(e, activeTextBlock) =>
														this.props.handleHSelection(
															e,
															activeTextBlock,
														)
													}
													activeSectionID={this.state.activeSectionID}
													activeTextBlock={this.state.activeTextBlock}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													setSubBlockContent={(
														content,
														sectionID,
														blockID,
														id,
													) =>
														this.props.handleSetSubBlockContent(
															content,
															sectionID,
															blockID,
															id,
														)
													}
													preview={this.state.preview}
													previewType={this.state.previewType}
													activeImage={(
														sectionID,
														blockID,
														subBlockID,
														imageURL,
														dimensions,
														ImgSubBlock,
													) =>
														this.props.handleActiveImage(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															dimensions,
															ImgSubBlock,
														)
													}
													handleSetTab={(e, subBlockID, blockID) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													activeVariableID={this.state.activeVariableID}
													activeVariableName={
														this.state.activeVariableName
													}
													subBlockID={this.state.subBlockID}
													variables={this.state.variables}
													client={this.props.client}
													setContractActiveVariable={(e) =>
														this.props.client == true
															? ''
															: this.props.contractActiveVariable(e)
													}
													handlesetActiveShape={(e) =>
														this.props.client
															? ''
															: this.props.setShape(e)
													}
													setButtonLink={(e) =>
														this.props.handleSetButtonLink(e)
													}
													setNewTab={(e) =>
														this.props.handleSetOpenNewtab(e)
													}
													setButtonStyles={(e) =>
														this.props.setBtStyles(e)
													}
													btShape={(e) => this.props.btShape(e)}
													imgSettingData={(e) =>
														this.props.imgSettingData(e)
													}
													selectBlock={(e) => this.props.selectBlock(e)}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													handleSetBlockTab={(e) =>
														this.props.setBlockTab(e)
													}
													sectionType={section?.type}
													setTab={(e) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(e)
													}
													circleTextData={(e) =>
														this.props.circleTextData(e)
													}
													activeAnimation={section?.style?.isAnimation}
													animationSpeed={section?.style?.animationSpeed}
													animationDirection={
														section?.style?.animationDirection
													}
													animationType={section?.style?.animationType}
													clearStyle={() => this.props.clearFontStyles()}
													handleIsValidURL={(e) => {
														this.props.client
															? ''
															: this.props.setIsValidURL(e);
													}}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.setIsValidBgVideoURL(e);
													}}
													tenantLogo={this.props?.tenantLogo}
													isTenantLogo={this.state.isTenantLogo}
													contractVariables={this.state.contractVariables}
													uploadImageBase64={(e) =>
														this.props.uploadImageBase64(e)
													}
													generateAIImages={(e) =>
														this.props.generateAIImages(e)
													}
													generateAIText={(e) =>
														this.props.generateAIText(e)
													}
													tables={this.state.tables}
													sections={this.state.sections}
													socialMediaLinks={this.state?.socialMediaLinks}
													handleSetIconLink={(e, subBlockID, blockID) =>
														this.props.handleSetIconLink(
															e,
															subBlockID,
															blockID,
														)
													}
													setActiveSection={(e) =>
														this.props.setActiveSection(e)
													}
													section={section}
													DeleteInTable={(type, index) =>
														this.props?.handleDeleteInTable(type, index)
													}
													AddInTable={(
														type,
														index,
														position,
														length = 0,
													) =>
														this.props?.handleAddInTable(
															type,
															index,
															position,
															length,
														)
													}
													DuplicateInTable={(type, index) =>
														this.props?.handleDuplicateInTable(
															type,
															index,
														)
													}
													isWorkflow={this.state.isWorkflow}
												/>
											</div>
										);
									} else if (section?.type === 'summary') {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el; // Assign DOM element to the ref array
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{ display: 'block' }}
												data-section-id={sectionId}
												data-block-id={section?.type}
											>
												<SummaryWrapper
													variables={this.props?.variables}
													activeSubBlockId={this.state.activeSubBlockId}
													key={index}
													module={this.props.module}
													_id={section?._id}
													blocks={section?.blocks}
													style={section?.style}
													// handleSideBar={(e, _id) =>
													// 	this.props.handleOpenSideBar(e, _id)
													// }
													handleSideBar={(e, _id) => {
														this.props.handleOpenSideBar(
															e,
															_id,
															false,
															true,
														);
													}}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														)
													}
													isActiveSection={
														this.props.client
															? false
															: this.state.activeSectionID ==
															  section._id
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													isWorkflow={this.state.isWorkflow}
													sections={sectionsArr}
													tables={this.state.tables}
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
													currencySymbol={this.props?.currencySymbol}
													globalSummaryData={
														this.props?.globalSummaryData
													}
													selectBlock={(e) => this.props.selectBlock(e)}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													handleBlock={(e) => this.props.handleBlock(e)}
													handleDeleteSection={(e) =>
														this.props.deleteSection(e)
													}
													handleSetBlockTab={(e) =>
														this.props.setBlockTab(e)
													}
													handleSetIconLink={(e, subBlockID, blockID) =>
														this.props.handleSetIconLink(
															e,
															subBlockID,
															blockID,
														)
													}
													activeSectionID={this.state.activeSectionID}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													handleSetTab={(e, subBlockID, blockID) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													sectionType={section?.type}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.setIsValidBgVideoURL(e);
													}}
													client={this.props?.client}
													clientGrandTotal={
														this.props?.clientGrandTotal || 0
													}
													handleAddLayout={(e, type) =>
														this.props.handleAddLayout(e, type)
													}
													isSummaryPreview={this.props.isSummaryPreview}
													setActiveSection={(e) => {
														this.props.setActiveSection(e);
													}}
													section={section}
													fonts={this.props?.fonts}
													activeModuleId={this.props?.activeModuleId}
													smartFileVariables={
														this.props?.smartFileVariables
													}
												/>
											</div>
										);
									} else if (section?.type === 'form-v1') {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el;
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{
													height: !this.props?.client
														? 'auto'
														: section?.isSinglePage &&
														  this.props?.client
														? 'auto'
														: '100%',
													minHeight: '418.5px',
													display: 'block',
												}}
												data-section-id={sectionId}
												data-block-id={section?.type}
											>
												<FormWrapper
													triggerAdjustGridAreas={
														this.props.triggerAdjustGridAreas
													}
													setAdjustGridAreas={(e) => {
														this.props.setAdjustGridAreas(e);
													}}
													handleAddLayout={(e, type) =>
														this.props.handleAddLayout(e, type)
													}
													style={section?.style}
													moveItem={this.moveItem}
													// Add your props here
													handleDeleteSection={(e) =>
														this.props.deleteSection(e)
													}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													submitLogicalForm={this.props.submitLogicalForm}
													submitFormLoading={this.state.submitFormLoading}
													showFormError={this.state.showFormError}
													showSuccessMessage={
														this.state.showSuccessMessage
													}
													errorMessage={this.state.errorMessage}
													successMessage={this.state.successMessage}
													// client={this.props?.client}

													isTheme={this.props.isTheme}
													setActiveTheme={this.props.setActiveTheme}
													_id={section?._id}
													activeModule={this.state.activeModule}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section.order,
															index,
															null,
														)
													}
													selectBlock={(e) => this.props.selectBlock(e)}
													handleSideBar={(e, _id) =>
														this.props.handleOpenSideBar(
															e,
															_id,
															false,
															true,
														)
													}
													preview={this.state?.preview}
													sections={this.state.sections}
													blocks={section?.blocks}
													section={section}
													activeSectionID={this.state?.activeSectionID}
													setState={(e) => {
														this.setState({ ...e });
													}}
													index={index}
													saveSections={(e, restrict = null) =>
														this.props.setSections(e, restrict)
													}
													addBlock={(e) => {
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														);
													}}
													client={this.props?.client}
													setActiveSection={(value) => {
														this.props?.setActiveSection(value);
													}}
													// themes={this.props?.themes}
													theme={{}}
													handleLogicalFormAnswer={
														this.props.handleLogicalFormAnswer
													}
													setTriggerFont={(e) =>
														this.props.client
															? ''
															: this.props.setTriggerFont(e)
													}
													setTriggeredFont={(e) =>
														this.setState({
															triggeredFont: e,
														})
													}
													triggeredFont={this.state.triggeredFont}
													handleBSelection={(e, activeTextBlock) =>
														this.props.handleHSelection(
															e,
															activeTextBlock,
														)
													}
													handleSetTab={(e, subBlockID, blockID) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													changeFontColor={(e, f) =>
														this.props?.changeFontColor(e, f)
													}
													actionType={this.state.actionType}
													actionValue={this.state.actionValue}
													triggerFont={this.state.triggerFont}
													fonts={this.props?.fonts}
													fontFamily={this.props?.fontFamily}
													fontColor={this.props.fontColor}
													fontSize={this.props.fontSize}
													justifyleft={this.state.justifyleft}
													justifyright={this.state.justifyright}
													justifycenter={this.state.justifycenter}
													justifyfull={this.state.justifyfull}
													lineHeight={this.props.lineHeight}
													letterSpacing={this.props.letterSpacing}
													activeWorkflowModuleId={
														this.props?.activeWorkflowModuleId
													}
													activeModuleId={this.props?.activeModuleId}
													previewType={this.state?.previewType}
													module={this.props.module}
													activeSubBlockId={this.state.activeSubBlockId}
													buttonProps={section?.buttonProps}
													handleIsValidBgVideoURL={
														this.props.setIsValidBgVideoURL
													}
												/>
											</div>
										);
									} else if (section?.type === 'navbar') {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el; // Assign DOM element to the ref array
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{ display: 'block' }}
												data-section-id={sectionId}
												data-block-id={section?.type}
											>
												<NavbarWrapper
													getModuleInfo={(id, type) =>
														this.props.getModuleInfo(id, type)
													}
													imgURL={section?.style?.imgURL}
													activeSubBlockId={this.state.activeSubBlockId}
													key={index}
													module={this.props.module}
													_id={section?._id}
													blocks={section?.blocks}
													style={section?.style}
													handleSideBar={
														(e, _id) => ''
														// this.props.handleOpenSideBar(e, _id,
														// 	false,
														// 		false,
														// )
													}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														)
													}
													isActiveSection={
														this.props.client
															? false
															: this.state.activeSectionID ==
															  section._id
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													isWorkflow={this.state.isWorkflow}
													sections={sectionsArr}
													section={section}
													tables={this.state.tables}
													preview={this.state.preview}
													previewType={this.state.previewType}
													setTab={(e) => this.props.setActiveTab(e)}
													selectBlock={(e) => this.props.selectBlock(e)}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													handleBlock={(e) => this.props.handleBlock(e)}
													handleDeleteSection={(e) =>
														this.props.deleteSection(e)
													}
													handleSetBlockTab={(e) =>
														this.props.setBlockTab(e)
													}
													handleSetIconLink={(e, subBlockID, blockID) =>
														this.props.handleSetIconLink(
															e,
															subBlockID,
															blockID,
														)
													}
													activeSectionID={this.state.activeSectionID}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													handleSetTab={(e, subBlockID, blockID) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													sectionType={section?.type}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.setIsValidBgVideoURL(e);
													}}
													client={this.props?.client}
													clientGrandTotal={
														this.props?.clientGrandTotal || 0
													}
													activeImage={(
														sectionID,
														blockID,
														subBlockID,
														imageURL,
														dimensions,
														ImgSubBlock,
													) =>
														this.props?.handleActiveImage(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															dimensions,
															ImgSubBlock,
														)
													}
													imgSettingData={(e) =>
														this.props.imgSettingData(e)
													}
													modules={this.state.modules}
													setActiveTab={(e) => this.props.setActiveTab(e)}
													duplicateModules={this.state.duplicateModules}
													renderModules={() =>
														this.props.renderModules
															? this.props.renderModules()
															: ''
													}
													setActiveSection={(e) =>
														this.props.setActiveSection(e)
													}
													activeModuleId={this.props.activeModuleId}
													managePages={(e) => this.props.managePages(e)}
												/>
											</div>
										);
									} else if (section?.type === 'scheduler') {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el;
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{ display: 'block' }}
												data-section-id={sectionId}
												data-block-id={section?.type}
											>
												<SchedulerWrapper
													handleAddLayout={(e, type) =>
														this.props.handleAddLayout(e, type)
													}
													handleScheduleStyles={(data) =>
														this.props.handleScheduleStyles(data)
													}
													actionType={this.state.actionType}
													activeSubBlockId={this.state.activeSubBlockId}
													key={index}
													module={this.props.module}
													section={section}
													_id={section?._id}
													blocks={section?.blocks}
													style={section?.style}
													handleSideBar={(e, _id) =>
														this.props.handleOpenSideBar(e, _id)
													}
													showAddBlock={(e) =>
														this.toggleAddBlock(
															e,
															section?.order,
															index,
														)
													}
													isActiveSection={
														this.props.client
															? false
															: this.state.activeSectionID ==
															  section._id
													}
													index={section?.order}
													moveItem={this.moveItem}
													itemsLength={arr.length}
													moveDirection={moveDirection}
													isWorkflow={this.state.isWorkflow}
													sections={sectionsArr}
													tables={this.state.tables}
													eventsLabel={this.state?.eventsLabel}
													paymentsLabel={this.state?.paymentsLabel}
													summaryBg={this.state?.summaryBg}
													summaryFont={this.state?.summaryFont}
													summaryFontColor={this.state?.summaryFontColor}
													summaryFontSize={this.state?.summaryFontSize}
													preview={this.state.preview}
													previewType={this.state.previewType}
													setTab={(e) => this.props.setActiveTab(e)}
													selectBlock={(e) => this.props.selectBlock(e)}
													duplicateBlock={(e) =>
														this.props.duplicateBlock(e)
													}
													handleBlock={(e) => this.props.handleBlock(e)}
													handleDeleteSection={(e) =>
														this.props.deleteSection(e)
													}
													handleSetBlockTab={(e) =>
														this.props.setBlockTab(e)
													}
													handleSetIconLink={(e, subBlockID, blockID) =>
														this.props.handleSetIconLink(
															e,
															subBlockID,
															blockID,
														)
													}
													activeSectionID={this.state.activeSectionID}
													deleteSection={(e) =>
														this.props.handledeleteSection(e)
													}
													handleSetTabP={(e, subBlockID, blockID) =>
														this.state.preview
															? ''
															: this.props.setActiveTab(
																	e,
																	subBlockID,
																	blockID,
															  )
													}
													setSubBlockContent={(
														content,
														sectionID,
														blockID,
														id,
														mContent = false,
													) =>
														this.props.handleSetSubBlockContent(
															content,
															sectionID,
															blockID,
															id,
															mContent,
															section._id,
														)
													}
													sectionType={section?.type}
													backgroundType={
														this.props.activeSection?.style
															?.backgroundType
													}
													backgroundImageURL={
														this.props?.activeSection?.style
															?.backgroundImageURL
													}
													backgroundVideoURL={
														this.state.backgroundVideoURL
													}
													handleIsValidBgVideoURL={(e) => {
														this.props.setIsValidBgVideoURL(e);
													}}
													client={this.props?.client}
													setContent={(e, sid, bid, id) =>
														this.props.setSubBlockContent(
															e,
															sid,
															bid,
															id,
														)
													}
													allSchedules={this.props?.allSchedules}
													fonts={this.props?.fonts}
													saveSections={(e, restrict = null) =>
														this.props.setSections(e, restrict)
													}
												/>
											</div>
										);
									} else {
										return (
											<div
												ref={(el) => {
													if (el) {
														this.blockRefs.current[index] = el; // Assign DOM element to the ref array
														this.blockRefsStore[index] = el;
													}
												}}
												key={index}
												style={{
													display: 'block',
													minHeight: section?.isFluidSection
														? _.has(section, 'style') &&
														  _.has(section?.style, 'minHeight')
															? section?.style?.minHeight
															: 'auto'
														: 'auto',
												}}
												data-section-id={sectionId}
												data-block-id={section?.type}
												id={
													this.props?.mobile_preview_builder
														? 'preview_section_' + sectionId
														: sectionId
												}
												onMouseEnter={
													!this.props.mobile_preview_builder &&
													this.state.previewType === 'm'
														? () => {
																let sectionToScroll =
																	document.getElementById(
																		'preview_section_' +
																			sectionId,
																	);
																sectionToScroll?.scrollIntoView({
																	behavior: 'smooth',
																	block: 'start',
																});
														  }
														: null
												}
											>
												{section?.isFluidSection ? (
													<FluidLayout
														triggerAdjustGridAreas={
															this.props.triggerAdjustGridAreas
														}
														audioMode={this.props.audioMode}
														mobile_preview_builder={
															this.props?.mobile_preview_builder
														}
														clientDetails={this.props?.clientDetails}
														currencySymbol={this.props?.currencySymbol}
														isLastSection={
															index === sectionsArr.length - 1
														}
														activeSectionID={this.state.activeSectionID}
														isWorkflow={this.state.isWorkflow}
														fluidShowGrid={this.state.fluidShowGrid}
														duplicateSubBlock={(json, subBlockId) =>
															this.props.duplicateSubBlock(
																json,
																subBlockId,
																section?._id,
															)
														}
														saveSections={(e, restrict = null) =>
															this.props.setSections(e, restrict)
														}
														previewMode={this.state.previewMode}
														handleAddElement={(e, zIndex, order) =>
															this.props.handleAddElement(
																e,
																zIndex,
																order,
															)
														}
														setLastClick={(e) =>
															this.props.setLastClick(e)
														}
														handleSaveblocks={(e, layoutHeight) => {
															this.props.handleSaveblocks(
																e,
																section._id,
																layoutHeight,
															);
														}}
														handleSaveSingleBlock={(e) =>
															this.props.handleSaveSingleBlock(
																e,
																section._id,
															)
														}
														setTriggerFont={(e) =>
															this.props.setTriggerFont(e)
														}
														setTriggeredFont={(e) =>
															this.setState({
																triggeredFont: e,
															})
														}
														triggeredFont={this.state.triggeredFont}
														activeSubBlockId={
															this.state.activeSubBlockId
														}
														key={index}
														module={this.props.module}
														_id={section?._id}
														blocks={section?.blocks}
														intialGridRows={
															section?.blocks[0]?.divStyles?.gridRows
														}
														mIntialGridRows={
															section?.blocks[0]?.divStyles
																?.mGridRows || 0
														}
														style={section?.style}
														actionType={this.state.actionType}
														actionValue={this.state.actionValue}
														triggerFont={this.state.triggerFont}
														handleSideBar={(e, _id) => {
															this.props.handleOpenSideBar(
																e,
																_id,
																false,
																true,
															);
														}}
														showAddBlock={(e) =>
															this.toggleAddBlock(
																e,
																section?.order,
																index,
																null,
																section._id,
															)
														}
														showAddElement={(e) =>
															this.toggleAddBlock(
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
																: this.state.activeSectionID ==
																  section._id
														}
														index={section?.order}
														moveItem={this.moveItem}
														itemsLength={arr.length}
														moveDirection={moveDirection}
														handleBSelection={(e, activeTextBlock) =>
															this.props.handleHSelection(
																e,
																activeTextBlock,
															)
														}
														activeTextBlock={this.state.activeTextBlock}
														deleteSection={(e) =>
															this.props.handledeleteSection(e)
														}
														setSubBlockContent={(
															content,
															sectionID,
															blockID,
															id,
															mContent = false,
														) =>
															this.props.handleSetSubBlockContent(
																content,
																sectionID,
																blockID,
																id,
																mContent,
																section._id,
															)
														}
														preview={this.state.preview}
														previewType={this.state.previewType}
														activeImage={(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															dimensions,
															ImgSubBlock,
														) => {
															this.props.handleActiveImage(
																sectionID,
																blockID,
																subBlockID,
																imageURL,
																dimensions,
																ImgSubBlock,
															);
														}}
														handleSetTab={(e, subBlockID, blockID) =>
															this.state.preview
																? ''
																: this.props.setActiveTab(
																		e,
																		subBlockID,
																		blockID,
																  )
														}
														activeVariableID={
															this.state.activeVariableID
														}
														activeVariableName={
															this.state.activeVariableName
														}
														subBlockID={this.state.subBlockID}
														smartVariables={this.props?.smartVariables}
														paramsTemplateID={
															this.props?.paramsTemplateID
														}
														client={this.props.client}
														setContractActiveVariable={(e) =>
															this.props.client == true
																? ''
																: this.props.contractActiveVariable(
																		e,
																  )
														}
														handlesetActiveShape={(e) =>
															this.props.setShape(e)
														}
														setButtonLink={(e) =>
															this.props.handleSetButtonLink(e)
														}
														setNewTab={(e) =>
															this.props.handleSetOpenNewtab(e)
														}
														setButtonStyles={(e) =>
															this.props.setBtStyles(e)
														}
														btShape={(e) => this.props.btShape(e)}
														imgSettingData={(e) =>
															this.props.imgSettingData(e)
														}
														selectBlock={(e) =>
															this.props.selectBlock(e)
														}
														duplicateBlock={(e) =>
															this.props.duplicateBlock(e)
														}
														handleSetBlockTab={(e) =>
															this.props.setBlockTab(e)
														}
														sectionType={section?.type}
														setTab={(e) =>
															this.state.preview
																? ''
																: this.props.setActiveTab(e)
														}
														circleTextData={(e) =>
															this.props.circleTextData(e)
														}
														activeAnimation={
															section?.style?.isAnimation
														}
														animationSpeed={
															section?.style?.animationSpeed
														}
														animationDirection={
															section?.style?.animationDirection
														}
														animationType={
															section?.style?.animationType
														}
														clearStyle={() =>
															this.props.clearFontStyles()
														}
														handleIsValidURL={(e) => {
															this.props.client
																? ''
																: this.props.setIsValidURL(e);
														}}
														backgroundType={
															this.props.activeSection?.style
																?.backgroundType
														}
														backgroundImageURL={
															this.props?.activeSection?.style
																?.backgroundImageURL
														}
														backgroundVideoURL={
															this.state.backgroundVideoURL
														}
														handleIsValidBgVideoURL={(e) => {
															this.props.client
																? ''
																: this.props?.setIsValidBgVideoURL(
																		e,
																  );
														}}
														tenantLogo={this.props?.tenantLogo}
														isTenantLogo={this.state.isTenantLogo}
														contractVariables={
															this.state.contractVariables
														}
														uploadImageBase64={(e) =>
															this.props.uploadImageBase64(e)
														}
														generateAIImages={(e) =>
															this.props.generateAIImages(e)
														}
														generateAIText={(e) =>
															this.props.generateAIText(e)
														}
														tables={this.state.tables}
														sections={this.state.sections}
														socialMediaLinks={
															this.state?.socialMediaLinks
														}
														handleSetIconLink={(
															e,
															subBlockID,
															blockID,
														) =>
															this.props.handleSetIconLink(
																e,
																subBlockID,
																blockID,
															)
														}
														getModuleInfo={(id, type) =>
															this.props.getModuleInfo(id, type)
														}
														scrollToSection={(id) =>
															this.scrollToSection(id)
														}
														fluidGrid={() =>
															this.props.client
																? ''
																: this.props.fluidGrid()
														}
														handleAddLayout={(e, isFluid, isService) =>
															this.props.handleAddLayout(
																e,
																isFluid,
																isService,
															)
														}
														brandColors={this.props?.brandColors}
														modules={this.props?.modules}
														getModuleSections={(e) =>
															this.props?.getModuleSections(e)
														}
														activeModuleSections={
															this.props?.activeModuleSections
														}
														activeWorkflowModuleId={
															this.props?.activeWorkflowModuleId
														}
														activeModuleId={this.props?.activeModuleId}
														setShowPopupInMobile={(
															e,
															type,
															component,
														) =>
															this.props?.setShowPopupInMobile(
																e,
																type,
																component,
															)
														}
														clientGrandTotal={
															this.props?.clientGrandTotal || 0
														}
														section={section}
														setActiveSection={(e) =>
															this.props.setActiveSection(e)
														}
														fonts={this.props?.fonts}
														fontFamily={this.props?.fontFamily}
														changeFontColor={(e, f) =>
															this.props?.changeFontColor(e, f)
														}
														fontColor={this.props.fontColor}
														fontSize={this.props.fontSize}
														justifyleft={this.state.justifyleft}
														justifyright={this.state.justifyright}
														justifycenter={this.state.justifycenter}
														justifyfull={this.state.justifyfull}
														lineHeight={this.props.lineHeight}
														letterSpacing={this.props.letterSpacing}
														variables={this.state.variables}
														navBar={this.props.navBar}
														themes={this.props?.themes}
														debounceFuncForElementProps={
															this.props?.debounceFuncForElementProps
														}
														handleShowSmartModal={
															this.props?.handleShowSmartModal
														}
														handleDeleteVariable={
															this.props?.handleDeleteVariable
														}
														handleEditVariable={
															this.props?.handleEditVariable
														}
														handleVerticleAlign={
															this.props?.handleVerticleAlign
														}
														setAdjustGridAreas={(e) =>
															this.props.setAdjustGridAreas(e)
														}
													/>
												) : (
													<Layout
														clientDetails={this.props?.clientDetails}
														currencySymbol={this.props?.currencySymbol}
														setTriggerFont={(e) =>
															this.props.client
																? ''
																: this.props.setTriggerFont(e)
														}
														setTriggeredFont={(e) =>
															this.setState({
																triggeredFont: e,
															})
														}
														triggeredFont={this.state.triggeredFont}
														activeSubBlockId={
															this.state.activeSubBlockId
														}
														key={index}
														module={this.props.module}
														_id={section?._id}
														blocks={section?.blocks}
														style={section?.style}
														actionType={this.state.actionType}
														actionValue={this.state.actionValue}
														triggerFont={this.state.triggerFont}
														handleSideBar={(e, _id) =>
															this.props.handleOpenSideBar(e, _id)
														}
														showAddBlock={(e) =>
															this.toggleAddBlock(
																e,
																section?.order,
																index,
															)
														}
														isActiveSection={
															this.props.client
																? false
																: this.state.activeSectionID ==
																  section._id
														}
														index={section?.order}
														moveItem={this.moveItem}
														itemsLength={arr.length}
														moveDirection={moveDirection}
														handleBSelection={(e, activeTextBlock) =>
															this.props.handleHSelection(
																e,
																activeTextBlock,
															)
														}
														activeSectionID={this.state.activeSectionID}
														activeTextBlock={this.state.activeTextBlock}
														deleteSection={(e) =>
															this.props.handledeleteSection(e)
														}
														setSubBlockContent={(
															content,
															sectionID,
															blockID,
															id,
														) =>
															this.props.handleSetSubBlockContent(
																content,
																sectionID,
																blockID,
																id,
															)
														}
														preview={this.state.preview}
														previewType={this.state.previewType}
														activeImage={(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															dimensions,
															ImgSubBlock,
														) =>
															this.props.handleActiveImage(
																sectionID,
																blockID,
																subBlockID,
																imageURL,
																dimensions,
																ImgSubBlock,
															)
														}
														handleSetTab={(e, subBlockID, blockID) =>
															this.state.preview
																? ''
																: this.props.setActiveTab(
																		e,
																		subBlockID,
																		blockID,
																  )
														}
														activeVariableID={
															this.state.activeVariableID
														}
														activeVariableName={
															this.state.activeVariableName
														}
														subBlockID={this.state.subBlockID}
														variables={this.state.variables}
														client={this.props.client}
														setContractActiveVariable={(e) =>
															this.props.client == true
																? ''
																: this.props.contractActiveVariable(
																		e,
																  )
														}
														handlesetActiveShape={(e) =>
															this.props.client
																? ''
																: this.props.setShape(e)
														}
														setButtonLink={(e) =>
															this.props.handleSetButtonLink(e)
														}
														setNewTab={(e) =>
															this.props.handleSetOpenNewtab(e)
														}
														setButtonStyles={(e) =>
															this.props.setBtStyles(e)
														}
														btShape={(e) => this.props.btShape(e)}
														imgSettingData={(e) =>
															this.props.imgSettingData(e)
														}
														selectBlock={(e) =>
															this.props.selectBlock(e)
														}
														duplicateBlock={(e) =>
															this.props.duplicateBlock(e)
														}
														handleSetBlockTab={(e) =>
															this.props.setBlockTab(e)
														}
														sectionType={section?.type}
														setTab={(e) =>
															this.state.preview
																? ''
																: this.props.setActiveTab(e)
														}
														circleTextData={(e) =>
															this.props.circleTextData(e)
														}
														activeAnimation={
															section?.style?.isAnimation
														}
														animationSpeed={
															section?.style?.animationSpeed
														}
														animationDirection={
															section?.style?.animationDirection
														}
														animationType={
															section?.style?.animationType
														}
														clearStyle={() =>
															this.props.clearFontStyles()
														}
														handleIsValidURL={(e) => {
															this.props.client
																? ''
																: this.props.setIsValidURL(e);
														}}
														backgroundType={
															this.props.activeSection?.style
																?.backgroundType
														}
														backgroundImageURL={
															this.props?.activeSection?.style
																?.backgroundImageURL
														}
														backgroundVideoURL={
															this.state.backgroundVideoURL
														}
														handleIsValidBgVideoURL={(e) => {
															this.props.client
																? ''
																: this.props?.setIsValidBgVideoURL(
																		e,
																  );
														}}
														tenantLogo={this.props?.tenantLogo}
														isTenantLogo={this.state.isTenantLogo}
														contractVariables={
															this.state.contractVariables
														}
														uploadImageBase64={(e) =>
															this.props.uploadImageBase64(e)
														}
														generateAIImages={(e) =>
															this.props.generateAIImages(e)
														}
														generateAIText={(e) =>
															this.props.generateAIText(e)
														}
														tables={this.state.tables}
														sections={this.state.sections}
														socialMediaLinks={
															this.state?.socialMediaLinks
														}
														handleSetIconLink={(
															e,
															subBlockID,
															blockID,
														) =>
															this.props.handleSetIconLink(
																e,
																subBlockID,
																blockID,
															)
														}
														iframeScroll={this.state.iframeScroll}
														getModuleInfo={(id, type) =>
															this.props.getModuleInfo(id, type)
														}
														scrollToSection={(id) =>
															this.scrollToSection(id)
														}
														handleOpenAcceptProposalModal={() => {
															this.setState({
																showAcceptProposalModal: true,
															});
														}}
														handleAddLayout={(e, isFluid, isService) =>
															this.props.handleAddLayout(
																e,
																isFluid,
																isService,
															)
														}
														clientGrandTotal={
															this.props?.clientGrandTotal || 0
														}
														themes={this.props?.themes}
														status={this.props.status}
													/>
												)}
											</div>
										);
									}
								},
						  )
						: ''}
					{this.props.module === 'form' ? (
						<>
							<Form
								isWorkflow={this.state.isWorkflow}
								sections={sectionsArr}
								setFSections={(e, restrict = null) =>
									this.props.setSections(e, restrict)
								}
								deleteFBlock={(blockID, sectionID) =>
									this.props.deleteFQBlock(blockID, sectionID)
								}
								handleSetTab={(e, subBlockID, blockID) =>
									this.state.preview
										? ''
										: this.props.setActiveTab(e, subBlockID, blockID)
								}
								handleBSelection={(e, activeTextBlock) =>
									this.props.handleHSelection(e, activeTextBlock)
								}
								handleSideBar={(e, _id) => {
									this.props?.client ? '' : this.props.handleOpenSideBar(e, _id);
								}}
								setBlockContent={(content, sectionID, blockID) =>
									this.props.handleSetBlockContent(content, sectionID, blockID)
								}
								actionType={this.state.actionType}
								actionValue={this.state.actionValue}
								addQues={(sectionID, blockOrder) =>
									this.props.addFormQuestion(sectionID, blockOrder)
								}
								preview={this.state.preview}
								previewType={this.state.previewType}
								handleSetFSideBar={(e, blockID) =>
									this.props.setActiveFormQuestion(e, blockID)
								}
								addOptionForm={(e) => this.props.handleAddFormOption(e)}
								tenantLogo={this.props.tenantLogo}
								handleFormAnswer={(answer, key, order) =>
									this.props.setFormAnswer(answer, key, order)
								}
								client={this.props.client}
								submitForm={(e) => this.props.handleSubmitForm(e)}
								setActiveTheme={this.state.setActiveTheme}
								isTheme={this.state.isTheme}
								submitFormLoading={this.state.submitFormLoading}
								clearStyle={() => this.props.clearFontStyles()}
								setTriggerFont={(e) => this.props.setTriggerFont(e)}
								triggerFont={this.state.triggerFont}
								activeFormQuestion={this.props?.activeFormQuestion}
							/>
						</>
					) : (
						''
					)}
					{this.props.module === 'summary' ? (
						<Summary
							isWorkflow={this.state.isWorkflow}
							sections={sectionsArr}
							tables={this.state.tables}
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
							globalSummaryData={this.state?.globalSummaryData}
						/>
					) : (
						''
					)}
					{this.props.module === 'invoice' ? (
						<Invoice
							variables={this.state.variables}
							isWorkflow={this.state.isWorkflow}
							preview={this.state.preview}
							previewType={this.state.previewType}
							invoiceDetails={this.props.invoiceDetails}
							client={this.props.client}
							tables={this.state.tables}
							paymentSchedule={this.state.paymentSchedule}
							setPaymentSchedule={(e) => {
								if (this.props?.setPaymentSchedule) {
									this.props?.setPaymentSchedule(e, null, 'invoice');
								}
							}}
							showSchedule={this.state.showSchedule}
							setTab={(e) => this.props.setActiveTab(e)}
							handleSideBar={(e, _id) => {
								this.props.client ? '' : this.props.handleOpenSideBar(e, _id);
							}}
							invoiceClientVariables={this.state?.invoiceClientVariables}
							invoiceNumber={this.state?.invoiceNumber}
							setInvoiceNumber={(e) => this.props.handleInvoiceNumber(e)}
							currencySymbol={this.props?.currencySymbol}
							invoiceTables={this.state.invoiceTables}
						/>
					) : (
						''
					)}
					{(this.props?.module === 'proposal' || this.props?.module === '*') &&
					_.has(this.state?.activeModule, 'showAsSlide') &&
					this.state?.activeModule?.showAsSlide === true ? (
						<Presentation
							triggerAdjustGridAreas={this.props.triggerAdjustGridAreas}
							client={this.props.client}
							setTriggerFontP={(e) => this.props.setTriggerFont(e)}
							setTriggeredFontP={(e) =>
								this.setState({
									triggeredFont: e,
								})
							}
							triggeredFont={this.state.triggeredFont}
							triggerFont={this.state.triggerFont}
							activeSubBlockId={this.state.activeSubBlockId}
							module={this.props.module}
							actionType={this.state.actionType}
							actionValue={this.state.actionValue}
							handleSideBarP={(e, _id, service = false) =>
								this.props.handleOpenSideBar(e, _id, service)
							}
							showAddBlockP={(e, order, index) =>
								this.toggleAddBlock(e, order, index)
							}
							setSubBlockContentP={(content, sectionID, blockID, id) =>
								this.props.handleSetSubBlockContent(content, sectionID, blockID, id)
							}
							preview={this.state?.preview}
							previewType={this.state?.previewType}
							activeImageP={(
								sectionID,
								blockID,
								subBlockID,
								imageURL,
								dimensions,
								ImgSubBlock,
							) =>
								this.props.handleActiveImage(
									sectionID,
									blockID,
									subBlockID,
									imageURL,
									dimensions,
									ImgSubBlock,
								)
							}
							handleSetTabP={(e, subBlockID, blockID) =>
								this.state.preview
									? ''
									: this.props.setActiveTab(e, subBlockID, blockID)
							}
							activeVariableID={this.state.activeVariableID}
							activeVariableName={this.state.activeVariableName}
							subBlockID={this.state.subBlockID}
							variables={this.state.variables}
							setContractActiveVariableP={(e) =>
								this.props.client == true
									? ''
									: this.props.contractActiveVariable(e)
							}
							handlesetActiveShapeP={(e) => this.props.setShape(e)}
							setButtonLinkP={(e) => this.props.handleSetButtonLink(e)}
							setNewTabP={(e) => this.props.handleSetOpenNewtab(e)}
							setButtonStylesP={(e) => this.props.setBtStyles(e)}
							btShapeP={(e) => this.props.btShape(e)}
							imgSettingDataP={(e) => this.props.imgSettingData(e)}
							selectBlockP={(e) => this.props.selectBlock(e)}
							duplicateBlockP={(e) => this.props.duplicateBlock(e)}
							handleSetBlockTabP={(e) => this.props.setBlockTab(e)}
							setTabP={(e) => (this.state.preview ? '' : this.props.setActiveTab(e))}
							circleTextDataP={(e) => this.props.circleTextData(e)}
							clearStyleP={() => this.props?.clearFontStyles()}
							handleIsValidURLP={(e) => {
								this.props.client
									? ''
									: this.props.client
									? ''
									: this.props?.setIsValidURL(e);
							}}
							activeSection={this.props?.activeSection}
							backgroundVideoURL={this.state?.backgroundVideoURL}
							handleIsValidBgVideoURLP={(e) => {
								this.props.setIsValidBgVideoURL(e);
							}}
							tenantLogo={this.props?.tenantLogo}
							isTenantLogo={this.state?.isTenantLogo}
							contractVariables={this.state?.contractVariables}
							uploadImageBase64P={(e) => this.props.uploadImageBase64(e)}
							tables={this.state?.tables}
							sections={this.state?.sections}
							socialMediaLinks={this.state?.socialMediaLinks}
							handleSetIconLinkP={(e, subBlockID, blockID) =>
								this.props.handleSetIconLink(e, subBlockID, blockID)
							}
							addServiceBlockP={(id, size, services_style) =>
								this.props.handleAddServiceBlock(id, size, services_style)
							}
							handleBSelectionP={(e, activeTextBlock) =>
								this.props.handleHSelection(e, activeTextBlock)
							}
							handleServiceSelectP={(block, type, value, id) =>
								this.props.serviceSelect(block, type, value, id)
							}
							setTableP={(e) => this.props.setTables(e)}
							setActiveSectionP={(e) => this.props.setActiveSection(e, true)}
							serviceTableSubBlockP={(e) => {
								this.props.setServiceSubBlock(e);
							}}
							handleDeleteServiceBlockP={(e, f) =>
								this.props.deleteServiceBlock(e, f)
							}
							setServiceBlockP={(e, f, g, h) =>
								this.props.setServiceBlockContent(e, f, g, h)
							}
							duplicateServiceBlockP={(e, f, g) =>
								this.props.duplicateServiceBlock(e, f, g)
							}
							handleUpdateSectionDataP={this.props?.handleUpdateSectionData}
							tablesValuesforClient={this.state?.tablesValuesforClient}
							deleteSectionP={(e) => this.props.handledeleteSection(e)}
							onDragEndP={(e) => {
								this.setState({ sections: e });
								this.props?.onPresentationDragEnd(e);
							}}
							activeModule={this.state?.activeModule}
							currencySymbol={this.props?.currencySymbol}
							invoiceTables={this.props.invoiceTables}
							isWorkflow={this.state.isWorkflow}
							submitFormLoading={this.state.submitFormLoading}
							setFSectionsP={(e, restrict = null) =>
								this.props.setSections(e, restrict)
							}
							deleteFBlockP={(blockID, sectionID) =>
								this.props.deleteFQBlock(blockID, sectionID)
							}
							addQuesP={(sectionID, blockOrder) =>
								this.props.addFormQuestion(sectionID, blockOrder)
							}
							handleSetFSideBarP={(e, blockID) =>
								this.props.setActiveFormQuestion(e, blockID)
							}
							addOptionFormP={(e) => this.props.handleAddFormOption(e)}
							handleFormAnswerP={(answer, key, order) =>
								this.props.setFormAnswer(answer, key, order)
							}
							submitFormP={(e, sectionId) =>
								this.props.handleSubmitForm(e, sectionId)
							}
							contractBg={this.state.contractBg}
							signatures={this.state.signatures}
							toggleSignatureModalP={this.toggleSignatureModal}
							handleActiveCurrentSignatureSubBlockP={(e) =>
								this.setState({
									activeCurrentSignatureSubBlock: e,
								})
							}
							version={this.props.version}
							setPaymentScheduleP={(e, id, styles = null) => {
								if (this.props?.setPaymentSchedule) {
									this.props?.setPaymentSchedule(e, id, null, styles);
								}
							}}
							addPaymentScheduleBlockP={(id, order) =>
								this.props.addPaymentScheduleBlock(id, order)
							}
							invoiceDetails={this.props?.invoiceDetails}
							paymentSchedule={this.state?.paymentSchedule}
							showSchedule={this.state?.showSchedule}
							invoiceClientVariables={this.state?.invoiceClientVariables}
							invoiceNumber={this.state?.invoiceNumber}
							handleInvoiceNumberP={(e) => this.props?.handleInvoiceNumber(e)}
							activeFontColor={this.state?.activeFontColor}
							DeleteInTableP={(type, index) =>
								this.props?.handleDeleteInTable(type, index)
							}
							AddInTableP={(type, index, position, length = 0) =>
								this.props?.handleAddInTable(type, index, position, length)
							}
							DuplicateInTableP={(type, index) =>
								this.props?.handleDuplicateInTable(type, index)
							}
							showAddElementP={(e, order, index, isFluid, sectionId) =>
								this.toggleAddBlock(e, order, index, isFluid, sectionId)
							}
							duplicateSubBlockP={(json, subBlockId, sectionId) =>
								this.props.duplicateSubBlock(json, subBlockId, sectionId)
							}
							saveSectionsP={(e, restrict = null) =>
								this.props.setSections(e, restrict)
							}
							previewMode={this.state.previewMode}
							handleAddElementP={(e, zIndex) =>
								this.props.handleAddElement(e, zIndex)
							}
							setLastClickP={(e) => this.props.setLastClick(e)}
							handleSaveblocksP={(e) => {
								this.props.handleSaveblocks(e, this.state.activeSectionID);
							}}
							generateAIImagesP={(e) => this.props.generateAIImages(e)}
							generateAITextP={(e) => this.props.generateAIText(e)}
							handleAddLayout={(e, isFluid, isService) =>
								this.props.handleAddLayout(e, isFluid, isService)
							}
							handleOpenSideBar={(e, _id) => {
								this.props.handleOpenSideBar(e, _id, false, true);
							}}
							activeModuleId={this.props?.activeModuleId}
							handleSaveSingleBlock={(e) => {
								this.props.handleSaveSingleBlock(e, this.state.activeSectionID);
							}}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							handleSaveblocks={(e) => this.props.handleSaveblocks(e)}
							themes={this.props?.themes}
						/>
					) : (
						''
					)}

					{/* Contract Module */}
					{this.props.module === 'contract' && (
						<ContractModule
							signatures={this.state.signatures}
							contractBg={this.state.contractBg}
							previewType={this.state.previewType}
						/>
					)}
				</div>

				{/* Contract Signature Modal */}
				{this.state.showContractSingatureModal && (
					<ContractSignature
						handleClose={() => this.setState({ showContractSingatureModal: false })}
						show={this.state.showContractSingatureModal}
						modalType={'center'}
						handleSignature={(e) => {
							if (this.props.version === 1) {
								this.props.setSignature(
									e,
									this.state.activeCurrentSignatureSubBlock,
								);
							} else {
								this.props.setSignature(e);
							}
						}}
						uploadingSignature={this.state.uploadingSignature}
						handleUploadSignature={(e) =>
							this.props.uploadSignature(e, this.state.activeCurrentSignatureSubBlock)
						}
						handleContractNaviagtion={this.state?.handleContractNaviagtion}
						signatureUploaded={this.props.signatureUploaded}
						toggleSignatureModal={this.toggleSignatureModal}
						currencySymbol={this.props?.currencySymbol}
					/>
				)}

				{/* Accept Proposal Modal */}
				{this.state.showAcceptProposalModal && (
					<AcceptProposalModal
						handleClose={() => this.setState({ showAcceptProposalModal: false })}
						show={this.state.showAcceptProposalModal}
						modalType={'center'}
						submitButtonHandler={this.props.handleAcceptProposal}
					/>
				)}
			</>
		);
	}
}

export default Builder;
