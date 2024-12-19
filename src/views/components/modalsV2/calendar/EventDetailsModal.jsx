import React, { memo, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import '../../../../assets/scss/calendar/modal/eventDetailsModal.scss';
import CustomInput from '../../../components/globalComponents/CustomInput';
import Spinner from '../../../components/loaders/Spinner';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
// import moment from 'moment';

const EventDetailsModal = ({ selectedEvent, isEventSelected, updateCalendarInfo }) => {
	const {
		calendarInfo: {
			calendarEventDetails,
			getCalendarEventDetails,
			calendarEvent,
			updateCalendarEvent,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		eventDetails: null,
		eventKeys: [],
	});

	// Cache to store previously fetched event details
	const eventCache = useRef(new Map());

	console.log('eventDetails', info?.eventDetails);

	useEffect(() => {
		getEventDetails();
	}, [selectedEvent]);

	useEffect(() => {
		if (calendarEventDetails) {
			setInfo((prev) => ({
				...prev,
				eventDetails: calendarEventDetails,
				eventKeys: Object.keys(calendarEventDetails),
			}));
			// Store the fetched details in cache
			if (selectedEvent?.id) {
				eventCache.current.set(selectedEvent.id, calendarEventDetails);
			}
		}
	}, [calendarEventDetails]);

	useEffect(() => {
		const currentEventCache = eventCache.current;
		return () => {
			setInfo((prev) => ({
				...prev,
				loading: true,
				eventDetails: null,
				eventKeys: [],
			}));
			currentEventCache.clear();
		};
	}, []);

	const getEventDetails = useCallback(async () => {
		if (selectedEvent?.id) {
			// Check if we have cached data
			const cachedEvent = eventCache.current.get(selectedEvent.id);

			if (cachedEvent) {
				// Use cached data
				setInfo((prev) => ({
					...prev,
					loading: false,
					eventDetails: cachedEvent,
					eventKeys: Object.keys(cachedEvent),
				}));
				return;
			}

			// Fetch new data if not in cache
			setInfo((prev) => ({ ...prev, loading: true }));
			await getCalendarEventDetails(selectedEvent.id);
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [selectedEvent]);

	// const formatEventTime = useCallback((startDateTime, endDateTime) => {
	// 	const start = moment(startDateTime);
	// 	const end = moment(endDateTime);
	// 	return `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
	// }, []);

	const componentMapper = useMemo(
		() => ({
			title: (value) => (
				<CustomInput
					value={value}
					onChange={() => {}}
					className="eventTitle"
					placeholder="Event Title"
				/>
			),
			description: (value) => <CustomInput value={value} />,
		}),
		[],
	);

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
						<div className="eventDetailsWrapper">
							{info?.eventKeys
								?.filter((key) => componentMapper[key])
								.map((key) => (
									<div className="eventDetailsRow" key={key}>
										<span className="eventKey">{key}</span>
										<span className="eventValue">
											{componentMapper[key]
												? componentMapper[key](info?.eventDetails[key])
												: ''}
										</span>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</Drawer>
	);
};

export default memo(EventDetailsModal);
