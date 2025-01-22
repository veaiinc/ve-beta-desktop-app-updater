import React, { useState, useEffect, memo, useMemo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/NavBar';
import HeaderInfo from '../../components/homePage/HeaderInfo';
import PromptPopup from '../../components/homePage/PromptPopup';
import HomePageDashboard from '../../components/homePage/dashboard/HomePageDashboard';
import HomePageStart from '../../components/homePage/HomePageStart';

const cards = [
	{ id: 0, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 1, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 2, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 3, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 4, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 5, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 6, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 7, subTitle: 'sales', title: 'Wedding Day Timeline  Generator' },
	{ id: 8, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 9, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 10, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 11, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 12, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 13, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 14, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 15, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
];

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
		{ id: 1, title: 'All', value: 'All' },
		{ id: 2, title: 'Priority', value: 'Priority' },
		{ id: 3, title: 'Tasks', value: 'Tasks' },
		{ id: 4, title: 'Workflows', value: 'Workflows' },
		{ id: 5, title: 'Recent Chats', value: 'Recent Chats' },
		{ id: 6, title: 'Drafts & Activity', value: 'Drafts & Activity' },
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

const thresholdTopOffset = 150;

const HomePage = () => {
	const [info, setInfo] = useState({
		activeTab: 'start',
		showPromptPopup: false,
		isNavbarFixed: false,
		selectedOptionInStart: 'All',
		selectedOptionInDashboard: 'All',
		searchValue: '',
		selectedCard: null,
		selectedOptions: {},
	});

	const { title, subTitle, selectedOption } = propsForHeaderInfoAndNavBar[info?.activeTab];

	useEffect(() => {
		const homePageContainer = document.querySelector('.home-page-container');
		homePageContainer?.addEventListener('scroll', setNavbarFixed);
		return () => {
			homePageContainer?.removeEventListener('scroll', setNavbarFixed);
		};
	}, [info?.isNavbarFixed]);

	const componentMapper = useMemo(() => {
		return {
			start: <HomePageStart cards={cards} info={info} setInfo={setInfo} />,
			dashboard: (
				<HomePageDashboard
					selectedOption={info?.[selectedOption]}
					options={navbarOptions?.dashboard}
				/>
			),
		};
	}, [info, cards, navbarOptions]);

	// Render selected tab component
	const renderActiveTab = useMemo(() => {
		return (activeTab) => {
			return componentMapper[activeTab] || null;
		};
	}, []);

	const setNavbarFixed = (e) => {
		const topOffset = e?.target?.scrollTop;
		if (topOffset >= thresholdTopOffset) {
			setInfo({ ...info, isNavbarFixed: true });
		} else {
			setInfo({ ...info, isNavbarFixed: false });
		}
	};

	const handleSelectedOption = (value) => {
		setInfo({ ...info, [selectedOption]: value });
	};

	const handleSearchValue = (value) => {
		setInfo({ ...info, searchValue: value });
	};

	return (
		<>
			<div className="home-page-container">
				<div className="home-page-container-header">
					<div className="home-page-container-content">
						{topNavOptions?.map((option) => (
							<div
								key={option?.id}
								className="home-page-container-content-item-container"
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

				{renderActiveTab(info?.activeTab)}
			</div>
			<PromptPopup
				open={info?.showPromptPopup}
				closeModal={() => setInfo({ ...info, showPromptPopup: false })}
				selectedCard={info?.selectedCard}
			/>
		</>
	);
};

export default memo(HomePage);
