import React, { memo, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import PromptPopup from '../../components/homePage/PromptPopup';
import HomePage from './HomePage';
import ChatBox from '../../components/homePage/ChatBox';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import ProactiveSuggestions from './ProactiveSuggestions';
import ChatPrompts from './ChatPrompts';
// const initialHomePageOptions = [
// 	{ id: 1, title: 'All Prompts', type: 'all' },
// 	{ id: 2, title: 'Sales', type: 'sales' },
// 	{ id: 3, title: 'Marketing', type: 'marketing' },
// 	{ id: 4, title: 'Operations', type: 'operations' },
// ];

const navBarOptions = [
	{ id: 1, title: 'Start', type: 'start' },
	{ id: 2, title: 'Dashboard', type: 'dashboard' },
	// { id: 3, title: 'Agent47', type: 'agent47' },
	// { id: 4, title: 'ManagerAI', type: 'managerAI' },
];

const optionsList = [
	{
		id: 1,
		label: 'Proactive suggestions',
		value: 'proactiveSuggestions',
	},
	{
		id: 2,
		label: 'Prompts library',
		value: 'prompts',
	},
];

const InitialHomePage = () => {
	const {
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		isStart: false,
		selectedOption: null,
		selectedNavBarOption: navBarOptions[0],
		dashboardSelected: false,
		goBackToInitialHomePage: false,
		showPromptPopup: false,
		selectedCard: null,

		selectedOption: 'proactiveSuggestions',
		options: optionsList,
	});

	let {
		profileInfo: { userDetailsData },
		aiSetup: { getPromptsData, promptsData },
	} = useContext(Context);

	const username =
		jwtDecode(localStorage.getItem('usertoken'))?.userName?.split(' ')[0] ??
		`${userDetailsData?.firstName}` ??
		'User';
	useEffect(() => {
		if (promptsData?.data?.length === 0) {
			handleUpdateOptions('prompts');
		} else {
			getPromptsData({ category: 'all' });
		}
	}, [promptsData?.data?.length]);

	// useEffect(() => {
	// 	if (info?.selectedOption && info?.selectedOption !== 'all') {
	// 		getPromptsData({ category: info?.selectedOption });
	// 	} else {
	// 		getPromptsData();
	// 	}
	// }, [info?.selectedOption]);

	// const handleNavBarSelection = (item) => {
	// 	setInfo({ ...info, selectedNavBarOption: item });
	// 	if (item?.type === 'dashboard') {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			dashboardSelected: true,
	// 			selectedOption: null,
	// 			isStart: false,
	// 		}));
	// 		return;
	// 	}
	// };

	// const setGoBackToInitialHomePage = (boolValue) => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		goBackToInitialHomePage: boolValue,
	// 		selectedOption: null,
	// 		dashboardSelected: false,
	// 		selectedNavBarOption: navBarOptions[0],
	// 	}));
	// };

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });

			navigate(`/chat/${currentSessionId}`);
		},
		[currentSessionId],
	);

	const handleOptionSelection = (option) => {
		if (info?.selectedOption === option?.value) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			selectedOption: option?.value,
		}));
	};

	const handleUpdateOptions = (value) => {
		const updatedOptions = info?.options?.filter((option) => option?.value !== value);
		setInfo((prev) => ({
			...prev,
			options: updatedOptions,
		}));
		if (info?.selectedOption === value) {
			setInfo((prev) => ({
				...prev,
				selectedOption: updatedOptions[0]?.value,
			}));
		}
	};

	const componentMapper = useMemo(
		() => ({
			proactiveSuggestions: (
				<ProactiveSuggestions handleUpdateOptions={handleUpdateOptions} />
			),
			prompts: <ChatPrompts handleUpdateOptions={handleUpdateOptions} />,
		}),
		[info?.selectedOption],
	);

	return (
		// <>
		// 	{info?.selectedOption !== null || info?.dashboardSelected ? (
		// 		<HomePage
		// 			getSelectedOption={info?.selectedOption}
		// 			start={info?.isStart}
		// 			setGoBackToInitialHomePage={setGoBackToInitialHomePage}
		// 			promptsData={promptsData}
		// 		/>
		// 	) : (
		// 		<div className="initialHomePageContainer">
		// 			<div className="initialHomeContainerFixedContent">
		// 				<div className="initialHomeContainerFixedContent-item-container">
		// 					{navBarOptions?.map((item, index) => {
		// 						return (
		// 							<>
		// 								<div
		// 									className={`initialHomeContainerFixedContent-item ${
		// 										info?.selectedNavBarOption?.id === item?.id
		// 											? 'active'
		// 											: ''
		// 									}`}
		// 									onClick={() => handleNavBarSelection(item)}
		// 								>
		// 									{item?.title}
		// 								</div>
		// 								{index !== navBarOptions.length - 1 && (
		// 									<div className="initialHomeContainerFixedContent-divider"></div>
		// 								)}
		// 							</>
		// 						);
		// 					})}
		// 				</div>
		// 			</div>
		// 			<div className="initialHomePageContainer-content">
		// 				<div className="initialHomePageContainer-content-left">
		// 					<div className="initialHomePageContainer-header">
		// 						Hey <span>{username}</span> <br />
		// 						I'm here to help
		// 					</div>
		// 					<div className="initialHomePageContainer-content-left-description">
		// 						Ask me anything about your business or let me handle a task for you.
		// 					</div>
		// 				</div>
		// 			</div>
		// 			<div className="initialHomePageContainer-chatBox">
		// 				<div className="chatBoxWrapper">
		// 					<ChatBox onSend={handleCustomOnSendFunction} customChatActions={true} />
		// 				</div>
		// 			</div>
		// 			<div className="initialHomePageContainer-prompts">
		// 				<div className="initialHomePageContainerCards">
		// 					{promptsData?.data?.map((item) => {
		// 						return (
		// 							<div
		// 								className="initialHomepageEachCard"
		// 								onClick={() => {
		// 									setInfo({
		// 										...info,
		// 										showPromptPopup: true,
		// 										selectedCard: item,
		// 									});
		// 								}}
		// 							>
		// 								<div className="initialHomepageEachCard-type">
		// 									<div className="initialHomepageEachCard-type-title">
		// 										Workflows for
		// 									</div>
		// 									<div className="initialHomepageEachCard-type-type">
		// 										{item?.category}
		// 									</div>
		// 								</div>
		// 								<div className="initialHomepageEachCard-title">
		// 									{item?.title}
		// 								</div>
		// 							</div>
		// 						);
		// 					})}
		// 				</div>
		// 				<div className="initialHomePageContainerFooter">
		// 					Above are the Prompts you need to ask me as per your business{' '}
		// 					<span>goals</span> check all prompts for more.
		// 				</div>
		// 			</div>
		// 		</div>
		// 	)}
		// 	<PromptPopup
		// 		open={info?.showPromptPopup}
		// 		closeModal={() => setInfo({ ...info, showPromptPopup: false })}
		// 		selectedCard={info?.selectedCard}
		// 	/>
		// </>
		<div className="initial-home-page-container">
			<div
				className="home-page-container-header"
				style={{
					marginTop: info?.options?.length > 0 ? '85px' : '0px',
				}}
			>
				<div className="header-title">Proactive AI</div>
				<div className="chat-box-container">
					<ChatBox onSend={handleCustomOnSendFunction} customChatActions={true} />
				</div>
				<div className="options-container">
					{info?.options?.map((option) => {
						return (
							<div
								className={`option ${
									info?.selectedOption === option?.value ? 'active' : ''
								}`}
								onClick={() => handleOptionSelection(option)}
							>
								<div className="option-label">{option?.label}</div>
							</div>
						);
					})}
				</div>
			</div>
			{info?.options?.length > 0 && (
				<div className="home-page-container-content">
					{componentMapper[info?.selectedOption]}
				</div>
			)}
		</div>
	);
};

export default memo(InitialHomePage);
