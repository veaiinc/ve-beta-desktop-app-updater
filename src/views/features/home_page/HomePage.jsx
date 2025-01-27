import React, { useState, useEffect, memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/navBar';
import HeaderInfo from '../../components/homePage/HeaderInfo';
import PromptPopup from '../../components/homePage/PromptPopup';
import HomePageDashboard from '../../components/homePage/dashboard/HomePageDashboard';
import HomePageStart from '../../components/homePage/HomePageStart';
import { PromptData } from '../../components/homePage/PromptData';
import { Tooltip } from 'antd';

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
		{ id: 4, title: 'Recent Chats', value: 'Recent Chats' },
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
	{ id: 0, title: 'Client ', value: 'Client' },
	{ id: 1, title: 'Workflow', value: 'Workflow' },
	{ id: 2, title: 'Meeting', value: 'Meeting' },
	{ id: 3, title: 'Task', value: 'Task' },
	{ id: 4, title: 'Document', value: 'Document' },
	{ id: 5, title: 'Form', value: 'Form' },
	{ id: 6, title: 'Proposal', value: 'Proposal' },
	{ id: 7, title: 'Invoice', value: 'Invoice' },
	{ id: 8, title: 'Contract', value: 'Contract' },
];
const thresholdTopOffset = 150;

const HomePage = () => {
	const [info, setInfo] = useState({
		activeTab: 'start',
		showPromptPopup: false,
		isNavbarFixed: false,
		selectedOptionInStart: 'All',
		selectedOptionInDashboard: 'Priority',
		searchValue: '',
		selectedCard: null,
		selectedOptions: {},
		dropdown: false,
		dropdownOptions: '',
	});

	const { title, subTitle, selectedOption } = propsForHeaderInfoAndNavBar?.[info?.activeTab];

	useEffect(() => {
		const homePageContainer = document.querySelector('.home-page-container');
		homePageContainer?.addEventListener('scroll', setNavbarFixed);

		return () => homePageContainer?.removeEventListener('scroll', setNavbarFixed);
	}, [info?.isNavbarFixed]);

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
	};

	const handleSearchValue = (value) => {
		setInfo((prev) => ({ ...prev, searchValue: value }));
	};

	const componentMapper = {
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
			/>
		),
	};

	console.log('rerender');

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
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												activeTab: option?.value,
											}))
										}
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
							title={
								<div className="home-page-dropdown-options-container">
									{dropdownOptions?.map((option) => (
										<div
											key={option?.id}
											className="dropdown-option"
											onClick={() =>
												setInfo({ ...info, dropdownOptions: option?.value })
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
		</div>
	);
};

export default memo(HomePage);
