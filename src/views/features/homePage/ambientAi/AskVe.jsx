import { memo, useCallback, useContext } from 'react';
import s from '../../../../assets/scss/home_page/ambientAi/askVe.module.scss';
import Context from '../../../../context/context';
import ObjectID from 'bson-objectid';
import { useNavigate } from 'react-router-dom';

const askVeCards = [
	{
		title: 'What can you do for me?',
		description: 'Get a full list of Ve’s abilities and how it can help you.',
		btnText: 'Ask now',
		prompt: 'What can you do for me? Please list all your abilities and how you can help.',
	},
	{
		title: 'Show me how to get started.',
		description: 'A quick guided walkthrough for your first actions.',
		btnText: 'Start Walkthrough',
		prompt: 'Give me a quick guided walkthrough to get started using you.',
	},
	{
		title: 'Just tell Ve what you want to eat it will find and order it for you.',
		description:
			'Ve can find restaurants nearby, check menus, and place an order all from your voice or text command.',
		btnText: 'Ask Ve to Order Food',
		prompt: 'Find nearby restaurants, check their menus, and place a food order for me.',
	},
	{
		title: 'Set a reminder for me.',
		description: 'Schedule reminders for important tasks or events.',
		btnText: 'Create Reminder',
		prompt: 'Set a reminder for my upcoming important tasks or events.',
	},
	{
		title: 'What’s the weather like?',
		description: 'Get a detailed weather forecast for your area.',
		btnText: 'Check Weather',
		prompt: 'Tell me the detailed weather forecast for my location.',
	},
	{
		title: 'Help me plan a trip.',
		description: 'Receive assistance with travel arrangements and itineraries.',
		btnText: 'Plan Trip',
		prompt: 'Help me plan a trip with travel arrangements and itinerary suggestions.',
	},
	{
		title: 'Summarize my last meeting.',
		description: 'If your calendar is connected, Ve can instantly summarize.',
		btnText: 'Connect Calendar',
		prompt: 'Summarize my last meeting from my connected calendar.',
	},
];

const AskVe = () => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);
	const navigate = useNavigate();

	const handleCardClick = useCallback((card) => {
		const sessionId = ObjectID()?.toString();
		updateStateValues({
			// activePromptForChat: {
			// 	sessionId,
			// 	prompt: card?.prompt,
			// },
			activeInputForChat: card?.prompt,
		});
		navigate(`/chat/${sessionId}`);
	}, []);

	return (
		<div className={s.askVeContainer}>
			<div className={s.title}>
				<span className={s.text1}>Things you can</span>{' '}
				<span className={s.text2}>ask VE</span>
			</div>

			<div className={s.cardsContainer}>
				{askVeCards?.map((card, index) => (
					<div key={index} className={s.card}>
						<div className={s.textContainer}>
							<div className={s.title}>{card?.title}</div>
							<div className={s.description}>{card?.description}</div>
						</div>
						<button className={s.cardBtn} onClick={() => handleCardClick(card)}>
							{card?.btnText}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(AskVe);
