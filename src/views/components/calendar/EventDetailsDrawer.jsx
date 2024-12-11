import React, { memo, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Drawer } from 'antd';
import '../../../assets/scss/calendar/eventDetailsDrawer.scss';
import { ReactComponent as CategoryIcon } from '../../../assets/svg/calendar/category.svg';
// import { ReactComponent as ShareIcon } from '../../../assets/svg/calendar/shareWhite.svg';
import { ReactComponent as VerticalDots } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as NoteIcon } from '../../../assets/svg/calendar/note.svg';
import { ReactComponent as Close } from '../../../assets/svg/calendar/close.svg';
import Spinner from '../../components/loaders/Spinner';
import Context from '../../../context/context';

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

	useEffect(() => {
		return () => {
			setInfo((prev) => ({ ...prev, loading: true, eventDetails: null }));
			eventCache.current.clear();
		};
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
				<div className="eventDetailsDrawerParentCOntainer">
					<div className="innerContainer">
						<div className="headerWrapper">
							<div className="headerText">
								<div className="categoryLabel">
									<CategoryIcon />
									<span className="categoryText">Event Details</span>
								</div>
								{/* <div className="eventName">Virat Kohli & anushka</div> */}
							</div>
							<div className="headerIcons">
								<button>{/* <ShareIcon /> */}</button>
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
								<div className="detailsValue">Meeting for sales</div>
							</div>
							{/* <div className="detailsData">
							<div className="detailsTitle">Client name</div>
							<div className="detailsValue">Virat Kohli & anushka</div>
						</div> */}
							<div className="detailsData">
								<div className="detailsTitle">Start Date</div>
								<div className="detailsValue">Wed, September 22 2024</div>
							</div>
							<div className="detailsData">
								<div className="detailsTitle">End Date</div>
								<div className="detailsValue">Wed, September 22 2024</div>
							</div>
							<div className="detailsData">
								<div className="detailsTitle">Time Duration</div>
								<div className="detailsValue">12:00PM - 12:30PM</div>
							</div>
							<div className="detailsData">
								<div className="detailsTitle">All day event</div>
								<div className="detailsValue">No</div>
							</div>
						</div>
						<div className="attendeesWrapper">
							<div className="attendeesLabel">
								<h3>Attendees</h3>
								<div className="attendeesCount">2</div>
							</div>
							<input type="text" placeholder="add attendee" />
							<div className="attendiesDetailsContainer">
								<div className="attendeesDetailsWrapper">
									<div className="avatar"></div>

									<div className="textWrapper">
										<div className="name">Gretchen Culhane</div>
										<div className="role"> Attendee</div>
									</div>
									<VerticalDots />
								</div>
								<div className="attendeesDetailsWrapper">
									<div className="avatar"></div>
									<div className="textWrapper">
										<div className="name">Ann Siphron</div>
										<div className="role">Attendee</div>
									</div>
									<VerticalDots />
								</div>
							</div>
						</div>
						<div className="descriptionWrapper">
							<div className="descriptionLabel">
								<NoteIcon />
								<h3>Description</h3>
							</div>
							<p>
								This page aims to provide real-time insights into employee
								performance metrics and key business indicators.
							</p>
						</div>
						{/* <div className="notesWrapper">
						<nav>
							<ul>
								<li className="active">Notes</li>
								<li>Activities</li>
							</ul>
						</nav>
						<div className="notesContainer">
							<div className="note">
								<div className="focusContainer">
									<RainbowRing />
								</div>
								<textarea className="notesTitle">
									The sun set slowly over the horizon
								</textarea>
								<textarea className="notesDescription">
									The sun set slowly over the horizon, casting a warm orange glow
									across the landscape. Birds chirped softly in the distance as a
									gentle breeze rustled the leaves of the trees. The sun set
									slowly over the horizon, casting a warm orange glow across the
									landscape. Birds chirped softly in the distance as a gentle
									breeze rustled the leaves of the trees.The sun set slowly over
									the horizon, casting a warm orange glow across the landscape.
									Birds chirped softly in the distance as a gentle breeze rustled
									the leaves of the trees.
								</textarea>
							</div>
							<div className="note">
								<textarea className="notesTitle">
									The sun set slowly over the horizon
								</textarea>

								<textarea className="notesDescription">
									Start typing here...
								</textarea>
							</div>
							<div className="note">
								<textarea className="notesTitle">
									The sun set slowly over the horizon
								</textarea>

								<textarea className="notesDescription">
									Start typing here...
								</textarea>
							</div>
						</div>
					</div> */}

						{/* Note part will be excluded from this component */}
					</div>
				</div>
			)}
		</Drawer>
	);
};

export default memo(EventDetailsDrawer);
