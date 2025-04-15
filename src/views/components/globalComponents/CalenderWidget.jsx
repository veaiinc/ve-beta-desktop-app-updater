import React, { useState, useContext, useEffect } from 'react';
import '../../../assets/scss/globalComponents/calenderWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';

const CalenderWidget = ({ width }) => {
	const {
		calendarInfo: {
			getCalendarEventsList,
			calendarEventsList,
			getAllCalendarEvents,
			allCalendarEvents,
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
	});

	const eventsLength = allCalendarEvents?.data?.length;
	const eventsNextPage = allCalendarEvents?.hasNextPage;
	const eventsCurrentPage = allCalendarEvents?.currentPage || 1;

	useEffect(() => {
		const payload = {
			options: {
				page: info?.page,
				limit: 20,
				startDate: info?.currentCalendarDate.toISOString(),
			},
		};
		if (info?.currentCalendarDate) {
			getAllCalendarEvents(payload);
		}
	}, [info?.currentCalendarDate]);

	const fetchMoreCalendarEvents = () => {
		const payload = {
			options: {
				page: eventsCurrentPage + 1,
				limit: 20,
			},
		};
		if (eventsCurrentPage !== undefined) {
			getAllCalendarEvents(payload);
		}
	};
	console.log(allCalendarEvents?.data, 'testing');
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
					<div className="calenderWidgetMainContent" id="calenderWidgetMainContent">
						{allCalendarEvents?.data?.length > 0 ? (
							<InfiniteScroll
								dataLength={eventsLength}
								next={fetchMoreCalendarEvents}
								hasMore={eventsNextPage}
								loader={<div>Loading...</div>}
								scrollableTarget="calenderWidgetMainContent"
								style={{ height: '34vh' }}
							>
								<div className="calenderWidgetMainContentDate">
									{allCalendarEvents?.data?.map((meet) => (
										<div className="calenderWidgetMainContentDateMeet">
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
		</div>
	);
};

export default CalenderWidget;
