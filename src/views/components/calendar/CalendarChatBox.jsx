import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarChatBox.scss';
import ChatBox from '../chat/ChatBox';

const CalendarChatBox = (props) => {
	return (
		<div className="calendar-chatbox-wrapper">
			<ChatBox {...props} customChatActions={true} autoFocus={false} showIconText={false} />
		</div>
	);
};

export default memo(CalendarChatBox);
