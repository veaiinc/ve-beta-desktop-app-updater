import { memo, useContext, useRef, useEffect, useCallback } from 'react';
import '../../../assets/scss/home_page/suggestions.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import ObjectID from 'bson-objectid';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

const Suggestions = ({ landingPage = false, chatQuery = '' }) => {
	const {
		templates: { updateStateValues, getChatBoxSuggestions, chatBoxSuggestions },
	} = useContext(Context);
	const timeoutIdRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (chatQuery?.length > 0) {
			handleDebounceChatQueryChange(chatQuery);
		}
	}, [chatQuery]);

	useEffect(() => {
		return () => {
			clearTimeout(timeoutIdRef.current);
		};
	}, []);

	const handleDebounceChatQueryChange = useCallback((query) => {
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}
		timeoutIdRef.current = setTimeout(() => {
			getChatBoxSuggestions({ partial_query: query });
		}, 400);
	}, []);

	const handleSuggestionClick = (suggestion) => {
		const sessionId = ObjectID()?.toString();
		updateStateValues({
			activePromptForChat: suggestion,
		});
		if (landingPage) {
			navigate(`/c/${sessionId}`);
		} else {
			navigate(`/chat/${sessionId}`);
		}
	};
	return (
		<div
			className="suggestions-wrapper"
			style={{
				height: landingPage ? '250px' : '100%',
				overflow: landingPage ? 'auto' : 'hidden',
			}}
		>
			{chatBoxSuggestions?.map((suggestion, index) => (
				<div
					className="suggestion-container"
					key={index}
					onClick={() => handleSuggestionClick(suggestion)}
				>
					<div className="icon-container">
						<SearchSvg />
					</div>
					<div className="suggestion-text">{suggestion}</div>
					<div className="arrow-icon">
						<ArrowRightSvg />
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(Suggestions);
