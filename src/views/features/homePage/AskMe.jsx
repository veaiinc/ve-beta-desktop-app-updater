import { memo, useCallback, useContext, useState } from 'react';
import '../../../assets/scss/home_page/askMe.scss';
import ChatBox from '../../components/chat/ChatBox';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import BuildOptions from './BuildOptions';
import Suggestions from './Suggestions';

const AskMe = () => {
	const {
		templates: { currentSessionId, chatInfo },
	} = useContext(Context);
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		chatQuery: '',
		showSuggestions: true,
	});

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${currentSessionId}`);
		},
		[currentSessionId],
	);

	const handleChatQueryChange = (query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));
	};
	return (
		<div className="ask-me-container">
			<div className="chatbox-wrapper">
				<div className="chatbox-container">
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						autoFocus={false}
						animatePlaceholder={true}
						onChatQueryChange={handleChatQueryChange}
					/>
				</div>
			</div>

			{chatInfo?.build && info?.chatQuery?.length === 0 && <BuildOptions />}

			{info?.showSuggestions && <Suggestions />}
		</div>
	);
};

export default memo(AskMe);
