import { memo, useCallback, useContext, useState } from 'react';
import '../../../assets/scss/home_page/initialHomepage.scss';
import { getGreeting } from '../../../helpers';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';
import ChatBox from '../../components/chat/ChatBox';
import GlobalWidget from '../../components/globalComponents/GlobalWidget';
import Suggestions from './Suggestions';
import { useNavigate } from 'react-router-dom';

const suggestionContainerStyles = {
	position: 'absolute',
	top: '0',
	left: '18%',
	width: '100%',
	height: '100%',
	zIndex: '100',
};
const InitialHomePage = () => {
	const navigate = useNavigate();
	const {
		templates: { updateStateValues, currentSessionId, chatBoxSuggestions },
		profileInfo: { userDetailsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatQuery: '',
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

		if (query?.length === 0) {
			updateStateValues({ chatBoxSuggestions: null });
		}
	};

	const userName =
		jwtDecode(localStorage.getItem('usertoken'))?.userName ||
		userDetailsData?.firstName + ' ' + (userDetailsData?.lastName ?? '') ||
		'User';
	const greeting = getGreeting();

	return (
		<div className="initial-home-page-wrapper">
			<div className="initial-home-page-container">
				<div className={`title-container `}>
					<div className="title-text">
						<h2 className="title-one">{greeting}!</h2>
						<span className="title-two">{userName}</span>
					</div>
				</div>

				<div className="homePageChatContainer">
					<div className={`chatbox_container `}>
						<ChatBox
							onSend={handleCustomOnSendFunction}
							customChatActions={true}
							autoFocus={false}
							animatePlaceholder={false}
							onChatQueryChange={handleChatQueryChange}
							showUpgradeSubscriptionBtn={false}
						/>
					</div>
					{chatBoxSuggestions?.length > 0 && (
						<div className="suggestions-container">
							<Suggestions
								chatQuery={info?.chatQuery}
								styles={suggestionContainerStyles}
							/>
						</div>
					)}
					{/* {info?.chatQuery?.length === 0 &&
						globalChatMessages?.[currentSessionId]?.chatBoxInfo?.build && (
							<BuildOptions />
						)} */}
				</div>
				<GlobalWidget />
			</div>
		</div>
	);
};

export default memo(InitialHomePage);
