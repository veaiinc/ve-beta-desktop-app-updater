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

const GlobalMyTemplates = () => {
	const location = useLocation();
	const isPlaybookRoute =
		location.pathname === '/playbook' || location.pathname === '/my-templates';
	const [selectedOption, setSelectedOption] = useState('Workflow');
	const [moduleTemplateData, setModuleTemplateData] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [moduleInfo, setModuleInfo] = useState({
		currentPage: 1,
		hasNextPage: false,
	});

	let {
		templates: { getGlobalWorkflows, globalMoreWorkflows, globalWorkflows, getModuleTemplate },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		globalWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		modalIsOpen: false,
		activeTemplateData: null,
		isLoading: false,
		isExpanded: false,
	});

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

	const handleOptionSelect = useCallback(
		async (option) => {
			setSelectedOption(option);
			setModuleTemplateData(null);
			setModuleInfo({ currentPage: 1, hasNextPage: false });

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
		},
		[getModuleTemplate],
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
		setInfo((prev) => ({ ...prev, loading: true }));
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				sortBy: 'createdAt',
				sortType: -1,
				title: searchQuery,
			},
		};
		getGlobalWorkflows(payload, fetchMore);
	}, []);

	const globalWorkflowsDataParser = useCallback((dataToBeUsed, fetchMore = false) => {
		let { data, currentPage, hasNextPage } = dataToBeUsed;
		// Simplified data handling
		if (fetchMore) {
			setInfo((prev) => ({
				...prev,
				loading: false,
				globalWorkflowData: [...(prev.globalWorkflowData || []), ...data],
				currentPage,
				hasNextPage,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				loading: false,
				globalWorkflowData: data,
				currentPage,
				hasNextPage,
			}));
		}
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
				selectedOption: selectedOption,
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
		if (!searchQuery.trim()) return dataToFilter;

		return dataToFilter?.filter((item) =>
			item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery, selectedOption, info?.globalWorkflowData, moduleTemplateData]);

	const handleSearch = useCallback(
		throttle((e) => {
			const newSearchQuery = e.target.value;
			setSearchQuery(newSearchQuery);

			if (selectedOption === 'Workflow') {
				if (!newSearchQuery.trim()) {
					getGlobalWorkflowTemplatesData(1, false);
				} else {
					const payload = {
						filters: {
							limit: 10,
							page: 1,
							type: 'workspace',
							sortBy: 'createdAt',
							sortType: -1,
							title: newSearchQuery,
						},
					};
					getGlobalWorkflows(payload, false);
				}
			} else {
				// Handle other modules search
				const payload = {
					page: 1,
					limit: 10,
					type: 'workspace',
					module: selectedOption.toLowerCase(),
					title: newSearchQuery.trim(), // Only include title if there's a search query
				};

				// If search is empty, remove the title field
				if (!newSearchQuery.trim()) {
					delete payload.title;
				}

				getModuleTemplate(payload).then(([success, response]) => {
					if (success) {
						setModuleTemplateData(response.templates);
						setModuleInfo({
							currentPage: 1,
							hasNextPage: response.hasNextPage,
						});
					}
				});
			}
		}, 200),
		[getGlobalWorkflowTemplatesData, getGlobalWorkflows, getModuleTemplate, selectedOption],
	);

	return (
		<>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
				<div className={`playbook-wrapper ${isPlaybookRoute ? 'with-background' : ''}`}>
					<div className={`globalWorkflowContainer`}>
						<div className={`left_div  ${info.modalIsOpen ? 'modal-open' : ''}`}>
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
										marginTop: '20%',
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
										loader={<FetchMoreLoaderComp />}
										scrollableTarget={'scrollableTarget'}
										className="scrollableTarget"
									>
										<div className="globalWorkflowParentCardContainer">
											{selectedOption !== 'Workflow' ? (
												<GlobalProposalsCard
													data={getFilteredData(moduleTemplateData)}
													onClickFunc={(data, module) => {
														openModal(data, module);
													}}
													modalIsOpen={info.modalIsOpen}
													isLoading={!info.isLoading}
												/>
											) : (
												getFilteredData(info?.globalWorkflowData)?.map(
													(ele, index) =>
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

						{info?.modalIsOpen &&
							(selectedOption === 'Workflow' ? (
								<GlobalWorkflowModal
									modalIsOpen={info?.modalIsOpen}
									closeModal={closeModal}
									globalTemplateId={info?.activeTemplateData?._id}
									isProposal={false}
									isExpanded={info?.isExpanded}
									setIsExpanded={(value) => {
										setInfo((prev) => ({ ...prev, isExpanded: value }));
									}}
								/>
							) : (
								<GlobalWorkflowModal
									modalIsOpen={info?.modalIsOpen}
									closeModal={closeModal}
									globalTemplateId={info?.activeTemplateData?._id}
									moduleName={info?.selectedModule}
									templateTitle={info?.activeTemplateData?.title}
									isProposal={true}
									isExpanded={info?.isExpanded}
									setIsExpanded={(value) => {
										setInfo((prev) => ({ ...prev, isExpanded: value }));
									}}
								/>
							))}
					</div>
				</div>
			)}
		</>
	);
};

export default memo(GlobalMyTemplates);
