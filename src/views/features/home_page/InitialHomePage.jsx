import React, { memo, useContext, useState } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import { PromptData } from '../../components/homePage/PromptData';
import HomePage from './HomePage';

const initialHomePageOptions = [
	{ id: 1, title: 'All Prompts', type: 'all' },
	{ id: 2, title: 'Sales', type: 'sales' },
	{ id: 3, title: 'Marketing', type: 'marketing' },
	{ id: 4, title: 'Operations', type: 'operations' },
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
	const [selectedNavBarOption, setSelectedNavBarOption] = useState(navBarOptions[0]);
	let {
		profileInfo: { userDetailsData },
	} = useContext(Context);
	const username =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ??
		`${userDetailsData?.firstName} ${userDetailsData?.lastName}` ??
		'User';

	return (
		<>
			{selectedOption ? (
				<div>
					<HomePage getSelectedOption={selectedOption} start={isStart} />
				</div>
			) : (
				<div className="initialHomePageContainer">
					<div className="initialHomeContainerFixedContent">
						<div className="initialHomeContainerFixedContent-item-container">
							{navBarOptions.map((item, index) => {
								return (
									<>
										<div
											className={`initialHomeContainerFixedContent-item ${
												selectedNavBarOption?.id === item?.id
													? 'active'
													: ''
											}`}
											onClick={() => {
												setSelectedNavBarOption(item);
												setIsStart(item?.type === 'start');
											}}
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
										onClick={() => setSelectedOption(item?.title)}
									>
										{item.title}
									</div>
								);
							})}
						</div>
					</div>
					<div className="initialHomePageContainer-prompts">
						<div className="initialHomePageContainerCards">
							{PromptData.map((item) => {
								return (
									<div className="initialHomepageEachCard">
										<div className="initialHomepageEachCard-type">
											<div className="initialHomepageEachCard-type-title">
												Workflows for
											</div>
											<div className="initialHomepageEachCard-type-type">
												{item.dept}
											</div>
										</div>
										<div className="initialHomepageEachCard-title">
											{item.title}
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
