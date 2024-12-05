import React, { memo, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import '../../../assets/scss/calendar/meetingDetails.scss';
import { ReactComponent as MeetClock } from '../../../assets/svg/calendar/meetClock.svg';
import { ReactComponent as Ellipse } from '../../../assets/svg/calendar/ellipseCircle.svg';
import Meetwomen from '../../../assets/svg/calendar/meetwomen.png';
import Context from '../../../context/context';
import moment from 'moment';

const MeetingDetails = () => {
	const {
		calendarInfo: { calendarEventsList },
	} = useContext(Context);
	const [currentTime, setCurrentTime] = useState(moment());

	// Memoized events list to prevent unnecessary re-renders
	const events = useMemo(
		() => [
			{
				id: '674d4aa49cc2a257c55d6ae6',
				start: '2024-12-20T09:00:00.000Z',
				end: '2024-12-20T11:30:00.000Z',
				title: 'Hybrid Annual General Meeting',
				description: 'Company-wide AGM with both physical and virtual attendance',
			},
			{
				id: '674d4b399cc2a257c55d6ae9',
				start: '2024-12-05T14:00:00.000Z',
				end: '2024-12-05T16:00:00.000Z',
				title: 'Social Media Strategies Workshop',
				description:
					'An interactive workshop on the latest trends in social media marketing.',
			},
			{
				id: '674d4aa49cc2a257c55d6ae6',
				start: '2024-12-20T17:00:00.000Z',
				end: '2024-12-20T17:30:00.000Z',
				title: 'Team Status Meeting',
				description: 'Weekly team status update',
			},
			{
				id: '674d4aa49cc2a257c55d6ae6',
				start: '2024-12-20T18:00:00.000Z',
				end: '2024-12-20T18:30:00.000Z',
				title: 'Strategy Review',
				description: 'Monthly strategy discussion',
			},
		],
		[],
	);

	// Memoized function to find the upcoming event
	const findUpcomingEvent = useCallback(() => {
		// Sort events and find the next upcoming event
		return [...events]
			.sort((a, b) => moment(a.start).diff(moment(b.start)))
			.find((event) => moment(event.start).isAfter(currentTime));
	}, [events, currentTime]);

	// Memoized upcoming event to reduce unnecessary re-renders
	const upcomingEvent = useMemo(() => findUpcomingEvent(), [findUpcomingEvent]);

	// Optimize time update with useEffect
	useEffect(() => {
		// Create a single interval to update time
		const timer = setInterval(() => {
			setCurrentTime(moment());
		}, 60000); // Every minute

		// Clean up the interval
		return () => clearInterval(timer);
	}, []); // Empty dependency array ensures this runs only once

	// Format time remaining with memoization
	const formatTimeRemaining = useCallback(
		(eventStart) => {
			if (!eventStart) return '00:00';

			const diff = moment.duration(moment(eventStart).diff(currentTime));
			const hours = Math.floor(diff.asHours());
			const minutes = diff.minutes();

			return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
		},
		[currentTime],
	);
	// Memoized event details to prevent unnecessary re-renders
	const eventDetails = useMemo(
		() => ({
			start: moment(upcomingEvent.start).local(),
			end: moment(upcomingEvent.end).local(),
			timeRemaining: formatTimeRemaining(upcomingEvent.start),
		}),
		[upcomingEvent, formatTimeRemaining],
	);

	// Render when no upcoming events
	if (!upcomingEvent) {
		return (
			<div className="p-4 bg-gray-100 rounded-lg">
				<p className="text-gray-500">No upcoming events</p>
				<div className="mt-4 text-sm text-gray-500">
					Current Time: {currentTime.format('MMMM D, YYYY h:mm A')}
				</div>
			</div>
		);
	}

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
