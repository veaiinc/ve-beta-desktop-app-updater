import { memo, useCallback, useContext, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/newChat.module.scss';
import ChatBox from '../ChatBox';
import ObjectID from 'bson-objectid';
import Context from '../../../../context/context';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ProactiveCards from './NewProactiveCards';

const NewChat = () => {
	const {
		profileInfo: { userDetailsData },
		templates: { updateStateValues },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		sessionId: ObjectID().toString(),
	});

	const userName =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ||
		userDetailsData?.firstName + ' ' + (userDetailsData?.lastName ?? '') ||
		'User';

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${info?.sessionId}`);
		},
		[info?.sessionId],
	);

	return (
		<div className={s.newChatContainer}>
			<div className={s.mainContent}>
				<div className={s.userGreeting}>
					{/* <div className={s.userGreetingText}>
						Hey {userName}! Welcome to <span className={s.companyName}>Ve</span>
					</div>
					<div className={s.description}>Unify your workflow across all platforms</div> */}

					<div className={s.newChatTitle}>Ask me anything on Meetings & Emails</div>
				</div>
				<div className={s.chatboxContainer}>
					<ChatBox
						customChatActions={true}
						onSend={handleCustomOnSendFunction}
						autoFocus={true}
						sessionId={info?.sessionId}
						showUpgradeSubscriptionBtn={false}
					/>
				</div>
				{/* <ProactiveCards /> */}
			</div>
		</div>
	);
};

export default memo(NewChat);
