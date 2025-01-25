import React, { useContext, useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';
import { ReactComponent as CheckIcon } from '../../../../../../assets/svg/home_page/Check.svg';
import Context from '../../../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import MyWorkflowModalsLoader from '../../../../modalsV2/workflowsModals/MyWorkflowModalsLoader';
import moment from 'moment';
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
// const stageOptions = [
// 	{
// 		label: 'Enquiry',
// 		value: 'enquiry',
// 	},
// 	{
// 		label: 'Smart File Sent',
// 		value: 'smartFileSent',
// 	},
// 	{
// 		label: 'Contract Signed',
// 		value: 'contractSigned',
// 	},
// 	{
// 		label: 'Boooking Confirmed',
// 		value: 'bookingConfirmed',
// 	},
// ];

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

// const decideSelectedSortOptionValue = (data) => {
// 	let result;
// 	if (data === 'newestFirst') {
// 		result = [-1, 'createdAt'];
// 	}
// 	if (data === 'oldestFirst') {
// 		result = [1, 'createdAt'];
// 	}
// 	if (data === 'az') {
// 		result = [1, 'clientName'];
// 	}
// 	if (data === 'za') {
// 		result = [-1, 'clientName'];
// 	}
// 	return result;
// };

// const decideDurationValue = (value) => {
// 	let startDate, endDate;
// 	if (value === 'all') {
// 		startDate = null;
// 		endDate = null;
// 	}
// 	if (value === 'lastWeek') {
// 		startDate = moment().subtract(1, 'weeks').startOf('week').unix();
// 		endDate = moment().subtract(1, 'weeks').endOf('week').unix();
// 	}
// 	if (value === 'last30Days') {
// 		startDate = moment().subtract(30, 'days').startOf('day').unix();
// 		endDate = moment().endOf('day').unix();
// 	}
// 	if (value === 'last90Days') {
// 		startDate = moment().subtract(90, 'days').startOf('day').unix();
// 		endDate = moment().endOf('day').unix();
// 	}
// 	if (value === 'last12Months') {
// 		startDate = moment().subtract(12, 'months').startOf('month').unix();
// 		endDate = moment().endOf('month').unix();
// 	}
// 	return [startDate, endDate];
// };

const PendingActionsTab = ({ activeTemplateData, activeCardsData, data }) => {
	let {
		templates: { getWorkflowsList, workflowslist, moreWorkList, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const navigate = useNavigate();
	console.log(activeTemplateData);

	useEffect(() => {
		return () => {
			updateStateValues({ workflowslist: null });
		};
	}, []);

	// useEffect(() => {
	// 	if (activeTemplateData && activeCardsData) {
	// 		getWorkflowsListFunc(1);
	// 	}
	// }, [activeTemplateData, activeCardsData]);

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

	console.log(info?.workflowsDetailslist);

	// useEffect(() => {
	// 	if (info?.selectedSortOptions && info?.sortOptionsChanged) {
	// 		getWorkflowsListFunc(1, false);
	// 		setInfo((prev) => ({ ...prev, loading: true }));
	// 	}
	// }, [info?.selectedSortOptions, info?.sortOptionsChanged]);

	// useEffect(() => {
	// 	if (info?.selectedDuration && info?.durationOptionChanged) {
	// 		getWorkflowsListFunc(1, false);
	// 		setInfo((prev) => ({ ...prev, loading: true }));
	// 	}
	// }, [info?.selectedDuration, info?.durationOptionChanged]);

	// useEffect(() => {
	// 	if (info?.searchValueChanged) {
	// 		handleDebounceSearch();
	// 	}
	// }, [info?.searchValue, info?.searchValueChanged]);

	const getWorkflowsListFunc = useCallback(
		async (page, fetchMore = false) => {
			// if (activeTemplateData && activeCardsData) {
			// let [startDate, endDate] = decideDurationValue(info?.selectedDuration?.value);
			// let [decideSortType, sortBy] = decideSelectedSortOptionValue(
			// 	info?.selectedSortOptions?.value,
			// );
			const payload = {
				filters: {
					limit: 30,
					page: page,
					status: activeCardsData?.status,
					templateId: activeTemplateData?._id,
					// sortType: decideSortType,
					// sortBy: sortBy,
					// clientName: info?.searchValue?.length ? info?.searchValue : '',
				},
			};

			// if (startDate && endDate) {
			// 	payload.filters['startDate'] = startDate;
			// 	payload.filters['endDate'] = endDate;
			// }
			getWorkflowsList(payload, fetchMore);
			// }
		},
		[
			activeTemplateData,
			activeCardsData,
			info?.selectedDuration,
			info?.selectedSortOptions,
			info?.searchValue,
		],
	);

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

	console.log(info?.workflowsDetailslist);

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
						<MyWorkflowModalsLoader />
					) : (
						<div className="workflow-container">
							{info?.workflowsDetailslist
								?.filter((item) => item?.requiredAction?.action)
								.map((item, index) => {
									return (
										<div
											className="workflow-inner-card"
											key={index}
											onClick={() => {
												navigate(`/smart-file/${data?._id}/${item?._id}`);
											}}
										>
											<span className="left-text">
												{item?.requiredAction?.action}
											</span>
											<span className="right-text">
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
