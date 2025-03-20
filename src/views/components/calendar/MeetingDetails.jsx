import React, { memo, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import '../../../assets/scss/calendar/meetingDetails.scss';
// import { ReactComponent as MeetClock } from '../../../assets/svg/calendar/meetClock.svg';
// import Meetwomen from '../../../assets/svg/calendar/meetwomen.png';
// import { ReactComponent as Ellipse } from '../../../assets/svg/calendar/ellipseCircle.svg';
import Context from '../../../context/context';
import moment from 'moment';
import MeetingSvg from '../../../assets/svg/calendar/meetClockSvg';

const MeetingDetails = ({ selectedDate }) => {
	const {
		calendarInfo: { calendarEventsList = [], deletedEvent, getCalendarEventsList },
	} = useContext(Context);
	const [currentTime, setCurrentTime] = useState(moment());

	useEffect(() => {
		if (deletedEvent) {
			// Refresh the event list to display the latest event if the previous latest event was deleted
			getCalendarEventsList(selectedDate);
		}
	}, [deletedEvent]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(moment());
		}, 60000);

		return () => clearInterval(timer);
	}, []);

	const upcomingEvent = useMemo(() => {
		if (!calendarEventsList || calendarEventsList.length === 0) return null;

		return [...calendarEventsList]
			?.sort((a, b) => moment(a?.startDateTime).diff(moment(b?.startDateTime)))
			?.find((event) => moment(event?.startDateTime).isAfter(currentTime));
	}, [calendarEventsList, currentTime]);

	const formatTimeRemaining = useCallback(
		(eventstartDateTime) => {
			if (!eventstartDateTime) return '0 hr 0 min';

			const diff = moment.duration(moment(eventstartDateTime).diff(currentTime));
			const hours = Math.floor(diff.asHours());
			const minutes = diff.minutes();

			const hoursText = hours > 0 ? `${hours} hr` : '';
			const minutesText = minutes > 0 ? `${minutes} min` : '';

			const result = [hoursText, minutesText].filter(Boolean).join(' ');

			return result || '0 hr 0 min';
		},
		[currentTime],
	);

	const eventDetails = useMemo(
		() => ({
			start: moment(upcomingEvent?.startDateTime).local().format('hh:mm A'),
			end: moment(upcomingEvent?.endDateTime).local().format('hh:mm A'),
			timeRemaining: formatTimeRemaining(upcomingEvent?.startDateTime),
			title: upcomingEvent?.title,
		}),
		[upcomingEvent, formatTimeRemaining],
	);

	return !upcomingEvent ? (
		<div className="meetingCardParentContainer">
			<div className="meetingCard">
				<div className="timeDurationWrapper">
					<div style={{ fontSize: '15px', width: '170px', color: 'grey' }}>
						No Upcoming Meetings are scheduled!
					</div>
					<div className="durationBadge">
						<MeetingSvg />
						<span style={{ fontSize: '10px', fontWeight: '600' }}>00:00</span>
						<span className="indicatorDot"></span>
					</div>
				</div>
				<div className="meetingDetailsWrapper">
					<div>Latest Meeting will be shown here</div>
				</div>
			</div>

			{/* <div class="personImage">
				<img src={Meetwomen} alt="Person working at laptop" />
			</div>
			<Ellipse className="ellipse" /> */}
		</div>
	) : (
		<div className="meetingCardParentContainer">
			<div className="meetingCard">
				<div className="timeDurationWrapper">
					<div style={{ fontSize: '15px' }}>
						{eventDetails?.start} - {eventDetails?.end}
					</div>
					<div className="durationBadge">
						<MeetingSvg />
						<span style={{ fontSize: '10px', fontWeight: '600' }}>
							{eventDetails?.timeRemaining}
						</span>
						<span className="indicatorDot"></span>
					</div>
				</div>

				<div className="meetingDetailsWrapper">
					<div>Upcoming event ...</div>
					<div className="meetingTitle">{eventDetails?.title}</div>
				</div>
			</div>

			{/* <div class="personImage">
				<img src={Meetwomen} alt="Person working at laptop" />
			</div>
			<Ellipse className="ellipse" /> */}
		</div>
	);
};

export default memo(MeetingDetails);
