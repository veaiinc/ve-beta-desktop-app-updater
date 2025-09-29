import React, { Component, createRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import Proposals from '../../controllers/proposals';
import { withRouter } from '../../services/withRouter';
import Builder from '../components/library/builder';
import _ from 'lodash';
import '../../assets/scss/home.scss';
// import BottomModal from '../components/library/modals/BottomModal';
import getSymbolFromCurrency from 'currency-symbol-map';
import CreateClient from '../components/HomePopups/CreateClient';
import { message } from 'antd';
import { ReactComponent as DesktopIcon } from '../components/library/svgs/header/Desktop.svg';
import { ReactComponent as MobileIcon } from '../components/library/svgs/header/MobilePop.svg';

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

class TempBuilderPreview extends Proposals {
	constructor(props) {
		super(props);
		this.state = {
			showRemovableText: true,
			spanText: 'Remove this text',
			showSideBar: false,
			client: true,
			preview: true,
			isAllModulesLoading: true,
			previewType: props.previewType || (props.editingWorflow ? 'd' : 'm'),
			previewMode: props.previewMode || (props.editingWorflow ? 'd' : 'm'),
			isLoading: true,
			activeModuleId: this.props.workflowId || this.props.params.templateID,
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
			clientDetails: {},
			fetchAgain: null,
			endUrl: '',
			expiresAt: '',
			customExpiryDate: '',
			mobileViewLocked: false,
			title: '',
			currencySymbol2: '',
			socialMediaLinks: {},
			themes: null,
			sectionVariables: {},
			domRendered: false, // Track DOM rendering
			globalTables: [],
			clientGrandTotal: 0,
		};
		this.parentRef = createRef();
		this.updateClientRef = createRef();

		this.listenerCheckInterval = null;

		this.originalConsoleLog = console.log;
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
			getWorkflowWithModulesId: this.props.workflowId || this.props.params.templateID,
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
			getWorkflowWithModulesId: this.props.workflowId || this.props.params.templateID,
		});

		await this.getVariables(this.props.workflowId || this.props.params.templateID);
		if (this.state.variables) {
			this.setState({ variables: this.state.variables });
		}
		if (Array.isArray(this.state.previewModuleSections)) {
			const variables = this.state.variables;
			const previewModuleSectionsWithVars = this.state.previewModuleSections.map(
				(module) => ({
					...module,
					variables: variables,
				}),
			);
			this.setState({ previewModuleSections: previewModuleSectionsWithVars });
		}

		this.setState({
			displayModules: urlParams?.get('moduleType')
				? this.props.workflowId || this.props.params.templateID
				: module,
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
					await this.getIndividualWorkflowInfo(workflowQuery, true);
				} else if (moduleType !== '') {
					await this.getIndividualTemplate(moduleTemplateQuery, {
						getModuleTemplateId: this.props.workflowId || this.props.params.templateID,
						module: '',
					});
				} else if (singleTemplatePreview) {
					await this.getIndividualTemplate(moduleTemplateQuery, {
						getModuleTemplateId: this.props.workflowId || this.props.params.templateID,
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

		if (this.props.updateCallbacks) {
			this.props.updateCallbacks({
				serviceBlockChanges: this.udpateSectionsForService,
				eventsBlockChanges: this.udpateEventsTable,
				variableBlockChanges: this.replaceInput,
				scrollAndHighlightElement: this.scrollAndHighlightElement,
				handleReplaceMultipleInput: this.handleReplaceMultipleInput,
			});
		}
	};

	componentDidUpdate(prevProps, prevState) {
		// Sync previewType/previewMode from props to state
		if (
			prevProps.previewType !== this.props.previewType ||
			prevProps.previewMode !== this.props.previewMode
		) {
			this.setState({
				previewType: this.props.previewType,
				previewMode: this.props.previewMode,
			});
		}
		const previewSize = _.size(this.state.previewModuleSections);
		const filteredModulesSize = _.size(
			_.filter(this.state.modules, {
				isPublic: this.state.isPublicModule,
			}),
		);

		if (previewSize === filteredModulesSize && !this.state.domRendered) {
			this.sendIframeReadyMessage();
			this.setState({ domRendered: true }, () => {
				if (this.props.onDomReady) {
					this.props.onDomReady();
				}
			});
		}

		if (prevState.isLoading && !this.state.isLoading) {
			this.attachClickListeners();
		}
		if (this.state.globalTables !== prevState.globalTables) {
			this.handleGlobalTables();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.handleMessage);
		document.removeEventListener('mousedown', this.handleClickOutside);
		console.log = this.originalConsoleLog;
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
		this.listenerCheckInterval = setInterval(this.attachClickListeners, 1000);
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
		}
	};

	handleElementClick = (event) => {
		let id;
		if (event.target.tagName.toLowerCase() === 'span') {
			id = event.target.id;
		} else if (event.target.tagName.toLowerCase() === 'input') {
			id = event.target.getAttribute('data-id');
		}

		if (id) {
			this.handleSpanClick(id);
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

		_.map(this.state.modules, async (module, key) => {
			if (module.isPublic === null) module.isPublic = this.state.isPublicModule;

			if (
				(module.isPublic === this.state.isPublicModule &&
					this.state.displayModules === '') ||
				this.state.displayModules === module._id
			) {
				if (this.state.isWorkflow)
					this.getWorkflowModuleTemplate(
						moduleWorkflowQuery,
						{
							getModuleTemplateId: module._id,
							module: module.module,
						},
						module._id,
						module.order,
					);
				else
					this.getModuleTemplate(
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
	};

	replaceInput = async (id, text) => {
		let elements = document.querySelectorAll(`input[id="${id}"], input[data-id="${id}"]`);

		if (elements?.length === 0) {
			elements = document.querySelectorAll(`span[id="${id}"], span[data-id="${id}"]`);
		}

		if (elements.length === 0) {
			// console.warn(`replaceInput: No elements found for ID ${id}`);
			const allElements = document.querySelectorAll(
				'span[id], input[id], span[data-id], input[data-id]',
			);
			const ids = Array.from(allElements).map((el) => el.id || el.getAttribute('data-id'));
		}

		elements.forEach((element) => {
			let updatedElement;
			if (element.tagName.toLowerCase() === 'input') {
				const span = document.createElement('span');
				span.textContent = text;
				span.id = id;
				span.className = element.className;
				span.style.cssText = element.style.cssText;
				element.parentNode.replaceChild(span, element);
				updatedElement = span;
			} else if (element.tagName.toLowerCase() === 'span') {
				element.textContent = text;
				updatedElement = element;
			}
		});

		this.attachClickListeners();
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

		this.setState({ previewModuleSections: updatedModuleSections });
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

		this.setState({ previewModuleSections: updatedModuleSections });
	};

	scrollAndHighlightElement = (id) => {
		if (!id) {
			return;
		}

		setTimeout(() => {
			let element = document.getElementById(id);
			if (!element) {
				element = document.querySelector(`[data-id="${id}"]`);
			}
			if (!element) {
				element = document.querySelector(`[data-variable-id="${id}"]`);
			}
			if (!element) {
				element = document.querySelector(`[data-code="client-name"]`);
			}
			if (!element) {
				element = document.querySelector(`[id*="${id}"], [data-id*="${id}"]`);
			}

			if (!element) {
				const elements = document.querySelectorAll(
					'span[id], input[id], span[data-id], input[data-id], span[data-code], input[data-code]',
				);
				const ids = Array.from(elements).map(
					(el) => el.id || el.getAttribute('data-id') || el.getAttribute('data-code'),
				);
				return;
			}

			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest',
			});
		}, 500);
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
			addClientToSmartFileId: this.props.workflowId || this.props.params.templateID,
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
		});
	};
	handleUpdateTitle = async (title) => {
		let response = await this.updatepublishedWorkflowPreview(updateIndividualWorkflowTitle, {
			updateWorkflowId: this.props.workflowId || this.props.params.templateID,
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
				fileSentStatusId: this.props.workflowId || this.props.params.templateID,
			}));
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

			this.setState({ clientGrandTotal: finalTotalCost });
		}
	};

	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				<div
					className="home_wrapper"
					ref={this.parentRef}
					style={{
						pointerEvents: this.state?.restrictClick === 'true' ? 'none' : '',
						...(this.props?.homeWrapperStyle || {}),
						width: this.state?.showSmartFileSidebar ? '60%' : '100%',
						transition: 'width 0.3s ease-in-out',
						flex: 1,
						minHeight: 0,
					}}
				>
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
											<div className={`hwb_wrapper hwb_wrapper_no_padding`}>
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
														variables={[
															...(this.state.variables?.module || []),
															...(this.state.variables?.workspace ||
																[]),
															...(this.state.variables?.custom || []),
														]}
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
															this.handleDuplicateService(e, f, g)
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
														themes={this.state?.themes}
														globalSummaryData={
															this.state.globalSummaryData
														}
														isSummaryPreview={true}
														clientDetails={this.state.clientDetails}
														audioMode={true}
														clientGrandTotal={
															this.state.clientGrandTotal
														}
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
									<span className="loader"></span>
									{this.getRandomText(loadingTexts)}
								</a>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(TempBuilderPreview);
