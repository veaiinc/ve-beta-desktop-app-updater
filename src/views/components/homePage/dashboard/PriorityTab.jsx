import React, { memo, useContext, useState, useEffect } from 'react';
import RequiredActionsLoader from '../../sales/RequiredActionsLoader';
import '../../../../assets/scss/sales/sales.scss';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import FilterCheckBox from '../../sales/FilterCheckBox';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import Skeleton from 'react-loading-skeleton';
import PriorityDropDown from './PriorityDropDown';

const tabItems = [
	{ id: 'all', label: 'All', checkBoxBorder: null },
	{ id: 'enquiry', label: 'Enquires', checkBoxBorder: '#FFB621' },
	{ id: 'counterSign', label: 'Counter Sign', checkBoxBorder: '#34908E' },
	{ id: 'emailApproval', label: 'Email Approvals', checkBoxBorder: '#004F65' },
	{ id: 'expiresInThreeDays', label: 'Expiring in 3 days', checkBoxBorder: '#FFD59E' },
];
const PriorityTab = () => {
	let {
		templates: { requiredActions, getRequiredActions },
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentPage: 1,
		loading: true,
		selectedOption: 'all',
	});

	const navigate = useNavigate();
	useEffect(() => {
		if (!requiredActions) {
			fetchSalesInfo();
		} else {
			if (info?.loading !== false)
				setInfo((prev) => ({
					...prev,
					loading: false,
				}));
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
	};

	const fetchMoreData = async () => {
		if (requiredActions?.hasNextPage) {
			const nextPage = info?.currentPage + 1;
			await getRequiredActions({
				filters: {
					action: info?.selectedOption,
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

	const handlePriorityOptionClick = (optionId) => {
		if (optionId === info?.selectedOption) return;
		getRequiredActions({
			filters: {
				action: optionId,
				page: 1,
				limit: 10,
			},
			resetRequiredActions: true,
		});
		setInfo((prev) => ({
			...prev,
			currentPage: 1,
			selectedOption: optionId,
		}));
	};

	const handleActionNavigation = (templateId, workflowId) => {
		navigate(`/smart-file/${templateId}/${workflowId}`);
	};

	return (
		<div className="sales-page" style={{ padding: 0 }}>
			<div className="priority-dropdown">
				<PriorityDropDown
					handleOptionClick={handlePriorityOptionClick}
					selectedOption={info?.selectedOption}
				/>
			</div>

			<div className="cards-container">
				<div className="card-div" style={{ overflowX: 'hidden', padding: 0 }}>
					{info?.loading ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: '8px',
								flexWrap: 'wrap',
							}}
						>
							{[{}, {}, {}, {}, {}, {}].map((ele, index) => {
								return (
									<Skeleton
										width={'268px'}
										height={'286px'}
										borderRadius={'24px'}
										key={index}
									/>
								);
							})}
						</div>
					) : (
						<InfiniteScroll
							dataLength={requiredActions?.actions?.length || 0}
							hasMore={requiredActions?.hasNextPage}
							next={fetchMoreData}
							height={'calc(100vh - 395px)'}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '16px',
								marginBottom: '85px',
							}}
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
										<div className="agentsWorkflowJobCardsHeader">
											{actionItem?.status === 'enquiry' &&
											actionItem?.action === 'sendProposal'
												? 'Enquiry'
												: actionItem?.approvalRequired &&
												  actionItem?.action !== 'counterSign'
												? 'Email Approval'
												: actionItem?.action === 'counterSign'
												? 'Counter Sign'
												: 'Expiry In 3 Days'}
										</div>
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
