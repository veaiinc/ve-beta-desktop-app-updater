import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/navBar';
import HeaderInfo from '../../components/homePage/HeaderInfo';
import PromptPopup from '../../components/homePage/PromptPopup';
import HomePageDashboard from '../../components/homePage/dashboard/HomePageDashboard';
import HomePageStart from '../../components/homePage/HomePageStart';
import { PromptData } from '../../components/homePage/PromptData';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import CreateLeadModal from '../../components/modalsV2/proposalModals/CreateLeadModal';
import { useRef } from 'react';

const topNavOptions = [
	{ id: 0, title: 'Start', value: 'start' },
	{ id: 1, title: 'Dashboard', value: 'dashboard' },
];

const navbarOptions = {
	start: [
		{ id: 1, title: 'All', value: 'All' },
		{ id: 2, title: 'Sales', value: 'Sales' },
		{ id: 3, title: 'Marketing', value: 'Marketing' },
		{ id: 4, title: 'Operations', value: 'Operations' },
	],
	dashboard: [
		{ id: 1, title: 'Priority', value: 'Priority' },
		{ id: 2, title: 'Tasks', value: 'Tasks' },
		{ id: 3, title: 'Workflows', value: 'Workflows' },
		// { id: 4, title: 'Recent Chats', value: 'Recent Chats' },
		{ id: 5, title: 'Drafts & Activity', value: 'Drafts & Activity' },
	],
};

const propsForHeaderInfoAndNavBar = {
	start: {
		title: 'Hey there,',
		subTitle: "I'm here to help",
		selectedOption: 'selectedOptionInStart',
	},
	dashboard: {
		title: 'All Your',
		subTitle: 'Task Collections',
		selectedOption: 'selectedOptionInDashboard',
	},
};

const dropdownOptions = [
	{ id: 0, title: 'Client ', value: 'client' },
	{ id: 2, title: 'Meeting', value: 'meeting' },
	{ id: 3, title: 'Task', value: 'task' },
	{ id: 4, title: 'Document', value: 'document' },
	{ id: 5, title: 'Form', value: 'form' },
	{ id: 6, title: 'Proposal', value: 'proposal' },
	{ id: 7, title: 'Invoice', value: 'invoice' },
	{ id: 8, title: 'Contract', value: 'contract' },
];
const thresholdTopOffset = 150;
let timeoutId = null;

const HomePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [info, setInfo] = useState({
		activeTab: searchParams?.get('tab') ?? 'start',
		showPromptPopup: false,
		isNavbarFixed: false,
		selectedOptionInStart: searchParams?.get('startTab') || 'All',
		selectedOptionInDashboard: searchParams?.get('dashboardTab') || 'Priority',
		searchValue: '',
		selectedCard: null,
		selectedOptions: {},
		dropdown: false,
		dropdownOptions: '',
		openCreateLeadModal: false,
	});

	const navigate = useNavigate();

	const { title, subTitle, selectedOption } = propsForHeaderInfoAndNavBar?.[info?.activeTab];
	const showSearchBar = info?.activeTab === 'start';

	useEffect(() => {
		const homePageContainer = document.querySelector('.home-page-container');
		homePageContainer?.addEventListener('scroll', setNavbarFixed);

		return () => homePageContainer?.removeEventListener('scroll', setNavbarFixed);
	}, [info?.isNavbarFixed]);

	const handleDropdownOptionClick = useCallback((type) => {
		if (type === 'meeting') {
			navigate('/calendar');
		} else if (type === 'document') {
			navigate('/docs');
		} else if (type === 'client') {
			openCreateLeadModal();
		} else if (type === 'task') {
			navigate('/tasks');
		}
	}, []);

	const closeCreateLeadModal = () => {
		setInfo((prev) => ({
			...prev,
			openCreateLeadModal: false,
		}));
	};
	const openCreateLeadModal = () => {
		setInfo((prev) => ({
			...prev,
			openCreateLeadModal: true,
		}));
	};

	const setNavbarFixed = (e) => {
		const topOffset = e?.target?.scrollTop;
		if (topOffset >= thresholdTopOffset) {
			if (info?.isNavbarFixed) return;
			setInfo((prev) => ({ ...prev, isNavbarFixed: true }));
		} else {
			if (!info?.isNavbarFixed) return;
			setInfo((prev) => ({ ...prev, isNavbarFixed: false }));
		}
	};

	const filteredPromptData = PromptData?.filter((prompt) => {
		const filter = info?.selectedOptionInStart?.toLowerCase();
		if (filter === 'all') {
			return true;
		}
		return prompt?.dept?.includes(filter);
	});

	const handleSelectedOption = (value) => {
		setInfo((prev) => ({ ...prev, [selectedOption]: value }));
		setSearchParams({ tab: info?.activeTab, [info?.activeTab + 'Tab']: value });
	};

	const handleSearchValue = (value) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			setInfo((prev) => ({ ...prev, searchValue: value }));
		}, 1000);
	};

	const handleSetActiveTab = (tab) => {
		setInfo((prev) => ({
			...prev,
			activeTab: tab,
		}));
		setSearchParams({ tab });
	};

	const componentMapper = useMemo(
		() => ({
			start: (
				<HomePageStart
					cards={filteredPromptData}
					setInfo={setInfo}
					isNavbarFixed={info?.isNavbarFixed}
					searchValue={info?.searchValue}
				/>
			),
			dashboard: (
				<HomePageDashboard
					selectedOption={info?.[selectedOption]}
					options={navbarOptions?.dashboard}
					isNavbarFixed={info?.isNavbarFixed}
					searchValue={info?.searchValue}
				/>
			),
		}),
		[filteredPromptData, info?.isNavbarFixed, info?.searchValue, info?.[selectedOption]],
	);

	return (
		<div className="home-page-container">
			<div className="black-linear-gradient"></div>
			<div className="home-page-container-header">
				<div className="home-page-container-content">
					<div className="home-page-container-content-item-container">
						<div className="home-page-container-content-item-container-left">
							{topNavOptions?.map((option) => (
								<div
									key={option?.id}
									className="home-page-container-content-item-container-left"
								>
									<div
										className={`home-page-container-content-item ${
											info?.activeTab === option?.value ? 'active' : ''
										}`}
										onClick={() => handleSetActiveTab(option?.value)}
									>
										{option?.title}
									</div>
									{option?.id !== topNavOptions?.length - 1 && (
										<div className="home-page-container-content-item-divider"></div>
									)}
								</div>
							))}
						</div>
					</div>
					<div className="home-page-container-tooltip-container">
						<Tooltip
							placement="bottom"
							open={info?.dropdown}
							trigger={'click'}
							onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
							color="transparent"
							title={
								<div className="home-page-dropdown-options-container">
									{dropdownOptions?.map((option) => (
										<div
											key={option?.id}
											className="dropdown-option"
											onClick={
												() => handleDropdownOptionClick(option?.value)
												// setInfo({ ...info, dropdownOptions: option?.value })
											}
										>
											{option?.title}
										</div>
									))}
								</div>
							}
						>
							<button
								className="home-page-container-content-item-container-right"
								onClick={() => setInfo({ ...info, dropdown: !info?.dropdown })}
							>
								+ New
							</button>
						</Tooltip>
					</div>
				</div>

				<div className="home-page-welcome-container">
					<div
						className={`home-page-welcome-container-left ${
							info?.isNavbarFixed ? 'fixed' : ''
						}`}
					>
						<HeaderInfo
							isNavbarFixed={info?.isNavbarFixed}
							title={title}
							subTitle={subTitle}
						/>
						<NavBar
							options={navbarOptions[info?.activeTab]}
							selectedOption={info?.[selectedOption]}
							handleSelectedOption={handleSelectedOption}
							handleSearchValue={handleSearchValue}
							showSearchBar={showSearchBar}
						/>
					</div>
				</div>
			</div>
			{componentMapper?.[info?.activeTab]}
			<PromptPopup
				open={info?.showPromptPopup}
				closeModal={() => setInfo({ ...info, showPromptPopup: false })}
				selectedCard={info?.selectedCard}
			/>
			<CreateLeadModal
				modalIsOpen={info?.openCreateLeadModal}
				closeModal={closeCreateLeadModal}
			/>
		</div>
	);
};

export default memo(HomePage);
