import { memo, useState } from 'react';
import s from '../../../assets/scss/home_page/chatPage.module.scss';
import NewUi from '../../features/homePage/NewUi';
import ActiveChatIndication from '../../features/homePage/ActiveChatIndication';

const ChatPage = () => {
	const [info, setInfo] = useState({
		activeChatIndex: 0,
		activeChatData: null,
	});

	const handleActiveChatChange = (index, data) => {
		setInfo((prev) => ({
			...prev,
			activeChatIndex: index,
			activeChatData: data,
		}));
	};

	return (
		<div className={s.chatPage}>
			<div className={s.chatHistoryWrapper}>
				<ActiveChatIndication
					activeChatIndex={info.activeChatIndex}
					activeChatData={info.activeChatData}
				/>
			</div>
			<NewUi handleActiveChatChange={handleActiveChatChange} />
		</div>
	);
};

export default memo(ChatPage);
