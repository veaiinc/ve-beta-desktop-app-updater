import { memo, useContext } from 'react';
import '../../../assets/scss/home_page/suggestions.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import ObjectID from 'bson-objectid';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

const data = [
	{
		id: 1,
		text: 'Use a task management system to prioritize tasks based on urgency and importance.',
	},
	{
		id: 2,
		text: 'Draft and send a follow-up email to a client',
	},
	{
		id: 3,
		text: 'Deep research “latest industry trends” with sources',
	},
	{
		id: 4,
		text: 'Generate a professional-looking form in seconds',
	},
	{
		id: 5,
		text: 'Search across Gmail, Drive, and Notion for “invoice”',
	},
	{
		id: 6,
		text: 'Summarize all emails from today',
	},
	{
		id: 7,
		text: 'Schedule a meeting for next week',
	},
	{
		id: 8,
		text: 'Create a new contact',
	},
	{
		id: 9,
		text: 'Create a new automation',
	},
];

const Suggestions = ({ landingPage = false }) => {
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
		<div
			className="suggestions-wrapper"
			style={{ height: landingPage ? '250px' : '100%', overflow: 'hidden' }}
		>
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
