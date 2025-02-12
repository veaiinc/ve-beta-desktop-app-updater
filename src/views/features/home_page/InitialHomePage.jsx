import React, { memo, useContext, useState, useEffect } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import { PromptData } from '../../components/homePage/PromptData';
import HomePage from './HomePage';
import ChatBox from '../../components/homePage/ChatBox';
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
	const [info, setInfo] = useState({
		isStart: true,
		selectedOption: null,
		selectedNavBarOption: null,
		dashboardSelected: false,
	});

	let {
		profileInfo: { userDetailsData },
	} = useContext(Context);
	const username =
		jwtDecode(localStorage.getItem('usertoken'))?.userName?.split(' ')[0] ??
		`${userDetailsData?.firstName}` ??
		'User';

	const handleNavBarSelection = (item) => {
		setInfo({ ...info, selectedNavBarOption: item });
		if (item?.type === 'start') {
			setInfo((prev) => ({
				...prev,
				isStart: true,
				dashboardSelected: true,
				selectedOption: 'All',
			}));
			return;
		}
		if (item?.type === 'dashboard') {
			setInfo((prev) => ({ ...prev, dashboardSelected: true, isStart: false }));
		}
		if (item?.type === 'agent47') {
		}
		if (item?.type === 'managerAI') {
		}
		setInfo((prev) => ({ ...prev, isStart: false }));
	};

	return (
		<>
			{info?.selectedOption !== null || info?.dashboardSelected ? (
				<div>
					<HomePage getSelectedOption={info?.selectedOption} start={info?.isStart} />
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
												info?.selectedNavBarOption?.id === item?.id
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
							{initialHomePageOptions?.map((item) => {
								return (
									<div
										className="initialHomePageContainerOptions-item"
										onClick={() =>
											setInfo({ ...info, selectedOption: item?.type })
										}
									>
										{item?.title}
									</div>
								);
							})}
						</div>
					</div>
					<div className="initialHomePageContainer-chatBox">
						<ChatBox />
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
