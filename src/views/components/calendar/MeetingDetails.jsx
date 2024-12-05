import React, { memo } from 'react';
import '../../../assets/scss/calendar/meetingDetails.scss';
import { ReactComponent as MeetClock } from '../../../assets/svg/calendar/meetClock.svg';
import { ReactComponent as Ellipse } from '../../../assets/svg/calendar/ellipseCircle.svg';
import Meetwomen from '../../../assets/svg/calendar/meetwomen.png';

const MeetingDetails = () => {
	return (
		<div className="meetingCardParentContainer">
			<div className="meetingCard">
				<div className="timeDurationWrapper">
					<div style={{ fontSize: '16px' }}>12:00PM - 1:30PM</div>
					<div className="durationBadge">
						<MeetClock />
						<span style={{ fontSize: '12px' }}>14 min</span>
						{/* <span className="indicatorDot"></span> */}
					</div>
				</div>

				<div className="meetingDetailsWrapper">
					<div style={{ color: 'rgba(228, 229, 230, 0.48)', fontSize: '12px' }}>
						Meeting with
					</div>
					<div style={{ color: '#E4E5E6', fontSize: '18px' }}>Mr. Avinash</div>
				</div>
			</div>

			<div class="personImage">
				<img src={Meetwomen} alt="Person working at laptop" />
			</div>
			<Ellipse className="ellipse" />
		</div>
	);
};

export default memo(MeetingDetails);
