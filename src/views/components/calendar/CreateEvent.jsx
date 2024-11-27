import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
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
		showInputSuggestions: false,
		attendeesInputField: '',
		attendeesList: [],
		inputDropDownItems: [
			{
				_id: '66e8263c45a6222134432931',
				firstName: 'sankar',
				lastName: 'josyula',
				email: 'sankar@ve.ai',
				role: 'admin',
				isOwner: true,
			},
			{
				_id: '671a26ab0d6a528cf2d8fd7a',
				firstName: 'Dheeraj',
				lastName: 'C Justin',
				email: 'dheeraj@ve.ai',
				role: 'admin',
				isOwner: false,
			},
			{
				_id: '671a26ab0d6a528cf3c9fd9b',
				firstName: 'Preetam',
				lastName: 'Singh',
				email: 'dheeraj@ve.ai',
				role: 'admin',
				isOwner: false,
			},
		],
	});

	const createEventRef = useRef(null);

	useEffect(() => {
		let timerId;
		const handleClickOutside = (event) => {
			if (createEventRef.current && !createEventRef.current.contains(event.target)) {
				updateCalendarInfo('isCreateEventOpen', false);
			}
		};

		timerId = setTimeout(() => {
			document.addEventListener('click', handleClickOutside);
		}, 0);

		return () => {
			clearTimeout(timerId);
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const updateCreateEventInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	const addAttendees = useCallback(
		({ name = '', email = '', isWorkspaceUser = false, tenantUserId = '' }) => {
			setInfo((prevInfo) => ({
				...prevInfo,
				attendeesInputField: '',
				attendeesList: [
					...prevInfo?.attendeesList,
					{ name, email, isWorkspaceUser, tenantUserId },
				],
			}));
		},
		[],
	);

	return (
		<div className="createEventContainer" ref={createEventRef}>
			<div className="headerWrapper">
				<span className="headerLabel">Create an event</span>
				<CloseSvg
					onClick={() => updateCalendarInfo('isCreateEventOpen', false)}
					style={{ cursor: 'pointer' }}
				/>
			</div>
			<div className="eventDetailsContainer">
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
								onChange={() =>
									updateCreateEventInfo('isAllDayEvent', !info?.isAllDayEvent)
								}
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
						<div
							className="downArrow"
							onClick={() =>
								updateCreateEventInfo('showCategory', !info?.showCategory)
							}
						>
							<DownSvg
								style={{
									transform: info?.showCategory ? `rotate(180deg)` : `rotate(0)`,
								}}
							/>
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
					<div className="attendeeInputWrapper">
						<input
							type="text"
							placeholder="Add attendee"
							onBlur={() => updateCreateEventInfo('showInputSuggestions', false)}
							onFocus={() => updateCreateEventInfo('showInputSuggestions', true)}
							value={info?.attendeesInputField}
							onChange={(e) =>
								updateCreateEventInfo('attendeesInputField', e.target.value)
							}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									addAttendees({ email: info?.attendeesInputField });
									updateCreateEventInfo('showInputSuggestions', false);
								}
							}}
						/>
						{info?.showInputSuggestions ? (
							<div className="addAttendeeDropDown">
								{info?.inputDropDownItems
									?.filter((item) => !item?.isOwner)
									?.map((item) => (
										<div
											className="dropDownList"
											key={item?._id}
											onMouseDown={() => {
												addAttendees({
													name: item?.firstName,
													email: item?.email,
													tenantUserId: item?._id,
													isWorkspaceUser: true,
												});
											}}
										>
											<div className="avatar"></div>
											<div className="details">
												<div className="name">{`${item?.firstName} ${item?.lastName}`}</div>
												<div className="email">{item?.email}</div>
											</div>
										</div>
									))}
							</div>
						) : (
							''
						)}
					</div>
					<div className="attendeesList">
						<div className="attendeesDetails">
							<div className="avatar"></div>
							<div className="nameWrapper">
								<span className="name">Avinash</span>
								<span className="role">Organzer</span>
							</div>
						</div>
						{info?.attendeesList
							? info?.attendeesList.map((item, index) => (
									<div className="attendeesDetails" key={index}>
										<div className="avatar"></div>
										{item?.isWorkspaceUser ? (
											<div className="nameWrapper">
												<span className="name">{item?.name}</span>
												<span className="role">{item?.email}</span>
											</div>
										) : (
											<div className="nameWrapper">
												<span className="name">{item?.email}</span>
											</div>
										)}
										<VerticalDots />
									</div>
							  ))
							: ''}
					</div>
				</div>
			</div>
			<button className="addToCalendar">Add to calendar</button>
		</div>
	);
};

export default memo(CreateEvent);
