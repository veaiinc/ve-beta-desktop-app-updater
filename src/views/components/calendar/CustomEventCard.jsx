import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';
import { ReactComponent as User } from '../../../assets/svg/calendar/calendarEllipse.svg';
import moment from 'moment';

const CustomEventCard = ({ event }) => {
	const startTime = moment(event.start).format('h:mm A');
	const endTime = moment(event.end).format('h:mm A');
	return (
		<div className="customEventCardParentContainer">
			<div className="cardContainer">
				<div className="eventHeader">
					<div className="eventDetails">
						<div className="title">{event.title}</div>
						<div className="subText">
							{startTime}-{endTime}
						</div>
					</div>
					<div className="eventStatusDiv">
						<span
							className="statusIndicator"
							onClick={(event) => {
								event.stopPropagation();
							}}
							style={{
								backgroundColor: event?.calendarCategory?.color,
							}}
						>
							<span></span>
						</span>
					</div>
				</div>
				<div className="eventFooter">
					<div className="userSvg">
						<User />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(CustomEventCard);
