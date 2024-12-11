import React, { memo, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Drawer } from 'antd';
import '../../../assets/scss/calendar/eventDetailsDrawer.scss';
import { ReactComponent as CategoryIcon } from '../../../assets/svg/calendar/category.svg';
// import { ReactComponent as ShareIcon } from '../../../assets/svg/calendar/shareWhite.svg';
import { ReactComponent as VerticalDots } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as NoteIcon } from '../../../assets/svg/calendar/note.svg';
import { ReactComponent as Close } from '../../../assets/svg/calendar/close.svg';
// import { ReactComponent as LocationIcon } from '../../../assets/svg/calendar/locationPin.svg';
// import { ReactComponent as LinkIcon } from '../../../assets/svg/activity/link.svg';
import Spinner from '../../components/loaders/Spinner';
import Context from '../../../context/context';
import moment from 'moment';

const RenderEventDetails = ({ info, updateCalendarInfo, formatEventTime }) => {
	if (!info?.eventDetails) return null;

	const {
		title,
		description,
		location,
		startDateTime,
		endDateTime,
		timezone,
		allDay,
		attendees,
		meetingLink,
		calendarCategory,
		calendarMetaData,
	} = info?.eventDetails;

	return (
		<div className="eventDetailsDrawerParentCOntainer">
			<div className="innerContainer">
				<div className="headerWrapper">
					<div className="headerText">
						<div className="categoryLabel">
							<CategoryIcon />
							<span className="categoryText">Event Details</span>
						</div>
						{/* <div className="eventName">{title}</div> */}
					</div>
					<div className="headerIcons">
						<button
							className=""
							onClick={() => updateCalendarInfo('isEventSelected', false)}
						>
							<Close />
						</button>
					</div>
				</div>

				<div className="eventDetailsWrapper">
					<div className="detailsData">
						<div className="detailsTitle">Agenda</div>
						<div className="detailsValue">{title}</div>
					</div>
					<div className="detailsData">
						<div className="detailsTitle">Start Date</div>
						<div className="detailsValue">
							{moment(startDateTime).format('ddd, MMMM D YYYY')}
						</div>
					</div>
					<div className="detailsData">
						<div className="detailsTitle">End Date</div>
						<div className="detailsValue">
							{moment(endDateTime).format('ddd, MMMM D YYYY')}
						</div>
					</div>
					<div className="detailsData">
						<div className="detailsTitle">Time Duration</div>
						<div className="detailsValue">
							{formatEventTime(startDateTime, endDateTime)}
						</div>
					</div>
					<div className="detailsData">
						<div className="detailsTitle">All day event</div>
						<div className="detailsValue">{allDay ? 'Yes' : 'No'}</div>
					</div>
					{/* <div className="detailsData">
						<div className="detailsTitle">Category</div>
						<div className="detailsValue">{calendarCategory}</div>
					</div>
					{calendarMetaData?.subCategory && (
						<div className="detailsData">
							<div className="detailsTitle">Sub Category</div>
							<div className="detailsValue">{calendarMetaData.subCategory}</div>
						</div>
					)} */}
					{calendarMetaData?.priority && (
						<div className="detailsData">
							<div className="detailsTitle">Priority</div>
							<div className="detailsValue">{calendarMetaData.priority}</div>
						</div>
					)}
					{location && (
						<div className="detailsData">
							<div className="detailsTitle">Location</div>
							<div className="detailsValue">{location}</div>
						</div>
					)}
					{meetingLink && (
						<div className="detailsData">
							<div className="detailsTitle">
								{/* <LinkIcon /> */}
								Meeting Link
							</div>
							<div className="detailsValue">
								<a href={meetingLink} target="_blank" rel="noopener noreferrer">
									{meetingLink}
								</a>
							</div>
						</div>
					)}
				</div>

				<div className="attendeesWrapper">
					<div className="attendeesLabel">
						<h3>Attendees</h3>
						<div className="attendeesCount">{attendees?.length || 0}</div>
					</div>
					<input type="text" placeholder="add attendee" />
					<div className="attendiesDetailsContainer">
						{attendees?.map((attendee, index) => (
							<div key={index} className="attendeesDetailsWrapper">
								<div className="avatar"></div>
								<div className="textWrapper">
									<div className="name">
										{attendee?.name === '' ? attendee?.email : attendee?.name}
									</div>
									<div className="role">
										{attendee?.isWorkspaceUser ? 'Workspace User' : 'External'}
										{attendee?.responseStatus &&
											` • ${attendee?.responseStatus}`}
									</div>
								</div>
								<VerticalDots />
							</div>
						))}
					</div>
				</div>

				{description && (
					<div className="descriptionWrapper">
						<div className="descriptionLabel">
							<NoteIcon />
							<h3>Description</h3>
						</div>
						<p>{description}</p>
					</div>
				)}
			</div>
		</div>
	);
};

const EventDetailsDrawer = ({ selectedEvent, isEventSelected, updateCalendarInfo }) => {
	const {
		calendarInfo: { calendarEventDetails, getCalendarEventDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		eventDetails: null,
	});

	// Cache to store previously fetched event details
	const eventCache = useRef(new Map());

	useEffect(() => {
		getEventDetails();
	}, [selectedEvent]);

	useEffect(() => {
		if (calendarEventDetails) {
			setInfo({ ...info, eventDetails: calendarEventDetails });
			// Store the fetched details in cache
			if (selectedEvent?.id) {
				eventCache.current.set(selectedEvent.id, calendarEventDetails);
			}
		}
	}, [calendarEventDetails]);

	useEffect(() => {
		return () => {
			setInfo((prev) => ({ ...prev, loading: true, eventDetails: null }));
			eventCache.current.clear();
		};
	}, []);

	const getEventDetails = useCallback(async () => {
		if (selectedEvent?.id) {
			// Check if we have cached data
			const cachedEvent = eventCache.current.get(selectedEvent.id);

			if (cachedEvent) {
				// Use cached data
				setInfo({
					loading: false,
					eventDetails: cachedEvent,
				});
				return;
			}

			// Fetch new data if not in cache
			setInfo({ ...info, loading: true });
			await getCalendarEventDetails(selectedEvent.id);
			setInfo({ ...info, loading: false });
		}
	}, [selectedEvent]);

	const formatEventTime = useCallback((startDateTime, endDateTime) => {
		const start = moment(startDateTime);
		const end = moment(endDateTime);
		return `${start.format('h:mmA')} - ${end.format('h:mmA')}`;
	}, []);

	return (
		<Drawer
			onClose={() => updateCalendarInfo('isEventSelected', false)}
			width={450}
			open={isEventSelected}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			{info?.loading ? (
				<div className="eventDetailsDrawerParentCOntainer">
					<div className="innerContainer">
						<div className="loadingContainer">
							<Spinner />
							<div>Hang tight! Your event details are on their way...</div>
						</div>
					</div>
				</div>
			) : (
				<RenderEventDetails
					info={info}
					updateCalendarInfo={updateCalendarInfo}
					formatEventTime={formatEventTime}
				/>
			)}
		</Drawer>
	);
};

export default memo(EventDetailsDrawer);
