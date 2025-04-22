import { memo, useContext, useRef, useState } from 'react';
import '../../assets/scss/chatLeftBarComponent.scss';
import ChatBox from './chat/ChatBox';
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
	console.log(sessionIdRef.current, 'sessionIdRef.current');
	return (
		<div
			className="chat-left-bar-component"
			style={{
				height: renewBanner ? 'calc(100dvh - 50px)' : '100dvh',
			}}
		>
			{/* <div className="chat-left-bar-component-header">
				<h1>Chat</h1>
			</div> */}
			{info?.chatActive ? (
				<RecentChat sId={sessionIdRef?.current} showIconText={false} isPreview={true} />
			) : (
				<div
					style={{
						height: '100%',
					}}
					className="chat-wrapper"
				>
					<div className="content">{children}</div>
					<div className="chatbar-wrapper">
						<ChatBox showIconText={false} customChatBoxClick={handleChatActive} />
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(ChatLeftBarComponent);
