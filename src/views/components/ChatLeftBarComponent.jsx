import { memo, useContext, useEffect, useRef, useState, useCallback } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import Context from '../../context/context';
import ObjectID from 'bson-objectid';
import RecentChat from '../features/chat/RecentChat';
import { ReactComponent as SparkleSvg } from '../../assets/svg/ai_agents/sparkle.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../assets/svg/tasks/chevronRightThin.svg';

const ChatLeftBarComponent = ({ children, suggestions = [] }) => {
	const {
		// subscriptionInfo: { renewBanner },
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatActive: false,
		sessionId: null,
		sessionIdChanged: false,
		mobileActive: false,
		isMobile: false,
	});

	const isFirstTimeChatActiveRef = useRef(true);
	const isFirstTimeSuggestionsRenderRef = useRef(true);

	useEffect(() => {
		const sessionId = ObjectID()?.toString();
		setInfo((prev) => ({
			...prev,
			sessionId,
			sessionIdChanged: true,
		}));

		// Check if mobile on mount
		const checkMobile = () => {
			const isMobile = window.innerWidth <= 768;
			setInfo((prev) => ({ ...prev, isMobile }));
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	}, []);

	const handleChatActive = () => {
		if (info?.chatActive) return;
		isFirstTimeChatActiveRef.current = false;

		setInfo((prev) => ({
			...prev,
			chatActive: !prev?.chatActive,
			mobileActive: info?.isMobile ? true : prev?.mobileActive,
		}));
	};

	const goBack = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			chatActive: false,
		}));
	}, []);

	const handleNewChat = () => {
		const sessionId = ObjectID()?.toString();
		isFirstTimeSuggestionsRenderRef.current = false;
		setInfo((prev) => ({
			...prev,
			sessionId,
			sessionIdChanged: true,
		}));
	};

	const handleSuggestionClick = (suggestion) => {
		updateStateValues({ activePromptForChat: suggestion });
		// On mobile, close the chat panel after suggestion click
		if (info?.isMobile) {
			setInfo((prev) => ({
				...prev,
				mobileActive: false,
			}));
		}
	};

	const handleSessionIdChange = () => {
		setInfo((prev) => ({
			...prev,
			sessionIdChanged: false,
		}));
	};

	const handleGoBackClick = () => {
		setInfo((prev) => ({
			...prev,
			chatActive: false,
			mobileActive: false,
		}));
	};

	const toggleMobileChat = () => {
		setInfo((prev) => ({
			...prev,
			mobileActive: !prev?.mobileActive,
			// Keep chatActive false by default on mobile to hide overlay
			chatActive: prev?.mobileActive ? false : false,
		}));
	};

	return (
		<>
			{/* Mobile Chat Toggle Button */}
			{info?.isMobile && (
				<div
					className="mobile-chat-toggle"
					onClick={toggleMobileChat}
					style={{
						position: 'fixed',
						bottom: '20px',
						right: '20px',
						width: '56px',
						height: '56px',
						borderRadius: '50%',
						background: 'var(--primary-button)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						zIndex: 999,
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
					}}
				>
					<SparkleSvg style={{ width: '24px', height: '24px' }} />
				</div>
			)}

			<div
				className={`chat-left-bar-component ${info?.mobileActive ? 'mobile-active' : ''}`}
				style={{
					// height: renewBanner ? 'calc(100dvh - 58px)' : '100dvh',
					height: '100dvh',
				}}
			>
				<div
					className={`chat-left-bar-component-overlay ${
						info?.chatActive ? 'inactive' : ''
					} ${info?.isMobile && !info?.chatActive ? 'mobile-hidden' : ''}`}
				>
					<div className="wrapper">{children}</div>
				</div>

				{/* {globalChatMessages?.[currentSessionId]?.messages?.length === 0 &&
					isFirstTimeSuggestionsRenderRef?.current &&
					info?.chatActive &&
					!info?.isMobile && (
						<div className="chat-left-bar-suggestions-overlay">
							<div className="suggestions-container">
								<div className="suggestions-header">
									<div className="header-container">
										<div className="left-container">
											<div
												className="icon-container"
												onClick={handleGoBackClick}
											>
												<LeftSvg />
											</div>
											<div className="text-container">New Chat</div>
										</div>
									</div>
								</div>
								<div className="content">
									<div className="suggestion-header">
										<div className="icon">
											<SparkleSvg />
										</div>
										<div className="text-container">AI Suggestions</div>
									</div>
									<div className="suggestions-content">
										{suggestions?.map((suggestion) => (
											<div
												className="suggestion"
												key={suggestion?.id}
												onClick={() =>
													handleSuggestionClick(suggestion?.name)
												}
											>
												{suggestion?.name}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)} */}
				<div className="chatWrapper">
					<div className="chatWrapperHeader">
						<ChevronRightThinSvg
							style={{
								width: '16px',
								height: '16px',
								transform: 'rotate(180deg)',
								cursor: 'pointer',
							}}
							onClick={goBack}
						/>
					</div>
					<RecentChat
						showIconText={false}
						isPreview={true}
						autoFocus={true}
						customChatBoxClick={handleChatActive}
						chatActive={info?.chatActive}
						sessionIdChanged={info?.sessionIdChanged}
						onChangeSessionId={handleSessionIdChange}
						onNewChatBtnClick={handleNewChat}
						{...(!isFirstTimeChatActiveRef?.current && {
							sId: info?.sessionId,
						})}
						showCitationsButton={false}
						onNavigateBack={handleGoBackClick}
						animateChatBox={false}
					/>
				</div>
			</div>
		</>
	);
};

export default memo(ChatLeftBarComponent);
