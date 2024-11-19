import React, { memo, useState } from 'react';
import '../../../assets/scss/calendar/createEvent.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as VerticalDots } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as Clock } from '../../../assets/svg/activity/duration.svg';
import { ReactComponent as Category } from '../../../assets/svg/calendar/category.svg';

const CreateEvent = ({ updateCalendarInfo }) => {
	const [info, setInfo] = useState({
		showCategory: false,
		isAllDayEvent: false,
	});
	const handleCategoryToggle = () => {
		setInfo((previnfo) => ({ ...previnfo, showCategory: !previnfo.showCategory }));
	};
	const handleAllDayEventToggle = () => {
		setInfo((previnfo) => ({ ...previnfo, isAllDayEvent: !previnfo.isAllDayEvent }));
	};

	return (
		<div className="createEventContainer">
			<div className="eventDetailsContainer">
				<div className="headerWrapper">
					<span className="headerLabel">Create an event</span>
					<CloseSvg
						onClick={() => updateCalendarInfo('isCreateEventOpen', false)}
						style={{ cursor: 'pointer' }}
					/>
				</div>
				<div className="agendaContainer">
					<span className="agendaLabel">Agenda</span>
					<input type="text" name="" id="" placeholder="E.g. Meeting" />
				</div>
				<div className="detailsContainer">
					<div className="detailsWrapper">
						<Clock />
						<span className="detailsLabel">Details</span>
					</div>
					<div className={`${info.isAllDayEvent ? `` : `eventTimeWrapper`}`}>
						<input type="text" placeholder="Wed, September 22 2024" />
						{info.isAllDayEvent ? '' : <input type="text" placeholder="12:00PM" />}
					</div>
					<div className={`${info.isAllDayEvent ? `` : `eventTimeWrapper`}`}>
						<input type="text" placeholder="Wed, September 22 2024" />
						{info.isAllDayEvent ? '' : <input type="text" placeholder="12:30AM" />}
					</div>
					<div className="allDayWrapper">
						<span className="allDayLabel">All Day Event</span>
						<div className="toggleSwitch">
							<input
								type="checkbox"
								id="toggleSwitchCheckbox"
								className="toggleSwitchCheckbox"
								checked={info.isAllDayEvent}
								onChange={handleAllDayEventToggle}
							/>
							<label className="toggleSwitchLabel" htmlFor="toggleSwitchCheckbox">
								<span className="toggleSwitchHandle"></span>
							</label>
						</div>
					</div>
				</div>
				<div className="categoriesContainer">
					<div className="categoriesWrapper">
						<Category />
						<div className="categoriesLabel">Categories</div>
					</div>
					<div className="categoriesSelector">
						<input type="text" placeholder="Add to a category" />
						<div className="downArrow" onClick={handleCategoryToggle}>
							<DownSvg />
						</div>
						{info?.showCategory ? (
							<div className="categoryDropDown">
								<div className="categoryDropDownItem">Shoots</div>
								<div className="categoryDropDownItem">Sessions</div>
								<div className="categoryDropDownItem">Meetings</div>
								<div className="categoryDropDownItem addCategory">+ Add new</div>
							</div>
						) : (
							''
						)}
					</div>
					{/* <div className="optionsInput">
						<input type="text" />
						<input type="text" />
					</div> */}
				</div>
				<div className="attendeesContainer">
					<div className="attendeesHeader">
						<span className="attendiesLabel">Attendees</span>
						<span className="attendeesCount">2</span>
					</div>
					<input type="text" placeholder="Add attendee" />
					<div className="attendeesList">
						<div className="attendeesDetails">
							<div className="avatar"></div>
							<div className="nameWrapper">
								<span className="name">Avinash</span>
								<span className="role">Organzer</span>
							</div>
						</div>
						<div className="attendeesDetails">
							<div className="avatar"></div>
							<div className="nameWrapper">
								<span className="name">Avinash</span>
								<span className="role">Attendee</span>
							</div>
							<VerticalDots />
						</div>
						<div className="attendeesDetails">
							<div className="avatar"></div>
							<div className="nameWrapper">
								<span className="name">Avinash</span>
								<span className="role">Attendee</span>
							</div>
							<VerticalDots />
						</div>
					</div>
				</div>
			</div>
			<button className="addToCalendar">Add to calendar</button>
		</div>
	);
};

export default memo(CreateEvent);
