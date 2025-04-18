import React, { memo } from 'react';
import ChatBox from '../homePage/ChatBox';
import '../../../assets/scss/calendar/calendarChatBox.scss';

const CalendarChatBox = (props) => {
	return (
		<div className="calendar-chatbox-wrapper">
			<ChatBox {...props} customChatActions={true} autoFocus={false} showIconText={false} />
		</div>
	);
};

export default memo(CalendarChatBox);
