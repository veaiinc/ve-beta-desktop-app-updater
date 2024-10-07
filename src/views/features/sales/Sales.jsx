import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/sales.scss';
import MyWorkflowsCard from '../../components/sales/MyWorkflowsCard';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import MyWorkflowsModals from '../../components/modalsV2/workflowsModals/MyWorkflowsModals';
import { FetchMoreLoaderComp } from '../../../helpers';
import { useNavigate } from 'react-router-dom';
import CopiedModal from '../../components/modalsV2/workflowsModals/CopiedModal';
import PublicLinkGeneratedModal from '../../components/modalsV2/workflowsModals/PublicLinkGeneratedModal';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import InitialPageLoader from '../../components/loaders/PageLoader';
import SalesInfo from './SalesInfo';

const Sales = () => {
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		loading: true,
		myWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		myWorkflowModal: false,
		activeTemplateData: null,
		activeCardsData: null,
		copyModal: false,
		showGeneratedLinkModalData: null,
		testingDrawerModal: false,
		shownInitialLoader: localStorage.getItem('showInitialLoader'),
	});

	let {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			salePageRefresh,
			updateStateValues,
			generatePublicLinkData,
		},
	} = useContext(Context);

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (salePageRefresh) {
			getMyWorkflowTemplatesData(1);
			updateStateValues({ salePageRefresh: null });
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

	useEffect(() => {
		if (generatePublicLinkData) {
			setInfo((prev) => ({ ...prev, showGeneratedLinkModalData: generatePublicLinkData }));
			updateStateValues({ generatePublicLinkData: null });
		}
	}, [generatePublicLinkData]);

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let myWorkflowData = [];
			if (currentPage === 1 && !data?.length && !generatePublicLinkData) {
				localStorage.setItem('showInitialLoader', true);
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
			localStorage.setItem('showInitialLoader', true);
			setInfo((prev) => ({
				...prev,
				loading: false,
				myWorkflowData,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.myWorkflowData, generatePublicLinkData],
	);

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const openMyWorkflowModal = useCallback(async (data, cardsData) => {
		if (cardsData?.status === 'successRate') {
			return;
		}
		if (!+cardsData?.subText) {
			return;
		}

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

	const closeGeneratedLinkModal = useCallback(async () => {
		setInfo((prev) => ({
			...prev,
			showGeneratedLinkModalData: null,
		}));
	}, []);

	const openCopyLinkModal = useCallback(async (data) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			await navigator.clipboard.writeText(`https://${workspaceId}.ve.ai/${data?.slug}`);
			setInfo((prev) => ({ ...prev, copyModal: true, activeTemplateData: data }));
		} catch (err) {
			console.log('Failed to copy text');
		}
	}, []);

	const closeCopyLinkModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, copyModal: false, activeTemplateData: null }));
	}, []);

	const navigateToWorkflowBuilder = useCallback(
		async (data) => {
			return navigate(`/workflow_builder/${data?._id}`);
		},
		[info?.activeTemplateData],
	);

	return (
		<>
			<SalesInfo />
			<InfiniteScroll
				dataLength={info?.myWorkflowData?.length || 0}
				next={fetchMoreMyWorkflows}
				hasMore={info?.hasNextPage}
				loader={<FetchMoreLoaderComp />}
			>
				{info?.loading ? (
					info?.shownInitialLoader ? (
						<UpdatedPageLoader />
					) : (
						<InitialPageLoader />
					)
				) : (
					<div className="salesParentContainer">
						{info?.myWorkflowData?.map((e, index) => (
							<MyWorkflowsCard
								key={index}
								data={e}
								openModal={openMyWorkflowModal}
								openCopyLinkModal={openCopyLinkModal}
								navigateToWorkflowBuilder={navigateToWorkflowBuilder}
							/>
						))}
					</div>
				)}
			</InfiniteScroll>

			<MyWorkflowsModals
				modalIsOpen={info?.myWorkflowModal}
				closeModal={closeWorkflowModal}
				activeTemplateData={info?.activeTemplateData}
				activeCardsData={info?.activeCardsData}
			/>
			<CopiedModal
				open={info?.copyModal}
				closeModal={closeCopyLinkModal}
				slug={info?.activeTemplateData?.slug}
				modules={info?.activeTemplateData?.moduleTemplates?.filter((ele) => ele?.isPublic)}
				copyLink={`https://${localStorage.getItem('workspaceId')}.ve.ai/${
					info?.activeTemplateData?.slug
				}`}
			/>
			<PublicLinkGeneratedModal
				open={info?.showGeneratedLinkModalData ? true : false}
				closeModal={closeGeneratedLinkModal}
				copyLink={
					info?.showGeneratedLinkModalData
						? `https://${localStorage.getItem('workspaceId')}.ve.ai/${
								info?.showGeneratedLinkModalData?.slug
						  }`
						: ''
				}
				modules={info?.showGeneratedLinkModalData?.moduleTemplates}
			/>
		</>
	);
};

export default memo(Sales);
