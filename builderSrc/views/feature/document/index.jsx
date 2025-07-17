import React, { memo, useState, useCallback, useContext, useEffect, useMemo } from 'react';
import '../../../assets/scss/document/index.scss';
import withRouter from '../../../hooks';
import { Tooltip } from 'antd';
import ClientSelectionTooltip from '../../components/createDocument/ClientSelectionTooltip';
import Context from '../../../context/context';
import { ReactComponent as SearchIcon } from '../../../assets/svg/UpdateClient/Search.svg';
import { ReactComponent as VerifiedSvg } from '../../../assets/svg/Vector.svg';
import Spinner from '../../components/loaders/Spinner';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateDocument = () => {
	const {
		templates: {
			getClientList,
			clientList,
			getMyWorkflows,
			myWorkflows,
			createSmartfile,
			createLeadfromTemplates,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		clientDetails: {},
		showStage2: false,
		clientData: [],
	});

	const getClientListData = useCallback(() => {
		getClientList({
			filters: {
				page: 1,
				limit: 100,
			},
		});
	}, []);

	useEffect(() => {
		getClientListData();
	}, [getClientListData]);

	useEffect(() => {
		if (clientList?.data) {
			const { currentPage, hasNextPage, data } = clientList;
			let clientData = [];

			for (let i = 0; i < data?.length; i++) {
				let obj = {
					label: data?.[i]?.name,
					value: JSON.stringify(data?.[i]),
					_id: data?.[i]?._id,
				};
				clientData.push(obj);
			}

			setInfo((prev) => ({
				...prev,
				currentPage,
				hasNextPage,
				clientData,
			}));
		}
	}, [clientList]);

	return (
		<div className="createDocumentParentContainer">
			<div className="createDocumentContentContainer">
				<div className="createInnerContentContainer">
					<span className="createDocumentTitle">Create a New document</span>
					<Stage1 info={info} setInfo={setInfo} />
					{info.showStage2 && <Stage2 info={info} setInfo={setInfo} />}
				</div>
			</div>
			<div className="previewContentContainer">
				<div className="documentPreviewContainer"></div>
			</div>
		</div>
	);
};

const Stage1 = ({ info, setInfo }) => {
	const navigate = useNavigate();
	const {
		templates: { getMyWorkflows, myWorkflows, createSmartfile, createLeadfromTemplates },
	} = useContext(Context);

	const [stageInfo, setStageInfo] = useState({
		clientDetails: {
			name: '',
			email: '',
			phoneNumber: '',
		},
		clientSelection: null,
		showClientSelectionToolTip: false,
		clientEditable: false,
		isNewClient: false,
		selectedTemplate: null,
		showTemplateList: false,
		searchQuery: '',
		templates: [],
		loading: true,
		showDocumentName: false,
		documentName: '',
		isCreating: false,
	});

	useEffect(() => {
		getMyWorkflows({
			filters: {
				limit: 100,
				page: 1,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		});
	}, []);

	useEffect(() => {
		if (myWorkflows?.data) {
			setStageInfo((prev) => ({
				...prev,
				templates: myWorkflows.data,
				loading: false,
			}));
		}
	}, [myWorkflows]);

	const closeToolTip = useCallback(() => {
		setStageInfo((prev) => ({
			...prev,
			showClientSelectionToolTip: !prev.showClientSelectionToolTip,
		}));
	}, []);

	const handleOptionSelection = useCallback((type, data) => {
		let obj = {};
		if (type === 'addNew') {
			obj = {
				clientDetails: {
					name: '',
					email: '',
					phoneNumber: '',
				},
				clientEditable: true,
				isNewClient: true,
			};
		} else {
			obj = {
				clientDetails: {
					name: data.name,
					email: data.email,
					phoneNumber: data.phoneNumber,
				},
				clientEditable: false,
				isNewClient: false,
			};
		}

		setStageInfo((prev) => ({
			...prev,
			...obj,
			showClientSelectionToolTip: false,
			clientSelection: true,
		}));
	}, []);

	const handleInputChange = useCallback((e, type) => {
		let value = e.target.value;
		let obj = {};
		if (type === 'name') {
			obj = { name: value };
		}
		if (type === 'email') {
			obj = { email: value };
		}
		if (type === 'phone') {
			obj = { phoneNumber: value };
		}
		setStageInfo((prev) => ({
			...prev,
			clientDetails: { ...prev?.clientDetails, ...obj },
		}));
	}, []);

	const handleTemplateSearch = useCallback((e) => {
		setStageInfo((prev) => ({
			...prev,
			searchQuery: e.target.value,
		}));
	}, []);

	const handleTemplateSelect = useCallback((template) => {
		setStageInfo((prev) => ({
			...prev,
			selectedTemplate: template,
			showTemplateList: false,
			showDocumentName: true,
		}));
	}, []);

	const handleDocumentNameChange = useCallback((e) => {
		setStageInfo((prev) => ({
			...prev,
			documentName: e.target.value,
		}));
	}, []);

	const handleCreate = useCallback(async () => {
		if (stageInfo.isCreating) return;

		try {
			setStageInfo((prev) => ({ ...prev, isCreating: true }));

			if (stageInfo.isNewClient) {
				// For new clients
				const payload = {
					workflowInput: {
						clientDetails: {
							email: stageInfo.clientDetails.email,
							name: stageInfo.clientDetails.name,
							phoneNumber: stageInfo.clientDetails.phoneNumber,
						},
						templateId: stageInfo.selectedTemplate?._id,
						title: stageInfo.documentName,
					},
				};
				if (
					!payload.workflowInput.clientDetails.name ||
					!payload.workflowInput.clientDetails.email ||
					!payload.workflowInput.templateId ||
					!payload.workflowInput.title
				) {
					message.error('Please fill all required fields');
					return;
				}

				const response = await createLeadfromTemplates(payload);
				if (response?.[0]) {
					message.success('Document created successfully for new client');
					// Navigate to workflow route with dynamic IDs
					navigate(
						`/builder/workflow/${response[1]._id}?workflow=true&templateId=${stageInfo.selectedTemplate._id}`,
					);
				} else {
					message.error('Failed to create document for new client');
				}
			} else {
				// For existing clients
				const selectedClient = info.clientData.find(
					(client) => client.label === stageInfo.clientDetails.name,
				);

				if (!selectedClient) {
					message.error('Client not found');
					return;
				}

				const clientData = JSON.parse(selectedClient.value);

				const payload = {
					smartFileInput: {
						clientId: clientData._id,
						templateId: stageInfo.selectedTemplate?._id,
						title: stageInfo.documentName,
						description: null,
						status: 'draft',
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
					// Navigate to workflow route with dynamic IDs
					navigate(
						`/builder/workflow/${response[1]._id}?workflow=true&templateId=${stageInfo.selectedTemplate._id}`,
					);
				} else {
					message.error('Failed to create document');
				}
			}
		} catch (error) {
			message.error(error.message || 'Failed to create document');
			setStageInfo((prev) => ({
				...prev,
				error: error.message || 'Failed to create document',
			}));
		} finally {
			setStageInfo((prev) => ({ ...prev, isCreating: false }));
		}
	}, [
		stageInfo.isNewClient,
		stageInfo.clientDetails,
		stageInfo.selectedTemplate,
		stageInfo.documentName,
		info.clientData,
		createSmartfile,
		createLeadfromTemplates,
		navigate,
	]);

	const toggleTemplateList = useCallback((e) => {
		if (e) {
			e.stopPropagation();
		}
		setStageInfo((prev) => ({
			...prev,
			showTemplateList: !prev.showTemplateList,
		}));
	}, []);

	const filteredTemplates = useMemo(() => {
		return stageInfo.templates.filter((template) =>
			template.title.toLowerCase().includes(stageInfo.searchQuery.toLowerCase()),
		);
	}, [stageInfo.templates, stageInfo.searchQuery]);

	return (
		<div className="stage1Container">
			{stageInfo?.clientSelection ? (
				<>
					{stageInfo.isNewClient ? (
						<>
							<input
								className="inputBoxContainer"
								placeholder="Client Name"
								value={stageInfo?.clientDetails?.name}
								onChange={(e) => handleInputChange(e, 'name')}
							/>
							<input
								className="inputBoxContainer"
								placeholder="Client Email"
								value={stageInfo?.clientDetails?.email}
								onChange={(e) => handleInputChange(e, 'email')}
							/>
							<input
								className="inputBoxContainer"
								placeholder="Client Phone"
								value={stageInfo?.clientDetails?.phoneNumber}
								onChange={(e) => handleInputChange(e, 'phone')}
							/>
						</>
					) : (
						<>
							<div className="clientDetailsHeader">
								<span>Client Details</span>
							</div>
							<Tooltip
								placement="bottomLeft"
								title={
									<ClientSelectionTooltip
										handleOptionSelection={handleOptionSelection}
										clientsList={info.clientData}
									/>
								}
								color={'#202020'}
								arrow={false}
								trigger="click"
								overlayClassName="toolTipContainer"
								open={stageInfo?.showClientSelectionToolTip}
								onOpenChange={(open) => {
									closeToolTip();
								}}
							>
								<div className="chooseClientTriggerContainer">
									<span>{stageInfo?.clientDetails?.name || 'Client Name'}</span>
									<div className="clientSelectorBox">Client</div>
								</div>
							</Tooltip>
							<input
								className="inputBoxContainer"
								placeholder="Client Email"
								value={stageInfo?.clientDetails?.email}
								disabled={!stageInfo?.clientEditable}
								onChange={(e) => handleInputChange(e, 'email')}
							/>
							<input
								className="inputBoxContainer"
								placeholder="Client Phone"
								value={stageInfo?.clientDetails?.phoneNumber}
								disabled={!stageInfo?.clientEditable}
								onChange={(e) => handleInputChange(e, 'phone')}
							/>
						</>
					)}

					<div className="templateSelectionSection">
						<span className="sectionTitle">Start with template</span>
						<div className="selectedTemplate" onClick={toggleTemplateList}>
							{stageInfo.selectedTemplate ? (
								<>
									<div className="templateThumb">
										<img
											src={
												stageInfo.selectedTemplate.thumbnail ||
												'/path/to/default/thumb.png'
											}
											alt="T"
										/>
									</div>
									<div className="templateInfo">
										<span className="templateName">
											{stageInfo.selectedTemplate.title}
										</span>
										<span className="templateMeta">
											{stageInfo.selectedTemplate.workflows} workflow
											{stageInfo.selectedTemplate.workflows !== 1 ? 's' : ''}
										</span>
									</div>
									<div className="verifiedIconWrapper">
										<VerifiedSvg className="verifiedIcon" />
									</div>
								</>
							) : (
								<>
									<div className="templateInfo">
										<span className="templateName">Select template</span>
									</div>
									<button className="changeButton">Change</button>
								</>
							)}
						</div>
						{stageInfo.showTemplateList && (
							<div className="templateListContainer">
								<div className="templateSearch">
									<SearchIcon />
									<input
										type="text"
										placeholder="Search template here"
										value={stageInfo.searchQuery}
										onChange={handleTemplateSearch}
										onClick={(e) => e.stopPropagation()}
									/>
								</div>
								<div className="templateList">
									{stageInfo.loading ? (
										<div className="loadingContainer">
											<Spinner height="32px" width="32px" />
										</div>
									) : filteredTemplates.length > 0 ? (
										filteredTemplates.map((template) => (
											<div
												key={template._id}
												className={`templateItem ${
													stageInfo.selectedTemplate?._id === template._id
														? 'selected'
														: ''
												}`}
												onClick={() => handleTemplateSelect(template)}
											>
												<div className="templateThumb">
													<img
														src={
															template.thumbnail ||
															'/path/to/default/thumb.png'
														}
														alt="T"
													/>
												</div>
												<div className="templateInfo">
													<span className="templateName">
														{template.title}
													</span>
													<span className="templateMeta">
														{template.workflows} workflow
														{template.workflows !== 1 ? 's' : ''}
													</span>
												</div>
												{stageInfo.selectedTemplate?._id ===
													template._id && (
													<div className="verifiedIconWrapper">
														<VerifiedSvg className="verifiedIcon" />
													</div>
												)}
											</div>
										))
									) : (
										<div className="noResultsContainer">No templates found</div>
									)}
								</div>
							</div>
						)}
					</div>

					{stageInfo.showDocumentName && (
						<div className="documentNameSection">
							<span className="sectionTitle">Document name</span>
							<input
								type="text"
								className="documentNameInput"
								placeholder="Document name"
								value={stageInfo.documentName}
								onChange={handleDocumentNameChange}
							/>
							<button
								className="createButton"
								onClick={handleCreate}
								disabled={!stageInfo.documentName.trim() || stageInfo.isCreating}
							>
								{stageInfo.isCreating ? (
									<Spinner height="16px" width="16px" />
								) : (
									'Create'
								)}
							</button>
						</div>
					)}
				</>
			) : (
				<Tooltip
					placement="bottomLeft"
					title={
						<ClientSelectionTooltip
							handleOptionSelection={handleOptionSelection}
							clientsList={info.clientData}
						/>
					}
					color={'#202020'}
					arrow={false}
					trigger="click"
					overlayClassName="toolTipContainer"
					open={stageInfo?.showClientSelectionToolTip}
					onOpenChange={(open) => {
						closeToolTip();
					}}
				>
					<div className="chooseClientTriggerContainer">
						<span>Client Name</span>
						<div className="clientSelectorBox">Client</div>
					</div>
				</Tooltip>
			)}
		</div>
	);
};

const Stage2 = ({ info, setInfo }) => {
	const [documentName, setDocumentName] = useState('');

	return (
		<div className="stage2Container">
			<div className="documentNameSection">
				<span className="sectionTitle">Document name</span>
				<input
					type="text"
					className="documentNameInput"
					placeholder="Document name"
					value={documentName}
					onChange={(e) => setDocumentName(e.target.value)}
				/>
				<button
					className="createButton"
					onClick={handleCreate}
					disabled={!documentName.trim()}
				>
					Create
				</button>
			</div>
		</div>
	);
};

export default memo(withRouter(CreateDocument));
