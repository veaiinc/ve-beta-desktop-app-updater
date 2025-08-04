import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflow.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalWorkflowCard from '../../components/sales/globalWorkflowCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
// import Spinner from '../../components/loaders/Spinner';
import GlobalWorkflowModal from '../../components/modalsV2/workflowsModals/GlobalWorkflowModal';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import GlobalProposalsCard from '../../components/sales/globalProposalsCard';
import Skeleton from 'react-loading-skeleton';
import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import '../../../assets/scss/sales/globalProposalCard.scss';

const options = [
	{ id: 1, name: 'Design Files', value: '' },
	{ id: 2, name: 'Forms', value: 'form-submission' },
	{ id: 3, name: 'Proposals', value: 'proposal' },
	{ id: 4, name: 'Presentations', value: 'presentation' },
	{ id: 5, name: 'Contract', value: 'contract' },
	{ id: 6, name: 'Invoice', value: 'invoice' },
	// { id: 7, name: 'Automation', value: 'automation' },
];

const origin = fetchOriginSelection();

const NoResultsFound = ({ searchQuery }) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			padding: '40px',
			color: '#fff',
			textAlign: 'center',
		}}
	>
		<h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No results found</h3>
		<p style={{ color: 'white', fontSize: '14px' }}>
			We couldn't find any matches for "{searchQuery}"
		</p>
	</div>
);

const GlobalWorkflows = () => {
	const navigate = useNavigate();
	let {
		templates: {
			getGlobalWorkflows,
			globalMoreWorkflows,
			globalWorkflows,
			getModuleTemplate,
			duplicateGlobalWorkflowTemplate,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [selectedOption, setSelectedOption] = useState('Workflow');
	const [moduleTemplateData, setModuleTemplateData] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');

	const [info, setInfo] = useState({
		loading: true,
		isLoading: true,
		searchLoading: false,
		globalWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		modalIsOpen: false,
		activeTemplateData: null,
		selectedModule: null,
		selectedWorkflowId: null,
		isExpanded: false,
		searchChanged: false,
		timeout: null,
	});

	const [moduleInfo, setModuleInfo] = useState({
		currentPage: 1,
		hasNextPage: false,
	});

	//useEffects
	useEffect(() => {
		getGlobalWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (globalWorkflows) {
			globalWorkflowsDataParser(globalWorkflows);
		}
	}, [globalWorkflows]);

	useEffect(() => {
		if (globalMoreWorkflows) {
			globalWorkflowsDataParser(globalMoreWorkflows, true);
		}
	}, [globalMoreWorkflows]);

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebounceSearch();
		}
	}, [searchQuery, info?.searchChanged]);

	// const fetchFilteredTemplates = async (option) => {
	// 	// setInfo((prev) => ({ ...prev, isLoading: true }));
	// 	setModuleTemplateData(null);

	// 	const payload = {
	// 		page: 1,
	// 		limit: 10,
	// 		type: 'global',
	// 		module: option.toLowerCase(),
	// 	};
	// 	if (searchQuery?.length) {
	// 		payload.title = searchQuery;
	// 	}

	// 	const [success, response] = await getModuleTemplate(payload);
	// 	if (success) {
	// 		setModuleTemplateData(response?.templates);
	// 		setModuleInfo({
	// 			currentPage: 1,
	// 			hasNextPage: response?.hasNextPage,
	// 		});
	// 	}
	// 	setInfo((prev) => ({ ...prev, isLoading: false }));
	// };

	const handleOptionSelect = useCallback(
		(option) => {
			if (option === selectedOption) return;
			setInfo((prev) => ({ ...prev, isLoading: true }));
			setSelectedOption(option?.value);
			setSearchQuery('');
			setModuleInfo({ currentPage: 1, hasNextPage: false });
			getGlobalWorkflowTemplatesData(1, false, option?.value);
		},
		[selectedOption],
	);

	const getGlobalWorkflowTemplatesData = useCallback(
		(page, fetchMore = false, option = '', searchQuery) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					type: 'global',
					sortBy: 'createdAt',
					sortType: -1,
					action: option,
				},
			};

			if (searchQuery?.length) {
				payload.filters.title = searchQuery;
			}
			getGlobalWorkflows(payload, fetchMore);
		},
		[searchQuery],
	);

	const globalWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let globalWorkflowData = [];

			for (let i = 0; i < data?.length; i++) {
				if (!data?.[i]?.tenantId || data?.[i]?.tenantId === null) {
					globalWorkflowData?.push(data?.[i]);
				}
			}

			setInfo((prev) => ({
				...prev,
				loading: false,
				searchLoading: false,
				isLoading: false,
				globalWorkflowData: fetchMore
					? [...(prev.globalWorkflowData || []), ...globalWorkflowData]
					: globalWorkflowData,
				currentPage,
				hasNextPage,
			}));
		},
		[selectedOption],
	);

	const fetchMoreGlobalWorkflows = useCallback(
		(selectedOption) => {
			if (info?.hasNextPage && !info?.isLoading) {
				getGlobalWorkflowTemplatesData(info?.currentPage + 1, true, selectedOption);
			}
		},
		[
			info?.hasNextPage,
			info?.currentPage,
			info?.isLoading,
			getGlobalWorkflowTemplatesData,
			selectedOption,
		],
	);

	const openModal = useCallback((data, module) => {
		if (!data) {
			console.error('No template data provided');
			return;
		}
		const templateData = typeof data === 'string' ? { _id: data } : data;
		setInfo((prev) => ({
			...prev,
			modalIsOpen: true,
			activeTemplateData: templateData,
			selectedModule: module,
		}));
	}, []);

	const closeModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: false,
			activeTemplateData: null,
			isExpanded: false,
		}));
	}, []);

	const handleSearch = useCallback(
		(e) => {
			const newSearchQuery = e?.target?.value;
			setSearchQuery(newSearchQuery);
			setInfo((prev) => ({ ...prev, searchChanged: true }));
		},
		[info],
	);
	const handleDebounceSearch = useCallback(async () => {
		clearInterval(info?.timeout);
		const timeout = setTimeout(async () => {
			await getGlobalWorkflowTemplatesData(1, false, selectedOption, searchQuery);
			setInfo((prev) => ({
				...prev,
				searchLoading: false,
				timeout: null,
				isLoading: false,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, selectedOption, searchQuery]);

	const onCustomiseFunc = useCallback(async () => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Workflows',
			});
		}
		if (info?.duplicateApiLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, duplicateApiLoading: true }));
		const payload = {
			templateId: info?.activeTemplateData?._id,
			title: info?.activeTemplateData?.title,
		};
		const response = await duplicateGlobalWorkflowTemplate(payload);
		setInfo((prev) => ({ ...prev, duplicateApiLoading: false }));
		if (response?.[0]) {
			if (info?.activeTab !== 'design') {
				return navigate(`/workflow_builder/${response?.[1]?._id}`);
			} else {
				navigate(`/builder/${response?.[1]?._id}`);
				return;
			}
		}
	}, [info?.activeTemplateData, info?.duplicateApiLoading, selectedOption]);

	// const fetchMoreModuleTemplates = useCallback(async () => {
	// 	if (!moduleInfo?.hasNextPage || info?.isLoading) return;

	// 	const payload = {
	// 		page: (moduleInfo?.currentPage || 0) + 1,
	// 		limit: 10,
	// 		type: 'global',
	// 		module: selectedOption?.toLowerCase(),
	// 	};
	// 	if (searchQuery?.length) {
	// 		payload.title = searchQuery;
	// 	}

	// 	try {
	// 		const [success, response] = await getModuleTemplate(payload);
	// 		if (success && response?.templates) {
	// 			setModuleTemplateData((prev) => [...(prev || []), ...response?.templates]);
	// 			setModuleInfo({
	// 				currentPage: moduleInfo?.currentPage + 1,
	// 				hasNextPage: response?.hasNextPage,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error('Error fetching more templates:', error);
	// 	} finally {
	// 		setInfo((prev) => ({ ...prev, isLoading: false }));
	// 	}
	// }, [
	// 	moduleInfo?.hasNextPage,
	// 	moduleInfo?.currentPage,
	// 	selectedOption,
	// 	info?.isLoading,
	// 	searchQuery,
	// ]);

	return (
		<>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
				<div className="playbook-wrapper">
					<div className="globalWorkflowContainer">
						{/* Top Navigation Bar */}
						<div className="top-navigation">
							<div className="nav-categories">
								{options?.map((each, index) => (
									<div
										key={index}
										className={`nav-category ${
											selectedOption === each?.value ? 'active' : ''
										}`}
										onClick={() => handleOptionSelect(each)}
									>
										{each?.name}
									</div>
								))}
							</div>
							<div className="nav-search">
								<div className="search-icon">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path
											d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="main-content">
							{/* Title */}
							<div className="page-title">
								<h1>Use cases from <span>ve.ai</span></h1>
							</div>

							{/* Search and Filter Bar */}
							<div className="filter-bar">
								<div className="filter-categories">
									{options?.map((each, index) => (
										<div
											key={index}
											className={`filter-category ${
												selectedOption === each?.value ? 'active' : ''
											}`}
											onClick={() => handleOptionSelect(each)}
										>
											{each?.name}
										</div>
									))}
								</div>
								<div className="search-container">
									<input
										type="text"
										placeholder="Search templates..."
										className="search-input"
										value={searchQuery}
										onChange={handleSearch}
									/>
								</div>
							</div>

							{/* Templates Grid */}
							<div className="templates-grid-container">
								{info.isLoading || info.searchLoading ? (
									<div className="skeleton-grid">
										{[...Array(selectedOption === 'Workflow' ? 3 : 6)].map(
											(_, index) => (
												<Skeleton
													key={index}
													width="100%"
													height={
														selectedOption === 'Workflow'
															? '300px'
															: '268px'
													}
													baseColor="transparent"
													highlightColor="rgba(255, 255, 255, 0.20)"
													opacity={0.5}
												/>
											),
										)}
									</div>
								) : (
									<InfiniteScroll
										dataLength={info?.globalWorkflowData?.length || 0}
										next={fetchMoreGlobalWorkflows}
										hasMore={info?.hasNextPage}
										loader={<FetchMoreLoaderComp />}
										className="templates-grid"
									>
										{selectedOption !== 'automation' ? (
											moduleTemplateData?.length === 0 && searchQuery ? (
												<NoResultsFound searchQuery={searchQuery} />
											) : (
												<div className="mainProposalsCard">
													{info?.globalWorkflowData?.map(
														(template, index) => (
															<div
																key={index}
																className="globalProposalsCardContainer"
																onClick={() => {
																	if (!template?._id) {
																		return;
																	}
																	openModal(
																		template,
																		template.module,
																	);
																}}
															>
																<div className="imageContainer2">
																	<div className="templateCard2">
																		<div className="iframeContainer">
																			<iframe
																				src={`/builder/preview/short/${template?._id}?module=${template?.moduleTemplates?.[0]?._id}&isPubic=${template?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
																				title="Builder Preview"
																				width="100%"
																				height="100%"
																				style={{
																					cursor: 'pointer',
																					pointerEvents:
																						'none',
																					border: 'none',
																					backgroundColor:
																						'#fff',
																				}}
																			/>
																		</div>
																	</div>
																</div>
																<h4
																	className="templateTitle"
																	style={{ fontSize: '14px' }}
																>
																	{template.title}
																</h4>
															</div>
														),
													)}
												</div>
											)
										) : info?.globalWorkflowData?.length === 0 &&
										  searchQuery ? (
											<NoResultsFound searchQuery={searchQuery} />
										) : (
											info?.globalWorkflowData?.map((ele, index) => (
												<GlobalWorkflowCard
													key={index}
													data={ele}
													onClickFunc={openModal}
													isSelected={
														ele?._id === info?.selectedWorkflowId
													}
												/>
											))
										)}
									</InfiniteScroll>
								)}
							</div>
						</div>

						<GlobalWorkflowModal
							modalIsOpen={info?.modalIsOpen}
							closeModal={closeModal}
							globalTemplateId={info?.activeTemplateData?._id}
							templateData={info?.activeTemplateData}
							isProposal={selectedOption !== 'automation'}
							isExpanded={info?.isExpanded}
							setIsExpanded={(value) => {
								setInfo((prev) => ({ ...prev, isExpanded: value }));
							}}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(GlobalWorkflows);
