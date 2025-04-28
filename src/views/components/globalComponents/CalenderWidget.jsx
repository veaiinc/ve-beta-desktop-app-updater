import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import '../../../assets/scss/globalComponents/calenderWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventDetailsModal from '../modalsV2/calendar/EventDetailsModal';
import ObjectId from 'bson-objectid';
import { FetchMoreLoaderComp } from '../../../helpers';
import Skeleton from 'react-loading-skeleton';

const skeletonLoaders = Array.from({ length: 6 }, (_, index) => index + 1);
const CalenderWidget = ({ width = '412px', height = '412px' }) => {
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
		isLoading: false,
	});

	const eventsLength = allCalendarEvents?.data?.length ?? 0;
	const eventsNextPage = allCalendarEvents?.hasNextPage;
	const eventsCurrentPage = allCalendarEvents?.currentPage || 1;

	const eventRefs = useRef([]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntry = entries.find((entry) => entry.isIntersecting);
				if (visibleEntry) {
					const dateStr = visibleEntry.target.getAttribute('data-date');
					const date = new Date(dateStr);
					setInfo((prev) => ({
						...prev,
						currentDate: date.getDate(),
						currentDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
					}));
				}
			},
			{
				root: document.querySelector('.calenderWidgetMainContent'),
				rootMargin: '0px 0px -80% 0px', // Trigger early
				threshold: 0.1,
			},
		);

		eventRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			eventRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref);
			});
		};
	}, [allCalendarEvents?.data]);

	const groupEventsByDateArray = (events = []) => {
		const grouped = events.reduce((acc, event) => {
			const date = new Date(event.startDateTime).toISOString().split('T')[0];
			acc[date] = acc[date] || [];
			acc[date].push(event);
			return acc;
		}, {});

		return Object.entries(grouped).map(([date, data]) => ({ date, data }));
	};

	const groupedEventsArray = groupEventsByDateArray(allCalendarEvents?.data);

	useEffect(() => {
		const sessionId = ObjectId().toString();
		setInfo((prevInfo) => ({ ...prevInfo, chatSessionId: sessionId }));

		return () => {
			setInfo((prevInfo) => ({
				...prevInfo,
			}));
			resetCalendarAiChat();
		};
	}, []);

	useEffect(() => {
		if (allCalendarEvents?.currentPage !== info?.page) {
			fetchCalendarEvents();
		}
	}, []);

	const fetchMoreCalendarEvents = () => {
		const nextPage = eventsCurrentPage + 1;
		const payload = {
			startDate: info?.currentCalendarDate?.toISOString(),
			sortType: 'startDateTime',
			sortOrder: 'dsc',
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

	const fetchCalendarEvents = async () => {
		setInfo((prev) => ({ ...prev, isLoading: true }));
		const payload = {
			startDate: info?.currentCalendarDate?.toISOString(),
			sortType: 'startDateTime',
			sortOrder: 'asc',
		};
		await getAllCalendarEvents(info?.page, 20, payload);
		setInfo((prev) => ({ ...prev, isLoading: false }));
	};
	return (
		<div className="calender-main-container" style={{ width: width, height: height }}>
			<div className="calenderWidgetContainer">
				<div className="calenderWidgetMain">
					{/* <div className="calenderWidgetDateContainer">
						<div className="calenderWidgetDateContainerDayContainer">
							<div className="calenderWidgetDateContainerDay">{info?.currentDay}</div>
							<div className="calenderWidgetDateContainerDate">
								{info?.currentDate}
							</div>
						</div>
					</div> */}
					<div
						className="calenderWidgetMainContent"
						style={{
							height: '100%',
						}}
					>
						{info?.isLoading ? (
							skeletonLoaders?.map((item) => (
								<Skeleton
									width="300px"
									height="36px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
								/>
							))
						) : allCalendarEvents?.data?.length > 0 ? (
							<InfiniteScroll
								dataLength={allCalendarEvents?.data?.length}
								next={fetchMoreCalendarEvents}
								hasMore={allCalendarEvents?.hasNextPage}
								loader={<FetchMoreLoaderComp />}
								height={350}
							>
								<div className="calenderWidgetMainContentDate">
									{groupedEventsArray?.map((meet, index) => (
										<>
											<div key={index} className="calendarWidgetDayGroup">
												<div className="calendarWidgetStickyDate">
													<div className="calenderWidgetDateContainer">
														<div className="calenderWidgetDateContainerDayContainer">
															<div className="calenderWidgetDateContainerDay">
																{new Date(
																	meet?.date,
																).toLocaleDateString(undefined, {
																	weekday: 'long',
																})}
															</div>
															<div className="calenderWidgetDateContainerDate">
																{new Date(
																	meet?.date,
																).toLocaleDateString(undefined, {
																	day: '2-digit',
																	month: '2-digit',
																})}
															</div>
														</div>
													</div>
												</div>
												<div
													className="calendarWidgetDayGroupContent"
													style={{
														display: 'flex',
														flexDirection: 'column',
														width: '100%',
														gap: '12px',
													}}
												>
													{meet?.data.map((eachMeet) => (
														<div
															key={eachMeet.id}
															ref={(el) =>
																(eventRefs.current[index] = el)
															}
															data-date={eachMeet?.startDateTime}
															className="calenderWidgetMainContentDateMeet"
															onClick={() =>
																handleCalendarClick(eachMeet)
															}
															style={{ cursor: 'pointer' }}
														>
															<div className="calenderWidgetMainContentDateMeetTime">
																<span className="calenderWidgetMainContentTime">
																	{new Date(
																		eachMeet?.startDateTime,
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
																	{eachMeet?.title}
																</div>
																<div className="meetingDetailsTime">
																	{new Date(
																		eachMeet?.startDateTime,
																	).toLocaleTimeString([], {
																		hour: '2-digit',
																		minute: '2-digit',
																		hour12: true,
																	})}{' '}
																	-
																	{new Date(
																		eachMeet?.endDateTime,
																	).toLocaleTimeString([], {
																		hour: '2-digit',
																		minute: '2-digit',
																		hour12: true,
																	})}
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</>
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
				filterDeletedEvent={filterDeletedEvent}
			/>
		</div>
	);
};

export default CalenderWidget;
