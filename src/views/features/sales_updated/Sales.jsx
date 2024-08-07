import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/sales.scss';
import MyWorkflowsCard from '../../components/sales-updated/MyWorkflowsCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';
import MyWorkflowsModals from '../../components/modalsV2/workflowsModals/MyWorkflowsModals';
import { FetchMoreLoaderComp } from '../../../helpers';
import { useNavigate, useNavigation } from 'react-router-dom';

const Sales = () => {
	let {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			salePageRefresh,
			updateStateValues,
		},
	} = useContext(Context);
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		loading: false,
		myWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		myWorkflowModal: false,
		activeTemplateData: null,
		activeCardsData: null,
	});

	//useEffects
	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (salePageRefresh) {
			updateStateValues({ salePageRefresh: true });
		}
	}, [salePageRefresh]);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
			myWorkflowsDataParser(myMoreWorkflows, true);
		}
	}, [myMoreWorkflows]);

	//function definations

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				status: 'published',
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let myWorkflowData = [];
			if (currentPage === 1 && !data?.length) {
				return navigate('/sales/workflows');
			}

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					myWorkflowData?.push(data?.[i]);
				}
			}

			if (fetchMore) {
				myWorkflowData = [...(info?.myWorkflowData || [])]?.concat(myWorkflowData);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				myWorkflowData,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.myWorkflowData],
	);

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const openMyWorkflowModal = useCallback(async (data, cardsData) => {
		if (cardsData?.status === 'successRate') {
			return;
		}
		// if (!+cardsData?.subText) {
		// 	return;
		// }

		setInfo((prev) => ({
			...prev,
			myWorkflowModal: true,
			activeTemplateData: data,
			activeCardsData: cardsData,
		}));
	}, []);

	const closeWorkflowModal = useCallback(async () => {
		setInfo((prev) => ({
			...prev,
			myWorkflowModal: false,
			activeTemplateData: null,
			activeCardsData: null,
		}));
	}, []);

	return (
		<>
			<InfiniteScroll
				dataLength={info?.myWorkflowData?.length || 0}
				next={fetchMoreMyWorkflows}
				hasMore={info?.hasNextPage}
				loader={<FetchMoreLoaderComp />}
			>
				<div className="salesParentContainer">
					{info?.myWorkflowData?.map((e, index) => (
						<MyWorkflowsCard key={index} data={e} openModal={openMyWorkflowModal} />
					))}
				</div>
			</InfiniteScroll>
			<MyWorkflowsModals
				modalIsOpen={info?.myWorkflowModal}
				closeModal={closeWorkflowModal}
				activeTemplateData={info?.activeTemplateData}
				activeCardsData={info?.activeCardsData}
			/>
		</>
	);
};

export default memo(Sales);
