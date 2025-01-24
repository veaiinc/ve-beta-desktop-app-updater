import React, { useState, useEffect, memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/NavBar';
import HeaderInfo from '../../components/homePage/HeaderInfo';
import PromptPopup from '../../components/homePage/PromptPopup';
import HomePageDashboard from '../../components/homePage/dashboard/HomePageDashboard';
import HomePageStart from '../../components/homePage/HomePageStart';
import { PromptData } from '../../components/homePage/PromptData';

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

	const componentMapper = {
		start: (
			<HomePageStart
				cards={PromptData}
				setInfo={setInfo}
				isNavbarFixed={info?.isNavbarFixed}
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

	const setNavbarFixed = (e) => {
		const topOffset = e?.target?.scrollTop;
		if (topOffset >= thresholdTopOffset) {
			setInfo((prev) => ({ ...prev, isNavbarFixed: true }));
		} else {
			setInfo((prev) => ({ ...prev, isNavbarFixed: false }));
		}
	};

	const handleSelectedOption = (value) => {
		setInfo((prev) => ({ ...prev, [selectedOption]: value }));
	};

	const handleSearchValue = (value) => {
		setInfo((prev) => ({ ...prev, searchValue: value }));
	};

	return (
		<div className="home-page-container">
			<div className="black-linear-gradient"></div>
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
