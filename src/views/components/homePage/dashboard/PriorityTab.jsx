import React, { memo, useContext, useState, useEffect } from 'react';
import RequiredActionsLoader from '../../sales/RequiredActionsLoader';
import '../../../../assets/scss/sales/sales.scss';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import FilterCheckBox from '../../sales/FilterCheckBox';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';

const tabItems = [
	{ id: 'all', label: 'All', checkBoxBorder: null },
	{ id: 'enquiry', label: 'Enquires', checkBoxBorder: '#FFB621' },
	{ id: 'counterSign', label: 'Counter Sign', checkBoxBorder: '#34908E' },
	{ id: 'emailApproval', label: 'Email Approvals', checkBoxBorder: '#004F65' },
	{ id: 'expiresInThreeDays', label: 'Expiring in 3 days', checkBoxBorder: '#FFD59E' },
];
const PriorityTab = () => {
	let {
		templates: { requiredActions, getRequiredActions, getTabItemCount, tabItemCount },
	} = useContext(Context);
	const [activeTab, setActiveTab] = useState('all');
	const [info, setInfo] = useState({
		currentPage: 1,
	});
	const navigate = useNavigate();
	useEffect(() => {
		if (!requiredActions?.actions?.length) {
			fetchSalesInfo();
		}
	}, [requiredActions]);

	const fetchSalesInfo = () => {
		getRequiredActions({
			filters: {
				action: 'all',
				page: info?.currentPage,
				limit: 10,
			},
			resetRequiredActions: true,
		});
		getTabItemCount();
	};

	const fetchMoreData = async () => {
		if (requiredActions?.hasMore) {
			const nextPage = info?.currentPage + 1;
			await getRequiredActions({
				filters: {
					action: activeTab,
					page: nextPage,
					limit: 10,
				},
				resetRequiredActions: false,
			});
			setInfo((prev) => ({
				...prev,
				currentPage: nextPage,
			}));
		}
	};

	const handleTabClick = (tabId) => {
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
		setInfo((prev) => ({
			...prev,
			currentPage: 1,
		}));
	};

	const handleActionNavigation = (templateId, workflowId) => {
		navigate(`/smart-file/${templateId}/${workflowId}`);
	};
	return (
		<div className="sales-page" style={{ padding: 0 }}>
			<div className="sales-page-filter">
				<ul>
					{tabItems.map((item) => (
						<button
							disabled={tabItemCount?.[item.id] === 0}
							style={{
								opacity: tabItemCount?.[item.id] === 0 ? 0.5 : 1,
								cursor: tabItemCount?.[item.id] === 0 ? 'not-allowed' : 'pointer',
								userSelect: 'none',
							}}
							key={item.id}
							className={`${
								activeTab === item.id ? 'active' : ''
							} salesFilterButtons`}
							onClick={() => handleTabClick(item.id)}
						>
							{item.label}{' '}
							{item?.id === 'all'
								? `(${tabItemCount?.[item.id]})`
								: tabItemCount?.[item.id]}
							{item?.checkBoxBorder ? (
								<FilterCheckBox borderColor={item?.checkBoxBorder} />
							) : (
								''
							)}
						</button>
					))}
				</ul>
			</div>
			<div className="cards-container">
				<div className="card-div" style={{ overflowX: 'hidden', padding: 0 }}>
					{requiredActions?.loading ? (
						<RequiredActionsLoader />
					) : (
						<InfiniteScroll
							dataLength={requiredActions?.actions?.length || 0}
							hasMore={requiredActions?.hasMore}
							next={fetchMoreData}
							height={518}
							loader={<FetchMoreLoaderComp />}
							style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
						>
							{requiredActions?.actions?.map((actionItem, index) => (
								<div
									className="requiredSalesPendingCard"
									key={index}
									onClick={() =>
										handleActionNavigation(
											actionItem?.templateId,
											actionItem?._id,
										)
									}
									style={{
										height: '286px',
										width: '268px',
										borderRadius: '24px',
										padding: '24px',
									}}
								>
									<div className="agentsWorkflowJobCards">
										<div className="agentsWorkflowJobCardsContent">
											<span className="agentsWorkflowJobCardsTitle">
												{actionItem?.clientName}
											</span>
											<span className="agentsWorkflowJobCardsSubTitle">
												{actionItem?.title}
											</span>
										</div>
										<span
											className="agentsTabType"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignSelf: 'stretch',
											}}
										>
											{actionItem?.status === 'enquiry' &&
											actionItem?.action === 'sendProposal'
												? 'Enquiry'
												: actionItem?.approvalRequired &&
												  actionItem?.action !== 'counterSign'
												? 'Email Approval'
												: actionItem?.action === 'counterSign'
												? 'Counter Sign'
												: 'Expiry In 3 Days'}

											<span className="agentsWorkflowJobCardsSubTitle">
												{moment.unix(actionItem?.createdAt).fromNow()}
											</span>
										</span>
									</div>
								</div>
							))}
						</InfiniteScroll>
					)}
				</div>
				{/* <div className="card-div-end-black-shadow"></div> */}
			</div>
		</div>
	);
};

export default memo(PriorityTab);
