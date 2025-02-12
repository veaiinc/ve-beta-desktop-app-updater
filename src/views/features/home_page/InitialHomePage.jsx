import React, { memo, useContext, useState } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import { PromptData } from '../../components/homePage/PromptData';
import HomePage from './HomePage';

const initialHomePageOptions = [
	{ id: 1, title: 'All Prompts', type: 'All' },
	{ id: 2, title: 'Sales', type: 'Sales' },
	{ id: 3, title: 'Marketing', type: 'Marketing' },
	{ id: 4, title: 'Operations', type: 'Operations' },
];

const navBarOptions = [
	{ id: 1, title: 'Start', type: 'start' },
	{ id: 2, title: 'Dashboard', type: 'dashboard' },
	{ id: 3, title: 'Agent47', type: 'agent47' },
	{ id: 4, title: 'ManagerAI', type: 'managerAI' },
];

const InitialHomePage = () => {
	const [isStart, setIsStart] = useState(true);
	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedNavBarOption, setSelectedNavBarOption] = useState(null);
	const [dashboardSelected, setDashboardSelected] = useState(false);

	let {
		profileInfo: { userDetailsData },
	} = useContext(Context);
	const username =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ??
		`${userDetailsData?.firstName} ${userDetailsData?.lastName}` ??
		'User';

	const handleNavBarSelection = (item) => {
		setSelectedNavBarOption(item);
		if (item?.type === 'start') {
			setIsStart(true);
			setDashboardSelected(true);
			setSelectedOption('All');
			return;
		}
		if (item?.type === 'dashboard') {
			// dashboard logic here...
			setDashboardSelected(true);
		}
		if (item?.type === 'agent47') {
		}
		if (item?.type === 'managerAI') {
		}
		setIsStart(false);
	};

	return (
		<>
			{selectedOption || dashboardSelected ? (
				<div>
					<HomePage getSelectedOption={selectedOption} start={isStart} />
				</div>
			) : (
				<div className="initialHomePageContainer">
					<div className="initialHomeContainerFixedContent">
						<div className="initialHomeContainerFixedContent-item-container">
							{navBarOptions?.map((item, index) => {
								return (
									<>
										<div
											className={`initialHomeContainerFixedContent-item ${
												selectedNavBarOption?.id === item?.id
													? 'active'
													: ''
											}`}
											onClick={() => handleNavBarSelection(item)}
										>
											{item?.title}
										</div>
										{index !== navBarOptions.length - 1 && (
											<div className="initialHomeContainerFixedContent-divider"></div>
										)}
									</>
								);
							})}
						</div>
					</div>
					<div className="initialHomePageContainer-content">
						<div className="initialHomePageContainer-header">
							Hey <span>{username}</span> <br />
							I'm here to help
						</div>
						<div className="initialHomePageContainerOptions">
							{initialHomePageOptions.map((item) => {
								return (
									<div
										className="initialHomePageContainerOptions-item"
										onClick={() => setSelectedOption(item?.type)}
									>
										{item?.title}
									</div>
								);
							})}
						</div>
					</div>
					<div className="initialHomePageContainer-prompts">
						<div className="initialHomePageContainerCards">
							{PromptData?.map((item) => {
								return (
									<div className="initialHomepageEachCard">
										<div className="initialHomepageEachCard-type">
											<div className="initialHomepageEachCard-type-title">
												Workflows for
											</div>
											<div className="initialHomepageEachCard-type-type">
												{item?.dept}
											</div>
										</div>
										<div className="initialHomepageEachCard-title">
											{item?.title}
										</div>
									</div>
								);
							})}
						</div>
						<div className="initialHomePageContainerFooter">
							Above are the Prompts you need to ask me as per your business{' '}
							<span>goals</span> check all prompts for more.
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(InitialHomePage);
