import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/globalWorkflow.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { useNavigate } from 'react-router-dom';
import GlobalWorkflowCard from '../../components/sales-updated/globalWorkflowCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';
import GlobalWorkflowModal from '../../components/modalsV2/workflowsModals/GlobalWorkflowModal';
import GlobalWorkflowLoader from './GlobalWorkflowLoader';

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

const servicesList = [
	'Sell a Service',
	'Weddings',
	'Events',
	'Parties',
	'Sell a Session',
	'Sell a Digital Product',
];
const GlobalWorkflows = () => {
	const navigate = useNavigate();
	let {
		templates: { getGlobalWorkflows, globalMoreWorkflows, globalWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		globalWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		modalIsOpen: false,
		activeTemplateData: null,
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

	//function definations

	const getGlobalWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'global',
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

	const openModal = useCallback((data) => {
		setInfo((prev) => ({ ...prev, modalIsOpen: true, activeTemplateData: data }));
	}, []);

	const closeModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: false, activeTemplateData: null }));
	}, []);

	return (
		<div className="globalWorkflowContainer">
			<div className="mainContentContainer">
				<div className="gloablWorkflowHeader">
					<span className="backArrowBtn" onClick={() => navigate(-1)}>
						<BackArrowSvg />
					</span>
					<span className="gloablHeaderTitle">Choose a Workflow</span>
				</div>
				<InfiniteScroll
					dataLength={info?.globalWorkflowData?.length || 0}
					next={fetchMoreGlobalWorkflows}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
				>
					<div className="globalWorkflowParentCardContainer">
						{info?.loading ? (
							<GlobalWorkflowLoader />
						) : (
							info?.globalWorkflowData?.map((ele, index) => (
								<GlobalWorkflowCard
									key={index}
									data={ele}
									onClickFunc={openModal}
								/>
							))
						)}
					</div>
				</InfiniteScroll>
			</div>
			<div className="globalWorkflowSidebar">
				{servicesList?.map((ele, index) => (
					<span
						key={index}
						className="sidebarLabel"
						style={{ color: index === 0 ? '#E4E5E6' : '' }}
					>
						{ele}
					</span>
				))}
			</div>
			<GlobalWorkflowModal
				modalIsOpen={info?.modalIsOpen}
				closeModal={closeModal}
				activeTemplateData={info?.activeTemplateData}
			/>
		</div>
	);
};

export default memo(GlobalWorkflows);
