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
import Icon from '../../../assets/images/sales/icon.png';
import axios from 'axios';
import HeaderImage from '../../../assets/images/sales/header-image.png';
import CardDiv from '../../../assets/svg/sales/CardDiv';
import { ReactComponent as Gradient } from '../../../assets/svg/sales/gradient.svg';

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
	} = useContext(Context);

	const tabItems = [
		{ id: 'All', label: 'All' },
		{ id: 'Enquires', label: 'Enquires' },
		{ id: 'CounterSign', label: 'Counter Sign' },
		{ id: 'EmailApprovals', label: 'Email Approvals' },
		{ id: 'ExpiringIn3Days', label: 'Expiring in 3 days' },
	];

	const navigate = useNavigate();

	const {
		profileInfo: { userDetailsData, getUserDetails },
	} = useContext(Context);

	useEffect(() => {
		if (!userDetailsData) {
			getUserDetails();
		}
	}, []);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 16) return 'Good afternoon';
		return 'Good evening';
	};

	const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
	const [currentDate, setCurrentDate] = useState(moment().format('dddd Do MMM, YYYY'));
	const [location, setLocation] = useState('Fetching location...');
	const [greeting, setGreeting] = useState(getGreeting());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(moment().format('HH:mm'));
			setCurrentDate(moment().format('dddd Do MMM, YYYY'));
			setGreeting(getGreeting());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					getLocationInfo(latitude, longitude);
				},
				(error) => {
					console.error('Error getting location:', error);
					setLocation('Unable to fetch location');
				},
			);
		} else {
			setLocation('Geolocation is not supported by this browser.');
		}
	}, []);

	const getLocationInfo = async (latitude, longitude) => {
		try {
			const response = await axios.get(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
			);
			if (response.data && response.data.address) {
				setLocation(
					response.data.address['state'] + ', ' + response.data.address['country'],
				);
			} else {
				setLocation('Location not found');
			}
		} catch (error) {
			console.error('Error fetching location info:', error);
			setLocation('Error fetching location info');
		}
	};

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

	//useEffects
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

	//function definations

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

	const [activeTab, setActiveTab] = useState('All');

	const handleTabClick = (tabId) => {
		setActiveTab(tabId);
	};

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
						<p>{currentDate}</p>
						<h1>{currentTime}</h1>
						<p>{location}</p>
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
								{item.label}
							</li>
						))}
					</ul>
				</div>
				<div className="cards-container">
					<div className="card-div">
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Enquires</span>
								<h1>Avinash G.</h1>
								<p>Looking for professional photography services for wedding</p>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Enquires</span>
								<h1>Avinash G.</h1>
								<p>Looking for professional photography services for wedding</p>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Enquires</span>
								<h1>Avinash G.</h1>
								<p>Looking for professional photography services for wedding</p>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Email Approval</span>
								<h1>Avinash G.</h1>
								<ul>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="8"
											height="9"
											viewBox="0 0 8 9"
											fill="none"
										>
											<path
												d="M8 4.5C8 6.70914 6.20914 8.5 4 8.5C1.79086 8.5 0 6.70914 0 4.5C0 2.29086 1.79086 0.5 4 0.5C6.20914 0.5 8 2.29086 8 4.5ZM1.42107 4.5C1.42107 5.92431 2.57569 7.07893 4 7.07893C5.42431 7.07893 6.57893 5.92431 6.57893 4.5C6.57893 3.07569 5.42431 1.92107 4 1.92107C2.57569 1.92107 1.42107 3.07569 1.42107 4.5Z"
												fill="#E4E5E6"
												fill-opacity="0.36"
											/>
										</svg>
										<span>Review</span>
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="8"
											height="9"
											viewBox="0 0 8 9"
											fill="none"
										>
											<path
												d="M8 4.5C8 6.70914 6.20914 8.5 4 8.5C1.79086 8.5 0 6.70914 0 4.5C0 2.29086 1.79086 0.5 4 0.5C6.20914 0.5 8 2.29086 8 4.5ZM1.42107 4.5C1.42107 5.92431 2.57569 7.07893 4 7.07893C5.42431 7.07893 6.57893 5.92431 6.57893 4.5C6.57893 3.07569 5.42431 1.92107 4 1.92107C2.57569 1.92107 1.42107 3.07569 1.42107 4.5Z"
												fill="#E4E5E6"
												fill-opacity="0.36"
											/>
										</svg>
										<span>Approve</span>
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="8"
											height="9"
											viewBox="0 0 8 9"
											fill="none"
										>
											<path
												d="M8 4.5C8 6.70914 6.20914 8.5 4 8.5C1.79086 8.5 0 6.70914 0 4.5C0 2.29086 1.79086 0.5 4 0.5C6.20914 0.5 8 2.29086 8 4.5ZM1.42107 4.5C1.42107 5.92431 2.57569 7.07893 4 7.07893C5.42431 7.07893 6.57893 5.92431 6.57893 4.5C6.57893 3.07569 5.42431 1.92107 4 1.92107C2.57569 1.92107 1.42107 3.07569 1.42107 4.5Z"
												fill="#E4E5E6"
												fill-opacity="0.36"
											/>
										</svg>
										<span>Confirmation</span>
									</li>
								</ul>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Counter Sign</span>
								<h1>Avinash G.</h1>
								<p>Need to confirm your agreement </p>
								<div className="counter-sign-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
									>
										<path
											d="M6 2L5.295 2.705L8.085 5.5H2V6.5H8.085L5.295 9.295L6 10L10 6L6 2Z"
											fill="#E4E5E6"
											fill-opacity="0.36"
										/>
									</svg>
									<span>Counter sign needed!</span>
								</div>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Enquires</span>
								<h1>Avinash G.</h1>
								<p>Looking for professional photography services for wedding</p>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Enquires</span>
								<h1>Avinash G.</h1>
								<p>Looking for professional photography services for wedding</p>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Enquires</span>
								<h1>Avinash G.</h1>
								<p>Looking for professional photography services for wedding</p>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Email Approval</span>
								<h1>Avinash G.</h1>
								<ul>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="8"
											height="9"
											viewBox="0 0 8 9"
											fill="none"
										>
											<path
												d="M8 4.5C8 6.70914 6.20914 8.5 4 8.5C1.79086 8.5 0 6.70914 0 4.5C0 2.29086 1.79086 0.5 4 0.5C6.20914 0.5 8 2.29086 8 4.5ZM1.42107 4.5C1.42107 5.92431 2.57569 7.07893 4 7.07893C5.42431 7.07893 6.57893 5.92431 6.57893 4.5C6.57893 3.07569 5.42431 1.92107 4 1.92107C2.57569 1.92107 1.42107 3.07569 1.42107 4.5Z"
												fill="#E4E5E6"
												fill-opacity="0.36"
											/>
										</svg>
										<span>Review</span>
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="8"
											height="9"
											viewBox="0 0 8 9"
											fill="none"
										>
											<path
												d="M8 4.5C8 6.70914 6.20914 8.5 4 8.5C1.79086 8.5 0 6.70914 0 4.5C0 2.29086 1.79086 0.5 4 0.5C6.20914 0.5 8 2.29086 8 4.5ZM1.42107 4.5C1.42107 5.92431 2.57569 7.07893 4 7.07893C5.42431 7.07893 6.57893 5.92431 6.57893 4.5C6.57893 3.07569 5.42431 1.92107 4 1.92107C2.57569 1.92107 1.42107 3.07569 1.42107 4.5Z"
												fill="#E4E5E6"
												fill-opacity="0.36"
											/>
										</svg>
										<span>Approve</span>
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="8"
											height="9"
											viewBox="0 0 8 9"
											fill="none"
										>
											<path
												d="M8 4.5C8 6.70914 6.20914 8.5 4 8.5C1.79086 8.5 0 6.70914 0 4.5C0 2.29086 1.79086 0.5 4 0.5C6.20914 0.5 8 2.29086 8 4.5ZM1.42107 4.5C1.42107 5.92431 2.57569 7.07893 4 7.07893C5.42431 7.07893 6.57893 5.92431 6.57893 4.5C6.57893 3.07569 5.42431 1.92107 4 1.92107C2.57569 1.92107 1.42107 3.07569 1.42107 4.5Z"
												fill="#E4E5E6"
												fill-opacity="0.36"
											/>
										</svg>
										<span>Confirmation</span>
									</li>
								</ul>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card">
							<CardDiv />
							<div className="card-content">
								<span className="card-title">Counter Sign</span>
								<h1>Avinash G.</h1>
								<p>Need to confirm your agreement </p>
								<div className="counter-sign-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
									>
										<path
											d="M6 2L5.295 2.705L8.085 5.5H2V6.5H8.085L5.295 9.295L6 10L10 6L6 2Z"
											fill="#E4E5E6"
											fill-opacity="0.36"
										/>
									</svg>
									<span>Counter sign needed!</span>
								</div>
							</div>
							<div className="card-footer">
								<div className="card-footer-left">
									<img src={Icon} alt="Profile Pic" />
									<p>Portrait Photography Workflow</p>
								</div>
								<div className="stoke-line"></div>
								<div className="card-footer-time">
									<span>2 days ago</span>
								</div>
							</div>
						</div>
						<div className="card-div-end-black-shadow"></div>
					</div>

					{/* <div className="card">
						<div className="card-content">
							<span className="card-title">Enquires</span>
							<h1>Avinash G.</h1>
							<p>Looking for professional photography services for wedding</p>
						</div>
						<div className="card-footer">
							<div className="card-footer-left">
								<img src={Icon} alt="Profile Pic" />
								<p>Portrait Photography Workflow Workflow</p>
							</div>
							<div className="card-footer-time">
								<span>2 days ago</span>
							</div>
						</div>
					</div> */}
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
