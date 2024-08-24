import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/sales/myWorkflowModals.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Search } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';
import { ReactComponent as CircledCross } from '../../../../assets/svg/workflow/circledCorss.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/worflow_builder/rightColoredArrow.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import MyWorkflowModalsLoader from './MyWorkflowModalsLoader';
import { Drawer } from 'antd';
import moment from 'moment';

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
const stageOptions = [
	{
		label: 'Enquiry',
		value: 'enquiry',
	},
	{
		label: 'Smart File Sent',
		value: 'smartFileSent',
	},
	{
		label: 'Contract Signed',
		value: 'contractSigned',
	},
	{
		label: 'Boooking Confirmed',
		value: 'bookingConfirmed',
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

const decideSelectedSortOptionValue = (data) => {
	let result;
	if (data === 'newestFirst') {
		result = [-1, 'createdAt'];
	}
	if (data === 'oldestFirst') {
		result = [1, 'createdAt'];
	}
	if (data === 'az') {
		result = [1, 'clientName'];
	}
	if (data === 'za') {
		result = [-1, 'clientName'];
	}
	return result;
};

const decideDurationValue = (value) => {
	let startDate, endDate;
	if (value === 'all') {
		startDate = null;
		endDate = null;
	}
	if (value === 'lastWeek') {
		startDate = moment().subtract(1, 'weeks').startOf('week').unix();
		endDate = moment().subtract(1, 'weeks').endOf('week').unix();
	}
	if (value === 'last30Days') {
		startDate = moment().subtract(30, 'days').startOf('day').unix();
		endDate = moment().endOf('day').unix();
	}
	if (value === 'last90Days') {
		startDate = moment().subtract(90, 'days').startOf('day').unix();
		endDate = moment().endOf('day').unix();
	}
	if (value === 'last12Months') {
		startDate = moment().subtract(12, 'months').startOf('month').unix();
		endDate = moment().endOf('month').unix();
	}
	return [startDate, endDate];
};

const MyWorkflowsModals = ({ modalIsOpen, closeModal, activeTemplateData, activeCardsData }) => {
	const navigate = useNavigate();
	let {
		templates: { getWorkflowsList, workflowslist, moreWorkList, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		return () => {
			updateStateValues({ workflowslist: null });
		};
	}, []);

	useEffect(() => {
		if (activeTemplateData && activeCardsData) {
			getWorkflowsListFunc(1);
		}
	}, [activeTemplateData, activeCardsData]);

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

	useEffect(() => {
		if (info?.selectedSortOptions && modalIsOpen && info?.sortOptionsChanged) {
			getWorkflowsListFunc(1, false);
			setInfo((prev) => ({ ...prev, loading: true }));
		}
	}, [info?.selectedSortOptions, modalIsOpen, info?.sortOptionsChanged]);

	useEffect(() => {
		if (info?.selectedDuration && modalIsOpen && info?.durationOptionChanged) {
			getWorkflowsListFunc(1, false);
			setInfo((prev) => ({ ...prev, loading: true }));
		}
	}, [info?.selectedDuration, modalIsOpen, info?.durationOptionChanged]);

	useEffect(() => {
		if (info?.searchValueChanged) {
			handleDebounceSearch();
		}
	}, [info?.searchValue, info?.searchValueChanged]);

	const getWorkflowsListFunc = useCallback(
		async (page, fetchMore = false) => {
			if (activeTemplateData && activeCardsData) {
				let [startDate, endDate] = decideDurationValue(info?.selectedDuration?.value);
				let [decideSortType, sortBy] = decideSelectedSortOptionValue(
					info?.selectedSortOptions?.value,
				);
				const payload = {
					filters: {
						limit: 30,
						page: page,
						status: activeCardsData?.status,
						templateId: activeTemplateData?._id,
						sortType: decideSortType,
						sortBy: sortBy,
						clientName: info?.searchValue?.length ? info?.searchValue : '',
					},
				};

				if (startDate && endDate) {
					payload.filters['startDate'] = startDate;
					payload.filters['endDate'] = endDate;
				}
				getWorkflowsList(payload, fetchMore);
			}
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

	const modifiedCloseModal = useCallback(() => {
		setInfo(initialState);
		closeModal();
	}, []);

	const onFilterDurationOptionChanged = useCallback(
		async (data) => {
			if (data?.value === info?.selectedDuration?.value) {
				return;
			}

			setInfo((prev) => ({ ...prev, selectedDuration: data, durationOptionChanged: true }));
		},
		[info?.selectedDuration, info?.durationOptionChanged],
	);

	const onFilterSortOptionsChnaged = useCallback(
		async (data) => {
			if (data?.value === info?.selectedSortOptions?.value) {
				return;
			}

			setInfo((prev) => ({ ...prev, selectedSortOptions: data, sortOptionsChanged: true }));
		},
		[info?.selectedSortOptions, info?.sortOptionsChanged],
	);

	const handleDebounceSearch = useCallback(() => {
		clearInterval(info?.timeout);
		const timeout = setTimeout(() => {
			getWorkflowsListFunc(1, false);
			setInfo((prev) => ({
				...prev,
				loading: true,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.searchValue, info?.searchValueChanged]);

	return (
		<Drawer
			onClose={modifiedCloseModal}
			width={420}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="myWorkflowModalParentContainer">
				<div className="innerContainer">
					<div className="headerContianer">
						<span className="headerTitle">
							{activeCardsData?.type !== 'actionCards'
								? activeCardsData?.subText
								: ''}{' '}
							{activeCardsData?.modalHeader}
						</span>
						<span className="closeBtnWrapper" onClick={closeModal}>
							<Close />
						</span>
					</div>
					<div className="filterContainerWrapper">
						<div className="filterContainer">
							<HeadersDropDownComp
								showIcon={false}
								options={timeOptions}
								containerStyle={{
									padding: '12px 24px',
									height: ' 26px',
									padding: '4px 8px',
									color: '#E4E5E6',
									width: 'fit-content',
									minWidth: '100px',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '100px',
									background: 'rgba(36, 36, 36, 0.64)',
									opacity: info?.searchExpand ? 0 : 1,
									transition: 'all 0.3s ease',
								}}
								dropDownStyle={{
									right: 0,
									top: '35px',
									maxHeight: '300px',
									width: '190px',
								}}
								selectedValue={info?.selectedDuration?.label}
								selectedValueStyle={{
									overflow: 'hidden',
									color: '#E4E5E6',
									textOverflow: 'ellipsis',
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '14px' /* 116.667% */,
									letterSpacing: '-0.24px',
								}}
								onChangeFunc={(e) => onFilterDurationOptionChanged(e)}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'value'}
								selectedValueObj={info?.selectedDuration}
							/>
							{activeCardsData?.type !== 'statstCards' ? (
								<HeadersDropDownComp
									showIcon={false}
									options={stageOptions}
									containerStyle={{
										padding: '12px 24px',
										height: ' 26px',
										padding: '4px 8px',
										color: '#E4E5E6',
										width: 'inherit',
										flex: 1,
										alignSelf: 'stretch',
										borderRadius: '100px',
										background: 'rgba(36, 36, 36, 0.64)',
									}}
									dropDownStyle={{
										right: 0,
										top: '35px',
										maxHeight: '300px',
										width: '190px',
									}}
									selectedValue={'Stage'}
									selectedValueStyle={{
										overflow: 'hidden',
										color: '#E4E5E6',
										textOverflow: 'ellipsis',
										fontFamily: 'Inter',
										fontSize: '12px',
										fontStyle: 'normal',
										fontWeight: '400',
										lineHeight: '14px' /* 116.667% */,
										letterSpacing: '-0.24px',
									}}
									// onChangeFunc={(e) => onChangeEmailTemplates(e)}
								/>
							) : (
								''
							)}
							<HeadersDropDownComp
								showIcon={false}
								options={sortOptions}
								containerStyle={{
									padding: '12px 24px',
									height: ' 26px',
									padding: '4px 8px',
									color: '#E4E5E6',
									width: 'inherit',
									flex: 1,
									alignSelf: 'stretch',
									borderRadius: '100px',
									background: 'rgba(36, 36, 36, 0.64)',
									transition: 'all 0.3s ease',
									opacity: info?.searchExpand ? 0 : 1,
								}}
								dropDownStyle={{
									right: 0,
									top: '35px',
									maxHeight: '300px',
									width: '180px',
									left: 'unset',
								}}
								selectedValue={info?.selectedSortOptions?.label}
								selectedValueStyle={{
									overflow: 'hidden',
									color: '#E4E5E6',
									textOverflow: 'ellipsis',
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '400',
									lineHeight: '14px' /* 116.667% */,
									letterSpacing: '-0.24px',
								}}
								onChangeFunc={(e) => onFilterSortOptionsChnaged(e)}
								showSelectedValueTick={true}
								uniqueIdentifierForTickIcon={'value'}
								selectedValueObj={info?.selectedSortOptions}
							/>
						</div>
						<div className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}>
							<span
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									cursor: 'pointer',
								}}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										searchExpand: true,
									}))
								}
							>
								<Search />
							</span>

							<div className="inputAndCloseContainer">
								<input
									className="searchInputTag"
									placeholder="Search"
									value={info?.searchValue}
									onChange={(e) =>
										setInfo((prev) => ({
											...prev,
											searchValue: e.target?.value,
											searchValueChanged: true,
										}))
									}
								/>
								<span
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											searchValue: '',
											searchValueChanged: true,
											searchExpand: false,
										}))
									}
								>
									<CircledCross />
								</span>
							</div>
						</div>
					</div>
					<div className="subCardContainer">
						<InfiniteScroll
							dataLength={info?.workflowsDetailslist || 0}
							next={fetcMoreWorkflowList}
							hasMore={info?.hasNextPage}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
							}}
						>
							{info?.loading ? (
								<MyWorkflowModalsLoader />
							) : (
								info?.workflowsDetailslist?.map((item, index) => (
									<div
										className="modalSubCard"
										key={index}
										onClick={() =>
											navigate(`/smart-file/${activeTemplateData?._id}`, {
												state: {
													workflowId: item?._id,
													workflow: item,
												},
											})
										}
									>
										<span className="modalSubCardTitle">
											{item?.clientDetails?.name || ''}
										</span>
										<div className="modalSubLabelContainer">
											<span className="subLabelStyling">
												{item?.clientDetails?.email || ''}
											</span>
											{activeCardsData?.status === 'actionRequired' ? (
												<div className="actionRequiredCard">
													<span className="requiredActionStatus">
														{item?.requiredAction?.action}
													</span>
													<RightArrow />
												</div>
											) : (
												<div className="symbolContainer">
													<span className="subLabelStyling">
														{item?.status}
													</span>
													<Tick />
												</div>
											)}
										</div>
									</div>
								))
							)}
						</InfiniteScroll>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default MyWorkflowsModals;
