import { memo, useContext, useRef, useState } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import Context from '../../context/context';
import ObjectID from 'bson-objectid';
import RecentChat from '../features/chat/RecentChat';

const ChatLeftBarComponent = ({ children }) => {
	const {
		subscriptionInfo: { renewBanner },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatActive: false,
	});
	const sessionIdRef = useRef(ObjectID()?.toString());

	const handleChatActive = () => {
		if (info?.chatActive) return;
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
			{!info?.chatActive && <div className="chat-left-bar-component-overlay">{children}</div>}
			<RecentChat
				sId={sessionIdRef?.current}
				showIconText={false}
				isPreview={true}
				autoFocus={false}
				customChatBoxClick={handleChatActive}
			/>
		</div>
	);
};

export default memo(ChatLeftBarComponent);
