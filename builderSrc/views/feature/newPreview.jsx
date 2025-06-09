import React, { Component, createRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import NewProposals from '../../controllers/newProposals';
import { withRouter } from '../../services/withRouter';
import Builder from '../components/library/builder';
import _ from 'lodash';
import '../../assets/scss/home.scss';
import Header from './Header/Index';
import BottomModal from '../components/library/modals/BottomModal';
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

class BuilderPreview extends NewProposals {
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
			isPreviewLoading: true, // Add new loading state
			loadingText: loadingTexts[Math.floor(Math.random() * loadingTexts.length)], // Add initial loading text
			activeModuleId: this.props.templateId || this.props.workflowId,
			previewModuleSections: [],
			isPublicModule: false,
			iframeSendMessage: false,
			displayModules: '',
			isWorkflow: this.props.isWorkflow || false,
			restrictClick: false,
			moduleType: '',
			singleTemplatePreview: false,
			customDomain: '',
			currencySymbol: '',
			updateClient: false,
			clientListArray: [],
			isSubmit: false,
			isClientVariable: false,
			activeBlockIdToScroll: null,
			clientDetails: this.props.clientDetails || {},
			fetchAgain: null,
			customExpiryDate: '',
			mobileViewLocked: false,
			title: '',
			currencySymbol2: '',
			socialMediaLinks: {},
			showSmartFileSidebar: this.props.showSmartFileSidebar || false,
		};
		this.parentRef = createRef();
		this.updateClientRef = createRef();
		this.listenerCheckInterval = null;
		this.originalConsoleLog = console.log;
	}

	stringToBoolean = (str) => {
		try {
			return JSON.parse(str.toLowerCase());
		} catch (e) {
			return false;
		}
	};

	componentDidMount = async () => {
		// Start loading text update interval
		this.loadingInterval = setInterval(this.updateLoadingText, 3000);

		window.addEventListener('message', this.handleMessage);
		this.startListenerCheck();

		if (this.props.workflowId) {
			try {
				await this.getWorkflowWithModules(workflowQueryWithModules, {
					getWorkflowWithModulesId: this.props.workflowId,
				});

				const [success, result] = await this.getIndividualWorkflowInfo(workflowQuery, {
					getDetailedWorkflowInfoId: this.props.workflowId,
				});

				if (success && result) {
					let version = result.doc?.versions?.[0];
					let previewModuleSections = [
						{
							module: result.template.module,
							sections: version?.sections || [],
							id: result._id,
							order: 1,
							variables: version?.variables || [],
							tables: version?.tables || [],
							isSectionLoaded: true,
							headerSection: version?.header,
							isHeader: version?.isHeader,
							formBgColor: version?.backgroundColor,
							headerSectionId: version?.header?._id,
						},
					];

					this.setState({
						previewModuleSections,
						isWorkflow: true,
						displayModules: this.props.workflowId,
						isPublicModule: false,
						restrictClick: false,
						moduleType: '',
						title: result.title,
						currencySymbol2: result.currencySymbol,
						socialMediaLinks: result.socialMediaLinks || {},
						isPreviewLoading: false, // Set loading to false once data is ready
					});
					this.props.onUpdateCallbacks?.({
						serviceBlockChanges: this.udpateSectionsForService,
						eventsBlockChanges: this.udpateEventsTable,
						variableBlockChanges: this.replaceInput,
						scrollAndHighlightElement: this.scrollAndHighlightElement,
						handleReplaceMultipleInput: this.handleReplaceMultipleInput,
					});
				}

				if (this.props?.editingWorflow) {
					let tenantsData = await this.getTenantsData();
					// if (tenantsData[1]?.locationDetails?.currency) {
					// 	await this.getCurrencySymbol(tenantsData[1]?.locationDetails?.currency);
					// }
					let currency =
						tenantsData[1]?.defaultCurrency ||
						tenantsData[1]?.locationDetails?.userCurrency ||
						tenantsData[1]?.locationDetails?.currency ||
						'INR';
					await this.getCurrencySymbol(currency);
				}
			} catch (error) {
				console.error('Error in initialization:', error);
				this.setState({ isPreviewLoading: false }); // Ensure loading state is cleared even on error
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
	}

	componentWillUnmount() {
		// Clear the loading text interval
		if (this.loadingInterval) {
			clearInterval(this.loadingInterval);
		}
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
				? 'http://localhost:3000'
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
		if (!id) return;
		let elements = document.querySelectorAll(`input[id="${id}"], input[data-id="${id}"]`);
		if (elements?.length === 0) {
			elements = document.querySelectorAll(`span[id="${id}"], span[data-id="${id}"]`);
		}

		let updatedElement = null;
		elements.forEach((element) => {
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

		// Re-attach listeners and scroll to updated element
		this.attachClickListeners();
		if (updatedElement) {
			requestAnimationFrame(() => {
				this.scrollAndHighlightElement(id);
			});
		}
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
		if (!updatedEventsData) return;

		let updatedModuleSections = this.state.previewModuleSections;
		let changedSubBlockId = null;

		Object.entries(updatedEventsData)?.forEach(([moduleType, events]) => {
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

		if (changedSubBlockId) {
			this.scrollAndHighlightElement(changedSubBlockId);
		}

		updatedModuleSections?.forEach((module, moduleIndex) => {
			module?.tables?.forEach((table, tableIndex) => {
				if (table?.type === 'events') {
					Object.entries(updatedEventsData)?.forEach(([moduleType, events]) => {
						events?.forEach((event) => {
							if (table?._id === event?._id) {
								updatedModuleSections[moduleIndex].tables[tableIndex] = event;
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

		// Try to find the element with various selectors
		let element = document.getElementById(id);
		if (!element) {
			element = document.querySelector(`[data-id="${id}"]`);
		}
		if (!element) {
			element = document.querySelector(`span[id="${id}"]`);
		}
		if (!element) {
			element = document.querySelector(`input[id="${id}"]`);
		}

		if (!element) {
			console.warn(`Element with id ${id} not found`);
			return;
		}

		// First remove any existing highlights
		const highlightedElements = document.querySelectorAll('.highlight-animation');
		highlightedElements.forEach((el) => {
			el.classList.remove('highlight-animation');
			el.style.backgroundColor = '';
		});

		// Add highlight class
		element.classList.add('highlight-animation');

		// Calculate the element's position relative to the viewport
		const elementRect = element.getBoundingClientRect();
		const absoluteElementTop = elementRect.top + window.pageYOffset;
		const middle = absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

		// Scroll into view
		window.scrollTo({
			top: middle,
			behavior: 'smooth',
		});

		// Add highlight effect
		element.style.transition = 'background-color 0.3s ease-in-out';
		element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';

		// Remove highlight after animation
		setTimeout(() => {
			element.style.backgroundColor = '';
			element.classList.remove('highlight-animation');
		}, 1500);
	};

	handleMessage = (event) => {
		let origin =
			window.location.hostname === 'localhost'
				? 'http://localhost:3000'
				: 'https://www.ve.ai';

		// Allow messages from localhost:3000 and localhost:8000 in development
		if (window.location.hostname === 'localhost') {
			if (
				event.origin !== 'http://localhost:3000' &&
				event.origin !== 'http://localhost:8000'
			) {
				return;
			}
		} else if (event.origin !== origin) {
			return;
		}

		switch (event.data.type) {
			case 'REPLACE_TEXT_ARRAY':
				this.handleReplaceMultipleInput(event?.data?.textArray);
				break;
			case 'REPLACE_TEXT':
				this.replaceInput(event.data.id, event.data.text);
				break;
			case 'SCROLL_TO_ELEMENT':
				// Only scroll if the message came from the sidebar
				if (event.data.fromSidebar) {
					this.scrollAndHighlightElement(event.data.id);
				}
				break;
			case 'SERVICE_TABLE_DATA':
				this.udpateSectionsForService(event?.data?.serviceBlock);
				break;
			case 'EVENTS_TABLE_DATA':
				this.udpateEventsTable(event?.data?.eventsTable);
				break;
			case 'SPAN_CLICKED':
				// Don't scroll on span clicks, just notify parent
				let origin =
					window.location.hostname === 'localhost'
						? 'http://localhost:3000'
						: 'https://www.ve.ai';
				window.parent.postMessage(
					{
						type: 'SPAN_CLICKED',
						id: event.data.id,
					},
					origin,
				);
				break;
			default:
		}
	};

	handleReplaceMultipleInput = (dataArray) => {
		if (!Array.isArray(dataArray)) {
			console.error('dataArray is not an array:', dataArray);
			return;
		}

		// Process updates sequentially with small delays
		dataArray.forEach((item, index) => {
			if (item?._id) {
				setTimeout(() => {
					this.replaceInput(item._id, item.value || item.defaultValue || '');
				}, index * 100); // 100ms delay between updates
			}
		});
	};

	getRandomText(array) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	sendIframeReadyMessage() {
		if (!this.state.iframeSendMessage) {
			let origin =
				window.location.hostname === 'localhost'
					? 'http://localhost:3000'
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
			addClientToSmartFileId: this.props.workflowId,
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
			updateWorkflowId: this.props.workflowId,
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
				fileSentStatusId: this.props.workflowId,
			}));
	};

	handleEditClick = () => {
		const { workflowId } = this.props;
		if (workflowId) {
			// Use the handleSave prop to switch to edit mode
			if (this.props.handleSave) {
				this.props.handleSave('edit');
			}
		}
	};

	render() {
		const { isPreviewLoading, loadingText } = this.state;

		return (
			<div
				className="preview_container"
				style={{ display: 'flex', flexDirection: 'column', padding: '0 100px' }}
			>
				{this.props?.showHeader ? (
					//
					<></>
				) : (
					''
				)}
				<div
					className="home_wrapper"
					ref={this.parentRef}
					style={{
						pointerEvents: this.state?.restrictClick === 'true' ? 'none' : '',
						...(this.props?.homeWrapperStyle || {}),
						marginLeft: '0',
						width: '100%',
						transition: 'all 0.3s ease-in-out',
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
					{isPreviewLoading ? (
						<div className="preview-loader">
							<div className="loader-content">
								<div className="loader-spinner"></div>
								<div className="loader-text">{loadingText}</div>
							</div>
						</div>
					) : (_.size(this.state.previewModuleSections) ===
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
												style={{}}
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
																? ''
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
															workspaceID,
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
									{loadingText}
								</a>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(BuilderPreview);
