import React, { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/docs/index.scss';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/docs/three-dots.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as UppercaseLowercaseA } from '../../../assets/svg/docs/uppercase-lowercase-a.svg';
import { ReactComponent as MailLetter } from '../../../assets/svg/docs/mail-letter.svg';
import { ReactComponent as StatusCircle } from '../../../assets/svg/docs/status-circle.svg';
import { ReactComponent as CrossPurple } from '../../../assets/svg/docs/cross-purple.svg';
import { ReactComponent as Sync } from '../../../assets/svg/docs/sync.svg';

import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Sidebar from '../../components/docs/Sidebar';
import DropDown from '../../components/dropDown/tasks/DropDown';
import FilterPopUp from '../../components/globalComponents/FilterPopUp';
import DeleteLeadModal from '../../components/modalsV2/workflowsModals/DeleteLeadModal.jsx';
import ProposalPopup from '../../components/docs/ProposalsPopup.jsx';
import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';
import { Tooltip } from 'antd';
import QuickActions from '../../components/globalComponents/QuickActions.jsx';
import Spinner from '../../components/loaders/Spinner';
const origin = fetchOriginSelection();

const payload = {
	filters: {
		page: 1,
		limit: 10,
	},
};

const staticCreateActions = [
	{
		type: 'Minimal',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Professional',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Traditional',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Sales',
		prompt: 'Track invoice status, Payment schedule, amounts, and more.',
	},
	{
		type: 'Consise',
		prompt: 'Wedding Day Timeline Generator',
	},
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
	// accepted: {
	// 	id: 'accepted',
	// 	text: 'Accepted',
	// 	dotStyle: {
	// 		backgroundColor: '#00A051',
	// 	},
	// 	style: {
	// 		backgroundColor: '#2C593F',
	// 	},
	// 	label: 'Accepted',
	// },
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
	// published: {
	// 	id: 'published',
	// 	text: 'Published',
	// 	dotStyle: {
	// 		backgroundColor: '#2A71CD',
	// 	},
	// 	style: {
	// 		backgroundColor: '#29456C',
	// 	},
	// 	label: 'Published',
	// },
};

const statusList = Object.values(statusTextmapper)?.map((status) => ({
	name: status?.label,
	_id: status?.id,
}));

export const FilterIcons = {
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

export const Filters = [
	{
		label: (
			<div className="filterContainer">
				<UppercaseLowercaseA />
				<span>Template Name</span>
			</div>
		),
		value: 'templateName',
		filterOptionsListName: 'templatesList',
		displayValue: 'Template Name',
		valueSelector: {
			filter: 'templateName',
			filterOptionsListName: 'templatesList',
			label: 'Template Name',
		},
	},
	{
		label: (
			<div className="filterContainer">
				<MailLetter />
				<span>Client Name</span>
			</div>
		),
		value: 'clientName',
		filterOptionsListName: 'clientList',
		displayValue: 'Client Name',
		valueSelector: {
			filter: 'clientName',
			filterOptionsListName: 'clientList',
			label: 'Client Name',
		},
	},
	{
		label: (
			<div className="filterContainer">
				<StatusCircle />
				<span>Status</span>
			</div>
		),
		value: 'status',
		filterOptionsListName: 'statusList',
		displayValue: 'Status',
		valueSelector: {
			filter: 'status',
			filterOptionsListName: 'statusList',
			label: 'Status',
		},
	},
];

const Docs = () => {
	const navigate = useNavigate();
	let {
		templates: {
			getDocsFilesList,
			updateStateValues,
			docsFilesList,
			moreDocsFilesList,
			getSmartFileData,
			getLatestSendSmartFileSettings,
			templatesListForDocs,
			getTemplatesListForDocs,
			clientListForDocs,
			getClientListForDocs,
			deleteLead,
			createBlankWorkflow,
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
		templateNameSearchValue: '',
		clientNameSearchValue: '',
		statusSearchValue: '',
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
		timeout: null,
		filtersGotChanged: false,
		deleteLeadModal: false,
		proposalPopup: false,
		blankWorkflowLoading: false,
	});

	const activeFileRef = useRef(null);

	const suggestedOptions = [
		{
			id: 0,
			title: 'Create new Document',
			value: 'form-submission',
			controlValue: 'form',
			action: ({ setInfo, info }) => {
				setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
			},
		},
		{
			id: 1,
			title: 'Create new Form',
			value: 'form-submission',
			controlValue: 'form',
			action: ({ setInfo, info }) => {
				setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
			},
		},
		{
			id: 2,
			title: 'Create new Proposal',
			value: 'proposal',
			controlValue: 'workflow',
			action: ({ setInfo, info }) => {
				setInfo({ ...info, openProposalPopup: true, commonState: 'proposal' });
			},
		},
		{
			id: 3,
			title: 'Create new Invoice',
			value: 'invoice',
			controlValue: 'workflow',
			action: ({ setInfo, info }) => {
				setInfo({ ...info, openProposalPopup: true, commonState: 'invoice' });
			},
		},
		{
			id: 4,
			title: 'Create new Contact',
			value: 'contract',
			controlValue: 'workflow',
			action: ({ setInfo, info }) => {
				setInfo({ ...info, openProposalPopup: true, commonState: 'contract' });
			},
		},
	];

	useEffect(() => {
		getDocsFilesListFunc(1);
		getLatestSendSmartFileSettings();
	}, []);

	useEffect(() => {
		if (templatesListForDocs) {
			setInfo((prev) => ({
				...prev,
				templatesList:
					templatesListForDocs?.currentPage === 1 || !info?.templateNameSearchValue
						? templatesListForDocs?.data
						: [...prev?.templatesList, ...templatesListForDocs?.data],
				hasMoreForFilter: {
					...prev?.hasMoreForFilter,
					templateName: templatesListForDocs?.hasNextPage,
				},
				currentPageForFilter: {
					...prev?.currentPageForFilter,
					templateName: templatesListForDocs?.currentPage,
				},
			}));
		} else {
			getTemplatesListForDocs();
		}
	}, [templatesListForDocs]);

	useEffect(() => {
		if (clientListForDocs) {
			setInfo((prev) => ({
				...prev,
				clientList:
					clientListForDocs?.currentPage === 1
						? clientListForDocs?.data
						: [...prev?.clientList, ...clientListForDocs?.data],
				hasMoreForFilter: {
					...prev?.hasMoreForFilter,
					clientName: clientListForDocs?.hasNextPage,
				},
				currentPageForFilter: {
					...prev?.currentPageForFilter,
					clientName: clientListForDocs?.currentPage,
				},
			}));
		} else {
			getClientListForDocs(payload);
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
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		if (info?.filtersGotChanged) {
			handleDebounceFetch();
		}
	}, [info?.selectedFilterOptions, info?.searchValue, info?.filtersGotChanged]);

	useEffect(() => {
		if (info?.templateNameSearchValue) {
			handleDebounceFetchFilter('templateName');
		}
		if (info?.clientNameSearchValue) {
			handleDebounceFetchFilter('clientName');
		}
		if (info?.searchValue) {
			handleDebounceFetch();
		}
	}, [info?.templateNameSearchValue, info?.clientNameSearchValue, info?.searchValue]);

	const handleSetActiveFilter = (payload) => {
		const { filter, filterOptionsListName, label } = payload || {};
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

	const handleFilterPopUpSearch = (filter, searchValue) => {
		if (searchValue === '') {
			if (filter === 'templateName') {
				clearInterval(info?.timeout);
				const timeout = setTimeout(() => {
					getTemplatesListForDocs(1, 10, '');
				}, 500);
				setInfo((prev) => ({ ...prev, timeout }));
			}
			if (filter === 'clientName') {
				clearInterval(info?.timeout);
				const timeout = setTimeout(() => {
					getClientListForDocs(payload);
				}, 500);
				setInfo((prev) => ({ ...prev, timeout }));
			}
		}
		setInfo((prev) => ({
			...prev,
			[`${filter}SearchValue`]: searchValue,
		}));
	};

	const handleDebounceFetchFilter = useCallback(
		(filter) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				if (filter === 'templateName') {
					getTemplatesListForDocs(1, 10, info?.templateNameSearchValue);
				}
				if (filter === 'clientName') {
					const payload = {
						filters: {
							limit: 10,
							page: 1,
							name: info?.clientNameSearchValue,
						},
					};
					getClientListForDocs(payload);
				}
			}, 500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.templateNameSearchValue, info?.clientNameSearchValue],
	);

	const onGenerateAIFunc = () => {
		window.location.href = `${origin}/design-builder`;
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
					name: info?.clientNameSearchValue,
				},
			};
			getClientListForDocs(payload);
		} else if (filter === 'templateName') {
			const page = info?.currentPageForFilter?.templateName + 1;
			const limit = 10;
			const searchFilter = info?.templateNameSearchValue;
			getTemplatesListForDocs(page, limit, searchFilter);
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
		activeFileRef.current = data;
		setInfo((prev) => ({ ...prev, showRightDrawer: true, activeFileData: data }));
		getSmartFileInfo(data);
	}, []);

	const handleCloseSidebar = useCallback(() => {
		activeFileRef.current = null;
		setInfo((prev) => ({
			...prev,
			showRightDrawer: false,
			activeFileData: null,
		}));
		updateStateValues({ smartFileInfo: null });
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

	const refetchDocsFilesList = useCallback(() => {
		getDocsFilesListFunc(1);
	}, []);

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
	}, [info?.timeout, info?.searchValue, info?.selectedFilterOptions]);

	const openDeleteModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			deleteLeadModal: true,
		}));
	}, []);

	const deleteLeadFunc = useCallback(async () => {
		const activeFile = activeFileRef.current;
		const payload = {
			deleteWorkflowId: activeFile._id,
		};
		await deleteLead(payload);
		setInfo((prev) => ({
			...prev,
			docsData: prev.docsData?.filter((item) => item?._id !== activeFile._id),
			deleteLeadModal: false,
		}));
		handleCloseSidebar();
	}, []);

	const handleCreateBlankWorkflow = async () => {
		if (info?.blankWorkflowLoading) return;
		setInfo((prev) => ({ ...prev, blankWorkflowLoading: true }));
		const response = await createBlankWorkflow({
			workflowInput: {
				title: ' Untitled Workflow',
			},
		});
		if (response?.[0]) {
			window.location.href = `${origin}/workflow/${response?.[1]?.data?.createBlankWorkflow?._id}?workflow=true&templateId=${response?.[1]?.data?.createBlankWorkflow?.templateId}`;

			setInfo((prev) => ({ ...prev, blankWorkflowLoading: false }));
		} else {
			setInfo((prev) => ({ ...prev, blankWorkflowLoading: false }));
			message.error('Failed to create blank workflow');
		}
	};

	return (
		<div className="docsParentContainer">
			<div className="docsHeaderTitleContainer">
				<div className="docsHeaderTitleTextContainer">
					<div className="docsHeaderTitleText">
						<span className="lineOne">Create a</span>
						<span className="lineTwo">Document</span>
					</div>
					<div className="docsHeaderTitleTextSubTitle">
						Create documents like proposals, invoices, contracts, presentations, forms &
						more.
					</div>
				</div>
				<div className="quickActionsBtn">
					<QuickActions suggestedOptions={suggestedOptions} />
				</div>
			</div>

			<div className="docsParentHeaderContainer">
				<div className="docsHeaderButtons" onClick={onGenerateAIFunc}>
					<div className="docsHeaderButtonsTitle">Create a Document</div>
					<div className="docsHeaderSubButtonsSubTitleColored colorful">with Ai</div>
				</div>

				{/* <div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Import file or URL</div>
					<div className="docsHeaderSubButtonsSubTitleColored">
						Pick your template from playbook
					</div>
				</div> */}

				<div
					onClick={() => setInfo((prev) => ({ ...prev, proposalPopup: true }))}
					className="docsHeaderButtons"
				>
					{' '}
					<div className="docsHeaderButtonsTitle">Create from Saved Template</div>
					<div className="docsHeaderSubButtonsSubTitleColored">
						Generate document using saved template
					</div>
				</div>
				<div className="docsHeaderButtons" onClick={handleCreateBlankWorkflow}>
					<div className="docsHeaderButtonsTitle">
						{info?.blankWorkflowLoading ? (
							<Spinner height="20px" width="20px" />
						) : (
							'Create a Blank Document'
						)}
					</div>
					<div className="docsHeaderSubButtonsSubTitleColored">
						Create a blank workflow to start from scratch
					</div>
				</div>
			</div>
			{/* Ai Action is not ready yet: new Ui structure is ready */}
			{/* <div className="docsTemplatesContainer">
				<div className="promptHeader">
					<span>Suggested Prompt</span>
					<Sync />
				</div>

				<div className="docsTemplateContainer">
					{staticCreateActions?.map((ele, index) => (
						<div key={index} className="createStaticActionsCards">
							<span className="createStaticActionsCardsTitle">{ele?.type}</span>
							<span className="createStaticActionsCardsSubTitle">{ele?.prompt}</span>
						</div>
					))}
				</div>
			</div> */}

			<div className="docsFileContainer">
				<div className="docsFileHeaderContainer">
					<div className="docsFileHeaderContainerTitle">
						<span>Documents</span>
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
												[`${appliedFilter?.filter}SearchValue`]: '',
											}));
										}
									}}
									overlayClassName="filterTooltipPopUpContainer"
									placement="bottomLeft"
									title={
										<FilterPopUp
											filter={appliedFilter?.filter}
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
											searchValue={
												info?.[`${appliedFilter?.filter}SearchValue`]
											}
											setSearchValue={(filter, searchValue) =>
												handleFilterPopUpSearch(filter, searchValue)
											}
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
											className="removeFilterBtn"
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
							valueSelector="valueSelector"
							containerStyles={{
								borderRadius: '14px',
								background: '#202123',
								boxShadow: '0px 2px 44px 0px rgba(0, 0, 0, 0.25)',
							}}
							onOptionClick={handleSetActiveFilter}
						>
							<Filter style={{ width: '20px', height: '20px', marginTop: '6px' }} />
						</DropDown>
						{/* <ThreeDots /> */}
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
							height="calc(100vh - 310px)"
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
					refetchDocsFilesList={refetchDocsFilesList}
					openDeleteModal={openDeleteModal}
				/>

				<DeleteLeadModal
					open={info?.deleteLeadModal}
					closeModal={() => setInfo((prev) => ({ ...prev, deleteLeadModal: false }))}
					deleteLeadFunc={deleteLeadFunc}
				/>

				<ProposalPopup
					open={info?.proposalPopup}
					closeModal={() => setInfo((prev) => ({ ...prev, proposalPopup: false }))}
				/>
			</div>
		</div>
	);
};

export default memo(Docs);
