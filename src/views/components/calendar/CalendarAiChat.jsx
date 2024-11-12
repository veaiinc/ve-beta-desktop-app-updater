import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarAiChat.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';

const CalendarAiChat = ({ toggleAskAi }) => {
	return (
		<div className="calendarAiChatContainer">
			<div className="headerWrapper">
				<span className="headLabel">Ask Ai</span>
				<CloseSvg onClick={toggleAskAi} style={{ cursor: 'pointer' }} />
			</div>
			<div className="chatContainer">
				<div className="chatDate">Today</div>

				<div className="aiMessageWrapper">
					<AiSparkel />
					<div className="aiMessage">
						<span>Google Meet?</span>
					</div>
				</div>

				<div className="userMessage">
					<p>That sounds good.</p>
				</div>
			</div>

			<div className="aiInputContainer">
				<input type="text" placeholder="Ex : Schedule a meeting" />
				<SendSvg style={{ cursor: 'pointer' }} />
			</div>
		</div>
	);
};

export default memo(CalendarAiChat);
