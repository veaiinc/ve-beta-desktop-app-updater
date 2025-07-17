import React, { Component, createRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import Proposals from '../../controllers/proposals';
import { withRouter } from '../../services/withRouter';
import Builder from '../components/library/builder';
import _ from 'lodash';
import '../../assets/scss/home.scss';
import SmartFileSidebar from '../components/SmartFileDetails/SmartFileSidebar';
import Header from './Header/Index';
// import BottomModal from '../components/library/modals/BottomModal';
import getSymbolFromCurrency from 'currency-symbol-map';
import CreateClient from '../components/HomePopups/CreateClient';
import { message } from 'antd';
import preview from '../components/library/svgs/preview';
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

const workflowQuery = gql`
	query Query($getDetailedWorkflowInfoId: ID!) {
		workflowInfo(id: $getDetailedWorkflowInfoId)
	}
`;
const moduleWorkflowQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getWorkflowModule(id: $getModuleTemplateId, module: $module)
	}
`;

const moduleTemplateQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
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
const workflowQueryWithModules = gql`
	query Query($getWorkflowWithModulesId: ID!) {
		getWorkflowWithModules(id: $getWorkflowWithModulesId)
	}
`;
const updateIndividualWorkflowTitle = gql`
	mutation UpdateWorkflow($updateWorkflowId: ID!, $updateWorkflowInput: UpdateWorkflowInput) {
		updateWorkflow(id: $updateWorkflowId, updateWorkflowInput: $updateWorkflowInput)
	}
`;
// const queryWorkflowInfo = gql`
// 	query Query($getDetailedTemplateInfoId: ID!) {
// 		getDetailedTemplateInfo(id: $getDetailedTemplateInfoId)
// 	}
// `;

const updateHittingCount = gql`
	mutation FileSentStatus($fileSentStatusId: ID!) {
		fileSentStatus(id: $fileSentStatusId) {
			message
			__typename
		}
	}
`;

const loadingTexts = [
	'Believe in the process',
	'Your digital vision is coming to life',
	'Control what you can',
	'Hang tight! Crafting your digital masterpiece',
	'Creativity is intelligence having fun',
	'Your vision is our mission',
];

class BuilderPreview extends Proposals {
	constructor(props) {
		super(props);
		this.state = {
			showRemovableText: true,
			spanText: 'Remove this text',
			showSideBar: false,
			client: true,
			preview: true,
			isAllModulesLoading: true,
			previewType: this?.props?.editingWorflow ? 'd' : 'm',
			previewMode: this?.props?.editingWorflow ? 'd' : 'm',
			isLoading: true,
			activeModuleId: this.props.params.templateID,
			previewModuleSections: [],
			isPublicModule: false,
			iframeSendMessage: false,
			displayModules: '',
			isWorkflow: false,
			restrictClick: false,
			moduleType: '',
			singleTemplatePreview: false,
			showSmartFileSidebar: this.props.showSmartFileSideBar || false,
			customDomain: '',
			currencySymbol: '',
			updateClient: false,
			clientListArray: [],
			isSubmit: false,
			isClientVariable: false,
			activeBlockIdToScroll: null,
			customDomain: '',
			updateClient: false,
			clientListArray: [],
			isSubmit: false,
			isClientVariable: false,
			clientDetails: {},
			fetchAgain: null,
			customDomain: '',
			endUrl: '',
			expiresAt: '',
			clientDetails: {},
			customExpiryDate: '',
			mobileViewLocked: false,
			title: '',
			currencySymbol2: '',
			socialMediaLinks: {},
			themes: null,
			globalTables: [],
			clientGrandTotal: 0,
			// template_ID: null,
		};
		this.parentRef = createRef();
		this.updateClientRef = createRef();

		this.listenerCheckInterval = null;

		this.originalConsoleLog = console.log;
		// console.log = (...args) => {
		// 	this.originalConsoleLog.apply(console, args);
		// 	window.parent.postMessage(
		// 		{
		// 			type: 'CONSOLE_LOG',
		// 			message: args
		// 				.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
		// 				.join(' '),
		// 		},
		// 		window.location.hostname === 'localhost'
		// 			? 'http://localhost:8000'
		// 			: 'https://www.ve.ai',
		// 	);
		// };
	}

	stringToBoolean = (str) => {
		try {
			return JSON.parse(str?.toLowerCase());
		} catch (e) {
			return false;
		}
	};

	componentDidMount = async () => {
		window.addEventListener('message', this.handleMessage);

		this.startListenerCheck();
		await this.getWorkflowWithModules(workflowQueryWithModules, {
			getWorkflowWithModulesId: this.props.params.templateID,
		});
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const module = urlParams?.get('module') || this.state.displayModules;
		const isPublic =
			this.stringToBoolean(urlParams?.get('isPublic')) || this.state.isPublicModule;
		const restrictClick = urlParams?.get('restrictClick') || this.state.restrictClick;
		const moduleType = urlParams?.get('moduleType') || this.state.moduleType;
		const workflow = urlParams?.get('workflow') || this.state.isWorkflow;
		const singleTemplatePreview = urlParams?.get('singleTemplatePreview')?.length
			? true
			: false;

		this.startListenerCheck();
		let response = await this.getWorkflowWithModules(workflowQueryWithModules, {
			getWorkflowWithModulesId: this.props.params.templateID,
		});

		// if (response?.[1]?.data?.getWorkflowWithModules === null && workflow) {
		// 	return this.props.navigate('/not-found?messageText=workflowNotFound');
		// } else if (response?.[1]?.networkError?.result?.message === 'Invalid token.') {
		// 	return this.props.navigate('/not-found?messageText=invalidToken');
		// } else if (response?.[1]?.networkError?.result?.message === 'Workspace not found') {
		// 	return this.props.navigate('/not-found?messageText=workspaceNotFound');
		// }

		this.setState({
			displayModules: urlParams?.get('moduleType') ? this.props.params.templateID : module,
			isPublicModule: isPublic,
			restrictClick,
			moduleType,
		});

		this.setState(
			{
				isPublicModule: isPublic,
				isWorkflow: workflow,
			},
			async () => {
				if (this.state.isWorkflow) {
					// await this.getWorkflowInfo(queryWorkflowInfo, true ,null, true);
					await this.getIndividualWorkflowInfo(workflowQuery, true);
				} else if (moduleType !== '') {
					await this.getIndividualTemplate(moduleTemplateQuery, {
						getModuleTemplateId: this.props.params.templateID,
						module: '',
					});
				} else if (singleTemplatePreview) {
					await this.getIndividualTemplate(moduleTemplateQuery, {
						getModuleTemplateId: this.props.params.templateID,
						module: '',
					});
					this.setState({ singleTemplatePreview: true });
				} else {
					await this.getWorkflowInfo(query, true);
				}
			},
		);

		if (this.props?.editingWorflow) {
			let tenantsData = await this.getTenantsData();
			let currency =
				tenantsData[1]?.defaultCurrency ||
				tenantsData[1]?.locationDetails?.userCurrency ||
				tenantsData[1]?.locationDetails?.currency ||
				'INR';
			if (currency) {
				await this.getCurrencySymbol(currency);
			}
		}
		document.addEventListener('mousedown', this.handleClickOutside);
	};

	componentDidUpdate(prevProps, prevState) {
		const previewSize = _.size(this.state.previewModuleSections);
		const filteredModulesSize = _.size(
			_.filter(this.state.modules, {
				isPublic: this.state.isPublicModule,
			}),
		);

		if (previewSize === filteredModulesSize) {
			this.sendIframeReadyMessage();
		}

		if (prevState.isLoading && !this.state.isLoading) {
			this.attachClickListeners();
		}
		if (prevState.previewModuleSections !== this.state.previewModuleSections) {
			this.computeGrandTotal();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.handleMessage);
		document.removeEventListener('mousedown', this.handleClickOutside);
		// console.log = this.originalConsoleLog;
		this.stopListenerCheck();
	}
	handleClickOutside = (e) => {
		if (this.updateClientRef.current && !this.updateClientRef.current.contains(e.target)) {
			this.setState({
				updateClient: false,
			});
		}
	};

	startListenerCheck = () => {
		this.listenerCheckInterval = setInterval(this.attachClickListeners, 1000); // Check every second
	};

	stopListenerCheck = () => {
		if (this.listenerCheckInterval) {
			clearInterval(this.listenerCheckInterval);
		}
	};

	attachClickListeners = () => {
		if (this.parentRef.current) {
			const elements = this.parentRef.current.querySelectorAll(
				'span[id], input[id], span[data-id], input[data-id]',
			);
			elements.forEach((element) => {
				if (!element.hasAttribute('listener-attached')) {
					element.addEventListener('click', this.handleElementClick);
					element.setAttribute('listener-attached', 'true');
				}
			});
		} else {
		}
	};

	handleElementClick = (event) => {
		let id;
		if (event.target.tagName?.toLowerCase() === 'span') {
			id = event.target.id;
		} else if (event.target.tagName?.toLowerCase() === 'input') {
			id = event.target.getAttribute('data-id');
		}

		if (id) {
			this.handleSpanClick(id);
		} else {
			// console.log('No valid id found for clicked element');
		}
	};

	handleSpanClick = (id) => {
		let origin =
			window.location.hostname === 'localhost'
				? 'http://localhost:8000'
				: 'https://www.ve.ai';

		window.parent.postMessage(
			{
				type: 'SPAN_CLICKED',
				id: id,
			},
			origin,
		);

		if (this.props?.editingWorflow) {
			this.setState({ activeBlockIdToScroll: id });
		}
	};

	handleRemoveActiveBlockIdToScroll = () => {
		this.setState({ activeBlockIdToScroll: null });
	};

	getAllModules = async () => {
		this.setState({ isLoading: true });

		const modulePromises = _.map(this.state.modules, async (module, key) => {
			if (module.isPublic === null) module.isPublic = this.state.isPublicModule;

			if (
				(module.isPublic === this.state.isPublicModule &&
					this.state.displayModules === '') ||
				this.state.displayModules === module._id
			) {
				if (this.state.isWorkflow)
					return this.getWorkflowModuleTemplate(
						moduleWorkflowQuery,
						{
							getModuleTemplateId: module._id,
							module: module.module,
						},
						module._id,
						module.order,
					);
				else
					return this.getModuleTemplate(
						moduleQuery,
						{
							getModuleTemplateId: module._id,
							module: module.module,
						},
						module._id,
						module.order,
					);
			}
		});

		await Promise.all(modulePromises.filter(Boolean));
		this.computeGrandTotal();
	};

	replaceInput = async (id, text) => {
		let elements = document.querySelectorAll(`input[id="${id}"], input[data-id="${id}"]`);

		if (elements?.length === 0) {
			elements = document.querySelectorAll(`span[id="${id}"], span[data-id="${id}"]`);
		}

		elements.forEach((element) => {
			let updatedElement;
			if (element.tagName?.toLowerCase() === 'input') {
				const span = document.createElement('span');
				span.textContent = text;
				span.id = id;
				span.className = element.className;
				span.style.cssText = element.style.cssText;
				element.parentNode.replaceChild(span, element);
				updatedElement = span;
			} else if (element.tagName?.toLowerCase() === 'span') {
				element.textContent = text;
				updatedElement = element;
			}
		});
		this.attachClickListeners(); // Re-attach listeners after replacing elements
	};

	udpateSectionsForService = (serviceBlock) => {
		let updatedModuleSections = this.state.previewModuleSections;
		let changedSubBlockId = null;
		let changedSubBlockShow = null;

		updatedModuleSections?.forEach((module) => {
			module?.sections?.forEach((section) => {
				if (section?._id === serviceBlock?._id) {
					section?.blocks?.forEach((block, blockIndex) => {
						const serviceBlockBlock = serviceBlock?.blocks?.find(
							(b) => b?._id === block?._id,
						);
						if (serviceBlockBlock) {
							block?.subBlocks?.forEach((subBlock, subBlockIndex) => {
								const serviceBlockSubBlock = serviceBlockBlock?.subBlocks?.find(
									(sb) => sb?._id === subBlock?._id,
								);

								// Add null check before accessing show property
								if (
									serviceBlockSubBlock &&
									JSON.stringify(subBlock) !==
										JSON.stringify(serviceBlockSubBlock)
								) {
									changedSubBlockShow = serviceBlockSubBlock.show;
									changedSubBlockId = serviceBlockSubBlock._id;
								}
							});
						}
						if (!changedSubBlockId) {
							changedSubBlockId = serviceBlockBlock?._id;
						}
					});
					section.style = { ...(serviceBlock?.style || {}) };
				}
			});
		});

		if (changedSubBlockShow == true && changedSubBlockId) {
			this.scrollAndHighlightElement(changedSubBlockId);
		} else {
			this.scrollAndHighlightElement(serviceBlock._id);
		}
		updatedModuleSections?.map((module, index) => {
			module?.sections?.map((section, key) => {
				if (section?._id === serviceBlock?._id) {
					updatedModuleSections[index].sections[key].blocks = serviceBlock?.blocks;
				}
			});
		});

		this.setState({ previewModuleSections: updatedModuleSections }, () => {
			this.computeGrandTotal();
		});
	};

	udpateEventsTable = (updatedEventsData) => {
		let updatedModuleSections = this.state.previewModuleSections;
		let changedSubBlockId = null;

		Object?.entries(updatedEventsData)?.forEach(([moduleType, events]) => {
			events?.forEach((event) => {
				event?.values?.forEach((value) => {
					const matchingModule = updatedModuleSections?.find((module) =>
						module?.tables?.some((table) => table?._id === event?._id),
					);

					if (matchingModule) {
						const matchingTable = matchingModule?.tables?.find(
							(table) => table?._id === event?._id,
						);
						if (matchingTable) {
							const matchingValue = matchingTable?.values?.find(
								(v) => v?.subBlockId === value?.subBlockId,
							);
							if (
								matchingValue &&
								JSON.stringify(matchingValue) !== JSON.stringify(value)
							) {
								changedSubBlockId = value?.subBlockId;
							}
						}
					}
				});
			});
		});

		this.scrollAndHighlightElement(changedSubBlockId);

		updatedModuleSections?.map((module, index) => {
			module?.tables?.map((table, key) => {
				if (table?.type === 'events') {
					Object?.entries(updatedEventsData)?.forEach(([moduleType, events]) => {
						events?.forEach((event) => {
							if (table?._id === event?._id) {
								updatedModuleSections[index].tables[key] = event;
							}
						});
					});
				}
			});
		});

		this.setState({ previewModuleSections: updatedModuleSections }, () => {
			this.computeGrandTotal();
		});
	};

	scrollAndHighlightElement = (id) => {
		let element = document.getElementById(id);
		if (!element) {
			element = document.querySelector(`[data-id="${id}"]`);
		}

		if (!element) {
			return;
		}

		element.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'nearest',
		});
	};

	handleMessage = (event) => {
		let origin =
			window.location.hostname === 'localhost'
				? 'http://localhost:8000'
				: 'https://www.ve.ai';

		if (event.origin !== origin) {
			return;
		}

		if (event.data.type === 'REPLACE_TEXT_ARRAY') {
			// console.log('event?.data?.textArray', event?.data?.textArray);
			this.handleReplaceMultipleInput(event?.data?.textArray);
		}

		if (event.data.type === 'REPLACE_TEXT') {
			this.replaceInput(event.data.id, event.data.text);
		}
		if (event.data.type === 'SCROLL_TO_ELEMENT') {
			this.scrollAndHighlightElement(event.data.id);
		}

		if (event.data.type === 'SERVICE_TABLE_DATA') {
			this.udpateSectionsForService(event?.data?.serviceBlock);
		}

		if (event.data.type === 'EVENTS_TABLE_DATA') {
			// console.log('event?.data?.serviceBlock', event?.data?.eventsTable, event?.data);
			this.udpateEventsTable(event?.data?.eventsTable);
		}
	};

	handleReplaceMultipleInput = (dataArray) => {
		for (let i = 0; i < dataArray?.length; i++) {
			this.replaceInput(
				dataArray?.[i]?._id,
				dataArray?.[i]?.value || dataArray?.[i]?.defaultValue,
			);
		}
	};

	computeGrandTotal = (sections = this.state.previewModuleSections) => {
		let total = 0;
		sections?.forEach((module) => {
			module?.sections?.forEach((section) => {
				if (section?.type === 'services') {
					const val = (section?.style?.subTotalValue + '')
						.replace(/&nbsp;/g, ' ')
						.replace(/<\/?[^>]+(>|$)/g, '')
						.replace(/"/g, '')
						.trim();
					const parsedVal = parseFloat(val);
					if (!isNaN(parsedVal)) {
						total += parsedVal;
					}
				}
			});
		});
		this.setState({ clientGrandTotal: total });
	};

	getRandomText(array) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	sendIframeReadyMessage() {
		if (!this.state.iframeSendMessage) {
			let origin =
				window.location.hostname === 'localhost'
					? 'http://localhost:8000'
					: 'https://www.ve.ai';

			window.parent.postMessage(
				{
					type: 'IFRAME_READY',
					id: 'IFRAME_READY',
				},
				origin,
			);
			this.setState({ iframeSendMessage: true });
		}
	}

	toggleSmartFileSidebar = () => {
		this.setState({
			showSmartFileSidebar: !this.state.showSmartFileSidebar,
			showSideBar: !this.state.showSideBar,
		});
	};

	getCurrencySymbol = (currencyParams = null) => {
		const currency = currencyParams || this.state.currency || 'INR';
		const symbol = getSymbolFromCurrency(currency);

		this.setState({
			currencySymbol2: symbol,
		});
		return symbol;
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
			this.setState({ fetchAgain: true });
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
			this.setState({ fetchAgain: true });
			setTimeout(() => {
				this.setState({ isSubmit: false });
			}, 1000);
		} else if (response[1].message) {
			message.error({
				content: response[1].message || 'Client Already Exists',
				duration: 3,
				key: 'client_error',
			});
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
	handleAddClientInShare = (e) => {
		this.setState({
			updateClient: true,
			// sharePopup: false,
			// isClientVariable: true,
		});
	};
	handleUpdateTitle = async (title) => {
		let response = await this.updatepublishedWorkflowPreview(updateIndividualWorkflowTitle, {
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

	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{this.props?.showHeader ? (
					<Header
						title={this.state.title}
						toggleSmartFileSidebar={this.toggleSmartFileSidebar}
						mode="preview"
						customData={{
							customDomain: this.state.customDomain,
							handleAddClientInShare: this.handleAddClientInShare,
						}}
						editingWorflow={this.props?.editingWorflow}
						handleSave={this.props?.handleSave || (() => {})}
						updateClientClassState={this.state.updateClient}
						clientDetailsClassState={this.state.clientDetails}
						expiresAt={this.state.expiresAt}
						handleCustomDays={this.handleCustomDays}
						setPreview={(e, type) =>
							this.setState({
								previewMode: e,
								previewType: e,
								preview: type,
							})
						}
						mobileViewLocked={this.state.mobileViewLocked}
						isWorkflow={this.state.isWorkflow}
						updatePublishedTemplate={this.handleUpdateTitle}
						template_ID={this.state.template_ID}
						titleName={this.state.titleName}
						handleCopyClassFunction={this.handleCopy}
					/>
				) : (
					''
				)}
				<div
					className="home_wrapper"
					ref={this.parentRef}
					style={{
						pointerEvents: this.state?.restrictClick === 'true' ? 'none' : '',
						...(this.props?.homeWrapperStyle || {}),
						width: this.state?.showSmartFileSidebar ? '60%' : '100%',
						transition: 'width 0.3s ease-in-out',
					}}
				>
					<style>{`
						.home_wrapper a:-webkit-any-link {
							color: inherit !important;
							text-decoration: none;
						}
						.home_wrapper a {
							color: inherit !important;
							text-decoration: none;
						}
					`}</style>
					{this.state.updateClient &&
						this.state.isWorkflow &&
						this.props?.editingWorflow && (
							<div ref={this.updateClientRef}>
								<CreateClient
									isSubmit={this.state.isSubmit}
									updateClient={this.state.updateClient}
									clientListArray={this.state.clientListArray}
									handleAddClient={this.handleAddClient}
									handleAddClientSubmit={(e) => this.handleAddClientSubmit(e)}
								/>
							</div>
						)}
					{(_.size(this.state.previewModuleSections) ===
						_.size(
							_.filter(this.state.modules, {
								isPublic: this.state.isPublicModule,
							}),
						) &&
						this.state.displayModules === '') ||
					(this.state.displayModules !== '' &&
						_.size(this.state.previewModuleSections) === 1) ||
					this.state.moduleType !== '' ||
					this.state?.singleTemplatePreview ||
					this.state?.isWorkflow ? (
						_.map(
							_.sortBy(this.state.previewModuleSections, ['order']),
							(module, key) => {
								if (
									this.state.displayModules === '' ||
									this.state.displayModules === module.id
								) {
									return (
										<div key={key} className="hwb_container">
											<div
												className={`hwb_wrapper hwb_wrapper_no_padding`}
												style={
													{
														// display: 'flex',
														// justifyContent: 'center',
													}
												}
											>
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
													style={{
														justifyContent:
															this.state.previewType === 'm' ||
															this.state.previewType === 'ml'
																? 'center'
																: '',
														width:
															this.state.previewType === 'm' ||
															this.state.previewType === 'ml'
																? '420px'
																: this.state?.activeModule
																		?.showType == 'a4' &&
																  this.state?.activeModule?.showAsA4
																? '780px'
																: '',
														boxShadow: this.state?.activeModule
															?.showAsA4
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
													<Builder
														clearFontStyles={() =>
															this.setState({
																justifycenter: false,
																justifyleft: false,
																justifyright: false,
																actionType: null,
																actionValue: null,
															})
														}
														previewMode={this.state.previewMode}
														previewType={this.state.previewType}
														preview={this.state.preview}
														module={module.module}
														client={this.state.client}
														deleteFQBlock={(blockID, sectionID) =>
															console.log()
														}
														handleOpenSideBar={(
															e,
															_id,
															service = false,
														) => {
															console.log();
														}}
														activeFontColor={this.state.activeFontColor}
														actionType={this.state.actionType}
														actionValue={this.state.actionValue}
														handleHSelection={(e, activeTextBlock) =>
															console.log()
														}
														crop={this.state.crop}
														zoom={this.state.zoom}
														sections={module.sections}
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
														) => console.log()}
														handleSetBlockContent={(
															content,
															sectionID,
															blockID,
														) => console.log()}
														handleActiveImage={(
															sectionID,
															blockID,
															subBlockID,
															imageURL,
														) => console.log()}
														setSections={(e) => this.setState(e)}
														setActiveTab={(
															e,
															subBlockID = null,
															blockID = null,
														) => {
															console.log();
														}}
														handleAddLayout={(
															workspaceId,
															json,
															templateID,
														) => console.log()}
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
														) => console.log()}
														variables={module?.variables}
														tables={module?.tables || []}
														tablesValuesforClient={module?.tables || []}
														serviceSelect={(
															block,
															type,
															value,
															section,
														) => console.log()}
														contractActiveVariable={(e) =>
															this.setState({
																activeContractVariable: e,
																activeSubBlockType: 'v',
															})
														}
														setBlockTab={(e) =>
															this.setState({
																activeSubBlockType: 'b',
															})
														}
														addFormQuestion={(sectionID, blockOrder) =>
															console.log()
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
														handleAddFormOption={(e) => console.log()}
														handleSetOpenNewtab={(e) => console.log()}
														tenantLogo={this.state.tenantLogo}
														setShape={(e) => console.log()}
														addEmptyLayout={(e) => console.log()}
														handleSetButtonLink={(e) => console.log()}
														setBtStyles={(e) => console.log()}
														btShape={(e) => console.log()}
														imgSettingData={(e) => console.log()}
														setTables={(e) => console.log()}
														selectBlock={(e) => console.log()}
														duplicateBlock={(e) =>
															this.handleDuplicate(e)
														}
														duplicateServiceBlock={(e, f, g) =>
															console.log()
														}
														activeSection={this.state.activeBlock}
														setActiveSection={(e, executeSave = true) =>
															console.log()
														}
														activeSubBlockId={
															this.state.activeSubBlockID
														}
														setServiceSubBlock={(e) => {
															console.log();
														}}
														deleteServiceBlock={(e, f) => console.log()}
														setServiceBlockContent={(e, f, g, h) =>
															console.log()
														}
														handleUpdateSectionData={(e) =>
															console.log()
														}
														headerSection={this.state.headerSection}
														isHeader={this.state.isHeader}
														formBgColor={this.state.formBgColor}
														addBlock={(
															showAddBlock,
															nextOrder,
															prevOrder,
															order,
														) => {
															console.log();
														}}
														setActiveTheme={this.state.activeTheme}
														isTheme={this.state?.isTheme}
														circleTextData={(e) =>
															this.setState({
																circleTextData: e,
															})
														}
														activeAnimation={this.state.activeAnimation}
														smartFilePreview={true}
														currencySymbol={this.state?.currencySymbol2}
														handleSpanClick={this?.handleSpanClick}
														editingWorflow={
															this.props?.editingWorflow || false
														}
														socialMediaLinks={
															this.state?.socialMediaLinks
														}
														currencySymbol2={
															this.state?.currencySymbol2
														}
														clientGrandTotal={
															this.state.clientGrandTotal
														}
														themes={this.state?.themes}
														globalSummaryData={
															this.state.globalSummaryData
														}
														isSummaryPreview={true}
														globalTables={this.state?.globalTables}
													/>
												</div>
											</div>
										</div>
									);
								}
							},
						)
					) : (
						<div className="hw_bottom">
							<div className="page_loading">
								<a>
									<span class="loader"></span>
									{this.getRandomText(loadingTexts)}
								</a>
							</div>
						</div>
					)}

					{this.props?.editingWorflow ? (
						<SmartFileSidebar
							showSmartFileSidebar={this.state.showSmartFileSidebar}
							closeSmartFileSidebar={this.toggleSmartFileSidebar}
							serviceBlockChanges={this.udpateSectionsForService}
							eventsBlockChanges={this.udpateEventsTable}
							variableBlockChanges={this.replaceInput}
							scrollAndHighlightElement={this.scrollAndHighlightElement}
							activeBlockIdToScroll={this.state.activeBlockIdToScroll}
							handleRemoveActiveBlockIdToScroll={
								this.handleRemoveActiveBlockIdToScroll
							}
							fetchAgain={this.state.fetchAgain}
							changeFetchAgain={(data) => this.setState({ fetchAgain: data })}
							handleReplaceMultipleInput={this.handleReplaceMultipleInput}
							previewReady={this.state.iframeSendMessage}
						/>
					) : (
						''
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(BuilderPreview);
