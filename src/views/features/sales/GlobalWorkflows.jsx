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
const FetchMoreLoaderComp = () => {
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

const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

const GlobalWorkflows = () => {
	const location = useLocation();
	const [selectedOption, setSelectedOption] = useState('Workflow');
	const [moduleTemplateData, setModuleTemplateData] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearchQuery = useDebounce(searchQuery, 500);
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

	const [info, setInfo] = useState({
		loading: true,
		isLoading: false,
		globalWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		modalIsOpen: false,
		activeTemplateData: null,
		selectedModule: null,
		selectedWorkflowId: null,
		isExpanded: false,
	});

	useEffect(() => {
		if (selectedOption === 'Workflow') {
			getGlobalWorkflowTemplatesData(1);
		}
	}, [debouncedSearchQuery]);

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
		if (selectedOption !== 'Workflow') {
			const fetchFilteredTemplates = async () => {
				setInfo((prev) => ({ ...prev, isLoading: true }));
				setModuleTemplateData(null);

				const payload = {
					page: 1,
					limit: 10,
					type: 'global',
					module: selectedOption.toLowerCase(),
					...(debouncedSearchQuery && { title: debouncedSearchQuery }),
				};

				const [success, response] = await getModuleTemplate(payload);
				if (success) {
					setModuleTemplateData(response.templates);
				}
				setInfo((prev) => ({ ...prev, isLoading: false }));
			};
			fetchFilteredTemplates();
		}
	}, [selectedOption]);

	useEffect(() => {
		if (selectedOption !== 'Workflow' && debouncedSearchQuery) {
			const fetchFilteredTemplates = async () => {
				setInfo((prev) => ({ ...prev, isLoading: true }));
				setModuleTemplateData(null);

				const payload = {
					page: 1,
					limit: 10,
					type: 'global',
					module: selectedOption.toLowerCase(),
					title: debouncedSearchQuery,
				};

				const [success, response] = await getModuleTemplate(payload);
				if (success) {
					setModuleTemplateData(response.templates);
				}
				setInfo((prev) => ({ ...prev, isLoading: false }));
			};
			fetchFilteredTemplates();
		}
	}, [debouncedSearchQuery, selectedOption]);

	const handleOptionSelect = useCallback(
		(option) => {
			if (option === selectedOption) return;
			setInfo((prev) => ({ ...prev, isLoading: true }));
			setSelectedOption(option);
			setSearchQuery('');
			setModuleTemplateData(null);
		},
		[selectedOption],
	);

	const getGlobalWorkflowTemplatesData = useCallback(
		(page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					type: 'global',
					sortBy: 'createdAt',
					sortType: -1,
					title: debouncedSearchQuery,
				},
			};
			getGlobalWorkflows(payload, fetchMore);
		},
		[debouncedSearchQuery],
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

			if (fetchMore) {
				globalWorkflowData = [...(info?.globalWorkflowData || [])]?.concat(
					globalWorkflowData,
				);
			}
			if (!fetchMore && globalWorkflowData?.length < 3 && hasNextPage) {
				getGlobalWorkflowTemplatesData(currentPage + 1, true);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				globalWorkflowData,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.globalWorkflowData],
	);

	const fetchMoreGlobalWorkflows = useCallback(() => {
		getGlobalWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

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

	const handleSearch = useCallback((e) => {
		setSearchQuery(e.target.value);
	}, []);

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

	return (
		<>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
				<div className={`playbook-wrapper`}>
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
										<div>
											{/* <span className="active-users-text">12k active users</span> */}
										</div>
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
														isLoading={info.isLoading}
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
							templateData={info?.activeTemplateData}
							isProposal={selectedOption !== 'Workflow'}
							isExpanded={info?.isExpanded}
							setIsExpanded={(value) => {
								setInfo((prev) => ({ ...prev, isExpanded: value }));
							}}
							{...(selectedOption !== 'Workflow' && {
								moduleName: info?.selectedModule,
								templateTitle: info?.activeTemplateData?.title,
							})}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(GlobalWorkflows);
