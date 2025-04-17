import React, { useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/globalComponents/calenderWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventDetailsModal from '../modalsV2/calendar/EventDetailsModal';
import ObjectId from 'bson-objectid';

const infiniteScrollStyle = {
	height: '34vh',
};
const CalenderWidget = ({ width }) => {
	const {
		calendarInfo: {
			getCalendarEventsList,
			calendarEventsList,
			getAllCalendarEvents,
			allCalendarEvents,
			calendarCategoriesList,
			getCalendarCategories,
			resetCalendarAiChat,
		},
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		currentCalendarDate: new Date(),
		currentDate: new Date().getDate(),
		currentDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
		promptPopupOpen: false,
		selectedCard: null,
		page: 1,
		selectedEvent: null,
		isModalOpen: false,
		eventsList: [],
	});

	const eventsLength = allCalendarEvents?.data?.length ?? 0;
	const eventsNextPage = allCalendarEvents?.hasNextPage;
	const eventsCurrentPage = allCalendarEvents?.currentPage || 1;

	useEffect(() => {
		const sessionId = ObjectId().toString();
		setInfo((prevInfo) => ({ ...prevInfo, chatSessionId: sessionId }));

		if (!calendarCategoriesList) {
			getCalendarCategories();
		}

		return () => {
			setInfo((prevInfo) => ({
				...prevInfo,
			}));
			resetCalendarAiChat();
		};
	}, []);

	useEffect(() => {
		const payload = {
			options: {
				startDate: info?.currentCalendarDate?.toISOString(),
			},
		};
		if (allCalendarEvents?.currentPage !== info?.page) {
			getAllCalendarEvents(info?.page, 20, payload);
		}
	}, []);

	const fetchMoreCalendarEvents = () => {
		const nextPage = eventsCurrentPage + 1;
		const payload = {
			options: {
				limit: 20,
			},
		};
		if (eventsCurrentPage !== undefined) {
			getAllCalendarEvents(nextPage, 20, payload);
		}
	};

	const handleCalendarClick = (meet) => {
		setInfo((prev) => ({
			...prev,
			selectedEvent: meet,
			isModalOpen: true,
		}));
	};

	const handleModalClose = () => {
		setInfo((prev) => ({
			...prev,
			isModalOpen: false,
		}));
	};

	const updateCalenderEventsList = useCallback(
		(eventId, updateBody = {}) => {
			const updatedEventsList = [...(info?.eventsList || [])];
			for (let i = 0; i < updatedEventsList?.length; i++) {
				if (updatedEventsList?.[i]?.id === eventId) {
					updatedEventsList[i] = { ...updatedEventsList[i], ...updateBody };
				}
			}
			setInfo((prev) => ({ ...prev, eventsList: updatedEventsList }));
		},
		[info?.eventsList],
	);
	const filterDeletedEvent = useCallback(
		(eventId) => {
			const filteredEventsList = info?.eventsList?.filter((event) => event?.id !== eventId);
			setInfo((prev) => ({ ...prev, eventsList: filteredEventsList }));
		},
		[info?.eventsList],
	);

	console.log(allCalendarEvents, 'testing');
	return (
		<div className="calender-main-container" style={{ width: width, height: '412px' }}>
			<div className="calenderWidgetContainer">
				<div className="calenderWidgetMain">
					<div className="calenderWidgetDateContainer">
						<div className="calenderWidgetDateContainerDayContainer">
							<div className="calenderWidgetDateContainerDay">{info?.currentDay}</div>
							<div className="calenderWidgetDateContainerDate">
								{info?.currentDate}
							</div>
						</div>
					</div>
					<div
						className="calenderWidgetMainContent"
						style={{
							height: '100%',
						}}
					>
						{allCalendarEvents?.data?.length > 0 ? (
							<InfiniteScroll
								dataLength={allCalendarEvents?.data?.length}
								next={fetchMoreCalendarEvents}
								hasMore={allCalendarEvents?.hasNextPage}
								loader={<div>Loading...</div>}
								height={350}
							>
								<div className="calenderWidgetMainContentDate">
									{allCalendarEvents?.data?.map((meet) => (
										<div
											className="calenderWidgetMainContentDateMeet"
											onClick={() => handleCalendarClick(meet)}
											style={{ cursor: 'pointer' }}
										>
											<div className="calenderWidgetMainContentDateMeetTime">
												<span className="calenderWidgetMainContentTime">
													{new Date(
														meet?.startDateTime,
													).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
														hour12: true,
													})}
												</span>
												<span className="calenderWidgetMainLine"></span>
											</div>
											<div className="meetingDetails">
												<div className="meetingDetailsTitle">
													{meet?.title}
												</div>
												<div className="meetingDetailsTime">
													{new Date(
														meet?.startDateTime,
													).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
														hour12: true,
													})}{' '}
													-
													{new Date(meet?.endDateTime).toLocaleTimeString(
														[],
														{
															hour: '2-digit',
															minute: '2-digit',
															hour12: true,
														},
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</InfiniteScroll>
						) : (
							<div className="calenderWidgetMainContentDate">No events found</div>
						)}
					</div>
				</div>
				<hr
					style={{
						width: '100%',
						background: 'var(--stroke)',
						border: 'none',
						height: '1px',
					}}
				/>
				<div
					className="calenderWidgetFooter"
					onClick={() => {
						navigate('/calendar');
					}}
					style={{ cursor: 'pointer' }}
				>
					<div className="calenderWidgetFooterTitle">View Calendar</div>
					<PlusIcon />
				</div>
			</div>
			<EventDetailsModal
				isEventSelected={info?.isModalOpen}
				selectedEvent={info?.selectedEvent}
				categoryList={calendarCategoriesList}
				onClose={handleModalClose}
				updateCalenderEventsList={updateCalenderEventsList}
			/>
		</div>
	);
};

export default CalenderWidget;
