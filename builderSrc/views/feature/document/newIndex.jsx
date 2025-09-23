import React, { memo, useState, useCallback, useEffect, useContext, useMemo, useRef } from 'react';
import '../../../assets/scss/document/index.scss';
import '../../../assets/scss/document/clientSelection.scss';
import withRouter from '../../../hooks';
import { Tooltip, message } from 'antd';
import Context from '../../../context/context';
import { ReactComponent as SearchIcon } from '../../../assets/svg/UpdateClient/Search.svg';
import { ReactComponent as VerifiedSvg } from '../../../assets/svg/Vector.svg';
import Spinner from '../../components/loaders/Spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as MailIcon } from '../../../views/components/library/svgs/logicform/email.svg';
import { ReactComponent as PhoneIcon } from '../../../assets/svg/questionTypes/phoneNumber.svg';
import { ReactComponent as Plus } from '../../../assets/svg/document/plus.svg';
// import { ReactComponent as DocumentPreview } from '../../../assets/svg/document/documentrightside.svg';
import { ReactComponent as ChevronDownIcon } from '../../../assets/svg/smartFile/downArrow.svg';
import { fetchOriginSelection } from '../../../helper';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import UserSvg from '../../../../src/assets/svg/Settings/UserSvg';
import dummyImage from '../../../assets/images/dummyImg2.jpg';

const origin = fetchOriginSelection();
// ClientSelectionTooltip Component
const ClientSelectionTooltip = ({
	handleOptionSelection,
	clientsList,
	getClientList,
	newContainer = false,
	isTemplateSelected = false,
	handleOptionSelectionReset,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);
	const filteredClients = useMemo(() => {
		return clientsList || [];
	}, [clientsList]);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);

		// Clear previous timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Set new timeout for debounced API call
		const timeout = setTimeout(() => {
			getClientList({
				filters: {
					page: 1,
					limit: 100,
					name: value.trim() || undefined, // Pass search term to API, undefined if empty
				},
			});
		}, 300);

		setSearchTimeout(timeout);
	};

	// Cleanup timeout on component unmount
	useEffect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	}, [searchTimeout]);

	return (
		<div className={`clientSelectionTooltipContainer ${newContainer ? 'newContainer' : ''}`}>
			<div className="clientSearch">
				{/* <SearchIcon /> */}
				<input
					className="clientSearchInput"
					type="text"
					placeholder="Search client here"
					value={searchQuery}
					onChange={handleSearchChange}
					onClick={(e) => e.stopPropagation()}
				/>
			</div>

			<div className="createAddClientOption" onClick={() => handleOptionSelection('addNew')}>
				<Plus /> Add new client
			</div>

			<div className="existingClientContainer">
				{filteredClients.length > 0 ? (
					filteredClients.map((client) => {
						const clientData = JSON.parse(client.value);
						return (
							<>
								<div
									className="clientDetailsCard"
									key={client._id}
									onClick={() => {
										if (isTemplateSelected) {
											handleOptionSelectionReset('templateReset', clientData);
										} else {
											handleOptionSelection('existing', clientData);
										}
									}}
								>
									<div className="clientAvatar-div">
										<div className="clientAvatar">
											<p className="clientAvatarText">
												{clientData.name?.slice(0, 1)?.toUpperCase() || '?'}
											</p>
										</div>
									</div>
									<div className="clientDetailsContainer">
										<span className="clientDetailsNameText">
											{clientData.name || 'Unnamed Client'}
										</span>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												gap: '5px',
											}}
										>
											{clientData.email && (
												<span className="clientEmailText">
													{clientData.email}
												</span>
											)}
											<span></span>
											{clientData.phoneNumber && (
												<span className="clientEmailText">
													{clientData.phoneNumber}
												</span>
											)}
										</div>
									</div>
								</div>
							</>
						);
					})
				) : (
					<div className="noResultsContainer">No clients found</div>
				)}
			</div>
		</div>
	);
};

const CreateDocument = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const formResponseIdfromParams = searchParams.get('formResponseId');
	const {
		templates: {
			getClientList,
			clientList,
			getMyWorkflows,
			myWorkflows,
			createSmartfile,
			createLeadfromTemplates,
			updateClientVariablesData, // Already imported
		},
	} = useContext(Context);

	// Update the initial state to include client tracking
	const [stageInfo, setStageInfo] = useState({
		clientDetails: { name: '', email: '', phoneNumber: '' },
		clientEditable: false,
		isNewClient: false,
		selectedClientId: null, // Add this back to track existing client ID
		updateTimeout: null, // Add this back for debouncing API calls
		clientSelection: false,
		showClientSelectionToolTip: false,
		showTemplateList: false,
		selectedTemplate: null,
		showDocumentName: false,
		documentName: '',
		searchQuery: '',
		searchChanged: false,
		selectedFilter: 'All',
		loading: false,
		templates: [],
		clientData: [],
		isCreating: false,
		completedSteps: [],
		currentStep: 1,
		isCreateButtonActive: false,
		isNewClientFromUrl: false,
		duplicateWarning: null,
	});

	const steps = [
		{ id: 1, title: 'Step 1', description: 'Fill client details' },
		{ id: 2, title: 'Step 2', description: 'Select Template' },
		{ id: 3, title: 'Step 3', description: 'Create Document' },
		{ id: 4, title: 'Step 4', description: 'Fill Document Details' },
		{ id: 5, title: 'Step 5', description: 'Share Document' },
	];

	// Check URL parameters and set initial client details
	useEffect(() => {
		const name = searchParams.get('name') || '';
		const email = searchParams.get('email') || '';
		const phoneNumber = searchParams.get('phoneNumber') || '';
		if (name || email || phoneNumber) {
			setStageInfo((prev) => ({
				...prev,
				clientDetails: { name, email, phoneNumber },
				clientEditable: true,
				isNewClient: true,
				isNewClientFromUrl: true,
				clientSelection: true,
			}));
		}
	}, [searchParams]);

	// Fetch client list and templates
	useEffect(() => {
		getClientList({
			filters: { page: 1, limit: 100 },
		});
		getTemplatesData(1);
	}, []);

	// Add function to update existing client details using the API
	const updateExistingClientDetails = useCallback(
		async (clientId, updateField) => {
			try {
				const response = await updateClientVariablesData({
					updateClientId: clientId,
					updateClientInput: updateField,
				});

				if (response?.[0]) {
					// Don't show success message for every keystroke, just update silently
					console.log('Client details updated successfully');
					// Refresh the client list to get updated data
					getClientList({
						filters: { page: 1, limit: 100 },
					});
				} else {
					console.error('Failed to update client details');
				}
			} catch (error) {
				console.error('Error updating client details:', error);
			}
		},
		[updateClientVariablesData, getClientList],
	);

	// Update the handleInputChange function to handle both new and existing clients
	const handleInputChange = useCallback(
		(e, type) => {
			const value = e.target.value;

			setStageInfo((prev) => {
				const updatedClientDetails = { ...prev.clientDetails, [type]: value };

				// Clear any existing timeout
				if (prev.updateTimeout) {
					clearTimeout(prev.updateTimeout);
				}

				// If it's an existing client and we have the client ID, set up API call with debouncing
				let newTimeout = null;
				if (!prev.isNewClient && prev.selectedClientId && value.trim() !== '') {
					newTimeout = setTimeout(() => {
						updateExistingClientDetails(prev.selectedClientId, { [type]: value });
					}, 2000); // 2 second delay to avoid too many API calls
				}

				return {
					...prev,
					clientDetails: updatedClientDetails,
					updateTimeout: newTimeout,
				};
			});
		},
		[updateExistingClientDetails],
	);

	// Add a separate handler for phone number changes
	const handlePhoneNumberChange = useCallback(
		(value) => {
			setStageInfo((prev) => {
				const updatedClientDetails = {
					...prev.clientDetails,
					phoneNumber: value || '',
				};

				// Clear any existing timeout
				if (prev.updateTimeout) {
					clearTimeout(prev.updateTimeout);
				}

				// If it's an existing client and we have the client ID, set up API call with debouncing
				let newTimeout = null;
				if (!prev.isNewClient && prev.selectedClientId && value && value.trim() !== '') {
					newTimeout = setTimeout(() => {
						updateExistingClientDetails(prev.selectedClientId, { phoneNumber: value });
					}, 2000); // 2 second delay to avoid too many API calls
				}

				return {
					...prev,
					clientDetails: updatedClientDetails,
					updateTimeout: newTimeout,
				};
			});
		},
		[updateExistingClientDetails],
	);

	// Function to normalize phone number for comparison
	const normalizePhoneNumber = useCallback((phone) => {
		if (!phone) return '';
		return phone.replace(/[^\d+]/g, '').replace(/^(\d)/, '+$1');
	}, []);

	// Function to check for duplicate clients
	const checkForDuplicateClient = useCallback(
		(clientDetails) => {
			// Skip validation if not adding new client or no contact info
			if (!stageInfo.isNewClient || (!clientDetails.email && !clientDetails.phoneNumber)) {
				setStageInfo((prev) => ({ ...prev, duplicateWarning: null }));
				return;
			}

			const existingClients = stageInfo.clientData || [];
			let duplicate = null;

			// Check email duplicates first
			if (clientDetails.email) {
				duplicate = existingClients.find((client) => {
					const clientData = JSON.parse(client.value);
					return clientData.email?.toLowerCase() === clientDetails.email.toLowerCase();
				});
			}

			// Check phone duplicates if no email duplicate found
			if (!duplicate && clientDetails.phoneNumber) {
				const normalizedInputPhone = normalizePhoneNumber(clientDetails.phoneNumber);
				duplicate = existingClients.find((client) => {
					const clientData = JSON.parse(client.value);
					return normalizePhoneNumber(clientData.phoneNumber) === normalizedInputPhone;
				});
			}

			// Set warning message if duplicate found
			if (duplicate) {
				const clientData = JSON.parse(duplicate.value);
				const contactType = clientDetails.email ? 'email' : 'phone number';
				const message = `A contact already exists with this ${contactType}, this document will be created for ${
					clientData.name
				}, ${clientData.email || 'No email'}, ${clientData.phoneNumber || 'No phone'}.`;

				setStageInfo((prev) => ({
					...prev,
					duplicateWarning: { type: contactType, existingClient: clientData, message },
				}));
			} else {
				setStageInfo((prev) => ({ ...prev, duplicateWarning: null }));
			}
		},
		[stageInfo.clientData, stageInfo.isNewClient, normalizePhoneNumber],
	);

	// Update the useEffect that processes client list to also check for duplicates
	useEffect(() => {
		if (clientList?.data) {
			const clientData = clientList.data.map((client) => ({
				label: client.name,
				value: JSON.stringify(client),
				_id: client._id,
			}));
			setStageInfo((prev) => ({
				...prev,
				clientData,
			}));
		}
	}, [clientList]);

	// Check for duplicates when client data or details change
	useEffect(() => {
		if (stageInfo.clientData.length > 0 && stageInfo.isNewClient) {
			checkForDuplicateClient(stageInfo.clientDetails);
		}
	}, [
		stageInfo.clientData,
		stageInfo.clientDetails,
		stageInfo.isNewClient,
		checkForDuplicateClient,
	]);

	useEffect(() => {
		if (myWorkflows?.data) {
			setStageInfo((prev) => ({
				...prev,
				templates: myWorkflows.data,
				loading: false,
			}));
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (stageInfo.searchChanged) {
			handleDebounceFetchSearchResults();
		}
	}, [stageInfo.searchQuery, stageInfo.searchChanged, stageInfo.selectedFilter]);

	// Step progression logic
	useEffect(() => {
		// Step 1: Client Details
		if (
			stageInfo.clientSelection &&
			stageInfo.clientDetails.name &&
			(stageInfo.clientDetails.email || stageInfo.clientDetails.phoneNumber)
		) {
			markStepAsCompleted(1);
			if (stageInfo.currentStep === 1) {
				moveToNextStep();
			}
		}

		// Step 2: Template Selection
		if (stageInfo.selectedTemplate) {
			markStepAsCompleted(2);
			if (stageInfo.currentStep === 2) {
				moveToNextStep();
			}
			setStageInfo((prev) => ({ ...prev, isCreateButtonActive: true }));
		}
	}, [
		stageInfo.clientSelection,
		stageInfo.clientDetails,
		stageInfo.selectedTemplate,
		stageInfo.currentStep,
	]);

	const isStepCompleted = (stepId) => {
		return stageInfo.completedSteps.includes(stepId);
	};

	const markStepAsCompleted = (stepId) => {
		if (!isStepCompleted(stepId)) {
			setStageInfo((prev) => ({
				...prev,
				completedSteps: [...prev.completedSteps, stepId],
			}));
		}
	};

	const moveToNextStep = () => {
		if (stageInfo.currentStep < 5) {
			setStageInfo((prev) => ({
				...prev,
				currentStep: prev.currentStep + 1,
			}));
		}
	};
	const handleOptionSelectionReset = (type, clientData = null) => {
		if (type === 'templateReset' && clientData) {
			// Client is changing but template is already selected
			// Update client details and document name but keep the template
			setStageInfo((prev) => ({
				...prev,
				clientDetails: {
					name: clientData.name || '',
					email: clientData.email || '',
					phoneNumber: clientData.phoneNumber || '',
				},
				documentName: prev.selectedTemplate
					? `${prev.selectedTemplate.title} for ${clientData.name || ''}`
					: '',
				clientEditable: false,
				isNewClient: false,
				clientSelection: true,
				showClientSelectionToolTip: false,
			}));
			// Auto-advance to step 2 when existing client is selected
			setTimeout(() => handleClickStep(2), 100);
		} else {
			// Original reset behavior - reset template selection
			setStageInfo((prev) => ({
				...prev,
				selectedTemplate: null,
				showDocumentName: false,
				documentName: '',
			}));
		}
	};

	const getTemplatesData = useCallback(
		(page) => {
			const payload = {
				filters: {
					limit: 100,
					page: page,
					type: 'workspace',
					status: 'published',
					sortBy: 'createdAt',
					sortType: -1,
				},
			};
			if (stageInfo.searchChanged) {
				payload.filters.title = stageInfo.searchQuery || '';
			}
			if (stageInfo.selectedFilter !== 'All') {
				payload.filters.action = stageInfo.selectedFilter;
			}
			getMyWorkflows(payload);
		},
		[stageInfo.searchQuery, stageInfo.searchChanged, stageInfo.selectedFilter],
	);

	const handleDebounceFetchSearchResults = useCallback(() => {
		clearTimeout(stageInfo.timeout);
		const timeout = setTimeout(() => {
			getTemplatesData(1);
		}, 500);
		setStageInfo((prev) => ({ ...prev, timeout }));
	}, [stageInfo]);

	const closeToolTip = useCallback(() => {
		setStageInfo((prev) => ({
			...prev,
			showClientSelectionToolTip: !prev.showClientSelectionToolTip,
		}));
	}, []);

	// Update the handleOptionSelection function to store client ID and make existing clients editable
	const handleOptionSelection = useCallback((type, data) => {
		let obj = {};
		if (type === 'addNew') {
			obj = {
				clientDetails: { name: '', email: '', phoneNumber: '' },
				clientEditable: true,
				isNewClient: true,
				selectedClientId: null, // No ID for new clients
				clientSelection: true,
				duplicateWarning: null,
			};
		} else {
			obj = {
				clientDetails: {
					name: data.name || '',
					email: data.email || '',
					phoneNumber: data.phoneNumber || '',
				},
				clientEditable: true, // Make existing clients editable
				isNewClient: false,
				selectedClientId: data._id, // Store the client ID for updates
				clientSelection: true,
				duplicateWarning: null,
			};
		}
		// Auto-advance to step 2 when existing client is selected
		setTimeout(() => handleClickStep(2), 100);
		setStageInfo((prev) => ({
			...prev,
			...obj,
			showClientSelectionToolTip: false,
		}));
	}, []);

	const handleTemplateSearch = useCallback((e) => {
		setStageInfo((prev) => ({
			...prev,
			searchQuery: e.target.value,
			searchChanged: true,
			loading: true,
		}));
	}, []);

	const handleTemplateSelect = useCallback((template) => {
		setStageInfo((prev) => ({
			...prev,
			selectedTemplate: template,
			showTemplateList: false,
			showDocumentName: true,
			documentName: `${template.title} for ${prev.clientDetails?.name || ''}`,
		}));
	}, []);

	const handleDocumentNameChange = useCallback((e) => {
		setStageInfo((prev) => ({ ...prev, documentName: e.target.value }));
	}, []);

	const toggleTemplateList = useCallback((e) => {
		if (e) e.stopPropagation();
		setStageInfo((prev) => ({
			...prev,
			showTemplateList: !prev.showTemplateList,
		}));
	}, []);

	const handleDisabledTemplateClick = useCallback(() => {
		message.info('Please fill in client details before selecting a template.');
	}, []);

	const handleCreate = useCallback(async () => {
		if (stageInfo.isCreating) return;
		try {
			setStageInfo((prev) => ({ ...prev, isCreating: true }));

			if (stageInfo.isNewClientFromUrl) {
				// Always treat as new client, call createLeadfromTemplates
				const clientDetails = {};
				if (stageInfo.clientDetails.name) clientDetails.name = stageInfo.clientDetails.name;
				if (stageInfo.clientDetails.email)
					clientDetails.email = stageInfo.clientDetails.email;
				if (stageInfo.clientDetails.phoneNumber) {
					clientDetails.phoneNumber = normalizePhoneNumber(
						stageInfo.clientDetails.phoneNumber,
					);
				}
				// Validate required fields
				if (!clientDetails.name) {
					message.error('Client name is required');
					return;
				}
				if (!clientDetails.email && !clientDetails.phoneNumber) {
					message.error('Either email or phone number is required');
					return;
				}
				if (clientDetails.email) {
					const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
					if (!emailRegex.test(clientDetails.email)) {
						message.error('Please enter a valid email address');
						return;
					}
				}
				if (!stageInfo.selectedTemplate?._id || !stageInfo.documentName) {
					message.error('Please select a template and provide a document title');
					return;
				}
				const payload = {
					workflowInput: {
						clientDetails,
						templateId: stageInfo.selectedTemplate?._id,
						title: stageInfo.documentName,
						formResponseId: formResponseIdfromParams,
					},
				};
				const response = await createLeadfromTemplates(payload);
				if (response?.[0]) {
					message.success('Document created successfully for new client');
					markStepAsCompleted(3);
					navigate(`/builder/document/edit/${response[1]}?workflow=true`);
				} else {
					message.error('Failed to create document for new client');
				}
				return;
			}
			if (stageInfo.isNewClient) {
				message.info('Creating new client...');
				const clientDetails = {};
				if (stageInfo.clientDetails.name) clientDetails.name = stageInfo.clientDetails.name;
				if (stageInfo.clientDetails.email)
					clientDetails.email = stageInfo.clientDetails.email;
				if (stageInfo.clientDetails.phoneNumber)
					clientDetails.phoneNumber = stageInfo.clientDetails.phoneNumber;
				// Validate required fields
				if (!clientDetails.name) {
					message.error('Client name is required');
					return;
				}
				if (!clientDetails.email && !clientDetails.phoneNumber) {
					message.error('Either email or phone number is required');
					return;
				}
				if (clientDetails.email) {
					const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
					if (!emailRegex.test(clientDetails.email)) {
						message.error('Please enter a valid email address');
						return;
					}
				}
				if (
					clientDetails.phoneNumber &&
					normalizePhoneNumber(clientDetails.phoneNumber).length < 8
				) {
					message.error('Please enter a valid phone number');
					return;
				}
				if (!stageInfo.selectedTemplate?._id || !stageInfo.documentName) {
					message.error('Please select a template and provide a document title');
					return;
				}
				const payload = {
					workflowInput: {
						clientDetails,
						templateId: stageInfo.selectedTemplate?._id,
						title: stageInfo.documentName,
						formResponseId: formResponseIdfromParams,
					},
				};
				const response = await createLeadfromTemplates(payload);
				if (response?.[0]) {
					message.success('Document created successfully for new client');
					markStepAsCompleted(3);
					navigate(`/builder/document/edit/${response[1]}?workflow=true`);
				} else {
					message.error('Failed to create document for new client');
				}
			} else {
				message.info('Creating document for existing client...');

				// Use the stored selectedClientId instead of searching by name
				if (stageInfo.selectedClientId) {
					const payload = {
						smartFileInput: {
							clientId: stageInfo.selectedClientId, // Use the stored ID directly
							templateId: stageInfo.selectedTemplate?._id,
							title: stageInfo.documentName,
						},
					};
					if (
						!payload.smartFileInput.clientId ||
						!payload.smartFileInput.templateId ||
						!payload.smartFileInput.title
					) {
						message.error('Missing required fields');
						return;
					}

					const response = await createSmartfile(payload);
					if (response?.[0]) {
						message.success('Document created successfully');
						navigate(`/builder/document/edit/${response[1]._id}?workflow=true`);
					} else {
						message.error('Failed to create document');
					}
				} else {
					// Fallback: treat as new client if no selectedClientId
					message.info('No client ID found, creating as new client...');
					const clientDetails = {};
					if (stageInfo.clientDetails.name)
						clientDetails.name = stageInfo.clientDetails.name;
					if (stageInfo.clientDetails.email)
						clientDetails.email = stageInfo.clientDetails.email;
					if (stageInfo.clientDetails.phoneNumber) {
						clientDetails.phoneNumber = normalizePhoneNumber(
							stageInfo.clientDetails.phoneNumber,
						);
					}

					// Validate required fields
					if (!clientDetails.name) {
						message.error('Client name is required');
						return;
					}
					if (!clientDetails.email && !clientDetails.phoneNumber) {
						message.error('Either email or phone number is required');
						return;
					}
					if (clientDetails.email) {
						const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
						if (!emailRegex.test(clientDetails.email)) {
							message.error('Please enter a valid email address');
							return;
						}
					}
					if (
						clientDetails.phoneNumber &&
						normalizePhoneNumber(clientDetails.phoneNumber).length < 8
					) {
						message.error('Please enter a valid phone number');
						return;
					}
					if (!stageInfo.selectedTemplate?._id || !stageInfo.documentName) {
						message.error('Please select a template and provide a document title');
						return;
					}

					const payload = {
						workflowInput: {
							clientDetails,
							templateId: stageInfo.selectedTemplate?._id,
							title: stageInfo.documentName,
							formResponseId: formResponseIdfromParams,
						},
					};

					const response = await createLeadfromTemplates(payload);
					if (response?.[0]) {
						message.success('Document created successfully for new client');
						markStepAsCompleted(3);
						navigate(`/builder/document/edit/${response[1]}?workflow=true`);
					} else {
						message.error('Failed to create document for new client');
					}
				}
			}
		} catch (error) {
			message.error(error.message || 'Failed to create document');
			setStageInfo((prev) => ({
				...prev,
				completedSteps: prev.completedSteps.filter((step) => step !== 3),
			}));
		} finally {
			setStageInfo((prev) => ({ ...prev, isCreating: false }));
		}
	}, [stageInfo, createSmartfile, createLeadfromTemplates, navigate, normalizePhoneNumber]);

	const filterOptions = [
		{ id: 1, title: 'All', value: 'All' },
		{ id: 3, title: 'Proposal', value: 'proposal' },
		{ id: 4, title: 'Presentation', value: 'presentation' },
		{ id: 5, title: 'Invoice', value: 'invoice' },
		{ id: 6, title: 'Contract', value: 'contract' },
	];

	const canCreate = useMemo(() => {
		return (
			stageInfo.clientDetails.name &&
			(stageInfo.clientDetails.email || stageInfo.clientDetails.phoneNumber) &&
			// stageInfo.documentName &&
			!stageInfo.isCreating
		);
	}, [
		stageInfo.clientDetails.name,
		stageInfo.clientDetails.email,
		stageInfo.clientDetails.phoneNumber,
		// stageInfo.documentName,
		stageInfo.isCreating,
	]);

	const [stepNo, setStep] = useState(1);
	const handleClickStep = (index) => {
		setStep(index);
	};

	const [searchQuery, setSearchQuery] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);
	const filteredClients = useMemo(() => {
		return stageInfo.clientData || [];
	}, [stageInfo.clientData]);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);

		// Clear previous timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Set new timeout for debounced API call
		const timeout = setTimeout(() => {
			getClientList({
				filters: {
					page: 1,
					limit: 100,
					name: value.trim() || undefined, // Pass search term to API, undefined if empty
				},
			});
		}, 300);

		setSearchTimeout(timeout);
	};

	// Cleanup timeout on component unmount
	useEffect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	}, [searchTimeout]);
	const [showClient, setShowClient] = useState(false);
	const addClientRef = useRef(null);
	const templateListRef = useRef(null);
	const handleClickOutside = (e) => {
		if (templateListRef.current && !templateListRef.current.contains(e.target)) {
			setStageInfo((prev) => ({ ...prev, showTemplateList: false }));
		}
		if (addClientRef.current && !addClientRef.current.contains(e.target)) {
			setShowClient(false);
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [handleClickOutside]);

	// Add cleanup for timeouts on component unmount
	useEffect(() => {
		return () => {
			if (stageInfo.updateTimeout) {
				clearTimeout(stageInfo.updateTimeout);
			}
		};
	}, [stageInfo.updateTimeout]);

	return (
		<div className="createDocumentParentContainer">
			<div className="createDocumentContentContainer">
				<div className="createDocumentHeader">
					<span
						className="createDocumentTitle"
						onClick={() => navigate(`/files?activeTab=Documents`)}
					>
						<span style={{ cursor: 'pointer' }}>&#8592;</span> Back to Files
					</span>
				</div>

				<div className="createInnerContentContainer-main">
					<div className="createInnerContentContainer">
						<span className="createDocumentTitle">Create a new document</span>
						<div className="stage1Container ">
							{stageInfo.clientSelection ? (
								<>
									{stageInfo.isNewClient || stageInfo.isNewClientFromUrl ? (
										<div className="createDocumentContainer">
											<div className="newClientHeader">
												<div className="newClientHeading">
													<span>
														{stageInfo.isNewClientFromUrl
															? 'Client Details'
															: 'Adding New Client'}
													</span>
												</div>
												{/* <button
														className="backButton"
														onClick={() =>
															setStageInfo((prev) => ({
																...prev,
																clientSelection: false,
																showClientSelectionToolTip: true,
																duplicateWarning: null, // Clear duplicate warning
															}))
														}
													>
														Back
													</button> */}
											</div>
											<div className="inputFieldContainer documentInputField">
												<label className="inputLabel documentInputLabel">
													Client Name
												</label>
												<input
													className="inputBoxContainer documentInput"
													placeholder="Enter Name"
													value={stageInfo.clientDetails.name}
													onChange={(e) => handleInputChange(e, 'name')}
													required
												/>
											</div>
											<div className="inputFieldContainer documentInputField">
												<label className="inputLabel documentInputLabel">
													Client Email
												</label>
												<div className="inputWithIconContainer documentInputWithIcon">
													<input
														className="inputBoxContainer withIcon documentInput"
														placeholder="Enter Email"
														value={stageInfo.clientDetails.email}
														onChange={(e) =>
															handleInputChange(e, 'email')
														}
													/>
													<Tooltip title="Email" placement="top">
														<div className="inputIcon documentInputIcon">
															<MailIcon />
														</div>
													</Tooltip>
												</div>
											</div>
											<div className="inputFieldContainer documentInputField">
												<label className="inputLabel documentInputLabel">
													Client Phone
												</label>
												<div className="inputWithIconContainer documentInputWithIcon">
													<PhoneInput
														placeholder="Enter phone number"
														value={stageInfo.clientDetails.phoneNumber}
														onChange={handlePhoneNumberChange}
														defaultCountry={(() => {
															try {
																const locationDetails = JSON.parse(
																	localStorage.getItem(
																		'locationDetails',
																	),
																);
																return (
																	locationDetails?.countryCode ||
																	'US'
																);
															} catch {
																return 'US';
															}
														})()}
														className="phoneInputNumberDocument documentPhoneInput"
														countryCallingCodeEditable={true}
														autoComplete="tel"
														style={{
															backgroundColor: 'none',
															border: '1px solid var(--stroke)',
														}}
													/>
													<Tooltip title="Phone Number" placement="top">
														<div className="inputIcon documentInputIcon">
															<PhoneIcon />
														</div>
													</Tooltip>
												</div>
												{stageInfo.clientDetails.phoneNumber.length >= 13 ||
													(stageInfo.clientDetails.email &&
														stageInfo.clientDetails.name && (
															// !stageInfo.duplicateWarning &&
															<div className="templateSelectionSection">
																<span className="sectionTitle">
																	Start with template
																</span>
																<Tooltip
																	title={
																		!(
																			stageInfo.clientDetails
																				.name &&
																			(stageInfo.clientDetails
																				.email ||
																				stageInfo
																					.clientDetails
																					.phoneNumber)
																		)
																			? 'Please fill in client details before selecting a template.'
																			: ''
																	}
																	placement="top"
																>
																	<div
																		className="selectedTemplate"
																		onClick={
																			stageInfo.clientDetails
																				.name &&
																			(stageInfo.clientDetails
																				.email ||
																				stageInfo
																					.clientDetails
																					.phoneNumber)
																				? toggleTemplateList
																				: handleDisabledTemplateClick
																		}
																		style={{
																			opacity:
																				stageInfo
																					.clientDetails
																					.name &&
																				(stageInfo
																					.clientDetails
																					.email ||
																					stageInfo
																						.clientDetails
																						.phoneNumber)
																					? 1
																					: 0.5,
																			pointerEvents: 'auto',
																		}}
																	>
																		{stageInfo.selectedTemplate ? (
																			<>
																				<div className="templateInfo">
																					<span className="templateName">
																						{
																							stageInfo
																								.selectedTemplate
																								.title
																						}
																					</span>
																					<span className="templateMeta">
																						{
																							stageInfo
																								.selectedTemplate
																								.workflows
																						}{' '}
																						workflow
																						{stageInfo
																							.selectedTemplate
																							.workflows !==
																						1
																							? 's'
																							: ''}
																					</span>
																				</div>
																				<div className="verifiedIconWrapper">
																					{/* <VerifiedSvg className="verifiedIcon" /> */}
																					<span className="changeButton">
																						Change
																					</span>
																				</div>
																			</>
																		) : (
																			<>
																				<div className="templateInfo">
																					<span className="templateName">
																						change
																					</span>
																				</div>
																				<button className="changeButton">
																					{stageInfo.selectedTemplate
																						? 'Change'
																						: 'Choose Template'}
																				</button>
																			</>
																		)}
																	</div>
																</Tooltip>
																{stageInfo.showTemplateList && (
																	<div
																		ref={templateListRef}
																		className={`templateListContainer ${
																			stageInfo.searchQuery
																				? 'has-search'
																				: ''
																		} ${
																			stageInfo.showTemplateList
																				? 'fadein'
																				: 'fadeout'
																		}`}
																	>
																		<div className="templateSearch">
																			<div className="searchContainer documentSearchContainer">
																				<SearchIcon />
																				<input
																					className="inputBoxContainer documentSearchInput"
																					type="text"
																					placeholder="Search template here"
																					value={
																						stageInfo.searchQuery
																					}
																					onChange={
																						handleTemplateSearch
																					}
																					onClick={(e) =>
																						e.stopPropagation()
																					}
																				/>
																			</div>
																			<div className="filterContainer">
																				{/* <div className="filterTitle">
																		Filter
																	</div> */}
																				<div className="filterOptionsContainer">
																					{filterOptions.map(
																						(
																							option,
																						) => (
																							<div
																								key={
																									option.id
																								}
																								className={`filterOption ${
																									stageInfo.selectedFilter ===
																									option.value
																										? 'selected'
																										: ''
																								}`}
																								onClick={(
																									e,
																								) => {
																									e.stopPropagation();
																									setStageInfo(
																										(
																											prev,
																										) => ({
																											...prev,
																											selectedFilter:
																												option.value,
																											searchChanged: true,
																											loading: true,
																										}),
																									);
																								}}
																							>
																								{
																									option.title
																								}
																							</div>
																						),
																					)}
																				</div>
																			</div>
																		</div>
																		<div className="templateList">
																			{stageInfo.loading ? (
																				<div className="loadingContainer">
																					<Spinner
																						height="32px"
																						width="32px"
																					/>
																				</div>
																			) : stageInfo.templates
																					.length > 0 ? (
																				stageInfo.templates.map(
																					(template) => (
																						<div
																							key={
																								template._id
																							}
																							className={`templateItem ${
																								stageInfo
																									.selectedTemplate
																									?._id ===
																								template._id
																									? 'selected'
																									: ''
																							}`}
																							onClick={() =>
																								handleTemplateSelect(
																									template,
																								)
																							}
																						>
																							<div className="templateInfo">
																								<span className="templateName">
																									{
																										template.title
																									}
																								</span>
																								<span className="templateMeta">
																									{
																										template.workflows
																									}{' '}
																									workflow
																									{template.workflows !==
																									1
																										? 's'
																										: ''}
																								</span>
																							</div>
																							{stageInfo
																								.selectedTemplate
																								?._id ===
																								template._id && (
																								<div className="verifiedIconWrapper">
																									<VerifiedSvg className="verifiedIcon" />
																								</div>
																							)}
																						</div>
																					),
																				)
																			) : (
																				<div className="noResultsContainer">
																					No templates
																					found
																				</div>
																			)}
																		</div>
																	</div>
																)}
															</div>
														))}
												<div className="createDocumentFooter">
													<div className="createDocumentFooterButtons">
														<button
															className="backButton cancelButton"
															onClick={() => {
																setStageInfo((prev) => ({
																	...prev,
																	clientSelection: false,
																	showClientSelectionToolTip: true,
																	duplicateWarning: null, // Clear duplicate warning
																}));
																handleClickStep(stepNo - 1);
															}}
														>
															Cancle
														</button>

														<button
															className="createDocumentButton createButton"
															onClick={handleCreate}
															style={{
																opacity: canCreate ? 1 : 0.7,
																cursor: canCreate
																	? 'pointer'
																	: 'not-allowed',
															}}
															disabled={!canCreate}
														>
															{stageInfo.isCreating ? (
																<>
																	{/* <Spinner
																		height="16px"
																		width="16px"
																	/> */}
																	<CustomSpinner size="small" />
																	<span
																		style={{
																			marginLeft: '8px',
																		}}
																	>
																		{stageInfo.isNewClient
																			? 'Creating new client...'
																			: 'Creating document...'}
																	</span>
																</>
															) : (
																'Create'
															)}
														</button>
													</div>
												</div>
											</div>

											{/* Duplicate warning message */}
											{stageInfo.duplicateWarning && (
												<div className="duplicateWarningMessage">
													{stageInfo.duplicateWarning.message}
												</div>
											)}
										</div>
									) : (
										<>
											{/* <div className="clientDetailsHeader">
												<span>Client Details</span>
											</div> */}
											<div className={`selected-client-main `}>
												<span className="inputLabel">Client Name *</span>
												<Tooltip
													placement="bottomLeft"
													overlayStyle={{
														// width: 'min(600px, 90vw)',
														// maxWidth: '100%',

														width: '100%',
													}}
													title={
														<ClientSelectionTooltip
															handleOptionSelection={
																handleOptionSelection
															}
															clientsList={stageInfo.clientData}
															getClientList={getClientList}
															isTemplateSelected={
																stageInfo.selectedTemplate
															}
															handleOptionSelectionReset={
																handleOptionSelectionReset
															}
														/>
													}
													color={'var(--right-bar, #161618)'}
													arrow={false}
													x
													trigger="click"
													overlayClassName="toolTipContainer responsive-tooltip"
													open={stageInfo.showClientSelectionToolTip}
													onOpenChange={() => closeToolTip()}
												>
													<div className="chooseClientTriggerContainer">
														<span>
															{stageInfo.clientDetails.name ||
																'Client Name'}
														</span>
														<div className="clientSelectorBox">
															<UserSvg
																style={{
																	width: '14px',
																	height: '14px',
																}}
															/>{' '}
															Client
															<ChevronDownIcon />
														</div>
													</div>
												</Tooltip>
												<div className="inputWithIconContainer">
													<span className="inputLabel">Client Email</span>
													<input
														className="inputBoxContainer withIcon"
														placeholder="Client Email"
														value={stageInfo.clientDetails.email}
														// disabled={!stageInfo.clientEditable}
														onChange={(e) =>
															handleInputChange(e, 'email')
														}
													/>
													<Tooltip title="Email" placement="top">
														<div className="inputIcon">
															<MailIcon />
														</div>
													</Tooltip>
												</div>
												<div className="inputWithIconContainer">
													<span className="inputLabel">Client Phone</span>
													<PhoneInput
														placeholder="Client Phone"
														value={
															stageInfo.clientDetails.phoneNumber ||
															undefined
														}
														onChange={handlePhoneNumberChange}
														defaultCountry={(() => {
															try {
																const locationDetails = JSON.parse(
																	localStorage.getItem(
																		'locationDetails',
																	),
																);
																return (
																	locationDetails?.countryCode ||
																	'US'
																);
															} catch {
																return 'US';
															}
														})()}
														className="phoneInputNumber"
														countryCallingCodeEditable={true}
														autoComplete="tel"
														style={{
															color: '#ffffff',
															backgroundColor: 'none',
															border: '1px solid var(--stroke, #2b2e31)',
														}}
													/>
													<Tooltip title="Phone Number" placement="top">
														<div className="inputIcon">
															<PhoneIcon />
														</div>
													</Tooltip>
												</div>
												{stageInfo.selectedTemplate && (
													<div className="inputWithIconContainer">
														<span className="inputLabel">
															Document Name
														</span>
														<input
															className="inputBoxContainer withIcon"
															placeholder="Enter document name"
															value={stageInfo.documentName}
															disabled={!stageInfo.clientEditable}
															onChange={handleDocumentNameChange}
														/>

														<Tooltip
															title="Document Name"
															placement="top"
														>
															<div className="inputIcon">
																{/* You can add a document icon here or use an existing one */}
																<svg
																	width="18"
																	height="18"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																>
																	<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
																</svg>
															</div>
														</Tooltip>
													</div>
												)}

												{/* template selection section */}

												{
													<div className="templateSelectionSection">
														<span className="sectionTitle">
															Start with template
														</span>
														<Tooltip
															title={
																!(
																	stageInfo.clientDetails.name &&
																	(stageInfo.clientDetails
																		.email ||
																		stageInfo.clientDetails
																			.phoneNumber)
																)
																	? 'Please fill in client details before selecting a template.'
																	: ''
															}
															placement="top"
														>
															<div
																className="selectedTemplate"
																onClick={
																	stageInfo.clientDetails.name &&
																	(stageInfo.clientDetails
																		.email ||
																		stageInfo.clientDetails
																			.phoneNumber)
																		? toggleTemplateList
																		: handleDisabledTemplateClick
																}
																style={{
																	opacity:
																		stageInfo.clientDetails
																			.name &&
																		(stageInfo.clientDetails
																			.email ||
																			stageInfo.clientDetails
																				.phoneNumber)
																			? 1
																			: 0.5,
																	pointerEvents: 'auto',
																}}
															>
																{stageInfo.selectedTemplate ? (
																	<>
																		<div className="templateImg">
																			<img
																				src={dummyImage}
																				alt="template-image"
																			/>
																		</div>
																		<div className="templateInfo">
																			<span className="templateName">
																				{
																					stageInfo
																						.selectedTemplate
																						.title
																				}
																			</span>
																			<span className="templateMeta">
																				{
																					stageInfo
																						.selectedTemplate
																						.workflows
																				}{' '}
																				workflow
																				{stageInfo
																					.selectedTemplate
																					.workflows !== 1
																					? 's'
																					: ''}
																			</span>
																		</div>
																		<div className="verifiedIconWrapper">
																			{/* <VerifiedSvg className="verifiedIcon" /> */}
																			<span className="changeButton">
																				Change
																			</span>
																		</div>
																	</>
																) : (
																	<>
																		<div className="templateInfo">
																			<span className="templateName">
																				change
																			</span>
																		</div>
																		<button className="changeButton">
																			{stageInfo.selectedTemplate
																				? 'Change'
																				: 'Choose Template'}
																		</button>
																	</>
																)}
															</div>
														</Tooltip>
														{stageInfo.showTemplateList && (
															<div
																ref={templateListRef}
																className={`templateListContainer ${
																	stageInfo.searchQuery
																		? 'has-search'
																		: ''
																}`}
															>
																<div className="templateSearch">
																	<div className="searchContainer">
																		<SearchIcon />
																		<input
																			type="text"
																			placeholder="Search template here"
																			value={
																				stageInfo.searchQuery
																			}
																			onChange={
																				handleTemplateSearch
																			}
																			onClick={(e) =>
																				e.stopPropagation()
																			}
																		/>
																	</div>
																	<div className="filterContainer">
																		{/* <div className="filterTitle">
																		Filter
																	</div> */}
																		<div className="filterOptionsContainer">
																			{filterOptions.map(
																				(option) => (
																					<div
																						key={
																							option.id
																						}
																						className={`filterOption ${
																							stageInfo.selectedFilter ===
																							option.value
																								? 'selected'
																								: ''
																						}`}
																						onClick={(
																							e,
																						) => {
																							e.stopPropagation();
																							setStageInfo(
																								(
																									prev,
																								) => ({
																									...prev,
																									selectedFilter:
																										option.value,
																									searchChanged: true,
																									loading: true,
																								}),
																							);
																						}}
																					>
																						{
																							option.title
																						}
																					</div>
																				),
																			)}
																		</div>
																	</div>
																</div>
																<div className="templateList">
																	{stageInfo.loading ? (
																		<div className="loadingContainer">
																			<Spinner
																				height="32px"
																				width="32px"
																			/>
																		</div>
																	) : stageInfo.templates.length >
																	  0 ? (
																		stageInfo.templates.map(
																			(template) => (
																				<div
																					key={
																						template._id
																					}
																					className={`templateItem ${
																						stageInfo
																							.selectedTemplate
																							?._id ===
																						template._id
																							? 'selected'
																							: ''
																					}`}
																					onClick={() =>
																						handleTemplateSelect(
																							template,
																						)
																					}
																				>
																					<div className="templateInfo">
																						<span className="templateName">
																							{
																								template.title
																							}
																						</span>
																						<span className="templateMeta">
																							{
																								template.workflows
																							}{' '}
																							workflow
																							{template.workflows !==
																							1
																								? 's'
																								: ''}
																						</span>
																					</div>
																					{stageInfo
																						.selectedTemplate
																						?._id ===
																						template._id && (
																						<div className="verifiedIconWrapper">
																							<VerifiedSvg className="verifiedIcon" />
																						</div>
																					)}
																				</div>
																			),
																		)
																	) : (
																		<div className="noResultsContainer">
																			No templates found
																		</div>
																	)}
																</div>
															</div>
														)}
													</div>
												}

												<button
													className="createDocumentButton create-Button"
													onClick={handleCreate}
													style={{
														opacity: canCreate ? 1 : 0.7,
														cursor: canCreate
															? 'pointer'
															: 'not-allowed',
													}}
													disabled={!canCreate}
												>
													{stageInfo.isCreating ? (
														<>
															<Spinner height="16px" width="16px" />
															<span
																style={{
																	marginLeft: '8px',
																}}
															>
																{stageInfo.isNewClient
																	? 'Creating new client...'
																	: 'Creating document...'}
															</span>
														</>
													) : (
														'Create Document'
													)}
												</button>
											</div>
											{/* Duplicate warning message */}
											{stageInfo.duplicateWarning && (
												<div className="duplicateWarningMessage">
													{stageInfo.duplicateWarning.message}
												</div>
											)}
										</>
									)}

									{/* Remove or comment out the duplicate document name section since we've integrated it above */}
									{/* {stageInfo.showDocumentName && (
											<div className="documentNameSection">
												<span className="sectionTitle">Document name</span>
												<input
													type="text"
													className="documentNameInput"
													placeholder="Document name"
													value={searchQuery}
													onChange={handleSearchChange}
													onClick={(e) => e.stopPropagation()}
												/>
											</div>
										)} */}
								</>
							) : (
								<Tooltip
									overlayStyle={{
										width: 'min(600px, 90vw)',
										maxWidth: '600px',
									}}
									placement="bottomLeft"
									// title={
									// 	<ClientSelectionTooltip
									// 		handleOptionSelection={handleOptionSelection}
									// 		clientsList={stageInfo.clientData}
									// 		getClientList={getClientList}
									// 		newContainer={true}
									// 	/>
									// }
									color={'#202020'}
									arrow={false}
									trigger="click"
									overlayClassName="toolTipContainer responsive-tooltip"
									open={stageInfo.showClientSelectionToolTip}
									onOpenChange={() => closeToolTip()}
								>
									<div className="client-name">
										<p>Client Name</p>
									</div>
									{/* <div className="chooseClientTriggerContainer">
										<span>Client Name</span>
										<div className="clientSelectorBox">Select Client</div>
									</div> */}
									<div className={`clientSelectionTooltipContainer  `}>
										<div className="clientSearch">
											{/* <SearchIcon /> */}
											<input
												type="text"
												placeholder="Search client here"
												value={searchQuery}
												onChange={handleSearchChange}
												onClick={(e) => {
													e.stopPropagation();
													setShowClient(true);
													// console.log('clicked');
												}}
											/>
										</div>
										{showClient && (
											<div
												style={{ width: '100%' }}
												className={`${showClient ? 'fadein' : 'fadeout'}`}
											>
												<div
													ref={addClientRef}
													className={`createAddClientOption`}
													onClick={() => {
														handleOptionSelection('addNew');
													}}
												>
													<Plus /> Add new client
												</div>

												<div
													// className="existingClientContainer"
													className={`existingClientContainer `}
												>
													{!filteredClients.length && (
														<div class="loading-spinner"></div>
													)}

													{filteredClients.length > 0 ? (
														filteredClients.map((client) => {
															const clientData = JSON.parse(
																client.value,
															);
															return (
																<>
																	<div
																		className="clientDetailsCard"
																		key={client._id}
																		onClick={() =>
																			handleOptionSelection(
																				'existing',
																				clientData,
																			)
																		}
																	>
																		<div className="clientAvatar-div">
																			<div className="clientAvatar">
																				<p className="clientAvatarText">
																					{clientData.name
																						?.slice(
																							0,
																							1,
																						)
																						?.toUpperCase() ||
																						'?'}
																				</p>
																			</div>
																		</div>
																		<div className="clientDetailsContainer">
																			<span className="clientDetailsNameText">
																				{clientData.name ||
																					'Unnamed Client'}
																			</span>
																			<div
																				style={{
																					display: 'flex',
																					flexDirection:
																						'row',
																					gap: '5px',
																				}}
																			>
																				{clientData.email && (
																					<span className="clientEmailText">
																						{
																							clientData.email
																						}
																					</span>
																				)}
																				<span></span>
																				{clientData.phoneNumber && (
																					<span className="clientEmailText">
																						{
																							clientData.phoneNumber
																						}
																					</span>
																				)}
																			</div>
																		</div>
																	</div>
																</>
															);
														})
													) : (
														<div className="noResultsContainer">
															No clients found
														</div>
													)}
												</div>
											</div>
										)}
									</div>
								</Tooltip>
							)}
						</div>

						{/* <div className="createDocumentFooter">
							<button
								className="createDocumentButton"
								onClick={handleCreate}
								style={{
									opacity: canCreate ? 1 : 0.7,
									cursor: canCreate ? 'pointer' : 'not-allowed',
								}}
								disabled={!canCreate}
							>
								{stageInfo.isCreating ? (
									<>
										<Spinner height="16px" width="16px" />
										<span style={{ marginLeft: '8px' }}>
											{stageInfo.isNewClient
												? 'Creating new client...'
												: 'Creating document...'}
										</span>
									</>
								) : (
									'Create'
								)}
							</button>
						</div> */}
					</div>
				</div>

				<div className="createdoc-footer" style={{ width: '100%' }}>
					<span className="progress">
						<span className={`${stepNo >= 0 ? 'progress-active' : ''}`}></span>
						<span className={`${stepNo >= 2 ? 'progress-active' : ''}`}></span>
						<span className={`${stepNo >= 3 ? 'progress-active' : ''}`}></span>
						<span className={`${stepNo >= 4 ? 'progress-active' : ''}`}></span>
					</span>
					<div className="createdoc-inner-footer">
						<div className="createdoc-footer-section">
							<span className={`${stepNo >= 1 ? 'step-text' : ''}`}>Step 1</span>
							<span
								className={`${stepNo >= 1 ? 'details-text' : ''}`}
								style={{
									fontSize: '12px',
								}}
							>
								Fill client details
							</span>
						</div>
						<div className="createdoc-footer-section">
							<span className={`${stepNo >= 2 ? 'step-text' : ''}`}>Step 2</span>
							<span
								className={`${stepNo >= 2 ? 'details-text' : ''}`}
								style={{
									fontSize: '12px',
								}}
							>
								Select Template
							</span>
						</div>
						<div className="createdoc-footer-section">
							<span className={`${stepNo >= 3 ? 'step-text' : ''}`}>Step 3</span>
							<span
								className={`${stepNo >= 3 ? 'details-text' : ''}`}
								style={{
									fontSize: '12px',
								}}
							>
								Service selection
							</span>
						</div>
						<div className="createdoc-footer-section">
							<span className={`${stepNo >= 4 ? 'step-text' : ''}`}>Step 4</span>
							<span
								className={`${stepNo >= 4 ? 'details-text' : ''}`}
								style={{
									fontSize: '12px',
								}}
							>
								Share Document
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* <div className="previewContentContainer">
				<div className="documentPreviewContainer">
					<div className="documentPreviewHeader">
						<p className="documentPreviewTitle">Every Great Outcome Starts Here.</p>
						<span className="documentPreviewSubtitle">
							Every doc is a blueprint for action. Start from scratch or Let VEAI help
							structure your thinking.
						</span>
					</div>
					<DocumentPreview />
					<div className="documentPreviewContent">
						<div className="steps-container">
							{steps.map((step) => (
								<div
									key={step.id}
									className={`step ${
										isStepCompleted(step.id) ? 'completed' : ''
									} ${step.id === stageInfo.currentStep ? 'active' : ''}`}
								>
									<div className="step-number"></div>
									<div className="step-title">{step.title}</div>
									<div className="step-description">{step.description}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default memo(withRouter(CreateDocument));
