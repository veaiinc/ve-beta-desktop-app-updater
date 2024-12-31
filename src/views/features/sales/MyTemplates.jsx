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

const GlobalWorkflows = () => {
	const location = useLocation();
	const isPlaybookRoute = location.pathname === '/playbook' || '/my-templates';
	const [selectedOption, setSelectedOption] = useState('Workflow');
	const [moduleTemplateData, setModuleTemplateData] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
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
		selectedModule: null,
		selectedWorkflowId: null,
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
			const payload = {
				page: 1,
				limit: 10,
				type: 'workspace',
				module: option.toLowerCase(),
			};
			const [success, response] = await getModuleTemplate(payload);
			if (success) {
				console.log('Module templates loaded:', response.templates);
				setModuleTemplateData(response.templates);
			}
		},
		[getModuleTemplate],
	);

	const getGlobalWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getGlobalWorkflows(payload, fetchMore);
	}, []);

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

	const openModal = useCallback(
		(data, module) => {
			console.log('openModal received:', { data, module }); // Add this log
			if (!data) {
				console.error('No template data provided');
				return;
			}
			const templateData = typeof data === 'string' ? { _id: data } : data;
			setInfo((prev) => ({
				...prev,
				modalIsOpen: true,
				activeTemplateData: templateData,
				selectedOption: selectedOption,
				selectedModule: module,
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

	const getFilteredData = useCallback(
		(data) => {
			if (!searchQuery.trim()) return data;
			return data?.filter((item) =>
				item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		},
		[searchQuery],
	);
	const handleSearch = useCallback((e) => {
		setSearchQuery(e.target.value);
	}, []);

	return (
		<div className={`playbook-wrapper ${isPlaybookRoute ? 'with-background' : ''}`}>
			<div className={`globalWorkflowContainer`}>
				<div className={`left_div  ${info.modalIsOpen ? 'modal-open' : ''}`}>
					<div className="left_child_div">
						<h2 className="side_heading">Templates</h2>
						<p className="side_text">
							We have specially curated best workflows and designs that suit your
							business
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
				<div className={`mainContentContainer  ${info.modalIsOpen ? 'modal-open' : ''}`}>
					{/* <div className="gloablWorkflowHeader">Choose a Workflow</div> */}
					{info?.isExpanded ? (
						<div
							style={{
								width: '420px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: '32px',
								marginTop: '20%',
								marginLeft: '10%',
								transition: 'transform 0.3s ease-out',
							}}
						>
							<div>
								<span className="dior-studio-text">By dior studios</span>
							</div>
							<div className="workflow-title-container">
								<div className="workflow-title">
									Wedding photography business solution
								</div>
								<div className="workflow-description">
									Ideal for wedding photography business with multiple events,
									selectable packages and services, this workflow provides
									customisable design in enquiry forms, proposals, invoices for
									multiple payment schedule and hassle contracts with e-sign
									contracts
								</div>
								<div>
									<span className="active-users-text">12k active users</span>
								</div>
								<div>
									<button className="buy-button">Buy for $124</button>
								</div>
							</div>
						</div>
					) : (
						<div
							style={{
								transform: info?.isExpanded ? 'translateX(-100%)' : 'translateX(0)',
								transition: 'transform 0.3s ease-out',
								width: '100%',
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
									{info?.loading ? (
										<UpdatedPageLoader />
									) : selectedOption !== 'Workflow' ? (
										<GlobalProposalsCard
											data={getFilteredData(moduleTemplateData)}
											onClickFunc={(data, module) => {
												openModal(data, module);
											}}
											modalIsOpen={info.modalIsOpen}
										/>
									) : (
										getFilteredData(info?.globalWorkflowData)?.map(
											(ele, index) => (
												<GlobalWorkflowCard
													key={index}
													data={ele}
													onClickFunc={openModal}
													isSelected={
														ele?._id === info?.selectedWorkflowId
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
	);
};

export default memo(GlobalWorkflows);
