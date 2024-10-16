import React, { useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { ReactComponent as Gradient } from '../../../assets/svg/sales/gradient.svg';
import { ReactComponent as CardDiv } from '../../../assets/svg/sales/card-div.svg';
import HeaderImage from '../../../assets/images/sales/header-image.png';
import moment from 'moment';
import HeaderInfo from './HeaderInfo';
import RequiredActionsLoader from '../../components/sales/RequiredActionsLoader';

const tabItems = [
	{ id: 'all', label: 'All' },
	{ id: 'enquiry', label: 'Enquires' },
	{ id: 'counterSign', label: 'Counter Sign' },
	{ id: 'emailApproval', label: 'Email Approvals' },
	{ id: 'expiresInThreeDays', label: 'Expiring in 3 days' },
];

const SalesInfo = () => {
	let {
		templates: { requiredActions, getRequiredActions, tabItemCount, getTabItemCount },
	} = useContext(Context);

	const [activeTab, setActiveTab] = useState('all');

	const scrollRef = useRef(null);
	const debounceTimerRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchSalesInfo();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			fetchSalesInfo();
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		scrollRef?.current?.addEventListener('scroll', debouncedHandleScroll);
		return () => {
			scrollRef?.current?.removeEventListener('scroll', debouncedHandleScroll);
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [requiredActions, activeTab]);

	const handleScroll = useCallback(() => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			if (scrollLeft + clientWidth >= scrollWidth - 20) {
				if (requiredActions?.hasMore) {
					getRequiredActions({
						filters: {
							action: activeTab,
							page: Math.ceil(requiredActions?.actions?.length / 10) + 1,
							limit: 10,
						},
						resetRequiredActions: false,
					});
				}
			}
		}
	}, [requiredActions, activeTab, getRequiredActions]);

	const debouncedHandleScroll = () => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		debounceTimerRef.current = setTimeout(() => {
			handleScroll();
		}, 300);
	};

	const fetchSalesInfo = useCallback(() => {
		getRequiredActions({
			filters: {
				action: 'all',
				page: 1,
				limit: 10,
			},
			resetRequiredActions: true,
		});
		getTabItemCount();
	}, [getRequiredActions, getTabItemCount]);

	const handleTabClick = useCallback(
		(tabId) => {
			if (tabId === activeTab) return;
			setActiveTab(tabId);
			getRequiredActions({
				filters: {
					action: tabId,
					page: 1,
					limit: 10,
				},
				resetRequiredActions: true,
			});
		},
		[requiredActions, getRequiredActions],
	);

	const handleActionNavigation = (templateId, workflowId) => {
		navigate(`/smart-file/${templateId}/${workflowId}`);
	};

	return (
		<>
			<div className="gradient-container">
				<Gradient />
			</div>
			<div className="sales-page">
				<div className="header-image">
					<img src={HeaderImage} alt="Header" />
					<HeaderInfo />
				</div>
				<div className="sales-page-filter">
					<ul>
						{tabItems.map((item) => (
							<button
								disabled={tabItemCount?.[item.id] === 0}
								style={{
									opacity: tabItemCount?.[item.id] === 0 ? 0.5 : 1,
									cursor:
										tabItemCount?.[item.id] === 0 ? 'not-allowed' : 'pointer',
									userSelect: 'none',
								}}
								key={item.id}
								className={activeTab === item.id ? 'active' : ''}
								onClick={() => handleTabClick(item.id)}
							>
								{item.label} ({tabItemCount?.[item.id]})
							</button>
						))}
					</ul>
				</div>
				<div className="cards-container">
					<div ref={scrollRef} className="card-div">
						{requiredActions?.loading ? (
							<RequiredActionsLoader />
						) : (
							requiredActions?.actions?.map((actionItem, index) => (
								<div
									onClick={() =>
										handleActionNavigation(
											actionItem?.templateId,
											actionItem?._id,
										)
									}
									className="card"
									key={index}
								>
									<span className="card-svg">
										<CardDiv />
									</span>
									<div className="card-content">
										<span className="card-title">
											{actionItem?.status === 'enquiry' &&
											actionItem?.action === 'sendProposal'
												? 'Enquiry'
												: actionItem?.approvalRequired &&
												  actionItem?.action !== 'counterSign'
												? 'Email Approval'
												: actionItem?.action === 'counterSign'
												? 'Counter Sign'
												: 'Expiry In 3 Days'}
										</span>
										<h1>{actionItem?.clientName}</h1>
									</div>
									<div className="card-footer">
										<div className="card-footer-left">
											<p>{actionItem?.title}</p>
										</div>
										<div className="line"></div>
										<div className="card-footer-time">
											<span>
												{moment.unix(actionItem?.createdAt).fromNow()}
											</span>
										</div>
									</div>
								</div>
							))
						)}
						<div className="card-div-end-black-shadow"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SalesInfo;
