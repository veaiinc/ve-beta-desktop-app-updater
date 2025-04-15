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
	const eventsCurrentPage = allCalendarEvents?.currentPage;

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
							>
								<div className="calenderWidgetMainContentDate">
									{allCalendarEvents?.data?.map((meet) => (
										<div className="calenderWidgetMainContentDateMeet">
											<div className="calenderWidgetMainContentDateMeetTime">
												<span className="calenderWidgetMainContentTime">
													{meet?.startTime}
												</span>
												<span className="calenderWidgetMainLine"></span>
											</div>
											<div className="meetingDetails">
												<div className="meetingDetailsTitle">
													{meet?.title}
												</div>
												<div className="meetingDetailsTime">
													{meet?.startTime} - {meet?.endTime}
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
