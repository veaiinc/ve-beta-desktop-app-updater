import { memo, useContext, useEffect, useRef, useState } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import Context from '../../context/context';
import ObjectID from 'bson-objectid';
import RecentChat from '../features/chat/RecentChat';

const ChatLeftBarComponent = ({ children }) => {
	const {
		subscriptionInfo: { renewBanner },
		templates: { globalChatMessages, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatActive: false,
	});
	const sessionIdRef = useRef(ObjectID()?.toString());
	const firstTimeRenderingRef = useRef(true);

	useEffect(() => {
		updateStateValues({ globalChatMessages: [] });
	}, []);

	const handleChatActive = () => {
		if (info?.chatActive) return;

		firstTimeRenderingRef.current = false;
		setInfo((prev) => ({
			...prev,
			chatActive: !prev?.chatActive,
		}));
	};

	return (
		<div
			className="chat-left-bar-component"
			style={{
				height: renewBanner ? 'calc(100dvh - 50px)' : '100dvh',
			}}
		>
			<div
				className={`chat-left-bar-component-overlay ${info?.chatActive ? 'inactive' : ''}`}
			>
				{children}
			</div>

			{globalChatMessages?.length === 0 && info?.chatActive && (
				<div className="chat-left-bar-suggestions-overlay">
					<div className="suggestions">suggestions</div>
				</div>
			)}
			<RecentChat
				showIconText={false}
				isPreview={true}
				autoFocus={false}
				customChatBoxClick={handleChatActive}
				{...(!firstTimeRenderingRef.current && {
					sId: sessionIdRef?.current,
				})}
				customSocketConnection={info?.chatActive}
			/>
		</div>
	);
};

export default memo(ChatLeftBarComponent);
