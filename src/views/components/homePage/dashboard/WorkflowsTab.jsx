import React, { useEffect, useCallback, useState } from 'react';
import { useContext } from 'react';
import Sales from '../../../features/sales/Sales';
import WorkflowCard from './workflows/workflowCard/WorkflowCard';
import '../../../../assets/scss/home_page/homepage.scss';
import Context from '../../../../context/context';
import { memo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import { getCurrentWorkspaceId } from '../../../../helpers';
import { useNavigate } from 'react-router-dom';
import MyWorkflowsModals from '../../modalsV2/workflowsModals/MyWorkflowsModals';
import CopiedModal from '../../modalsV2/workflowsModals/CopiedModal';
import { Spin } from 'antd';
import PublicLinkGeneratedModal from '../../modalsV2/workflowsModals/PublicLinkGeneratedModal';
import UpdatedPageLoader from '../../loaders/UpdatedPageLoader';
import InitialPageLoader from '../../loaders/PageLoader';
import Skeleton from 'react-loading-skeleton';

const limit = 10;

const WorkflowsTab = ({ searchValue }) => {
	const {
		templates: {
			automations,
			getAutomations,
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			updateStateValues,
			generatePublicLinkData,
			salePageRefresh,
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

	const automationsData = automations?.data;
	const automationsHasNextPage = automations?.hasNextPage;
	const automationsCurrentPage = Number(automations?.currentPage) || 1;

	useEffect(() => {
		onMountFetchAutomations();
	}, []);

	useEffect(() => {
		if (automationsHasNextPage === false) {
			getMyWorkflowTemplatesData(1);
		}
	}, [automationsHasNextPage]);

	useEffect(() => {
		if (salePageRefresh) {
			// getMyWorkflowTemplatesData(1);
			updateStateValues({ salePageRefresh: null });
		}
	}, [salePageRefresh]);

	useEffect(() => {
		// Inefficient way to format data
		if (automations?.data?.length) {
			const formattedAutomationsData = automationsData?.map((automation) =>
				formatAutomationsData(automation),
			);
			setInfo((prev) => ({
				...prev,
				myWorkflowData: [...(prev?.myWorkflowData || []), ...formattedAutomationsData],
			}));
		}
	}, [automations]);

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

	const onMountFetchAutomations = async () => {
		setInfo((prev) => ({ ...prev, loading: true }));
		try {
			if (!automations) {
				await getAutomations();
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};

	const formatAutomationsData = (automation) => {
		const { _id, name, steps, tenantId, status } = automation;
		return {
			_id: _id,
			title: name,
			steps,
			tenantId,
			status,
			moduleTemplates: [], // TODO: add module templates key once we have it
		};
	};

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

	const getMyWorkflowTemplatesData = useCallback(
		async (page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					title: searchValue,
					type: 'workspace',
					status: 'published',
					sortBy: 'createdAt',
					sortType: -1,
					version: null,
				},
			};
			await getMyWorkflows(payload, fetchMore);
		},
		[searchValue],
	);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed) => {
			const { data, currentPage, hasNextPage } = dataToBeUsed;
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
			myWorkflowData = [...(info?.myWorkflowData || [])]?.concat(myWorkflowData);
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

	const fetchMoreMyWorkflows = () => {
		if (automationsHasNextPage === false) {
			getMyWorkflowTemplatesData(info?.currentPage + 1, true);
		} else {
			const page = automationsCurrentPage ? Number(automationsCurrentPage) + 1 : 1;
			getAutomations(page, limit, true);
		}
	};

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
			if (data?.version) {
				return navigate(`/automation_builder/${data?._id}`);
			}
			return navigate(`/workflow_builder/${data?._id}`);
		},
		[info?.activeTemplateData],
	);

	// const handleFetchMoreAutomations = useCallback(() => {
	// 	getAutomations(automationsCurrentPage + 1, true);
	// }, [automationsCurrentPage]);

	return (
		<div className="workflows-tab-container">
			<div id="scrollableDiv">
				{info?.loading ? (
					<div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
						{[{}, {}, {}].map((ele, index) => (
							<Skeleton
								height={'424px'}
								width={'340px'}
								style={{
									borderRadius: '16px',
								}}
								key={index}
							/>
						))}
					</div>
				) : (
					<InfiniteScroll
						dataLength={info?.myWorkflowData?.length || 0}
						hasMore={automationsHasNextPage || info?.hasNextPage}
						next={fetchMoreMyWorkflows}
						loader={<FetchMoreLoaderComp />}
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							flexFlow: 'wrap',
							alignItems: 'flex-end',
							alignContent: 'flex-start',
							rowGap: '50px',
							columnGap: '10px',
							width: '100%',
							overflowX: 'hidden',
						}}
						className="tetsing"
						height={'calc(100vh - 240px)'}
					>
						<div className="workflows-tab">
							{info?.myWorkflowData?.map((workflow, index) => {
								return (
									<WorkflowCard
										key={index}
										workflow={workflow}
										openModal={openMyWorkflowModal}
										openCopyLinkModal={openCopyLinkModal}
										navigateToWorkflowBuilder={navigateToWorkflowBuilder}
										modalIsOpen={info?.myWorkflowModal}
										activeTemplateData={info?.activeTemplateData}
										activeCardsData={info?.activeCardsData}
									/>
								);
							})}
						</div>
					</InfiniteScroll>
				)}
			</div>

			<MyWorkflowsModals
				modalIsOpen={info?.myWorkflowModal}
				closeModal={closeWorkflowModal}
				activeTemplateData={info?.activeTemplateData}
				activeCardsData={info?.activeCardsData}
				updateStateOnUnmounting={false}
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
		</div>
	);
};

export default memo(WorkflowsTab);
