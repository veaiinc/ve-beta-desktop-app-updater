import { memo, useCallback, useContext, useState } from 'react';
import '../../../assets/scss/home_page/askMe.scss';
import ChatBox from '../../components/chat/ChatBox';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import BuildOptions from './BuildOptions';
import Suggestions from './Suggestions';
import Sintegrations from './suggestedIntegrations/Sintegrations';
import ObjectID from 'bson-objectid';
const AskMe = () => {
	const navigate = useNavigate();
	const {
		templates: { currentSessionId, chatInfo, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatQuery: '',
		sessionId: ObjectID().toString(),
	});

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${info?.sessionId}`);
		},
		[info?.sessionId],
	);

	const handleChatQueryChange = (query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));

		if (query?.length === 0) {
			updateStateValues({ chatBoxSuggestions: null });
		}
	};

	return (
		<div className="ask-me-container">
			<div className="chatbox-wrapper">
				<div className="chatbox-container">
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						autoFocus={true}
						animatePlaceholder={true}
						onChatQueryChange={handleChatQueryChange}
						showUpgradeSubscriptionBtn={false}
						sessionId={info?.sessionId}
					/>
				</div>
			</div>
			{chatInfo?.build && info?.chatQuery?.length === 0 && <BuildOptions />}
			<Suggestions chatQuery={info?.chatQuery} />
			{/* <div className="home-page-container-footer">
				<Sintegrations />
			</div> */}
		</div>
	);
};

export default memo(AskMe);
