import { memo } from 'react';
import ChatHistory from '../sidebar/chatHistory/ChatHistory';
import s from '../../../assets/scss/home_page/chatPage.module.scss';
import NewUi from '../../features/homePage/NewUi';

const ChatPage = () => {
	return (
		<div className={s.chatPage}>
			<div className={s.chatHistoryWrapper}>
				<ChatHistory />
			</div>
			<NewUi />
		</div>
	);
};

export default memo(ChatPage);
