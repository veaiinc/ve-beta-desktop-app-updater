import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/docs/index.scss';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/docs/three-dots.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as UppercaseLowercaseA } from '../../../assets/svg/docs/uppercase-lowercase-a.svg';
import { ReactComponent as MailLetter } from '../../../assets/svg/docs/mail-letter.svg';
import { ReactComponent as StatusCircle } from '../../../assets/svg/docs/status-circle.svg';
import { ReactComponent as CrossPurple } from '../../../assets/svg/docs/cross-purple.svg';

import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Sidebar from '../../components/docs/Sidebar';
import DropDown from '../../components/dropDown/tasks/DropDown';
import FilterPopUp from '../../components/globalComponents/FilterPopUp';

import Skeleton from 'react-loading-skeleton';
import SendProposalModal from '../../components/modalsV2/proposalModals/SendProposalModal';
import CopiedModal from '../../components/modalsV2/workflowsModals/CopiedModal';
import { Spin, Tooltip } from 'antd';
let origin = fetchOriginSelection();

const payload = {
	filters: {
		page: 1,
		limit: 10,
	},
};

const staticCreateActions = [
	{
		title: 'Create Smart File',
		subtext: 'Create a tailored smart file and present it to your clients.',
	},
	{
		title: 'Create Proposal',
		subtext: 'Create a tailored business proposal and present it to your clients.',
	},
	{
		title: 'Create Presentation',
		subtext: 'Create a tailored business proposal and present it to your clients.',
	},
	{
		title: 'Create Invoice',
		subtext: 'Track invoice status, Payment schedule, amounts, and more.',
	},
	{ title: 'Create Contract', subtext: 'Stay on top of contracts and signatures.' },
	{ title: 'Create Landing Page', subtext: 'Create and share a landing page with clients.' },
];

export const statusTextmapper = {
	filesViewed: {
		id: 'filesViewed',
		text: 'Files Viewed',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Files Viewed',
	},
	enquiry: {
		id: 'enquiry',
		text: 'Enquiry',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Enquiry',
	},
	filesSent: {
		id: 'filesSent',
		text: 'Sent',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Sent',
	},
	confirmed: {
		id: 'confirmed',
		text: 'Confirmed',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Confirmed',
	},
	expired: {
		id: 'expired',
		text: 'Expired',
		dotStyle: {
			backgroundColor: '#E27B1C',
		},
		style: {
			backgroundColor: 'rgba(125, 79, 39, 1)',
		},
		label: 'Expired',
	},
	accepted: {
		id: 'accepted',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Accepted',
	},
	proposalAccepted: {
		id: 'proposalAccepted',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Proposal Accepted',
	},
};

const statusList = [
	...Object.values(statusTextmapper).map((item) => {
		return {
			name: item.label,
			_id: item.id,
		};
	}),
];

const FilterIcons = {
	templateName: <UppercaseLowercaseA />,
	clientName: <MailLetter />,
	status: <StatusCircle />,
};

export const DocsStatusButton = ({ content = '', style = {}, textStyle = {}, dotStyle = {} }) => {
	return (
		<div className="DocsStatusButtonOuterContainer" style={{ ...style }}>
			<div className="DocsStatusCircle" style={{ ...dotStyle }}></div>
			<span className="DocsButtontext" style={{ ...textStyle }}>
				{content}
			</span>
		</div>
	);
};
const Docs = () => {
	let {
		templates: {
			getDocsFilesList,
			updateStateValues,
			docsFilesList,
			moreDocsFilesList,
			getSmartFileData,
			smartFileInfo,
			getLatestSendSmartFileSettings,
			sendSmartFileSettings,
			templatesListForDocs,
			getTemplatesListForDocs,
			clientListForDocs,
			getClientListForDocs,
			getTemplatesListForCreateLead,
			templatesListForCreateLead,
			updateProposal,
			updateContracts,
			updateInvoice,
			updateForm,
			updateThankyou,
		},
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentPage: 1,
		hasNextPage: false,
		loading: true,
		docsData: [],
		showRightDrawer: false,
		activeFileData: null,
		searchExpand: false,
		searchValue: '',
		appliedFilters: [],
		activeAppliedFilter: '',
		selectedFilterOptions: {
			templateName: null,
			clientName: null,
			status: null,
		},
		clientList: [],
		templatesList: [],
		statusList: [...statusList],
		hasMoreForFilter: {
			templateName: false,
			clientName: false,
			status: false,
		},
		currentPageForFilter: {
			templateName: 1,
			clientName: 1,
			status: 1,
		},
		sendSmartFileModal: false,
		assisstanceData: null,
		workflowExpiryAt: '',
		isEmailAuth: true,
		businessName: '',
		currentWorkspaceId: localStorage.getItem('workspaceId'),
		isAlChatEnabled: false,
		nameIdentification: false,
		emailIdentification: false,
		businessName: '',
		needRefetch: false,
		copyModal: false,
		copyLink: '',
		timeout: null,
		filtersGotChanged: false,
	});

	const Filters = [
		{
			label: (
				<div
					onClick={() =>
						handleSetActiveFilter('templateName', 'templatesList', 'Template Name')
					}
					className="filterContainer"
				>
					<UppercaseLowercaseA />
					<span>Template Name</span>
				</div>
			),
			value: 'templateName',
			filterOptionsListName: 'templatesList',
		},
		{
			label: (
				<div
					onClick={() => handleSetActiveFilter('clientName', 'clientList', 'Client Name')}
					className="filterContainer"
				>
					<MailLetter />
					<span>Client Name</span>
				</div>
			),
			value: 'clientName',
			filterOptionsListName: 'clientList',
		},
		{
			label: (
				<div
					onClick={() => handleSetActiveFilter('status', 'statusList', 'Status')}
					className="filterContainer"
				>
					<StatusCircle />
					<span>Status</span>
				</div>
			),
			value: 'status',
			filterOptionsListName: 'statusList',
		},
	];

	useEffect(() => {
		getDocsFilesListFunc(1);
		getClientListForDocs(payload);
		getTemplatesListForDocs();
		getLatestSendSmartFileSettings();
	}, []);

	useEffect(() => {
		if (templatesListForDocs) {
			setInfo((prev) => ({
				...prev,
				templatesList: [...prev?.templatesList, ...templatesListForDocs?.data],
				hasMoreForFilter: {
					...prev?.hasMoreForFilter,
					templateName: templatesListForDocs?.hasNextPage,
				},
				currentPageForFilter: {
					...prev?.currentPageForFilter,
					templateName: templatesListForDocs?.currentPage,
				},
			}));
		}
	}, [templatesListForDocs]);

	useEffect(() => {
		if (clientListForDocs) {
			setInfo((prev) => ({
				...prev,
				clientList: [...prev?.clientList, ...clientListForDocs?.data],
				hasMoreForFilter: {
					...prev?.hasMoreForFilter,
					clientName: clientListForDocs?.hasNextPage,
				},
				currentPageForFilter: {
					...prev?.currentPageForFilter,
					clientName: clientListForDocs?.currentPage,
				},
			}));
		}
	}, [clientListForDocs]);

	useEffect(() => {
		if (docsFilesList) {
			parseDocsFilesListDeatils(docsFilesList, false);
		}
	}, [docsFilesList]);

	useEffect(() => {
		if (moreDocsFilesList) {
			parseDocsFilesListDeatils(moreDocsFilesList, true);
		}
	}, [moreDocsFilesList]);

	useEffect(() => {
		if (smartFileInfo) {
			let assisstanceData = smartFileInfo?.aiAssistant || {};

			setInfo((prev) => ({
				...prev,
				workflowExpiryAt: smartFileInfo?.expiresAt,
				assisstanceData,
			}));
		}
	}, [smartFileInfo]);

	useEffect(() => {
		if (sendSmartFileSettings) {
			const { isAlChatEnabled, access, userIdentification } = sendSmartFileSettings;
			setInfo((prev) => ({
				...prev,
				isAlChatEnabled: isAlChatEnabled || false,
				isEmailAuth: access?.isEnabled,
				nameIdentification: userIdentification?.name,
				emailIdentification: userIdentification?.email,
			}));
		}
	}, [sendSmartFileSettings]);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (tennantSettingsData && info?.currentWorkspaceId && info?.sendSmartFileModal) {
			let link;
			if (tennantSettingsData?.customDomain?.length) {
				link = `https://${tennantSettingsData?.customDomain}/portal/${info?.activeFileData?.slug}`;
			} else {
				link = `https://${info?.currentWorkspaceId}.ve.ai/portal/${info?.activeFileData?.slug}`;
			}

			setInfo((prev) => ({
				...prev,
				copyLink: link,
				businessName: tennantSettingsData?.businessName,
			}));
		}
	}, [tennantSettingsData, info?.activeFileData, info?.sendSmartFileModal]);

	useEffect(() => {
		if (info?.filtersGotChanged) {
			handleDebounceFetch();
		}
	}, [info?.selectedFilterOptions, info?.searchValue, info?.filtersGotChanged]);

	const handleSetActiveFilter = (filter, filterOptionsListName, label) => {
		if (info?.appliedFilters?.some((appliedFilter) => appliedFilter.filter === filter)) return;
		setInfo((prev) => ({
			...prev,
			appliedFilters: [
				...prev.appliedFilters,
				{
					filter,
					label,
					filterOptionsListName,
				},
			],
		}));
	};

	const handleSetFilterOptions = (option, filter) => {
		if (info?.selectedFilterOptions?.[filter]?._id === option?._id) return;
		setInfo((prev) => ({
			...prev,
			selectedFilterOptions: {
				...prev?.selectedFilterOptions,
				[filter]: option,
			},
			filtersGotChanged: true,
		}));
	};

	const handleRemoveSelectedFilter = (filter) => {
		setInfo((prev) => ({
			...prev,
			selectedFilterOptions: {
				...prev?.selectedFilterOptions,
				[filter]: null,
			},
			appliedFilters: prev?.appliedFilters?.filter(
				(appliedFilter) => appliedFilter?.filter !== filter,
			),
		}));
	};

	const handleFilterPopUpSearch = (searchValue) => {
		setInfo((prev) => ({ ...prev, searchValue, filtersGotChanged: true }));
	};

	const onGenerateAIFunc = () => {
		window.location.href = `${origin}/generate`;
	};

	const getDocsFilesListFunc = useCallback(
		async (page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 30,
					page: page,
					title: info?.searchValue,
				},
			};

			console.log('info?.selectedFilterOptions', info?.selectedFilterOptions);

			if (info?.selectedFilterOptions?.templateName) {
				payload.filters.templateId = info?.selectedFilterOptions?.templateName?._id;
			}
			if (info?.selectedFilterOptions?.clientName) {
				payload.filters.clientId = info?.selectedFilterOptions?.clientName?._id;
			}
			if (info?.selectedFilterOptions?.status) {
				payload.filters.status = info?.selectedFilterOptions?.status?._id;
			}
			getDocsFilesList(payload, fetchMore);
		},
		[info?.searchValue, info?.selectedFilterOptions],
	);

	const fetcMoreDocsFilesList = useCallback(async () => {
		getDocsFilesListFunc(info?.currentPage + 1, true);
	}, [info?.currentPage]);

	const fetchMoreDocs = (filter) => {
		if (filter === 'clientName') {
			const payload = {
				filters: {
					limit: 10,
					page: info?.currentPageForFilter?.clientName + 1,
				},
			};
			getClientListForDocs(payload);
		} else if (filter === 'templateName') {
			const page = info?.currentPageForFilter?.templateName + 1;
			const limit = 10;
			getTemplatesListForDocs(page, limit);
		}
	};

	const parseDocsFilesListDeatils = useCallback(async (variableType, fetchMore = false) => {
		let { hasNextPage, currentPage, data } = variableType || {};

		setInfo((prev) => ({
			...prev,
			loading: false,
			docsData: fetchMore ? prev?.docsData?.concat(data) : data,
			currentPage,
			hasNextPage,
		}));
	}, []);

	const handleOpenSidebar = useCallback((data) => {
		setInfo((prev) => ({ ...prev, showRightDrawer: true, activeFileData: data }));
		getSmartFileInfo(data);
	}, []);

	const handleCloseSidebar = useCallback(() => {
		if (info?.needRefetch) {
			refetchDocsFilesList();
		}
		setInfo((prev) => ({
			...prev,
			showRightDrawer: false,
			activeFileData: null,
			workflowExpiryAt: '',
			needRefetch: false,
		}));
		updateStateValues({ smartFileInfo: null });
	}, [info]);

	const openSendSmartFileModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	}, []);

	const getSmartFileInfo = useCallback(
		async (data) => {
			if (data) {
				const payload = {
					getWorkflowWithModulesId: data?._id,
				};
				getSmartFileData(payload);
			}
		},
		[info?.activeFileData],
	);

	const changelocalWorflowStatus = useCallback(
		async (data) => {
			setInfo((prev) => ({
				...prev,
				activeFileData: { ...prev?.activeFileData, status: data },
				needRefetch: true,
			}));
		},
		[info],
	);

	const updateWorkflowSlug = useCallback(
		(updatedSlug) => {
			setInfo((prev) => ({
				...prev,
				activeFileData: { ...prev?.activeFileData, slug: updatedSlug },
				needRefetch: true,
			}));
		},
		[info?.workflowData],
	);

	const updateSendSmartFileExpiryData = useCallback(async (updatedValue) => {
		setInfo((prev) => ({ ...prev, workflowExpiryAt: updatedValue }));
	}, []);

	const updateIdentification = useCallback((data, type) => {
		setInfo((prev) => ({ ...prev, [type]: data }));
	}, []);

	const updateSmartFileEmailAuth = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, isEmailAuth: data }));
		},
		[info?.isEmailAuth],
	);

	const updateSmartFileIsAiChatEnabled = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, isAlChatEnabled: data }));
		},
		[info?.isAlChatEnabled],
	);

	const refetchDocsFilesList = useCallback(() => {
		getDocsFilesListFunc(1);
	}, []);

	const openCopyModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, copyModal: true }));
	}, [info]);

	//variable update functions

	const updateWorkspaceVariablesFunc = useCallback(
		async (data, type) => {
			//returning false means no changes needeed

			if (!tennantSettingsData) {
				return [false];
			}
			const updatedVariablesdata = [...(data || [])];
			let changed = false;

			for (let i = 0; i < updatedVariablesdata?.length; i++) {
				if (
					updatedVariablesdata?.[i]?.type === 'workspace' &&
					tennantSettingsData?.[updatedVariablesdata?.[i]?.code]
				) {
					const currentVariableValue =
						updatedVariablesdata?.[i]?.value || updatedVariablesdata?.[i]?.defaultValue;
					const incomingValue = tennantSettingsData?.[updatedVariablesdata?.[i]?.code];

					if (currentVariableValue !== incomingValue) {
						updatedVariablesdata[i].value = incomingValue;
						updatedVariablesdata[i].defaultValue = incomingValue;
						changed = true;
					}
				}
			}

			return [changed, updatedVariablesdata, type];
		},
		[tennantSettingsData],
	);

	const updateVariablesInAllModules = useCallback(async () => {
		if (smartFileInfo) {
			const { contract, form, proposal, thankyou, thankyou2, invoice } = smartFileInfo || {};

			//contract
			const { variables: contractVariable } = contract?.versions?.[0] || {};

			//invoice
			const { variables: invoiceVariable } = invoice?.versions?.[0] || {};

			//proposal
			const { variables: proposalVariables } = proposal?.versions?.[0] || {};

			//form
			const { variables: formVariables } = form?.versions?.[0] || {};
			//thankyou
			const { variables: thankyouVariables } = thankyou?.versions?.[0] || {};
			const { variables: thankyou2Variables } = thankyou2?.versions?.[0] || {};

			const mapper = {
				contract: { data: contract, func: updateContracts },
				invoice: { data: invoice, func: updateInvoice },
				proposal: { data: proposal, func: updateProposal },
				form: { data: form, func: updateForm },
				thankyou: { data: thankyou, func: updateThankyou },
				thankyou2: { data: thankyou2, func: updateThankyou },
			};

			const response = await Promise.all([
				updateWorkspaceVariablesFunc(contractVariable || [], 'contract'),
				updateWorkspaceVariablesFunc(invoiceVariable || [], 'invoice'),
				updateWorkspaceVariablesFunc(proposalVariables || [], 'proposal'),
				updateWorkspaceVariablesFunc(formVariables || [], 'form'),
				updateWorkspaceVariablesFunc(thankyouVariables || [], 'thankyou'),
				updateWorkspaceVariablesFunc(thankyou2Variables || [], 'thankyou2'),
			]);

			for (let i = 0; i < response?.length; i++) {
				if (response?.[i]?.[0]) {
					const moduleType = response?.[i]?.[2];

					const payload = {
						[moduleType + 'Id']: mapper?.[moduleType]?.data?._id,
						workflowId: info?.activeFileData?._id,
						[moduleType + 'Input']: {
							versions: {
								variables: response?.[i]?.[1],
							},
						},
						versionId: mapper?.[moduleType]?.data?.activeVersion,
					};
					mapper?.[moduleType]?.func(payload);
				}
			}
		}
	}, [smartFileInfo, updateWorkspaceVariablesFunc, info?.activeFileData]);

	const handleDebounceFetch = useCallback(() => {
		clearInterval(info?.timeout);
		const timeout = setTimeout(() => {
			getDocsFilesListFunc(1);
			setInfo((prev) => ({
				...prev,
				loading: true,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.searchValue, info?.searchValueChanged, info?.selectedFilterOptions]);

	return (
		<div className="docsParentContainer">
			<div className="docsParentHeaderContainer">
				<div className="docsHeaderButtons colorful" onClick={onGenerateAIFunc}>
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitleColored">Start with AI</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Pick your template from your playbook
					</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Upload your files, our AI will generate tailored proposal for you
					</div>
				</div>
			</div>
			<div className="docsTemplatesContainer">
				<div className="docsTemplateContainer">
					{staticCreateActions?.map((ele, index) => (
						<div key={index} className="createStaticActionsCards">
							<span className="createStaticActionsCardsTitle">{ele?.title}</span>
							<span className="createStaticActionsCardsSubTitle">{ele?.subtext}</span>
						</div>
					))}
				</div>
			</div>

			<div className="docsFileContainer">
				<div className="docsFileHeaderContainer">
					<div className="docsFileHeaderContainerTitle">
						<span>Files</span>
						<div className="appliedFiltersContainer">
							{info?.appliedFilters?.map((appliedFilter, idx) => (
								<Tooltip
									key={idx}
									trigger="click"
									arrow={false}
									color="transparent"
									onOpenChange={(isOpen) => {
										if (!isOpen) {
											setInfo((prev) => ({
												...prev,
												searchValue: '',
											}));
										}
									}}
									overlayClassName="filterTooltipPopUpContainer"
									placement="bottomLeft"
									title={
										<FilterPopUp
											className={`${appliedFilter?.filter}`}
											height="268px"
											options={info?.[appliedFilter?.filterOptionsListName]}
											onOptionClick={(option) =>
												handleSetFilterOptions(
													option,
													appliedFilter?.filter,
												)
											}
											fetchMoreOptions={() =>
												fetchMoreDocs(appliedFilter?.filter)
											}
											hasMoreOptions={
												info?.hasMoreForFilter?.[appliedFilter?.filter]
											}
											searchInput={true}
											searchInputPlaceholder="Filter By"
											searchValue={info?.searchValue}
											setSearchValue={handleFilterPopUpSearch}
										/>
									}
								>
									<div className="appliedFilter">
										{FilterIcons?.[appliedFilter?.filter]}
										<span className="filter">
											{appliedFilter?.label} :{' '}
											{info?.selectedFilterOptions?.[appliedFilter?.filter]
												?.name ??
												info?.selectedFilterOptions?.[appliedFilter?.filter]
													?.title ??
												''}
										</span>
										<span
											onClick={() =>
												handleRemoveSelectedFilter(appliedFilter?.filter)
											}
										>
											<CrossPurple />
										</span>
									</div>
								</Tooltip>
							))}
						</div>
					</div>
					<div className="docsFileHeaderContainerActionsContainer">
						<div
							className="searchContainer"
							style={{
								width: info?.searchExpand ? '140px' : '16px',
							}}
						>
							<div
								className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}
							>
								<span
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											searchExpand: true,
										}))
									}
								>
									<Search />
								</span>

								<div className="inputAndCloseContainer">
									<input
										className="searchInputTag"
										placeholder="Search"
										value={info?.searchValue}
										onChange={(e) =>
											setInfo((prev) => ({
												...prev,
												searchValue: e?.target?.value,
											}))
										}
									/>
									<span
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											cursor: 'pointer',
										}}
										onClick={() => {
											setInfo((prev) => ({
												...prev,
												searchExpand: false,
												searchValue: '',
											}));
										}}
									>
										<Cross style={{ width: '20px', height: '20px' }} />
									</span>
								</div>
							</div>
						</div>
						<DropDown
							title="Add Filters"
							options={Filters}
							containerStyles={{
								borderRadius: '14px',
								background: '#202123',
								boxShadow: '0px 2px 44px 0px rgba(0, 0, 0, 0.25)',
							}}
							onOptionClick={() => {}}
							valueSelector="value"
						>
							<Filter style={{ width: '20px', height: '20px', marginTop: '6px' }} />
						</DropDown>
						<ThreeDots />
					</div>
				</div>
				<div className="docsFilesInfiiniteContainer">
					{info?.loading ? (
						[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]?.map(
							(ele, index) => <Skeleton key={index} height={36} />,
						)
					) : (
						<InfiniteScroll
							dataLength={info?.docsData?.length || 0}
							next={fetcMoreDocsFilesList}
							hasMore={info?.hasNextPage}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								width: '100%',
							}}
							className="tetsing"
							height="calc(100vh - 500px)"
						>
							{info?.docsData?.map((ele, index) => (
								<div
									className="docsRow"
									key={index}
									onClick={() => handleOpenSidebar(ele)}
								>
									<div className="docsFilesRowTitle">{ele?.title}</div>
									<div className="docsKeyWordsContainer">
										{ele?.clientDetails?.name ? (
											<span className="docsclientdetailsName">
												{ele?.clientDetails?.name}
											</span>
										) : (
											''
										)}

										<DocsStatusButton
											content={statusTextmapper?.[ele?.status]?.text}
											style={statusTextmapper?.[ele?.status]?.style}
											dotStyle={statusTextmapper?.[ele?.status]?.dotStyle}
										/>
									</div>
								</div>
							))}
						</InfiniteScroll>
					)}
				</div>

				<Sidebar
					open={info?.showRightDrawer}
					onClose={handleCloseSidebar}
					activeFileData={info?.activeFileData}
					openSendSmartFileModal={openSendSmartFileModal}
				/>

				<SendProposalModal
					open={info?.sendSmartFileModal}
					closeModal={() => setInfo((prev) => ({ ...prev, sendSmartFileModal: false }))}
					clientDetails={info?.activeFileData?.clientDetails}
					workflowSlug={info?.activeFileData?.slug}
					workflowId={info?.activeFileData?._id}
					openCopyModal={openCopyModal}
					changelocalWorflowStatus={changelocalWorflowStatus}
					workflowStatus={info?.activeFileData?.status}
					changeEditStatus={() => {}}
					slug={info?.activeFileData?.slug}
					updateWorkflowSlug={updateWorkflowSlug}
					expiresAt={info?.workflowExpiryAt || ''}
					updateSendSmartFileExpiryData={updateSendSmartFileExpiryData}
					isEnabled={info?.isEmailAuth}
					updateSmartFileEmailAuth={updateSmartFileEmailAuth}
					pin={smartFileInfo?.access?.pin}
					businessName={info?.businessName}
					isAlChatEnabled={info?.isAlChatEnabled}
					updateSmartFileIsAiChatEnabled={updateSmartFileIsAiChatEnabled}
					nameIdentification={info?.nameIdentification}
					emailIdentification={info?.emailIdentification}
					updateIdentification={updateIdentification}
					assisstanceData={info?.assisstanceData}
					updateVariablesInAllModules={updateVariablesInAllModules}
					copyLink={info?.copyLink}
				/>

				<CopiedModal
					open={info?.copyModal}
					closeModal={() => setInfo((prev) => ({ ...prev, copyModal: false }))}
					modules={info?.activeFileData?.modules?.filter((e) => e?.type !== 'form')}
					copyLink={
						info?.copyLink || (
							<span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								Generating Link ...
								<Spin />
							</span>
						)
					}
					pin={smartFileInfo?.access?.pin}
				/>
			</div>
		</div>
	);
};

export default memo(Docs);
{
	/* <div className="docsTemplatesContainer">
				<div className="docsTemplatesContainerHeader">
					Create new file from your existing templates
					<div className="docsTemplatesAllFilesContainer">
						<Files />
						All files
					</div>
				</div>

				<div className="docsTemplateContainer">
					{[{}, {}, {}, {}, {}, {}, {}, {}]?.map((ele, index) => (
						<div key={index} className="docsTemplateCard">
							<div className="docsTemplateImageContainer">
								<div className="docsTemplateHoverContentContainer">
									<div className="docsHoverArrowContainer">
										<UpArrow />
									</div>
									<div className="docsHoverOptionsContainer">
										<span className="docsHoverOptionsStyling">Create File</span>
										<span className="docsHoverOptionsStyling">Edit Design</span>
										<span className="docsHoverOptionsStyling">Duplicate</span>
										<span className="docsHoverOptionsStyling">Delete</span>
									</div>
								</div>
								<img
									src="https://s3-alpha-sig.figma.com/img/15b6/6719/e9a63a81d478a52552ed98ac31e7a2b6?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AHd93og5SQiiQLECz4ZuNCrzERGP~NAz3qk7eS5Sfl2rnN0oWzjo~8CgS5fNWE5Knb5s0yTjbQ7uXSeHW6H8J3E1eSneLfc0U9057RjAp0VEqJ-evjzPJjlrXdlli85n2yZM7obW8hfc~8-9MlR57xLGtWobCP7v50apSuXv~1NXhnucgryS87p1CZyKsZZ1Ro-JHIDtSqRygCQDk7N~x2ZS0u5JL6cEZF~nC0oZdxR73cBZ1yBbIG~CYAqEdojkRWVcoOYkPROyviNf-vIl8O3kRvgvVLXAgH7WeebcdHwODd4LeNcCXL7uhHAfZPRwvTeKbq4NW9MarD7lglA2cw__"
									alt="Template preview"
								/>
							</div>
							<div className="docsFooterContent">
								<span className="docsFooterContentTitle">
									Jaylon Korsgaard Wedding Proposal
								</span>
								<span className="docsFooterContentSubTitle">created 14 files</span>
							</div>
						</div>
					))}
				</div>
			</div> */
}
