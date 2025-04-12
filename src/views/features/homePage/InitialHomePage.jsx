import React, { memo, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import ChatBox from '../../components/homePage/ChatBox';
import { useNavigate } from 'react-router-dom';
import ProactiveSuggestions from './ProactiveSuggestions';
import ChatPrompts from './ChatPrompts';
import QuickActions from '../../components/globalComponents/QuickActions';
import ContactsWidget from '../../components/globalComponents/ContactsWidget';
import AutomationWidget from '../../components/globalComponents/AutomationWidget';
import TaskWidget from '../../components/globalComponents/TaskWidget';
import CalenderWidget from '../../components/globalComponents/CalenderWidget';
import GlobalWidget from '../../components/globalComponents/GlobalWidget';
const optionsList = [
	{
		id: 1,
		label: 'Proactive suggestions',
		value: 'proactiveSuggestions',
		showOption: false,
	},
	// {
	// 	id: 2,
	// 	label: 'Prompts library',
	// 	value: 'prompts',
	// 	showOption: false,
	// },
	{
		id: 3,
		label: 'Calendar',
		value: 'calendar',
		showOption: true,
	},
	{
		id: 4,
		label: 'Task',
		value: 'task',
		showOption: true,
	},
	{
		id: 5,
		label: 'Contact',
		value: 'contact',
		showOption: true,
	},
	{
		id: 6,
		label: 'Automation',
		value: 'automation',
		showOption: true,
	},
];

const InitialHomePage = () => {
	const {
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		selectedOption: '',
		options: optionsList,
		promptsCategory: 'all',
		optionsHandledOnce: Object?.values(optionsList)?.reduce((acc, option) => {
			acc[option.value] = false;
			return acc;
		}, {}),
	});

	let {
		profileInfo: { userDetailsData },
		aiSetup: { getPromptsData, promptsData },
		templates: { aiSuggestedPendingActions, getAISuggestedPendingActions },
	} = useContext(Context);

	const username =
		jwtDecode(localStorage.getItem('usertoken'))?.userName?.split(' ')[0] ??
		`${userDetailsData?.firstName}` ??
		'User';

	useEffect(() => {
		if (promptsData) {
			if (promptsData?.data?.length > 0 && !info?.optionsHandledOnce?.prompts) {
				handleUpdateOptions('prompts');
				setInfo((prev) => ({
					...prev,
					optionsHandledOnce: {
						...prev.optionsHandledOnce,
						prompts: true,
					},
				}));
			}
		} else {
			getPromptsData({ category: 'all', limit: 30 });
		}
	}, [promptsData]);

	useEffect(() => {
		if (aiSuggestedPendingActions) {
			const cards = aiSuggestedPendingActions?.pendingActions?.filter(
				(card) => card?.researchTopics?.length > 0,
			);
			if (cards?.length > 0 && !info?.optionsHandledOnce?.proactiveSuggestions) {
				handleUpdateOptions('proactiveSuggestions');
				setInfo((prev) => ({
					...prev,
					optionsHandledOnce: {
						...prev.optionsHandledOnce,
						proactiveSuggestions: true,
					},
				}));
			}
		} else {
			getAISuggestedPendingActions();
		}
	}, [aiSuggestedPendingActions]);

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
		let updatedOptions = info?.options;
		updatedOptions = updatedOptions?.map((option) => {
			if (option?.value === value) {
				option.showOption = true;
			}
			return option;
		});

		const selectedOption = updatedOptions?.find((option) => option?.showOption)?.value ?? '';

		setInfo((prev) => ({
			...prev,
			options: updatedOptions,
			selectedOption,
		}));
	};

	const updatePromptsCategory = (value) => {
		setInfo((prev) => ({
			...prev,
			promptsCategory: value,
		}));
	};

	const componentMapper = useMemo(
		() => ({
			proactiveSuggestions: <ProactiveSuggestions />,
			calendar: <GlobalWidget option="calendar" />,
			task: <GlobalWidget option="tasks" />,
			contact: <GlobalWidget option="contacts" />,
			automation: <GlobalWidget option="automation" />,
		}),
		[info?.promptsCategory],
	);

	const options = useMemo(() => {
		const filteredOptions = info?.options?.filter((option) => option?.showOption);
		if (filteredOptions?.length > 0 && !info?.selectedOption) {
			setInfo((prev) => ({
				...prev,
				selectedOption: filteredOptions[0]?.value,
			}));
		}
		return filteredOptions;
	}, [info?.options, info?.selectedOption]);

	return (
		<div className="initial-home-page-container">
			<div className="quick-actions-container">
				<QuickActions />
			</div>
			<div
				className="home-page-container-header"
				style={{
					marginTop: options?.length > 0 ? '85px' : '0px',
				}}
			>
				<div className="title-container">
					<div className="title-text">
						<span className="title-one">AI.</span>{' '}
						<span className="title-two">truly yours</span>
					</div>
					<div className="sub-text">
						AI that deeply cares about your Goals & strives to be helpful
					</div>
				</div>

				<div className="chatbox-container">
					<ChatBox onSend={handleCustomOnSendFunction} customChatActions={true} />
				</div>
				<div className="options-container">
					{options?.map((option) => {
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
			{options?.length > 0 && (
				<div className="home-page-container-content">
					{componentMapper[info?.selectedOption]}
				</div>
			)}
		</div>
	);
};

export default memo(InitialHomePage);
