import { memo, useState } from 'react';
import s from '../../../assets/scss/home_page/chatPage.module.scss';
import NewUi from '../../features/homePage/NewUi';
import ActiveChatIndication from '../../features/homePage/ActiveChatIndication';

const ChatPage = () => {
	const [info, setInfo] = useState({
		activeChatData: null,
	});

	const handleActiveChatChange = (data) => {
		setInfo((prev) => ({
			...prev,
			activeChatData: data,
		}));
	};

	return (
		<div className={s.chatPage}>
			<div className={s.chatHistoryWrapper}>
				<ActiveChatIndication activeChatData={info.activeChatData} />
			</div>
			<NewUi handleActiveChatChange={handleActiveChatChange} />
		</div>
	);
};

export default memo(ChatPage);
