import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';
import { ReactComponent as User } from '../../../assets/svg/calendar/calendarEllipse.svg';

const colorsArray = [
	'#CF824B',
	'#89AC4F',
	'#4F9BAC',
	'#7E78C9',
	'#C378C9',
	'#5E8BE2',
	'#CF4B92',
	'#7A7A7A',
	'#B08D8D',
	'#D76262',
];

const CustomEventCard = ({ event }) => {
	return (
		<div className="customEventCardParentContainer">
			<div className="cardContainer">
				<div className="eventHeadWrapper">
					<span className="eventTitle">{event.title}</span>
					<span
						className="statusIndicator"
						// style={{ backgroundColor: $color }}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<span></span>
					</span>
				</div>

				<div className="userSvg">
					<User />
				</div>
			</div>
		</div>
	);
};

export default memo(CustomEventCard);
