import { memo, useState } from 'react';
import s from '../../../assets/scss/home_page/chatPage.module.scss';
import NewUi from '../../features/homePage/NewUi';
import ActiveChatIndication from '../../features/homePage/ActiveChatIndication';

const ChatPage = () => {
	const [info, setInfo] = useState({
		activeChatIndex: 0,
	});

	const handleActiveChatIndex = (index) => {
		setInfo((prev) => ({
			...prev,
			activeChatIndex: index,
		}));
	};

	return (
		<div className={s.chatPage}>
			<div className={s.chatHistoryWrapper}>
				<ActiveChatIndication activeChatIndex={info.activeChatIndex} />
			</div>
			<NewUi handleActiveChatIndex={handleActiveChatIndex} />
		</div>
	);
};

export default memo(ChatPage);
