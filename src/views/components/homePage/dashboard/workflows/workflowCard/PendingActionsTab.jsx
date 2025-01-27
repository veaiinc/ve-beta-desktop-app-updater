import React, { useContext, useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import { ReactComponent as CheckIcon } from '../../../../../../assets/svg/home_page/Check.svg';
import Context from '../../../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import MyWorkflowModalsLoader from '../../../../modalsV2/workflowsModals/MyWorkflowModalsLoader';
import { useNavigate } from 'react-router-dom';
const timeOptions = [
	{
		label: 'All',
		value: 'all',
	},
	{
		label: 'Last Week',
		value: 'lastWeek',
	},
	{
		label: 'Last 30 days',
		value: 'last30Days',
	},
	{
		label: 'Last 90 Days',
		value: 'last90Days',
	},
	{
		label: 'Last 12 Months',
		value: 'last12Months',
	},
];

const sortOptions = [
	{
		label: 'Newest First',
		value: 'newestFirst',
	},
	{
		label: 'Oldest First',
		value: 'oldestFirst',
	},
	{
		label: 'A-Z',
		value: 'az',
	},
	{
		label: 'Z-A',
		value: 'za',
	},
];

const initialState = {
	loading: true,
	workflowsDetailslist: null,
	currentPage: 1,
	hasNextPage: false,
	selectedDuration: timeOptions?.[0],
	selectedSortOptions: sortOptions?.[0],
	sortOptionsChanged: false,
	durationOptionChanged: false,
	searchExpand: false,
	searchValue: '',
	searchValueChanged: false,
	timeout: null,
};

const PendingActionsTab = ({ activeTemplateData, activeCardsData, data }) => {
	let {
		templates: { getWorkflowsList, workflowslist, moreWorkList, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const navigate = useNavigate();

	useEffect(() => {
		return () => {
			updateStateValues({ workflowslist: null });
		};
	}, []);

	useEffect(() => {
		getWorkflowsListFunc(1);
	}, []);

	useEffect(() => {
		if (workflowslist) {
			parseWorkflowsListDeatils(workflowslist, false);
		}
	}, [workflowslist]);

	useEffect(() => {
		if (moreWorkList) {
			parseWorkflowsListDeatils(moreWorkList, true);
		}
	}, [moreWorkList]);

	const getWorkflowsListFunc = useCallback(
		async (page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 30,
					page: page,
					status: activeCardsData?.status,
					templateId: activeTemplateData?._id,
				},
			};

			getWorkflowsList(payload, fetchMore);
		},
		[
			activeTemplateData,
			activeCardsData,
			info?.selectedDuration,
			info?.selectedSortOptions,
			info?.searchValue,
		],
	);

	console.log(info?.workflowsDetailslist);

	const fetcMoreWorkflowList = useCallback(async () => {
		getWorkflowsListFunc(info?.currentPage + 1, true);
	}, [info?.currentPage]);

	const parseWorkflowsListDeatils = useCallback(async (variableType, fetchMore = false) => {
		let { hasNextPage, currentPage, data } = variableType || {};

		setInfo((prev) => ({
			...prev,
			loading: false,
			workflowsDetailslist: fetchMore ? prev?.workflowsDetailslist?.concat(data) : data,
			currentPage,
			hasNextPage,
		}));
	}, []);

	const filteredPendingActionsLength = () => {
		return info?.workflowsDetailslist?.filter((item) => item?.requiredAction?.action).length;
	};

	return (
		<>
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					maxHeight: '100%',
					height: '100%',
					width: '100%',
				}}
				id="pendingActions"
			>
				<InfiniteScroll
					dataLength={filteredPendingActionsLength() || 0}
					next={fetcMoreWorkflowList}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
					scrollableTarget="pendingActions"
				>
					{info?.loading ? (
						<MyWorkflowModalsLoader width={'287px'} height={'48px'} />
					) : (
						<div className="workflow-container">
							{info?.workflowsDetailslist
								?.filter((item) => item?.requiredAction?.action)
								.map((item, index) => {
									const name = item?.clientDetails?.name;
									const email = item?.clientDetails?.email;
									return (
										<div
											className="workflow-inner-card"
											key={index}
											onClick={() => {
												navigate(`/smart-file/${data?._id}/${item?._id}`);
											}}
										>
											<span className="left-text">
												{name}
												<br />
												{email}
											</span>
											<span className="right-text pending-actions-title">
												{item?.requiredAction?.action}

												<CheckIcon />
											</span>
										</div>
									);
								})}
						</div>
					)}
				</InfiniteScroll>
			</div>
		</>
	);
};

export default PendingActionsTab;
