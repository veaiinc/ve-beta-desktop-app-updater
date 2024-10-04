import React, { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
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
import moment from 'moment';
// import Icon from '../../../assets/images/sales/icon.png';
import HeaderImage from '../../../assets/images/sales/header-image.png';
import CardDiv from '../../../assets/svg/sales/CardDiv';
import { ReactComponent as Gradient } from '../../../assets/svg/sales/gradient.svg';
import DateTimeLocation from './DateTimeLocation';

const tabItems = [
	{ id: 'all', label: 'All' },
	{ id: 'enquires', label: 'Enquires' },
	{ id: 'counterSign', label: 'Counter Sign' },
	{ id: 'emailApprovals', label: 'Email Approvals' },
	{ id: 'eventsInThreeDays', label: 'Expiring in 3 days' },
];

const Sales = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('all');

	const [tabItemCount, setTabItemCount] = useState({
		All: 0,
		Enquires: 0,
		CounterSign: 0,
		EmailApprovals: 0,
		ExpiringIn3Days: 0,
	});

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
	const [greeting, setGreeting] = useState('');
	const scrollRef = useRef(null);

	let {
		templates: {
			requiredActions,
			getRequiredActions,
			getMyWorkflows,
			myWorkflows,
			myMoreWorkflows,
			salePageRefresh,
			updateStateValues,
			generatePublicLinkData,
			getTabItemCount, // Sheshant
		},
		profileInfo: { userDetailsData },
	} = useContext(Context);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (scrollRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
				if (scrollLeft + clientWidth >= scrollWidth - 20) {
					if (requiredActions.hasMore) {
						getRequiredActions({
							filters: {
								filter: activeTab,
								page: Math.ceil(requiredActions?.actions?.length / 10) + 1,
								limit: 10,
							},
						});
					}
				}
			}
		};
		const scrollableDiv = scrollRef.current;
		if (scrollableDiv) {
			scrollableDiv.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (scrollableDiv) {
				scrollableDiv.removeEventListener('scroll', handleScroll);
			}
		};
	}, [activeTab, requiredActions.length]);

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

	const fetchData = async () => {
		getRequiredActions({
			filters: {
				filter: 'all',
				page: 1,
				limit: 10,
			},
		});
		getMyWorkflowTemplatesData(1);
		const response = await getTabItemCount();
		if (response[0]) {
			const { counterSign, emailApprovals, enquires, eventsInThreeDays } = response[1];
			setTabItemCount((prevState) => ({
				...prevState,
				all: enquires + counterSign + emailApprovals + eventsInThreeDays,
				enquires,
				counterSign,
				emailApprovals,
				eventsInThreeDays,
			}));
		}
	};

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

	// const getRequiredActions = useCallback(async (filter, page, limit) => {
	// 	const response = await getRequiredActionDetails({
	// 		filters: {
	// 			filter: filter || 'all',
	// 			page: page,
	// 			limit: limit,
	// 		},
	// 	});
	// 	if (response[0]) {
	// 		setHasMoreRequiredActions(response[1]?.hasNextPage);
	// 		setRequiredActions((prevActions) => [...prevActions, ...response[1]?.data]);
	// 	}
	// }, []);

	const handleTabClick = useCallback((tabId) => {
		setActiveTab(tabId);
		getRequiredActions({
			filters: {
				filter: tabId,
				page: 1,
				limit: 10,
			},
		});
		// setRequiredActions([]);
	}, []);

	return (
		<>
			<div className="gradient-container">
				<Gradient />
			</div>
			<div className="sales-page">
				<div className="header-image">
					<img src={HeaderImage} alt="Header Image" />
					<div className="left-content">
						<p>Hey, {userDetailsData?.firstName || 'User'}!</p>
						<h1>{greeting} 😃</h1>
					</div>
					<div className="right-content">
						<DateTimeLocation setGreeting={setGreeting} />
					</div>
				</div>
				<div className="sales-page-filter">
					<ul>
						{tabItems.map((item) => (
							<li
								key={item.id}
								className={activeTab === item.id ? 'active' : ''}
								onClick={() => handleTabClick(item.id)}
							>
								{item.label}{' '}
								{tabItemCount?.[item.id] !== 0
									? `(${tabItemCount?.[item.id]})`
									: ''}
							</li>
						))}
					</ul>
				</div>
				<div className="cards-container">
					<div ref={scrollRef} className="card-div">
						{requiredActions?.actions?.map((actionItem, index) => (
							<div className="card" key={index}>
								<CardDiv />
								<div className="card-content">
									<span className="card-title">{actionItem?.action}</span>
									<h1>{actionItem?.clientName}</h1>
								</div>
								<div className="card-footer">
									<div className="card-footer-left">
										<p>{actionItem?.title}</p>
									</div>
									<div className="card-footer-time">
										<span>{moment.unix(actionItem?.createdAt).fromNow()}</span>
									</div>
								</div>
							</div>
						))}

						<div className="card-div-end-black-shadow"></div>
					</div>
				</div>
			</div>
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
