import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import CreatableSelect from 'react-select/creatable';
import Modal from '../../modals/index.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import CloseButton from '../../svgs/addEventModal/Close.jsx';
import CalendarSvg from '../../svgs/addEventModal/Calendersvg.jsx';
import RemoveIcon from '../actions/delete.jsx';
import Pencil from '../../svgs/pencil.svg';

const timeJSON = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'];

class FormEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			client: props.client,
			showModal: false,
			events: props.blocks?.find((block) => block.type === 'events')?.events || [],
			name: '',
			nameReactSelect: null,
			date: '',
			time: '',
			location: '',
			noOfGuests: '',
			addEventError: false,
			addEventArrMessage: '',
			eventNameFocused: false,
			dateFocused: false,
			calenderStartdate: new Date(),
			editEventData: null,
			eventsJSON: [
				{
					value: 0,
					label: 'Wedding',
				},
				{
					value: 1,
					label: 'Engagement',
				},
				{
					value: 2,
					label: 'Reception',
				},
				{
					value: 3,
					label: 'Pellikoduku',
				},
				{
					value: 4,
					label: 'Mehendi',
				},
				{
					value: 5,
					label: 'Mehendi - Bride',
				},
				{
					value: 6,
					label: 'Mehendi - Groom',
				},
				{
					value: 7,
					label: 'Sangeeth',
				},
				{
					value: 8,
					label: 'Haldi',
				},
				{
					value: 9,
					label: 'Haldi - Bride',
				},
				{
					value: 10,
					label: 'Haldi - Groom',
				},
				{
					value: 11,
					label: 'Vratham',
				},
				{
					value: 12,
					label: 'Vratham - Bride',
				},
				{
					value: 13,
					label: 'Vratham - Groom',
				},
				{
					value: 14,
					label: 'Couple Shoot',
				},
				{
					value: 15,
					label: 'Bride Ceremony',
				},
				{
					value: 16,
					label: 'Groom Ceremony ',
				},
				{
					value: 17,
					label: 'Cocktail Party',
				},
				{
					value: 18,
					label: 'Mangalasnanam',
				},
				{
					value: 19,
					label: 'Pooja',
				},
				{
					value: 20,
					label: 'Pooja - Bride',
				},
				{
					value: 21,
					label: 'Pooja - Groom',
				},
				{
					value: 22,
					label: 'Pradhanam',
				},
				{
					value: 23,
					label: 'Lagnapatrika',
				},
				{
					value: 24,
					label: 'Pasupu',
				},
				{
					value: 25,
					label: 'Nalugu',
				},
				{
					value: 26,
					label: 'Nalugu - Bride',
				},
				{
					value: 27,
					label: 'Nalugu - Groom',
				},
				{
					value: 28,
					label: 'Upanayanam',
				},
				{
					value: 29,
					label: 'Bridal Shower',
				},
				{
					value: 30,
					label: 'Varapooja',
				},
				{
					value: 31,
					label: 'Shagun',
				},
				{
					value: 32,
					label: 'Baraath',
				},
				{
					value: 33,
					label: 'Edhurukollu',
				},
				{
					value: 34,
					label: 'Beegara Oota',
				},
				{
					value: 35,
					label: 'Pellikuthuru',
				},
				{
					value: 36,
					label: 'Reception Bride',
				},
				{
					value: 37,
					label: 'Reception Groom',
				},
				{
					value: 38,
					label: 'Muhurtham',
				},
				{ value: 39, label: 'Muhurat' },
			],
		};
		this.datePickerRef = React.createRef();
	}

	toggleShowModal = () => {
		if (this.state.client) {
			this.setState({ showModal: true });
		}
	};

	closeModal = () => {
		this.setState({
			showModal: false,
			name: '',
			nameReactSelect: null,
			date: '',
			time: '',
			location: '',
			noOfGuests: '',
			addEventError: false,
			addEventArrMessage: '',
			eventNameFocused: false,
			dateFocused: false,
			editEventData: null,
		});
	};

	onInputChange = (e, name) => {
		const value =
			name === 'date'
				? moment(e).format('YYYYMMDD') === 'Invalid date'
					? ''
					: moment(e).format('YYYYMMDD')
				: name === 'nameReactSelect'
				? e
				: e.target.value;

		if (this.state.editEventData) {
			this.setState((prevState) => ({
				editEventData: {
					...prevState.editEventData,
					[name]: value,
				},
				addEventError: false,
				addEventArrMessage: '',
			}));
		} else {
			this.setState({
				[name]: value,
				addEventError: false,
				addEventArrMessage: '',
			});
		}
	};

	handleChangeEvent = (e) => {
		if (e == null) {
			if (this.state.editEventData) {
				this.setState((prevState) => ({
					editEventData: { ...prevState.editEventData, name: '', nameReactSelect: null },
				}));
			} else {
				this.setState({ name: '', nameReactSelect: null });
			}
		} else {
			if (e.__isNew__) {
				this.setState((prevState) => ({
					eventsJSON: [
						...prevState.eventsJSON,
						{ value: prevState.eventsJSON.length, label: e.label, isAdded: true },
					],
				}));
			}
			if (this.state.editEventData) {
				this.setState((prevState) => ({
					editEventData: {
						...prevState.editEventData,
						name: e.label,
						nameReactSelect: e,
					},
					addEventError: false,
					addEventArrMessage: '',
				}));
			} else {
				this.setState({
					name: e.label,
					nameReactSelect: e,
					addEventError: false,
					addEventArrMessage: '',
				});
			}
		}
	};

	handleAddEvent = () => {
		const { events } = this.state;
		const nameToCheck = this.state.editEventData
			? this.state.editEventData.name
			: this.state.name;

		if (!nameToCheck?.length) {
			this.setState({
				addEventError: true,
				addEventArrMessage: 'Event Name required',
				eventNameFocused: true,
			});
			return;
		}

		const isDuplicate = events.some((event) => {
			if (this.state.editEventData && event.name === this.state.editEventData.originalName) {
				return false;
			}
			return event.name?.toLowerCase() === nameToCheck?.toLowerCase();
		});

		if (isDuplicate) {
			this.setState({
				addEventError: true,
				addEventArrMessage: 'Event already exists',
				eventNameFocused: true,
			});
			return;
		}

		if (this.state.editEventData) {
			const updatedEvents = events.map((event) => {
				if (event.name === this.state.editEventData.originalName) {
					return {
						name: this.state.editEventData.name,
						nameReactSelect: this.state.editEventData.nameReactSelect,
						date: this.state.editEventData.date,
						time: this.state.editEventData.time,
						location: this.state.editEventData.location,
						noOfGuests: this.state.editEventData.noOfGuests,
					};
				}
				return event;
			});

			this.setState(
				{
					events: updatedEvents,
					showModal: false,
					editEventData: null,
					name: '',
					nameReactSelect: null,
					date: '',
					time: '',
					location: '',
					noOfGuests: '',
				},
				() => {
					this.props.onAnswerChange(updatedEvents);
				},
			);
		} else {
			const newEvent = {
				name: this.state.name,
				nameReactSelect: this.state.nameReactSelect,
				date: this.state.date,
				time: this.state.time,
				location: this.state.location,
				noOfGuests: this.state.noOfGuests,
			};

			const newEvents = [...events, newEvent];
			this.setState(
				{
					events: newEvents,
					showModal: false,
					name: '',
					nameReactSelect: null,
					date: '',
					time: '',
					location: '',
					noOfGuests: '',
				},
				() => {
					this.props.onAnswerChange(newEvents);
				},
			);
		}
	};

	handleEditEvent = (index) => {
		const eventToEdit = this.state.events[index];
		this.setState({
			showModal: true,
			editEventData: { ...eventToEdit, originalName: eventToEdit.name },
		});
	};

	handleDeleteEvent = (index) => {
		const updatedEvents = this.state.events.filter((_, i) => i !== index);

		this.setState({ events: updatedEvents }, () => {
			this.props.onAnswerChange(updatedEvents);
		});
	};
	render() {
		return (
			<>
				<button
					className="add-events-button"
					onClick={this.toggleShowModal}
					style={{
						position: 'absolute',
						padding: '12px 24px',
						fontSize: '16px',
						fontWeight: '500',
						color: '#FFFFFF',
						backgroundColor: this.props?.buttonProps?.btStyles?.background || '#333',
						border: 'none',
						borderRadius: '8px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						margin: '10px 0',
						marginTop: '-85px',
					}}
				>
					<span>+</span>
					Add Events
				</button>

				{this.state.events.length > 0 && (
					<table
						style={{
							width: '100%',
							marginTop: '20px',
							borderCollapse: 'collapse',
						}}
						className="eventsTable"
					>
						<thead>
							<tr>
								<th style={{ color: '#333' }}>Event Name</th>
								<th style={{ color: '#333' }}>Date</th>
								<th style={{ color: '#333' }}>Time</th>
								<th style={{ color: '#333' }}>Location</th>
								<th style={{ color: '#333' }}>No of Guests</th>
								<th style={{ color: '#333' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.events.map((event, index) => (
								<tr key={index} style={{ border: '1px solid #ccc' }}>
									<td style={{ color: '#333', padding: '8px' }}>{event.name}</td>
									<td style={{ color: '#333', padding: '8px' }}>
										{event.date
											? moment(event.date, 'YYYYMMDD').format('DD/MM/YYYY')
											: ''}
									</td>
									<td style={{ color: '#333', padding: '8px' }}>
										{event.time || ''}
									</td>
									<td style={{ color: '#333', padding: '8px' }}>
										{event.location || ''}
									</td>
									<td style={{ color: '#333', padding: '8px' }}>
										{event.noOfGuests || ''}
									</td>
									<td
										style={{
											display: 'flex',
											gap: '10px',
											padding: '8px',
										}}
									>
										{/* <img
											src={Pencil}
											alt="Edit"
											style={{
												cursor: 'pointer',
												width: '20px',
												height: '20px',
											}}
											onClick={() => this.handleEditEvent(index)}
										/> */}
										<div
											onClick={() => this.handleEditEvent(index)}
											style={{ cursor: 'pointer', display: 'inline-flex' }}
										>
											<Pencil width="20" height="20" />
										</div>

										<div
											onClick={() => this.handleDeleteEvent(index)}
											style={{ cursor: 'pointer', display: 'inline-flex' }}
										>
											<RemoveIcon width="20" height="20" />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<Modal
					show={this.state.showModal}
					handleClose={this.closeModal}
					isEventModal={true}
				>
					<div className="eventsModalContainer">
						<div className="addEventParentWrapper">
							<div
								className="closebutton"
								onClick={this.closeModal}
								style={{ cursor: 'pointer' }}
							>
								<CloseButton />
							</div>

							<div className="addEventWrapper">
								<div className="addEventText">
									{this.state.editEventData ? 'Edit Event' : 'Add Event'}
								</div>

								<div className="eventFrameParent">
									<div className="eventField">
										<div
											className={`floating-label ${
												this.state.addEventError ? 'error-label' : ''
											}`}
										>
											<CreatableSelect
												className="floating-select floating-select-no-padding"
												classNamePrefix="select"
												value={
													this.state.editEventData
														? this.state.editEventData.nameReactSelect
														: this.state.nameReactSelect
												}
												onChange={this.handleChangeEvent}
												isClearable={true}
												options={this.state.eventsJSON}
												placeholder=""
												onFocus={() =>
													this.setState({ eventNameFocused: true })
												}
											/>
											<span className="highlight"></span>
											<label
												className={
													this.state.eventNameFocused ||
													(this.state.editEventData &&
														this.state.editEventData.name) ||
													this.state.name
														? 'label'
														: ''
												}
											>
												{this.state.addEventError === false
													? 'Event Name*'
													: this.state.addEventArrMessage}
											</label>
										</div>

										<div className="floating-label">
											{(this.state.editEventData?.date ||
												this.state.date) && (
												<span
													onClick={() =>
														this.state.editEventData
															? this.setState({
																	editEventData: {
																		...this.state.editEventData,
																		date: '',
																	},
																	dateFocused: false,
															  })
															: this.setState({
																	date: '',
																	dateFocused: false,
															  })
													}
													className="clearDate"
												>
													<RemoveIcon />
												</span>
											)}
											<DatePicker
												value={
													this.state.editEventData?.date
														? moment(
																this.state.editEventData.date,
																'YYYYMMDD',
														  ).format('DD/MM/YYYY')
														: this.state.date
														? moment(
																this.state.date,
																'YYYYMMDD',
														  ).format('DD/MM/YYYY')
														: ''
												}
												ref={this.datePickerRef}
												selected={this.state.calenderStartdate}
												onSelect={(e) => {
													this.onInputChange(e, 'date');
													this.setState({
														calenderStartdate: new Date(e),
													});
												}}
												dateFormat="dd/MM/yyyy"
												onFocus={() => {
													this.setState({ dateFocused: true });
													this.datePickerRef.current?.setOpen(true);
												}}
												onBlur={() => this.setState({ dateFocused: false })}
												className="floating-select"
												onKeyDown={(e) => e.preventDefault()}
												showPopperArrow={false}
												popperPlacement="bottom"
												customInput={
													<input
														type="button"
														style={{
															textAlign: 'left',
															paddingLeft: '12px',
															width: '100%',
														}}
													/>
												}
												popperModifiers={{
													preventOverflow: {
														enabled: true,
														escapeWithReference: false,
														boundariesElement: 'viewport',
													},
												}}
											/>
											<span className="calendarsvgIcon">
												<CalendarSvg
													onClick={() =>
														this.datePickerRef.current?.setOpen(true)
													}
												/>
											</span>
											<span className="highlight"></span>
											<label
												className={
													this.state.dateFocused ||
													(this.state.editEventData &&
														this.state.editEventData.date) ||
													this.state.date
														? 'label'
														: ''
												}
											>
												Date
											</label>
										</div>

										<div className="floating-label">
											<select
												className="floating-select select-one"
												value={
													this.state.editEventData
														? this.state.editEventData.time
														: this.state.time
												}
												onChange={(e) => this.onInputChange(e, 'time')}
											>
												<option value="" disabled></option>
												{timeJSON.map((time, key) => (
													<option value={time} key={key}>
														{time}
													</option>
												))}
											</select>
											<span className="highlight"></span>
											<label>Time</label>
											{(this.state.editEventData?.time ||
												this.state.time) && (
												<b
													style={{
														position: 'absolute',
														right: '-29px',
														top: '6px',
													}}
													onClick={() =>
														this.state.editEventData
															? this.setState({
																	editEventData: {
																		...this.state.editEventData,
																		time: '',
																	},
															  })
															: this.setState({ time: '' })
													}
												>
													<RemoveIcon />
												</b>
											)}
										</div>

										<div className="floating-label">
											<input
												className="floating-input"
												type="text"
												value={
													this.state.editEventData
														? this.state.editEventData.location
														: this.state.location
												}
												placeholder=""
												onChange={(e) => this.onInputChange(e, 'location')}
											/>
											<span className="highlight"></span>
											<label>Location</label>
										</div>

										<div className="floating-label">
											<input
												className="floating-input"
												type="text"
												value={
													this.state.editEventData
														? this.state.editEventData.noOfGuests
														: this.state.noOfGuests
												}
												placeholder=""
												onChange={(e) =>
													this.onInputChange(e, 'noOfGuests')
												}
											/>
											<span className="highlight"></span>
											<label>Number of guests</label>
										</div>
									</div>

									<div className="eventButton" onClick={this.handleAddEvent}>
										{this.state.editEventData ? 'Update' : 'Add'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			</>
		);
	}
}

export default FormEvent;
