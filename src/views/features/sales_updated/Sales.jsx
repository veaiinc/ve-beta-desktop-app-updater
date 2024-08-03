import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/sales.scss';
import MyWorkflowsCard from '../../components/sales-updated/MyWorkflowsCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';
import MyWorkflowsModals from '../../components/modalsV2/workflowsModals/MyWorkflowsModals';

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

const Sales = () => {
	let {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: false,
		myWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		myWorkflowModal: false,
	});

	//useEffects
	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

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
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let myWorkflowData = [];

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					myWorkflowData?.push(data?.[i]);
				}
			}

			myWorkflowData?.push({});
			myWorkflowData?.push({});

			myWorkflowData?.push({});

			myWorkflowData?.push({});

			myWorkflowData?.push({});

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

	const openMyWorkflowModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, myWorkflowModal: true }));
	}, []);

	const closeWorkflowModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, myWorkflowModal: false }));
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
			/>
		</>
	);
};

export default memo(Sales);
