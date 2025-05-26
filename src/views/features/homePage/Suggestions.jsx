import { memo, useContext } from 'react';
import '../../../assets/scss/home_page/suggestions.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import ObjectID from 'bson-objectid';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

const Suggestions = ({ data }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);
	const navigate = useNavigate();

	const handleSuggestionClick = (suggestion) => {
		const sessionId = ObjectID()?.toString();
		updateStateValues({
			activePromptForChat: suggestion?.text,
		});
		navigate(`/chat/${sessionId}`);
	};
	return (
		<div className="suggestions-wrapper">
			{data?.map((suggestion, index) => (
				<div
					className="suggestion-container"
					key={index}
					onClick={() => handleSuggestionClick(suggestion)}
				>
					<div className="icon-container">
						<SearchSvg />
					</div>
					<div className="suggestion-text">{suggestion?.text}</div>
					<div className="arrow-icon">
						<ArrowRightSvg />
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(Suggestions);
