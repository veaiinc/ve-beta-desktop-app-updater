import React from 'react';
import '../../../../assets/scss/sales/myWorkflowModals.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Search } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
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

const demoCard = [{}, {}, {}, {}, {}, {}, {}, {}];
const MyWorkflowsModals = ({ modalIsOpen, closeModal, activeTemplateData }) => {
	const navigate = useNavigate();
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} modalType="right">
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
						{demoCard?.map((item, index) => (
							<div
								className="modalSubCard"
								key={index}
								onClick={() =>
									navigate('/smart-file', { state: { data: activeTemplateData } })
								}
							>
								<span className="modalSubCardTitle">Aaron Lemke</span>
								<div className="modalSubLabelContainer">
									<span className="subLabelStyling">johnappleseed@email.com</span>
									<div className="symbolContainer">
										<span className="subLabelStyling">File Sent</span>
										<Tick />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default MyWorkflowsModals;
