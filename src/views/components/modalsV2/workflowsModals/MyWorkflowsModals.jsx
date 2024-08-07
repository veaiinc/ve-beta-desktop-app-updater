import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/sales/myWorkflowModals.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Search } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';

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
};
const MyWorkflowsModals = ({ modalIsOpen, closeModal, activeTemplateData, activeCardsData }) => {
	const navigate = useNavigate();
	let {
		templates: { getWorkflowsList, workflowslist, moreWorkList },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);

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

	const getWorkflowsListFunc = useCallback(
		async (page, fetchMore = false) => {
			if (activeTemplateData && activeCardsData) {
				const payload = {
					filters: {
						limit: 10,
						page: page,
						status: activeCardsData?.status,
						templateId: activeTemplateData?._id,
					},
				};
				getWorkflowsList(payload, fetchMore);
			}
		},
		[activeTemplateData, activeCardsData],
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

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={modifiedCloseModal} modalType="right">
			<div className="myWorkflowModalParentContainer">
				<div className="innerContainer">
					<div className="headerContianer">
						<span className="headerTitle">All Enquires</span>
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
								}}
								dropDownStyle={{
									right: 0,
									top: '35px',
									maxHeight: '300px',
									width: '190px',
								}}
								selectedValue={'All Time'}
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
								}}
								dropDownStyle={{
									right: 0,
									top: '35px',
									maxHeight: '300px',
									width: '190px',
									left: 'unset',
								}}
								selectedValue={'Sort'}
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
						</div>
						<div className="searchBtn">
							<Search />
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
							{info?.workflowsDetailslist?.map((item, index) => (
								<div
									className="modalSubCard"
									key={index}
									onClick={() =>
										navigate('/smart-file', {
											state: {
												data: activeTemplateData,
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
										<div className="symbolContainer">
											<span className="subLabelStyling">{item?.status}</span>
											<Tick />
										</div>
									</div>
								</div>
							))}
						</InfiniteScroll>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default MyWorkflowsModals;
