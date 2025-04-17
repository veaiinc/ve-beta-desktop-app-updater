import React, { memo, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import ChatBox from '../../components/homePage/ChatBox';
import { useNavigate } from 'react-router-dom';
import ProactiveSuggestions from './ProactiveSuggestions';
import ChatPrompts from './ChatPrompts';
import QuickActions from '../../components/globalComponents/QuickActions';
import { first, set } from 'lodash';
import GlobalWidget from '../../components/globalComponents/GlobalWidget';

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
		controlValue: 'contact',
		showOption: true,
	},
	{
		id: 6,
		label: 'Automation',
		value: 'automation',
		controlValue: 'automation',
		showOption: true,
	},
];

const InitialHomePage = () => {
	const {
		templates: { updateStateValues, currentSessionId },
		profileInfo: { tenantUserAccessControls },
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

	const {
		aiSetup: { getPromptsData, promptsData },
		templates: { aiSuggestedPendingActions, getAISuggestedPendingActions },
	} = useContext(Context);

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
	}, [promptsData, handleUpdateOptions, info?.optionsHandledOnce?.prompts, getPromptsData]);

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
				(card) => card?.title?.length > 0,
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
	}, [
		aiSuggestedPendingActions,
		handleUpdateOptions,
		info?.optionsHandledOnce?.proactiveSuggestions,
		getAISuggestedPendingActions,
	]);

	const options = useMemo(
		() => info?.options?.filter((option) => option?.showOption),
		[info?.options],
	);

	useEffect(() => {
		if (options?.length > 0 && !info?.selectedOption) {
			// Set the first visible option as the selected option
			setInfo((prev) => ({
				...prev,
				selectedOption: options[0]?.value,
			}));
		}
	}, [options, info?.selectedOption]);

	const renderOptions = () => {
		if (!tenantUserAccessControls) return null;

		const isAdmin = tenantUserAccessControls?.role === 'admin';
		// Create a lookup object for access controls
		const accessControlMap = Object?.fromEntries(
			tenantUserAccessControls?.accessControls?.map((item) => [item?.app, item]),
		);

		return info?.options?.map((option) => {
			// For options without a control key (proactive and prompts), only render if showOption is true
			if (!option?.showOption && !option?.controlValue) return null;

			// For options with a control key (Contacts and Automations), show for admin or if access is enabled
			if (option?.controlValue) {
				const accessControl = accessControlMap[option?.controlValue];
				const isEnabled = accessControl?.isEnabled;
				if (!isAdmin && !isEnabled) return null;
			}

			return (
				<div
					key={option?.id}
					className={`option ${info?.selectedOption === option?.value ? 'active' : ''}`}
					onClick={() => handleOptionSelection(option)}
				>
					<div className="option-label">{option?.label}</div>
				</div>
			);
		});
	};

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
		proactiveSuggestions: <ProactiveSuggestions selectedOption={info?.selectedOption} />,
		prompts: (
			<ChatPrompts
				promptsCategory={info?.promptsCategory}
				updatePromptsCategory={updatePromptsCategory}
				isHeaderMinimized={info?.minimized}
				onMinimizeHeader={handleMinimizeHeader}
				onExpandHeader={handleExpandHeader}
			/>
		),
		calendar: <GlobalWidget option={'calendar'} />,
		task: <GlobalWidget option={'task'} />,
		automation: <GlobalWidget option={'automation'} />,
		contact: <GlobalWidget option={'contacts'} />,
	};

	// if (options?.length > 0) {
	// 	if (info?.minimized) {
	// 		animationClass = 'minimized-animation';
	// 	} else if (headerRef?.current?.classList?.contains('minimized-animation')) {
	// 		animationClass = 'expanded-animation';
	// 	}
	// }

	const animationClass =
		options?.length > 0
			? info?.minimized
				? 'minimized-animation'
				: headerRef?.current?.classList?.contains('minimized-animation')
				? 'expanded-animation'
				: ''
			: '';

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
			<div
				className={`home-page-container-header ${animationClass}`}
				ref={headerRef}
				style={{
					...(options?.length === 0 && { marginTop: 0 }),
				}}
			>
				<div className={`title-container `}>
					<div className="title-text">
						<span className="title-one">Answers before you Ask!</span>
						{/* <span className="title-two">truly yours</span> */}
					</div>
					{/* <div className="sub-text">Answers before you Ask!</div> */}
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

				<div className="options-container">{renderOptions()}</div>
			</div>
			{options?.length > 0 && (
				<div
					className="home-page-container-content"
					style={{
						height: info?.minimized ? 'calc(100vh - 240px)' : 'calc(100vh - 314px)',
					}}
				>
					{componentMapper[info?.selectedOption]}
				</div>
			)}
		</div>
	);
};

export default memo(InitialHomePage);
