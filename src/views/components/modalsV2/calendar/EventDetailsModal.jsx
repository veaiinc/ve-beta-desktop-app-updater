import React, { memo, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import '../../../../assets/scss/calendar/modal/eventDetailsModal.scss';
import CustomInput from '../../../components/globalComponents/CustomInput';
import CustomTextArea from '../../../components/globalComponents/CustomTextArea';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as Arrow } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/tasks/dustBin.svg';
import Spinner from '../../../components/loaders/Spinner';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
import moment from 'moment';

const initialState = {
	loading: true,
	deleting: false,
	eventDetails: null,
	eventKeys: [],
};

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
		...initialState,
		detailsExpanded: false,
	});
	const visibleKeys = info?.detailsExpanded ? info?.eventKeys : info?.eventKeys?.slice(0, 6);

	// Cache to store previously fetched event details
	const eventCache = useRef(new Map());

	// console.log('eventDetails', info?.eventDetails);

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
			setInfo({
				...initialState,
			});
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

	const formatEventTime = useCallback((startDateTime, endDateTime) => {
		const start = moment(startDateTime);
		const end = moment(endDateTime);
		return `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
	}, []);

	const componentMapper = useMemo(
		() => ({
			title: (value) => (
				<CustomInput
					value={value}
					onChange={(e) => updateEventDetails('title', e.target?.value)}
					className="eventTitle"
					placeholder="Event Title"
				/>
			),
			description: (value) => <CustomInput value={value} />,
			location: (value) => <CustomInput value={value} />,
			startDateTime: (value) => <CustomInput type="datetime-local" value={moment(value)} />,
			endDateTime: (value) => <CustomInput type="datetime-local" value={moment(value)} />,
			meetingLink: (value) => <CustomInput type="url" value={value} />,
		}),
		[],
	);

	const updateEventDetails = useCallback((field, value) => {
		setInfo((prev) => ({
			...prev,
			eventDetails: {
				...prev.eventDetails,
				[field]: value,
			},
		}));
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
						{/* Event Header */}
						<div className="eventHeader">
							<CloseSvg
								width={16}
								height={16}
								onClick={() => updateCalendarInfo('isEventSelected', false)}
								style={{ cursor: 'pointer' }}
							/>

							<div className="eventTitle">Event Details</div>

							{info?.deleting ? (
								<Spinner width={18} height={18} color="#7d7d7d" />
							) : (
								<Delete width={20} height={20} className="deleteIcon" />
							)}
						</div>

						{/* Event Title */}
						<CustomTextArea
							value={info?.eventDetails?.title}
							onChange={(e) => {
								updateEventDetails('title', e.target?.value);
							}}
							className="eventTitleInput"
							autoResize={true}
						/>

						{/* Event Details */}
						<div className="eventDetailsWrapper">
							{info?.eventKeys
								?.filter((key) => componentMapper[key])
								.map((key) => (
									<div
										className={`eventDetailsRow ${
											visibleKeys.includes(key) ? 'visible' : 'hidden'
										}`}
										key={key}
									>
										<span className="eventKey">{key}</span>
										<span className="eventValue">
											{componentMapper[key](info?.eventDetails[key])}
										</span>
									</div>
								))}

							<span
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										detailsExpanded: !prev.detailsExpanded,
									}))
								}
								className="expandBtn"
							>
								<Arrow
									style={{
										width: 10,
										height: 10,
										transform: info?.detailsExpanded
											? 'rotate(180deg)'
											: 'rotate(0deg)',
										transition: 'transform 0.4s ease',
									}}
								/>
								<span>{info?.detailsExpanded ? 'Show Less' : 'Show More'}</span>
							</span>
						</div>
					</div>
				</div>
			)}
		</Drawer>
	);
};

export default memo(EventDetailsModal);
