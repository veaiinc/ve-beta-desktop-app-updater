import { memo, useContext, useEffect, useRef, useState } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import Context from '../../context/context';
import ObjectID from 'bson-objectid';
import RecentChat from '../features/chat/RecentChat';
import SparkleSvg from '../../assets/svg/ai_agents/sparkle.svg?react';
import LeftSvg from '../../assets/svg/activity/left.svg?react';

const ChatLeftBarComponent = ({ children, suggestions = [] }) => {
	const {
		// subscriptionInfo: { renewBanner },
		templates: { globalChatMessages, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatActive: false,
		sessionId: null,
		sessionIdChanged: false,
	});

	const isFirstTimeChatActiveRef = useRef(true);
	const isFirstTimeSuggestionsRenderRef = useRef(true);

	useEffect(() => {
		const sessionId = ObjectID()?.toString();
		updateStateValues({ globalChatMessages: [] });
		setInfo((prev) => ({
			...prev,
			sessionId,
			sessionIdChanged: true,
		}));
	}, []);

	const handleChatActive = () => {
		if (info?.chatActive) return;
		isFirstTimeChatActiveRef.current = false;

		setInfo((prev) => ({
			...prev,
			chatActive: !prev?.chatActive,
		}));
	};

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
		}));
	};

	return (
		<div
			className="chat-left-bar-component"
			style={{
				// height: renewBanner ? 'calc(100dvh - 58px)' : '100dvh',
				height: '100dvh',
			}}
		>
			<div
				className={`chat-left-bar-component-overlay ${info?.chatActive ? 'inactive' : ''}`}
			>
				<div className="wrapper">{children}</div>
			</div>

			{globalChatMessages?.length === 0 &&
				isFirstTimeSuggestionsRenderRef?.current &&
				info?.chatActive && (
					<div className="chat-left-bar-suggestions-overlay">
						<div className="suggestions-container">
							<div className="suggestions-header">
								<div className="header-container">
									<div className="left-container">
										<div className="icon-container" onClick={handleGoBackClick}>
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
											onClick={() => handleSuggestionClick(suggestion?.name)}
										>
											{suggestion?.name}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
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
				onNavigateBack={handleGoBackClick}
			/>
		</div>
	);
};

export default memo(ChatLeftBarComponent);
