import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflow.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalWorkflowCard from '../../components/sales/globalWorkflowCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';
import GlobalWorkflowModal from '../../components/modalsV2/workflowsModals/GlobalWorkflowModal';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import GlobalProposalsCard from '../../components/sales/globalProposalsCard';
import Skeleton from 'react-loading-skeleton';
import { FetchMoreLoaderComp } from '../../../helpers';
import backgroundImage from '../../../assets/svg/sales/start.jpg';
import { get } from 'lodash';

const options = [
	{ id: 1, name: 'Design Files', value: '' },
	{ id: 2, name: 'Form', value: 'form-submission' },
	{ id: 3, name: 'Proposals', value: 'proposal' },
	{ id: 4, name: 'Presentation', value: 'presentation' },
	{ id: 5, name: 'Contract', value: 'contract' },
	{ id: 6, name: 'Invoice', value: 'invoice' },
	// { id: 7, name: 'Automation', value: 'automation' },
];

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
			return updateSubscriptionState({ expiredSubscriptionModal: true });
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
				window.location.href = `${origin}/${response?.[1]?._id}`;
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
				<div
					className={`playbook-wrapper`}
					style={{
						// background: `url(${backgroundImage})`,
						// backgroundSize: 'cover',
						// backgroundPosition: 'top',
						// backgroundRepeat: 'no-repeat',
						height: '100vh',
						width: '100%',
					}}
				>
					<div className={`globalWorkflowContainer`}>
						<div className={`left_div  ${info?.modalIsOpen ? 'modal-open' : ''}`}>
							<div className="left_child_div">
								<h2 className="side_heading">Templates</h2>
								<p className="side_text">
									We have specially curated best workflows and designs that suit
									your business
								</p>
							</div>

							<div className="options_div">
								<input
									type="text"
									placeholder="search"
									className="search_bar"
									style={{ color: 'var(--primary-font)' }}
									value={searchQuery}
									onChange={handleSearch}
								/>
								<h2
									style={{
										fontSize: '18px',
										paddingBottom: '30px',
										color: 'var(--primary-font)',
										fontWeight: '400',
									}}
								>
									What are you Offering?
								</h2>
								<div className="options">
									{options?.map((each, index) => (
										<div key={index}>
											<li
												className={`options_style ${
													selectedOption === each ? 'selected' : ''
												}`}
												onClick={() => handleOptionSelect(each)}
											>
												{each?.name}
											</li>
										</div>
									))}
								</div>
							</div>
						</div>
						<div
							className={`mainContentContainer ${
								info?.modalIsOpen ? 'modal-open' : ''
							}`}
							id="templatesScrollableTarget"
						>
							{info?.isExpanded ? (
								<div
									style={{
										position: 'absolute',
										width: '420px',
										display: 'flex',
										// transition:
										//  'opacity 0.3s ease-out, transform 0.3s ease-out',
										opacity: info?.isExpanded ? 1 : 0,
										transform: info?.isExpanded
											? 'translateX(0)'
											: 'translateX(-100%)',
										flexDirection: 'column',
										alignItems: 'flex-start',
										gap: '32px',
										marginTop: '25%',
										marginLeft: '10%',
									}}
								>
									<div>
										<span className="dior-studio-text">By Ve.ai</span>
									</div>
									<div className="workflow-title-container">
										<div className="workflow-title">
											{info?.activeTemplateData?.title}
										</div>
										<div className="workflow-description">
											{info?.activeTemplateData?.description ||
												'Ideal for wedding photography business with multiple events, selectable packages and services, this workflow provides customisable design in enquiry forms, proposals, invoices for multiple payment schedule and hassle contracts with e-sign contracts'}
										</div>
										<div></div>
										<div>
											<button
												className="buy-button"
												onClick={onCustomiseFunc}
												style={{ cursor: 'pointer' }}
											>
												Add to workspace
											</button>
										</div>
									</div>
								</div>
							) : (
								<div
									style={{
										position: 'relative',
										opacity: info?.isExpanded ? 0 : 1,
										transform: info?.isExpanded
											? 'translateX(-100%)'
											: 'translateX(0)',
										transition:
											'opacity 0.3s ease-out, transform 0.3s ease-out',
										width: '100%',
										visibility: info?.isExpanded ? 'hidden' : 'visible',
										pointerEvents: info?.isExpanded ? 'none' : 'auto',
									}}
								>
									<InfiniteScroll
										dataLength={info?.globalWorkflowData?.length || 0}
										next={fetchMoreGlobalWorkflows}
										hasMore={info?.hasNextPage}
										loader={<FetchMoreLoaderComp />}
										scrollableTarget="templatesScrollableTarget"
										// height="calc(100vh - 100px)"
										height={'100vh'}
									>
										<div className="globalWorkflowParentCardContainer">
											{info.isLoading || info.searchLoading ? (
												<div
													style={{
														display: 'grid',
														gridTemplateColumns:
															selectedOption === 'Workflow'
																? '1fr'
																: 'repeat(2, 1fr)',
														gap: '16px',
														width: '100%',
														maxWidth: '100%',
													}}
												>
													{[
														...Array(
															selectedOption === 'Workflow' ? 3 : 6,
														),
													].map((_, index) => (
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
													))}
												</div>
											) : (
												<>
													{selectedOption !== 'automation' ? (
														moduleTemplateData?.length === 0 &&
														searchQuery ? (
															<NoResultsFound
																searchQuery={searchQuery}
															/>
														) : (
															<GlobalProposalsCard
																data={
																	info?.globalWorkflowData || []
																}
																onClickFunc={openModal}
																modalIsOpen={info.modalIsOpen}
																isLoading={info.isLoading}
															/>
														)
													) : info?.globalWorkflowData?.length === 0 &&
													  searchQuery ? (
														<NoResultsFound searchQuery={searchQuery} />
													) : (
														info?.globalWorkflowData?.map(
															(ele, index) => (
																<GlobalWorkflowCard
																	key={index}
																	data={ele}
																	onClickFunc={openModal}
																	isSelected={
																		ele?._id ===
																		info?.selectedWorkflowId
																	}
																/>
															),
														)
													)}
												</>
											)}
										</div>
									</InfiniteScroll>
								</div>
							)}
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
