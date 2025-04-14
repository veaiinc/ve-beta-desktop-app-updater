import React, { memo, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import ChatBox from '../../components/homePage/ChatBox';
import { useNavigate } from 'react-router-dom';
import ProactiveSuggestions from './ProactiveSuggestions';
import ChatPrompts from './ChatPrompts';
import QuickActions from '../../components/globalComponents/QuickActions';

const optionsList = [
	{
		id: 1,
		label: 'Proactive suggestions',
		value: 'proactiveSuggestions',
		showOption: false,
	},
	{
		id: 2,
		label: 'Prompts library',
		value: 'prompts',
		showOption: false,
	},
];

let animationClass = '';

const InitialHomePage = () => {
	const {
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);

	const navigate = useNavigate();
	const headerRef = useRef(null);
	const headerMinimizedRef = useRef(false);

	const [info, setInfo] = useState({
		selectedOption: '',
		options: optionsList,
		promptsCategory: 'all',
		optionsHandledOnce: Object?.values(optionsList)?.reduce((acc, option) => {
			acc[option.value] = false;
			return acc;
		}, {}),
		minimized: false,
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
		if (info?.selectedOption) {
			if (info?.minimized) {
				setInfo((prev) => ({
					...prev,
					minimized: false,
				}));
				headerMinimizedRef.current = false;
			}
		}
	}, [info?.selectedOption]);

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

	const handleMinimizeHeader = () => {
		if (headerMinimizedRef.current === false) {
			setInfo((prev) => ({
				...prev,
				minimized: true,
			}));
			headerMinimizedRef.current = true;
		}
	};

	const handleExpandHeader = () => {
		if (headerMinimizedRef.current) {
			setInfo((prev) => ({
				...prev,
				minimized: false,
			}));
			headerMinimizedRef.current = false;
		}
	};

	const componentMapper = {
		proactiveSuggestions: <ProactiveSuggestions />,
		prompts: (
			<ChatPrompts
				promptsCategory={info?.promptsCategory}
				updatePromptsCategory={updatePromptsCategory}
				isHeaderMinimized={info?.minimized}
				onMinimizeHeader={handleMinimizeHeader}
				onExpandHeader={handleExpandHeader}
			/>
		),
	};

	const options = useMemo(
		() => info?.options?.filter((option) => option?.showOption),
		[info?.options],
	);

	if (options?.length > 0) {
		if (info?.minimized) {
			animationClass = 'minimized-animation';
		} else if (headerRef?.current?.classList?.contains('minimized-animation')) {
			animationClass = 'expanded-animation';
		}
	}

	return (
		<div
			className="initial-home-page-container"
			style={{
				...(options?.length === 0 && { justifyContent: 'center' }),
			}}
		>
			<div className="quick-actions-container">
				<QuickActions />
			</div>
			<div className={`home-page-container-header ${animationClass}`} ref={headerRef}>
				<div className={`title-container `}>
					<div className="title-text">
						<span className="title-one">AI.</span>{' '}
						<span className="title-two">truly yours</span>
					</div>
					<div className="sub-text">
						A dedicated, continuously thinking AI - for each of us.
						<br /> Ask Reason. Give it your goals - let it make you superhuman
					</div>
				</div>
				<div
					className={`chatbox-wrapper`}
					style={{
						borderBottom: info?.minimized ? '1px solid var(--stroke)' : '',
						borderRight: info?.minimized ? '1px solid var(--stroke)' : '',
						borderLeft: info?.minimized ? '1px solid var(--stroke)' : '',
					}}
				>
					<div className={`chatbox-container`}>
						<ChatBox
							onSend={handleCustomOnSendFunction}
							customChatActions={true}
							autoFocus={false}
							isParentHeaderMinimized={info?.minimized}
						/>
					</div>
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
				<div
					className="home-page-container-content"
					style={{
						height: info?.minimized ? 'calc(100vh - 310px)' : 'calc(100vh - 470px)',
					}}
				>
					{componentMapper[info?.selectedOption]}
				</div>
			)}
		</div>
	);
};

export default memo(InitialHomePage);
