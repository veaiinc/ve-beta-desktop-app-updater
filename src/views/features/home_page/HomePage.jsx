import React, { useState, useEffect, memo, useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../../assets/scss/home_page/homepage.scss';
import NavBar from '../../components/homePage/navBar';
import HeaderInfo from '../../components/homePage/HeaderInfo';
import PromptPopup from '../../components/homePage/PromptPopup';
import HomePageDashboard from '../../components/homePage/dashboard/HomePageDashboard';
import HomePageStart from '../../components/homePage/HomePageStart';
import { PromptData } from '../../components/homePage/PromptData';
import Context from '../../../context/context';
import QuickActions from '../../components/globalComponents/QuickActions';
import jwtDecode from 'jwt-decode';

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

let timeoutId = null;

const HomePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	let {
		profileInfo: { userDetailsData },
		templates: { getTabItemCount, tabItemCount },
	} = useContext(Context);
	const username =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ??
		`${userDetailsData?.firstName} ${userDetailsData?.lastName}` ??
		'User';

	useEffect(() => {
		if (!tabItemCount) getTabItemCount();
	}, []);

	const [info, setInfo] = useState({
		activeTab: searchParams?.get('tab') ?? 'dashboard',
		showPromptPopup: false,
		selectedOptionInStart: searchParams?.get('startTab') || 'All',
		selectedOptionInDashboard: searchParams?.get('dashboardTab') || 'Priority',
		searchValue: '',
		selectedCard: null,
		selectedOptions: {},
		dropdown: false,
		dropdownOptions: '',
		openCreateLeadModal: false,
		selectedOptionInPriorityTab: 'all',
	});

	const filteredPromptData = PromptData?.filter((prompt) => {
		const filter = info?.selectedOptionInStart?.toLowerCase();
		if (filter === 'all') {
			return true;
		}
		return prompt?.dept?.includes(filter);
	});

	const handleSelectedOption = (value) => {
		if (info?.selectedOptionInDashboard === value) {
			return;
		}
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
		if (info?.activeTab === tab) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			activeTab: tab,
		}));
		setSearchParams({ tab });
	};

	const propsForHeaderInfoAndNavBar = useMemo(() => {
		return {
			start: {
				title: `Hey ${username},`,
				subTitle: "I'm here to help",
				selectedOption: 'selectedOptionInStart',
			},
			dashboard: {
				title: 'All Your',
				subTitle: 'Task Collections',
				selectedOption: 'selectedOptionInDashboard',
			},
		};
	}, [userDetailsData?.firstName]);

	const { title, subTitle, selectedOption } = propsForHeaderInfoAndNavBar?.[info?.activeTab];
	const showSearchBar = info?.activeTab === 'start';

	const componentMapper = useMemo(
		() => ({
			start: (
				<HomePageStart
					cards={filteredPromptData}
					setInfo={setInfo}
					searchValue={info?.searchValue}
				/>
			),
			dashboard: (
				<HomePageDashboard
					selectedOption={info?.[selectedOption]}
					options={navbarOptions?.dashboard}
					searchValue={info?.searchValue}
				/>
			),
		}),
		[filteredPromptData, info?.searchValue, info?.[selectedOption]],
	);

	return (
		<div className="home-page-container">
			<div className="black-linear-gradient"></div>
			{/* <div className="home-page-container-header"> */}
			{/* <div className="background-for-stickies"></div> */}
			<div className="home-page-container-content">
				<div className="home-page-container-content-item-container">
					<div className="home-page-container-content-item-container-left">
						<div className="priority-count">
							{tabItemCount?.all > 99 ? '99+' : tabItemCount?.all}
						</div>
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
					<div className="home-page-welcome-container-right">
						<QuickActions />
					</div>
				</div>
			</div>

			{/* <div className="home-page-welcome-container"> */}
			{/* <div className="home-page-welcome-container-left"> */}
			<HeaderInfo title={title} subTitle={subTitle} />
			<NavBar
				options={navbarOptions[info?.activeTab]}
				selectedOption={info?.[selectedOption]}
				handleSelectedOption={handleSelectedOption}
				handleSearchValue={handleSearchValue}
				showSearchBar={showSearchBar}
				tabItemCount={tabItemCount}
			/>
			{/* </div> */}
			{/* </div> */}
			{/* </div> */}
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
