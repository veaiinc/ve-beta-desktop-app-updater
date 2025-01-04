import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflow.scss';
import { useLocation } from 'react-router-dom';
import GlobalWorkflowCard from '../../components/sales/globalWorkflowCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';
import GlobalWorkflowModal from '../../components/modalsV2/workflowsModals/GlobalWorkflowModal';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import GlobalProposalsCard from '../../components/sales/globalProposalsCard';
import { throttle } from 'lodash';
import Skeleton from 'react-loading-skeleton';
const FetchMoreLoaderComp = ({ dataLength, hasMore, filter }) => {
	if (dataLength === 0 || !hasMore) return null;

	return (
		<h4
			style={{
				display: 'flex',
				gap: '12px',
				color: '#fff',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spinner width={'12px'} height={'12px'} />
			Fetching More...
		</h4>
	);
};

const options = ['Workflow', 'Proposal', 'Form', 'Invoice', 'Contract'];
const useDebounce = (value) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [value]);

	return debouncedValue;
};

const GlobalMyTemplates = () => {
	const location = useLocation();
	const [selectedOption, setSelectedOption] = useState('Workflow');
	const [moduleTemplateData, setModuleTemplateData] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearchQuery = useDebounce(searchQuery, 500);
	const [moduleInfo, setModuleInfo] = useState({
		currentPage: 1,
		hasNextPage: false,
	});

	let {
		templates: { getGlobalWorkflows, globalMoreWorkflows, globalWorkflows, getModuleTemplate },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		searchLoading: false,
		globalWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		modalIsOpen: false,
		activeTemplateData: null,
		isLoading: false,
		isExpanded: false,
	});

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
		if (selectedOption === 'Workflow') {
			const payload = {
				filters: {
					limit: 10,
					page: 1,
					type: 'workspace',
					sortBy: 'createdAt',
					sortType: -1,
					title: debouncedSearchQuery,
				},
			};
			setInfo((prev) => ({ ...prev, searchLoading: true }));
			getGlobalWorkflows(payload, false);
		} else {
			// Handle other modules search
			const payload = {
				page: 1,
				limit: 10,
				type: 'workspace',
				module: selectedOption.toLowerCase(), // Only include title if there's a search query
			};

			if (debouncedSearchQuery.trim()) {
				payload.title = debouncedSearchQuery.trim();
			}

			setModuleTemplateData(null); // Clear existing data while loading
			getModuleTemplate(payload).then(([success, response]) => {
				if (success) {
					setModuleTemplateData(response.templates);
					setModuleInfo({
						currentPage: 1,
						hasNextPage: response.hasNextPage,
					});
				}
				setInfo((prev) => ({ ...prev, searchLoading: false }));
			});
		}
	}, [debouncedSearchQuery, selectedOption]);

	const handleOptionSelect = useCallback(
		async (option) => {
			if (option === selectedOption) return;

			setSelectedOption(option);
			setModuleTemplateData(null);
			setModuleInfo({ currentPage: 1, hasNextPage: false });
			setSearchQuery('');

			if (option !== 'Workflow') {
				const payload = {
					page: 1,
					limit: 10,
					type: 'workspace',
					module: option.toLowerCase(),
				};
				const [success, response] = await getModuleTemplate(payload);
				if (success) {
					setModuleTemplateData(response.templates);
					setModuleInfo({
						currentPage: 1,
						hasNextPage: response.hasNextPage,
					});
				}
			}
		},
		[selectedOption],
	);

	const fetchMoreModuleTemplates = useCallback(async () => {
		if (moduleInfo.hasNextPage) {
			const payload = {
				page: moduleInfo.currentPage + 1,
				limit: 10,
				type: 'workspace',
				module: selectedOption.toLowerCase(),
			};
			const [success, response] = await getModuleTemplate(payload);
			if (success) {
				setModuleTemplateData((prev) => [...prev, ...response.templates]);
				setModuleInfo({
					currentPage: moduleInfo.currentPage + 1,
					hasNextPage: response.hasNextPage,
				});
			}
		}
	}, [moduleInfo, selectedOption, getModuleTemplate]);

	const getGlobalWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		if (page === 1 && !fetchMore && !debouncedSearchQuery) {
			setInfo((prev) => ({ ...prev, loading: true }));
		}
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				sortBy: 'createdAt',
				sortType: -1,
				title: debouncedSearchQuery,
			},
		};
		getGlobalWorkflows(payload, fetchMore);
	}, []);

	const globalWorkflowsDataParser = useCallback((dataToBeUsed, fetchMore = false) => {
		let { data, currentPage, hasNextPage } = dataToBeUsed;
		// Simplified data handling
		setInfo((prev) => ({
			...prev,
			loading: false,
			searchLoading: false, // Reset search loading here too
			globalWorkflowData: fetchMore ? [...(prev.globalWorkflowData || []), ...data] : data,
			currentPage,
			hasNextPage,
		}));
	}, []);
	const fetchMoreGlobalWorkflows = useCallback(() => {
		if (info?.hasNextPage) {
			getGlobalWorkflowTemplatesData(info?.currentPage + 1, true);
		}
	}, [info?.hasNextPage, info?.currentPage, getGlobalWorkflowTemplatesData]);

	const openModal = useCallback(
		(data) => {
			setInfo((prev) => ({
				...prev,
				modalIsOpen: true,
				activeTemplateData: data,
				selectedModule: module || selectedOption.toLowerCase(),
				isExpanded: false,
				selectedWorkflowId: data?._id,
			}));
		},
		[selectedOption],
	);

	const closeModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: false,
			activeTemplateData: null,
			isExpanded: false,
		}));
	}, []);

	const getFilteredData = useCallback(() => {
		const dataToFilter =
			selectedOption === 'Workflow' ? info?.globalWorkflowData : moduleTemplateData;
		if (!dataToFilter) return [];
		if (!debouncedSearchQuery.trim()) return dataToFilter;

		return dataToFilter?.filter((item) =>
			item.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
		);
	}, [debouncedSearchQuery, selectedOption, info?.globalWorkflowData, moduleTemplateData]);

	const handleSearch = useCallback((e) => {
		const newSearchQuery = e.target.value;
		setSearchQuery(newSearchQuery);
	}, []);

	return (
		<>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
				<div className={`playbook-wrapper`}>
					<div className={`globalWorkflowContainer`}>
						<div className={`left_div  ${info.modalIsOpen ? 'modal-open' : ''}`}>
							<div className="left_child_div">
								<h2 className="side_heading">MyTemplates</h2>
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
									style={{ color: 'white' }}
									value={searchQuery}
									onChange={handleSearch}
								/>
								<h2
									style={{
										fontSize: '18px',
										paddingBottom: '30px',
										color: 'white',
										fontWeight: '400',
									}}
								>
									What are you Offering?
								</h2>
								<div className="options">
									{options.map((each, index) => (
										<div key={index}>
											<li
												className={`options_style ${
													selectedOption === each ? 'selected' : ''
												}`}
												onClick={() => handleOptionSelect(each)}
											>
												{each}
											</li>
										</div>
									))}
								</div>
							</div>
						</div>
						<div
							className={`mainContentContainer  ${
								info.modalIsOpen ? 'modal-open' : ''
							}`}
						>
							{/* <div className="gloablWorkflowHeader">Choose a Workflow</div> */}
							{info?.isExpanded ? (
								<div
									style={{
										position: 'absolute',
										width: '420px',
										opacity: info?.isExpanded ? 1 : 0,
										transform: info?.isExpanded
											? 'translateX(0)'
											: 'translateX(-100%)',
										transition:
											'opacity 0.3s ease-out, transform 0.3s ease-out',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
										gap: '32px',
										marginTop: '30%',
										marginLeft: '0',
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
										<div>
											{/* <span className="active-users-text">12k active users</span> */}
										</div>
										<div>
											{/* <button
												className="buy-button"
												onClick={onCustomiseFunc}
												style={{ cursor: 'pointer' }}
											>
												Add to workspace
											</button> */}
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
										loader={
											<FetchMoreLoaderComp
												dataLength={info?.globalWorkflowData?.length || 0}
												hasMore={info?.hasNextPage}
											/>
										}
										scrollableTarget={'scrollableTarget'}
										className="scrollableTarget"
									>
										<div className="globalWorkflowParentCardContainer">
											{selectedOption !== 'Workflow' ? (
												info.isLoading ? (
													<div
														style={{
															display: 'grid',
															gridTemplateColumns: 'repeat(2, 1fr)',
															gap: '16px',
															width: '100%',
															maxWidth: '100%',
														}}
													>
														{[...Array(6)].map((_, index) => (
															<Skeleton
																key={index}
																width="100%"
																height={'268px'}
																baseColor="transparent"
																highlightColor="rgba(255, 255, 255, 0.20)"
																opacity={0.5}
															/>
														))}
													</div>
												) : (
													<GlobalProposalsCard
														data={moduleTemplateData || []}
														onClickFunc={openModal}
														modalIsOpen={info.modalIsOpen}
													/>
												)
											) : (
												info?.globalWorkflowData?.map((ele, index) =>
													!info.globalWorkflowData ? (
														<Skeleton
															width={'100%'}
															height={'300px'}
															baseColor="transparent"
															highlightColor="rgba(255, 255, 255, 0.20)"
															opacity={0.5}
														/>
													) : (
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
										</div>
									</InfiniteScroll>
								</div>
							)}
						</div>

						<GlobalWorkflowModal
							modalIsOpen={info?.modalIsOpen}
							closeModal={closeModal}
							globalTemplateId={info?.activeTemplateData?._id}
							isProposal={selectedOption !== 'Workflow'}
							moduleName={
								selectedOption !== 'Workflow'
									? selectedOption.toLowerCase()
									: undefined
							}
							templateTitle={
								selectedOption !== 'Workflow'
									? info?.activeTemplateData?.title
									: undefined
							}
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

export default memo(GlobalMyTemplates);
