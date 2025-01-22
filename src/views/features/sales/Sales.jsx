/* eslint-disable react-hooks/exhaustive-deps */
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
import { getCurrentWorkspaceId } from '../../../helpers';
import { Spin } from 'antd';

const Sales = () => {
	let {
		templates: {
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			salePageRefresh,
			updateStateValues,
			generatePublicLinkData,
		},
		profileInfo: { userWorkSpaceList, getTenantSettings, tennantSettingsData },
	} = useContext(Context);
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
		currentWorkspaceId: null,
		pendingCopyAction: null,
		copyLink: null,
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			getMyWorkflowTemplatesData(1);
		}, 15000);
		return () => clearInterval(interval);
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

	useEffect(() => {
		if (userWorkSpaceList) {
			const currentWorkspaceId = getCurrentWorkspaceId(userWorkSpaceList);
			performExtraCheck(currentWorkspaceId);
		}
	}, [userWorkSpaceList, info?.pendingCopyAction]);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	// useEffect(() => {}, []);

	//function definations

	const performExtraCheck = useCallback(
		async (currentWorkspaceId) => {
			setInfo((prev) => ({ ...prev, currentWorkspaceId }));
			if (info?.pendingCopyAction) {
				let link = `https://${currentWorkspaceId}.ve.ai/${info?.pendingCopyAction}`;
				await navigator.clipboard.writeText(link);
				setInfo((prev) => ({ ...prev, pendingCopyAction: null, copyLink: link }));
			}
		},
		[info?.pendingCopyAction, info],
	);

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
				return navigate('/playbook');
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

	const openCopyLinkModal = useCallback(
		async (data) => {
			try {
				setInfo((prev) => ({ ...prev, copyModal: true, activeTemplateData: data }));
				if (!tennantSettingsData) {
					await getTenantSettings();
				}

				let link;
				if (tennantSettingsData?.customDomain?.length) {
					link = `https://${tennantSettingsData?.customDomain}/${data?.slug}`;
					setInfo((prev) => ({ ...prev, copyLink: link }));
					await navigator.clipboard.writeText(link);
					return;
				} else {
					if (!info?.currentWorkspaceId) {
						setInfo((prev) => ({ ...prev, pendingCopyAction: data?.slug }));
						return;
					}
					link = `https://${info?.currentWorkspaceId}.ve.ai/${data?.slug}`;
					setInfo((prev) => ({ ...prev, copyLink: link }));
					await navigator.clipboard.writeText(link);
					return;
				}
			} catch (err) {
				console.log('Failed to copy text');
			}
		},
		[info?.currentWorkspaceId, tennantSettingsData],
	);

	const closeCopyLinkModal = useCallback(async () => {
		setInfo((prev) => ({
			...prev,
			copyModal: false,
			activeTemplateData: null,
			copyLink: null,
		}));
	}, []);

	const navigateToWorkflowBuilder = useCallback(
		async (data) => {
			return navigate(`/workflow_builder/${data?._id}`);
		},
		[info?.activeTemplateData],
	);

	return (
		<>
			{/* <SalesInfo /> */}
			<InfiniteScroll
				dataLength={info?.myWorkflowData?.length || 0}
				next={fetchMoreMyWorkflows}
				hasMore={info?.hasNextPage}
				loader={<FetchMoreLoaderComp />}
				scrollableTarget={'scrollableTarget'}
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
				copyLink={
					info?.currentWorkspaceId || info?.copyLink ? (
						info?.copyLink
					) : (
						<span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							Generating Link ...
							<Spin />
						</span>
					)
				}
			/>
			<PublicLinkGeneratedModal
				open={info?.showGeneratedLinkModalData ? true : false}
				closeModal={closeGeneratedLinkModal}
				copyLink={
					info?.showGeneratedLinkModalData
						? `https://${
								tennantSettingsData?.customDomain ||
								`${info?.currentWorkspaceId}.ve.ai`
						  }/${info?.showGeneratedLinkModalData?.slug}`
						: ''
				}
				modules={info?.showGeneratedLinkModalData?.moduleTemplates}
			/>
		</>
	);
};

export default memo(Sales);
