import React, { useState, useEffect } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/NavBar';
import HeaderInfo from '../../components/homePage/HeaderInfo';
import PromptPopup from '../../components/homePage/PromptPopup';

const cards = [
	{ id: 0, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 1, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 2, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 3, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 4, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 5, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 6, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
	{ id: 7, subTitle: 'sales', title: 'Wedding Day Timeline Generator' },
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

const initialTopOffset = 300;

const HomePage = () => {
	const [info, setInfo] = useState({
		activeTab: 'start',
		showPromptPopup: false,
		isNavbarFixed: false,
		selectedOptionInStart: 'All',
		selectedOptionInDashboard: 'All',
		searchValue: '',
	});

	// Derived States for conditional rendering
	const title = info?.activeTab === 'start' ? 'Hey there,' : 'All Your';
	const subTitle = info?.activeTab === 'start' ? "I'm here to help" : 'Task Collections';
	const selectedOption =
		info?.activeTab === 'start' ? 'selectedOptionInStart' : 'selectedOptionInDashboard';

	useEffect(() => {
		window?.addEventListener('scroll', handleScroll);
		return () => {
			window?.removeEventListener('scroll', handleScroll);
		};
	}, [info?.isNavbarFixed]);

	const handleScroll = () => {
		console.log(window?.scrollY >= initialTopOffset);
		if (window?.scrollY >= initialTopOffset) {
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

	useEffect(() => {
		console.log(info?.showPromptPopup, 'PromptPopup testing');
	}, [info?.showPromptPopup]);

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
									onClick={() => setInfo({ ...info, activeTab: option?.value })}
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
						<div className="home-page-welcome-container-left">
							<HeaderInfo title={title} subTitle={subTitle} />
							<NavBar
								options={navbarOptions[info?.activeTab]}
								isNavbarFixed={info?.isNavbarFixed}
								selectedOption={info?.[selectedOption]}
								handleSelectedOption={handleSelectedOption}
								handleSearchValue={handleSearchValue}
							/>
						</div>
					</div>
				</div>

				<div className="home-page-cards-container">
					{cards?.map((card) => (
						<div
							key={card?.id}
							className="home-page-cards-container-card"
							onClick={() => setInfo({ ...info, showPromptPopup: true })}
						>
							<div className="home-page-cards-container-card-sub-title">
								{card?.subTitle}
							</div>
							<div className="home-page-cards-container-card-title">
								{card?.title}
							</div>
						</div>
					))}
				</div>
			</div>
			<PromptPopup
				open={info?.showPromptPopup}
				closeModal={() => setInfo({ ...info, showPromptPopup: false })}
			/>
		</>
	);
};

export default HomePage;
