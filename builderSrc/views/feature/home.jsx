import { Fragment, createRef } from 'react';
import '../../assets/scss/home.scss';
import Header from '../components/header';
import Builder from '../components/library/builder';
import Sidebar from '../components/sidebar';
import Proposals from '../../controllers/proposals';
import { withRouter } from '../../services/withRouter';
import _ from 'lodash';
import { gql } from '@apollo/client';
import AddBlockV2 from '../components/library/addBlock/addblock';
import { Helmet } from 'react-helmet';
import jsonData from '../../layouts.json';
import jsonElementsData from '../../elements.json';
import ManagePages from '../components/managePages';
import Modal from '../components/library/modals';
import { ToWords } from 'to-words';
import { ReactComponent as AddBlock } from '../../assets/svg/plus.svg';

import getSymbolFromCurrency from 'currency-symbol-map';
import moment from 'moment';
import { message } from 'antd/lib';
import SharePopup from '../components/HomePopups/SharePopup';
import CreateClient from '../components/HomePopups/CreateClient';
import UpdatedHeader from './Header/Index';
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg';
import { ReactComponent as HamburgerIcon } from '../components/library/svgs/Navbar/HandBurger.svg';
import { ReactComponent as Exit } from '../../assets/svg/close.svg';

// svgs for smartfeilds
import { ReactComponent as Close } from '../../assets/svg/close.svg';
import { ReactComponent as DropDown } from '../../assets/svg/dropDown.svg';

import { ReactComponent as Text } from '../components/smartFields/smartFields/text.svg';
import { ReactComponent as LongText } from '../components/smartFields/smartFields/longText.svg';
import { ReactComponent as Number } from '../components/smartFields/smartFields/number.svg';
import { ReactComponent as PhoneNumber } from '../components/smartFields/smartFields/phoneNumber.svg';
import { ReactComponent as Email } from '../components/smartFields/smartFields/at.svg';
import { ReactComponent as Date } from '../components/smartFields/smartFields/date.svg';
import { ReactComponent as Link } from '../components/smartFields/smartFields/link.svg';
import { ReactComponent as Currency } from '../components/smartFields/smartFields/currency.svg';

import { ElementSidebar } from '../components/builder_client_common';
// library for creATING IDs FOR BLOCKS AND SUBBLOCKS

// element animations
import HoverPopup from '../components/animePopups/HoverPopup';
import LoopPopup from '../components/animePopups/LoopPopup';
import ThemeSettings from '../components/HomePopups/ThemeSettings';
import { initialThemeState } from '../components/themeSettings/themeconstants';
import DeleteTemplatePopup from '../components/HomePopups/DeleteTemplatePopup';
import ObjectID from 'bson-objectid';
import CheckMobileView from '../components/HomePopups/CheckMobileView';

const query = gql`
	query Query($getDetailedTemplateInfoId: ID!) {
		getDetailedTemplateInfo(id: $getDetailedTemplateInfoId)
	}
`;
const moduleQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
	}
`;
const fileModuleQuery = gql`
	query Query($getWorkflowModuleId: ID!, $module: String) {
		getWorkflowModule(id: $getWorkflowModuleId, module: $module)
	}
`;
const update_Workflow_Template = gql`
	mutation UpdateWorkflowTemplate($templateId: ID!, $updateObj: TemplateUpdateObj!) {
		updateWorkflowTemplate(templateId: $templateId, updateObj: $updateObj) {
			status
			navBar
			themes
		}
	}
`;

const createLeadQuery = gql`
	mutation CreateWorkflowFromTemplate($workflowInput: WorkflowInput) {
		createWorkflowFromTemplate(workflowInput: $workflowInput) {
			_id
			status
			clientDetails {
				_id
				name
				email
			}
		}
	}
`;
const updateWorkflowTemplateTitle = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;
const updateWorkflowTemplateTitleNew = gql`
	mutation UpdateWorkflowTemplate($templateId: ID!, $updateObj: TemplateUpdateObj!) {
		updateWorkflowTemplate(templateId: $templateId, updateObj: $updateObj) {
			_id
			title
		}
	}
`;

const updateIndividualWorkflowTitle = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;

const workflowQuery = gql`
	query Query($getDetailedWorkflowInfoId: ID!) {
		workflowInfo(id: $getDetailedWorkflowInfoId)
	}
`;

const moduleWorkflowQuery = gql`
	query Query($getWorkflowModuleId: ID!, $module: String) {
		getWorkflowModule(id: $getWorkflowModuleId, module: $module)
	}
`;

const moduleProposalQuery = gql`
	query Query($workflowId: ID!, $proposalInfoId: ID!) {
		proposalInfo(workflowId: $workflowId, id: $proposalInfoId)
	}
`;

const loadingTexts = [];

const updateModules = gql`
	mutation UpdateWorkflowTemplate($templateId: ID!, $updateObj: TemplateUpdateObj!) {
		updateWorkflowTemplate(templateId: $templateId, updateObj: $updateObj) {
			_id
		}
	}
`;

const updateIndividualModules = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;

const moduleTemplateQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
	}
`;

const duplicateModule = gql`
	mutation DuplicateModuleTemplate(
		$templateId: ID!
		$moduleId: ID!
		$order: Int
		$isTemplate: Boolean
	) {
		duplicateModuleTemplate(
			templateId: $templateId
			moduleId: $moduleId
			order: $order
			isTemplate: $isTemplate
		)
	}
`;
const deleteModule = gql`
	mutation Mutation($templateId: ID!, $moduleId: ID!, $isTemplate: Boolean) {
		removeModuleTemplate(templateId: $templateId, moduleId: $moduleId, isTemplate: $isTemplate)
	}
`;
const deleteModulesInWorkflow = gql`
	mutation RemoveModuleTemplate($templateId: ID!, $moduleId: ID!, $isTemplate: Boolean) {
		removeModuleTemplate(templateId: $templateId, moduleId: $moduleId, isTemplate: $isTemplate)
	}
`;
const addModule = gql`
	mutation AddModuleTemplate($templateId: ID!, $moduleTemplateInput: ModuleTemplateInput!) {
		addModuleTemplate(templateId: $templateId, moduleTemplateInput: $moduleTemplateInput)
	}
`;

const templateList = gql`
	query Templates($filters: TemplateListFiltersInput) {
		templates(filters: $filters) {
			data {
				_id
				moduleTemplates {
					module
					order
					_id
					isPublic
					label
				}
				title
			}
			totalPages
			totalDocs
			limit
			currentPage
			hasNextPage
			hasPrevPage
			prevPage
			nextPage
		}
	}
`;

const WorkflowsList = gql`
	query Workflows($filters: WorkflowsListFiltersInput) {
		workflows(filters: $filters) {
			currentPage
			data {
				_id
				modules
				title
			}
			hasPrevPage
			hasNextPage
			limit
			nextPage
			prevPage
			totalDocs
			totalPages
		}
	}
`;
const workflowQueryWithModules = gql`
	query Query($getWorkflowWithModulesId: ID!) {
		getWorkflowWithModules(id: $getWorkflowWithModulesId)
	}
`;

const isSlugAvailableQuery = gql`
	query Query($slug: String!, $moduleType: Modules!) {
		isSlugAvailable(slug: $slug, moduleType: $moduleType)
	}
`;

const updateSlugQuery = gql`
	mutation UpdateSlug($updateSlugId: ID!, $slug: String!, $moduleType: Modules!) {
		updateSlug(id: $updateSlugId, slug: $slug, moduleType: $moduleType)
	}
`;
const customExpiryQuery = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;
const updateHittingCount = gql`
	mutation FileSentStatus($fileSentStatusId: ID!) {
		fileSentStatus(id: $fileSentStatusId) {
			message
			__typename
		}
	}
`;

const updateClientVariables = gql`
	mutation UpdateSmartFile($updateSmartFileId: ID!, $updateObj: UpdateSmartFileInput) {
		updateSmartFile(id: $updateSmartFileId, updateObj: $updateObj)
	}
`;
const getClientNameQuery = gql`
	query ClientsList($filters: ClientListFiltersInput!) {
		clientsList(filters: $filters) {
			data {
				_id
				email
				name
				phoneNumber
			}
			totalPages
			totalDocs
			limit
			currentPage
			hasNextPage
			hasPrevPage
			prevPage
			nextPage
		}
	}
`;

const SmartFileClientUpdate = gql`
	mutation AddClientToSmartFile($addClientToSmartFileId: ID!, $clientId: ID!) {
		addClientToSmartFile(id: $addClientToSmartFileId, clientId: $clientId) {
			_id
			clientDetails {
				_id
				name
				email
				source
				phoneNumber
			}
		}
	}
`;
const addClientDetails = gql`
	mutation CreateClient($clientInput: ClientInput!) {
		createClient(clientInput: $clientInput) {
			_id
			email
			name
			phoneNumber
		}
	}
`;

const addBlankPage = gql`
	mutation AddModuleTemplate($templateId: ID!, $moduleTemplateInput: ModuleTemplateInput!) {
		addModuleTemplate(templateId: $templateId, moduleTemplateInput: $moduleTemplateInput)
	}
`;

const updateWorkflowTemplateQuery = gql`
	mutation UpdateWorkflowTemplate($templateId: ID!, $updateObj: TemplateUpdateObj!) {
		updateWorkflowTemplate(templateId: $templateId, updateObj: $updateObj) {
			_id
			navBar
			imageUrl
		}
	}
`;

const updateNavBar_Theme_File_Query = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;
const updateNavBarWorkflowQuery = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;

const duplicateTemplateQuery = gql`
	mutation DuplicateWorkflowTemplate($templateId: ID!, $title: String!) {
		duplicateWorkflowTemplate(templateId: $templateId, title: $title) {
			_id
			title
		}
	}
`;

const deleteTemplateQuery = gql`
	mutation DeleteTemplate($deleteTemplateId: ID!, $isDeleted: Boolean) {
		deleteTemplate(id: $deleteTemplateId, isDeleted: $isDeleted) {
			message
		}
	}
`;

class Home extends Proposals {
	constructor(props) {
		super();
		this.debounceFuncForImage = this.debounceFuncForImage.bind(this);
		this.state = {
			schedules: [],
			previewModuleSections: [],
			showSideBar: false,
			activeFontColor: '',
			actionType: null,
			actionValue: null,
			isSelected: false,
			crop: { x: 0, y: 0 },
			zoom: 1,
			sections: [],
			activeSectionID: null,
			title: '',
			activeTextBlock: null,
			activeSectionPadding: 0,
			activeSectionBg: '#FFF',
			preview: false,
			previewType: 'd',
			previewMode: 'd',
			activeBlockID: null,
			activeSubBlockID: null,
			activeImageURL: null,
			activeSubBlockType: 'b',
			isLoading: true,
			isSaveLoading: false,
			isServiceBlock: false,

			selection_is_required: false,
			services_selection: 2,
			services_style: 1,
			activeVariableID: null,
			activeVariableName: null,
			hasImageBlock: false,
			hasButton: false,
			hasShape: false,
			isGeneratePreview: false,
			sectionVariables: [],
			client: false,
			sectionTables: [],

			activeContractVariable: null,
			activeFormQuestion: null,

			module: '',
			modules: [],
			duplicateModules: [],
			tenantLogo: null,
			activeModuleId: null,
			activeBlock: {},
			activeShape: null,
			buttonLink: '',
			openInNewTab: {},
			setBtStyles: {},
			btShape: '',
			imgSettingData: {},
			showServiceSubBlock: false,
			activeServiceSubBlock: null,
			isAutoSaving: false,
			timeout1: null,
			timeout2: null,
			headerSection: [],
			isHeader: '',
			headerSectionId: '',
			formBgColor: '',
			showAddBlock: false,
			contentAlign: '',
			hasIcon: false,
			blockBorder: '',
			device: '',
			activeTheme: {},
			isTheme: true,
			paddingHorizontal: 0,
			activeAnimation: 0,
			fonts: [],
			selectedFont: null,
			fontsLoading: true,
			currentIconColor: '',
			currentSizeIcons: '',
			currentIconType: '',
			currentIconBgColor: '',
			hasCircleText: false,
			circleTextData: {},
			animationType: '',
			animationDirection: '',
			animationSpeed: '',
			activeImageWidth: null,
			activeImageHeight: null,
			hasSticker: false,
			currentSticker: '',

			hasListIcon: true,
			listIconShape: '',
			listIconColor: '',
			listIconSize: '',

			logoStickerFill: '',
			isLogo: false,

			isWorkflow: false,

			isModule: false,
			moduleType: '',

			videoURL: '',
			loop: false,

			alignVideoBlock: '',
			fillVideoBlock: false,

			autoplay: false,

			isValidURL: true,

			backgroundType: '',
			backgroundImageURL: '',
			backgroundVideoURL: '',
			isValidBgVideoURL: true,
			hasLogoSticker: false,
			tenantsData: {},

			contractVariables: false,
			isTenantLogo: true,

			noPadding: false,

			ImgOverlayColor: '',
			ImgOverlayOpacity: 0,
			activeImageSubBlock: {},

			innerPadding: false,
			base64: null,
			uploadAIImage: false,
			isElement: null,

			scrollStyles: {},
			fontStyles: {},
			scrollText: '',
			scrollSymbol: '',
			itemSpacing: 0,
			hasScrollText: false,
			singleEditClientRenderedOnce: false,
			hasIframe: false,
			source: '',
			summaryBg: '',
			summaryFont: '',
			summaryFontSize: '',
			summaryFontColor: '',
			eventsLabel: true,
			paymentsLabel: true,
			summaryBlock: {},
			paymentSchedule: [],

			showSchedule: true,
			invoiceClientVariables: [],
			invoiceNumber: {},
			socialMediaLink: {},
			largeIcon: false,
			managePages: false,
			triggerFont: false,
			triggeredFont: null,
			mobileViewLocked: false,
			clickGridArea: '',
			activeWorkflowModuleId: '',
			activeVersionId: '',

			cardColor: '',
			fieldData: {
				custom: [],
				module: [],
				workspace: [],
			},
			iframeScroll: false,

			activeModule: null,
			templateList: [],
			invoiceTables: [],
			currency: '',
			currencySymbol: null,
			settingEnabled: false,
			settingClosingFlag: false,
			endUrl: '',
			settingName: false,
			settingEmail: false,
			settingPhone: false,
			isEnable: false,
			expiresAt: null,
			// expiryAt: 1737370884, // Example Unix timestamp
			weeks: 0,
			days: 0,
			totalDays: 0,
			customDomain: '',
			editSlug: false,
			debouceInterval: null,
			slugErrorMsg: false,
			globalTables: [],
			globalSections: [],
			globalSummaryData: {},

			// debounceStateForImage: null,
			customExpiry: false,
			customExpiryDate: 0,
			isShare: false,
			information: false,
			status: false,
			invoiceDetails: {},
			fluidShowGrid: false,
			copyStatus: false,
			workflow_id: '',
			socialMediaLinks: {},
			closeWorkFlowPopup: false,
			clientListArray: [],
			clientData: {
				name: '',
				email: '',
				phone: '',
				source: '',
			},
			sourceList: ['Instagram', 'Thread', 'Snapchat', 'Pinterest'],
			updateClient: false,
			closeUpdateClient: false,
			showAiAssistant: true,
			isAlChatEnabled: false,
			clientDetails: {},
			errorNameMsg: false,
			isClientVariable: false,
			addClientDetails: false,
			activeBackgroundWidth: 'full',
			activeModuleSections: [],
			isSubmit: false,

			activeElementAnimeName: '',
			activeElementAnimeType: '',
			showAnimationPopup: false,

			showPopupInMobile: false,
			activePopupType: '',
			activePopupComponent: {},
			debounceCropperValues: null,

			isFluidLayout: false,

			showThemeSettings: false,
			template_ID: null,
			titleName: '',
			showEditDesignModal: false,
			navBar: {},
			debounceStateForElementProps: null,
			finalTotalCost: 0,
			allSchedules: [],
			themes: _.cloneDeep(initialThemeState),
			getCurrency: '',

			// smartFields
			showSmartFieldModal: false,
			isEditSmartFeild: false,
			selectedSmartOption: '',
			isSmartFieldsOpen: false,
			smartFieldValue: '',
			smartFieldName: '',
			activeSmartFieldData: null,
			navbarMobileEdit: false,
			showMobileMenu: false,
			isTemplateDeleteOpen: false,
			numOfDocuments: 0,
			isFormTemplate: false,
			triggerAdjustGridAreas: false,
			workflowTemplateID: null,
			invoiceSentDate: null,
			invoiceAcceptedDate: null,
			imageUrl: null,
			showCheckMobilePopup: false,
			getModuleParams: {
				id: null,
				type: null,
			},
			alreadyCheckedMobileView: false,
			didChangedSomething: false,
		};
		this.componentRef = createRef();
		this.addBlockRef = createRef();
		this.settingRef = createRef();
		this.infoRef = createRef();
		this.shareLiveRef = createRef();
		this.updateClientRef = createRef();
		this.shareRef = createRef();
		this.elementPopupRef = createRef();
		this.animationPopupRef = createRef();
		this.editDesignModalRef = createRef();
		this.mCloseEditNavRef = createRef();
		this.templateDeleteRef = createRef();
	}
	componentDidMount = async () => {
		// setting the local storage keys for development
		const currentURL = window.location.href;

		if (currentURL.includes('localhost') || currentURL.includes('192.168')) {
			const requiredKeys = ['usertoken', 'workspaceId', 'region'];

			requiredKeys.forEach((key) => {
				if (!localStorage.getItem(key)) {
					localStorage.setItem(key, 'true');
				}
			});
		}
		const formSearchParams = new URLSearchParams(window.location.search);
		const form = formSearchParams.get('form');

		if (form) {
			this.setState({
				isFormTemplate: true,
			});
		}
		// Set global client flag

		window.isClient = this.state.client;

		//await this.getTemplate(this.props.params.templateID);

		await this.getFonts();
		await this.getTenantsData();
		await this.getCurrencySymbol();

		// let json ={};
		// this.createLayout(json);
		this.setState({
			activeModuleId: this.props.params.templateID,
		});

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const sessionId = urlParams?.get('sessionId');
		if (!sessionId) {
			// console.warn('No sessionId found in URL parameters');
		}

		const workflow = urlParams?.get('workflow') || this.state.isWorkflow;
		const module = urlParams?.get('module') || this.state.isModule;
		const moduleType = urlParams?.get('type') || this.state.moduleType;

		if (workflow) {
			let response = await this.getWorkflowWithModules(workflowQueryWithModules, {
				getWorkflowWithModulesId: this.props.params.templateID,
			});

			// if (response?.[1]?.data?.getWorkflowWithModules === null) {
			// 	return this.props.navigate('/not-found?messageText=workflowNotFound');
			// } else if (response?.[1]?.networkError?.result?.message === 'Invalid token.') {
			// 	return this.props.navigate('/?messageText=invalidToken');
			// } else if (response?.[1]?.networkError?.result?.message === 'Workspace not found') {
			// 	return this.props.navigate('/not-found?messageText=workspaceNotFound');
			// }
			await this.getVariables(this.props.params.templateID);
		}
		this.setState(
			{
				isWorkflow: workflow,
				isModule: module,
				moduleType,
				closeWorkFlowPopup: localStorage.getItem(
					`${this.props.params.templateID}::closeWorkFlowPopup`,
				),
			},
			async () => {
				if (this.state.isWorkflow) {
					let response = await this.getIndividualWorkflowInfo(workflowQuery);

					if (response[0] == true) {
						this.setState(
							{
								navBar: response[1]?.data?.workflowInfo?.navBar,
								workflow_id: response[1]?.data?.workflowInfo?._id,
							},
							() => {
								if (
									!this.state.navBar ||
									Object.keys(this.state.navBar).length === 0
								) {
									this.handleCreateNavBar();
								}
							},
						);
					}
					//change the active module to proposal , first private module
				} else if (this.state.isModule) {
					await this.getIndividualTemplate(moduleTemplateQuery, {
						getModuleTemplateId: module,
						module: this.state.moduleType,
					});
				} else {
					let response = await this.getWorkflowInfo(query);

					// if (response?.[1]?.data?.getDetailedTemplateInfo === null) {
					// 	return this.props.navigate('/not-found?messageText=templateNotFound');
					// } else if (response?.[1]?.networkError?.result?.message === 'Invalid token.') {
					// 	return this.props.navigate('/not-found?messageText=invalidToken');
					// } else if (
					// 	response?.[1]?.networkError?.result?.message === 'Workspace not found'
					// ) {
					// 	return this.props.navigate('/not-found?messageText=workspaceNotFound');
					// }
					//  else
					if (response[0] == true) {
						this.setState(
							{
								navBar: response[1]?.data?.getDetailedTemplateInfo?.navBar,
							},
							() => {
								if (
									!this.state.navBar ||
									Object.keys(this.state.navBar).length === 0
								) {
									this.handleCreateNavBar();
								}
							},
						);
					}
					// ! not needed
					// await this.handleSaveSections();
				}
			},
		);

		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (e) => {
		if (this.addBlockRef.current && !this.addBlockRef.current.contains(e.target)) {
			this.setState({
				showAddBlock: false,
			});
		}
		if (this.settingRef.current && !this.settingRef.current.contains(e.target)) {
			this.setState({
				isShare: false,
			});
		}
		if (this.infoRef.current && !this.infoRef.current.contains(e.target)) {
			this.setState({
				information: false,
			});
		}
		if (this.shareLiveRef.current && !this.shareLiveRef.current.contains(e.target)) {
			this.setState({
				status: false,
			});
		}
		if (this.updateClientRef.current && !this.updateClientRef.current.contains(e.target)) {
			this.setState({
				updateClient: false,
			});
		}
		if (this.shareRef.current && !this.shareRef.current.contains(e.target)) {
			this.setState({
				isShare: false,
			});
		}
		if (
			this?.elementPopupRef?.current &&
			this.elementPopupRef.current.getSidebarNode && // check if method exists
			!this.elementPopupRef.current.getSidebarNode().contains(event.target) &&
			!this.state.showMPopupImageModal
		) {
			this.setState({
				showPopupInMobile: false,
			});
		}
		if (this.animationPopupRef.current && !this.animationPopupRef.current.contains(e.target)) {
			this.setState({
				showAnimationPopup: false,
			});
		}

		if (
			this.editDesignModalRef.current &&
			!this.editDesignModalRef.current.contains(e.target)
		) {
			this.setState({
				showEditDesignModal: false,
			});
		}
		if (
			this.mCloseEditNavRef.current &&
			!this.mCloseEditNavRef.current.contains(e.target) &&
			!this.state.showMobileMenu
		) {
			this.setState({
				mobileNavbarEdit: false,
				navbarMobileEdit: false,
			});
		}
		if (this.templateDeleteRef.current && !this.templateDeleteRef.current.contains(e.target)) {
			this.setState({
				isTemplateDeleteOpen: false,
			});
		}
	};
	componentDidUpdate = async (preProps, prevState) => {
		if (prevState.modules !== this.state.modules) {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			if (urlParams?.get('aiGenerated')) {
				this.getModule(
					_.filter(this.state.modules, { module: 'proposal' })[0]?._id,
					'proposal',
				);
			}
		}
		if (
			this.state.isSectionLoaded !== prevState.isSectionLoaded &&
			prevState.isSectionLoaded == false
		) {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			let ai = urlParams?.get('aiGenerated');
			if (ai === 'true') {
				const generateAIContent = async () => {
					try {
						const sections = [...this.state.sections];

						// Process sections sequentially to maintain order
						for (const section of sections) {
							const json = {
								moduleId: this.state.activeModuleId,
								sectionId: section._id,
								content_prompt: section.content,
								layoutId: section.layoutId,
							};

							await this.getLayoutTextContent(json);
							await this.handleSaveSections(true, null, null);
						}

						this.setState({
							isSectionLoaded: true,
							sections: sections,
						});
					} catch (error) {
						console.error('Error generating AI content:', error);
						this.setState({
							isSectionLoaded: true,
							error: 'Failed to generate AI content',
						});
					}
				};

				// Execute the async function
				generateAIContent();
			}
		}
		if (
			this.state.fontsLoading !== prevState.fontsLoading &&
			this.state.fontsLoading == false
		) {
			this.loadFont();
		}
		if (
			this.state.activeBlockID !== prevState.activeBlockID &&
			this.state.activeBlockID !== null
		) {
			let headerID = this.state.headerSectionId === this.state.activeSectionID;
			let sections =
				this.state.module === 'form' && this.state.isHeader && headerID
					? [this.state.headerSection]
					: [...this.state.sections];
			_.forEach(sections, (section, key) => {
				if (section._id === this.state.activeSectionID) {
					_.forEach(section.blocks, (block, k) => {
						if (block._id == this.state.activeBlockID) {
							_.forEach(block.subBlocks, (subBlock, k) => {
								if (subBlock._id == this.state.activeSubBlockID) {
									if (subBlock.isLogo) {
										this.setState({ isLogo: true });
									} else {
										this.setState({ isLogo: false });
									}
								}
							});
						}
					});
				}
			});
		}

		if (
			prevState.activeSubBlockID !== this.state.activeSubBlockID &&
			this.state?.activeSubBlockID
		) {
			let sections =
				this.state.module === 'form' && this.state.isHeader
					? [this.state.headerSection]
					: [...this.state.sections];

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock?._id == this.state?.activeSubBlockID) {
								if (
									subBlock?.animations?.animeType !=
										this.state?.activeElementAnimeType &&
									subBlock?.animations
								) {
									this.setState({
										activeElementAnimeType:
											subBlock?.animations?.animeType || '',
									});
								}
								if (
									subBlock?.animations?.animeName !=
										this.state?.activeElementAnimeName &&
									subBlock?.animations?.animeName
								) {
									this.setState({
										activeElementAnimeName:
											subBlock?.animations?.animeName || '',
									});
								}
							}
						});
					});
				}
			});
		}

		if (
			prevState.activeSectionID !== this.state.activeSectionID &&
			this.state.activeSectionID !== null
		) {
			let headerID = this.state.headerSectionId === this.state.activeSectionID;
			let sections =
				this.state.module === 'form' && this.state.isHeader && headerID
					? [this.state.headerSection]
					: [...this.state.sections];
			let activeSectionBg = this.state.activeSectionBg;
			let activeSectionPadding = this.state.activeSectionPadding;
			let paddingHorizontal = this.state.paddingHorizontal;
			let activeAnimation = this.state.activeAnimation;
			let animationType = this.state.animationType;
			let activeBlock = this.state.activeBlock;
			let animationDirection = this.state.animationDirection;
			let animationSpeed = this.state.animationSpeed;
			let activeSection = _.filter(sections, {
				_id: this.state.activeSectionID,
			})[0];

			let noPadding = this.state.noPadding;
			let innerPadding = this.state.innerPadding;

			activeBlock = activeSection;

			activeSectionBg = activeSection?.style?.sectionBackgroundColor;
			activeSectionPadding = activeSection?.style?.padding;
			activeAnimation = _.has(activeSection?.style, 'isAnimation')
				? activeSection?.style?.isAnimation
				: 0;
			paddingHorizontal = _.has(activeSection?.style, 'paddingHorizontal')
				? activeSection?.style?.paddingHorizontal
				: 0;
			animationType = _.has(activeSection?.style, 'animationType')
				? activeSection?.style?.animationType
				: 'fadeIn';
			animationDirection = _.has(activeSection?.style, 'animationDirection')
				? activeSection?.style?.animationDirection
				: 'left';
			animationSpeed = _.has(activeSection?.style, 'animationSpeed')
				? activeSection?.style?.animationSpeed
				: 'slow';

			(noPadding = _.has(activeSection?.style, 'noPadding') ? true : false),
				(innerPadding = _.has(activeSection?.style, 'innerPadding') ? true : false),
				this.setState({
					// showSideBar: true,
					activeSectionPadding,
					activeSectionBg,
					activeBlock,
					paddingHorizontal,
					activeAnimation,
					animationType,
					animationSpeed,
					animationDirection,
					// showAddBlock: false,
					noPadding,
					innerPadding,
				});
			let subBlocksWithTypeImage = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block, k) => {
						_.forEach(block.subBlocks, (subBlock, index) => {
							if (
								subBlock.type === 'image' ||
								section.type === 'services' ||
								subBlock.type === 'shape'
							) {
								subBlocksWithTypeImage.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasImageBlock: _.size(subBlocksWithTypeImage) > 0,
			});
			//added karthik
			let subBlocksWithTypeButton = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'button') {
								subBlocksWithTypeButton.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasButton: _.size(subBlocksWithTypeButton) > 0,
			});
			let subBlocksWithTypeSticker = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'sticker') {
								subBlocksWithTypeSticker.push(subBlock._id);
							}
						});
					});
				}
			});
			this.setState({
				hasSticker: _.size(subBlocksWithTypeSticker) > 0,
			});

			let subBlocksWithTypeIcon = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'icon') {
								subBlocksWithTypeIcon.push(subBlock._id);
							}
						});
					});
				}
			});

			let subBlocksWithTypeLogoSticker = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'logoSticker') {
								subBlocksWithTypeLogoSticker.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasLogoSticker: _.size(subBlocksWithTypeLogoSticker) > 0,
			});

			this.setState({
				hasIcon: _.size(subBlocksWithTypeIcon) > 0,
			});
			_.forEach(sections, (section, key) => {
				if (section._id === this.state.activeSectionID) {
					_.forEach(section.blocks, (block, k) => {
						if (block._id == this.state.activeBlockID) {
							_.forEach(block.subBlocks, (subBlock, k) => {
								if (subBlock._id == this.state.activeSubBlockID) {
									if (subBlock.isLogo) {
										this.setState({ isLogo: true });
									} else {
										this.setState({ isLogo: false });
									}
								}
							});
						}
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'fillColor')) {
								this.setState({
									currentIconColor: subBlock.fillColor,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'iconBgColor')) {
								this.setState({
									currentIconBgColor: subBlock.iconBgColor,
								});
							}
						});
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'iconSize')) {
								this.setState({
									currentSizeIcons: subBlock.iconSize,
								});
							}
						});
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'iconType')) {
								this.setState({
									currentIconType: subBlock.iconType,
								});
							}
						});
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'isSticker')) {
								this.setState({
									currentSticker: subBlock.isSticker,
								});
							}
						});
					});
				}
			});

			// list Icons Abdullah

			let subBlocksWithTypeListIcon = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'listIcon') {
								subBlocksWithTypeListIcon.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasListIcon: _.size(subBlocksWithTypeListIcon) > 0,
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'color')) {
								this.setState({
									listIconColor: subBlock.color,
								});
							}
						});
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'size')) {
								this.setState({
									listIconSize: subBlock.size,
								});
							}
						});
					});
				}
			});

			// large icons of list
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					if (_.has(section?.style, 'largeIcon')) {
						this.setState({
							largeIcon: true,
						});
					}
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'shape')) {
								this.setState({
									listIconShape: subBlock.shape,
								});
							}
						});
					});
				}
			});

			let subBlocksWithTypeCircleText = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'circleText') {
								subBlocksWithTypeCircleText.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasCircleText: _.size(subBlocksWithTypeCircleText) > 0,
			});

			let subBlocksWithTypeShape = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'shape') {
								subBlocksWithTypeShape.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasShape: _.size(subBlocksWithTypeShape) > 0,
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						if (_.has(block, 'contentAlign')) {
							this.setState({
								contentAlign: block.contentAlign,
							});
						}
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'border')) {
								this.setState({
									blockBorder: subBlock.border,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'device')) {
								this.setState({
									device: subBlock.device,
								});
							}
						});
					});
				}
			});

			// logo sticker -Abdullah

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'fillColor')) {
								this.setState({
									logoStickerFill: subBlock.fillColor,
								});
							}
						});
					});
				}
			});

			// video bloack -Abdullah
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'videoURL')) {
								this.setState({
									videoURL: subBlock.videoURL,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'loop')) {
								this.setState({
									loop: subBlock.loop,
								});
							}
						});
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					if (_.has(section, 'alignVideoBlock')) {
						this.setState({
							alignVideoBlock: section.alignVideoBlock,
						});
					}
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						if (_.has(block, 'fillVideoBlock')) {
							this.setState({
								fillVideoBlock: block.fillVideoBlock,
							});
						}
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'autoplay')) {
								this.setState({
									autoplay: subBlock.autoplay,
								});
							}
						});
					});
				}
			});

			// contract page -Abdullah
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'isTenantLogo')) {
								this.setState({
									isTenantLogo: subBlock.isTenantLogo,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'contractVariables')) {
								this.setState({
									contractVariables: subBlock.contractVariables,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'text')) {
								this.setState({
									scrollText: subBlock.text,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'fontStyles')) {
								this.setState({
									fontStyles: subBlock.fontStyles,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'scrollStyles')) {
								this.setState({
									scrollStyles: subBlock.scrollStyles,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'itemSpacing')) {
								this.setState({
									itemSpacing: subBlock.itemSpacing,
								});
							}
						});
					});
				}
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'scrollSymbol')) {
								this.setState({
									scrollSymbol: subBlock.scrollSymbol,
								});
							}
						});
					});
				}
			});
			let subBlocksWithTypeScrolltext = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'scrollText') {
								subBlocksWithTypeScrolltext.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasScrollText: _.size(subBlocksWithTypeScrolltext) > 0,
			});

			let subBlocksWithTypeIframe = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (subBlock.type === 'iframe') {
								subBlocksWithTypeIframe.push(subBlock._id);
							}
						});
					});
				}
			});

			this.setState({
				hasIframe: _.size(subBlocksWithTypeIframe) > 0,
			});
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'source')) {
								this.setState({
									source: subBlock.source,
								});
							}
						});
					});
				}
			});
			// iframe scroll -jeevan
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						_.forEach(block.subBlocks, (subBlock) => {
							if (_.has(subBlock, 'iframeScroll')) {
								this.setState({
									iframeScroll: subBlock.iframeScroll,
								});
							}
						});
					});
				}
			});

			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					_.forEach(section.blocks, (block) => {
						if (block._id == this.state.activeBlockID) {
							if (_.has(block, 'cardColor')) {
								this.setState({
									cardColor: block.cardColor,
								});
							}
						}
					});
				}
			});

			let sectionWithTypeJourney = [];
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					if (_.has(section?.style, 'hasJourney')) {
						this.setState({
							hasJourney: section.style?.hasJourney,
						});
					}
				}
			});
			this.setState({
				hasJourney: _.size(sectionWithTypeJourney) > 0,
			});
		}

		// if (
		// 	this.state.preview !== prevState.preview &&
		// 	this.state.preview == true &&
		// 	this.state.showSideBar == true
		// ) {
		// 	this.handleCloseSideBar();
		// }
		if (
			this.state.isServiceBlock !== prevState.isServiceBlock &&
			this.state.isServiceBlock == true
		) {
			let sectionID = this.state.activeSectionID;
			let section = _.filter(this.state.sections, { _id: sectionID })[0];
			let selection_is_required;
			let services_selection;
			let services_style;
			selection_is_required = section?.style.selection_is_required;
			services_selection = section?.style.services_selection;
			// services_style = section.style.services_style;
			this.setState({
				selection_is_required,
				services_selection,
				services_style,
			});
		}
		if (this.state?.sectionVariables !== prevState?.sectionVariables) {
			this.setState({ sectionVariables: this.state.sectionVariables });
		}
		if (
			this.state?.module !== prevState?.module &&
			this.state?.isWorkflow &&
			!this.state.singleEditClientRenderedOnce
		) {
			this.setState({ isLoading: true });
			const modules = [...(this.state.modules || [])];

			let i;
			for (i = 0; i < modules.length; i++) {
				if (!modules?.[i]?.isPublic) {
					break;
				}
			}
			await this.getModule(modules?.[i]?._id, modules?.[i]?.module, true);
			this.setState({
				singleEditClientRenderedOnce: true,
			});
		}

		if (this.state.globalTables !== prevState.globalTables) {
			this.handleGlobalTables();
		}
	};

	renderModules = () => {
		let modules = [...this.state.modules];

		// Filter out the public modules if isWorkflow is true (for live preview)
		if (this.state.isWorkflow) {
			modules = modules.filter((ele) => !ele?.isPublic);
		}

		// Find the index of the last module with isPublic: true
		const lastPublicIndex = modules.reduce((lastIndex, module, index) => {
			return module.isPublic ? index : lastIndex;
		}, -1);

		// Find the index of the "Invoice" module
		const invoiceIndex = modules.findIndex((module) => module.module === 'invoice');

		// Add the "Summary" module before the "Invoice" module
		if (invoiceIndex && invoiceIndex !== -1) {
			modules.splice(invoiceIndex, 0, {
				module: 'summary',
				_id: 'summaryModule', // Unique _id for the new module
				label: 'summary',
				isPublic: false, // Adjust properties as needed
			});
		}
		const summaryIndex = modules.findIndex((module) => module.module === 'summary');

		return modules.map((module, k) => {
			if (module !== this.state.module) {
				const isLastPublic = k === lastPublicIndex;
				const moduleType = _.has(module, 'module') ? module.module : module.type;

				return (
					<Fragment key={module._id}>
						<span
							onClick={() => this.props.getModuleInfo(module._id, moduleType)}
							className={this.state.activeModuleId === module._id ? 'active' : ''}
						>
							{module.label}
						</span>

						{isLastPublic && (
							<div
								style={{
									width: '1px',
									height: '24px',
									backgroundColor: '#9B9290',
									display: 'inline-block',
									marginLeft: '5px',
								}}
							></div>
						)}
					</Fragment>
				);
			}
			return null; // Return null for the current module to avoid rendering it
		});
	};

	handleCloseSideBar = (e) => {
		this.setState({
			showSideBar: false,
		});
	};
	applyStyling = (e) => {
		this.setState({
			actionType: e,
		});
	};
	handleBlockStyles = (e, type) => {
		if (type === 'padding') {
			this.setState({
				activeSectionPadding: e,
			});
		} else if (type === 'sectionBackgroundColor') {
			this.setState({
				activeSectionBg: e,
			});
		} else if (type === 'paddingHorizontal') {
			this.setState({
				paddingHorizontal: e,
			});
		} else if (type === 'isAnimation') {
			this.setState({
				activeAnimation: e,
			});
		} else if (type === 'animationType') {
			this.setState({
				animationType: e,
			});
		} else if (type === 'animationDirection') {
			this.setState({
				animationDirection: e,
			});
		} else if (type === 'animationSpeed') {
			this.setState({
				animationSpeed: e,
			});
		} else if (type === 'titleBackgroundColor') {
			this.setState({
				titleBackgroundColor: e,
			});
		}

		let headerID = this.state.activeSectionID === this.state.headerSectionId;
		let sections =
			this.state.module === 'form' && this.state.isHeader && headerID
				? [this.state.headerSection]
				: [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let arr = [];
		_.map(sections, (section, k) => {
			if (section._id == activeSectionID) {
				if (section.style) {
					section.style[type] = e;
				} else {
					section.style = {
						[type]: e,
					};
				}
			}
			arr.push(section);
		});
		this.setState(
			this.state.module === 'form' && this.state.isHeader && headerID
				? {
						headerSection: arr[0],
						isAutoSaving: true,
				  }
				: {
						sections: arr,
						isAutoSaving: true,
						//activeBlock: _.filter(arr, { _id: this.state.activeSectionID })[0],
				  },
			async () => {
				await this.handleSaveSections(
					null,
					this.state.isHeader && headerID,
					'handleBlockStyles',
				);
			},
		);
	};
	//for text verticle align
	handleVerticleAlign = (e, f) => {
		let sectionsArray = [...this.state.sections];
		const newSectionsArray = [];

		_.map(sectionsArray, (section, k) => {
			if (section._id == this.state.activeSectionID) {
				_.map(section.blocks, (block, k) => {
					if (block._id == this.state.activeBlockID) {
						_.map(block.subBlocks, (subBlock, k) => {
							if (
								subBlock._id == this.state.activeSubBlockID ||
								e == 'mobileVerticalAlign'
							) {
								if (e == 'verticalAlign') {
									subBlock.divStyles[e] = f;
								}
							}
						});
					}
				});
			}
			newSectionsArray.push(section);
		});
		this.setState(
			{
				sections: newSectionsArray,
			},
			() => {
				this.handleSaveSections();
			},
		);
	};
	handleFonts = (e, f) => {
		let arr = ['justifyleft', 'justifyright', 'justifycenter', 'justifyfull'];
		this.setState(
			{
				actionType: e,
				actionValue: f,
				triggerFont: true,
			},
			() => {
				if (e === 'fontName') {
					this.setState({
						fontFamily: f,
					});
				} else if (e === 'foreColor') {
					this.setState({
						fontColor: f,
					});
				} else if (e === 'fontSize') {
					this.setState({
						fontSize: parseInt(f),
					});
				} else if (e === 'fontWeight') {
					this.setState({
						fontWeight: parseInt(f),
					});
				} else if (e === 'fontStyle') {
					this.setState({
						fontStyle: f,
					});
				} else if (e === 'lineHeight') {
					this.setState({
						lineHeight: f,
					});
				} else if (e === 'letterSpacing') {
					this.setState({
						letterSpacing: f,
					});
				} else {
					this.setState({ [e]: true }, () => {
						_.forEach(arr, (type, k) => {
							if (e !== type) {
								this.setState({
									[type]: false,
								});
							}
						});
					});
				}
			},
		);
	};
	handleFontStyles = (e, activeTextBlock) => {
		this.setState({
			activeTextBlock,
		});
		if (e[0] !== '-apple-system') {
			this.setState({
				fontFamily: e[0] ? e[0] : this.state.fontFamily,
				fontSize: e[1] ? e[1] : this.state.fontSize,
				fontColor: e[2] ? e[2] : this.state.fontColor,

				activeSubBlockType: 'f',
			});
		} else {
			this.setState({
				fontFamily: 'Arial',
				fontSize: e[1],
				fontColor: e[2],
				activeSubBlockType: 'f',
			});
		}
		if (e[3] === 'right') {
			this.setState({
				justifyleft: false,
				justifycenter: false,
				justifyright: true,
				justifyfull: false,
			});
		} else if (e[3] === 'center') {
			this.setState({
				justifyleft: false,
				justifycenter: true,
				justifyright: false,
				justifyfull: false,
			});
		} else if (e[3] === 'justify') {
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
	deleteSection = (e) => {
		let sections = [...this.state.sections];
		sections = this.removeSectionById(sections, e);
		this.setState({ sections, isAutoSaving: true });
		if (this.state.isWorkflow) {
			this.deleteWorkflowSectionItem(e);
		} else {
			this.deleteSectionItem(e);
		}
	};
	removeSectionById = (sections, idToRemove) => {
		return sections.filter((section) => section._id !== idToRemove);
	};
	saveSubBlockContent = (content, sectionID, blockID, id, mContent = false, sectionId = null) => {
		// if (this.timeout1) clearTimeout(this.timeout1);
		// this.timeout1 = setTimeout(async () => {
		this.setState({
			activeVariableID: null,
			activeVariableName: null,
		});
		if (sectionId !== null) {
			this.setState({
				activeSectionID: sectionId,
			});
		}
		let headerID = this.state.headerSectionId === this.state.activeSectionID;

		let sections =
			this.state.module === 'form' && this.state.isHeader && headerID
				? [this.state.headerSection]
				: [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let activeBlockID = this.state.activeBlockID;
		let activeSubBlockID = this.state.activeSubBlockID;
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === sectionID) {
				if (blockID == null) {
					section.style.heading.content = content;
				} else {
					_.forEach(section.blocks, (block, k) => {
						if (block._id == blockID) {
							_.forEach(block.subBlocks, (subBlock, k) => {
								if (subBlock._id == id) {
									subBlock.mContent = content;
									subBlock.content = content;
								}
							});
						}
					});
				}
			}
			arr.push(section);
		});

		this.setState(
			this.state.module === 'form' && this.state.isHeader && headerID
				? {
						headerSection: arr[0],
						activeSubBlockType: 'f',
						isAutoSaving: true,
				  }
				: {
						sections: arr,
						activeSubBlockType: 'f',
						isAutoSaving: true,
				  },
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader && headerID,
					'saveSubBlockContent',
				);
			},
		);
		// }, 500);
	};
	saveBlockContent = (content, sectionID, blockID) => {
		let headerID = this.state.headerSectionId === this.state.activeSectionID;

		let sections =
			this.state.module === 'form' && this.state.isHeader && headerID
				? [this.state.headerSection]
				: [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let activeBlockID = this.state.activeBlockID;
		let activeSubBlockID = this.state.activeSubBlockID;
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === sectionID) {
				_.forEach(section.blocks, (block, k) => {
					if (block._id == blockID) {
						block.question = content;
					}
				});
			}
			arr.push(section);
		});

		this.setState(
			{
				sections: arr,
				isAutoSaving: true,
				activeSubBlockType: this.state.module === 'form' ? 'f' : 'b',
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader && headerID,
					'saveBlockContent',
				);
			},
		);
	};
	activeImage = (sectionID, blockID, subBlockID, imageURL, dimensions, ImgSubBlock) => {
		this.setState({
			activeSectionID: sectionID,
			activeBlockID: blockID,
			activeSubBlockID: subBlockID,
			activeImageURL: imageURL,
			activeSubBlockType: 'i',
			acticImageSubBlock: ImgSubBlock,
		});
		if (dimensions !== null) {
			this.setState({
				activeImageWidth: dimensions.width,
				activeImageHeight: dimensions.height,
				activeImageSubBlock: ImgSubBlock,
			});
		}
	};
	handleSetImageSettings = (crop, zoom, isTrigger = false) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let activeBlockID = this.state.activeBlockID;
		let activeSubBlockID = this.state.activeSubBlockID;
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === activeSectionID) {
				_.forEach(section.blocks, (block, k) => {
					if (block._id == activeBlockID) {
						_.forEach(block.subBlocks, (subBlock, k) => {
							if (subBlock._id == activeSubBlockID) {
								let image_settings = {
									crop: { x: 0, y: 0 },
									zoom: 1,
									aspect: 3 / 2,
								};
								if (isTrigger) {
									if (_.has(subBlock, 'mImageObjectFit')) {
										_.unset(subBlock, 'mImageObjectFit');
									}
									if (_.has(subBlock, 'mobileImageObjectFit')) {
										_.unset(subBlock, 'mobileImageObjectFit');
									}
								}
								if (_.has(subBlock.image_settings, 'imageWidth')) {
									image_settings['imageWidth'] =
										subBlock.image_settings.imageWidth;
								}
								if (this.state.activeImageHeight !== null) {
									image_settings['height'] = this.state.activeImageHeight;
								}
								if (this.state.activeImageWidth !== null) {
									image_settings['width'] = this.state.activeImageWidth;
								}
								image_settings['crop'] = crop;
								image_settings['zoom'] = zoom;
								subBlock.image_settings = image_settings;
							}
						});
					}
				});
			}
			arr.push(section);
		});

		this.setState(
			this.state.module === 'form' && this.state.isHeader
				? {
						headerSection: arr[0],
						imgSettingData: {
							...this.state.imgSettingData,
							crop: crop,
							zoom: zoom,
						},
						isAutoSaving: true,
				  }
				: {
						sections: arr,
						imgSettingData: {
							...this.state.imgSettingData,
							crop: crop,
							zoom: zoom,
						},
						isAutoSaving: true,
				  },
			async () => {
				// !previous logic
				// setTimeout(
				// 	function () {
				// 		this.handleSaveSections(
				// 			true,
				// 			this.state.module === 'form' && this.state.isHeader,
				// 			'handleSetImageSettings',
				// 		);
				// 		// setTimeout(()=>{
				// 		// 	localStorage.removeItem(`${this.state.activeImageURL}::zoom`);
				// 		// 	console.log('deleted zoom',localStorage.getItem(`${this.state.activeImageURL}::zoom`))
				// 		// },1000)
				// 	}.bind(this),
				// 	1000,
				// );

				// !new logic
				this.debounceFuncForImage(async () => {
					await this.handleSaveSections(
						true,
						this.state.module === 'form' && this.state.isHeader,
						'handleSetImageSettings',
					);
				}, 1200);
			},
		);
	};
	debounceFuncForImage = (func, timeout = 800) => {
		if (this.state.debounceStateForImage) {
			clearTimeout(this.state.debounceStateForImage);
		}
		const timeFunction = setTimeout(() => {
			func();
		}, timeout);
		this.setState({
			debounceStateForImage: timeFunction,
		});
	};
	handleRemoveImage = () => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let activeBlockID = this.state.activeBlockID;
		let activeSubBlockID = this.state.activeSubBlockID;
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === activeSectionID) {
				_.forEach(section.blocks, (block, k) => {
					if (block._id == activeBlockID) {
						_.forEach(block.subBlocks, (subBlock, k) => {
							if (subBlock._id == activeSubBlockID) {
								delete subBlock.imageURL;
							}
						});
					}
				});
			}
			arr.push(section);
		});
		if (this.state.module === 'form') {
			if (this.state.isHeader) {
				this.setState(
					{
						headerSection: arr[0],
						activeImageURL: null,
						isAutoSaving: true,
					},
					async () => {
						await this.handleSaveSections(
							null,
							this.state.module === 'form' && this.state.isHeader,
							'handleRemoveImage',
						);
					},
				);
			}
		} else {
			this.setState(
				{
					sections: arr,
					activeImageURL: null,
					isAutoSaving: true,
				},
				async () => {
					await this.handleSaveSections(
						null,
						this.state.module === 'form' && this.state.isHeader,
						'handleRemoveImage',
					);
				},
			);
		}
	};

	handleSetImage = (e, p) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let activeBlockID = this.state.activeBlockID;
		let activeSubBlockID = this.state.activeSubBlockID;
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === activeSectionID) {
				if (section?.type == 'navbar') {
					section.blocks[0].subBlocks[0].imageURL = e;
				} else {
					_.forEach(section.blocks, (block, k) => {
						if (block._id == activeBlockID) {
							_.forEach(block.subBlocks, (subBlock, k) => {
								if (subBlock._id == activeSubBlockID) {
									subBlock.imageURL = e;
									let image_settings = {
										crop: { x: 0, y: 0 },
										zoom: 1,
										aspect: 3 / 2,
										//imageWidth: { width: 100, height: 100 },
									};
									if (this.state.isLogo) {
										image_settings.imageWidth = {
											width: 100,
											height: 100,
										};
									}
									if (p == null) {
										subBlock.image_settings = image_settings;
									}
								}
							});
						}
					});
				}
			}
			arr.push(section);
		});

		this.setState(
			this.state.module === 'form' && this.state.isHeader
				? {
						headerSection: arr[0],
						activeImageURL: e,
						isAutoSaving: true,
						activeSection: _.filter(arr, { _id: activeSectionID })[0],
						base64: null,
						uploadAIImage: null,
				  }
				: {
						sections: arr,
						activeImageURL: e,
						isAutoSaving: true,
						activeSection: _.filter(arr, { _id: activeSectionID })[0],
						base64: null,
						uploadAIImage: null,
				  },
			async () => {
				this.handleSaveSections(
					null,
					this.state.module === 'form' && this.state.isHeader,
					'handleSetImage',
				);
			},
		);
	};
	setServiceTableSection = (e, value) => {
		let sections = [...this.state.sections];
		let activeSectionID = this.state.activeSectionID;
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === activeSectionID) {
				section.style[e] = value;
			}
			arr.push(section);
		});

		this.setState(
			{
				[e]: value,
				sections,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'setServiceTableSection',
				);
			},
		);
	};

	handleSave = (e) => {
		this.setState(
			{
				isSaveLoading: true,
				preview: true,
				previewType: 'm',
				isGeneratePreview: true,
				//isAutoSaving: true,
			},
			async () => {
				const html = document.getElementById('builder').outerHTML;
				let css = '';
				let styles = {};

				for (let i = 0; i < document.styleSheets.length; i++) {
					const styleSheet = document.styleSheets[i];
					try {
						for (let j = 0; j < styleSheet.cssRules.length; j++) {
							let cssText = styleSheet.cssRules[j].cssText;
							if (!cssText.includes('.jodit') && !cssText.includes('.ace')) {
								css += cssText + '\n';
							}
						}
					} catch (e) {
						console.warn("Can't read the CSS rules of: ", styleSheet.href);
					}
				}

				const fullHtml = `
      <html>
        <head>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
			rel="stylesheet"
		/>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

				let data = this.setVariables();

				if (this.props.params?.type && this.props.params.type === 'customize') {
					await this.duplicateTemplate(
						{
							title: this.state.title,
						},
						{
							sections: data[1],
							variables: data[0],
							parsedHtmlContent: fullHtml,
						},
					);
				} else {
					this.setState({
						sectionVariables: data[0],
					});

					await this.putSections({
						sections: data[1],
						variables: data[0],
						parsedHtmlContent: fullHtml,
						tables: this.state.sectionTables,
					});
				}
			},
		);
	};
	updateTablesToSave = async (tables) => {
		let sections = [...this.state.sections];
		// let tableArr = [];
		let updatedTables = new Set();

		_.forEach(sections, (section) => {
			if (section.type === 'services') {
				_.forEach(section.blocks, (block) => {
					_.forEach(tables, (table) => {
						if (table?.type === 'services' && table?._id === section?._id) {
							table.styles = section?.style;
							table.values = table?.values.map((value) => {
								if (value?.blockId === block?._id) {
									return {
										...value,
										title: block?.subBlocks[0]?.title || '',
										description: block?.subBlocks[0]?.description || '',
										imageURL: block?.subBlocks[0]?.imageURL || '',
										unit: block?.subBlocks[0]?.unit || '',
									};
								}
								return value;
							});
						}
						// tableArr.push(table);
						updatedTables.add(table);
					});
				});
				// tableArr.push(...tables.filter(table => table?.type === 'services' && table?._id === section?._id));
			}
		});
		let tableArr = Array.from(updatedTables);
		this.updateSummaryTables(tableArr);

		return tableArr;
	};
	updateSummaryTables = async (tables) => {
		let globalTables = [...this.state?.globalTables];
		let updatedTables = new Set();
		_.forEach(globalTables, (table) => {
			_.forEach(tables, (innerTable) => {
				if (table?._id == innerTable?._id && table?.type == innerTable?.type) {
					table = { ...innerTable };
				}
			});
			updatedTables.add(table);
		});
		let tableArr = Array.from(updatedTables);
		// if(tableArr != globalTables && tableArr ){
		this.setState({
			globalTables: tableArr,
		});
		// }
		return tableArr;
	};
	handleSaveSections = (e = null, isFormHeader = null, func = null) => {
		this.setState(
			{
				isAutoSaving: true,
			},
			async () => {
				let data = this.setVariables();

				let currentVariables = [...(data?.[0] || [])];
				let sectionVariables = [...(this.state.sectionVariables || [])];
				let sectionVariablesMapper = {};

				//for single client edit this is mandatory, we need to replace static variables with  variable coming from api
				// if (this.state?.isWorkflow) {
				// 	for (let i = 0; i < sectionVariables?.length; i++) {
				// 		sectionVariablesMapper[sectionVariables[i]?._id] = sectionVariables[i];
				// 	}

				// 	for (let i = 0; i < currentVariables?.length; i++) {
				// 		if (sectionVariablesMapper[currentVariables?.[i]?._id]) {
				// 			currentVariables[i] =
				// 				sectionVariablesMapper[currentVariables?.[i]?._id];
				// 		}
				// 	}
				// }

				let variables =
					this.state.module === 'contract' ? sectionVariables : currentVariables;

				this.setState(
					{
						sectionVariables: variables,
					},
					async () => {
						let json = {
							variables: variables,
							//parsedHtmlContent: fullHtml,
							tables: this.state.sectionTables,
						};
						let filterTables = [];

						if (isFormHeader == true) {
							json = {
								...json,
								header: this.state.headerSection,
								isHeader: this.state.isHeader,
								backgroundColor: this.state.formBgColor,
								isTheme: this.state?.isTheme,
								theme: this.state?.activeTheme,
								sections: data[1],
							};
						} else if (this.state.module === 'summary') {
							json = {
								...json,
								summary: {
									summaryBg: this.state?.summaryBg,
									summaryFont: this.state?.summaryFont,
									summaryFontSize: this.state?.summaryFontSize,
									summaryFontColor: this.state?.summaryFontColor,
								},
								sections: this.state.sections,
							};
						} else if (this.state.module === 'invoice') {
							json = {
								...json,

								paymentSchedule: this.state.paymentSchedule,
								sections: data[1],
							};
						} else {
							json = { ...json, sections: data[1] };
						}

						_.forEach(json.sections, (section) => {
							let table = _.find(this.state.sectionTables, {
								_id: section._id,
							});
							if (table) {
								filterTables.push(table);
							}
						});

						const withoutServicesTables = filterTables.filter(
							(section) => section.type !== 'services',
						);

						let servicesTables = filterTables.filter(
							(section) => section.type === 'services',
						);

						servicesTables = await this.updateTablesToSave(servicesTables);
						json.tables = [...withoutServicesTables, ...servicesTables];

						if (this.state.isWorkflow) {
							await this.putWorkflowSections(json, null, e);
						} else {
							let activeSection = _.filter(this.state.sections, {
								_id: this.state.activeSectionID,
							})[0];

							// if sections length is 0 then api is getting failed
							if (
								(!this.state.preview || activeSection?.isFluidSection) &&
								_.size(json?.sections) > 0
							) {
								await this.putSections(
									json,
									null,
									e,
									null,
									this.state.module === 'summary' ? true : null,
								);
							}
						}
					},
				);
			},
		);
	};
	removeTags(str) {
		if (str === null || str === '') return false;
		else {
			str = str?.toString();
			str = str?.replace(/(<([^>]+)>)/gi, '');
			return str;
		}
	}
	//jeevan for variables smart field
	handleFieldDataUpdate = (newFieldData) => {
		this.setState({ fieldData: newFieldData });
	};
	setVariables = () => {
		let sections = [...this.state.sections];

		let variables = [];

		let arr = [];
		let grandTotal = 0;

		_.forEach(sections, async (section, key) => {
			if (section.type == 'services') {
				let customVariables = [
					...(this.state?.variables?.module || []),
					...(this.state?.variables?.workspace || []),
					...(this.state?.variables?.custom || []),
				];

				let serviceVariableId = _.filter(customVariables, {
					blockId: section._id,
				})[0];

				if (serviceVariableId) {
					let tempDisplayName = this.removeTags(section.style.subTotalTitle);
					tempDisplayName =
						tempDisplayName == false || serviceVariableId.displayName == false
							? serviceVariableId?.code
							: tempDisplayName;

					variables.push({
						...serviceVariableId,
						displayName: tempDisplayName,
						value: parseInt(this.removeTags(section.style.subTotalValue)),
					});

					if (
						this.removeTags(section.style.subTotalTitle) !==
						serviceVariableId.displayName
					) {
						serviceVariableId.displayName = tempDisplayName;
						serviceVariableId.defaultValue = this.removeTags(
							section.style.subTotalValue,
						);
						await this.updateVariables(
							_.omit(serviceVariableId, [
								'_id',
								'type',
								'updatedBy',
								'blockId',
								'templateId',
								'tenantId',
								'createdAt',
								'updatedAt',
								'createdBy',
								'workspaceId',
								'code',
							]),
							null,
							serviceVariableId._id,
						);
					}
				}

				grandTotal += parseInt(
					this.removeTags(section.style.subTotalValue) == false
						? 0
						: this.removeTags(section.style.subTotalValue),
				);
			}

			_.forEach(section?.blocks, (block, k) => {
				_.forEach(block?.subBlocks, (subBlock, index) => {
					let variableIds;
					if (section?.type !== 'services') {
						variableIds = this.extractDataIds(subBlock.content);
					} else {
						let titleVariableIds = this.extractDataIds(subBlock.title);
						let descriptionVariableIds = this.extractDataIds(subBlock.description);
						variableIds = [...titleVariableIds, ...descriptionVariableIds];
					}

					if (_.size(variableIds) > 0) {
						_.forEach(variableIds, (varb, l) => {
							let varDetails = _.filter(
								[
									...(this.state?.variables?.module || []),
									...(this.state?.variables?.workspace || []),
									...(this.state?.variables?.custom || []),
								],
								{
									_id: varb,
								},
							)[0];

							if (_.has(varDetails, 'clientAction')) {
								variables?.push({
									...varDetails,
									value: this.state.isWorkflow
										? _.filter(this.state.sectionVariables, { _id: varb })[0]
												?.value
										: varDetails?.defaultValue,
								});
							} else {
								variables.push({
									clientAction: 0,
									placeholderText: varDetails?.type,
									code: varDetails?.code,
									type: varDetails?.type,
									value: this.state.isWorkflow
										? _.filter(this.state.sectionVariables, { _id: varb })[0]
												?.value
										: varDetails?.defaultValue,
									_id: varb,
									defaultValue: varDetails?.defaultValue,

									displayName: varDetails?.displayName,
									...(_.has(varDetails, 'blockId') && {
										blockId: varDetails?.blockId,
									}),
								});
							}
						});
						let variable_ids = _.uniq(variableIds);

						subBlock.variable_ids = variable_ids;
					}
				});
			});
			arr.push(sections);
		});

		const toWords = new ToWords({
			localeCode: 'en-IN',
			converterOptions: {
				currency: true,
				ignoreDecimal: false,
				ignoreZeroCurrency: false,
				doNotAddOnly: false,
			},
		});
		if (
			_.size(_.filter(sections, { type: 'services' })) > 0 &&
			_.size(_.filter(this.state?.variables?.custom || [], { displayName: 'Grand Total' })) >
				0
		) {
			let grandTotalInWords = 'Zero';
			if (grandTotal) {
				grandTotalInWords = toWords.convert(grandTotal);
			}
			let kVariables = this.state?.variables?.custom;
			let grandTotalVariable = _.filter(kVariables, { displayName: 'Grand Total' })[0];
			let value =
				typeof grandTotalVariable?.defaultValue === 'string'
					? grandTotalVariable?.defaultValue
					: grandTotalVariable?.defaultValue.toString();
			if (value !== grandTotal.toString()) {
				grandTotalVariable.defaultValue = grandTotal.toString();

				this.updateVariables(
					_.omit(grandTotalVariable, [
						'_id',
						'type',
						'updatedBy',
						'blockId',
						'templateId',
						'tenantId',
						'createdAt',
						'updatedAt',
						'createdBy',
						'workspaceId',
						'code',
					]),
					null,
					grandTotalVariable._id,
				);
			}

			let grandTotalInWordsVariable = _.filter(kVariables, {
				displayName: 'Grand Total In Words',
			})[0];
			let val = grandTotalInWordsVariable?.defaultValue;
			if (val !== grandTotalInWords) {
				grandTotalInWordsVariable.defaultValue = grandTotalInWords;

				this.updateVariables(
					_.omit(grandTotalInWordsVariable, [
						'_id',
						'type',
						'updatedBy',
						'blockId',
						'templateId',
						'tenantId',
						'createdAt',
						'updatedAt',
						'createdBy',
						'workspaceId',
						'code',
					]),
					null,
					grandTotalInWordsVariable._id,
				);
			}
		}
		if (_.size(_.filter(sections, { type: 'services' })) > 0) {
			let grandTotalInWords = 'Zero';
			if (grandTotal) {
				grandTotalInWords = toWords.convert(grandTotal);
			}

			// Add safety check for variables
			let kVariables =
				[
					...(this.state?.variables?.module || []),
					...(this.state?.variables?.workspace || []),
					...(this.state?.variables?.custom || []),
				] || [];

			// Add safety check for Grand Total variable
			let grandTotalVariable = _.filter(kVariables, { displayName: 'Grand Total' })[0];
			if (grandTotalVariable) {
				// Add this check
				let value = grandTotalVariable?.defaultValue?.toString() || '0';
				if (value !== grandTotal.toString()) {
					// Create new object instead of direct modification
					grandTotalVariable = {
						...grandTotalVariable,
						defaultValue: grandTotal.toString(),
					};

					this.updateVariables(
						_.omit(grandTotalVariable, [
							'_id',
							'type',
							'updatedBy',
							'blockId',
							'templateId',
							'tenantId',
							'createdAt',
							'updatedAt',
							'createdBy',
							'workspaceId',
							'code',
						]),
						null,
						grandTotalVariable._id,
					);
				}
			}

			// Add safety check for Grand Total In Words variable
			let grandTotalInWordsVariable = _.filter(kVariables, {
				displayName: 'Grand Total In Words',
			})[0];
			if (grandTotalInWordsVariable) {
				// Add this check
				let val = grandTotalInWordsVariable?.defaultValue || '';
				if (val !== grandTotalInWords) {
					// Create new object instead of direct modification
					grandTotalInWordsVariable = {
						...grandTotalInWordsVariable,
						defaultValue: grandTotalInWords,
					};

					this.updateVariables(
						_.omit(grandTotalInWordsVariable, [
							'_id',
							'type',
							'updatedBy',
							'blockId',
							'templateId',
							'tenantId',
							'createdAt',
							'updatedAt',
							'createdBy',
							'workspaceId',
							'code',
						]),
						null,
						grandTotalInWordsVariable._id,
					);
				}
			}
		}
		let finalVariables = this.removeDuplicatesFromArray(variables, '_id');
		let invoiceVariables = variables.filter(
			(varObj) => varObj.code === 'client-name' || varObj.code === 'client-email-id',
		);
		this.setState({
			invoiceClientVariables: invoiceVariables,
		});
		return [_.uniq(finalVariables), sections];
	};
	removeDuplicatesFromArray = (arr, key) => {
		const mapper = {};
		for (let i = 0; i < arr.length; i++) {
			mapper[arr?.[i]?.[key]] = arr[i];
		}

		return Object.values(mapper);
	};
	extractDataIds(content) {
		const regex = /data-id="(.*?)"/g;
		let matches;
		const dataIds = [];

		// Extract all matches
		while ((matches = regex.exec(content)) !== null) {
			dataIds.push(matches[1]);
		}

		return dataIds;
	}

	handleAddVariable = (id, value) => {
		this.setState({
			activeVariableID: id,
			activeVariableName: value,
		});
		let sections = [...this.state.sections];
		let arr = [];

		_.forEach(sections, (section, key) => {
			if (section._id === this.state.activeSectionID) {
				_.forEach(section.blocks, (block, k) => {
					if (block._id == this.state.activeBlockID) {
						_.forEach(block.subBlocks, (subBlock, k) => {
							if (subBlock._id == this.state.activeSubBlockID) {
								let variable_ids;
								if (subBlock.variable_ids) {
									variable_ids = subBlock.variable_ids;
								} else {
									variable_ids = [];
								}
								if (_.size(variable_ids) > 0) {
									if (!subBlock.variable_ids.includes(id)) {
										variable_ids.push(id);
									}
								} else {
									variable_ids.push(id);
								}

								subBlock.variable_ids = variable_ids;
							}
						});
					}
				});
			}
			arr.push(section);
		});

		this.setState(
			{
				sections: arr,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					null,
					this.state.module === 'form' && this.state.isHeader,
					'handleAddVariable',
				);
			},
		);
	};

	changeToSingleSelect = (values, block, forTables = true) => {
		if (forTables) {
			values.forEach((value) => {
				if (value.blockId !== block) {
					value.isSelected = false;
				}
			});
		} else {
			let blocks = values;
			blocks?.forEach((singleBlock) => {
				if (singleBlock._id !== block) {
					singleBlock.subBlocks[0].isSelected = false;
				}
			});
		}
	};

	handleServiceSelect = (block, type, val, section) => {
		let tables = [...this.state.sectionTables];
		let arr = [];
		let sectionsArr = [];
		_.forEach(tables, (table, key) => {
			if (table._id == section) {
				_.forEach(table.values, (value, k) => {
					if (value.blockId == block) {
						if (type === 'isSelected') {
							value.isSelected = !value.isSelected;
							let selectedType = table?.styles?.services_selection;

							if (selectedType == 0) {
								this.changeToSingleSelect(table.values, block);
							}
						} else {
							value.quantity =
								val === 'decrease'
									? value.quantity == 1
										? 1
										: value.quantity - 1
									: value.quantity + 1;
						}
					}
				});
			}
			arr.push(table);
		});

		if (this.state.isWorkflow) {
			_.forEach(this.state.sections, (table, key) => {
				if (table._id == section) {
					_.forEach(table.blocks, (value, k) => {
						if (value._id == block) {
							_.forEach(value.subBlocks, (subBlock, k) => {
								if (k == 0) {
									if (type === 'isSelected') {
										subBlock.isSelected = !subBlock.isSelected;
										if (table?.style?.services_selection === 0) {
											this.changeToSingleSelect(table.blocks, block, false);
										}
									} else {
										subBlock.quantity =
											val === 'decrease'
												? subBlock.quantity == 1
													? 1
													: subBlock.quantity - 1
												: subBlock.quantity + 1;
									}
								}
							});
						}
					});
				}
				sectionsArr.push(table);
			});
		}

		this.setState(
			{
				sectionTables: arr,
				isAutoSaving: true,
			},
			async () => {
				if (this.state.isWorkflow) {
					this.setState({ sections: sectionsArr });
				}
				await this.handleSaveSections(
					null,
					this.state.module === 'form' && this.state.isHeader,
					'handleServiceSelect',
				);
			},
		);
	};
	returnActiveFormBlock = () => {
		if (this.state.activeFormQuestion !== null) {
			let block = {};
			if (this.props.module === 'form') {
				block = _.filter(this.state.sections[0].blocks, {
					_id: this.state.activeFormQuestion,
				})[0];
			} else {
				block = _.filter(
					_.filter(this.state.sections, { _id: this.state.activeSectionID })[0]?.blocks,
					{ _id: this.state.activeFormQuestion },
				)[0];
			}
			if (block) {
				return block;
			} else {
				return null;
			}
		} else {
			return null;
		}
	};
	handleSaveblocks = (e, sectionID, layoutHeight) => {
		// Convert layout height from px to vh
		// if (layoutHeight) {
		// 	const viewportHeight = window.innerHeight;
		// 	layoutHeight = (layoutHeight / viewportHeight) * 100 + 'vh';
		// }
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (section._id === sectionID) {
				section.blocks = e;
				//section.style.layoutHeight = layoutHeight;
				section.style = { ...section.style, minHeight: '30px' };
			}
			arr.push(section);
		});

		this.setState(
			{
				sections: arr,
			},
			() => {
				this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleSaveblocks',
				);
			},
		);
	};

	handleSaveSingleBlock = (e, sectionId) => {
		let sections = [...this.state.sections];
		let arr = [];
		let currentSection = null;
		_.map(sections, (section, key) => {
			if (section._id === sectionId) {
				section.blocks = e;
				section.style = { ...section.style, minHeight: '30px' };
				currentSection = section;
			}
			arr.push(section);
		});
		if (this.state.isWorkflow) {
			this.putSingleWorkflowBlockSection(currentSection, sectionId);
		} else {
			this.putSingleBlockSection(currentSection, sectionId);
		}
	};

	handleScheduleStyles = (data) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (section._id === this.state.activeSectionID) {
				section.style = data?.style;
			}
			arr.push(section);
		});
		this.setState({ sections: arr }, () => {
			this.handleSaveSections(null, true, null);
		});
	};

	handleSetOptionsForFormQuestion = (e, type) => {
		if (
			this.state.activeSectionID == this.state.sections[0]._id ||
			this.state?.activeBlock?.type === 'form-q&a'
		) {
			let headerID = false;
			if (this.state.headerSectionId === this.state.activeSectionID) {
				headerID = true;
			}

			let sections =
				// this.state.module === 'form' && this.state.isHeader && headerID == true
				// 	? [this.state.headerSection]
				// 	:
				[...this.state.sections];
			let arr = [];
			_.map(sections, (section, key) => {
				if (this.state.module === 'form') {
					if (key == 0) {
						let blockArr = [];
						_.map(section.blocks, (block, k) => {
							if (block._id == this.state.activeFormQuestion) {
								if (type === 'isMultiple') {
									block.answerOptions[type] = e;
								} else {
									block[type] = e;
								}
							}
							blockArr.push(block);
						});
						section.blocks = blockArr;
					}
				} else {
					if (section._id == this.state.activeSectionID) {
						let blockArr = [];
						_.map(section.blocks, (block, k) => {
							if (block._id == this.state.activeFormQuestion) {
								if (type === 'isMultiple') {
									block.answerOptions[type] = e;
								} else {
									block[type] = e;
								}
							}
							blockArr.push(block);
						});
						section.blocks = blockArr;
					}
				}
				arr.push(section);
			});
			this.setState(
				{
					sections,
					isAutoSaving: true,
				},
				async () => {
					await this.handleSaveSections(
						null,
						this.state.module === 'form' && this.state.isHeader && headerID,
						'handleSetOptionsForFormQuestion',
					);
				},
			);
		}
	};
	setFormOptionForMultipleChoice = (e) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (key == 0 || section._id == this.state.activeSectionID) {
				let blockArr = [];
				_.map(section.blocks, (block, k) => {
					if (block._id == this.state.activeFormQuestion) {
						let optionsArr = block.answerOptions
							? block.answerOptions.options
								? block.answerOptions.options
								: []
							: [];
						optionsArr.push(e);
						let blockAnswerOptions = block.answerOptions ? block.answerOptions : {};
						block.answerOptions = {
							...blockAnswerOptions,
							options: optionsArr,
						};
					}
					blockArr.push(block);
				});
				section.blocks = blockArr;
			}
			arr.push(section);
		});
		this.setState(
			{
				sections,
			},
			() => {
				this.handleSaveSections(null, true, null);
			},
		);
	};

	// getProposalInfo = async (workflowId, proposalInfoId) => {}

	getModule = async (id, type, onUpdate = false) => {
		if (this.state.module !== type) {
			this.setState({
				showSideBar: true,
			});
		}
		if (type === 'summary') {
			if (type === 'summary') {
				await this.getModuleTemplate(moduleQuery, {
					getModuleTemplateId: _.filter(this.state.modules, { module: 'proposal' })[0]
						._id,
					module: 'proposal',
				});
			}
			this.setState({
				activeModuleId: id,
				summaryModuleId: _.filter(this.state.modules, { module: 'proposal' })[0]._id,
				module: type,
				// sections: [],
			});
			// if (type === 'presentation') {
			// 	this.setState({
			// 		activeModuleId: _.filter(this.state.modules, { module: 'proposal' })[0]._id,
			// 	});
			// }
			setTimeout(() => {
				this.handleSaveSections();
			}, 1000);
		} else {
			if (onUpdate) {
				this.fetchGetModule(id, type);
			} else {
				if (
					(this.state?.getModuleParams?.id && this.state?.getModuleParams?.type) ||
					this.state?.alreadyCheckedMobileView ||
					!this.state?.didChangedSomething
				) {
					this.fetchGetModule(id, type);
				} else {
					this.setState({
						previewMode: 'm',
						previewType: 'm',
						showCheckMobilePopup: true,
						showSideBar: false,
						getModuleParams: {
							id,
							type,
						},
					});
				}
			}
		}
	};
	getRandomText(array) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}
	handleSetActiveSection = (e, executeSave = null, debounce = false) => {
		if (_.has(e, 'sectionType') && e.sectionType === 'loader') {
		} else {
			let headerID = this.state.activeSectionID === this.state.headerSectionId;
			let sections =
				this.state.module === 'form' && this.state.isHeader && headerID
					? [this.state.headerSection]
					: [...this.state.sections];

			let sectionsArr = [];

			_.map(sections, (section, k) => {
				if (section._id == e._id) {
					section = e;
				}
				sectionsArr.push(section);
			});

			this.setState(
				this.state.module === 'form' && this.state.isHeader && headerID
					? {
							headerSection: sectionsArr[0],
							activeBlock: e,
							isAutoSaving: true,
					  }
					: {
							sections: sectionsArr,
							activeBlock: e,
							isAutoSaving: true,
					  },
				async () => {
					if (debounce) {
						this.debounceFuncForElementProps(async () => {
							await this.handleSaveSections(
								executeSave,
								this.state.isHeader && headerID,
								'handleSetActiveSection',
							);
						}, 500);
					} else {
						await this.handleSaveSections(
							executeSave,
							this.state.isHeader && headerID,
							'handleSetActiveSection',
						);
					}
				},
			);
		}
		//}, 500);
	};
	handleActiveShape = (e, sid) => {
		let headerID = this.state.activeSectionID === this.state.headerSectionId;
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === sid) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock, index) => {
						if (subBlock._id == this.state.activeSubBlockID) {
							subBlock.shape = e;
						}
					});
				});
			}
			sectionsarr.push(section);
		});
		this.setState(
			this.state.module === 'form' && this.state.isHeader && headerID
				? {
						headerSection: sectionsarr[0],
						activeBlock: e,
						isAutoSaving: true,
				  }
				: {
						sections: sectionsarr,
						activeBlock: e,
						isAutoSaving: true,
				  },
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleActiveShape',
				);
			},
		);
	};
	handleButtonStyles = (e) => {
		let sections = [...this.state.sections];
		let sectionsarr = [];
		_.map(sections, (section, key) => {
			_.map(section.blocks, (block, k) => {
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock._id == this.state.activeSubBlockID) {
						subBlock.btStyles = e;
					}
				});
			});
			sectionsarr.push(section);
		});
		this.setState(
			{
				sections: sectionsarr,
				setBtStyles: e,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleButtonStyles',
				);
			},
		);
	};
	handleButtonShape = (e) => {
		let sections = [...this.state.sections];
		let sectionsarr = [];
		_.map(sections, (section, key) => {
			_.map(section.blocks, (block, k) => {
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock._id == this.state.activeSubBlockID) {
						subBlock.shape = e;
					}
				});
			});
			sectionsarr.push(section);
		});
		this.setState(
			{
				sections: sectionsarr,
				btShape: e,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleButtonShape',
				);
			},
		);
	};
	handleButtonLink = (e) => {
		let sections = [...this.state.sections];
		let sectionsarr = [];
		_.map(sections, (section, key) => {
			_.map(section.blocks, (block, k) => {
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock._id == this.state.activeSubBlockID) {
						subBlock.href = e;
					}
				});
			});
			sectionsarr.push(section);
		});
		this.setState(
			{
				sections: sectionsarr,
				buttonLink: e,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleButtonLink',
				);
			},
		);
	};
	handleOpenNewTab = (e) => {
		let sections = [...this.state.sections];
		let sectionsarr = [];
		_.map(sections, (section, key) => {
			_.map(section.blocks, (block, k) => {
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock._id == this.state.activeSubBlockID) {
						subBlock.openInNewTab = e;
					}
				});
			});
			sectionsarr.push(section);
		});
		this.setState(
			{
				sections: sectionsarr,
				openInNewTab: e,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleOpenNewTab',
				);
			},
		);
	};
	emptyOrder = (e) => {
		let json = {
			type: 'text',
			sectionType: 'loader',
			style: {
				blocksClassName: 'h-274-imp w-100p d-flex',
				padding: 0,
				// sectionBackgroundColor: '#282829',
				mblocksClassName: '',
			},
			blocks: [
				{
					className: 'w-100p h-100p',
					subBlocks: [
						{
							type: 'loader',
						},
					],
				},
			],
			order: e,
		};
		let sessions = [...this.state.sections, json];
		this.setState({
			sections: sessions,
		});
	};
	handleDuplicate = (sectionId) => {
		let json = { ...this.state.activeBlock };
		delete json._id;
		json.order = json.order - 0.1;
		if (this.state.isWorkflow) {
			this.duplicateWorkflowBlock(json, sectionId);
		} else {
			this.duplicateBlock(json, sectionId);
		}
	};

	handleDuplicateServiceBlock = async (block, blockId, sectionId) => {
		let json = block;
		delete json._id;
		json.order = json.order - 0.1;

		if (this.state.isWorkflow) {
			await this.duplicateWorkflowServiceBlock(json, blockId, sectionId);
			this.handleSaveSections();
		} else {
			await this.duplicateServiceBlock(json, blockId, sectionId);
			this.handleSaveSections();
		}
	};

	handlePublish = async (e) => {
		this.setState({
			isPublishLoading: true,
		});

		const response = await this.publishWorkflow(update_Workflow_Template, {
			templateId: this.props.params.templateID || this.templateId,
			updateObj: {
				status: 'published',
			},
		});
		this.setState({
			isPublishLoading: false,
		});

		window.history.back();
	};

	handleSetServiceBlock = (e, type, blockId, sectionID) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, k) => {
			if (section._id == sectionID) {
				_.map(section.blocks, (block, k) => {
					if (block._id == blockId) {
						block[type] = e;
					}
				});
			}
			arr.push(section);
		});
		this.setState({
			sections: arr,
		});
	};
	handleUpdateSectionData = (sectionData, saveChanges = false) => {
		let sections = [...this.state.sections];
		let requiredIndex = -1;
		for (let i = 0; i < sections?.length; i++) {
			if (sections?.[i]?._id === sectionData?._id) {
				requiredIndex = i;
			}
		}
		if (requiredIndex !== -1) {
			sections?.splice(requiredIndex, 1, sectionData);
		}
		this.setState(
			{
				sections: sections,
			},
			() => {
				if (saveChanges) {
					this.handleSaveSections();
				}
			},
		);
	};
	handleImageWidth = (crop, zoom, imageWidth) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];

		let activeSectionID = this.state.activeSectionID;
		let activeBlockID = this.state.activeBlockID;
		let activeSubBlockID = this.state.activeSubBlockID;
		let arr = [];
		_.forEach(sections, (section, key) => {
			if (section._id === activeSectionID) {
				_.forEach(section.blocks, (block, k) => {
					if (block._id == activeBlockID) {
						_.forEach(block.subBlocks, (subBlock, k) => {
							if (subBlock._id == activeSubBlockID) {
								let image_settings = {
									crop: { x: 0, y: 0 },
									zoom: 1,
									aspect: 3 / 2,
									imageWidth: {
										width: '60px',
										height: '60px',
									},
								};
								image_settings['crop'] = crop;
								image_settings['zoom'] = zoom;
								image_settings['imageWidth'] = imageWidth;
								subBlock.image_settings = image_settings;
							}
						});
					}
				});
			}
			arr.push(section);
		});

		this.setState(
			this.state.module === 'form' && this.state.isHeader
				? {
						headerSection: arr[0],
						imgSettingData: {
							...this.state.imgSettingData,
							crop: crop,
							zoom: zoom,
							imageWidth: imageWidth,
							isAutoSaving: true,
						},
				  }
				: {
						sections: arr,
						imgSettingData: {
							...this.state.imgSettingData,
							crop: crop,
							zoom: zoom,
							imageWidth: imageWidth,
							isAutoSaving: true,
						},
				  },
			async () => {
				setTimeout(
					function () {
						this.handleSaveSections(
							true,
							this.state.module === 'form' && this.state.isHeader,
							'handleImageWidth',
						);
					}.bind(this),
					1000,
				);
			},
		);
	};
	setContent = (e) => {
		this.setState({
			contentAlign: e,
		});
	};
	setImageShapes = (e) => {
		this.setState({
			blockBorder: e,
		});
	};
	setDeviceTypes = (e) => {
		this.setState({
			device: e,
		});
	};
	handleSetTable = (val, type, subBlock, sectionId) => {
		let tables = [...this.state.sectionTables];
		let arr = [];
		_.map(tables, (table, k) => {
			if (table._id === sectionId) {
				_.map(table.values, (vals, k) => {
					if (vals.blockId == subBlock) {
						vals[type] = parseInt(val);
					}
				});
			}
			arr.push(table);
		});
		this.setState(
			{
				sectionTables: arr,
			},
			() => {
				// this.putSections({ tables: arr }, null, true, null, null, true);
			},
		);
	};
	setHeader = (e, value) => {
		if (e === 'header') {
			this.setState(
				{
					isHeader: value,
				},
				async () => {
					await this.handleSaveSections(true, this.state.module === 'form', 'setHeader');
				},
			);
		} else {
			this.setState(
				{
					formBgColor: value,
				},
				async () => {
					await this.handleSaveSections(true, this.state.module === 'form', 'setHeader');
				},
			);
		}
	};
	handleActiveTheme = (e, value) => {
		if (value === 'isTheme') {
			this.setState(
				{
					isTheme: e,
				},
				async () => {
					await this.handleSaveSections(true, this.state.module === 'form', 'setIsTheme');
				},
			);
		} else if (value === 'theme') {
			this.setState(
				{
					activeTheme: e,
				},
				async () => {
					await this.handleSaveSections(
						true,
						this.state.module === 'form',
						'setActiveTheme',
					);
				},
			);
		}
	};
	handleAddSubBlock = async (e, zindexValues, data) => {
		let json;
		json = jsonElementsData[e];
		let order = data || 0;
		let apiJson;
		let [rowStart, colStart, rowEnd, colEnd] = this.state?.clickGridArea
			?.split('/')
			.map((val) => parseInt(val.trim()));
		if (rowStart == 0) {
			rowStart = 1;
		}
		if (colStart == 0) {
			colStart = 1;
		}
		apiJson = {
			...json,
			divStyles: {
				...json.divStyles,
				zIndex: zindexValues.zIndex + 1,
				mZIndex: zindexValues.mZIndex + 1,
				gridArea:
					json?.type === 'shape' || json?.type === 'sticker'
						? `${rowStart} / ${colStart} / ${rowEnd + 3} / ${colEnd + 2}`
						: json?.type === 'button'
						? `${rowStart} / ${colStart} / ${rowStart + 2} / ${colEnd}`
						: json?.type === 'video'
						? `${rowStart} / ${colStart} / ${rowEnd + 10} / ${colEnd + 8}`
						: json?.divStyles?.gridArea,
			},
			order: order + 1,
		};

		if (apiJson.type === 'sticker') {
			apiJson.stickerFill = this.state.themes?.colors?.shape?.color || apiJson.stickerFill;
		}
		let blockID = _.filter(this.state.sections, { _id: this.state.activeSectionID })[0]
			?.blocks[0]?._id;
		this.setState({
			clickGridArea: '',
		});
		await this.addSubBlock(
			apiJson,
			blockID,
			this.state.activeSectionID,
			this.state.activeModuleId,
		);
	};

	handleAddLayout = (
		e,
		isFluid = null,
		isService = false,
		isInvoice = false,
		isScheduler = false,
	) => {
		if (isInvoice) {
			this.getInvoiceNumber();
		}
		if (isScheduler) {
			this.getAllSchedules();
		}

		let order = _.size(this.state.sections) === 0 ? 1 : this.state.order - 0.1;

		let json;
		if (jsonData[e]) {
			json = jsonData[e];
			json.order = order;
			json.sectionType = 'loader';
		} else {
			json = {
				type: 'text',
				sectionType: 'loader',
				style: {
					blocksClassName: 'h-274-imp w-100p d-flex',
					padding: 0,
					// sectionBackgroundColor: '#282829',
					mblocksClassName: '',
				},
				blocks: [
					{
						className: 'w-100p h-100p',
						subBlocks: [
							{
								type: 'loader',
							},
						],
					},
				],
				order,
			};
		}

		let sessions;
		if (isFluid) {
			sessions = [...this.state.sections];
		} else {
			// sessions = [...this.state.sections, json];
			sessions = [...this.state.sections];
		}

		this.setState(
			{
				sections: sessions,
			},
			async () => {
				let jso;
				if (isFluid) {
					order = e?.emptyCardOrder || order;
					jso = {
						isFluidSection: true,
						order: order ? order : 1,
						style: { minHeight: '30px' },
					};
				} else {
					jso = {
						layoutId: e,
						order: order,
					};
				}
				if (this.state.isWorkflow) {
					await this.addWorkflowLayout(
						'this.props.params.workspaceId',
						jso,
						isFluid,
						isService,
					);
				} else {
					if (isFluid) {
						if (this.state.themes?.colors?.background) {
							jso.style.sectionBackgroundColor =
								this.state.themes?.colors?.background;
							jso.style.backgroundType = 'color';
						}
						await this.addSection(
							'this.props.params.workspaceId',
							jso,
							this.state.activeModuleId,
						);
					} else {
						await this.addLayout(
							'this.props.params.workspaceId',
							jso,
							this.state.activeModuleId,
							isService,
							this.state.themes,
						);
					}
				}
			},
		);
	};
	loadFont = () => {
		// let fontsJson = { ...this.state.fonts };
		// _.forEach(fontsJson, (font, k) => {
		// 	if (font) {
		// 		const fontFace = new FontFace(font.fontName, `url(${font.url})`);
		// 		document.fonts.add(fontFace);
		// 		fontFace
		// 			.load()
		// 			.then(() => {
		// 				console.log('fontloaded');
		// 			})
		// 			.catch((err) => {
		// 				console.error('Font loading failed:', err);
		// 			});
		// 	}
		// });
	};
	handlePublishUpdate = async (title) => {
		let response = null;

		if (this.state.isWorkflow) {
			response = await this.updatepublishedWorkflow(updateIndividualWorkflowTitle, {
				updateWorkflowId: this.props.params.templateID,
				updateWorkflowInput: {
					title: title,
				},
			});
			if (response) {
				message.success('Title updated successfully');
			} else {
				message.error('Title update failed');
			}
		} else {
			response = await this.updatepublishedWorkflow(updateWorkflowTemplateTitleNew, {
				templateId: this.props.params.templateID,
				updateObj: {
					title: title,
				},
			});
			if (response) {
				message.success('Title updated successfully');
			} else {
				message.error('Title update failed');
			}
		}

		//return response;
	};

	handleImgOverlay = (type, value) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			_.map(section.blocks, (block, k) => {
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock._id == this.state.activeSubBlockID) {
						if (type == 'color') {
							subBlock.ImgOverlayColor = value;
						} else {
							subBlock.ImgOverlayOpacity = value;
						}
					}
				});
			});
			sectionsarr.push(section);
		});

		const newState = {
			sections,
			isAutoSaving: true,
		};

		if (type === 'color') {
			newState.ImgOverlayColor = value;
		} else if (type === 'opacity') {
			newState.ImgOverlayOpacity = value;
		}

		this.setState(newState, async () => {
			setTimeout(
				function () {
					this.handleSaveSections(
						true,
						this.state.module === 'form' && this.state.isHeader,
						'handleImgOverlay',
					);
				}.bind(this),
				1000,
			);
		});
	};
	handleSetElementPosition = (id, x, y) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			_.map(section.blocks, (block, k) => {
				_.map(block.subBlocks, (subBlock, index) => {
					if (subBlock._id == id) {
						subBlock.divStyles = {
							...subBlock.divStyles,
							transform: `translate(${x}px, ${y}px)`,
						};
					}
				});
			});
			sectionsarr.push(section);
		});

		const newState = {
			sections,
			isAutoSaving: true,
		};
		this.setState(newState, async () => {
			setTimeout(
				function () {
					this.handleSaveSections(
						true,
						this.state.module === 'form' && this.state.isHeader,
						'handleImgOverlay',
					);
				}.bind(this),
				1000,
			);
		});
	};
	//summary background color
	handleSummaryStyles = (e, type, version = null) => {
		let sections = [...this.state.sections];
		let arr = [];
		if (version === 'v1') {
			_.map(sections, (section, key) => {
				if (section?._id === this.state?.activeSectionID) {
					if (type === 'summaryFontColor') {
						section.style.summaryPrimaryFontColor = e;
					} else if (type === 'summaryFontSize') {
						section.style.summaryPrimaryFontSize = e;
					} else if (type === 'summaryFont') {
						section.style.summaryPrimaryFontFamily = e;
					} else {
						section.style.summaryBackgroundColor = e;
					}
				}
				arr.push(section);
			});
			this.setState({ sections: arr }, () => {
				this.handleSaveSections();
			});
		} else {
			this.setState(
				{
					[type]: e,
				},
				() => {
					this.SaveSummaryData();
				},
			);
		}
	};
	SaveSummaryData = () => {
		if (this.state.module === 'summary') {
		}
		this.handleSaveSections(true, this.state.module === 'form', 'SaveSummaryData');
	};

	handleSummaryLabel = (e, type) => {
		const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value || e;

		this.setState({ [type]: value });
	};
	handleLockPreview = async () => {
		this.setState({
			mobileViewLocked: !this.state.mobileViewLocked,
		});
		await this.updatepublishedWorkflow(updateWorkflowTemplateTitle, {
			updateWorkflowId: this.props.params.templateID,
			updateWorkflowInput: {
				mobileViewLocked: !this.state.mobileViewLocked,
			},
		});
	};
	setIconLink = (link, subBlockID, blockID) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (this.state.activeSectionID == section._id) {
				_.map(section.blocks, (block, k) => {
					if (blockID == block._id) {
						_.map(block.subBlocks, (subBlock, i) => {
							if (subBlock._id == subBlockID) {
								subBlock.link = link;
							}
						});
					}
				});
			}
			arr.push(section);
		});
		this.setState(
			{
				sections: arr,
			},
			() => {
				this.handleSaveSections();
			},
		);
	};
	handleCardColor = (type, e, ActiveBId) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (this.state.activeSectionID == section._id) {
				_.map(section.blocks, (block, k) => {
					if (ActiveBId == block._id) {
						if (type === 'iconColor') {
							block.iconColor = e;
						} else {
							block.cardColor = e;
						}
					}
				});
			}
			arr.push(section);
		});
		this.setState(
			{
				sections: arr,
			},
			() => {
				this.handleSaveSections();
			},
		);
	};

	handleJIconProps = (type, e, ActiveBId) => {
		let sections = [...this.state.sections];
		let arr = [];
		_.map(sections, (section, key) => {
			if (this.state.activeSectionID == section._id) {
				_.map(section.blocks, (block, k) => {
					if (ActiveBId == block._id) {
						_.map(block.subBlocks, (subBlock, i) => {
							if (subBlock.type === 'jIcon') {
								if (type == 'icon') {
									subBlock.icon = e;
								} else {
									subBlock.size = e;
								}
							}
						});
					}
				});
			}
			arr.push(section);
		});
		this.setState(
			{
				sections: arr,
			},
			() => {
				this.handleSaveSections();
			},
		);
	};

	onDragEnd = (result) => {
		// if (!result.destination || result.destination.index === result.source.index) {
		// 	return; // Return early if there's no destination or the item wasn't moved
		// }

		const items = Array.from(this.state.duplicateModules);

		const [reorderedItem] = items.splice(result?.source?.index, 1);

		const proposalIndex = items.findIndex((item) => item.module === 'proposal');
		const thankyouIndex = items.findIndex(
			(item) => item.module === 'thankyou' && item.isPublic === false,
		);

		// // Prevent moving 'contract' or 'invoice' above 'proposal'
		// if (
		// 	(reorderedItem.module === 'contract' || reorderedItem.module === 'invoice') &&
		// 	result.destination.index <= proposalIndex
		// ) {
		// 	return;
		// }
		// if (result.destination.index > thankyouIndex) {
		// 	return;
		// }

		// Move the item to its new position
		items.splice(result?.destination?.index, 0, reorderedItem);

		// Update the order if it has changed
		const updatedItems = items.map((item, index) => ({
			...item,
			order: index + 1,
		}));

		this.setState(
			{
				duplicateModules: updatedItems,

				modules: [...updatedItems]
					.filter((module) => module.hide !== true) // Exclude modules where hide is explicitly false
					.sort((a, b) => {
						return a.isPublic === b.isPublic ? 0 : a.isPublic ? -1 : 1;
					}),
			},
			async () => {
				if (this.state.isWorkflow) {
					const changeModules = updatedItems.map((singleModule) => {
						let updatedModule = { ...singleModule };
						updatedModule.type = singleModule.module;
						if (singleModule?.hide) {
							updatedModule.hide = singleModule.hide;
						}
						delete updatedModule.module;
						return updatedModule;
					});
					await this.updateModules(updateIndividualModules, {
						updateWorkflowId: this.props.params.templateID,
						updateWorkflowInput: {
							modules: changeModules,
						},
					});
				} else {
					await this.updateModules(updateModules, {
						templateId: this.props.params.templateID,
						updateObj: {
							moduleTemplates: updatedItems,
						},
					});
				}
			},
		);
	};
	putModules = (e, isSidebar = false) => {
		this.setState(
			{
				duplicateModules: e,
				modules: [...e]
					.filter((module) => module.hide !== true)
					.sort((a, b) => {
						return a.isPublic === b.isPublic ? 0 : a.isPublic ? -1 : 1;
					}),
			},

			async () => {
				if (this.state.isWorkflow) {
					const changeModules = e.map((singleModule) => {
						let updatedModule = { ...singleModule };
						updatedModule.type = singleModule.module;
						if (singleModule?.hide) {
							updatedModule.hide = singleModule.hide;
						}
						delete updatedModule.module;
						return updatedModule;
					});
					await this.updateModules(
						updateIndividualModules,
						{
							updateWorkflowId: this.props.params.templateID,
							updateWorkflowInput: {
								modules: changeModules,
							},
						},
						true,
						null,
						this.state.isWorkflow ? true : false,
						isSidebar,
					);
				} else {
					await this.updateModules(updateModules, {
						templateId: this.props.params.templateID,
						updateObj: {
							moduleTemplates: e,
						},
					});
				}
			},
		);
	};
	handleBrandColors = (e) => {
		this.putBrandColors(e);
	};

	// function for presentation layout drag and drop
	onPresentationDragEnd = (reorderedSections) => {
		this.setState({ sections: reorderedSections }, () => {
			this.handleSaveSections();
		});
	};

	handleAddInTable = (type, index, position, length = 0) => {
		const newSubBlock = {
			type: 'text',
			content: '<p> &nbsp; </p>',
			divStyles: {
				width: '360px',
				alignSelf: 'stretch',
				justifyContent: 'center',
				alignItems: 'center',
				boxShadow: '0px 0px 1px 1px #f9f9f9',
				padding: ' 24px 16px',
				wordBreak: 'break-word',
				minHeight: '80px',
			},
			mclassName: ' w-160px-imp zoom-90-p ',
			TableColumnValue: 1,
			TableColumnColor: '#EFEFEF',
			// "_id": ObjectID().toHexString()
		};
		const newBlock = {
			className: '   d-flex   gap-4px ',
			mclassName: ' h-100p-imp w-100p-imp ',
			subBlocks: [],
			order: 1,
			TablerowValue: 1,
			// "_id": "677bb6477b3b292575734fd4"
		};
		let sections = [...this.state?.sections];

		let sectionsArr = [];
		if (type === 'row') {
			if (position === 'last') {
				_.forEach(sections, (section, k) => {
					if (section._id == this.state.activeSectionID) {
						const subBlocksArray = Array.from({ length }, () => ({
							...newSubBlock,
							_id: ObjectID().toHexString(),
						}));

						section = {
							...section,
							blocks: [
								...section.blocks,
								{
									...newBlock,
									order: length + 1,
									TablerowValue: length + 1,
									_id: ObjectID().toHexString(),
									subBlocks: subBlocksArray,
								},
							],
						};
					}
					sectionsArr.push(section);
				});
				this.setState({ sections: sectionsArr }, () => {
					this.handleSaveSections();
				});
			} else {
				_.forEach(sections, (section, k) => {
					if (section._id == this.state.activeSectionID) {
						const subBlocksArray = Array.from({ length }, () => ({
							...newSubBlock,
							_id: ObjectID().toHexString(),
						}));

						let blocks = [...section.blocks];
						blocks.splice(position === 'before' ? index : index + 1, 0, {
							...newBlock,
							order: position === 'before' ? index : index + 1,
							TablerowValue: position === 'before' ? index : index + 1,
							_id: ObjectID().toHexString(),
							subBlocks: subBlocksArray,
						});
						section = {
							...section,
							blocks: blocks,
						};
					}
					sectionsArr.push(section);
				});
				this.setState({ sections: sectionsArr }, () => {
					this.handleSaveSections();
				});
			}
		} else {
			if (position === 'last') {
				_.forEach(sections, (section, k) => {
					if (section._id == this.state.activeSectionID) {
						section.blocks = section.blocks.map((block) => ({
							...block,
							subBlocks: [
								...block.subBlocks,
								{
									...newSubBlock,
									_id: ObjectID().toHexString(),
								},
							],
						}));
					}
					sectionsArr.push(section);
				});
			} else {
				_.forEach(sections, (section) => {
					if (section._id == this.state.activeSectionID) {
						section.blocks = section.blocks.map((block) => {
							// Create a copy of subBlocks to avoid direct mutation
							const updatedSubBlocks = [...block.subBlocks];

							updatedSubBlocks.splice(position === 'before' ? index : index + 1, 0, {
								...newSubBlock,
								_id: ObjectID().toHexString(),
							});

							return {
								...block,
								subBlocks: updatedSubBlocks,
							};
						});
					}
					sectionsArr.push(section);
				});
			}
			this.setState({ sections: sectionsArr }, () => {
				this.handleSaveSections();
			});
		}
	};

	handleDuplicateInTable = (type, index) => {
		let sections = [...this.state?.sections];
		let sectionsArr = [];
		if (type === 'row') {
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					let newBlock = section.blocks[index];
					newBlock = {
						...newBlock,
						order: index + 1,
						TablerowValue: index + 1,
						subBlocks: newBlock.subBlocks.map((subBlock) => ({
							...subBlock,
							_id: ObjectID().toHexString(),
						})),
						_id: ObjectID().toHexString(),
					};
					section.blocks.splice(index + 1, 0, newBlock);
				}
				sectionsArr.push(section);
			});
			this.setState({ sections: sectionsArr }, () => {
				this.handleSaveSections();
			});
		} else {
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					section.blocks = section.blocks.map((block) => {
						// Create a copy of subBlocks to avoid direct mutation
						const updatedSubBlocks = [...block.subBlocks];
						const newSubBlock = updatedSubBlocks[index];

						updatedSubBlocks.splice(index + 1, 0, {
							...newSubBlock,
							_id: ObjectID().toHexString(),
						});

						return {
							...block,
							subBlocks: updatedSubBlocks,
						};
					});
				}
				sectionsArr.push(section);
			});
			this.setState({ sections: sectionsArr }, () => {
				this.handleSaveSections();
			});
		}
	};

	handleDeleteInTable = (type, index, position = '') => {
		let sections = [...this.state?.sections];

		let sectionsArr = [];
		if (type === 'row') {
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					if (position === 'last' && section.blocks.length >= 2) {
						section.blocks.pop();
					} else {
						section.blocks =
							section.blocks.length >= 2
								? section.blocks.filter((_, k) => k !== index)
								: section.blocks;
					}
				}
				sectionsArr.push(section);
			});
			this.setState({ sections: sectionsArr }, () => {
				this.handleSaveSections();
			});
		} else {
			_.forEach(sections, (section, k) => {
				if (section._id == this.state.activeSectionID) {
					section.blocks = section.blocks.map((block) => ({
						...block,
						subBlocks:
							position == 'last' && section.blocks.length >= 2
								? block.subBlocks?.slice(0, -1)
								: block.subBlocks?.length >= 2
								? block.subBlocks?.filter((_, i) => i !== index)
								: block.subBlocks,
					}));
				}
				sectionsArr.push(section);
			});
			this.setState({ sections: sectionsArr }, () => {
				this.handleSaveSections();
			});
		}
	};
	copyModule = async (e, order) => {
		await this.updateModules(
			duplicateModule,
			{
				templateId: this.props.params.templateID,
				moduleId: e,
				order: _.size(this.state.duplicateModules) + 1,
				isTemplate: !this.state.isWorkflow,
			},
			true,
			'duplicate',
			this.state.isWorkflow,
		);
	};
	deleteModule = async (e) => {
		await this.updateModules(
			this.state.isWorkflow ? deleteModulesInWorkflow : deleteModule,
			{
				templateId: this.props.params.templateID,
				moduleId: e,
				isTemplate: !this.state.isWorkflow,
			},
			true,
			'remove',
			this.state.isWorkflow,
		);
	};
	addPage = async (module) => {
		await this.updateModules(
			addModule,
			{
				templateId: this.props.params.templateID,
				moduleTemplateInput: {
					order: _.size(this.state.modules) + 1,
					label: module.label || 'Page',
					_id: module._id,
					isTemplate: !this.state.isWorkflow,
				},
			},
			true,
			'add',
			this.state.isWorkflow,
		);
	};
	getTemplatelistData = async (e, page = 1) => {
		let filters;
		let type = this.state.isWorkflow;
		this.state.isWorkflow
			? (filters = {
					page: page,
					limit: 30,
					version: 1,
			  })
			: (filters = {
					page: page,
					limit: 30,
					type: 'workspace',
					version: 1,
			  });
		await this.getTemplateList(
			this.state.isWorkflow ? WorkflowsList : templateList,
			{
				filters,
			},
			type,
		);
	};
	getAllInputs = (element) => {
		const inputs = [];
		if (element && element.childNodes) {
			for (let child of element.childNodes) {
				if (child.nodeName === 'INPUT') {
					inputs.push(child);
				} else {
					inputs.push(...this.getAllInputs(child)); // Recursively check child elements
				}
			}
		}

		let inp = [];
		_.forEach(inputs, (input, k) => {
			const dataId = input.dataset.id;

			inp.push(input);
		});
		return inp;
	};

	handleChange = (event) => {
		const newValue = event.target.value;
		const variableId = event.target.dataset.id; // Assuming you have a data attribute to identify the variable
		let vars = [];
		_.forEach([...this.state.sectionVariables], (variable, key) => {
			if (variable._id === variableId) {
				variable.value = newValue;
			}

			vars.push(variable);
		});

		this.setState(
			{
				sectionVariables: vars,
			},
			() => {
				this.handleSaveSections(true);
			},
		);
	};
	addEventBlock = (data, sectionID) => {
		let json = {
			subBlocks: [
				{
					addlServices: [],
					date: '',
					description: '',
					location: '',
					name: '',
					numberOfGuests: '',
					roles: [],
				},
			],
			order: data.length + 1,
		};

		this.duplicateWorkflowEventBlock(json, data[0]?._id, sectionID);
	};

	HandlePaymentSchedule = (e, id = null, style = null) => {
		let sections = [...this.state.sections];
		let arr = sections.map((section) => {
			if (id === section._id && section?.type === 'invoice-with-payment') {
				section.blocks = e;
				section.style = style ? style : section.style;
			}
			return section;
		});

		let updateTables = [...this.state.sectionTables];

		if (id) {
			_.forEach(updateTables, (table, key) => {
				if (table?._id === id) {
					_.forEach(table?.values, (eachValue, key) => {
						let updatedObject = _.find(e, {
							_id: eachValue.blockId,
						})?.subBlocks[0];
						_.assign(eachValue, updatedObject);
						eachValue.amount = parseFloat(eachValue?.amount || 0);
						eachValue.amountPercentage = parseFloat(eachValue?.amountPercentage || 0);
						eachValue.equalValue = parseFloat(eachValue?.equalValue || 0);
						delete eachValue._id;
					});
				}
			});
		}

		this.setState(
			{
				sections: arr,
				// sectionTables: updateTables,
				// paymentSchedule: e,
			},
			() => {
				this.handleSaveSections();
			},
		);
	};

	getCurrencySymbol = (currencyParams = null) => {
		const currency = currencyParams || this.state.currency || 'INR';
		const symbol = getSymbolFromCurrency(currency);

		this.setState({
			currencySymbol: symbol,
		});
		return symbol;
	};

	handleSettingEnabled = () => {
		this.calculateTimeRemaining();
		this.setState({
			settingEnabled: true,
			settingClosingFlag: true,
		});
	};
	handleSettingDisabled = () => {
		this.setState({
			settingClosingFlag: true,
		});
		setTimeout(() => {
			this.setState({
				settingEnabled: false,
			});
		}, 0);
	};

	handleDebouceFunctionCall = (func, timeOut = 1000) => {
		if (this.state.debouceInterval) {
			clearInterval(this.state.debouceInterval);
		}
		const timeFunction = setTimeout(() => {
			func();
		}, timeOut);
		this.setState({ debouceInterval: timeFunction });
	};

	handleSlugChange = async (e) => {
		const valueWithoutSpaces = e?.target?.value.replace(/[^a-z0-9]/g, '');

		this.setState({ endUrl: valueWithoutSpaces });
		const variables = { slug: valueWithoutSpaces, moduleType: 'workflows' };
		const updateSlugVariables = {
			updateSlugId: this.props.params.templateID,
			slug: valueWithoutSpaces,
			moduleType: 'workflows',
		};

		// global debouce function call
		this.handleDebouceFunctionCall(async () => {
			const response = await this.isSlugAvailable(isSlugAvailableQuery, variables);

			if (response) {
				const response = await this.updateSlug(updateSlugQuery, updateSlugVariables);
				this.setState({ endUrl: response.slug, slugErrorMsg: false });
			} else {
				this.setState({ slugErrorMsg: true });
			}
		}, 800);
	};
	handleShare = (e) => {
		this.setState({ isShare: e });
	};
	handleCustomDays = (e, type = null) => {
		if (type === 'custom') {
			let inputValue = e.target.value;
			if (/^\d*$/.test(inputValue)) {
				this.setState(
					{ customExpiryDate: inputValue === '' ? 0 : parseInt(inputValue, 10) },
					() => {
						// let expiryDate = moment.unix(this.state.expiresAt).format();
						const newExpiryTimestamp = moment()
							.add(this.state.customExpiryDate, 'days')
							.unix();

						this.handleDebouceFunctionCall(async () => {
							let response = await this.updateWorkflow(customExpiryQuery, {
								updateWorkflowId: this.props.params.templateID,
								updateWorkflowInput: {
									expiresAt: newExpiryTimestamp,
								},
							});
							if (response) {
								this.setState({
									expiresAt: response?.expiresAt || newExpiryTimestamp,
								});
							}
						}, 1000);
					},
				);
			}
		} else {
			this.setState({ customExpiryDate: e }, () => {
				// let expiryDate = moment.unix(this.state.expiresAt).format();

				const newExpiryTimestamp = moment().add(this.state.customExpiryDate, 'days').unix();

				this.handleDebouceFunctionCall(async () => {
					let response = await this.updateWorkflow(customExpiryQuery, {
						updateWorkflowId: this.props.params.templateID,
						updateWorkflowInput: {
							expiresAt: newExpiryTimestamp,
						},
					});

					if (response) {
						this.setState({
							expiresAt: response?.expiresAt || newExpiryTimestamp,
						});
					}
				}, 1000);
			});
		}
	};

	handleUserIdentity = (type) => {
		if (type === 'name') {
			this.setState({ settingName: !this.state.settingName }, async () => {
				let response = await this.updateWorkflow(customExpiryQuery, {
					updateWorkflowId: this.props.params.templateID,
					updateWorkflowInput: {
						userIdentification: { name: this.state.settingName },
					},
				});
				if (response) {
					this.setState({
						settingName: response?.userIdentification?.name,
					});
				}
			});
		}
		if (type === 'email') {
			this.setState({ settingEmail: !this.state.settingEmail }, async () => {
				let response = await this.updateWorkflow(customExpiryQuery, {
					updateWorkflowId: this.props.params.templateID,
					updateWorkflowInput: {
						userIdentification: { email: this.state.settingEmail },
					},
				});
				if (response) {
					this.setState({
						settingEmail: response?.userIdentification?.email,
					});
				}
			});
		}
		if (type === 'phone') {
			this.setState({ settingPhone: !this.state.settingPhone }, async () => {
				let response = await this.updateWorkflow(customExpiryQuery, {
					updateWorkflowId: this.props.params.templateID,
					updateWorkflowInput: {
						userIdentification: { phone: this.state.settingPhone },
					},
				});
				if (response) {
					this.setState({
						settingPhone: response?.userIdentification?.phone,
					});
				}
			});
		}
		if (type === 'no') {
			this.setState({ isEnable: true }, async () => {
				let response = await this.updateWorkflow(customExpiryQuery, {
					updateWorkflowId: this.props.params.templateID,
					updateWorkflowInput: {
						isPublic: true,
					},
				});
				if (response) {
					this.setState({
						isEnable: response?.access?.isEnabled,
					});
				}
			});
		}
		if (type === 'otp') {
			this.setState({ isEnable: false }, async () => {
				let response = await this.updateWorkflow(customExpiryQuery, {
					updateWorkflowId: this.props.params.templateID,
					updateWorkflowInput: {
						isPublic: false,
					},
				});
				if (response) {
					this.setState({
						isEnable: response?.access?.isEnabled,
					});
				}
			});
		}
	};

	handleCopy = async (copyLink) => {
		if (copyLink) {
			navigator.clipboard
				.writeText(copyLink)
				.then(() => {
					message.success('URL copied to clipboard!');
				})
				.catch((err) => {
					message.error('Failed to copy URL');
				});
		}

		this.state.copyStatus &&
			(await this.copyStatus(updateHittingCount, {
				fileSentStatusId: this.props.params.templateID,
			}));
	};
	fluidGrid = (e) => {
		this.setState({ fluidShowGrid: false });
	};
	handlePostIndividulVariables = (json) => {
		let payload;
		if (_.has(this.state.template, 'version')) {
			payload = {
				...json,
				workflowId: this.state.workflow_id,
			};
		} else {
			payload = json;
		}
		this.postIndividulVariables(payload, this.props?.params?.templateID);
	};

	getClientNameList = async () => {
		await this.getClientName(getClientNameQuery, {
			filters: {
				limit: 100,
				page: 1,
			},
		});
	};
	handleAddClient = async (id) => {
		let response = await this.updateClientSmartFile(SmartFileClientUpdate, {
			addClientToSmartFileId: this.props.params.templateID,
			clientId: id,
		});

		if (response[0] === true) {
			message.success('Successfully client is added');
		}
	};

	handleAddClientSubmit = async (clientData) => {
		if (this.state.isSubmit) {
			return;
		}
		this.setState({ isSubmit: true });
		const response = await this.createClientDetails(
			addClientDetails,
			{
				clientInput: {
					email: clientData.email,
					name: clientData.name,
					phoneNumber: clientData.phone,
					source: clientData.source,
				},
			},
			SmartFileClientUpdate,
		);

		if (response[0] === true) {
			message.success('Client Added Successfully');
			setTimeout(() => {
				this.setState({ isSubmit: false });
			}, 1000);
		} else {
			message.error('Client Added Failed');
			setTimeout(() => {
				this.setState({ isSubmit: false });
			}, 1000);
		}
	};
	handleAiAssistant = async (e) => {
		let response = await this.updateWorkflow(customExpiryQuery, {
			updateWorkflowId: this.props.params.templateID,
			updateWorkflowInput: {
				isAlChatEnabled: e.target.checked,
			},
		});
		if (response) {
			this.setState({ isAlChatEnabled: response?.data?.updateWorkflow?.isAlChatEnabled });
		}
	};
	handleAddClientInShare = (e) => {
		this.setState({
			updateClient: true,
			isClientVariable: true,
			isShare: false,
		});
	};
	handleBackgroundWidth = (value) => {
		this.setState({ activeBackgroundWidth: value }, () => {});
	};
	getModuleSections = async (module) => {
		let responce;
		if (this.state.isWorkflow) {
			responce = await this.getModuleLinkPage(fileModuleQuery, {
				getWorkflowModuleId: module?._id,
				module: module?.module,
			});
		} else {
			responce = await this.getTemplateModulesForLinkPage(moduleQuery, {
				getModuleTemplateId: module?._id,
				module: module?.module,
			});
		}
		this.setState({ activeModuleSections: responce });
	};
	handleCloseWorkflowPopup = () => {
		localStorage.setItem(`${this.props.params.templateID}::closeWorkFlowPopup`, true);
		this.setState({
			closeWorkFlowPopup: localStorage.getItem(
				`${this.props.params.templateID}::closeWorkFlowPopup`,
			),
		});
	};

	//! element animations functions

	handleElementAnimationsValue = (value) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === this.state.activeSectionID) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock) => {
						if (subBlock._id == this.state.activeSubBlockID) {
							subBlock.animations = subBlock.animations || {};
							subBlock.animations.animeName = value;
						}
					});
				});
			}
			sectionsarr.push(section);
		});
		this.setState(
			{
				sections: sectionsarr,
				activeElementAnimeName: value,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleActiveElementAnime',
				);
			},
		);
	};

	handleElementAnimationsType = (value, sid) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === sid) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock) => {
						if (subBlock._id == this.state.activeSubBlockID) {
							subBlock.animations = subBlock.animations || {};
							subBlock.animations.animeType = value;
						}
					});
				});
			}
			sectionsarr.push(section);
		});

		this.setState(
			{
				sections: sectionsarr,
				activeElementAnimeType: value == 'none' ? '' : value,
				showAnimationPopup: true,
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleElementAnimationsType',
				);
			},
		);
	};

	handleRemoveElementAnimations = (sid) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === sid) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock) => {
						if (subBlock._id == this.state.activeSubBlockID) {
							subBlock.animations = {};
						}
					});
				});
			}
			sectionsarr.push(section);
		});

		this.setState(
			{
				sections: sectionsarr,
				activeElementAnimeType: '',
				isAutoSaving: true,
			},
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'handleRemoveElementAnimations',
				);
			},
		);
	};

	//! functions for mobile popup

	//!  for image settings

	setActiveMPopupImageSettings = (value) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === this.state?.activeSectionID) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock, index) => {
						if (subBlock._id === value._id) {
							block.subBlocks[index] = value;
						}
					});
				});
			}
			sectionsarr.push(section);
		});

		this.setState(
			{ sections: sectionsarr, activePopupComponent: value, isAutoSaving: true },
			() => {
				this.debounceFuncForMPopupImage(async () => {
					await this.handleSaveSections(
						true,
						this.state.module === 'form' && this.state.isHeader,
						'setActiveMPopupImageSettings',
					);
				}, 1000);
			},
		);
	};

	debounceFuncForMPopupImage = (func, timeout = 800) => {
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

	//! global function for updating popup component
	setActiveMPopupComponent = (value) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === this.state?.activeSectionID) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock, index) => {
						if (subBlock._id === value._id) {
							block.subBlocks[index] = value;
						}
					});
				});
			}
			sectionsarr.push(section);
		});
		this.setState(
			{ sections: sectionsarr, activePopupComponent: value, isAutoSaving: true },
			async () => {
				await this.handleSaveSections(
					true,
					this.state.module === 'form' && this.state.isHeader,
					'setActiveMPopupComponent',
				);
			},
		);
	};

	//!  function for card popup
	handleCardPopupProps = (e, debounce = false, isShowGrid = true) => {
		this.setState(
			{
				activePopupComponent: e,
				fluidShowGrid: isShowGrid,
			},
			() => {
				if (debounce) {
					// this.debounceFuncForCardProps(() => {
					this.handleSetActiveSection(e);
					// }, 800);
				} else {
					this.handleSetActiveSection(e);
				}
				setTimeout(() => {
					this.setState({
						fluidShowGrid: false,
					});
				}, 2000);
			},
		);
	};

	handleAddBlankPage = async () => {
		let response = await this.addModuleBlankTemplate(addBlankPage, {
			templateId: this.props.params.templateID,
			moduleTemplateInput: {
				isTemplate: this.state.isWorkflow ? false : true,
				order: _.size(this.state.duplicateModules) + 1,
				label: 'Blank Page',
			},
		});
	};
	renderModules = () => {
		let modules = [...this.state.modules];

		// Filter out the public modules if isWorkflow is true (for live preview)
		if (this.state.isWorkflow) {
			modules = modules.filter((ele) => !ele?.isPublic);
		}

		// Find the index of the last module with isPublic: true
		const lastPublicIndex = modules.reduce((lastIndex, module, index) => {
			return module.isPublic ? index : lastIndex;
		}, -1);

		// Find the index of the "Invoice" module
		const invoiceIndex = modules.findIndex((module) => module.module === 'invoice');

		// Add the "Summary" module before the "Invoice" module
		if (invoiceIndex && invoiceIndex !== -1) {
			modules.splice(invoiceIndex, 0, {
				module: 'summary',
				_id: 'summaryModule', // Unique _id for the new module
				label: 'summary',
				isPublic: false, // Adjust properties as needed
			});
		}
		const summaryIndex = modules.findIndex((module) => module.module === 'summary');

		return modules.map((module, k) => {
			if (module !== this.state.module) {
				const isLastPublic = k === lastPublicIndex;
				const moduleType = _.has(module, 'module') ? module.module : module.type;

				return (
					<Fragment key={module._id}>
						<span
							onClick={() => this.props.getModuleInfo(module._id, moduleType)}
							className={`navbar-module-item ${
								this.state.activeModuleId === module._id ? 'active' : ''
							}`}
						>
							{module.label}
						</span>

						{isLastPublic && (
							<div
								style={{
									width: '1px',
									height: '24px',
									backgroundColor: '#9B9290',
									display: 'inline-block',
									marginLeft: '5px',
								}}
							></div>
						)}
					</Fragment>
				);
			}
			return null; // Return null for the current module to avoid rendering it
		});
	};

	// ! global functions for debouncing on popup properties
	handleElementDebounceSave = (value) => {
		let sections =
			this.state.module === 'form' && this.state.isHeader
				? [this.state.headerSection]
				: [...this.state.sections];
		let sectionsarr = [];

		_.map(sections, (section, key) => {
			if (section._id === this.state?.activeSectionID) {
				_.map(section.blocks, (block, k) => {
					_.map(block.subBlocks, (subBlock, index) => {
						if (subBlock._id === value._id) {
							block.subBlocks[index] = value;
						}
					});
				});
			}
			sectionsarr.push(section);
		});
		this.setState(
			{ sections: sectionsarr, activePopupComponent: value, isAutoSaving: true },
			() => {
				this.debounceFuncForElementProps(async () => {
					await this.handleSaveSections(
						true,
						this.state.module === 'form' && this.state.isHeader,
						'handleElementDebounceSave',
					);
				}, 800);
			},
		);
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

	// ! global function for handling navbar updates
	handleNavbarUpdate = (json) => {
		if (this.state.isWorkflow) {
			this.updateWorkflowNavbar(updateNavBarWorkflowQuery, {
				updateWorkflowId: this.state.workflow_id,
				updateWorkflowInput: {
					navBar: json,
				},
			});
		} else {
			this.updateWorkflowTemplate(updateWorkflowTemplateQuery, {
				templateId: this.props.params.templateID,
				updateObj: {
					navBar: json,
				},
			});
		}
	};
	handleShowNavbarToggle = (type) => {
		let newNavBar = { ...this.state.navBar };

		newNavBar.style = {
			...newNavBar.style,
			navigationBar: !this.state?.navBar?.style?.navigationBar,
		};
		this.setState({ navBar: newNavBar }, () => {
			this.handleNavbarUpdate(newNavBar);
		});
	};

	handleGlobalTables = () => {
		let finalTotalCost = 0;

		if (this.state.version === 1) {
			// update the section styles to tables

			// for single service selection && multiple service selection
			this.state?.globalTables
				?.filter(
					(table) =>
						table?.type === 'services' && table?.styles?.services_selection !== 2,
				)
				?.forEach((table) => {
					let subTotalValue = 0;
					table.values.forEach((value) => {
						if (value.isSelected === true && value?.show) {
							let amount = parseFloat(value.amount) || 0;
							let quantity = parseFloat(value.quantity) || 0;
							let price = quantity * amount;
							subTotalValue += price;
						}
					});
					finalTotalCost += subTotalValue;
				});

			// view only service selection
			this.state?.globalTables
				?.filter(
					(table) =>
						table?.type === 'services' && table?.styles?.services_selection === 2,
				)
				?.forEach((table) => {
					let subTotalValue = 0;
					table.values.forEach((value) => {
						subTotalValue += parseFloat(value.amount) * parseFloat(value.quantity) || 0;
					});
					if (subTotalValue === 0) {
						let customSectionSubtotalValue =
							this.state?.globalSummaryData?.sections?.find(
								(section) => section?._id === table?._id,
							)?.style?.subTotalValue;
						let customTableSubtotalValue = table?.styles?.subTotalValue;
						let customSubTotalValue =
							customSectionSubtotalValue !== customTableSubtotalValue
								? customSectionSubtotalValue
								: customTableSubtotalValue;
						const incomingSubTotalValue =
							parseFloat(
								(customSubTotalValue + '')
									?.replace(/&nbsp;/g, ' ')
									.replace(/<\/?[^>]+(>|$)/g, '')
									.replace(/"/g, ''),
							) || 0;
						subTotalValue = incomingSubTotalValue;
					}
					finalTotalCost += subTotalValue;
				});

			this.setState({ finalTotalCost });
		}
	};

	updateThemeSettings = async (themeJson) => {
		if (this.state.isWorkflow) {
			this.updateWorkflowThemeSettings(updateNavBar_Theme_File_Query, {
				updateWorkflowId: this.state.workflow_id,
				updateWorkflowInput: {
					themes: themeJson,
					navBar: this.state.navBar,
				},
			});
		} else {
			await this.updateWorkflowThemeSettingsTemplate(update_Workflow_Template, {
				templateId: this.props.params.templateID,
				updateObj: {
					themes: themeJson,
					navBar: this.state.navBar,
				},
			});
		}

		this.setState({
			showThemeSettings: false,
			showSideBar: false,
		});
	};

	handleSaveWorkflow = () => {
		window.location.replace('https://ve.ai/docs');
	};

	handleCreateNavBar = async () => {
		if (this.state.isWorkflow) {
			this.updateWorkflowNavbar(updateNavBarWorkflowQuery, {
				updateWorkflowId: this.state.workflow_id,
				updateWorkflowInput: {
					navBar: {
						type: 'navbar',
						style: {
							navigationBar: true,
							position: true,
							showCart: true,
							showLogo: true,
							sectionBackgroundColor: 'transparent',
							padding: 2,
						},
						blocks: [
							{
								className: '',
								mclassName: '',
								subBlocks: [
									{
										type: 'image',
										label: 'image',
										divStyles: {
											width: '33px',
											height: '35px',
											backgroundColor: 'transparent',
										},
										image_settings: {
											aspect: 1.5,
											crop: {
												x: 0,
												y: 0,
											},
											zoom: 1,
										},
										imageURL: '',
										mclassName: '  ',
									},
								],
							},
						],
					},
				},
			});
		} else {
			this.updateWorkflowTemplate(updateWorkflowTemplateQuery, {
				templateId: this.props.params.templateID,
				updateObj: {
					navBar: {
						type: 'navbar',
						style: {
							navigationBar: true,
							position: true,
							sectionBackgroundColor: 'transparent',
							showCart: true,
							showLogo: true,
							padding: 2,
						},
						blocks: [
							{
								className: '',
								mclassName: '',
								subBlocks: [
									{
										type: 'image',
										label: 'image',
										divStyles: {
											width: '33px',
											height: '35px',
											backgroundColor: 'transparent',
										},
										image_settings: {
											aspect: 1.5,
											crop: {
												x: 0,
												y: 0,
											},
											zoom: 1,
										},
										imageURL: '',
										mclassName: '  ',
									},
								],
							},
						],
					},
				},
			});
		}
	};

	// ! smart field functions

	handleSmartFieldModalClose = () => {
		this.setState({
			showSmartFieldModal: false,
			smartFieldName: '',
			smartFieldValue: '',
			selectedSmartOption: '',
			isEditSmartFeild: false,
			activeSmartFieldData: null,
		});
	};
	editSmartFields = () => {
		const { smartFieldValue, selectedSmartOption, smartFieldName, activeSmartFieldData } =
			this.state;
		const referanceJson = {
			defaultValue: activeSmartFieldData?.defaultValue,
			displayName: activeSmartFieldData?.displayName,
			inputType: activeSmartFieldData?.inputType,
			isRequired: false,
		};
		const json = {
			defaultValue: smartFieldValue,
			displayName: smartFieldName,
			inputType: selectedSmartOption,
			isRequired: false,
		};

		if (!smartFieldName || !selectedSmartOption || !smartFieldValue) {
			console.error('All fields are required');
			return;
		}

		if (!_.isEqual(referanceJson, json)) {
			this.updateVariables(json, this.props.params.templateID, activeSmartFieldData?._id);
			this.setState({
				showSmartFieldModal: false,
			});
		} else {
			this.setState({
				showSmartFieldModal: false,
			});
		}
	};

	handleCreateNewSmartField = () => {
		const value = this?.state?.smartFieldValue;
		const name = this.state?.smartFieldName;
		const selectedOption = this.state?.selectedSmartOption;

		const params = new URLSearchParams(window.location.search);
		const templateId = params.get('templateId');

		if (!name || !selectedOption || !value) {
			console.error('All fields are required');
			return;
		}
		const json = {
			defaultValue: value,
			displayName: name,
			inputType: selectedOption,
			isRequired: false,
			templateId: this.props?.params?.templateID,
		};
		const isworkflowjson = {
			defaultValue: value,
			displayName: name,
			inputType: selectedOption,
			isRequired: false,
			templateId: this.state.template?._id,
			workflowId: this.state?.workflow_id,
		};
		if (this.state.isWorkflow) {
			console.log(isworkflowjson, this.state.template?._id, 'jeevan');
			this.handlePostIndividulVariables(isworkflowjson);
		} else {
			this.postVariables(json, this.props?.params?.templateID);
		}
		this.setState({
			showSmartFieldModal: false,
			smartFieldName: '',
			smartFieldValue: '',
			selectedSmartOption: '',
		});
	};

	handleDeleteVariable = (variableId) => {
		this.deleteVariable(this.props.params.templateID, variableId);
	};

	handleDuplicateTemplate = async () => {
		let response = await this.handleDuplicateTemplateFunction(duplicateTemplateQuery, {
			templateId: this.props.params.templateID,
			title: `Copy of ${this.state.title}`,
		});
		if (response[0] === true) {
			this.handleDuplicateTemplateRoute(response[1].data.duplicateWorkflowTemplate._id);
		}
	};
	handleDuplicateTemplateRoute = (templateId) => {
		return (window.location.href = `${window.location.origin}/builder/${templateId}`);
	};
	handleDeleteTemplate = async (e) => {
		let response = await this.handleDeleteTemplateFunction(deleteTemplateQuery, {
			deleteTemplateId: this.props.params.templateID,
			isDeleted: e,
		});
		if (response[0] === true) {
			return this.props?.navigate(`/files?active-tab=My-Templates`);
		}
	};
	updateTablesForTaxes = (tables) => {
		this.setState(
			{
				sectionTables: tables,
			},
			() => {
				this.handleSaveSections();
			},
		);
	};
	handleTriggerAdjustGridAreas = async (e) => {};
	handleImageUploadGlobal = (url) => {
		if (this.state.isWorkflow) {
			this.updateWorkflowNavbar(updateNavBarWorkflowQuery, {
				updateWorkflowId: this.state.workflow_id,
				updateWorkflowInput: {
					imageUrl: url,
				},
			});
		} else {
			this.updateWorkflowTemplate(updateWorkflowTemplateQuery, {
				templateId: this.props.params.templateID,
				updateObj: {
					imageUrl: url,
				},
			});
		}
	};
	handleCheckMobileViewOpt = async (option = 'yes') => {
		if (option == 'yes') {
			const { id, type } = this.state?.getModuleParams || {};
			this.fetchGetModule(id, type);
		} else {
			this.setState({
				showCheckMobilePopup: false,
				alreadyCheckedMobileView: true,
			});
		}
	};

	fetchGetModule = async (id = '', type = '*') => {
		this.setState({
			isLoading: true,
			addBlock: false,
			order: null,
			prevOrder: null,
			nextOrder: null,
			sections: [],
			sectionTables: [],
			showCheckMobilePopup: false,
			alreadyCheckedMobileView: false,
		});

		if (this.state.isWorkflow) {
			this.setState({ activeModuleId: id }, async () => {
				await this.getWorkflowModuleTemplate(moduleWorkflowQuery, {
					getWorkflowModuleId: id,
					module: type,
				});
			});
		} else {
			await this.getModuleTemplate(moduleQuery, {
				getModuleTemplateId: id,
				module: type,
			});
			// ! not needed
			// await this.handleSaveSections();
		}
	};
	render() {
		if (this.componentRef.current) {
			const data = [
				'CompanyAddress',
				'CompanyName',
				'LinkedInProfile',
				'FacebookProfile',
				'CompanyEmail',
				'CompanyPhoneNumber',
				'website',
			];
			const variableInputs = this.componentRef.current.querySelectorAll('input.variable');
			variableInputs.forEach((input) => {
				if (data.includes(input.id)) {
					if (this.state.tenantsData[input.id] !== null) {
						input.value = this.state.tenantsData[input.id];
					}
				}
				if (this.state.isWorkflow) {
					input.readOnly = false;
				}
			});

			if (this.state.isWorkflow) {
				const inputElements = this.componentRef.current.querySelectorAll('input.variable');

				inputElements.forEach((input) => {
					input.addEventListener('input', this.handleChange);
					if (
						_.has(
							_.filter(this.state.sectionVariables, {
								_id: input.dataset.id,
							})[0],
							'value',
						)
					) {
						let variableValues = _.filter(this.state.sectionVariables, {
							_id: input.dataset.id,
						})[0];
						input.value = variableValues?.value || variableValues?.defaultValue;
					}
				});
			}
		}
		const SmartFeildOptions = [
			{
				value: 'text',
				label: 'Text',
				image: <Text />,
			},
			{
				value: 'longText',
				label: 'Long Text',
				image: <LongText />,
			},
			{
				value: 'number',
				label: 'Number',
				image: <Number />,
			},
			{
				value: 'phoneNumber',
				label: 'Phone Number',
				image: <PhoneNumber />,
			},
			{
				value: 'email',
				label: 'Email',
				image: <Email />,
			},
			{
				value: 'date',
				label: 'Date',
				image: <Date />,
			},
			{
				value: 'link',
				label: 'Link',
				image: <Link />,
			},
			{
				value: 'currency',
				label: 'Currency',
				image: <Currency />,
			},
		];
		return (
			<>
				{this.state.fontsLoading == false ? (
					<Helmet>
						{_.map(this.state.fonts, (font, k) => {
							return <link href={font.url} key={k} rel="stylesheet" />;
						})}
					</Helmet>
				) : (
					''
				)}
				<div className="home_wrapper">
					{/* {this.state.preview && this.state.client == false ? (
						<div className="hw_top hw_top_preview">
							<Preview /> You are currently viewing the live preview of this smart
							file
						</div>
					) : (
						''
					)} */}
					{!this.state.closeWorkFlowPopup && (
						<>
							{
								this.state.isWorkflow && (
									<div className="workflow_popup">
										<div className="workflow_popup_text">
											Your edits will stay within this file and won't reflect
											on the original template.
										</div>
										<div
											className="workflow_popup_button"
											onClick={() => this.handleCloseWorkflowPopup()}
										>
											Got it
										</div>
									</div>
								)
								// (
								// 	<div className="workflow_popup">
								// 		<div className="workflow_popup_text">
								// 			Changes made to the template will only apply to it.
								// 		</div>
								// 		<div
								// 			className="workflow_popup_button"
								// 			onClick={() => this.handleCloseWorkflowPopup()}
								// 		>
								// 			Got it
								// 		</div>
								// 	</div>
								// )
							}
						</>
					)}

					{this.state.isShare && (
						<div ref={this.shareRef}>
							<SharePopup
								customDomain={this.state.customDomain}
								endUrl={this.state.endUrl}
								slugErrorMsg={this.state.slugErrorMsg}
								status={this.state.status}
								handleSlugChange={(e) => this.handleSlugChange(e)}
								handleCopy={this.handleCopy}
								expiresAt={this.state.expiresAt}
								handleCustomDays={(e, type) => this.handleCustomDays(e, type)}
								handleUserIdentity={(type) => this.handleUserIdentity(type)}
								isEnable={this.state.isEnable}
								settingName={this.state.settingName}
								settingEmail={this.state.settingEmail}
								settingPhone={this.state.settingPhone}
								customExpiry={this.state.customExpiry}
								customExpiryDate={this.state.customExpiryDate}
								clientDetails={this.state.clientDetails}
								handleAiAssistant={this.handleAiAssistant}
								aiAssistant={this.state.isAlChatEnabled}
								handleAddClientInShare={(a, b) => this.handleAddClientInShare(a, b)}
							/>
						</div>
					)}
					{this.state.updateClient && this.state.isClientVariable && (
						<div ref={this.updateClientRef}>
							<CreateClient
								isSubmit={this.state.isSubmit}
								updateClient={this.state.updateClient}
								addClientDetails={this.state.addClientDetails}
								clientListArray={this.state.clientListArray}
								clientData={this.state.clientData}
								sourceList={this.state.sourceList}
								handleAddClient={this.handleAddClient}
								handleAddClientSubmit={(e) => this.handleAddClientSubmit(e)}
								errorNameMsg={this.state.errorNameMsg}
							/>
						</div>
					)}

					{this.state.isTemplateDeleteOpen && (
						<div ref={this.templateDeleteRef} className="template_delete_popup">
							<DeleteTemplatePopup
								SetDeleteTemplate={(e) => this.handleDeleteTemplate(e)}
								numOfDocuments={this.state.numOfDocuments}
							/>
						</div>
					)}
					{this.state?.showCheckMobilePopup && !this.state?.alreadyCheckedMobileView && (
						<CheckMobileView updatePreviewOption={this.handleCheckMobileViewOpt} />
					)}
					{this.state.isGeneratePreview ? (
						''
					) : (
						<div className="hw_top">
							{this?.props?.showNewHeader ? (
								<UpdatedHeader
									title={this.state.title}
									mode="edit"
									managePages={() =>
										this.setState({
											//managePages: true,
											activeSubBlockType: 'p',
											showSideBar: true,
											isFluidLayout: false,
											preview: false,
										})
									}
									modules={this.state.modules}
									handleSave={this.props?.handleSave || (() => {})}
									isWorkflow={true}
									updatePublishedTemplate={(e) => this.handlePublishUpdate(e)}
									handleAddClientInShare={(e) => this.handleAddClientInShare(e)}
									previewMode={this.state.previewMode}
									setPreview={(e, type) =>
										this.setState({
											previewMode: e,
											previewType: e,
											preview: type,
										})
									}
									mobileViewLocked={this.state?.mobileViewLocked}
									duplicateModules={this.state?.duplicateModules}
									titleName={this.state?.titleName}
									template_ID={this.state?.template_ID}
									renderModules={() => this.renderModules()}
									showThemeSettings={() =>
										this.setState({
											showThemeSettings: true,
											showSideBar: false,
										})
									}
									handleSaveAdjustGrid={(e, type) => {
										this.setState({
											previewMode: type,
											preview: e,
										});
									}}
								/>
							) : (
								<Header
									title={this.state.title}
									mobileViewLocked={this.state.mobileViewLocked}
									preview={this.state.preview}
									previewType={this.state.previewType}
									previewMode={this.state.previewMode}
									setPreview={(e, type) =>
										this.setState({
											previewMode: e,
											previewType: e,
											preview: type,
											alreadyCheckedMobileView:
												e === 'm'
													? true
													: this.state?.alreadyCheckedMobileView,
										})
									}
									//saveSections={(e) => this.handleSave(e)}
									publish={(e) => this.handlePublish(e)}
									isSaveLoading={this.state.isSaveLoading}
									isPublishLoading={this.state.isPublishLoading}
									modules={this.state.modules}
									module={this.state.module}
									getModuleInfo={(id, type) => this.getModule(id, type)}
									updatePublishedTemplate={(e) => this.handlePublishUpdate(e)}
									activeModuleId={this.state.activeModuleId}
									isWorkflow={this.state.isWorkflow}
									managePages={() =>
										this.setState({
											//managePages: true,
											activeSubBlockType: 'p',
											showSideBar: true,
											isFluidLayout: false,
										})
									}
									settingEnabled={this.state.settingEnabled}
									setSettingEnabled={() => this.handleSettingEnabled()}
									handleShare={(e) => this.handleShare(e)}
									handleAddClientInShare={(e) => this.handleAddClientInShare(e)}
									duplicateModules={this.state.duplicateModules}
									showThemeSettings={() =>
										this.setState({
											showThemeSettings: true,
											showSideBar: false,
										})
									}
									isTemplateID={this.state.isTemplateID}
									renderModules={() => this.renderModules()}
									handleDuplicateTemplate={() => this.handleDuplicateTemplate()}
									handleDeleteOpen={(e) => {
										this.setState({ isTemplateDeleteOpen: e });
									}}
									isFormTemplate={this.state.isFormTemplate}
									handleImageUploadGlobal={this.handleImageUploadGlobal}
									imageUrl={this.state.imageUrl}
								/>
							)}
						</div>
					)}

					<ThemeSettings
						showThemeSettings={this.state.showThemeSettings}
						homeFonts={this.state.fontsLoading ? null : this.state.fonts}
						Homesections={this.state.sections}
						homeNavBar={this.state.navBar}
						closeThemeSettings={() =>
							this.setState({
								showThemeSettings: false,
								showSideBar: true,
							})
						}
						updateHomeStateFunction={(e) => {
							this.setState({ ...e });
						}}
						homeThemes={this.state.themes}
						handleSaveSectionsHomeFunc={this.handleSaveSections}
						handleUpdateThemeSettingsHomeFunc={this.updateThemeSettings}
					/>

					<div className="hw_bottom">
						{this.state.isLoading ? (
							<div className="page_loading">
								<a>
									<span className="loader"></span>
									{this.getRandomText(loadingTexts)}
								</a>
							</div>
						) : (
							<div className="hwb_container">
								<div
									className={`hwb_wrapper`}
									style={{
										paddingRight:
											!this.state?.isFluidLayout &&
											this.state?.showSideBar &&
											!this.state?.showAddBlock &&
											!this.state?.previewType?.includes('m')
												? '360px'
												: '0px',
										paddingLeft:
											!this.state.showSideBar && this.state.showAddBlock
												? this.state.module === 'proposal'
													? '520px'
													: '0px'
												: '0px',
										// zoom:
										// 	this.state.showSideBar && !this.state.showAddBlock
										// 		? 0.8
										// 		: 1,
										justifyContent:
											this.state?.activeModule?.showType == 'a4' &&
											this.state?.activeModule?.showAsA4
												? 'center'
												: '',
										backgroundColor:
											this.state?.activeModule?.showType == 'a4' &&
											this.state?.activeModule?.showAsA4 &&
											this.state?.activeModule?.a4BgColor
												? this.state?.activeModule?.a4BgColor
												: '',
									}}
								>
									{this.state.previewType === 'm' ? (
										<div
											className="desktop-view-for-mobile"
											// style={{ maxWidth: 600, display: 'flex' }}
										>
											<div className="desktop-view-for-mobile-wrapper">
												<div className="preview-heading">
													Desktop Preview
												</div>
												<div className="preview-para">
													Desktop preview helps you align your design for
													mobile.
												</div>
												<div className="desktop-view-preview-border">
													<Builder
														triggerAdjustGridAreas={
															this.state.triggerAdjustGridAreas
														}
														mobile_preview_builder={true}
														fluidGrid={() => this.fluidGrid()}
														fluidShowGrid={this.state.fluidShowGrid}
														invoiceTables={this.state.invoiceTables}
														isWorkflow={this.state.isWorkflow}
														previewMode={'ml'}
														handleAddElement={(e, zIndex, order) =>
															this.handleAddSubBlock(
																e.text,
																zIndex,
																order,
															)
														}
														setLastClick={(e) =>
															this.setState({ clickGridArea: e })
														}
														handleSaveblocks={(
															e,
															sectionID,
															layoutHeight,
														) =>
															this.handleSaveblocks(
																e,
																sectionID,
																layoutHeight,
															)
														}
														handleSaveSingleBlock={
															this.handleSaveSingleBlock
														}
														setElementPosition={(id, x, y) =>
															this.handleSetElementPosition(id, x, y)
														}
														setTriggerFont={(e) =>
															this.setState({ triggerFont: e })
														}
														setTriggeredFont={(e) =>
															this.setState({
																triggeredFont: e,
															})
														}
														uploadImageBase64={(e) =>
															this.setState({
																base64: e,
																uploadAIImage: true,
															})
														}
														generateAIImages={(e) =>
															this.generateAIImages(e)
														}
														generateAIText={(e) =>
															this.generateAIText(e)
														}
														clearFontStyles={() =>
															this.setState({
																justifycenter: false,
																justifyleft: false,
																justifyright: false,
																justifyfull: false,
																actionType: null,
																actionValue: null,
															})
														}
														module={this.state.module}
														client={true}
														deleteFQBlock={(blockID, sectionID) =>
															this.state.isWorkflow
																? this.handleWorkflowDeleteBlock(
																		blockID,
																		sectionID,
																  )
																: this.handleDeleteBlock(
																		blockID,
																		sectionID,
																  )
														}
														handleOpenSideBar={(
															e,
															_id,
															service = false,
														) => {
															if (this.state.preview !== true) {
																this.setState({
																	showSideBar: true,
																	activeSectionID: _id,
																	isServiceBlock: service,
																	showAddBlock: false,
																});
															} else {
																this.setState({
																	showSideBar: false,
																	isServiceBlock: service,
																});
															}
														}}
														handleCloseSideBar={() => {
															this.setState({
																showSideBar: false,
															});
														}}
														activeFontColor={this.state.activeFontColor}
														actionType={this.state.actionType}
														actionValue={this.state.actionValue}
														triggerFont={this.state.triggerFont}
														triggeredFont={this.state.triggeredFont}
														handleHSelection={(e, activeTextBlock) =>
															this.state.client == true
																? ''
																: this.handleFontStyles(
																		e,
																		activeTextBlock,
																  )
														}
														crop={this.state.crop}
														zoom={this.state.zoom}
														sections={this.state.sections}
														activeSectionID={this.state.activeSectionID}
														activeTextBlock={this.state.activeTextBlock}
														handledeleteSection={(e) =>
															this.deleteSection(e)
														}
														handleSetSubBlockContent={(
															content,
															sectionID,
															blockID,
															id,
															mContent = false,
															sectionId = null,
														) =>
															this.saveSubBlockContent(
																content,
																sectionID,
																blockID,
																id,
																mContent,
																sectionId,
															)
														}
														handleSetBlockContent={(
															content,
															sectionID,
															blockID,
														) =>
															this.saveBlockContent(
																content,
																sectionID,
																blockID,
															)
														}
														preview={true}
														previewType={'ml'}
														handleActiveImage={(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
															dimensions = null,
															ImgSubBlock,
															isFluid = null,
														) => [
															this.activeImage(
																sectionID,
																blockID,
																subBlockID,
																imageURL,
																dimensions,
																ImgSubBlock,
															),
															isFluid
																? this.setState({
																		showSideBar: true,
																  })
																: '',
														]}
														setSections={(e, restrict = null) =>
															this.setState({ sections: e }, () => {
																this.handleSaveSections(
																	restrict,
																	this.state.module === 'form' &&
																		this.state.isHeader,
																	'tables',
																);
															})
														}
														setActiveTab={(
															e,
															subBlockID = null,
															blockID = null,
															isFluid = null,
														) => {
															if (subBlockID !== null) {
																this.setState({
																	activeSubBlockType: e,
																	activeSubBlockID: subBlockID,
																	activeBlockID: blockID,
																});
															} else {
																this.setState({
																	activeSubBlockType: e,
																});
															}
														}}
														activeVariableID={
															this.state.activeVariableID
														}
														activeVariableName={
															this.state.activeVariableName
														}
														subBlockID={this.state.activeSubBlockID}
														handleAddServiceBlock={(
															e,
															order,
															services_style,
														) =>
															this.state.isWorkflow
																? this.addWorkflowServiceTableBlock(
																		e,
																		order,
																		services_style,
																  )
																: this.addServiceTableBlock(
																		e,
																		order,
																		services_style,
																  )
														}
														variables={this.state.sectionVariables}
														tables={this.state.sectionTables}
														serviceSelect={(
															block,
															type,
															value,
															section,
														) =>
															this.handleServiceSelect(
																block,
																type,
																value,
																section,
															)
														}
														contractActiveVariable={(e) =>
															this.setState({
																activeContractVariable: e,
																// activeSubBlockType: 'v',
															})
														}
														setBlockTab={(e) =>
															this.setState({
																activeSubBlockType: 'b',
															})
														}
														addFormQuestion={(sectionID, blockOrder) =>
															this.state.isWorkflow
																? this.addWorkflowQuestionForForm(
																		sectionID,
																		blockOrder,
																  )
																: this.addQuestionForForm(
																		sectionID,
																		blockOrder,
																  )
														}
														setActiveFormQuestion={(e, blockID) =>
															this.setState({
																activeSubBlockType: 'q',
																activeFormQuestion: blockID,
																showSideBar: this.state.preview
																	? false
																	: true,
															})
														}
														handleAddFormOption={(e) =>
															this.setFormOptionForMultipleChoice(e)
														}
														handleSetOpenNewtab={(e) =>
															this.setState({
																openInNewTab: e,
															})
														}
														tenantLogo={this.state.tenantLogo}
														setShape={(e) =>
															this.setState({
																activeShape: e,
															})
														}
														addEmptyLayout={(e) => this.emptyOrder(e)}
														handleSetButtonLink={(e) =>
															this.setState({
																buttonLink: e,
															})
														}
														setBtStyles={(e) =>
															this.setState({
																setBtStyles: e,
															})
														}
														btShape={(e) =>
															this.setState({
																btShape: e,
															})
														}
														imgSettingData={(e) =>
															this.setState({
																imgSettingData: e,
															})
														}
														setTables={(e) =>
															this.setState(
																{ sectionTables: e },
																async () => {
																	setTimeout(
																		() =>
																			this.handleSaveSections(
																				true,
																				this.state
																					.module ===
																					'form' &&
																					this.state
																						.isHeader,
																				'tables',
																			),
																		300,
																	);
																},
															)
														}
														selectBlock={(e) =>
															this.setState({
																activeSubBlockType: e,
															})
														}
														duplicateBlock={(e) =>
															this.handleDuplicate(e)
														}
														duplicateServiceBlock={(e, f, g) =>
															this.handleDuplicateServiceBlock(
																e,
																f,
																g,
															)
														}
														activeSection={this.state.activeBlock}
														setActiveSection={(e, executeSave = null) =>
															this.handleSetActiveSection(
																e,
																executeSave,
															)
														}
														activeSubBlockId={
															this.state.activeSubBlockID
														}
														setServiceSubBlock={(e) => {
															this.setState({
																showServiceSubBlock: true,
																activeServiceSubBlock: e,
																activeSubBlockType: 's',
															});
														}}
														deleteServiceBlock={(e, f) =>
															this.state.isWorkflow
																? this.handleWorkflowDeleteBlock(
																		e,
																		f,
																  )
																: this.handleDeleteBlock(e, f)
														}
														setServiceBlockContent={(e, f, g, h) =>
															this.handleSetServiceBlock(e, f, g, h)
														}
														handleUpdateSectionData={
															this.handleUpdateSectionData
														}
														headerSection={this.state.headerSection}
														isHeader={this.state.isHeader}
														formBgColor={this.state.formBgColor}
														addBlock={(
															showAddBlock,
															nextOrder,
															prevOrder,
															order,
															isElement = null,
															sectionID = null,
														) => {
															this.setState(
																{
																	showAddBlock: true,
																	showSideBar: false,
																	nextOrder,
																	prevOrder,
																	order,
																	isElement,
																},
																() => {
																	if (sectionID !== null) {
																		this.setState({
																			activeSectionID:
																				sectionID,
																		});
																	}
																	this.handleSaveSections();
																},
															);
														}}
														setActiveTheme={this.state.activeTheme}
														isTheme={this.state?.isTheme}
														circleTextData={(e) =>
															this.setState({
																circleTextData: e,
															})
														}
														activeAnimation={this.state.activeAnimation}
														setIsValidURL={(e) => {
															this.setState({
																isValidURL: e,
															});
														}}
														backgroundType={this.state.backgroundType}
														// backgroundImageURL={this.state.}
														backgroundVideoURL={
															this.state.backgroundVideoURL
														}
														setIsValidBgVideoURL={(e) => {
															this.setState({
																isValidBgVideoURL: e,
															});
														}}
														isTenantLogo={this.state.isTenantLogo}
														contractVariables={
															this.state.contractVariables
														}
														duplicateSubBlock={(
															json,
															subBlockId,
															sectionId,
														) =>
															this.duplicateSubBlock(
																json,
																subBlockId,
																sectionId,
															)
														}
														eventsLabel={this.state?.eventsLabel}
														paymentsLabel={this.state?.paymentsLabel}
														summaryBg={this.state?.summaryBg}
														summaryFont={this.state?.summaryFont}
														summaryFontColor={
															this.state?.summaryFontColor
														}
														summaryFontSize={
															this.state?.summaryFontSize
														}
														summaryBlock={this.state?.summaryBlock}
														paymentSchedule={this.state.paymentSchedule}
														setPaymentSchedule={(
															e,
															id = null,
															type = null,
															style = null,
														) => {
															if (type == 'invoice') {
																this.setState(
																	{
																		paymentSchedule: e,
																	},
																	() => {
																		this.handleSaveSections();
																	},
																);
															} else {
																// version 1
																this.HandlePaymentSchedule(
																	e,
																	id,
																	style,
																);
															}
														}}
														showSchedule={this.state.showSchedule}
														invoiceClientVariables={
															this.state.invoiceClientVariables
														}
														invoiceNumber={this.state.invoiceNumber}
														handleInvoiceNumber={(e) => {
															this.putInvoiceNumber(e);
														}}
														socialMediaLinks={
															this.state.socialMediaLinks
														}
														handleSetIconLink={(
															link,
															subBlockID,
															blockId,
														) =>
															this.setIconLink(
																link,
																subBlockID,
																blockId,
															)
														}
														iframeScroll={this.state.iframeScroll}
														onPresentationDragEnd={(e) =>
															this.onPresentationDragEnd(e)
														}
														activeModule={this.state.activeModule}
														activeFormQuestion={
															this.state.activeFormQuestion
														}
														handleDeleteInTable={(type, index) =>
															this.handleDeleteInTable(type, index)
														}
														handleDuplicateInTable={(type, index) =>
															this.handleDuplicateInTable(type, index)
														}
														handleAddInTable={(
															type,
															index,
															position,
															length = 0,
														) =>
															this.handleAddInTable(
																type,
																index,
																position,
																length,
															)
														}
														addPaymentScheduleBlock={(id, order) => {
															this.state?.isWorkflow
																? this.addWorkflowPaymentScheduleBlock(
																		id,
																		order,
																  )
																: this.addPaymentScheduleBlock(
																		id,
																		order,
																  );
														}}
														addEventBlock={(e, sectionID) =>
															this.addEventBlock(e, sectionID)
														}
														handleAcceptProposal={
															this?.handleAcceptProposal
														}
														globalSummaryData={
															this.state?.globalSummaryData
														}
														currencySymbol={this.state?.currencySymbol}
														getModuleInfo={(id, type) =>
															this.getModule(id, type)
														}
														globalTables={this.state.globalTables}
														globalSections={this.state.globalSections}
														handleAddLayout={(e, isFluid, isService) =>
															this.handleAddLayout(
																e,
																isFluid,
																isService,
															)
														}
														duplicateModules={
															this.state.duplicateModules
														}
														renderModules={() => this.renderModules()}
														allSchedules={this.state.allSchedules}
														handleScheduleStyles={(data) =>
															this.handleScheduleStyles(data)
														}
														themes={this.state.themes}
														invoiceSentDate={
															this.state?.invoiceSentDate
														}
														invoiceAcceptedDate={
															this.state?.invoiceAcceptedDate
														}
													/>
												</div>
											</div>
										</div>
									) : (
										''
									)}

									{this.state?.navbarMobileEdit &&
										this.state.previewType == 'm' && (
											<div
												ref={this.mCloseEditNavRef}
												className="mobile-edit-mode"
											>
												<div className="mobile-edit-mode-item">
													<EditIcon />
													<span
														onClick={() =>
															this.setState({
																showPopupInMobile: true,
																activePopupType: 'navbar',
																activePopupComponent:
																	this.state.navBar,
															})
														}
														style={{ cursor: 'pointer' }}
														className="mobile-edit-mode-item-text"
													>
														Edit Header
													</span>
												</div>
												<div className="mobile-edit-mode-item">
													{this.state.showMobileMenu ? (
														<>
															<Exit />
															<span
																onClick={(e) => {
																	this.setState({
																		showMobileMenu: false,
																	});

																	// e.stopPropagation();
																	// // Force state update to ensure toggle works consistently
																	// this.props?.handleNavbarHamburger();
																}}
																className="mobile-edit-mode-item-text"
																style={{ cursor: 'pointer' }}
															>
																Exit Navigation
															</span>
														</>
													) : (
														<>
															<HamburgerIcon />
															<span
																onClick={() => {
																	if (
																		this.state.duplicateModules
																			?.length > 1
																	) {
																		this.setState({
																			showMobileMenu: true,
																		});
																	}
																}}
																className="mobile-edit-mode-item-text"
																style={{
																	cursor: 'pointer',
																	color:
																		this.state.duplicateModules
																			?.length > 1
																			? '#F1F2F3'
																			: '#404548',
																}}
															>
																Edit Navigation
															</span>
														</>
													)}
												</div>
											</div>
										)}

									{this.state?.previewType == 'm' &&
										this.state?.showPopupInMobile && (
											<ElementSidebar
												ref={this.elementPopupRef}
												activeType={this.state?.activePopupType}
												elementEndPosition={{ x: 950, y: 150 }}
												activePopupComponent={
													this.state?.activePopupType == 'navbar' ||
													this.state?.activePopupType ==
														'mNavbarHamburger' ||
													this.state?.activePopupType == 'mNavbarCart' ||
													this.state?.activePopupType == 'navImage'
														? this.state?.navBar
														: this.state?.activePopupComponent
												}
												showPopupInMobile={this.state?.showPopupInMobile}
												brandColors={this.state?.brandColors}
												isWorkflow={this.state?.isWorkflow}
												modules={this.state?.modules}
												module={this.state?.module}
												activeWorkflowModuleId={
													this.state?.activeWorkflowModuleId
												}
												activeModuleId={this.state?.activeModuleId}
												previewType={this.state?.previewType}
												activeSectionID={this.state?.activeSectionID}
												activeModuleSections={
													this.state?.activeModuleSections
												}
												handleFonts={(e, f) => ''}
												getModuleSections={(e) => this.getModuleSections(e)}
												setActiveImageSettings={(value) =>
													this.setActiveMPopupImageSettings(value)
												}
												setActivePopupComponent={(value) => {
													this.state?.activePopupType == 'navbar' ||
													this.state?.activePopupType ==
														'mNavbarHamburger' ||
													this.state?.activePopupType == 'mNavbarCart' ||
													this.state?.activePopupType == 'navImage'
														? this.handleNavbarUpdate(value)
														: this.setActiveMPopupComponent(value);
												}}
												setModalRef={(e) => {
													this.setState({
														showMPopupImageModal: e,
													});
												}}
												// !for text popup
												changeFontColor={(e, f) => this.handleFonts(e, f)}
												fonts={this.state.fonts}
												fontFamily={this.state.fontFamily}
												fontSize={this.state.fontSize}
												justifyleft={this.state.justifyleft}
												justifyright={this.state.justifyright}
												justifycenter={this.state.justifycenter}
												justifyfull={this.state.justifyfull}
												lineHeight={this.state.lineHeight}
												letterSpacing={this.state.letterSpacing}
												// ! for card popup
												handleCardPopupProps={this.handleCardPopupProps}
												// ! debouncing for element props
												handleElementDebounceSave={
													this.handleElementDebounceSave
												}
												isMobileNavbar={
													this.state.activePopupType == 'navbar' ||
													this.state.activePopupType == 'navImage'
														? true
														: false
												}
												handleVerticleAlign={(e, f) =>
													this.handleVerticleAlign(e, f)
												}
											/>
										)}
									<div
										className={`hwb_left ${
											(this.state.preview &&
												(this.state.previewType === 'm' ||
													this.state.previewType === 'ml')) ||
											this.state.previewMode === 'm' ||
											this.state.previewMode === 'ml'
												? 'hwb_left-mobile'
												: ''
										}`}
										ref={this.componentRef}
										style={{
											width:
												this.state.previewType === 'm' ||
												this.state.previewType === 'ml'
													? '420px'
													: this.state?.activeModule?.showType == 'a4' &&
													  this.state?.activeModule?.showAsA4
													? '780px'
													: '',
											boxShadow: this.state?.activeModule?.showAsA4
												? `
											-93px 163px 53px 0px rgba(0, 0, 0, 0),
											-59px 104px 48px 0px rgba(0, 0, 0, 0.01),
											-33px 59px 41px 0px rgba(0, 0, 0, 0.05),
											-15px 26px 30px 0px rgba(0, 0, 0, 0.09),
											-4px 7px 17px 0px rgba(0, 0, 0, 0.1)
										`
												: '',
										}}
									>
										{this.state.preview &&
										this.state.client == false &&
										this.state.previewType === 'ml' ? (
											<div className="hw_top hw_top_preview">
												Lock this preview for mobile view{' '}
												<span
													style={{
														cursor: 'pointer',
														color: '#fff',
														padding: '9px 12px',
														borderRadius: '4px',
														background: '#6055ec',
													}}
													onClick={() => this.handleLockPreview()}
												>
													{this.state.mobileViewLocked
														? 'Unlock'
														: 'Lock'}
												</span>
												{/* {this.state.mobileViewLocked ? <  Locked/> :<Unclocked/>} */}
											</div>
										) : (
											''
										)}
										{_.size(this.state.sections) == 0 &&
										(this.state.module === 'proposal' ||
											this.state.module === '*') ? (
											<div className="empty_builder">
												<span
													onClick={(e) =>
														this.handleAddLayout(null, true)
													}
													style={{ cursor: 'pointer' }}
													title="Add Card"
												>
													<AddBlock />
												</span>
												<p>We're waiting for your next masterpiece</p>
												<a
													onClick={() =>
														this.setState({
															showAddBlock: true,
															showSideBar: false,
															nextOrder: 0,
															prevOrder: 0,
															order: 0,
														})
													}
												>
													Add layout
												</a>
											</div>
										) : (
											<Builder
												triggerAdjustGridAreas={
													this.state.triggerAdjustGridAreas
												}
												suppressWarning={this.state.isPublishing}
												fluidGrid={() => this.fluidGrid()}
												fluidShowGrid={this.state.fluidShowGrid}
												invoiceTables={this.state.invoiceTables}
												isWorkflow={this.state.isWorkflow}
												previewMode={this.state.previewMode}
												handleAddElement={(e, zindexValues, order) =>
													this.handleAddSubBlock(
														e.text,
														zindexValues,
														order,
													)
												}
												setLastClick={(e) =>
													this.setState({ clickGridArea: e })
												}
												handleSaveblocks={(e, sectionID, layoutHeight) =>
													this.handleSaveblocks(
														e,
														sectionID,
														layoutHeight,
													)
												}
												handleSaveSingleBlock={this.handleSaveSingleBlock}
												setElementPosition={(id, x, y) =>
													this.handleSetElementPosition(id, x, y)
												}
												setTriggerFont={(e) =>
													this.setState({ triggerFont: e })
												}
												setTriggeredFont={(e) =>
													this.setState({
														triggeredFont: e,
													})
												}
												uploadImageBase64={(e) =>
													this.setState({
														base64: e,
														uploadAIImage: true,
													})
												}
												generateAIImages={(e) => this.generateAIImages(e)}
												generateAIText={(e) => this.generateAIText(e)}
												clearFontStyles={() =>
													this.setState({
														justifycenter: false,
														justifyleft: false,
														justifyright: false,
														justifyfull: false,
														actionType: null,
														actionValue: null,
													})
												}
												module={this.state.module}
												client={this.state.client}
												deleteFQBlock={(blockID, sectionID) =>
													this.state.isWorkflow
														? this.handleWorkflowDeleteBlock(
																blockID,
																sectionID,
														  )
														: this.handleDeleteBlock(blockID, sectionID)
												}
												handleOpenSideBar={(
													e,
													_id,
													service = false,
													isFluid = false,
												) => {
													if (this.state.preview !== true) {
														this.setState({
															showSideBar: isFluid
																? false
																: _.has(e, 'showSidebar')
																? false
																: true,
															// !this.state.showSideBar,
															activeSectionID: _id,
															isServiceBlock: service,
															showAddBlock: false,
															isFluidLayout: isFluid,
														});
													} else {
														this.setState({
															showSideBar: isFluid ? false : true,
															// showSideBar: true,
															isServiceBlock: service,
															isFluidLayout: isFluid,
														});
													}
												}}
												handleCloseSideBar={() => {
													this.setState({
														showSideBar: false,
													});
												}}
												activeFontColor={this.state.activeFontColor}
												actionType={this.state.actionType}
												actionValue={this.state.actionValue}
												triggerFont={this.state.triggerFont}
												triggeredFont={this.state.triggeredFont}
												handleHSelection={(e, activeTextBlock) =>
													this.state.client == true
														? ''
														: this.handleFontStyles(e, activeTextBlock)
												}
												crop={this.state.crop}
												zoom={this.state.zoom}
												sections={this.state.sections}
												isFormV1={this.state.sections.every(
													(section) => section.type === 'form-v1',
												)}
												activeSectionID={this.state.activeSectionID}
												activeTextBlock={this.state.activeTextBlock}
												handledeleteSection={(e) => this.deleteSection(e)}
												handleSetSubBlockContent={(
													content,
													sectionID,
													blockID,
													id,
													mContent = false,
													sectionId = null,
												) =>
													this.saveSubBlockContent(
														content,
														sectionID,
														blockID,
														id,
														mContent,
														sectionId,
													)
												}
												handleSetBlockContent={(
													content,
													sectionID,
													blockID,
												) =>
													this.saveBlockContent(
														content,
														sectionID,
														blockID,
													)
												}
												preview={this.state.preview}
												previewType={this.state.previewType}
												handleActiveImage={(
													sectionID,
													blockID,
													subBlockID,
													imageURL,
													dimensions = null,
													ImgSubBlock,
													isFluid = null,
												) => [
													this.activeImage(
														sectionID,
														blockID,
														subBlockID,
														imageURL,
														dimensions,
														ImgSubBlock,
													),
													isFluid
														? this.setState({ showSideBar: true })
														: '',
												]}
												setSections={(e, restrict = null) =>
													this.setState({ sections: e }, () => {
														this.handleSaveSections(
															restrict,
															this.state.module === 'form' &&
																this.state.isHeader,
															'tables',
														);
													})
												}
												setActiveTab={(
													e,
													subBlockID = null,
													blockID = null,
													isFluid = null,
												) => {
													if (subBlockID !== null) {
														this.setState({
															activeSubBlockType: e,
															activeSubBlockID: subBlockID,
															activeBlockID: blockID,
														});
													} else {
														this.setState({
															activeSubBlockType: e,
														});
													}
												}}
												activeVariableID={this.state.activeVariableID}
												activeVariableName={this.state.activeVariableName}
												subBlockID={this.state.activeSubBlockID}
												handleAddServiceBlock={(e, order, services_style) =>
													this.state.isWorkflow
														? this.addWorkflowServiceTableBlock(
																e,
																order,
																services_style,
														  )
														: this.addServiceTableBlock(
																e,
																order,
																services_style,
														  )
												}
												variables={this.state.sectionVariables}
												tables={this.state.sectionTables}
												serviceSelect={(block, type, value, section) =>
													this.handleServiceSelect(
														block,
														type,
														value,
														section,
													)
												}
												contractActiveVariable={(e) =>
													this.setState({
														activeContractVariable: e,
														// activeSubBlockType: 'v',
													})
												}
												setBlockTab={(e) =>
													this.setState({
														activeSubBlockType: 'b',
													})
												}
												addFormQuestion={(sectionID, blockOrder) =>
													this.state.isWorkflow
														? this.addWorkflowQuestionForForm(
																sectionID,
																blockOrder,
														  )
														: this.addQuestionForForm(
																sectionID,
																blockOrder,
														  )
												}
												setActiveFormQuestion={(e, blockID) =>
													this.setState({
														activeSubBlockType: 'q',
														activeFormQuestion: blockID,
														showSideBar: this.state.preview
															? false
															: true,
													})
												}
												handleAddFormOption={(e) =>
													this.setFormOptionForMultipleChoice(e)
												}
												handleSetOpenNewtab={(e) =>
													this.setState({
														openInNewTab: e,
													})
												}
												tenantLogo={this.state.tenantLogo}
												setShape={(e) =>
													this.setState({
														activeShape: e,
													})
												}
												addEmptyLayout={(e) => this.emptyOrder(e)}
												handleSetButtonLink={(e) =>
													this.setState({
														buttonLink: e,
													})
												}
												setBtStyles={(e) =>
													this.setState({
														setBtStyles: e,
													})
												}
												btShape={(e) =>
													this.setState({
														btShape: e,
													})
												}
												imgSettingData={(e) =>
													this.setState({
														imgSettingData: e,
													})
												}
												setTables={(e) =>
													this.setState(
														{ sectionTables: e },
														async () => {
															setTimeout(
																() =>
																	this.handleSaveSections(
																		true,
																		this.state.module ===
																			'form' &&
																			this.state.isHeader,
																		'tables',
																	),
																300,
															);
														},
													)
												}
												selectBlock={(e) =>
													this.setState({
														activeSubBlockType: e,
													})
												}
												duplicateBlock={(e) => this.handleDuplicate(e)}
												duplicateServiceBlock={(e, f, g) =>
													this.handleDuplicateServiceBlock(e, f, g)
												}
												activeSection={this.state.activeBlock}
												setActiveSection={(e, executeSave = null) => {
													this.handleSetActiveSection(
														e,
														executeSave,
														true,
													);
												}}
												activeSubBlockId={this.state.activeSubBlockID}
												setServiceSubBlock={(e) => {
													this.setState({
														showServiceSubBlock: true,
														activeServiceSubBlock: e,
														activeSubBlockType: 's',
													});
												}}
												deleteServiceBlock={(e, f) =>
													this.state.isWorkflow
														? this.handleWorkflowDeleteBlock(e, f)
														: this.handleDeleteBlock(e, f)
												}
												setServiceBlockContent={(e, f, g, h) =>
													this.handleSetServiceBlock(e, f, g, h)
												}
												handleUpdateSectionData={
													this.handleUpdateSectionData
												}
												headerSection={this.state.headerSection}
												isHeader={this.state.isHeader}
												formBgColor={this.state.formBgColor}
												addBlock={(
													showAddBlock,
													nextOrder,
													prevOrder,
													order,
													isElement = null,
													sectionID = null,
												) => {
													this.setState(
														{
															showAddBlock: true,
															showSideBar: false,
															nextOrder,
															prevOrder,
															order,
															isElement,
														},
														() => {
															if (sectionID !== null) {
																this.setState({
																	activeSectionID: sectionID,
																});
															}
															// this.handleSaveSections();
														},
													);
												}}
												setActiveTheme={this.state.activeTheme}
												isTheme={this.state?.isTheme}
												circleTextData={(e) =>
													this.setState({
														circleTextData: e,
													})
												}
												activeAnimation={this.state.activeAnimation}
												setIsValidURL={(e) => {
													this.setState({
														isValidURL: e,
													});
												}}
												backgroundType={this.state.backgroundType}
												// backgroundImageURL={this.state.}
												backgroundVideoURL={this.state.backgroundVideoURL}
												setIsValidBgVideoURL={(e) => {
													this.setState({
														isValidBgVideoURL: e,
													});
												}}
												isTenantLogo={this.state.isTenantLogo}
												contractVariables={this.state.contractVariables}
												duplicateSubBlock={(json, subBlockId, sectionId) =>
													this.state.isWorkflow
														? this.duplicateWorkflowSubBlock(
																json,
																subBlockId,
																sectionId,
														  )
														: this.duplicateSubBlock(
																json,
																subBlockId,
																sectionId,
														  )
												}
												eventsLabel={this.state?.eventsLabel}
												paymentsLabel={this.state?.paymentsLabel}
												summaryBg={this.state?.summaryBg}
												summaryFont={this.state?.summaryFont}
												summaryFontColor={this.state?.summaryFontColor}
												summaryFontSize={this.state?.summaryFontSize}
												summaryBlock={this.state?.summaryBlock}
												paymentSchedule={this.state.paymentSchedule}
												setPaymentSchedule={(
													e,
													id = null,
													type = null,
													style = null,
												) => {
													if (type == 'invoice') {
														this.setState(
															{
																paymentSchedule: e,
															},
															() => {
																this.handleSaveSections();
															},
														);
													} else {
														// version 1
														this.HandlePaymentSchedule(e, id, style);
													}
												}}
												showSchedule={this.state.showSchedule}
												invoiceClientVariables={
													this.state.invoiceClientVariables
												}
												invoiceNumber={this.state.invoiceNumber}
												handleInvoiceNumber={(e) => {
													this.putInvoiceNumber(e);
												}}
												socialMediaLinks={this.state.socialMediaLinks}
												handleSetIconLink={(link, subBlockID, blockId) =>
													this.setIconLink(link, subBlockID, blockId)
												}
												iframeScroll={this.state.iframeScroll}
												onPresentationDragEnd={(e) =>
													this.onPresentationDragEnd(e)
												}
												activeModule={this.state.activeModule}
												activeFormQuestion={this.state.activeFormQuestion}
												handleDeleteInTable={(type, index) =>
													this.handleDeleteInTable(type, index)
												}
												handleDuplicateInTable={(type, index) =>
													this.handleDuplicateInTable(type, index)
												}
												handleAddInTable={(
													type,
													index,
													position,
													length = 0,
												) =>
													this.handleAddInTable(
														type,
														index,
														position,
														length,
													)
												}
												addPaymentScheduleBlock={(id, order) => {
													this.state?.isWorkflow
														? this.addWorkflowPaymentScheduleBlock(
																id,
																order,
														  )
														: this.addPaymentScheduleBlock(id, order);
												}}
												addEventBlock={(e, sectionID) =>
													this.addEventBlock(e, sectionID)
												}
												handleAcceptProposal={this?.handleAcceptProposal}
												globalSummaryData={this.state?.globalSummaryData}
												currencySymbol={this.state?.currencySymbol}
												getModuleInfo={(id, type) =>
													this.getModule(id, type)
												}
												globalTables={this.state.globalTables}
												globalSections={this.state.globalSections}
												invoiceDetails={this.state?.invoiceDetails}
												handleAddLayout={(e, isFluid, isService) =>
													this.handleAddLayout(e, isFluid, isService)
												}
												brandColors={this.state?.brandColors}
												modules={this.state.modules}
												getModuleSections={(e) => this.getModuleSections(e)}
												activeModuleSections={
													this.state?.activeModuleSections
												}
												activeModuleId={this.state.activeModuleId}
												activeWorkflowModuleId={
													this.state.activeWorkflowModuleId
												}
												setShowPopupInMobile={(e, type, component) => {
													this.setState({
														showPopupInMobile: e,
														activePopupType: type,
														activePopupComponent: component,
													});
												}}
												duplicateModules={this.state.duplicateModules}
												renderModules={() => this.renderModules()}
												// showEditDesignModal={this.state.showEditDesignModal}
												// editDesignModalRef={this.editDesignModalRef}
												managePages={() =>
													this.setState(
														{
															//managePages: true,
															activeSubBlockType: 'p',
															showSideBar: true,
															isFluidLayout: false,
														},
														() => {},
													)
												}
												fonts={this.state.fonts}
												fontFamily={this.state?.fontFamily}
												changeFontColor={(e, f) => this.handleFonts(e, f)}
												fontColor={this.state.fontColor}
												fontSize={this.state.fontSize}
												justifyleft={this.state.justifyleft}
												justifyright={this.state.justifyright}
												justifycenter={this.state.justifycenter}
												justifyfull={this.state.justifyfull}
												lineHeight={this.state.lineHeight}
												letterSpacing={this.state.letterSpacing}
												allSchedules={this.state.allSchedules}
												smartVariables={this.state.variables}
												paramsTemplateID={this.props.params.templateID}
												navBar={this.state.navBar}
												handleShowNavbar={this.handleNavbarUpdate}
												handleNavbarUpdate={this.handleNavbarUpdate}
												finalTotalCost={this.state.finalTotalCost}
												handleScheduleStyles={(data) =>
													this.handleScheduleStyles(data)
												}
												themes={this.state.themes}
												debounceFuncForElementProps={
													this.debounceFuncForElementProps
												}
												handleShowSmartModal={(type, editValue = '') => {
													if (type == 'create') {
														this.setState({
															showSmartFieldModal: true,
														});
													}
												}}
												setEditMobileNavFunction={(e) => {
													this.setState({
														navbarMobileEdit: e,
														// mobileNavbarHover: false,
													});
												}}
												navbarMobileEdit={this.state.navbarMobileEdit}
												showMobileMenu={this.state.showMobileMenu}
												mobileNavbarEdit={this.state.mobileNavbarEdit}
												handleDeleteVariable={(e) =>
													this.handleDeleteVariable(e)
												}
												handleEditVariable={(field) => {
													this.setState({
														showSmartFieldModal: true,
														smartFieldName: field.displayName,
														smartFieldValue: field.defaultValue,
														selectedSmartOption: field.inputType,
														isEditSmartFeild: true,
														activeSmartFieldData: field,
													});
												}}
												handleVerticleAlign={(e, f) =>
													this.handleVerticleAlign(e, f)
												}
												addManualInvoiceBlock={(id, order) => {
													this.addManualInvoiceBlock(id, order);
												}}
												updateTablesForTaxes={this?.updateTablesForTaxes}
												//for actionblock
												setServiceTable={(e, value) => {
													this.setServiceTableSection(e, value);
												}}
												setAdjustGridAreas={() => {
													this.handleTriggerAdjustGridAreas();
												}}
												invoiceSentDate={this.state?.invoiceSentDate}
												invoiceAcceptedDate={
													this.state?.invoiceAcceptedDate
												}
											/>
										)}

										{this.state?.showAnimationPopup && (
											<div
												className="anime-hw-popup"
												ref={this.animationPopupRef}
											>
												<div className="anime-hw-popup-header">
													<span>
														{this.state?.activeElementAnimeType ||
															'Hover'}
													</span>
												</div>
												<div className="anime-hw-popup-content">
													{this.state?.activeElementAnimeType ==
													'loop' ? (
														<LoopPopup
															activeElementAnimeName={
																this.state?.activeElementAnimeName
															}
															handleElementAnimationsValue={(e) =>
																this.handleElementAnimationsValue(e)
															}
															activeElementAnimeType={
																this.state?.activeElementAnimeType
															}
														/>
													) : (
														<HoverPopup
															activeElementAnimeName={
																this.state?.activeElementAnimeName
															}
															handleElementAnimationsValue={(e) =>
																this.handleElementAnimationsValue(e)
															}
															activeElementAnimeType={
																this.state?.activeElementAnimeType
															}
														/>
													)}
												</div>
												<div className="anime-hw-popup-footer">
													<span>Adjust Animation</span>
												</div>
											</div>
										)}
									</div>
									{this.state.preview || this.state.isFluidLayout ? (
										''
									) : (
										<div
											className={`hwb_right ${
												this.state.showSideBar && !this.state.isFluidLayout
													? ''
													: 'hwb_right_no_padding'
											}`}
										>
											<Sidebar
												workflowTemplateID={this.state.workflowTemplateID}
												activeModule={this.state.activeModule}
												socialMediaLinks={this.state.socialMediaLinks}
												getModuleInfo={(id, type) =>
													this.getModule(id, type)
												}
												template={this.state.template}
												fluidShowGrid={(e) =>
													this.setState({ fluidShowGrid: true })
												}
												isWorkflow={this.state.isWorkflow}
												duplicateModules={this.state.duplicateModules}
												handleSaveSections={this.handleSaveSections}
												base64={this.state.base64}
												uploadAIImage={this.state.uploadAIImage}
												handleClose={(e) => {
													this.handleCloseSideBar(e);
												}}
												changeFontColor={(e, f) => this.handleFonts(e, f)}
												fontColor={this.state.fontColor}
												fontSize={this.state.fontSize}
												fontFamily={this.state.fontFamily}
												justifyleft={this.state.justifyleft}
												justifyright={this.state.justifyright}
												justifycenter={this.state.justifycenter}
												justifyfull={this.state.justifyfull}
												lineHeight={this.state.lineHeight}
												letterSpacing={this.state.letterSpacing}
												crop={this.state.crop}
												zoom={this.state.zoom}
												setCrop={(crop, zoom) =>
													this.handleSetImageSettings(crop, zoom)
												}
												setZoom={(crop, zoom, isTrigger = false) =>
													this.handleSetImageSettings(
														crop,
														zoom,
														isTrigger,
													)
												}
												activeSectionID={this.state.activeSectionID}
												setBlockPadding={(e) =>
													this.handleBlockStyles(e, 'padding')
												}
												setHorizontalPadding={(e) =>
													this.handleBlockStyles(e, 'paddingHorizontal')
												}
												eventsLabel={this.state?.eventsLabel}
												setSummaryLabel={(e, type) => {
													this.handleSummaryLabel(e, type);
												}}
												// eventsLabel={this.state?.eventsLabel}
												paymentsLabel={this.state?.paymentsLabel}
												summaryFont={this.state?.summaryFont}
												summaryFontSize={this.state?.summaryFontSize}
												summaryFontColor={this.state?.summaryFontColor}
												summaryBg={this.state?.summaryBg}
												setSummaryStyles={(e, type, version = null) => {
													this.handleSummaryStyles(e, type, version);
												}}
												setBlockBg={(e) =>
													this.handleBlockStyles(
														e,
														'sectionBackgroundColor',
													)
												}
												titleBackgroundColor={(e) =>
													this.handleBlockStyles(
														e,
														'titleBackgroundColor',
													)
												}
												padding={this.state.activeSectionPadding}
												bg={this.state.activeSectionBg}
												activeBlockID={this.state.activeBlockID}
												activeSubBlockID={this.state.activeSubBlockID}
												activeImageURL={this.state.activeImageURL}
												activeSubBlockType={this.state.activeSubBlockType}
												removeImage={(e) => this.handleRemoveImage(e)}
												setImage={(e, p = null) =>
													this.handleSetImage(e, p)
												}
												isServiceBlock={this.state.isServiceBlock}
												serviceBlockFalse={() =>
													this.setState({
														isServiceBlock: false,
													})
												}
												selection_is_required={
													this.state.selection_is_required
												}
												services_selection={this.state.services_selection}
												services_style={this.state.services_style}
												setServiceTable={(e, value) => {
													this.setServiceTableSection(e, value);
												}}
												addVariable={(id, value) =>
													this.handleAddVariable(id, value)
												}
												hasImageBlock={this.state.hasImageBlock}
												variables={this.state.variables}
												activeContractVariable={
													this.state.activeContractVariable
												}
												module={this.state.module}
												sectionVariables={this.state.sectionVariables}
												setSectionVariables={(
													sectionVariables,
													activeContractVariable,
												) => {
													this.setState(
														{
															sectionVariables,
															activeContractVariable,
														},
														() => {
															setTimeout(() => {
																this.handleSaveSections(
																	true,
																	null,
																	null,
																);
															}, 600);
														},
													);
												}}
												activeFormQuestion={this.state.activeFormQuestion}
												setActiveTab={(e) =>
													this.setState(
														{
															activeSubBlockType: e,
														},
														() => {
															//
														},
													)
												}
												activeFormBlock={this.returnActiveFormBlock()}
												setActiveQuestionIsRequired={(e) =>
													this.handleSetOptionsForFormQuestion(
														e,
														'isRequired',
													)
												}
												setActiveQuestionIsMultiple={(e) =>
													this.handleSetOptionsForFormQuestion(
														e,
														'isMultiple',
													)
												}
												setActiveQuestionVariable={(e) =>
													this.handleSetOptionsForFormQuestion(
														e,
														'variableId',
													)
												}
												setActiveQuestionType={(e) =>
													this.handleSetOptionsForFormQuestion(e, 'type')
												}
												activeSection={this.state.activeBlock}
												setActiveSection={(e) =>
													this.handleSetActiveSection(e)
												}
												activeShape={this.state.activeShape}
												setActiveShape={(e, sid) =>
													this.handleActiveShape(e, sid)
												}
												hasButton={this.state.hasButton}
												buttonLink={this.state.buttonLink}
												setButtonLink={(e) => this.handleButtonLink(e)}
												openNewTabfn={(e) => this.handleOpenNewTab(e)}
												openNewTab={this.state.openInNewTab}
												buttonStyle={this.state.setBtStyles}
												btShape={this.state.btShape}
												setButtonShape={(e) => this.handleButtonShape(e)}
												setButtonStyles={(e) => this.handleButtonStyles(e)}
												hasShape={this.state.hasShape}
												imgSettingData={this.state.imgSettingData}
												showServiceSubBlock={this.state.showServiceSubBlock}
												activeServiceSubBlock={
													this.state.activeServiceSubBlock
												}
												isAutoSaving={this.state.isAutoSaving}
												setImageWidth={(crop, zoom, imageWidth) =>
													this.handleImageWidth(crop, zoom, imageWidth)
												}
												headerSection={this.state?.headerSection}
												isHeader={this.state.isHeader}
												tenantLogo={this.state.tenantLogo}
												formBgColor={this.state.formBgColor}
												setHeader={(e, value) => this.setHeader(e, value)}
												setActiveTable={(e, f, g, h) =>
													this.handleSetTable(e, f, g, h)
												}
												contentAlign={this.state.contentAlign}
												setContent={(e) => this.setContent(e)}
												hasIcon={this.state.hasIcon}
												hasSticker={this.state.hasSticker}
												blockBorder={this.state.blockBorder}
												device={this.state.device}
												setImageShapes={(e) => this.setImageShapes(e)}
												setDeviceTypes={(e) => this.setDeviceTypes(e)}
												activeModuleId={this.state.activeModuleId}
												isTheme={this.state?.isTheme}
												activeTheme={this.state?.activeTheme}
												setTheme={(e, value) =>
													this.handleActiveTheme(e, value)
												}
												paddingHorizontal={this.state.paddingHorizontal}
												activeAnimation={this.state.activeAnimation}
												selectedFont={this.state.selectedFont}
												fonts={this.state.fonts}
												currentIconColor={this.state.currentIconColor}
												setFooterIconColor={(e) =>
													this.setState({
														currentIconColor: e,
													})
												}
												currentSizeIcons={this.state.currentSizeIcons}
												setFooterIconSize={(e) => {
													this.setState({
														currentSizeIcons: e,
													});
												}}
												currentIconType={this.state.currentIconType}
												setFooterIcontype={(e) => {
													this.setState({
														currentIconType: e,
													});
												}}
												currentIconBgColor={this.state.currentIconBgColor}
												setFooterIconBgColor={(e) =>
													this.setState({
														currentIconBgColor: e,
													})
												}
												hasListIcon={this.state.hasListIcon}
												listIconColor={this.state.listIconColor}
												setlistIconColor={(e) =>
													this.setState({
														listIconColor: e,
													})
												}
												listIconSize={this.state.listIconSize}
												setlistIconSize={(e) => {
													this.setState({
														listIconSize: e,
													});
												}}
												listIconShape={this.state.listIconShape}
												setlistIconShape={(e) => {
													this.setState({
														listIconShape: e,
													});
												}}
												hasCircleText={this.state.hasCircleText}
												currentSticker={this.state.currentSticker}
												setCurrentSticker={(e) => {
													this.setState({
														currentSticker: e,
													});
												}}
												circleTextData={this.state.circleTextData}
												setCircleTextData={(e) =>
													this.setState({
														circleTextData: e,
													})
												}
												setActiveAnimation={(e) =>
													this.handleBlockStyles(e, 'isAnimation')
												}
												setAnimationType={(e) =>
													this.handleBlockStyles(e, 'animationType')
												}
												animationType={this.state.animationType}
												setAnimationDirection={(e) =>
													this.handleBlockStyles(e, 'animationDirection')
												}
												animationDirection={this.state.animationDirection}
												handleAnimationSpeed={(e) =>
													this.handleBlockStyles(e, 'animationSpeed')
												}
												animationSpeed={this.state.animationSpeed}
												logoStickerFill={this.state.logoStickerFill}
												setlogoStickerFill={(e) =>
													this.setState({
														logoStickerFill: e,
													})
												}
												isLogo={this.state.isLogo}
												videoURL={this.state.videoURL}
												setVideoURL={(e) =>
													this.setState({
														videoURL: e,
													})
												}
												loop={this.state.loop}
												setLoop={(e) =>
													this.setState({
														loop: e,
													})
												}
												alignVideoBlock={this.state.alignVideoBlock}
												setAlignVideoBlock={(e) =>
													this.setState({
														alignVideoBlock: e,
													})
												}
												fillVideoBlock={this.state.fillVideoBlock}
												setFillVideoBlock={(e) =>
													this.setState({
														fillVideoBlock: e,
													})
												}
												autoplay={this.state.autoplay}
												setAutoPlay={(e) =>
													this.setState({
														autoplay: e,
													})
												}
												isValidURL={this.state.isValidURL}
												backgroundType={this.state.backgroundType}
												setBgType={(e) =>
													this.setState({
														backgroundType: e,
													})
												}
												backgroundImageURl={this.state.backgroundImageURL}
												setBgImageURL={(e) =>
													this.setState({
														backgroundImageURL: e,
													})
												}
												backgroundVideoURL={this.state.backgroundVideoURL}
												setBgVideoURL={(e) =>
													this.setState({
														backgroundVideoURL: e,
													})
												}
												isValidBgVideoURL={this.state.isValidBgVideoURL}
												hasLogoSticker={this.state.hasLogoSticker}
												isTenantLogo={this.state.isTenantLogo}
												contractVariables={this.state.contractVariables}
												noPadding={this.state.noPadding}
												setImgOverlay={(type, value) => {
													this.handleImgOverlay(type, value);
												}}
												ImgOverlayColor={this.state?.ImgOverlayColor}
												ImgOverlayOpacity={this.state?.ImgOverlayOpacity}
												activeImageSubBlock={this.state.activeImageSubBlock}
												innerPadding={this.state.innerPadding}
												scrollStyles={this.state?.scrollStyles}
												setScrollStyles={(e) => {
													this.setState({
														scrollStyles: e,
													});
												}}
												fontStyles={this.state?.fontStyles}
												setFontStyles={(e) => {
													this.setState({
														fontStyles: e,
													});
												}}
												scrollText={this.state?.scrollText}
												setScrollText={(e) =>
													this.setState({
														scrollText: e,
													})
												}
												hasScrollText={this.state?.hasScrollText}
												itemSpacing={this.state?.itemSpacing}
												setItemSpacing={(e) =>
													this.setState({
														itemSpacing: e,
													})
												}
												scrollSymbol={this.state.scrollSymbol}
												setScrollSymbol={(e) =>
													this.setState({
														scrollSymbol: e,
													})
												}
												hasIframe={this.state?.hasIframe}
												source={this.state?.source}
												setSource={(e) =>
													this.setState({
														source: e,
													})
												}
												showSchedule={this.state.showSchedule}
												setShowSchedule={(e) =>
													this.setState({
														showSchedule: e,
													})
												}
												hasJourney={this.state?.hasJourney}
												cardColor={this.state?.cardColor}
												setCardColor={(type, e, ActiveBId) =>
													this.handleCardColor(type, e, ActiveBId)
												}
												setJIconProps={(type, e, ActiveBId) => {
													this.handleJIconProps(type, e, ActiveBId);
												}}
												largeIcon={this.state?.largeIcon}
												brandColors={this.state?.brandColors}
												addBrandColors={(e) => this.handleBrandColors(e)}
												fieldData={this.state.fieldData}
												// onFieldDataUpdate={this.handleFieldDataUpdate}
												onFieldDataUpdate={(updatedFields) =>
													this.setState({ fieldData: updatedFields })
												}
												postVariables={(json) =>
													this.postVariables(
														json,
														this.props.params.templateID,
													)
												}
												updateVariables={(json) =>
													this.updateVariables(
														json,
														this.props.params.templateID,
													)
												}
												deleteVariables={(json) =>
													this.deleteVariables(
														this.props.params.templateID,
													)
												}
												activeWorkflowModuleId={
													this.state.activeWorkflowModuleId
												}
												postIndividulVariables={(json) =>
													this.handlePostIndividulVariables(json)
												}
												setiframeScroll={(value) => {
													this.setState({
														iframeScroll: value,
													});
												}}
												iframeScroll={this.state.iframeScroll}
												handleDeleteInTable={(type, index, position) =>
													this.handleDeleteInTable(type, index, position)
												}
												handleAddInTable={(
													type,
													index,
													position,
													length = 0,
												) =>
													this.handleAddInTable(
														type,
														index,
														position,
														length,
													)
												}
												onDragEnd={(e) => this.onDragEnd(e)}
												putModules={(e) => this.putModules(e, true)}
												copyModule={(e, order) => this.copyModule(e, order)}
												deleteModule={(e) => this.deleteModule(e)}
												addPage={(e) => this.addPage(e)}
												getTemplateList={(e, page) =>
													this.getTemplatelistData(e, page)
												}
												templateList={this.state.templateList}
												modules={this.state.modules}
												sections={this.state.sections}
												getModuleSections={(id) =>
													this.getModuleSections(id)
												}
												activeModuleSections={
													this.state.activeModuleSections
												}
												editingWorflow={this.props?.editingWorflow}
												activeBackgroundWidth={
													this.state.activeBackgroundWidth
												}
												sethandleBackgroundWidth={(e) =>
													this.handleBackgroundWidth(e)
												}
												setActiveModule={(e) =>
													this.setState({
														activeModule: e,
														preview: true,
													})
												}
												activeElementAnimeType={
													this.state?.activeElementAnimeType
												}
												handleElementAnimationsType={(e, sid) =>
													this.handleElementAnimationsType(e, sid)
												}
												handleRemoveElementAnimations={(sid) =>
													this.handleRemoveElementAnimations(sid)
												}
												handleAddBlankPage={() => this.handleAddBlankPage()}
												workflow_id={this.state.workflow_id}
												managePages={(e) => this.props.managePages(e)}
												navBar={this.state.navBar}
												handleShowNavbarA={this.handleShowNavbarToggle}
												setCloseSidebar={(e) =>
													this.setState({
														showSideBar: e,
														preview: false,
													})
												}
											/>
										</div>
									)}
									{this.state.preview ? (
										''
									) : this.state.module === 'proposal' ||
									  this.state.module === '*' ? (
										<div
											className={`hwb_r ${
												this.state.showAddBlock ? '' : 'hwb_r_no_padding'
											}`}
											ref={this.addBlockRef}
										>
											<AddBlockV2
												handleAddLayout={(
													e,
													isFluid,
													isService,
													isInvoice,
													isScheduler,
												) =>
													this.handleAddLayout(
														e,
														isFluid,
														isService,
														isInvoice,
														isScheduler,
													)
												}
												handleAddSubBlock={(text) =>
													this.handleAddSubBlock(text)
												}
												isElement={this.state.isElement}
												template={this.state.template}
												isFormTemplate={this.state.isFormTemplate}
											/>
										</div>
									) : (
										''
									)}

									{this.state.preview ? (
										''
									) : this.state.managePages ? (
										<div>
											<Modal
												show={this.state.managePages}
												handleClose={(e) =>
													this.setState({
														managePages: false,
													})
												}
												modalType={'center'}
											>
												<div
													style={{
														display: 'flex',
														background: '#333',
														borderRadius: 16,
													}}
												>
													<ManagePages
														modules={this.state.duplicateModules}
														onDragEnd={(e) => this.onDragEnd(e)}
														putModules={(e) => this.putModules(e)}
													/>
												</div>
											</Modal>
										</div>
									) : (
										''
									)}

									{/* for smartfields  */}
									{this.state.showSmartFieldModal ? (
										<div ref={this.blockRef}>
											<Modal
												show={this.state.showSmartFieldModal}
												handleClose={(e) => {
													this.handleSmartFieldModalClose(e);
												}}
												modalType={'center'}
											>
												<div className="create-smart-field-container">
													<div className="create-smart-field-header">
														{this?.state?.isEditSmartFeild ? (
															<p>Edit Smart Field</p>
														) : (
															<p>Create Smart Field</p>
														)}
														<Close
															style={{
																width: '30px',
																height: '30px',
																cursor: 'pointer',
															}}
															onClick={
																this.handleSmartFieldModalClose
															}
														/>
													</div>
													<div className="create-smart-field-body">
														<div>
															<p>Name</p>
															<input
																type="text"
																placeholder="Enter name"
																value={this.state?.smartFieldName}
																onChange={(e) => {
																	this.setState({
																		smartFieldName:
																			e.target.value,
																	});
																}}
															/>
														</div>
														<div className="dropdown-container">
															<p>Type</p>
															<div
																className="dropdown"
																onClick={() => {
																	this.setState({
																		isSmartFieldsOpen:
																			!this.state
																				?.isSmartFieldsOpen,
																	});
																}}
															>
																{this.state?.selectedSmartOption ? (
																	<p>
																		{
																			this.state
																				?.selectedSmartOption
																		}
																	</p>
																) : (
																	<p style={{ color: '#999999' }}>
																		Select an option
																	</p>
																)}
																<DropDown />
															</div>

															{this.state?.isSmartFieldsOpen && (
																<div className="dropdown-options-container">
																	{SmartFeildOptions?.map(
																		(option) => (
																			<div
																				key={option.value}
																				className="dropdown-option"
																				onClick={() => {
																					this.setState({
																						selectedSmartOption:
																							option?.value,
																						isSmartFieldsOpen: false,
																					});
																				}}
																			>
																				<div>
																					{option.image}
																				</div>
																				<p className="options">
																					{option.label}
																				</p>
																			</div>
																		),
																	)}
																</div>
															)}
														</div>
														<div>
															<p>Default Value</p>
															<input
																type={
																	this.state?.selectedSmartOption
																}
																placeholder="Enter value"
																value={this.state?.smartFieldValue}
																onChange={(e) => {
																	this.setState({
																		smartFieldValue:
																			e.target.value,
																	});
																}}
															/>
														</div>
													</div>
													<div className="create-smart-field-footer">
														{this.state?.isEditSmartFeild ? (
															<p
																onClick={(e) => {
																	e.stopPropagation();
																	this.editSmartFields();
																}}
															>
																Edit field
															</p>
														) : (
															<p
																onClick={(e) => {
																	e.stopPropagation();
																	this.handleCreateNewSmartField();
																}}
															>
																Create field
															</p>
														)}
													</div>
												</div>
											</Modal>
										</div>
									) : (
										''
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(Home);
